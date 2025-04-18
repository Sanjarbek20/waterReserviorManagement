import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { useAuth } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import WaterLevel from "@/components/ui/water-level";
import { format, addMonths } from "date-fns";
import { useTranslation } from "react-i18next";
import { 
  BarChart, 
  Bar,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ResponsiveContainer
} from "recharts";
import { 
  SunIcon, 
  Droplet, 
  ThumbsUp,
  LightbulbIcon,
  CalendarIcon,
  RefreshCw,
  ChevronRight
} from "lucide-react";

export default function FarmerDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isMarkingRead, setIsMarkingRead] = useState(false);
  const { t } = useTranslation();
  
  // Fetch allocations data
  const { data: allocations, isLoading: isLoadingAllocations, refetch: refetchAllocations } = useQuery({
    queryKey: ["/api/allocations"],
  });
  
  // Fetch user requests
  const { data: requests = [], refetch: refetchRequests } = useQuery({
    queryKey: ["/api/requests"],
  });
  
  // Handle refresh data button click
  const handleRefreshData = async () => {
    setIsRefreshing(true);
    try {
      await refetchAllocations();
      toast({
        title: "Data refreshed",
        description: "Usage data has been updated",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Refresh failed",
        description: "Could not refresh usage data",
      });
    } finally {
      setIsRefreshing(false);
    }
  };
  
  // Handle mark all notifications as read
  const handleMarkAllRead = async () => {
    setIsMarkingRead(true);
    try {
      // In a real app, we would call an API to mark notifications as read
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      toast({
        title: "Notifications marked as read",
        description: "All notifications have been marked as read",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Action failed",
        description: "Could not mark notifications as read. Please try again",
      });
    } finally {
      setIsMarkingRead(false);
    }
  };
  
  // Navigate to requests page
  const navigateToRequests = () => {
    setLocation("/farmer/requests");
  };
  
  // Fetch water requests data
  const { data: requestsData = [] } = useQuery<any[]>({
    queryKey: ["/api/requests"],
    enabled: !!user
  });

  // Allocation data (will be replaced with API data when available)
  const allocationData = {
    monthly: 4500,
    used: 2925,
    remaining: 1575,
    nextAllocationDate: addMonths(new Date(), 1)
  };
  
  const percentage = Math.round((allocationData.used / allocationData.monthly) * 100);
  
  // Weather forecast data
  const forecastData = [
    {
      icon: <SunIcon className="h-5 w-5 text-amber-500" />,
      title: "Expected Dry Period",
      value: "May 10-20",
      description: "Plan your irrigation schedule accordingly"
    },
    {
      icon: <Droplet className="h-5 w-5 text-blue-500" />,
      title: "Reservoir Level Trend",
      value: "+5%",
      valueColor: "text-green-500",
      description: "Increase expected due to spring rains"
    },
    {
      icon: <ThumbsUp className="h-5 w-5 text-green-500" />,
      title: "Allocation Sufficiency",
      value: "Excellent",
      valueColor: "text-green-500",
      description: "Allocation increased for growing season"
    }
  ];

  return (
    <DashboardLayout title={t("general.dashboard")}>
      {/* Water Allocation Status */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>{t("farmer.your_water_allocation")}</CardTitle>
            <div className="text-sm font-medium text-blue-500">
              {user?.fieldSize} {t("farmer.hectares")}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4">
            {/* New water allocation display */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="w-full md:w-1/2 space-y-2">
                <div className="space-y-1">
                  <h3 className="text-sm font-medium">{t("farmer.monthly_water_allocation")}</h3>
                  <div className="bg-gray-100 h-32 rounded-md relative overflow-hidden flex flex-col">
                    {/* Total Allocation */}
                    <div className="flex-1 bg-green-100 border-b border-gray-300 flex items-center justify-center relative">
                      <div className="text-center">
                        <span className="text-xl font-semibold text-green-700">{allocationData.monthly.toLocaleString()} m³</span>
                        <div className="text-xs text-green-600">Base Allocation</div>
                      </div>
                      {requests && Array.isArray(requests) && requests.some((req: any) => req.status === 'approved') && (
                        <div className="absolute bottom-0 left-0 right-0 bg-green-200 py-1.5 text-center border-t border-green-300">
                          <span className="text-sm font-medium text-green-700">
                            +{requests
                              .filter((req: any) => req.status === 'approved')
                              .reduce((sum: number, req: any) => sum + parseInt(req.amount || '0'), 0)
                              .toLocaleString()} m³ Additional
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="w-full md:w-1/2">
                <div className="space-y-1">
                  <h3 className="text-sm font-medium">{t("farmer.current_water_usage")}</h3>
                  <div className="bg-gray-100 h-32 rounded-md relative overflow-hidden">
                    <WaterLevel percentage={percentage} height="h-32" />
                    <div className="px-4 py-2 text-sm text-center border-t border-gray-200 absolute bottom-0 left-0 right-0 bg-white bg-opacity-70">
                      <span className="font-medium">{allocationData.used.toLocaleString()} m³</span> used of <span className="font-medium">{allocationData.monthly.toLocaleString()} m³</span> allocation
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Allocation details table */}
            <div className="bg-gray-50 rounded-md p-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Monthly Allocation:</span>
                  <span className="text-sm font-medium">{allocationData.monthly.toLocaleString()} m³</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Used This Month:</span>
                  <span className="text-sm font-medium">{allocationData.used.toLocaleString()} m³</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Remaining:</span>
                  <span className="text-sm font-medium text-blue-500">{allocationData.remaining.toLocaleString()} m³</span>
                </div>
                {requests && Array.isArray(requests) && requests.some((req: any) => req.status === 'approved') && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Additional Approved:</span>
                    <span className="text-sm font-medium text-green-600">
                      +{requests
                        .filter((req: any) => req.status === 'approved')
                        .reduce((sum: number, req: any) => sum + parseInt(req.amount || '0'), 0)
                        .toLocaleString()} m³
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Crop Type:</span>
                  <span className="text-sm font-medium capitalize">{user?.cropType || 'Not specified'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Next Allocation Date:</span>
                  <span className="text-sm font-medium">{format(allocationData.nextAllocationDate, 'MMM d, yyyy')}</span>
                </div>
              </div>
              
              <div className="mt-4">
                <Button 
                  className="w-full"
                  onClick={() => setLocation("/farmer/requests")}
                >
                  Request Additional Allocation
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Usage History & Forecast */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg">Usage History</CardTitle>
            <select className="text-sm border rounded px-2 py-1">
              <option>Last 6 Months</option>
              <option>Last Year</option>
              <option>All Time</option>
            </select>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    { month: 'Nov', used: 2100, allocated: 3000 },
                    { month: 'Dec', used: 1900, allocated: 3000 },
                    { month: 'Jan', used: 2200, allocated: 3000 },
                    { month: 'Feb', used: 2400, allocated: 3000 },
                    { month: 'Mar', used: 2600, allocated: 3000 },
                    { month: 'Apr', used: 1200, allocated: 3500 },
                  ]}
                  margin={{ top: 10, right: 5, left: -20, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => `${value.toLocaleString()} m³`} />
                  <Legend />
                  <Bar dataKey="used" name="Used" fill="#3b82f6" />
                  <Bar dataKey="allocated" name="Allocated" fill="#22c55e" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 flex justify-end">
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleRefreshData}
                disabled={isRefreshing}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                {isRefreshing ? 'Refreshing...' : 'Refresh Data'}
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg">Water Forecast</CardTitle>
            <div className="text-sm text-gray-500">Next 30 days</div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {forecastData.map((item, index) => (
                <div key={index} className="flex items-center">
                  {item.icon}
                  <div className="flex-1 ml-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-700">{item.title}</span>
                      <span className={`text-sm ${item.valueColor || 'text-gray-700'}`}>{item.value}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{item.description}</p>
                  </div>
                </div>
              ))}
              
              <div className="mt-4 p-3 bg-blue-50 rounded-md">
                <p className="text-sm text-blue-700 flex items-start">
                  <LightbulbIcon className="h-4 w-4 mr-2 mt-0.5" />
                  <span>Tip: Start preparing your irrigation systems now for the dry period forecasted for mid-May.</span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Request History & Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg">Recent Water Requests</CardTitle>
            <Button 
              variant="link" 
              size="sm" 
              className="text-blue-500"
              onClick={navigateToRequests}
            >
              View All
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-4 text-xs font-medium text-gray-500">Date</th>
                    <th className="text-left py-2 px-4 text-xs font-medium text-gray-500">Type</th>
                    <th className="text-left py-2 px-4 text-xs font-medium text-gray-500">Amount</th>
                    <th className="text-left py-2 px-4 text-xs font-medium text-gray-500">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {requestsData && requestsData.length > 0 ? (
                    requestsData.slice(0, 3).map((request: any) => (
                      <tr key={request.id} className="border-b">
                        <td className="py-2 px-4 text-sm">
                          {request.date 
                            ? format(new Date(request.date), 'MMM dd, yyyy')
                            : format(new Date(), 'MMM dd, yyyy')
                          }
                        </td>
                        <td className="py-2 px-4 text-sm">{request.type || 'Additional'}</td>
                        <td className="py-2 px-4 text-sm">
                          {request.amount ? `${request.amount} m³` : '--'}
                        </td>
                        <td className="py-2 px-4 text-sm">
                          {request.status === 'approved' ? (
                            <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                              Approved
                            </span>
                          ) : request.status === 'denied' ? (
                            <span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">
                              Denied
                            </span>
                          ) : request.status === 'pending' ? (
                            <span className="px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">
                              Pending
                            </span>
                          ) : (
                            <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">
                              {request.status || 'Unknown'}
                            </span>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="py-4 px-4 text-center text-sm text-gray-500">
                        No water requests found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg">Notifications</CardTitle>
            <Button 
              variant="link" 
              size="sm" 
              className="text-blue-500"
              onClick={handleMarkAllRead}
              disabled={isMarkingRead}
            >
              {isMarkingRead ? 'Marking...' : 'Mark All Read'}
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="border-l-4 border-blue-500 p-3 rounded bg-blue-50">
                <p className="text-sm font-medium text-gray-800">Water Schedule Updated</p>
                <p className="text-xs text-gray-500 mt-1">Your irrigation schedule has been updated for next week.</p>
                <div className="mt-2 flex justify-between items-center">
                  <p className="text-xs text-blue-500 flex items-center">
                    <CalendarIcon className="h-3 w-3 mr-1" />
                    Today, 8:32 AM
                  </p>
                  <Button variant="ghost" size="sm" className="h-7 px-2" onClick={() => window.location.href = "/farmer/notifications/1"}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="border-l-4 border-amber-500 p-3 rounded bg-amber-50">
                <p className="text-sm font-medium text-gray-800">Conservation Alert</p>
                <p className="text-xs text-gray-500 mt-1">Water conservation measures may be implemented starting next month.</p>
                <div className="mt-2 flex justify-between items-center">
                  <p className="text-xs text-blue-500 flex items-center">
                    <CalendarIcon className="h-3 w-3 mr-1" />
                    Yesterday, 3:45 PM
                  </p>
                  <Button variant="ghost" size="sm" className="h-7 px-2" onClick={() => window.location.href = "/farmer/notifications/2"}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="border-l-4 border-green-500 p-3 rounded bg-green-50">
                <p className="text-sm font-medium text-gray-800">Additional Allocation Approved</p>
                <p className="text-xs text-gray-500 mt-1">Your request for additional 500 m³ has been approved.</p>
                <div className="mt-2 flex justify-between items-center">
                  <p className="text-xs text-blue-500 flex items-center">
                    <CalendarIcon className="h-3 w-3 mr-1" />
                    Apr 02, 2025
                  </p>
                  <Button variant="ghost" size="sm" className="h-7 px-2" onClick={() => window.location.href = "/farmer/notifications/3"}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}