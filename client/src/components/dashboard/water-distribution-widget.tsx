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

// Default distribution if API data is not available
const defaultDistribution: DistributionItem[] = [
  { name: "Sholi maydonlari", value: 45, color: "bg-blue-500" },
  { name: "Sabzavot fermalari", value: 30, color: "bg-green-500" },
  { name: "Bug'doy maydonlari", value: 15, color: "bg-blue-300" },
  { name: "Boshqa ekinlar", value: 10, color: "bg-amber-500" },
];

export default function WaterDistributionWidget() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { user } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [distribution, setDistribution] = useState<DistributionItem[]>(defaultDistribution);
  
  // Fetch water allocations from API
  const { data: allocations, isLoading, isError, refetch } = useQuery<WaterAllocation[]>({
    queryKey: ["/api/allocations"],
    enabled: !!user, // Only fetch if user is logged in
  });
  
  // Process allocation data to create distribution data when allocations change
  useEffect(() => {
    if (allocations && allocations.length > 0) {
      // Group allocations by crop type
      const cropAllocations = new Map<string, {total: number, used: number}>();
      
      // Calculate total allocation and used amounts
      let totalAllocated = 0;
      
      // Process all allocations
      // Add different crop types for variety in the demo
      const cropTypes = ["sholi", "bug'doy", "sabzavot", "paxta", "boshqa"];
      
      allocations.forEach((allocation, index) => {
        // Determine crop type based on the allocation index for demo purposes
        // In real implementation, we would fetch the user details with crop types
        const userCropType = cropTypes[index % cropTypes.length];
        
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
          let name = cropType;
          if (cropType === "sholi") name = "Sholi maydonlari";
          else if (cropType === "bug'doy") name = "Bug'doy maydonlari";
          else if (cropType === "sabzavot") name = "Sabzavot fermalari";
          else if (cropType === "paxta") name = "Paxta dalasi";
          else if (cropType === "meva") name = "Meva bog'lari";
          else if (cropType === "uzum") name = "Uzumzorlar";
          else name = "Boshqa ekinlar";
          
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
          newDistribution[0].value += (100 - sum); // Adjust the largest allocation
        }
        
        // Update state with real data
        setDistribution(newDistribution);
        setLastUpdate(new Date());
      }
    }
  }, [allocations]);
  
  // Yangilash harakati - Refresh data from API
  const handleRefresh = () => {
    setIsUpdating(true);
    
    // Fetch new data from API
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