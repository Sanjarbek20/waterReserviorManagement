import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Droplet, MapPin, Clock, AlertTriangle } from "lucide-react";

type ReservoirData = {
  id: number;
  name: string;
  currentLevel: string;
  capacity: string;
  lastUpdated: Date | string;
  location?: string;
};

export default function ReservoirStatus() {
  // Fetch reservoirs data
  const { data: reservoirs, isLoading: isLoadingReservoirs } = useQuery({
    queryKey: ["/api/reservoirs"],
  });

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
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg md:text-xl font-semibold">Reservoir Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {reservoirsWithStatus.map((reservoir) => (
            <div key={reservoir.id} className="border rounded-lg p-4">
              <div className="flex flex-wrap justify-between items-start mb-2">
                <div>
                  <h3 className="text-lg font-medium">{reservoir.name}</h3>
                  <div className="flex items-center text-gray-500 text-sm mt-1">
                    <MapPin className="h-3.5 w-3.5 mr-1" />
                    <span>{reservoir.location || "Unknown location"}</span>
                  </div>
                </div>
                <Badge 
                  variant={reservoir.status === "low" ? "destructive" : 
                          reservoir.status === "warning" ? "outline" : 
                          "default"}
                  className="ml-auto"
                >
                  {reservoir.fillPercentage}% Filled
                </Badge>
              </div>
              
              <div className="mt-3 space-y-3">
                <div>
                  <Progress 
                    value={reservoir.fillPercentage} 
                    className="h-3"
                    indicatorClassName={reservoir.statusColor}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center">
                    <Droplet className="h-4 w-4 mr-2 text-blue-500" />
                    <div>
                      <p className="text-gray-500">Current Level</p>
                      <p className="font-medium">{formatNumber(reservoir.currentLevel)} m³</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Droplet className="h-4 w-4 mr-2 text-blue-500" />
                    <div>
                      <p className="text-gray-500">Capacity</p>
                      <p className="font-medium">{formatNumber(reservoir.capacity)} m³</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center">
                    <Clock className="h-3.5 w-3.5 mr-1" />
                    <span>Updated {formatRelativeTime(reservoir.lastUpdated)}</span>
                  </div>
                  
                  {reservoir.status === "low" && (
                    <div className="flex items-center text-red-500">
                      <AlertTriangle className="h-3.5 w-3.5 mr-1" />
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