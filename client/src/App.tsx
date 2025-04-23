import { Route, Switch } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "./components/ui/toaster";
import { useState } from "react";

// Admin pages
import AdminDashboard from "./pages/admin/dashboard";
import Reservoirs from "./pages/admin/reservoirs";
import ReservoirLiveMonitoring from "./pages/admin/reservoir-live-monitoring";
import Surveillance from "./pages/admin/surveillance";
import DataManagement from "./pages/admin/data-management";
import FarmerManagement from "./pages/admin/farmer-management";
import SendNotifications from "./pages/admin/send-notifications";

// Farmer pages
import FarmerDashboard from "./pages/farmer/dashboard";
import WaterRequests from "./pages/farmer/water-requests";
import WaterAllocation from "./pages/farmer/water-allocation";
import FarmerReports from "./pages/farmer/reports";

// Shared pages
import Login from "./pages/login";
import NotFound from "./pages/not-found";

// Components
import Header from "./components/header";
import Footer from "./components/footer";
import Sidebar from "./components/sidebar";
import { Button } from "./components/ui/button";
import { settings } from "./lib/settings";

// Context for language settings
import { LanguageContext } from "./context/language-context";

// Protected route component
import { ProtectedRoute } from "./lib/protected-route";

function App() {
  const [showSidebar, setShowSidebar] = useState(true);
  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };
  
  return (
    <div className="bg-background min-h-screen">
      <QueryClientProvider client={queryClient}>
        <div className="container mx-auto p-4">
          <h1 className="text-3xl font-bold mb-6">Water Reservoir Management System</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-card rounded-lg p-6 shadow-md">
              <h2 className="text-2xl font-semibold mb-4">Admin Panel Features Added</h2>
              <ul className="space-y-2 list-disc pl-6">
                <li>Default admin user (admin_admin/admin123)</li>
                <li>Farmer permission management system</li>
                <li>Notification system for administrators</li>
                <li>Role-based access control</li>
                <li>Two-tier admin structure (standard and data admins)</li>
              </ul>
              
              <h2 className="text-2xl font-semibold mt-6 mb-4">Implemented Admin Features</h2>
              <ul className="space-y-2 list-disc pl-6">
                <li>Farmer management page for administrators</li>
                <li>Notification sending capabilities</li>
                <li>Permission management for each farmer</li>
              </ul>
            </div>
            
            <div className="bg-card rounded-lg p-6 shadow-md">
              <h2 className="text-2xl font-semibold mb-4">User Types</h2>
              <div className="space-y-4">
                <div className="border border-border rounded-md p-4">
                  <h3 className="text-xl font-medium">Admin</h3>
                  <p className="text-sm text-muted-foreground">Full system access including user management, permissions, and notifications</p>
                </div>
                
                <div className="border border-border rounded-md p-4">
                  <h3 className="text-xl font-medium">Data Admin</h3>
                  <p className="text-sm text-muted-foreground">Limited administrative access focused on data management and notifications</p>
                </div>
                
                <div className="border border-border rounded-md p-4">
                  <h3 className="text-xl font-medium">Farmer</h3>
                  <p className="text-sm text-muted-foreground">Access to water requests, allocations and reports based on permissions</p>
                </div>
              </div>
              
              <div className="mt-8">
                <Button asChild size="lg" className="w-full">
                  <a href="/login">Go to Login</a>
                </Button>
              </div>
            </div>
          </div>
          
          <div className="mt-8 text-center text-sm text-muted-foreground">
            <p>Admin Panel Implementation Progress</p>
          </div>
        </div>
        <Toaster />
      </QueryClientProvider>
    </div>
  );
}

export default App;