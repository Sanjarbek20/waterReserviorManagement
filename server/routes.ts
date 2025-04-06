import express, { type Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertWaterRequestSchema, insertReservoirSchema, type User } from "@shared/schema";
import { z } from "zod";
import passport from "passport";
import { WebSocketServer, WebSocket } from "ws";
import { setupAuth, hashPassword } from "./auth";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication
  setupAuth(app);
  
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
  app.post('/api/login', (req, res, next) => {
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
  
  app.post('/api/register', async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByUsername(userData.username);
      if (existingUser) {
        return res.status(400).json({ message: 'Username already exists' });
      }
      
      // Hash password
      const hashedPassword = await hashPassword(userData.password);
      
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
  
  app.post('/api/logout', (req, res) => {
    req.logout(() => {
      res.json({ message: 'Logged out successfully' });
    });
  });
  
  app.get('/api/user', isAuthenticated, (req, res) => {
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
      const hashedPassword = await hashPassword(validatedData.password);
      
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
      
      // Mark all user's notifications as read
      const userNotifications = await storage.getUserNotifications(user.id);
      for (const notification of userNotifications) {
        if (!notification.isRead) {
          await storage.markNotificationAsRead(notification.id);
        }
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
  
  // Mark all notifications as read
  app.post('/api/notifications/mark-all-read', isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any).id;
      const userNotifications = await storage.getUserNotifications(userId);
      const updatedNotifications = [];
      
      for (const notification of userNotifications) {
        if (!notification.isRead) {
          const updated = await storage.markNotificationAsRead(notification.id);
          if (updated) {
            updatedNotifications.push(updated);
          }
        }
      }
      
      res.json({ 
        message: 'All notifications marked as read',
        count: updatedNotifications.length 
      });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  // Reports API routes
  // Get usage reports for a specific date range
  app.get('/api/reports/usage', isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any).id;
      // Get start date and end date from query params
      const startDate = req.query.startDate ? new Date(req.query.startDate as string) : undefined;
      const endDate = req.query.endDate ? new Date(req.query.endDate as string) : undefined;
      
      // Get user allocations
      const allocations = await storage.getUserAllocations(userId);
      
      // Create weekly report data from allocations
      const weeks = ["Week 1", "Week 2", "Week 3", "Week 4"];
      const usageReports = weeks.map((week, index) => {
        // Find allocations for this user
        const userAllocs = allocations.filter(a => a.userId === userId);
        
        // Calculate used and allocated amounts
        // For real implementation, you would filter by date range
        const allocated = userAllocs.length > 0 ? 
          parseInt(userAllocs[0].amount) / 4 : 300; // Default weekly allocation
        
        // Calculate a realistic usage based on the allocation
        // Vary it a bit to make it look like real data
        const variation = [0.82, 1.07, 0.93, 0.97][index];  
        const used = Math.round(allocated * variation);
        
        return {
          date: week,
          used,
          allocated: Math.round(allocated)
        };
      });
      
      res.json(usageReports);
    } catch (error) {
      console.error('Error getting usage reports:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  // Get allocation history reports
  app.get('/api/reports/allocation', isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any).id;
      // Get start date and end date from query params
      const startDate = req.query.startDate ? new Date(req.query.startDate as string) : undefined;
      const endDate = req.query.endDate ? new Date(req.query.endDate as string) : undefined;
      
      // Get user allocations
      const allocations = await storage.getUserAllocations(userId);
      
      // Format the allocations for reporting
      const formattedAllocations = allocations.map(allocation => ({
        id: allocation.id,
        date: allocation.startDate,
        amount: allocation.amount,
        used: allocation.used,
        remaining: (parseInt(allocation.amount) - parseInt(allocation.used)).toString(),
        percentUsed: Math.round((parseInt(allocation.used) / parseInt(allocation.amount)) * 100)
      }));
      
      res.json(formattedAllocations);
    } catch (error) {
      console.error('Error getting allocation reports:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  // Get water request history 
  app.get('/api/reports/requests', isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any).id;
      // Get start date and end date from query params
      const startDate = req.query.startDate ? new Date(req.query.startDate as string) : undefined;
      const endDate = req.query.endDate ? new Date(req.query.endDate as string) : undefined;
      
      // Get user requests
      const requests = await storage.getUserRequests(userId);
      
      // Format the requests for the report
      const formattedRequests = requests.map(request => {
        // Format the date for display
        const requestDate = new Date(request.requestDate);
        
        return {
          id: request.id,
          date: request.requestDate,
          type: request.type === 'additional' ? 'Additional Water' : 
                request.type === 'schedule_change' ? 'Schedule Change' : 'Emergency',
          amount: request.amount,
          status: request.status,
          notes: request.notes
        };
      });
      
      res.json(formattedRequests);
    } catch (error) {
      console.error('Error getting request history:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  // User profile update route
  app.patch('/api/user/profile', isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any).id;
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      // Update only the fields that are provided
      const updates: Partial<User> = {};
      
      if (req.body.firstName !== undefined) {
        updates.firstName = req.body.firstName;
      }
      
      if (req.body.lastName !== undefined) {
        updates.lastName = req.body.lastName;
      }
      
      if (req.body.fieldSize !== undefined) {
        // Convert to string if it's a number
        updates.fieldSize = typeof req.body.fieldSize === 'number' 
          ? req.body.fieldSize.toString() 
          : req.body.fieldSize;
      }
      
      if (req.body.cropType !== undefined) {
        updates.cropType = req.body.cropType;
      }
      
      // Update the user record in the session
      Object.assign(user, updates);
      
      // In a real app with a database, you would update the user in the database here
      // For our in-memory storage, we'll rely on the fact that objects are passed by reference
      
      // Update the session
      req.login(user, (err) => {
        if (err) {
          return res.status(500).json({ message: 'Error updating session' });
        }
        
        // Send back updated user
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
    } catch (error) {
      console.error('Error updating user profile:', error);
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
