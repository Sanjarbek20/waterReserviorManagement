import React, { useState } from "react";
import Sidebar from "./sidebar";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Menu, Bell, HelpCircle, CheckCheck } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Notification } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
}

export default function DashboardLayout({ children, title }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Fetch notifications
  const { data: notifications = [] } = useQuery<Notification[]>({
    queryKey: ["/api/notifications"],
    // Only fetch if user is authenticated
    enabled: !!user
  });
  
  // Mark all notifications as read mutation
  const markAllNotificationsReadMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/notifications/mark-all-read", {});
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/notifications"] });
      if (data.count > 0) {
        toast({
          title: "Notifications updated",
          description: `${data.count} notifications marked as read`
        });
      }
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Could not mark notifications as read"
      });
    }
  });
  
  const handleMarkAllRead = () => {
    markAllNotificationsReadMutation.mutate();
    setNotificationsOpen(false);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100 dark:bg-gray-900">
      {/* Mobile Nav Drawer Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden" 
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 bottom-0 w-64 bg-white dark:bg-gray-800 shadow-lg z-30 transform transition-transform duration-300 ease-in-out h-full
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0 lg:relative lg:z-0
      `}>
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen">
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
            <Popover open={notificationsOpen} onOpenChange={setNotificationsOpen}>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  {notifications && notifications.filter((n: Notification) => !n.isRead).length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                      {notifications.filter((n: Notification) => !n.isRead).length}
                    </span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-0" align="end">
                <div className="flex items-center justify-between p-4 border-b">
                  <h3 className="font-medium">Notifications</h3>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 text-xs flex items-center"
                    onClick={handleMarkAllRead}
                    disabled={markAllNotificationsReadMutation.isPending || !notifications.some(n => !n.isRead)}
                  >
                    <CheckCheck className="h-3.5 w-3.5 mr-1" />
                    Mark all read
                  </Button>
                </div>
                <ScrollArea className="h-[300px]">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-sm text-gray-500">
                      No notifications
                    </div>
                  ) : (
                    <div className="divide-y">
                      {notifications.map((notification) => (
                        <div 
                          key={notification.id}
                          className={`p-3 ${!notification.isRead ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}
                        >
                          <div className="flex justify-between items-start">
                            <h4 className="text-sm font-medium">{notification.title}</h4>
                            <p className="text-xs text-gray-500">
                              {format(new Date(notification.createdAt), 'MMM d, h:mm a')}
                            </p>
                          </div>
                          <p className="text-xs mt-1 text-gray-600 dark:text-gray-300">{notification.message}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </PopoverContent>
            </Popover>

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

        {/* Main Content - only this part should scroll */}
        <main className="flex-1 p-6 bg-gray-100 dark:bg-gray-900 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
