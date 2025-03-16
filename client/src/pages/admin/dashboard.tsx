import { useQuery } from "@tanstack/react-query";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { Card, CardContent } from "@/components/ui/card";
import WaterLevel from "@/components/ui/water-level";
import { 
  Droplet, 
  TrendingDown, 
  Users, 
  ArrowUp, 
  ArrowDown,
  BarChart3,
  Settings,
  User,
  AlertTriangle,
  Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

export default function AdminDashboard() {
  // Fetch reservoirs data
  const { data: reservoirs, isLoading: isLoadingReservoirs } = useQuery({
    queryKey: ["/api/reservoirs"],
  });

  // Mock data for UI elements that would typically be fetched from API
  const summaryCards = [
    {
      title: "Total Capacity",
      value: "124,000",
      unit: "m³",
      icon: <Droplet className="h-5 w-5 text-blue-500" />,
      trend: "+3%",
      trendDirection: "up"
    },
    {
      title: "Current Level",
      value: "87,540",
      unit: "m³",
      icon: <Droplet className="h-5 w-5 text-blue-500" />,
      trend: "+5%",
      trendDirection: "up"
    },
    {
      title: "Daily Outflow",
      value: "2,845",
      unit: "m³/day",
      icon: <TrendingDown className="h-5 w-5 text-green-500" />,
      trend: "-1.2%",
      trendDirection: "down"
    },
    {
      title: "Active Farmers",
      value: "243",
      unit: "",
      icon: <Users className="h-5 w-5 text-green-500" />,
      trend: "+12",
      trendDirection: "up"
    }
  ];

  const waterAllocations = [
    { name: "Rice Fields", percentage: 45, color: "bg-blue-500" },
    { name: "Vegetable Farms", percentage: 30, color: "bg-green-500" },
    { name: "Wheat Fields", percentage: 15, color: "bg-sky-500" },
    { name: "Other Crops", percentage: 10, color: "bg-amber-500" }
  ];

  const activities = [
    {
      icon: <Settings className="h-4 w-4 text-blue-500" />,
      title: "Reservoir level automatically adjusted by 2%",
      time: "Today, 10:42 AM",
      bgColor: "bg-blue-100"
    },
    {
      icon: <User className="h-4 w-4 text-green-500" />,
      title: "New farmer request approved - Samuel Wilson",
      time: "Yesterday, 3:15 PM",
      bgColor: "bg-green-100"
    },
    {
      icon: <AlertTriangle className="h-4 w-4 text-amber-500" />,
      title: "Low water pressure detected in North Basin",
      time: "Yesterday, 9:24 AM",
      bgColor: "bg-amber-100"
    },
    {
      icon: <Settings className="h-4 w-4 text-blue-500" />,
      title: "System maintenance completed successfully",
      time: "Aug 10, 2023",
      bgColor: "bg-blue-100"
    }
  ];

  const alerts = [
    {
      type: "error",
      icon: <AlertTriangle className="h-4 w-4" />,
      title: "Critical: East Basin Valve Malfunction",
      description: "Maintenance required within 24 hours"
    },
    {
      type: "warning",
      icon: <Info className="h-4 w-4" />,
      title: "Warning: Forecast Predicts Drought Conditions",
      description: "Consider adjusting allocation rates"
    },
    {
      type: "info",
      icon: <Droplet className="h-4 w-4" />,
      title: "Info: Water Quality Test Scheduled",
      description: "Teams will sample all reservoirs on Friday"
    }
  ];

  return (
    <DashboardLayout title="Admin Dashboard">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {summaryCards.map((card, index) => (
          <Card key={index}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <p className="text-gray-500 font-medium">{card.title}</p>
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  {card.icon}
                </div>
              </div>
              <h3 className="text-2xl font-semibold mt-2">
                {card.value} <span className="text-sm font-normal text-gray-500">{card.unit}</span>
              </h3>
              <p className={`text-xs flex items-center mt-1 ${
                card.trendDirection === "up" ? "text-green-500" : "text-red-500"
              }`}>
                {card.trendDirection === "up" ? 
                  <ArrowUp className="h-3 w-3 mr-1" /> : 
                  <ArrowDown className="h-3 w-3 mr-1" />
                }
                {card.trend} {card.trendDirection === "up" ? "increase" : "decrease"}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Reservoir Level & Allocation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="lg:col-span-2">
          <CardContent className="p-5">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-gray-800">Reservoir Status</h2>
              <div className="flex space-x-2">
                <Button variant="ghost" size="icon">
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="h-[200px] w-full bg-gray-100 rounded-lg mb-4">
              {/* This is where you would integrate a chart.js component */}
              <div className="h-full flex items-center justify-center text-gray-400">
                <BarChart3 className="h-8 w-8 mr-2" />
                <span>Water Level Chart</span>
              </div>
            </div>
            
            <div className="mt-4 grid grid-cols-3 gap-4">
              {reservoirs ? reservoirs.map((reservoir: any) => (
                <div key={reservoir.id} className="p-3 border rounded-md text-center">
                  <p className="text-sm font-medium text-gray-700">{reservoir.name}</p>
                  <div className="flex items-center justify-center mt-1">
                    <span className="text-xl font-semibold text-blue-500">
                      {Math.round((reservoir.currentLevel / reservoir.capacity) * 100)}%
                    </span>
                    {(reservoir.currentLevel / reservoir.capacity) > 0.7 ? (
                      <ArrowUp className="h-4 w-4 text-green-500 ml-1" />
                    ) : (
                      <ArrowDown className="h-4 w-4 text-amber-500 ml-1" />
                    )}
                  </div>
                </div>
              )) : (
                Array(3).fill(0).map((_, i) => (
                  <div key={i} className="p-3 border rounded-md text-center animate-pulse">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-6 w-12 bg-gray-200 rounded mx-auto"></div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-5">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-gray-800">Water Allocation</h2>
              <Button variant="ghost" size="icon">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-4">
              {waterAllocations.map((allocation, index) => (
                <div key={index}>
                  <div className="flex items-center">
                    <div className={`w-2 h-2 rounded-full ${allocation.color} mr-2`}></div>
                    <span className="text-sm text-gray-700">{allocation.name}</span>
                    <div className="ml-auto text-sm font-medium">{allocation.percentage}%</div>
                  </div>
                  <Progress 
                    value={allocation.percentage} 
                    className="h-2 mt-1"
                    indicatorClassName={allocation.color}
                  />
                </div>
              ))}
            </div>
            
            <div className="mt-6">
              <Button className="w-full">
                Adjust Allocation
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Recent Activity & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-5">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-gray-800">Recent Activity</h2>
              <Button variant="link" size="sm">View All</Button>
            </div>
            
            <div className="space-y-4">
              {activities.map((activity, index) => (
                <div key={index} className="flex items-start border-b pb-3 last:border-0">
                  <div className={`w-8 h-8 rounded-full ${activity.bgColor} flex items-center justify-center mr-3`}>
                    {activity.icon}
                  </div>
                  <div>
                    <p className="text-sm text-gray-700">{activity.title}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-5">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-gray-800">Alerts & Notifications</h2>
              <Button variant="link" size="sm">Clear All</Button>
            </div>
            
            <div className="space-y-3">
              {alerts.map((alert, index) => (
                <div 
                  key={index} 
                  className={`
                    border-l-4 p-3 rounded 
                    ${alert.type === 'error' 
                      ? 'bg-red-50 border-red-500' 
                      : alert.type === 'warning'
                        ? 'bg-amber-50 border-amber-500'
                        : 'bg-blue-50 border-blue-500'
                    }
                  `}
                >
                  <div className="flex">
                    <span className={`
                      mr-2
                      ${alert.type === 'error' 
                        ? 'text-red-500' 
                        : alert.type === 'warning'
                          ? 'text-amber-500'
                          : 'text-blue-500'
                      }
                    `}>
                      {alert.icon}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-gray-800">{alert.title}</p>
                      <p className="text-xs text-gray-500 mt-1">{alert.description}</p>
                    </div>
                  </div>
                </div>
              ))}
              
              <div className="mt-2 text-center">
                <Button variant="link" size="sm">
                  View All Notifications
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
