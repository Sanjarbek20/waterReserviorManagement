import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import FarmerManagement from "./admin/farmer-management";
import SendNotifications from "./admin/send-notifications";

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState("dashboard");
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Admin Panel</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Admin Menu</CardTitle>
              <CardDescription>Manage your system</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-2">
                <Button 
                  variant={activeTab === "dashboard" ? "default" : "outline"} 
                  onClick={() => setActiveTab("dashboard")}
                  className="justify-start"
                >
                  Dashboard
                </Button>
                <Button 
                  variant={activeTab === "farmers" ? "default" : "outline"} 
                  onClick={() => setActiveTab("farmers")}
                  className="justify-start"
                >
                  Farmer Management
                </Button>
                <Button 
                  variant={activeTab === "notifications" ? "default" : "outline"} 
                  onClick={() => setActiveTab("notifications")}
                  className="justify-start"
                >
                  Notifications
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="mt-4">
            <CardHeader>
              <CardTitle>Admin Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <span className="font-semibold">Username:</span> admin_admin
                </div>
                <div>
                  <span className="font-semibold">Role:</span> Administrator
                </div>
                <div>
                  <span className="font-semibold">Status:</span> 
                  <span className="inline-flex items-center ml-2 rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                    Active
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Main Content */}
        <div className="lg:col-span-3">
          {activeTab === "dashboard" && (
            <Card>
              <CardHeader>
                <CardTitle>Dashboard</CardTitle>
                <CardDescription>System overview and statistics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-primary/10 rounded-lg p-4">
                    <h3 className="font-semibold text-sm text-muted-foreground">Total Users</h3>
                    <p className="text-2xl font-bold">25</p>
                  </div>
                  <div className="bg-primary/10 rounded-lg p-4">
                    <h3 className="font-semibold text-sm text-muted-foreground">Active Farmers</h3>
                    <p className="text-2xl font-bold">18</p>
                  </div>
                  <div className="bg-primary/10 rounded-lg p-4">
                    <h3 className="font-semibold text-sm text-muted-foreground">Pending Requests</h3>
                    <p className="text-2xl font-bold">7</p>
                  </div>
                </div>
                
                <div className="mt-8">
                  <h3 className="font-semibold mb-4">Recent Activity</h3>
                  <div className="space-y-4">
                    <div className="flex items-center p-3 bg-muted rounded-lg">
                      <div className="ml-4">
                        <p className="text-sm font-medium">New water allocation approved</p>
                        <p className="text-xs text-muted-foreground">2 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-center p-3 bg-muted rounded-lg">
                      <div className="ml-4">
                        <p className="text-sm font-medium">Reservoir level updated</p>
                        <p className="text-xs text-muted-foreground">5 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-center p-3 bg-muted rounded-lg">
                      <div className="ml-4">
                        <p className="text-sm font-medium">New farmer registered</p>
                        <p className="text-xs text-muted-foreground">Yesterday</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          
          {activeTab === "farmers" && <FarmerManagement />}
          {activeTab === "notifications" && <SendNotifications />}
        </div>
      </div>
    </div>
  );
}