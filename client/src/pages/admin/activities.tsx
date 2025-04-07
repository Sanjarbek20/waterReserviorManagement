import React from "react";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, User, AlertTriangle } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

export default function ActivitiesPage() {
  // Sample activities data - would be fetched from API in production
  const activities = [
    {
      icon: <Settings className="h-4 w-4 text-blue-500" />,
      title: "Reservoir level automatically adjusted by 2%",
      time: "Today, 10:42 AM",
      bgColor: "bg-blue-100",
      description: "System adjusted water levels in Main Reservoir due to increased demand forecasts."
    },
    {
      icon: <User className="h-4 w-4 text-green-500" />,
      title: "New farmer request approved - Samuel Wilson",
      time: "Yesterday, 3:15 PM",
      bgColor: "bg-green-100",
      description: "Approved water allocation request for 1,500 m³ from East Basin for vegetable crops."
    },
    {
      icon: <AlertTriangle className="h-4 w-4 text-amber-500" />,
      title: "Low water pressure detected in North Basin",
      time: "Yesterday, 9:24 AM",
      bgColor: "bg-amber-100",
      description: "System detected pressure drop to 0.8 bar. Maintenance team has been notified."
    },
    {
      icon: <Settings className="h-4 w-4 text-blue-500" />,
      title: "System maintenance completed successfully",
      time: "Aug 10, 2023",
      bgColor: "bg-blue-100",
      description: "Routine maintenance of pumping station #3 completed. All systems operational."
    },
    {
      icon: <User className="h-4 w-4 text-green-500" />,
      title: "User permissions updated for Omar Hassan",
      time: "Aug 8, 2023",
      bgColor: "bg-green-100",
      description: "Changed permissions from 'farmer' to 'data_admin' role with expanded access rights."
    },
    {
      icon: <Settings className="h-4 w-4 text-blue-500" />,
      title: "Backup system test completed",
      time: "Aug 5, 2023",
      bgColor: "bg-blue-100",
      description: "Conducted failover test of emergency pumping systems. All systems responded within parameters."
    },
    {
      icon: <Settings className="h-4 w-4 text-blue-500" />,
      title: "Water analysis completed",
      time: "Aug 1, 2023",
      bgColor: "bg-blue-100",
      description: "Monthly water quality analysis completed. All parameters within acceptable ranges."
    },
    {
      icon: <AlertTriangle className="h-4 w-4 text-amber-500" />,
      title: "Temperature threshold alert",
      time: "Jul 29, 2023",
      bgColor: "bg-amber-100",
      description: "Reservoir water temperature reached 27°C, approaching critical threshold of 30°C."
    },
    {
      icon: <User className="h-4 w-4 text-green-500" />,
      title: "New user registered - Elena Petrova",
      time: "Jul 25, 2023",
      bgColor: "bg-green-100",
      description: "New farmer account created with standard permissions for wheat field irrigation."
    },
    {
      icon: <Settings className="h-4 w-4 text-blue-500" />,
      title: "System update applied",
      time: "Jul 20, 2023",
      bgColor: "bg-blue-100",
      description: "Applied v2.8.5 update to reservoir monitoring system. Improved sensor calibration."
    },
  ];

  return (
    <DashboardLayout title="System Activity Log">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent System Activity</CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              Filter
            </Button>
            <Button variant="outline" size="sm">
              Export
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {activities.map((activity, index) => (
              <div key={index}>
                <div className="flex items-start">
                  <div className={`w-10 h-10 rounded-full ${activity.bgColor} flex items-center justify-center mr-4`}>
                    {activity.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-medium text-gray-900">{activity.title}</h3>
                      <span className="text-sm text-gray-500">{activity.time}</span>
                    </div>
                    <p className="text-sm text-gray-600">{activity.description}</p>
                  </div>
                </div>
                {index < activities.length - 1 && <Separator className="my-4" />}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}