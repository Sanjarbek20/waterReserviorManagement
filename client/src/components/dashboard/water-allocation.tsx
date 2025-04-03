import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Check, Info } from "lucide-react";

type Allocation = {
  id: number;
  name: string;
  percentage: number;
  color: string;
};

export default function WaterAllocation() {
  // Fetch allocations data (in a real app)
  const { data: allocationsData, isLoading: isLoadingAllocations } = useQuery({
    queryKey: ["/api/allocations"],
    enabled: false, // Disabled for now, using mock data
  });
  
  // Mock data for demonstration
  const allocations: Allocation[] = [
    { id: 1, name: "Rice Fields", percentage: 45, color: "bg-blue-500" },
    { id: 2, name: "Vegetable Farms", percentage: 30, color: "bg-green-500" },
    { id: 3, name: "Wheat Fields", percentage: 15, color: "bg-sky-500" },
    { id: 4, name: "Other Crops", percentage: 10, color: "bg-amber-500" }
  ];

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg md:text-xl font-semibold">Water Allocation</CardTitle>
      </CardHeader>
      <CardContent>
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
          <h4 className="text-sm font-medium mb-3">Allocation Efficiency</h4>
          <div className="space-y-2.5">
            <div className="flex justify-between">
              <div className="flex items-center">
                <Check className="h-4 w-4 text-green-500 mr-1.5" />
                <span className="text-sm">Current Usage Rate</span>
              </div>
              <span className="text-sm font-medium">87%</span>
            </div>
            <div className="flex justify-between">
              <div className="flex items-center">
                <Check className="h-4 w-4 text-green-500 mr-1.5" />
                <span className="text-sm">Loss Rate</span>
              </div>
              <span className="text-sm font-medium">4.2%</span>
            </div>
            <div className="flex justify-between">
              <div className="flex items-center">
                <Check className="h-4 w-4 text-green-500 mr-1.5" />
                <span className="text-sm">Reserve Capacity</span>
              </div>
              <span className="text-sm font-medium">8.8%</span>
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