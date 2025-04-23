import { Express, Request, Response } from "express";
import { MemStorage } from "../storage";
import { hashPassword, comparePasswords } from "../auth";
import { InsertUser } from "../../shared/schema";
import { z } from "zod";

const storage = new MemStorage();

// Check if admin_admin user exists and create if not
const initializeAdminUser = async () => {
  try {
    // Check if admin_admin user exists
    const adminUser = await storage.getUserByUsername("admin_admin");
    if (!adminUser) {
      console.log("Creating default admin user: admin_admin");
      const hashedPassword = await hashPassword("admin123");
      
      await storage.createUser({
        username: "admin_admin",
        password: hashedPassword,
        firstName: "Super",
        lastName: "Admin",
        role: "admin"
      });
    }
  } catch (error) {
    console.error("Error initializing admin user:", error);
  }
};

// Call this at server startup
initializeAdminUser();

// Login handler
export const loginHandler = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    const user = await storage.getUserByUsername(username);
    if (!user) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    const isPasswordValid = await comparePasswords(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    // Set user in session
    req.session.user = {
      id: user.id,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role
    };
    
    // Return user data without password
    const { password: _, ...userWithoutPassword } = user;
    return res.status(200).json(userWithoutPassword);
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Logout handler
export const logoutHandler = (req: Request, res: Response) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Error logging out" });
    }
    res.clearCookie("connect.sid");
    return res.status(200).json({ message: "Logged out successfully" });
  });
};

// Get current user handler
export const getCurrentUserHandler = (req: Request, res: Response) => {
  if (!req.session.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  return res.status(200).json(req.session.user);
};

// Create farmer user schema
const createFarmerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  cropType: z.string().optional(),
  fieldSize: z.number().optional()
});

// Register handler (admin can create any role, others can only create farmers)
export const registerHandler = async (req: Request, res: Response) => {
  try {
    // Only allow admin to create new users
    if (!req.session.user || req.session.user.role !== "admin") {
      return res.status(403).json({ message: "Only admins can create users" });
    }

    const { username, password, firstName, lastName, role, cropType, fieldSize } = req.body;

    // Check if username already exists
    const existingUser = await storage.getUserByUsername(username);
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // Create hashed password
    const hashedPassword = await hashPassword(password);

    const userData: InsertUser = {
      username,
      password: hashedPassword,
      firstName,
      lastName,
      role: role || "farmer", // Default to farmer
      cropType,
      fieldSize
    };

    // Create user
    const newUser = await storage.createUser(userData);

    // Remove password from response
    const { password: _, ...userWithoutPassword } = newUser;
    
    return res.status(201).json(userWithoutPassword);
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Register routes
export const registerAuthRoutes = (app: Express) => {
  app.post("/api/login", loginHandler);
  app.post("/api/logout", logoutHandler);
  app.get("/api/user", getCurrentUserHandler);
  app.post("/api/register", registerHandler);
};