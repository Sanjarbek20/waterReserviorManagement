import React, { useState } from "react";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  AlertTriangle, 
  Info, 
  Droplet, 
  Check, 
  Trash, 
  Filter, 
  Bell 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

export default function NotificationsPage() {
  const { toast } = useToast();
  const [notifications, setNotifications] = useState({
    alerts: [
      {
        id: 1,
        type: "error",
        icon: <AlertTriangle className="h-4 w-4" />,
        title: "Critical: East Basin Valve Malfunction",
        description: "Maintenance required within 24 hours",
        time: "Today, 8:45 AM",
        isRead: false
      },
      {
        id: 2,
        type: "warning",
        icon: <Info className="h-4 w-4" />,
        title: "Warning: Forecast Predicts Drought Conditions",
        description: "Consider adjusting allocation rates",
        time: "Yesterday, 3:30 PM", 
        isRead: false
      },
      {
        id: 3,
        type: "info",
        icon: <Droplet className="h-4 w-4" />,
        title: "Info: Water Quality Test Scheduled",
        description: "Teams will sample all reservoirs on Friday",
        time: "Yesterday, 10:15 AM",
        isRead: true
      },
      {
        id: 4,
        type: "warning",
        icon: <AlertTriangle className="h-4 w-4" />,
        title: "Warning: South Basin Level Dropping",
        description: "Current level at 42%, below seasonal average",
        time: "Aug 9, 2023",
        isRead: true
      },
      {
        id: 5,
        type: "info",
        icon: <Info className="h-4 w-4" />,
        title: "Info: System Update Available",
        description: "New monitoring system update v2.8.6 is ready to install",
        time: "Aug 7, 2023",
        isRead: true
      }
    ],
    system: [
      {
        id: 6,
        type: "info",
        icon: <Info className="h-4 w-4" />,
        title: "System: Backup Completed",
        description: "Weekly system backup completed successfully",
        time: "Today, 3:00 AM",
        isRead: false
      },
      {
        id: 7,
        type: "info",
        icon: <Info className="h-4 w-4" />,
        title: "System: Monthly Report Generated",
        description: "July water usage report is ready for review",
        time: "Aug 1, 2023",
        isRead: true
      }
    ]
  });

  const handleMarkAsRead = (category: 'alerts' | 'system', id: number) => {
    setNotifications(prev => {
      const updated = {...prev};
      const index = updated[category].findIndex(item => item.id === id);
      if (index !== -1) {
        updated[category][index].isRead = true;
      }
      return updated;
    });

    toast({
      title: "Notification marked as read",
      description: "This notification has been marked as read",
    });
  };

  const handleDelete = (category: 'alerts' | 'system', id: number) => {
    setNotifications(prev => {
      const updated = {...prev};
      updated[category] = updated[category].filter(item => item.id !== id);
      return updated;
    });

    toast({
      title: "Notification deleted",
      description: "The notification has been removed",
    });
  };

  const handleMarkAllRead = (category: 'alerts' | 'system') => {
    setNotifications(prev => {
      const updated = {...prev};
      updated[category] = updated[category].map(item => ({...item, isRead: true}));
      return updated;
    });

    toast({
      title: "All notifications marked as read",
      description: `All ${category} notifications have been marked as read`,
    });
  };

  const handleClearAll = (category: 'alerts' | 'system') => {
    setNotifications(prev => {
      const updated = {...prev};
      updated[category] = [];
      return updated;
    });

    toast({
      title: "All notifications cleared",
      description: `All ${category} notifications have been removed`,
    });
  };

  const getUnreadCount = (category: 'alerts' | 'system') => {
    return notifications[category].filter(item => !item.isRead).length;
  };

  return (
    <DashboardLayout title="Notifications">
      <Tabs defaultValue="alerts">
        <div className="flex justify-between items-center mb-6">
          <TabsList>
            <TabsTrigger value="alerts" className="relative">
              Alerts
              {getUnreadCount('alerts') > 0 && (
                <Badge variant="destructive" className="ml-2 h-5 px-1.5">
                  {getUnreadCount('alerts')}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="system" className="relative">
              System
              {getUnreadCount('system') > 0 && (
                <Badge variant="destructive" className="ml-2 h-5 px-1.5">
                  {getUnreadCount('system')}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </div>

        <TabsContent value="alerts">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xl">Alert Notifications</CardTitle>
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleMarkAllRead('alerts')}
                  disabled={getUnreadCount('alerts') === 0}
                >
                  <Check className="h-4 w-4 mr-2" />
                  Mark All Read
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleClearAll('alerts')}
                  disabled={notifications.alerts.length === 0}
                >
                  <Trash className="h-4 w-4 mr-2" />
                  Clear All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {notifications.alerts.length === 0 ? (
                <div className="py-8 text-center">
                  <Bell className="mx-auto h-12 w-12 text-gray-300" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No notifications</h3>
                  <p className="mt-1 text-sm text-gray-500">You don't have any alert notifications at the moment.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {notifications.alerts.map((notification) => (
                    <div 
                      key={notification.id} 
                      className={`
                        border-l-4 p-4 rounded 
                        ${notification.type === 'error' 
                          ? 'bg-red-50 border-red-500' 
                          : notification.type === 'warning'
                            ? 'bg-amber-50 border-amber-500'
                            : 'bg-blue-50 border-blue-500'
                        }
                        ${!notification.isRead ? 'ring-2 ring-blue-100' : ''}
                      `}
                    >
                      <div className="flex justify-between">
                        <div className="flex">
                          <span className={`
                            mr-2
                            ${notification.type === 'error' 
                              ? 'text-red-500' 
                              : notification.type === 'warning'
                                ? 'text-amber-500'
                                : 'text-blue-500'
                            }
                          `}>
                            {notification.icon}
                          </span>
                          <div>
                            <div className="flex items-center">
                              <p className="text-sm font-medium text-gray-800">{notification.title}</p>
                              {!notification.isRead && (
                                <Badge variant="secondary" className="ml-2">New</Badge>
                              )}
                            </div>
                            <p className="text-xs text-gray-500 mt-1">{notification.description}</p>
                            <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                          </div>
                        </div>
                        <div className="flex space-x-1">
                          {!notification.isRead && (
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => handleMarkAsRead('alerts', notification.id)}
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                          )}
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => handleDelete('alerts', notification.id)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xl">System Notifications</CardTitle>
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleMarkAllRead('system')}
                  disabled={getUnreadCount('system') === 0}
                >
                  <Check className="h-4 w-4 mr-2" />
                  Mark All Read
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleClearAll('system')}
                  disabled={notifications.system.length === 0}
                >
                  <Trash className="h-4 w-4 mr-2" />
                  Clear All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {notifications.system.length === 0 ? (
                <div className="py-8 text-center">
                  <Bell className="mx-auto h-12 w-12 text-gray-300" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No notifications</h3>
                  <p className="mt-1 text-sm text-gray-500">You don't have any system notifications at the moment.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {notifications.system.map((notification) => (
                    <div 
                      key={notification.id} 
                      className={`
                        border-l-4 p-4 rounded 
                        ${notification.type === 'error' 
                          ? 'bg-red-50 border-red-500' 
                          : notification.type === 'warning'
                            ? 'bg-amber-50 border-amber-500'
                            : 'bg-blue-50 border-blue-500'
                        }
                        ${!notification.isRead ? 'ring-2 ring-blue-100' : ''}
                      `}
                    >
                      <div className="flex justify-between">
                        <div className="flex">
                          <span className={`
                            mr-2
                            ${notification.type === 'error' 
                              ? 'text-red-500' 
                              : notification.type === 'warning'
                                ? 'text-amber-500'
                                : 'text-blue-500'
                            }
                          `}>
                            {notification.icon}
                          </span>
                          <div>
                            <div className="flex items-center">
                              <p className="text-sm font-medium text-gray-800">{notification.title}</p>
                              {!notification.isRead && (
                                <Badge variant="secondary" className="ml-2">New</Badge>
                              )}
                            </div>
                            <p className="text-xs text-gray-500 mt-1">{notification.description}</p>
                            <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                          </div>
                        </div>
                        <div className="flex space-x-1">
                          {!notification.isRead && (
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="h-8 w-8 p-0"
                              onClick={() => handleMarkAsRead('system', notification.id)}
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                          )}
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => handleDelete('system', notification.id)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}