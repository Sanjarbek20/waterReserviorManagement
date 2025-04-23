import { pgTable, text, serial, integer, boolean, timestamp, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User model
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  role: text("role").notNull(),
  fieldSize: text("field_size"), // Changed from decimal to text to handle string conversion
  cropType: text("crop_type"),
  isActive: boolean("is_active").default(true).notNull(),
  permissions: text("permissions").array(),
  createdAt: timestamp("created_at").defaultNow(),
  lastLogin: timestamp("last_login"),
  loginIP: text("login_ip"),
  deviceInfo: text("device_info"),
});

// Roles model
export const roles = pgTable("roles", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Permissions model
export const permissions = pgTable("permissions", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description"),
  category: text("category").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Role Permissions model
export const rolePermissions = pgTable("role_permissions", {
  id: serial("id").primaryKey(),
  roleId: integer("role_id").references(() => roles.id, { onDelete: "cascade" }).notNull(),
  permissionId: integer("permission_id").references(() => permissions.id, { onDelete: "cascade" }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Audit logs
export const auditLogs = pgTable("audit_logs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  action: text("action").notNull(),
  details: text("details"),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Reservoir model
export const reservoirs = pgTable("reservoirs", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  capacity: text("capacity").notNull(),
  currentLevel: text("current_level").notNull(),
  location: text("location"),
  lastUpdated: timestamp("last_updated"),
});

// WaterAllocation model
export const waterAllocations = pgTable("water_allocations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  reservoirId: integer("reservoir_id").notNull(),
  amount: text("amount").notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  used: text("used").notNull(),
});

// WaterRequest model
export const waterRequests = pgTable("water_requests", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  type: text("type").notNull(),
  amount: text("amount"),
  status: text("status").notNull(),
  requestDate: timestamp("request_date").notNull(),
  responseDate: timestamp("response_date"),
  notes: text("notes"),
});

// Notification model
export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  title: text("title").notNull(),
  message: text("message").notNull(),
  isRead: boolean("is_read").notNull().default(false),
  createdAt: timestamp("created_at").notNull(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true, lastLogin: true });
export const insertReservoirSchema = createInsertSchema(reservoirs).omit({ id: true });
export const insertWaterAllocationSchema = createInsertSchema(waterAllocations).omit({ id: true });
export const insertWaterRequestSchema = createInsertSchema(waterRequests).omit({ id: true });
export const insertNotificationSchema = createInsertSchema(notifications).omit({ id: true });
export const insertRoleSchema = createInsertSchema(roles).omit({ id: true, createdAt: true, updatedAt: true });
export const insertPermissionSchema = createInsertSchema(permissions).omit({ id: true, createdAt: true });
export const insertRolePermissionSchema = createInsertSchema(rolePermissions).omit({ id: true, createdAt: true });
export const insertAuditLogSchema = createInsertSchema(auditLogs).omit({ id: true, createdAt: true });

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Reservoir = typeof reservoirs.$inferSelect;
export type InsertReservoir = z.infer<typeof insertReservoirSchema>;

export type WaterAllocation = typeof waterAllocations.$inferSelect;
export type InsertWaterAllocation = z.infer<typeof insertWaterAllocationSchema>;

export type WaterRequest = typeof waterRequests.$inferSelect;
export type InsertWaterRequest = z.infer<typeof insertWaterRequestSchema>;

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;

export type Role = typeof roles.$inferSelect;
export type InsertRole = z.infer<typeof insertRoleSchema>;

export type Permission = typeof permissions.$inferSelect;
export type InsertPermission = z.infer<typeof insertPermissionSchema>;

export type RolePermission = typeof rolePermissions.$inferSelect;
export type InsertRolePermission = z.infer<typeof insertRolePermissionSchema>;

export type AuditLog = typeof auditLogs.$inferSelect;
export type InsertAuditLog = z.infer<typeof insertAuditLogSchema>;
