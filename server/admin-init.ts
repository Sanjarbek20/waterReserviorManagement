import { storage } from "./storage";
import { hashPassword } from "./auth";

/**
 * Initialize the admin user with predefined credentials
 * Username: admin_admin
 * Password: admin123
 */
export async function initAdminUser() {
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
      
      console.log("Default admin user created successfully");
    } else {
      console.log("Default admin user already exists");
    }
  } catch (error) {
    console.error("Error initializing admin user:", error);
  }
}