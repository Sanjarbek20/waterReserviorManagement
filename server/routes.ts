import express, { type Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertWaterRequestSchema } from "@shared/schema";
import { z } from "zod";
import session from "express-session";
import MemoryStore from "memorystore";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcryptjs";

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
        
        // In a real app, we'd use bcrypt to compare passwords
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
  const isAuthenticated = (req: Request, res: Response, next: any) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.status(401).json({ message: 'Unauthorized' });
  };
  
  const isAdmin = (req: Request, res: Response, next: any) => {
    if (req.isAuthenticated() && req.user && (req.user as any).role === 'admin') {
      return next();
    }
    res.status(403).json({ message: 'Forbidden' });
  };
  
  // Auth routes
  app.post('/api/auth/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
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
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid data', errors: error.errors });
      }
      res.status(500).json({ message: 'Server error' });
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
  
  // Reservoir routes
  app.get('/api/reservoirs', isAuthenticated, async (req, res) => {
    try {
      const reservoirs = await storage.getAllReservoirs();
      res.json(reservoirs);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
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
      
      if (typeof level !== 'number' || level < 0) {
        return res.status(400).json({ message: 'Invalid level value' });
      }
      
      const updatedReservoir = await storage.updateReservoirLevel(id, level);
      
      if (!updatedReservoir) {
        return res.status(404).json({ message: 'Reservoir not found' });
      }
      
      res.json(updatedReservoir);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  // Water allocation routes
  app.get('/api/allocations', isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any).id;
      const role = (req.user as any).role;
      
      if (role === 'admin' && req.query.reservoirId) {
        const reservoirId = parseInt(req.query.reservoirId as string);
        const allocations = await storage.getAllocationsByReservoir(reservoirId);
        return res.json(allocations);
      } else {
        const allocations = await storage.getAllocations(userId);
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
      
      if (user.role === 'admin') {
        const requests = await storage.getAllRequests();
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
      
      // Validate request data
      const requestData = insertWaterRequestSchema.parse({
        ...req.body,
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
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid data', errors: error.errors });
      }
      res.status(500).json({ message: 'Server error' });
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
  return httpServer;
}
