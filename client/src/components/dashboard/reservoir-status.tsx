import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Droplet, MapPin, Clock, AlertTriangle, RefreshCw } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

type ReservoirData = {
  id: number;
  name: string;
  currentLevel: string;
  capacity: string;
  lastUpdated: Date | string;
  location?: string;
};

export default function ReservoirStatus() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isRealTimeEnabled, setIsRealTimeEnabled] = useState(true);
  const socketRef = useRef<WebSocket | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  
  // Fetch reservoirs data
  const { data: reservoirs, isLoading: isLoadingReservoirs, refetch } = useQuery({
    queryKey: ["/api/reservoirs"],
  });
  
  // Setup WebSocket connection
  useEffect(() => {
    if (isRealTimeEnabled) {
      // Create WebSocket connection
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/ws`;
      
      const socket = new WebSocket(wsUrl);
      socketRef.current = socket;
      
      // Connection opened
      socket.addEventListener('open', () => {
        console.log('WebSocket connected');
        // Request initial data
        socket.send(JSON.stringify({ type: 'get_reservoirs' }));
      });
      
      // Listen for messages
      socket.addEventListener('message', (event) => {
        try {
          const message = JSON.parse(event.data);
          
          if (message.type === 'reservoir_data') {
            // Update React Query cache with the latest data
            queryClient.setQueryData(['/api/reservoirs'], message.data);
            setLastUpdated(new Date());
            
            // Show toast for updates occasionally (not on every update to avoid spam)
            if (Math.random() < 0.3) { // Show toast ~30% of the time
              toast({
                title: "Data Updated",
                description: "Reservoir information has been updated in real-time.",
              });
            }
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      });
      
      // Connection closed
      socket.addEventListener('close', () => {
        console.log('WebSocket disconnected');
        // Attempt to reconnect after delay if still enabled
        if (isRealTimeEnabled) {
          setTimeout(() => {
            if (socketRef.current?.readyState !== WebSocket.OPEN) {
              // Only try to reconnect if we haven't already reconnected
              socketRef.current = null;
            }
          }, 3000);
        }
      });
      
      // Handle errors
      socket.addEventListener('error', (error) => {
        console.error('WebSocket error:', error);
      });
      
      // Cleanup on unmount
      return () => {
        if (socket.readyState === WebSocket.OPEN) {
          socket.close();
        }
      };
    } else if (socketRef.current) {
      // Close socket if real-time is disabled
      if (socketRef.current.readyState === WebSocket.OPEN) {
        socketRef.current.close();
      }
      socketRef.current = null;
    }
  }, [isRealTimeEnabled, queryClient, toast]);
  
  // Handle manual refresh
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refetch();
      setLastUpdated(new Date());
      toast({
        title: "Data Refreshed",
        description: "Reservoir data has been manually refreshed.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Refresh Failed",
        description: "Could not refresh reservoir data.",
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  // Default data for demonstration when API data is not available
  const defaultReservoirs: ReservoirData[] = [
    {
      id: 1,
      name: "Main Reservoir",
      currentLevel: "750000",
      capacity: "1000000",
      lastUpdated: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      location: "North Basin"
    },
    {
      id: 2,
      name: "Secondary Reservoir",
      currentLevel: "320000",
      capacity: "500000",
      lastUpdated: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
      location: "South Basin"
    },
    {
      id: 3,
      name: "Emergency Storage",
      currentLevel: "98000",
      capacity: "100000",
      lastUpdated: new Date(Date.now() - 1000 * 60 * 45), // 45 minutes ago
      location: "East Basin"
    }
  ];
  
  // Use API data if available, otherwise use default data
  const reservoirsData: ReservoirData[] = (reservoirs as ReservoirData[] || defaultReservoirs);

  // Calculate fill percentages and statuses
  const reservoirsWithStatus = reservoirsData.map(reservoir => {
    const currentLevel = parseFloat(reservoir.currentLevel);
    const capacity = parseFloat(reservoir.capacity);
    const fillPercentage = Math.round((currentLevel / capacity) * 100);
    
    let status = "normal";
    let statusColor = "bg-blue-500";
    
    if (fillPercentage < 30) {
      status = "low";
      statusColor = "bg-red-500";
    } else if (fillPercentage < 50) {
      status = "warning";
      statusColor = "bg-amber-500";
    } else if (fillPercentage > 90) {
      status = "high";
      statusColor = "bg-green-500";
    }
    
    return {
      ...reservoir,
      fillPercentage,
      status,
      statusColor
    };
  });

  // Format number with commas for thousands
  const formatNumber = (num: string) => {
    return parseInt(num).toLocaleString();
  };

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

  return (
    <Card className="w-full">
      <CardHeader className="pb-2 flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
        <CardTitle className="text-lg md:text-xl font-semibold">Reservoir Status</CardTitle>
        <div className="flex flex-wrap gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="whitespace-nowrap"
          >
            <RefreshCw className={`h-4 w-4 mr-1 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </Button>
          <Button 
            variant={isRealTimeEnabled ? "default" : "outline"} 
            size="sm"
            className="whitespace-nowrap"
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
        <div className="mb-4 text-sm text-muted-foreground flex items-center justify-end">
          <Clock className="h-3.5 w-3.5 mr-1" />
          <span>Last updated: {formatRelativeTime(lastUpdated)}</span>
        </div>
        <div className="space-y-6 w-full">
          {reservoirsWithStatus.map((reservoir) => (
            <div key={reservoir.id} className="border rounded-lg p-4 w-full">
              <div className="flex flex-wrap justify-between items-start mb-2 w-full">
                <div className="mr-2">
                  <h3 className="text-lg font-medium truncate max-w-full">{reservoir.name}</h3>
                  <div className="flex items-center text-muted-foreground text-sm mt-1">
                    <MapPin className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
                    <span className="truncate">{reservoir.location || "Unknown location"}</span>
                  </div>
                </div>
                <Badge 
                  variant={reservoir.status === "low" ? "destructive" : 
                          reservoir.status === "warning" ? "outline" : 
                          "default"}
                  className="ml-auto flex-shrink-0"
                >
                  {reservoir.fillPercentage}% Filled
                </Badge>
              </div>
              
              <div className="mt-3 space-y-3 w-full">
                <div className="w-full">
                  <Progress 
                    value={reservoir.fillPercentage} 
                    className="h-3 w-full"
                    indicatorClassName={reservoir.statusColor}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm w-full">
                  <div className="flex items-center">
                    <Droplet className="h-4 w-4 mr-2 text-blue-500 flex-shrink-0" />
                    <div>
                      <p className="text-muted-foreground">Current Level</p>
                      <p className="font-medium">{formatNumber(reservoir.currentLevel)} m³</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Droplet className="h-4 w-4 mr-2 text-blue-500 flex-shrink-0" />
                    <div>
                      <p className="text-muted-foreground">Capacity</p>
                      <p className="font-medium">{formatNumber(reservoir.capacity)} m³</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-wrap items-center justify-between text-xs text-muted-foreground w-full gap-2">
                  <div className="flex items-center">
                    <Clock className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
                    <span>Updated {formatRelativeTime(reservoir.lastUpdated)}</span>
                  </div>
                  
                  {reservoir.status === "low" && (
                    <div className="flex items-center text-red-500">
                      <AlertTriangle className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
                      <span>Low water level</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}