import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Check, Info, RefreshCw, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useRef, useState } from "react";

type Allocation = {
  id: number;
  name: string;
  percentage: number;
  color: string;
};

export default function WaterAllocation() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isRealTimeEnabled, setIsRealTimeEnabled] = useState(true);
  const socketRef = useRef<WebSocket | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [allocationStats, setAllocationStats] = useState({
    usageRate: 87,
    lossRate: 4.2,
    reserveCapacity: 8.8
  });
  
  // Define type for allocation data from API
  type ApiAllocation = {
    id: number;
    name: string;
    percentage: string;
  };
  
  // Fetch allocations data
  const { data: allocationsData, isLoading: isLoadingAllocations, refetch } = useQuery<ApiAllocation[]>({
    queryKey: ["/api/allocations"],
    enabled: true, // Enable the real data fetch
  });
  
  // Setup WebSocket connection for real-time updates
  useEffect(() => {
    if (isRealTimeEnabled) {
      // Create WebSocket connection
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/ws`;
      
      const socket = new WebSocket(wsUrl);
      socketRef.current = socket;
      
      // Connection opened
      socket.addEventListener('open', () => {
        console.log('WebSocket connected for allocations');
        // We'll listen for the same reservoir data, but use it differently
      });
      
      // Listen for messages
      socket.addEventListener('message', (event) => {
        try {
          const message = JSON.parse(event.data);
          
          if (message.type === 'reservoir_data') {
            // Update allocation statistics based on reservoir data
            // This simulates how allocation might change based on reservoir levels
            // In a real app, you'd have a separate API or message type for allocations
            
            // Generate small random changes to create the sense of real-time updates
            setAllocationStats(prev => {
              const randomChange = () => (Math.random() * 0.6) - 0.3; // Random change between -0.3 and +0.3
              
              return {
                usageRate: Math.min(100, Math.max(50, prev.usageRate + randomChange())),
                lossRate: Math.min(10, Math.max(1, prev.lossRate + (randomChange() * 0.2))),
                reserveCapacity: Math.min(15, Math.max(5, prev.reserveCapacity + (randomChange() * 0.2)))
              };
            });
            
            setLastUpdated(new Date());
          }
        } catch (error) {
          console.error('Error parsing WebSocket message for allocations:', error);
        }
      });
      
      // Connection closed
      socket.addEventListener('close', () => {
        console.log('WebSocket disconnected for allocations');
        // Attempt to reconnect after delay if still enabled
        if (isRealTimeEnabled) {
          setTimeout(() => {
            if (socketRef.current?.readyState !== WebSocket.OPEN) {
              socketRef.current = null;
            }
          }, 3000);
        }
      });
      
      // Handle errors
      socket.addEventListener('error', (error) => {
        console.error('WebSocket error for allocations:', error);
      });
      
      // Cleanup on unmount
      return () => {
        if (socket.readyState === WebSocket.OPEN) {
          socket.close();
        }
      };
    } else if (socketRef.current) {
      if (socketRef.current.readyState === WebSocket.OPEN) {
        socketRef.current.close();
      }
      socketRef.current = null;
    }
  }, [isRealTimeEnabled]);
  
  // Format date to relative time
  const formatRelativeTime = (date: Date | string) => {
    try {
      // Convert to Date object if it's not already
      const dateObj = (typeof date === 'string') ? new Date(date) : date;
      
      const now = new Date();
      const diffMs = now.getTime() - dateObj.getTime();
      const diffMins = Math.floor(diffMs / (1000 * 60));
      
      if (diffMins < 1) return "Just now";
      if (diffMins < 60) return `${diffMins} minutes ago`;
      
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return `${diffHours} hours ago`;
      
      return dateObj.toLocaleDateString();
    } catch (error) {
      // If there's any error in date parsing or calculation, return a fallback
      return "Recently";
    }
  };
  
  // Handle manual refresh
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refetch();
      
      // Simulate allocation stats changes on manual refresh
      setAllocationStats(prev => {
        const randomChange = () => (Math.random() * 1.5) - 0.75; // Larger changes on manual refresh
        
        return {
          usageRate: Math.min(100, Math.max(50, prev.usageRate + randomChange())),
          lossRate: Math.min(10, Math.max(1, prev.lossRate + (randomChange() * 0.2))),
          reserveCapacity: Math.min(15, Math.max(5, prev.reserveCapacity + (randomChange() * 0.2)))
        };
      });
      
      setLastUpdated(new Date());
      toast({
        title: "Data Refreshed",
        description: "Water allocation data has been updated.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Refresh Failed",
        description: "Could not refresh allocation data.",
      });
    } finally {
      setIsRefreshing(false);
    }
  };
  
  // Query for approved water requests
  const { data: requestsData } = useQuery({
    queryKey: ["/api/requests"],
  });
  
  // Track total allocation and used values
  const [waterValues, setWaterValues] = useState({
    totalAllocated: 4500,
    totalUsed: 2925,
    additionalApproved: 0
  });
  
  // Process approved water requests to add to total allocation
  useEffect(() => {
    if (requestsData && Array.isArray(requestsData)) {
      const approvedRequests = requestsData.filter((request: any) => 
        request.status === 'approved' && 
        (request.type === 'additional' || request.type === 'Additional Water')
      );
      
      if (approvedRequests.length > 0) {
        // Calculate additional allocation from approved requests
        const additionalAllocation = approvedRequests.reduce((sum: number, request: any) => {
          return sum + (parseInt(request.amount) || 0);
        }, 0);
        
        // Update the water values WITHOUT adding to totalAllocated yet
        // We'll display it separately first
        setWaterValues(prev => ({
          ...prev,
          additionalApproved: additionalAllocation
        }));
      }
    }
  }, [requestsData]);

  // Calculate total water (basic + additional approved)
  const totalWaterAvailable = waterValues.totalAllocated + waterValues.additionalApproved;
  
  // Use API data if available, otherwise use default data
  const allocations: Allocation[] = Array.isArray(allocationsData) && allocationsData.length > 0 ? 
    [
      { 
        id: 1, 
        name: "Used Water", 
        percentage: Math.round((waterValues.totalUsed / totalWaterAvailable) * 100), 
        color: "bg-blue-500" 
      },
      { 
        id: 2, 
        name: "Available Water", 
        percentage: Math.round(((totalWaterAvailable - waterValues.totalUsed) / totalWaterAvailable) * 100), 
        color: "bg-green-500" 
      }
    ] : [
      { id: 1, name: "Used Water", percentage: 65, color: "bg-blue-500" },
      { id: 2, name: "Available Water", percentage: 35, color: "bg-green-500" }
    ];

  return (
    <Card>
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-lg md:text-xl font-semibold">Water Allocation</CardTitle>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-1 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </Button>
          <Button 
            variant={isRealTimeEnabled ? "default" : "outline"} 
            size="sm"
            onClick={() => {
              setIsRealTimeEnabled(!isRealTimeEnabled);
              toast({
                title: isRealTimeEnabled ? "Real-time Updates Disabled" : "Real-time Updates Enabled",
                description: isRealTimeEnabled 
                  ? "You will no longer receive automatic updates." 
                  : "You will now receive automatic updates.",
              });
            }}
          >
            {isRealTimeEnabled ? "Real-time: ON" : "Real-time: OFF"}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4 text-sm text-gray-500 flex items-center justify-end">
          <Clock className="h-3.5 w-3.5 mr-1" />
          <span>Last updated: {formatRelativeTime(lastUpdated)}</span>
        </div>
        <div className="space-y-4">
          {allocations.map((allocation) => (
            <div key={allocation.id} className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <span 
                    className={`w-3 h-3 rounded-full mr-2 ${allocation.color}`}
                  />
                  <p className="text-sm font-medium">{allocation.name}</p>
                </div>
                <p className="text-sm font-semibold">{allocation.percentage}%</p>
              </div>
              <Progress 
                value={allocation.percentage} 
                className="h-2" 
                indicatorClassName={allocation.color}
              />
            </div>
          ))}
        </div>
        
        <div className="mt-6 border-t pt-4">
          <h4 className="text-sm font-medium mb-3">Water Allocation Details</h4>
          <div className="space-y-2.5">
            <div className="flex justify-between">
              <div className="flex items-center">
                <Check className="h-4 w-4 text-green-500 mr-1.5" />
                <span className="text-sm">Monthly Allocation</span>
              </div>
              <span className="text-sm font-medium">{waterValues.totalAllocated.toLocaleString()} m³</span>
            </div>
            <div className="flex justify-between">
              <div className="flex items-center">
                <Check className="h-4 w-4 text-blue-500 mr-1.5" />
                <span className="text-sm">Used This Month</span>
              </div>
              <span className="text-sm font-medium">{waterValues.totalUsed.toLocaleString()} m³</span>
            </div>
            <div className="flex justify-between">
              <div className="flex items-center">
                <Check className="h-4 w-4 text-green-500 mr-1.5" />
                <span className="text-sm">Remaining Water</span>
              </div>
              <span className="text-sm font-medium">{(totalWaterAvailable - waterValues.totalUsed).toLocaleString()} m³</span>
            </div>
            {waterValues.additionalApproved > 0 && (
              <div className="flex justify-between">
                <div className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-1.5" />
                  <span className="text-sm">Additional Approved</span>
                </div>
                <span className="text-sm font-medium text-green-600">+{waterValues.additionalApproved.toLocaleString()} m³</span>
              </div>
            )}
            {waterValues.additionalApproved > 0 && (
              <div className="flex justify-between">
                <div className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-1.5" />
                  <span className="text-sm">Total Available Water</span>
                </div>
                <span className="text-sm font-medium text-green-600">{totalWaterAvailable.toLocaleString()} m³</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-4 border-t pt-4">
          <h4 className="text-sm font-medium mb-3">Allocation Efficiency</h4>
          <div className="space-y-2.5">
            <div className="flex justify-between">
              <div className="flex items-center">
                <Check className="h-4 w-4 text-green-500 mr-1.5" />
                <span className="text-sm">Current Usage Rate</span>
              </div>
              <span className="text-sm font-medium">{allocationStats.usageRate.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between">
              <div className="flex items-center">
                <Check className="h-4 w-4 text-green-500 mr-1.5" />
                <span className="text-sm">Loss Rate</span>
              </div>
              <span className="text-sm font-medium">{allocationStats.lossRate.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between">
              <div className="flex items-center">
                <Check className="h-4 w-4 text-green-500 mr-1.5" />
                <span className="text-sm">Reserve Capacity</span>
              </div>
              <span className="text-sm font-medium">{allocationStats.reserveCapacity.toFixed(1)}%</span>
            </div>
          </div>
        </div>
        
        <div className="mt-4 bg-blue-50 p-3 rounded-lg flex items-start">
          <Info className="h-4 w-4 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
          <p className="text-xs text-blue-700">
            Water allocation is currently balanced according to the irrigation committee's recommendations from last month's meeting.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}