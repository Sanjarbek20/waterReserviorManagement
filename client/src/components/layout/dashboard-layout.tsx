import React, { useState } from "react";
import Sidebar from "./sidebar";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Menu, Bell, HelpCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Notification } from "@shared/schema";

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
}

export default function DashboardLayout({ children, title }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();
  
  // Fetch notifications
  const { data: notifications = [] } = useQuery<Notification[]>({
    queryKey: ["/api/notifications"],
    // Only fetch if user is authenticated
    enabled: !!user
  });

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Mobile Nav Drawer Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden" 
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-800 shadow-lg z-30 transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0 lg:relative lg:z-0
      `}>
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm py-4 px-6 flex items-center sticky top-0 z-10">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden mr-4"
            onClick={toggleSidebar}
          >
            <Menu className="h-5 w-5" />
          </Button>

          <div className="flex-1">
            <h1 className="text-xl font-medium text-neutral-800 dark:text-white">{title}</h1>
          </div>

          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {notifications && notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {notifications.filter((n: Notification) => !n.isRead).length}
                </span>
              )}
            </Button>

            <Button variant="ghost" size="icon">
              <HelpCircle className="h-5 w-5" />
            </Button>
            
            <ThemeToggle />

            <div className="lg:hidden">
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                {user && user.firstName && user.lastName 
                  ? `${user.firstName[0]}${user.lastName[0]}`
                  : "U"
                }
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-6 bg-gray-100 dark:bg-gray-900 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
