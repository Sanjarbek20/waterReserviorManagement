import { useState } from "react";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import NewWeatherWidget from "@/components/weather/new-weather-widget";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown, Download, RefreshCw, Calendar } from "lucide-react";

// Graph component mock-up
const WeatherGraph = () => {
  return (
    <div className="h-64 flex items-center justify-center border border-dashed rounded-md">
      <p className="text-gray-500">Ob-havo ma'lumotlari grafigi</p>
    </div>
  );
};

// Map component mock-up
const WeatherMap = () => {
  return (
    <div className="h-96 flex items-center justify-center border border-dashed rounded-md">
      <p className="text-gray-500">Mintaqaviy ob-havo xaritasi</p>
    </div>
  );
};

export default function WeatherPage() {
  const [timeRange, setTimeRange] = useState("weekly");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  return (
    <DashboardLayout title="Ob-havo ma'lumotlari monitoringi">
      <div className="space-y-6">
        {/* Main weather display */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <NewWeatherWidget />
          </div>
          
          <div className="md:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-base font-medium">Ob-havo o'zgarishlari</CardTitle>
                
                <div className="flex items-center space-x-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="h-8">
                        <Calendar className="h-4 w-4 mr-2" />
                        {timeRange === "daily" ? "Kunlik" : 
                         timeRange === "weekly" ? "Haftalik" : 
                         timeRange === "monthly" ? "Oylik" : "Yillik"}
                        <ChevronDown className="ml-2 h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => setTimeRange("daily")}>
                        Kunlik
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setTimeRange("weekly")}>
                        Haftalik
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setTimeRange("monthly")}>
                        Oylik
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setTimeRange("yearly")}>
                        Yillik
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  
                  <Button variant="outline" size="sm" className="h-8">
                    <Download className="h-4 w-4 mr-2" />
                    Yuklab olish
                  </Button>
                  
                  <Button onClick={handleRefresh} variant="outline" size="sm" className="h-8" disabled={isRefreshing}>
                    <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
                    Yangilash
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <WeatherGraph />
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Regional weather data */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">
              Mintaqaviy ob-havo ma'lumotlari
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="map">
              <TabsList className="grid w-full max-w-xs grid-cols-2 mb-4">
                <TabsTrigger value="map">Xarita</TabsTrigger>
                <TabsTrigger value="regions">Mintaqalar</TabsTrigger>
              </TabsList>
              
              <TabsContent value="map">
                <WeatherMap />
              </TabsContent>
              
              <TabsContent value="regions">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {["Toshkent", "Samarqand", "Buxoro", "Farg'ona", "Andijon", "Namangan"].map(region => (
                    <Card key={region} className="overflow-hidden hover:shadow-md transition-shadow">
                      <div className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">{region}</h3>
                            <p className="text-2xl font-bold mt-1">
                              {Math.floor(Math.random() * 10) + 25}°C
                            </p>
                          </div>
                          <div className="text-blue-500">
                            <svg width="40" height="40" viewBox="0 0 64 64">
                              <path fill="currentColor" d="M16 10a6 6 0 0112 0 6 6 0 01-12 0zm6-8a8 8 0 100 16 8 8 0 000-16z"/>
                            </svg>
                          </div>
                        </div>
                        
                        <div className="flex justify-between mt-4">
                          <div className="text-sm">
                            <p className="text-gray-500">Namlik</p>
                            <p className="font-medium">{Math.floor(Math.random() * 20) + 30}%</p>
                          </div>
                          <div className="text-sm">
                            <p className="text-gray-500">Shamol</p>
                            <p className="font-medium">{Math.floor(Math.random() * 10) + 5} km/s</p>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}