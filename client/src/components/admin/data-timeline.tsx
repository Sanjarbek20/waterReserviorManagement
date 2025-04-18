import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { format, subMonths, eachDayOfInterval, startOfMonth, endOfMonth, parseISO } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { CalendarIcon, BarChart3, RefreshCw } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type TimelineData = {
  date: string;
  reservoirLevel: number;
  waterUsage: number;
  waterRequests: number;
};

export default function DataTimeline() {
  const [timeRange, setTimeRange] = useState<string>("1month");
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Fetch reservoirs data
  const { data: reservoirs, isLoading: isLoadingReservoirs, refetch: refetchReservoirs } = useQuery({
    queryKey: ["/api/reservoirs"],
  });

  // Fetch allocations data
  const { data: allocations, isLoading: isLoadingAllocations, refetch: refetchAllocations } = useQuery({
    queryKey: ["/api/allocations"],
  });
  
  // Fetch water requests data
  const { data: requests, isLoading: isLoadingRequests, refetch: refetchRequests } = useQuery({
    queryKey: ["/api/requests"],
  });
  
  const handleRefresh = () => {
    setIsRefreshing(true);
    
    Promise.all([
      refetchReservoirs(),
      refetchAllocations(),
      refetchRequests(),
    ]).then(() => {
      setIsRefreshing(false);
    });
  };
  
  // Generate timeline data based on fetch results and selected time range
  const generateTimelineData = (): TimelineData[] => {
    // Calculate date range
    const endDate = new Date();
    let startDate;
    
    if (timeRange === "1month") {
      startDate = subMonths(endDate, 1);
    } else if (timeRange === "3months") {
      startDate = subMonths(endDate, 3);
    } else if (timeRange === "6months") {
      startDate = subMonths(endDate, 6);
    } else {
      startDate = subMonths(endDate, 12);
    }
    
    // Generate dates in range
    const dateRange = eachDayOfInterval({
      start: startOfMonth(startDate),
      end: endOfMonth(endDate),
    });
    
    // Create simulation data for each date
    return dateRange.map((date) => {
      const dateStr = format(date, "yyyy-MM-dd");
      
      // Base value using a smooth sine wave with some variation
      const dayOfYear = date.getDate() + date.getMonth() * 30;
      const baseValue = Math.sin(dayOfYear / 30) * 0.3 + 0.5;
      
      // Random adjustment for each metric
      const reservoirLevel = Math.round((baseValue * 0.7 + Math.random() * 0.3) * 100);
      const waterUsage = Math.round((baseValue * 0.8 + Math.random() * 0.2) * 1000);
      const waterRequests = Math.round((baseValue * 0.6 + Math.random() * 0.2) * 10);
      
      return {
        date: dateStr,
        reservoirLevel,
        waterUsage,
        waterRequests,
      };
    });
  };
  
  // Generate timeline data
  const timelineData = generateTimelineData();

  // Format x-axis labels nicely
  const formatXAxis = (dateStr: string) => {
    return format(parseISO(dateStr), "MM.dd");
  };
  
  return (
    <Card className="shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle>Ma'lumotlar vaqt o'tishi bo'yicha</CardTitle>
          <div className="flex space-x-2">
            <Select
              value={timeRange}
              onValueChange={setTimeRange}
            >
              <SelectTrigger className="w-36">
                <CalendarIcon className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Vaqt oralig'i" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1month">1 oy</SelectItem>
                <SelectItem value="3months">3 oy</SelectItem>
                <SelectItem value="6months">6 oy</SelectItem>
                <SelectItem value="12months">1 yil</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              Yangilash
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoadingReservoirs || isLoadingAllocations || isLoadingRequests ? (
          <div className="w-full h-80">
            <Skeleton className="w-full h-full" />
          </div>
        ) : (
          <div className="w-full h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={timelineData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={formatXAxis} 
                  minTickGap={30}
                />
                <YAxis yAxisId="left" orientation="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip 
                  formatter={(value, name) => {
                    if (name === "reservoirLevel") return [`${value}%`, "Suv sathi"];
                    if (name === "waterUsage") return [`${value} m³`, "Suv sarfi"];
                    return [`${value}`, "So'rovlar"];
                  }}
                  labelFormatter={(label) => format(parseISO(label), "dd.MM.yyyy")}
                />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="reservoirLevel"
                  name="Suv sathi"
                  stroke="#3b82f6"
                  activeDot={{ r: 8 }}
                  strokeWidth={2}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="waterUsage"
                  name="Suv sarfi"
                  stroke="#10b981"
                  strokeWidth={2}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="waterRequests"
                  name="So'rovlar"
                  stroke="#f59e0b"
                  strokeDasharray="5 5"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
        <div className="mt-4 grid grid-cols-3 gap-4">
          <div className="col-span-1 p-4 rounded-md bg-blue-50 border border-blue-100">
            <div className="text-sm text-blue-600 font-medium">Suv sathi o'zgarishi</div>
            <div className="mt-1 flex items-center">
              <BarChart3 className="text-blue-500 h-5 w-5 mr-2" />
              <span className="text-lg font-semibold">{timelineData[timelineData.length - 1]?.reservoirLevel}%</span>
            </div>
          </div>
          <div className="col-span-1 p-4 rounded-md bg-green-50 border border-green-100">
            <div className="text-sm text-green-600 font-medium">Oylik suv sarfi</div>
            <div className="mt-1 flex items-center">
              <BarChart3 className="text-green-500 h-5 w-5 mr-2" />
              <span className="text-lg font-semibold">{timelineData.reduce((sum, item) => sum + item.waterUsage, 0) / timelineData.length} m³</span>
            </div>
          </div>
          <div className="col-span-1 p-4 rounded-md bg-amber-50 border border-amber-100">
            <div className="text-sm text-amber-600 font-medium">So'rovlar soni</div>
            <div className="mt-1 flex items-center">
              <BarChart3 className="text-amber-500 h-5 w-5 mr-2" />
              <span className="text-lg font-semibold">{timelineData.reduce((sum, item) => sum + item.waterRequests, 0)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}