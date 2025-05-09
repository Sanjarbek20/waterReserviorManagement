import { Pool } from "pg";
import { IStorage } from "./storage";
import {
  type User,
  type InsertUser,
  type Reservoir,
  type InsertReservoir,
  type WaterAllocation,
  type InsertWaterAllocation,
  type WaterRequest,
  type InsertWaterRequest,
  type Notification,
  type InsertNotification,
} from '@shared/schema';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || "postgresql://postgres:0320@localhost:5433/water",
});

export default pool;

export class PgStorage implements IStorage {

  // --- USERS ---  
  async getUser(id: number): Promise<User | undefined> {
    const res = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
    return res.rows[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const res = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
    return res.rows[0];
  }

  async getAllUsers(): Promise<User[]> {
    const res = await pool.query("SELECT * FROM users");
    return res.rows;
  }

  async createUser(user: InsertUser): Promise<User> {
    const res = await pool.query(
      `INSERT INTO users (username, password, first_name, last_name, role, field_size, crop_type, permissions, is_active)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [
        user.username,
        user.password,
        user.firstName,
        user.lastName,
        user.role,
        user.fieldSize ?? null,
        user.cropType ?? null,
        user.permissions ?? null,
        true
      ]
    );
    return res.rows[0];
  }

  async deleteUser(id: number): Promise<User | undefined> {
    const res = await pool.query("DELETE FROM users WHERE id = $1 RETURNING *", [id]);
    return res.rows[0];
  }

  // --- RESERVOIRS ---
  async getAllReservoirs(): Promise<Reservoir[]> {
    const res = await pool.query("SELECT * FROM reservoirs");
    return res.rows;
  }

  async getReservoir(id: number): Promise<Reservoir | undefined> {
    const res = await pool.query("SELECT * FROM reservoirs WHERE id = $1", [id]);
    return res.rows[0];
  }

  async createReservoir(r: InsertReservoir): Promise<Reservoir> {
    const res = await pool.query(
      `INSERT INTO reservoirs (name, capacity, current_level, location)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [r.name, r.capacity, r.currentLevel, r.location ?? null]
    );
    return res.rows[0];
  }

  async updateReservoirLevel(id: number, level: string): Promise<Reservoir | undefined> {
    const res = await pool.query(
      `UPDATE reservoirs SET current_level = $1, last_updated = NOW()
       WHERE id = $2 RETURNING *`,
      [level, id]
    );
    return res.rows[0];
  }

  async deleteReservoir(id: number): Promise<Reservoir | undefined> {
    const res = await pool.query("DELETE FROM reservoirs WHERE id = $1 RETURNING *", [id]);
    return res.rows[0];
  }

  // --- WATER ALLOCATIONS ---
  async getAllocations(): Promise<WaterAllocation[]> {
    const res = await pool.query("SELECT * FROM water_allocations");
    return res.rows;
  }

  async getAllocation(id: number): Promise<WaterAllocation | undefined> {
    const res = await pool.query("SELECT * FROM water_allocations WHERE id = $1", [id]);
    return res.rows[0];
  }

  async getUserAllocations(userId: number): Promise<WaterAllocation[]> {
    const res = await pool.query("SELECT * FROM water_allocations WHERE user_id = $1", [userId]);
    return res.rows;
  }

  async getAllocationsByReservoir(reservoirId: number): Promise<WaterAllocation[]> {
    const res = await pool.query("SELECT * FROM water_allocations WHERE reservoir_id = $1", [reservoirId]);
    return res.rows;
  }

  async createAllocation(a: InsertWaterAllocation): Promise<WaterAllocation> {
    const res = await pool.query(
      `INSERT INTO water_allocations (user_id, reservoir_id, used)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [a.userId, a.reservoirId, a.used]
    );
    return res.rows[0];
  }

  async updateAllocation(id: number, used: string): Promise<WaterAllocation | undefined> {
    const res = await pool.query(
      `UPDATE water_allocations SET used = $1 WHERE id = $2 RETURNING *`,
      [used, id]
    );
    return res.rows[0];
  }

  // --- WATER REQUESTS ---
  async getRequests(): Promise<WaterRequest[]> {
    const res = await pool.query("SELECT * FROM water_requests");
    return res.rows;
  }

  async getRequest(id: number): Promise<WaterRequest | undefined> {
    const res = await pool.query("SELECT * FROM water_requests WHERE id = $1", [id]);
    return res.rows[0];
  }

  async getUserRequests(userId: number): Promise<WaterRequest[]> {
    const res = await pool.query("SELECT * FROM water_requests WHERE user_id = $1", [userId]);
    return res.rows;
  }

  async createRequest(r: InsertWaterRequest): Promise<WaterRequest> {
    const res = await pool.query(
      `INSERT INTO water_requests (user_id, reservoir_id, amount, status, notes)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [r.userId, r.reservoirId, r.amount, r.status, r.notes]
    );
    return res.rows[0];
  }

  async updateRequestStatus(id: number, status: string, notes?: string): Promise<WaterRequest | undefined> {
    const res = await pool.query(
      `UPDATE water_requests SET status = $1, notes = $2, response_date = NOW()
       WHERE id = $3 RETURNING *`,
      [status, notes ?? null, id]
    );
    return res.rows[0];
  }

  // --- NOTIFICATIONS ---
  async getNotifications(): Promise<Notification[]> {
    const res = await pool.query("SELECT * FROM notifications");
    return res.rows;
  }

  async getUserNotifications(userId: number): Promise<Notification[]> {
    const res = await pool.query("SELECT * FROM notifications WHERE user_id = $1", [userId]);
    return res.rows;
  }

  async createNotification(n: InsertNotification): Promise<Notification> {
    const res = await pool.query(
      `INSERT INTO notifications (user_id, message)
       VALUES ($1, $2)
       RETURNING *`,
      [n.userId, n.message]
    );
    return res.rows[0];
  }

  async markNotificationAsRead(id: number): Promise<Notification | undefined> {
    const res = await pool.query(
      `UPDATE notifications SET is_read = TRUE WHERE id = $1 RETURNING *`,
      [id]
    );
    return res.rows[0];
  }
}








// export class PgStorage implements IStorage {
  
//   // --- USERS ---  
//   async getUser(id: number): Promise<User | undefined> {
//     const res = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
//     return res.rows[0];
//   }

//   async getUserByUsername(username: string): Promise<User | undefined> {
//     const res = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
//     return res.rows[0];
//   }

//   async getAllUsers(): Promise<User[]> {
//     const res = await pool.query("SELECT * FROM users");
//     return res.rows;
//   }

//   async createUser(user: InsertUser): Promise<User> {
//     const res = await pool.query(
//       `INSERT INTO users (username, password, first_name, last_name, role, field_size, crop_type, permissions, is_active)
//        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
//        RETURNING *`,
//       [
//         user.username,
//         user.password,
//         user.firstName,
//         user.lastName,
//         user.role,
//         user.fieldSize || null,
//         user.cropType || null,
//         user.permissions || null,
//         true
//       ]
//     );
//     return res.rows[0];
//   }

//   async deleteUser(id: number): Promise<User | undefined> {
//     const res = await pool.query("DELETE FROM users WHERE id = $1 RETURNING *", [id]);
//     return res.rows[0];
//   }

//   // --- RESERVOIRS ---
//   async getAllReservoirs(): Promise<Reservoir[]> {
//     const res = await pool.query("SELECT * FROM reservoirs");
//     return res.rows;
//   }

//   async getReservoir(id: number): Promise<Reservoir | undefined> {
//     const res = await pool.query("SELECT * FROM reservoirs WHERE id = $1", [id]);
//     return res.rows[0];
//   }

//   async createReservoir(r: InsertReservoir): Promise<Reservoir> {
//     const res = await pool.query(
//       `INSERT INTO reservoirs (name, capacity, current_level, location)
//        VALUES ($1, $2, $3, $4)
//        RETURNING *`,
//       [r.name, r.capacity, r.currentLevel, r.location || null]
//     );
//     return res.rows[0];
//   }

//   async updateReservoirLevel(id: number, level: string): Promise<Reservoir | undefined> {
//     const res = await pool.query(
//       `UPDATE reservoirs SET current_level = $1, last_updated = NOW()
//        WHERE id = $2 RETURNING *`,
//       [level, id]
//     );
//     return res.rows[0];
//   }

//   async deleteReservoir(id: number): Promise<Reservoir | undefined> {
//     const res = await pool.query("DELETE FROM reservoirs WHERE id = $1 RETURNING *", [id]);
//     return res.rows[0];
//   }

//   // --- WATER ALLOCATIONS ---
//   async getAllocations(): Promise<WaterAllocation[]> {
//     const res = await pool.query("SELECT * FROM water_allocations");
//     return res.rows;
//   }

//   async getAllocation(id: number): Promise<WaterAllocation | undefined> {
//     const res = await pool.query("SELECT * FROM water_allocations WHERE id = $1", [id]);
//     return res.rows[0];
//   }

//   async getUserAllocations(userId: number): Promise<WaterAllocation[]> {
//     const res = await pool.query("SELECT * FROM water_allocations WHERE user_id = $1", [userId]);
//     return res.rows;
//   }

//   async getAllocationsByReservoir(reservoirId: number): Promise<WaterAllocation[]> {
//     const res = await pool.query("SELECT * FROM water_allocations WHERE reservoir_id = $1", [reservoirId]);
//     return res.rows;
//   }

//   async createAllocation(a: InsertWaterAllocation): Promise<WaterAllocation> {
//     const res = await pool.query(
//       `INSERT INTO water_allocations (user_id, reservoir_id, used)
//        VALUES ($1, $2, $3, $4)
//        RETURNING *`,
//       [a.userId, a.reservoirId,  a.used]
//     );
//     return res.rows[0];
//   }

//   async updateAllocation(id: number, used: string): Promise<WaterAllocation | undefined> {
//     const res = await pool.query(
//       `UPDATE water_allocations SET used = $1 WHERE id = $2 RETURNING *`,
//       [used, id]
//     );
//     return res.rows[0];
//   }

//   // --- WATER REQUESTS ---
//   async getRequests(): Promise<WaterRequest[]> {
//     const res = await pool.query("SELECT * FROM water_requests");
//     return res.rows;
//   }

//   async getRequest(id: number): Promise<WaterRequest | undefined> {
//     const res = await pool.query("SELECT * FROM water_requests WHERE id = $1", [id]);
//     return res.rows[0];
//   }

//   async getUserRequests(userId: number): Promise<WaterRequest[]> {
//     const res = await pool.query("SELECT * FROM water_requests WHERE user_id = $1", [userId]);
//     return res.rows;
//   }

//   async createRequest(r: InsertWaterRequest): Promise<WaterRequest> {
//     const res = await pool.query(
//       `INSERT INTO water_requests (user_id, reservoir_id, amount, status, notes)
//        VALUES ($1, $2, $3, $4, $5)
//        RETURNING *`,
//       [r.userId, r.reservoirId, r.amount, r.status, r.notes]
//     );
//     return res.rows[0];
//   }

//   async updateRequestStatus(id: number, status: string, notes?: string): Promise<WaterRequest | undefined> {
//     const res = await pool.query(
//       `UPDATE water_requests SET status = $1, notes = $2, response_date = NOW()
//        WHERE id = $3 RETURNING *`,
//       [status, notes || null, id]
//     );
//     return res.rows[0];
//   }

//   // --- NOTIFICATIONS ---
//   async getNotifications(): Promise<Notification[]> {
//     const res = await pool.query("SELECT * FROM notifications");
//     return res.rows;
//   }

//   async getUserNotifications(userId: number): Promise<Notification[]> {
//     const res = await pool.query("SELECT * FROM notifications WHERE user_id = $1", [userId]);
//     return res.rows;
//   }

//   async createNotification(n: InsertNotification): Promise<Notification> {
//     const res = await pool.query(
//       `INSERT INTO notifications (user_id, message)
//        VALUES ($1, $2)
//        RETURNING *`,
//       [n.userId, n.message]
//     );
//     return res.rows[0];
//   }

//   async markNotificationAsRead(id: number): Promise<Notification | undefined> {
//     const res = await pool.query(
//       `UPDATE notifications SET is_read = TRUE WHERE id = $1 RETURNING *`,
//       [id]
//     );
//     return res.rows[0];
//   }
// }
