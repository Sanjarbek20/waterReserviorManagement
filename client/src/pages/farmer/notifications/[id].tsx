import React from "react";
import { useRoute } from "wouter";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Clock, Tag, MapPin, CheckCircle, AlertTriangle, Info } from "lucide-react";
import { useLocation } from "wouter";
import { Separator } from "@/components/ui/separator";

export default function NotificationDetailPage() {
  const [, params] = useRoute("/farmer/notifications/:id");
  const notificationId = params?.id;
  const [, setLocation] = useLocation();

  // In a real app, you would fetch the notification details from an API
  // based on the notificationId
  const notificationsData = {
    "1": {
      id: 1,
      title: "Water Schedule Updated",
      description: "Your irrigation schedule has been updated for next week.",
      detail: "Based on the current weather forecast and water levels in the Main Reservoir, your irrigation schedule has been optimized. You will now receive water on Monday, Wednesday, and Friday between 6:00 AM and 10:00 AM. This optimization aims to reduce water loss due to evaporation and ensure efficient resource utilization. Please ensure your irrigation equipment is operational during these times.",
      category: "Schedule",
      status: "Active",
      priority: "Normal",
      location: "Main Reservoir",
      date: "April 7, 2025",
      time: "8:32 AM",
      type: "info"
    },
    "2": {
      id: 2,
      title: "Conservation Alert",
      description: "Water conservation measures may be implemented starting next month.",
      detail: "Due to lower than average rainfall in the catchment area and reduced inflow into our reservoirs, we anticipate implementing water conservation measures starting May 1, 2025. These measures may include a 15% reduction in water allocations for all users. We recommend reviewing your irrigation practices and implementing water-saving techniques such as drip irrigation where possible. We will provide further details as the situation develops.",
      category: "Conservation",
      status: "Pending",
      priority: "High",
      location: "All Reservoirs",
      date: "April 6, 2025",
      time: "3:45 PM",
      type: "warning"
    },
    "3": {
      id: 3,
      title: "Additional Allocation Approved",
      description: "Your request for additional 500 m³ has been approved.",
      detail: "We are pleased to inform you that your request for an additional water allocation of 500 cubic meters has been approved. This additional water will be available from April 10, 2025, and must be used by April 30, 2025. Please note that this is a one-time additional allocation based on current reservoir levels and is subject to the standard usage fee. The water will be allocated from the East Basin reservoir.",
      category: "Allocation",
      status: "Approved",
      priority: "Normal",
      location: "East Basin",
      date: "April 2, 2025",
      time: "11:20 AM",
      type: "success"
    }
  };

  const notification = notificationsData[notificationId as keyof typeof notificationsData];
  
  if (!notification) {
    return (
      <DashboardLayout title="Notification Not Found">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertTriangle className="mx-auto h-12 w-12 text-amber-500" />
              <h2 className="mt-2 text-lg font-medium">Notification Not Found</h2>
              <p className="mt-1 text-sm text-gray-500">The notification you are looking for does not exist or has been removed.</p>
              <Button 
                className="mt-4" 
                variant="default"
                onClick={() => setLocation("/farmer/dashboard")}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Return to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Notification Details">
      <div className="mb-4">
        <Button 
          variant="outline" 
          onClick={() => setLocation("/farmer/dashboard")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">{notification.title}</CardTitle>
              <CardDescription>{notification.description}</CardDescription>
            </div>
            <Badge 
              variant={
                notification.type === "warning" 
                  ? "destructive" 
                  : notification.type === "success" 
                    ? "success" 
                    : "default"
              }
            >
              {notification.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">Details</h3>
              <p className="text-sm text-gray-700">{notification.detail}</p>
            </div>
            
            <Separator />
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="flex items-center text-sm">
                  <Calendar className="mr-2 h-4 w-4 text-gray-500" />
                  <span className="text-gray-500 font-medium">Date:</span>
                  <span className="ml-2">{notification.date}</span>
                </div>
              </div>
              <div>
                <div className="flex items-center text-sm">
                  <Clock className="mr-2 h-4 w-4 text-gray-500" />
                  <span className="text-gray-500 font-medium">Time:</span>
                  <span className="ml-2">{notification.time}</span>
                </div>
              </div>
              <div>
                <div className="flex items-center text-sm">
                  <Tag className="mr-2 h-4 w-4 text-gray-500" />
                  <span className="text-gray-500 font-medium">Category:</span>
                  <span className="ml-2">{notification.category}</span>
                </div>
              </div>
              <div>
                <div className="flex items-center text-sm">
                  <MapPin className="mr-2 h-4 w-4 text-gray-500" />
                  <span className="text-gray-500 font-medium">Location:</span>
                  <span className="ml-2">{notification.location}</span>
                </div>
              </div>
              <div>
                <div className="flex items-center text-sm">
                  {notification.priority === "High" ? (
                    <AlertTriangle className="mr-2 h-4 w-4 text-amber-500" />
                  ) : notification.priority === "Urgent" ? (
                    <AlertTriangle className="mr-2 h-4 w-4 text-red-500" />
                  ) : (
                    <Info className="mr-2 h-4 w-4 text-blue-500" />
                  )}
                  <span className="text-gray-500 font-medium">Priority:</span>
                  <span className="ml-2">{notification.priority}</span>
                </div>
              </div>
            </div>
            
            <Separator />
            
            <div className="flex justify-between">
              <Button variant="outline">Mark as Unread</Button>
              <Button>
                <CheckCircle className="mr-2 h-4 w-4" />
                Acknowledge
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}