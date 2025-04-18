import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { RefreshCw, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { useAuth } from "@/lib/auth";
import { WaterAllocation } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

// Suv taqsimoti uchun ma'lumotlar turi
type DistributionItem = {
  name: string;
  value: number;
  color: string;
};

// Crop to color mapping
const cropColorMap: { [key: string]: string } = {
  "sholi": "bg-blue-500",
  "bug'doy": "bg-blue-300",
  "sabzavot": "bg-green-500",
  "paxta": "bg-purple-500",
  "meva": "bg-red-400",
  "uzum": "bg-pink-500",
  "boshqa": "bg-amber-500"
};

// Crop types to readable names mapping
const cropNameMap: { [key: string]: string } = {
  "sholi": "Sholi maydonlari",
  "bug'doy": "Bug'doy maydonlari",
  "sabzavot": "Sabzavot fermalari",
  "paxta": "Paxta dalasi",
  "meva": "Meva bog'lari",
  "uzum": "Uzumzorlar",
  "boshqa": "Boshqa ekinlar"
};

// Default distribution if API data is not available
const defaultDistribution: DistributionItem[] = [
  { name: "Sholi maydonlari", value: 45, color: "bg-blue-500" },
  { name: "Sabzavot fermalari", value: 30, color: "bg-green-500" },
  { name: "Bug'doy maydonlari", value: 15, color: "bg-blue-300" },
  { name: "Boshqa ekinlar", value: 10, color: "bg-amber-500" },
];

// Type for our enhanced allocation with user info
type EnhancedAllocation = WaterAllocation & {
  user?: {
    id: number;
    cropType?: string; 
  }
};

export default function WaterDistributionWidget() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { user } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [distribution, setDistribution] = useState<DistributionItem[]>(defaultDistribution);
  const [websocket, setWebsocket] = useState<WebSocket | null>(null);
  
  // Establish WebSocket connection
  useEffect(() => {
    // Create WebSocket connection for real-time updates
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    const ws = new WebSocket(wsUrl);
    
    ws.onopen = () => {
      console.log('WebSocket connected for water distribution widget');
      // Request the initial data
      ws.send(JSON.stringify({ type: 'get_dashboard_data' }));
    };
    
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        // Handle dashboard data which includes allocations
        if (data.type === 'dashboard_data' && data.allocations) {
          // Update with the allocation data from WebSocket
          const allocations = data.allocations;
          // Convert to our DistributionItem format if needed
          const formattedAllocations = allocations.map((item: any) => ({
            name: item.name,
            value: item.value || item.percentage, // Support both formats
            color: item.color
          }));
          setDistribution(formattedAllocations);
          setLastUpdate(new Date());
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };
    
    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
    
    ws.onclose = () => {
      console.log('WebSocket connection closed');
    };
    
    setWebsocket(ws);
    
    // Clean up on unmount
    return () => {
      ws.close();
    };
  }, []);
  
  // Fetch water allocations from API for backup
  const { data: allocations, isLoading, isError, refetch } = useQuery<WaterAllocation[]>({
    queryKey: ["/api/allocations"],
    enabled: !!user, // Only fetch if user is logged in
  });

  // Fetch users to get crop types
  const { data: users } = useQuery<any[]>({
    queryKey: ["/api/users"],
    enabled: !!user && (user.role === 'admin' || user.role === 'data_admin'),
  });
  
  // Process allocation data to create distribution data when allocations change
  useEffect(() => {
    if (allocations && allocations.length > 0) {
      // Group allocations by crop type
      const cropAllocations = new Map<string, {total: number, used: number}>();
      
      // Calculate total allocation and used amounts
      let totalAllocated = 0;
      
      // Process all allocations
      allocations.forEach((allocation) => {
        // Find user by ID to get the crop type
        const farmUser = users?.find(u => u.id === allocation.userId);
        // Default to a crop type if user not found
        const userCropType = (farmUser?.cropType || "boshqa").toLowerCase();
        
        // Get existing data or initialize
        const existing = cropAllocations.get(userCropType) || {total: 0, used: 0};
        
        // Add this allocation to the total
        const allocatedAmount = parseFloat(allocation.amount);
        const usedAmount = parseFloat(allocation.used);
        
        existing.total += allocatedAmount;
        existing.used += usedAmount;
        totalAllocated += allocatedAmount;
        
        // Update the map
        cropAllocations.set(userCropType, existing);
      });
      
      // Convert to distribution items
      const newDistribution: DistributionItem[] = Array.from(cropAllocations.entries())
        .map(([cropType, amounts]) => {
          // Calculate percentage of total allocation
          const percentage = Math.round((amounts.total / totalAllocated) * 100);
          
          // Map crop type to readable name
          const name = cropNameMap[cropType] || "Boshqa ekinlar";
          
          return {
            name,
            value: percentage,
            color: cropColorMap[cropType] || "bg-amber-500"
          };
        })
        .sort((a, b) => b.value - a.value); // Sort by value in descending order
      
      // Make sure percentages sum to 100%
      if (newDistribution.length > 0) {
        const sum = newDistribution.reduce((acc, item) => acc + item.value, 0);
        if (sum !== 100) {
          // Create a copy of the array to avoid modifying the first element directly
          const adjustedDistribution = [...newDistribution];
          adjustedDistribution[0] = {
            ...adjustedDistribution[0],
            value: adjustedDistribution[0].value + (100 - sum)
          };
          
          // Update state with real data
          setDistribution(adjustedDistribution);
          setLastUpdate(new Date());
        } else {
          // Update state with real data
          setDistribution(newDistribution);
          setLastUpdate(new Date());
        }
      }
    }
  }, [allocations, users]);
  
  // Yangilash harakati - Refresh data from API and WebSocket
  const handleRefresh = () => {
    setIsUpdating(true);
    
    // Request updated data via WebSocket
    if (websocket && websocket.readyState === WebSocket.OPEN) {
      websocket.send(JSON.stringify({ type: 'get_dashboard_data' }));
    }
    
    // Also fetch from REST API as backup
    refetch().then(() => {
      setLastUpdate(new Date());
      setIsUpdating(false);
      toast({
        title: "Ma'lumotlar yangilandi",
        description: "Suv taqsimoti bo'yicha oxirgi ma'lumotlar yuklandi.",
      });
    }).catch(error => {
      setIsUpdating(false);
      toast({
        title: "Xatolik",
        description: "Ma'lumotlarni yangilashda muammo yuzaga keldi.",
        variant: "destructive",
      });
    });
  };
  
  // Format the relative time (e.g. "10 minutes ago")
  const getRelativeTime = (date: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    
    if (diffMinutes < 1) return t("Hozirgina");
    if (diffMinutes < 60) return `${diffMinutes} ${t("daqiqa oldin")}`;
    
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours} ${t("soat oldin")}`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} ${t("kun oldin")}`;
  };

  return (
    <Card className="shadow-md overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-base font-medium">Suv taqsimoti</CardTitle>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0" 
            onClick={handleRefresh}
            disabled={isUpdating}
          >
            <RefreshCw className={`h-4 w-4 ${isUpdating ? 'animate-spin' : ''}`} />
            <span className="sr-only">Yangilash</span>
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {distribution.map((item, index) => (
            <div key={index} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>{item.name}</span>
                <span className="font-medium">{item.value}%</span>
              </div>
              <Progress 
                value={item.value} 
                className="h-2" 
                indicatorClassName={item.color}
              />
            </div>
          ))}
          
          <div className="pt-2 border-t mt-4">
            <div className="text-xs text-gray-500 flex justify-between items-center">
              <div>
                {t("Taqsimot samaradorligi")}
              </div>
              <div>
                {t("So'nggi yangilanish")}: {getRelativeTime(lastUpdate)}
              </div>
            </div>
            <div className="text-sm mt-1">
              {t("Joriy davr suv sarfi yuqorida ko'rsatilgan")}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}