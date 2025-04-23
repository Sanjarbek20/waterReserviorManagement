import { Express, Request, Response } from "express";
import { MemStorage } from "../storage";

const storage = new MemStorage();

// In-memory storage for farmer permissions until added to database schema
const farmerPermissions: Record<number, Record<string, boolean>> = {};

// Default farmer permissions
const defaultPermissions = {
  "water_requests": true,
  "map_access": true,
  "reports": true,
  "water_allocation": true,
  "messaging": true,
  "settings": true
};

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

// Get permissions for a farmer
export const getPermissionsHandler = async (req: Request, res: Response) => {
  try {
    const farmerId = parseInt(req.params.farmerId);
    
    // Check if farmer exists
    const farmer = await storage.getUser(farmerId);
    if (!farmer) {
      return res.status(404).json({ message: "Farmer not found" });
    }
    
    // Check if farmer is actually a farmer
    if (farmer.role !== "farmer") {
      return res.status(400).json({ message: "User is not a farmer" });
    }
    
    // Return permissions or defaults if not set
    const permissions = farmerPermissions[farmerId] || { ...defaultPermissions };
    return res.status(200).json(permissions);
  } catch (error) {
    console.error("Error getting farmer permissions:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Update permissions for a farmer
export const updatePermissionsHandler = async (req: Request, res: Response) => {
  try {
    const farmerId = parseInt(req.params.farmerId);
    
    // Check if farmer exists
    const farmer = await storage.getUser(farmerId);
    if (!farmer) {
      return res.status(404).json({ message: "Farmer not found" });
    }
    
    // Check if farmer is actually a farmer
    if (farmer.role !== "farmer") {
      return res.status(400).json({ message: "User is not a farmer" });
    }
    
    // Update permissions
    farmerPermissions[farmerId] = req.body;
    
    return res.status(200).json({ 
      message: "Permissions updated successfully",
      permissions: farmerPermissions[farmerId]
    });
  } catch (error) {
    console.error("Error updating farmer permissions:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Register farmer permissions routes
export const registerFarmerPermissionsRoutes = (app: Express) => {
  app.get("/api/farmer-permissions/:farmerId", isAdmin, getPermissionsHandler);
  app.put("/api/farmer-permissions/:farmerId", isAdmin, updatePermissionsHandler);
};