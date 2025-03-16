import { 
  users, 
  reservoirs, 
  waterAllocations, 
  waterRequests, 
  notifications,
  type User, 
  type InsertUser,
  type Reservoir,
  type InsertReservoir,
  type WaterAllocation,
  type InsertWaterAllocation,
  type WaterRequest,
  type InsertWaterRequest,
  type Notification,
  type InsertNotification
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;
  createUser(user: InsertUser): Promise<User>;
  
  // Reservoir operations
  getAllReservoirs(): Promise<Reservoir[]>;
  getReservoir(id: number): Promise<Reservoir | undefined>;
  createReservoir(reservoir: InsertReservoir): Promise<Reservoir>;
  updateReservoirLevel(id: number, level: string): Promise<Reservoir | undefined>;
  
  // Water allocation operations
  getAllocations(): Promise<WaterAllocation[]>;
  getAllocation(id: number): Promise<WaterAllocation | undefined>;
  getUserAllocations(userId: number): Promise<WaterAllocation[]>;
  getAllocationsByReservoir(reservoirId: number): Promise<WaterAllocation[]>;
  createAllocation(allocation: InsertWaterAllocation): Promise<WaterAllocation>;
  updateAllocation(id: number, used: string): Promise<WaterAllocation | undefined>;
  
  // Water request operations
  getRequests(): Promise<WaterRequest[]>;
  getRequest(id: number): Promise<WaterRequest | undefined>;
  getUserRequests(userId: number): Promise<WaterRequest[]>;
  createRequest(request: InsertWaterRequest): Promise<WaterRequest>;
  updateRequestStatus(id: number, status: string, notes?: string): Promise<WaterRequest | undefined>;
  
  // Notification operations
  getNotifications(): Promise<Notification[]>;
  getUserNotifications(userId: number): Promise<Notification[]>;
  createNotification(notification: InsertNotification): Promise<Notification>;
  markNotificationAsRead(id: number): Promise<Notification | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private reservoirs: Map<number, Reservoir>;
  private waterAllocations: Map<number, WaterAllocation>;
  private waterRequests: Map<number, WaterRequest>;
  private notifications: Map<number, Notification>;
  
  private userIdCounter: number;
  private reservoirIdCounter: number;
  private allocationIdCounter: number;
  private requestIdCounter: number;
  private notificationIdCounter: number;
  
  constructor() {
    this.users = new Map();
    this.reservoirs = new Map();
    this.waterAllocations = new Map();
    this.waterRequests = new Map();
    this.notifications = new Map();
    
    this.userIdCounter = 1;
    this.reservoirIdCounter = 1;
    this.allocationIdCounter = 1;
    this.requestIdCounter = 1;
    this.notificationIdCounter = 1;
    
    this.initializeData();
  }
  
  private initializeData() {
    // Create some initial users
    this.createUser({
      username: "admin",
      password: "$2a$10$wqvKVn/fP5KUVdE9NYSZ0eKRyyJO8GVYCbXCeGjVm8I5M8dG5nRsC", // admin123
      firstName: "Admin",
      lastName: "User",
      role: "admin"
    });
    
    this.createUser({
      username: "data_admin",
      password: "$2a$10$XlwAIBCxKUEBSzZJm1NuIuMJ9ZvKvHP3E8kJdY1i0/ky2XnvZsibK", // data123
      firstName: "Data",
      lastName: "Manager",
      role: "data_admin"
    });
    
    this.createUser({
      username: "farmer1",
      password: "$2a$10$2EkpEyJQDp7M/6Bt/vyoMugc6TGkYcpU9eMEzR8TZdZeUaBiGivOO", // farmer123
      firstName: "John",
      lastName: "Doe",
      role: "farmer",
      fieldSize: "50",
      cropType: "Wheat"
    });
    
    // Create some initial reservoirs
    this.createReservoir({
      name: "Main Reservoir",
      capacity: "1000000",
      currentLevel: "750000",
      location: "North Valley"
    });
    
    this.createReservoir({
      name: "East Reservoir",
      capacity: "500000",
      currentLevel: "300000",
      location: "East Region"
    });
  }
  
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }
  
  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user: User = { 
      ...insertUser, 
      id,
      fieldSize: insertUser.fieldSize || null,
      cropType: insertUser.cropType || null
    };
    this.users.set(id, user);
    return user;
  }
  
  // Reservoir operations
  async getAllReservoirs(): Promise<Reservoir[]> {
    return Array.from(this.reservoirs.values());
  }
  
  async getReservoir(id: number): Promise<Reservoir | undefined> {
    return this.reservoirs.get(id);
  }
  
  async createReservoir(insertReservoir: InsertReservoir): Promise<Reservoir> {
    const id = this.reservoirIdCounter++;
    const reservoir: Reservoir = { 
      ...insertReservoir, 
      id,
      location: insertReservoir.location || null,
      lastUpdated: new Date()
    };
    this.reservoirs.set(id, reservoir);
    return reservoir;
  }
  
  async updateReservoirLevel(id: number, level: string): Promise<Reservoir | undefined> {
    const reservoir = await this.getReservoir(id);
    if (!reservoir) return undefined;
    
    const updated: Reservoir = {
      ...reservoir,
      currentLevel: level,
      lastUpdated: new Date()
    };
    
    this.reservoirs.set(id, updated);
    return updated;
  }
  
  // Water allocation operations
  async getAllocations(): Promise<WaterAllocation[]> {
    return Array.from(this.waterAllocations.values());
  }
  
  async getAllocation(id: number): Promise<WaterAllocation | undefined> {
    return this.waterAllocations.get(id);
  }
  
  async getUserAllocations(userId: number): Promise<WaterAllocation[]> {
    return Array.from(this.waterAllocations.values()).filter(
      allocation => allocation.userId === userId
    );
  }
  
  async getAllocationsByReservoir(reservoirId: number): Promise<WaterAllocation[]> {
    return Array.from(this.waterAllocations.values()).filter(
      allocation => allocation.reservoirId === reservoirId
    );
  }
  
  async createAllocation(insertAllocation: InsertWaterAllocation): Promise<WaterAllocation> {
    const id = this.allocationIdCounter++;
    const allocation: WaterAllocation = { ...insertAllocation, id };
    this.waterAllocations.set(id, allocation);
    return allocation;
  }
  
  async updateAllocation(id: number, usedAmount: string): Promise<WaterAllocation | undefined> {
    const allocation = await this.getAllocation(id);
    if (!allocation) return undefined;
    
    const updated: WaterAllocation = {
      ...allocation,
      used: usedAmount
    };
    
    this.waterAllocations.set(id, updated);
    return updated;
  }
  
  // Water request operations
  async getRequests(): Promise<WaterRequest[]> {
    return Array.from(this.waterRequests.values());
  }
  
  async getRequest(id: number): Promise<WaterRequest | undefined> {
    return this.waterRequests.get(id);
  }
  
  async getUserRequests(userId: number): Promise<WaterRequest[]> {
    return Array.from(this.waterRequests.values()).filter(
      request => request.userId === userId
    );
  }
  
  async createRequest(insertRequest: InsertWaterRequest): Promise<WaterRequest> {
    const id = this.requestIdCounter++;
    const request: WaterRequest = { 
      ...insertRequest, 
      id,
      amount: insertRequest.amount || null,
      requestDate: new Date(),
      responseDate: null,
      notes: insertRequest.notes || null
    };
    this.waterRequests.set(id, request);
    return request;
  }
  
  async updateRequestStatus(id: number, status: string, notes?: string): Promise<WaterRequest | undefined> {
    const request = await this.getRequest(id);
    if (!request) return undefined;
    
    const updated: WaterRequest = {
      ...request,
      status,
      notes: notes || request.notes,
      responseDate: new Date()
    };
    
    this.waterRequests.set(id, updated);
    return updated;
  }
  
  // Notification operations
  async getNotifications(): Promise<Notification[]> {
    return Array.from(this.notifications.values());
  }
  
  async getUserNotifications(userId: number): Promise<Notification[]> {
    return Array.from(this.notifications.values()).filter(
      notification => notification.userId === userId
    );
  }
  
  async createNotification(insertNotification: InsertNotification): Promise<Notification> {
    const id = this.notificationIdCounter++;
    const notification: Notification = { 
      ...insertNotification, 
      id,
      isRead: false,
      createdAt: new Date()
    };
    this.notifications.set(id, notification);
    return notification;
  }
  
  async markNotificationAsRead(id: number): Promise<Notification | undefined> {
    const notification = this.notifications.get(id);
    if (!notification) return undefined;
    
    const updated: Notification = {
      ...notification,
      isRead: true
    };
    
    this.notifications.set(id, updated);
    return updated;
  }
}

export const storage = new MemStorage();
