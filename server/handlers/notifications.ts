import { Express, Request, Response } from "express";
import { MemStorage } from "../storage";
import { InsertNotification } from "../../shared/schema";

const storage = new MemStorage();

// Middleware to check if user is admin
const isAdmin = (req: Request, res: Response, next: Function) => {
  if (!req.session.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  
  if (req.session.user.role !== "admin" && req.session.user.role !== "data_admin") {
    return res.status(403).json({ message: "Forbidden: Admin access required" });
  }
  
  next();
};

// Get all notifications
export const getAllNotificationsHandler = async (req: Request, res: Response) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    const notifications = await storage.getNotifications();
    
    return res.status(200).json(notifications);
  } catch (error) {
    console.error("Error getting notifications:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Get notifications for current user
export const getUserNotificationsHandler = async (req: Request, res: Response) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    const notifications = await storage.getUserNotifications(req.session.user.id);
    
    return res.status(200).json(notifications);
  } catch (error) {
    console.error("Error getting user notifications:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Create notification for a specific user
export const createNotificationHandler = async (req: Request, res: Response) => {
  try {
    // Check if the request is from an admin
    if (!req.session.user || (req.session.user.role !== "admin" && req.session.user.role !== "data_admin")) {
      return res.status(403).json({ message: "Forbidden: Admin access required" });
    }
    
    const { userId, message, type = "info" } = req.body;
    
    if (!userId || !message) {
      return res.status(400).json({ message: "User ID and message are required" });
    }
    
    // Check if user exists
    const user = await storage.getUser(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Create notification
    const notification: InsertNotification = {
      userId,
      title: type === "error" ? "Muhim xabar" : type === "warning" ? "Ogohlantirish" : "Yangi xabar",
      message,
      type,
      isRead: false,
      createdAt: new Date().toISOString()
    };
    
    const newNotification = await storage.createNotification(notification);
    
    return res.status(201).json(newNotification);
  } catch (error) {
    console.error("Error creating notification:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Create bulk notifications for multiple users
export const createBulkNotificationsHandler = async (req: Request, res: Response) => {
  try {
    // Check if the request is from an admin
    if (!req.session.user || (req.session.user.role !== "admin" && req.session.user.role !== "data_admin")) {
      return res.status(403).json({ message: "Forbidden: Admin access required" });
    }
    
    const { recipients, title, message, type = "info" } = req.body;
    
    if (!recipients || !message) {
      return res.status(400).json({ message: "Recipients and message are required" });
    }
    
    // Get list of user IDs based on recipients
    let userIds: number[] = [];
    
    if (Array.isArray(recipients)) {
      // Direct list of user IDs
      userIds = recipients;
    } else if (recipients === "all") {
      // All users
      const users = await storage.getAllUsers();
      userIds = users.map(user => user.id);
    } else if (recipients === "farmers") {
      // All farmers
      const users = await storage.getAllUsers();
      userIds = users.filter(user => user.role === "farmer").map(user => user.id);
    } else if (recipients === "admins") {
      // All admins
      const users = await storage.getAllUsers();
      userIds = users.filter(user => user.role === "admin" || user.role === "data_admin").map(user => user.id);
    } else {
      return res.status(400).json({ message: "Invalid recipients format" });
    }
    
    // Create notifications for each user
    const notificationPromises = userIds.map(userId => {
      const notification: InsertNotification = {
        userId,
        title: title || (type === "error" ? "Muhim xabar" : type === "warning" ? "Ogohlantirish" : "Yangi xabar"),
        message,
        type,
        isRead: false,
        createdAt: new Date().toISOString()
      };
      
      return storage.createNotification(notification);
    });
    
    // Wait for all notifications to be created
    const notifications = await Promise.all(notificationPromises);
    
    return res.status(201).json({
      message: `${notifications.length} notifications created successfully`,
      count: notifications.length
    });
  } catch (error) {
    console.error("Error creating bulk notifications:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Mark notification as read
export const markNotificationAsReadHandler = async (req: Request, res: Response) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    const notificationId = parseInt(req.params.id);
    
    // Check if notification exists
    const notification = await storage.markNotificationAsRead(notificationId);
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }
    
    return res.status(200).json(notification);
  } catch (error) {
    console.error("Error marking notification as read:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Register notification routes
export const registerNotificationRoutes = (app: Express) => {
  app.get("/api/notifications", getAllNotificationsHandler);
  app.get("/api/notifications/user", getUserNotificationsHandler);
  app.post("/api/notifications", isAdmin, createNotificationHandler);
  app.post("/api/notifications/bulk", isAdmin, createBulkNotificationsHandler);
  app.put("/api/notifications/:id/read", markNotificationAsReadHandler);
};