import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Check, Info, RefreshCw, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

type Allocation = {
  id: number;
  name: string;
  percentage: number;
  color: string;
};

export default function WaterAllocation() {
  const { toast } = useToast();
  const { t } = useTranslation();
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
      
      if (diffMins < 1) return t('common.just_now');
      if (diffMins < 60) return t('common.minutes_ago', { count: diffMins });
      
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return t('common.hours_ago', { count: diffHours });
      
      return dateObj.toLocaleDateString();
    } catch (error) {
      // If there's any error in date parsing or calculation, return a fallback
      return t('common.recently');
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
        title: t('common.data_refreshed'),
        description: t('dashboard.allocation_refreshed'),
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: t('common.refresh_failed'),
        description: t('dashboard.allocation_refresh_failed'),
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
        name: t('dashboard.used_water'), 
        percentage: Math.round((waterValues.totalUsed / totalWaterAvailable) * 100), 
        color: "bg-blue-500" 
      },
      { 
        id: 2, 
        name: t('dashboard.available_water'), 
        percentage: Math.round(((totalWaterAvailable - waterValues.totalUsed) / totalWaterAvailable) * 100), 
        color: "bg-green-500" 
      }
    ] : [
      { id: 1, name: t('dashboard.used_water'), percentage: 65, color: "bg-blue-500" },
      { id: 2, name: t('dashboard.available_water'), percentage: 35, color: "bg-green-500" }
    ];

  return (
    <Card className="w-full overflow-visible max-w-full">
      <CardHeader className="pb-2 flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
        <CardTitle className="text-lg md:text-xl font-semibold">{t("dashboard.water_allocation")}</CardTitle>
        <div className="flex flex-wrap gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="whitespace-nowrap"
          >
            <RefreshCw className={`h-4 w-4 mr-1 ${isRefreshing ? 'animate-spin' : ''}`} />
            {t('common.refresh')}
          </Button>
          <Button 
            variant={isRealTimeEnabled ? "default" : "outline"} 
            size="sm"
            className="whitespace-nowrap"
            onClick={() => {
              setIsRealTimeEnabled(!isRealTimeEnabled);
              toast({
                title: isRealTimeEnabled ? t('common.realtime_disabled') : t('common.realtime_enabled'),
                description: isRealTimeEnabled 
                  ? t('common.realtime_disabled_desc')
                  : t('common.realtime_enabled_desc'),
              });
            }}
          >
            {isRealTimeEnabled ? t('common.realtime_on') : t('common.realtime_off')}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4 text-sm text-muted-foreground flex items-center justify-end">
          <Clock className="h-3.5 w-3.5 mr-1" />
          <span>{t('common.last_updated')}: {formatRelativeTime(lastUpdated)}</span>
        </div>
        
        <div className="space-y-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
              <span className="text-sm font-medium">{t('crops.rice_fields')}</span>
            </div>
            <span className="text-sm font-medium">45%</span>
          </div>
          <div className="w-full bg-secondary rounded-full h-2">
            <div className="bg-blue-500 h-2 rounded-full" style={{ width: '45%' }}></div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
              <span className="text-sm font-medium">{t('crops.vegetable_farms')}</span>
            </div>
            <span className="text-sm font-medium">30%</span>
          </div>
          <div className="w-full bg-secondary rounded-full h-2">
            <div className="bg-green-500 h-2 rounded-full" style={{ width: '30%' }}></div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-blue-400 mr-2"></div>
              <span className="text-sm font-medium">{t('crops.wheat_fields')}</span>
            </div>
            <span className="text-sm font-medium">15%</span>
          </div>
          <div className="w-full bg-secondary rounded-full h-2">
            <div className="bg-blue-400 h-2 rounded-full" style={{ width: '15%' }}></div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-amber-500 mr-2"></div>
              <span className="text-sm font-medium">{t('crops.other_crops')}</span>
            </div>
            <span className="text-sm font-medium">10%</span>
          </div>
          <div className="w-full bg-secondary rounded-full h-2">
            <div className="bg-amber-500 h-2 rounded-full" style={{ width: '10%' }}></div>
          </div>
        </div>
        
        <div className="border-t pt-4">
          <h4 className="text-sm font-medium">{t('dashboard.allocation_efficiency')}</h4>
          
          <div className="mt-3 text-sm text-muted-foreground">
            <p>{t('dashboard.current_period_usage')}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}