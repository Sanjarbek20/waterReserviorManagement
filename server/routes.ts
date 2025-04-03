import express, { type Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertWaterRequestSchema, insertReservoirSchema } from "@shared/schema";
import { z } from "zod";
import session from "express-session";
import MemoryStore from "memorystore";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcryptjs";
import { WebSocketServer, WebSocket } from "ws";

const SessionStore = MemoryStore(session);

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup session
  app.use(session({
    secret: process.env.SESSION_SECRET || "water-management-secret",
    resave: false,
    saveUninitialized: false,
    store: new SessionStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    }),
    cookie: {
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  }));

  // Setup passport
  app.use(passport.initialize());
  app.use(passport.session());
  
  // Configure passport local strategy
  passport.use(new LocalStrategy(
    {
      usernameField: 'username',
      passwordField: 'password'
    },
    async (username, password, done) => {
      try {
        const user = await storage.getUserByUsername(username);
        if (!user) {
          return done(null, false, { message: 'Invalid username or password' });
        }
        
        // Compare passwords
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
          return done(null, false, { message: 'Invalid username or password' });
        }
        
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  ));
  
  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });
  
  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });
  
  // Auth middleware
  const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.status(401).json({ message: 'Unauthorized' });
  };
  
  const isAdmin = (req: Request, res: Response, next: NextFunction) => {
    if (req.isAuthenticated() && req.user && (req.user as any).role === 'admin') {
      return next();
    }
    res.status(403).json({ message: 'Forbidden' });
  };
  
  const isAdminOrDataAdmin = (req: Request, res: Response, next: NextFunction) => {
    if (req.isAuthenticated() && req.user && 
       ((req.user as any).role === 'admin' || (req.user as any).role === 'data_admin')) {
      return next();
    }
    res.status(403).json({ message: 'Forbidden' });
  };
  
  // Handle ZodError consistently
  const handleZodError = (error: any, res: Response) => {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        message: 'Invalid data', 
        errors: error.errors.map(err => ({
          code: err.code,
          message: err.message,
          path: err.path
        }))
      });
    }
    console.error('Server error:', error);
    return res.status(500).json({ message: 'Server error' });
  };
  
  // Auth routes
  app.post('/api/auth/login', (req, res, next) => {
    passport.authenticate('local', (err: any, user: any, info: any) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.status(400).json({ message: info.message });
      }
      req.logIn(user, (err) => {
        if (err) {
          return next(err);
        }
        return res.json({
          id: user.id,
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          fieldSize: user.fieldSize,
          cropType: user.cropType
        });
      });
    })(req, res, next);
  });
  
  app.post('/api/auth/register', async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByUsername(userData.username);
      if (existingUser) {
        return res.status(400).json({ message: 'Username already exists' });
      }
      
      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      
      // Create user with hashed password
      const user = await storage.createUser({
        ...userData,
        password: hashedPassword
      });
      
      // Automatically log in the user
      req.logIn(user, (err) => {
        if (err) {
          return res.status(500).json({ message: 'Error during login' });
        }
        return res.status(201).json({
          id: user.id,
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          fieldSize: user.fieldSize,
          cropType: user.cropType
        });
      });
    } catch (error) {
      return handleZodError(error, res);
    }
  });
  
  app.post('/api/auth/logout', (req, res) => {
    req.logout(() => {
      res.json({ message: 'Logged out successfully' });
    });
  });
  
  app.get('/api/auth/me', isAuthenticated, (req, res) => {
    const user = req.user as any;
    res.json({
      id: user.id,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      fieldSize: user.fieldSize,
      cropType: user.cropType
    });
  });
  
  // User routes
  app.get('/api/users', isAdmin, async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      const safeUsers = users.map(user => ({
        id: user.id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        fieldSize: user.fieldSize,
        cropType: user.cropType
      }));
      res.json(safeUsers);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  app.post('/api/users', isAdmin, async (req, res) => {
    try {
      let userData = { ...req.body };
      
      // Convert numbers to strings where needed
      if (userData.fieldSize && typeof userData.fieldSize === 'number') {
        userData.fieldSize = userData.fieldSize.toString();
      }
      
      const validatedData = insertUserSchema.parse(userData);
      
      // Check if user already exists
      const existingUser = await storage.getUserByUsername(validatedData.username);
      if (existingUser) {
        return res.status(400).json({ message: 'Username already exists' });
      }
      
      // Hash password
      const hashedPassword = await bcrypt.hash(validatedData.password, 10);
      
      // Create user with hashed password
      const user = await storage.createUser({
        ...validatedData,
        password: hashedPassword
      });
      
      return res.json({
        id: user.id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        fieldSize: user.fieldSize,
        cropType: user.cropType
      });
    } catch (error) {
      return handleZodError(error, res);
    }
  });
  
  // Reservoir routes
  app.get('/api/reservoirs', isAuthenticated, async (req, res) => {
    try {
      const reservoirs = await storage.getAllReservoirs();
      res.json(reservoirs);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  app.post('/api/reservoirs', isAdmin, async (req, res) => {
    try {
      // Convert number values to strings if they're numbers
      let reservoirData = { ...req.body };
      if (typeof reservoirData.capacity === 'number') {
        reservoirData.capacity = reservoirData.capacity.toString();
      }
      if (typeof reservoirData.currentLevel === 'number') {
        reservoirData.currentLevel = reservoirData.currentLevel.toString();
      }
      
      const createdReservoir = await storage.createReservoir({
        name: reservoirData.name,
        capacity: reservoirData.capacity,
        currentLevel: reservoirData.currentLevel,
        location: reservoirData.location,
        lastUpdated: new Date()
      });
      
      res.json(createdReservoir);
    } catch (error) {
      return handleZodError(error, res);
    }
  });
  
  app.get('/api/reservoirs/:id', isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const reservoir = await storage.getReservoir(id);
      
      if (!reservoir) {
        return res.status(404).json({ message: 'Reservoir not found' });
      }
      
      res.json(reservoir);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  app.patch('/api/reservoirs/:id/level', isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { level } = req.body;
      
      if (level === undefined || level === null || level === '') {
        return res.status(400).json({ message: 'Invalid level value' });
      }
      
      // Ensure level is stored as string
      const levelString = typeof level === 'number' ? level.toString() : level;
      
      const updatedReservoir = await storage.updateReservoirLevel(id, levelString);
      
      if (!updatedReservoir) {
        return res.status(404).json({ message: 'Reservoir not found' });
      }
      
      res.json(updatedReservoir);
    } catch (error) {
      console.error('Error updating reservoir level:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  // Water allocation routes
  app.get('/api/allocations', isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any).id;
      const role = (req.user as any).role;
      
      if ((role === 'admin' || role === 'data_admin') && req.query.reservoirId) {
        const reservoirId = parseInt(req.query.reservoirId as string);
        const allocations = await storage.getAllocationsByReservoir(reservoirId);
        return res.json(allocations);
      } else if (role === 'admin' || role === 'data_admin') {
        // Get all allocations for admins or data_admins
        const allocations = await storage.getAllocations();
        return res.json(allocations);
      } else {
        const allocations = await storage.getUserAllocations(userId);
        return res.json(allocations);
      }
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  // Water request routes
  app.get('/api/requests', isAuthenticated, async (req, res) => {
    try {
      const user = req.user as any;
      
      if (user.role === 'admin' || user.role === 'data_admin') {
        const requests = await storage.getRequests();
        return res.json(requests);
      } else {
        const requests = await storage.getUserRequests(user.id);
        return res.json(requests);
      }
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  app.post('/api/requests', isAuthenticated, async (req, res) => {
    try {
      const user = req.user as any;
      
      // Ensure amount is treated as a string
      let requestBody = { ...req.body };
      if (typeof requestBody.amount === 'number') {
        requestBody.amount = requestBody.amount.toString();
      }
      
      // Validate request data
      const requestData = insertWaterRequestSchema.parse({
        ...requestBody,
        userId: user.id,
        requestDate: new Date(),
        status: 'pending'
      });
      
      const request = await storage.createRequest(requestData);
      
      // Create notification for admins
      const admins = Array.from((await storage.getAllUsers()) || [])
        .filter(user => user.role === 'admin');
      
      for (const admin of admins) {
        await storage.createNotification({
          userId: admin.id,
          title: 'New Water Request',
          message: `User ${user.username} has requested ${request.amount || ''} ${request.type}`,
          isRead: false,
          createdAt: new Date()
        });
      }
      
      res.status(201).json(request);
    } catch (error) {
      return handleZodError(error, res);
    }
  });
  
  app.patch('/api/requests/:id/status', isAdmin, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status, notes } = req.body;
      
      if (!['approved', 'denied', 'pending'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status' });
      }
      
      const updatedRequest = await storage.updateRequestStatus(id, status, notes);
      
      if (!updatedRequest) {
        return res.status(404).json({ message: 'Request not found' });
      }
      
      // Create notification for the farmer
      await storage.createNotification({
        userId: updatedRequest.userId,
        title: `Water Request ${status.charAt(0).toUpperCase() + status.slice(1)}`,
        message: `Your ${updatedRequest.type} request has been ${status}${notes ? ': ' + notes : ''}`,
        isRead: false,
        createdAt: new Date()
      });
      
      res.json(updatedRequest);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  // Notification routes
  app.get('/api/notifications', isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any).id;
      const notifications = await storage.getUserNotifications(userId);
      res.json(notifications);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  app.patch('/api/notifications/:id/read', isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const notification = await storage.markNotificationAsRead(id);
      
      if (!notification) {
        return res.status(404).json({ message: 'Notification not found' });
      }
      
      // Check if the notification belongs to the user
      if (notification.userId !== (req.user as any).id) {
        return res.status(403).json({ message: 'Forbidden' });
      }
      
      res.json(notification);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });

  const httpServer = createServer(app);
  
  // Set up WebSocket server
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  
  // Connected clients for broadcasting
  const clients = new Set<WebSocket>();
  
  // Handle new WebSocket connections
  wss.on('connection', (ws) => {
    console.log('WebSocket client connected');
    
    // Add client to the set
    clients.add(ws);
    
    // Send initial reservoir data
    sendReservoirData(ws);
    
    // Handle messages from clients
    ws.on('message', (message) => {
      console.log('WebSocket message received:', message.toString());
      try {
        const parsedMessage = JSON.parse(message.toString());
        
        // Handle different message types
        if (parsedMessage.type === 'get_reservoirs') {
          sendReservoirData(ws);
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    });
    
    // Handle disconnection
    ws.on('close', () => {
      console.log('WebSocket client disconnected');
      clients.delete(ws);
    });
    
    // Handle errors
    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
      clients.delete(ws);
    });
  });
  
  // Function to send reservoir data to a specific client
  async function sendReservoirData(ws: WebSocket) {
    try {
      if (ws.readyState === WebSocket.OPEN) {
        const reservoirs = await storage.getAllReservoirs();
        const reservoirData = {
          type: 'reservoir_data',
          data: reservoirs
        };
        ws.send(JSON.stringify(reservoirData));
      }
    } catch (error) {
      console.error('Error sending reservoir data:', error);
    }
  }
  
  // Function to broadcast reservoir data to all connected clients
  async function broadcastReservoirData() {
    try {
      const reservoirs = await storage.getAllReservoirs();
      const reservoirData = {
        type: 'reservoir_data',
        data: reservoirs
      };
      
      const messageStr = JSON.stringify(reservoirData);
      
      clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(messageStr);
        }
      });
    } catch (error) {
      console.error('Error broadcasting reservoir data:', error);
    }
  }
  
  // Broadcast updates when reservoir data changes
  const originalCreateReservoir = storage.createReservoir.bind(storage);
  storage.createReservoir = async (data) => {
    const result = await originalCreateReservoir(data);
    broadcastReservoirData();
    return result;
  };
  
  const originalUpdateReservoirLevel = storage.updateReservoirLevel.bind(storage);
  storage.updateReservoirLevel = async (id, level) => {
    const result = await originalUpdateReservoirLevel(id, level);
    broadcastReservoirData();
    return result;
  };
  
  // Set up a timer to send regular updates (simulate real-time data)
  setInterval(() => {
    broadcastReservoirData();
  }, 10000); // Update every 10 seconds
  
  return httpServer;
}
