import { useQuery } from "@tanstack/react-query";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { useAuth } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import WaterLevel from "@/components/ui/water-level";
import { format, addMonths } from "date-fns";
import { 
  SunIcon, 
  Droplet, 
  ThumbsUp,
  LightbulbIcon,
  CalendarIcon,
  RefreshCw,
  BarChart3,
  ChevronRight
} from "lucide-react";

export default function FarmerDashboard() {
  const { user } = useAuth();
  
  // Fetch allocations data
  const { data: allocations, isLoading: isLoadingAllocations } = useQuery({
    queryKey: ["/api/allocations"],
  });
  
  // Mock data for UI elements that would typically be fetched from API
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
      value: "Aug 15-25",
      description: "Plan your irrigation schedule accordingly"
    },
    {
      icon: <Droplet className="h-5 w-5 text-blue-500" />,
      title: "Reservoir Level Trend",
      value: "-3%",
      valueColor: "text-red-500",
      description: "Gradual decrease expected over next month"
    },
    {
      icon: <ThumbsUp className="h-5 w-5 text-green-500" />,
      title: "Allocation Sufficiency",
      value: "Good",
      valueColor: "text-green-500",
      description: "Current allocation should meet your needs"
    }
  ];

  return (
    <DashboardLayout title="Farmer Dashboard">
      {/* Water Allocation Status */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Your Water Allocation</CardTitle>
            <div className="text-sm font-medium text-blue-500">
              {user?.fieldSize} hectares
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row items-center">
            <div className="w-full md:w-1/3 p-4">
              <WaterLevel percentage={percentage} />
              <p className="text-center mt-2 text-sm text-gray-500">Current Allocation Used</p>
            </div>
            
            <div className="w-full md:w-2/3 p-4">
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
                <Button className="w-full">
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
            <div className="h-[200px] w-full bg-gray-100 rounded-lg flex items-center justify-center">
              <BarChart3 className="h-8 w-8 text-gray-400 mr-2" />
              <span className="text-gray-400">Usage chart will appear here</span>
            </div>
            <div className="mt-4 flex justify-end">
              <Button variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh Data
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
                  <span>Tip: Consider drip irrigation to optimize your water usage during the upcoming dry period.</span>
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
            <Button variant="link" size="sm" className="text-blue-500">
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
                  <tr className="border-b">
                    <td className="py-2 px-4 text-sm">Aug 10, 2023</td>
                    <td className="py-2 px-4 text-sm">Additional</td>
                    <td className="py-2 px-4 text-sm">500 m³</td>
                    <td className="py-2 px-4 text-sm">
                      <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">Approved</span>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 px-4 text-sm">Jul 24, 2023</td>
                    <td className="py-2 px-4 text-sm">Schedule Change</td>
                    <td className="py-2 px-4 text-sm">--</td>
                    <td className="py-2 px-4 text-sm">
                      <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">Approved</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 text-sm">Jun 15, 2023</td>
                    <td className="py-2 px-4 text-sm">Additional</td>
                    <td className="py-2 px-4 text-sm">300 m³</td>
                    <td className="py-2 px-4 text-sm">
                      <span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">Denied</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg">Notifications</CardTitle>
            <Button variant="link" size="sm" className="text-blue-500">
              Mark All Read
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
                  <Button variant="ghost" size="sm" className="h-7 px-2">
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
                  <Button variant="ghost" size="sm" className="h-7 px-2">
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
                    Aug 10, 2023
                  </p>
                  <Button variant="ghost" size="sm" className="h-7 px-2">
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
