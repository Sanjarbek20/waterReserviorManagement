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
});

// Reservoir model
export const reservoirs = pgTable("reservoirs", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  capacity: decimal("capacity", { precision: 12, scale: 2 }).notNull(),
  currentLevel: decimal("current_level", { precision: 12, scale: 2 }).notNull(),
  lastUpdated: timestamp("last_updated").notNull(),
});

// WaterAllocation model
export const waterAllocations = pgTable("water_allocations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  reservoirId: integer("reservoir_id").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  used: decimal("used", { precision: 10, scale: 2 }).notNull(),
});

// WaterRequest model
export const waterRequests = pgTable("water_requests", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  type: text("type").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }),
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
export const insertUserSchema = createInsertSchema(users).omit({ id: true });
export const insertReservoirSchema = createInsertSchema(reservoirs).omit({ id: true });
export const insertWaterAllocationSchema = createInsertSchema(waterAllocations).omit({ id: true });
export const insertWaterRequestSchema = createInsertSchema(waterRequests).omit({ id: true });
export const insertNotificationSchema = createInsertSchema(notifications).omit({ id: true });

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
