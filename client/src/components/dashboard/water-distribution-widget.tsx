import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { RefreshCw } from "lucide-react";

// Suv taqsimoti uchun ma'lumotlar turi
type DistributionItem = {
  name: string;
  value: number;
  color: string;
};

export default function WaterDistributionWidget() {
  const { t } = useTranslation();
  const [isUpdating, setIsUpdating] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [distribution, setDistribution] = useState<DistributionItem[]>([
    { name: "Sholi maydonlari", value: 45, color: "bg-blue-500" },
    { name: "Sabzavot fermalari", value: 30, color: "bg-green-500" },
    { name: "Bug'doy maydonlari", value: 15, color: "bg-blue-300" },
    { name: "Boshqa ekinlar", value: 10, color: "bg-amber-500" },
  ]);

  // Yangilash harakatini simulyatsiya qilish
  const handleRefresh = () => {
    setIsUpdating(true);
    
    // Small random variations to simulate real-time updates
    setTimeout(() => {
      const newDistribution = distribution.map(item => {
        // Random change between -2% and +2%
        const change = Math.random() * 4 - 2;
        let newValue = Math.round(item.value + change);
        
        // Ensure values stay within reasonable bounds
        newValue = Math.max(5, Math.min(50, newValue));
        
        return {
          ...item,
          value: newValue
        };
      });
      
      // Adjust values to ensure they sum to 100%
      const sum = newDistribution.reduce((acc, item) => acc + item.value, 0);
      const adjustedDistribution = newDistribution.map((item, index) => {
        // Last item gets the remainder to ensure exactly 100%
        if (index === newDistribution.length - 1) {
          const otherSum = newDistribution
            .slice(0, -1)
            .reduce((acc, item) => acc + item.value, 0);
          return { ...item, value: 100 - otherSum };
        }
        return { ...item, value: Math.round(item.value * (100 / sum)) };
      });
      
      setDistribution(adjustedDistribution);
      setLastUpdate(new Date());
      setIsUpdating(false);
    }, 800);
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