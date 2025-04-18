import { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapContainer, TileLayer, Marker, Popup, Tooltip, Circle } from "react-leaflet";
import { Droplet, CloudRain, Wind, Thermometer, CloudSun, Calendar, Clock, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DashboardLayout from "@/components/layout/dashboard-layout";
import WaterDistributionWidget from "@/components/dashboard/water-distribution-widget";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix the Leaflet icon issue
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Add TypeScript type for weather data
type WeatherData = {
  [key: string]: {
    temp: number;
    condition: string;
    humidity: number;
    windSpeed: number;
    precipitation: string;
    forecastNext5Days: Array<{
      day: string;
      temp: number;
      condition: string;
      precipitation: string;
    }>;
  }
};

// Define reservoir location type
type Reservoir = {
  id: number;
  name: string;
  location: [number, number]; // Ensuring it's a tuple with exactly 2 elements
  capacity: string;
  level: string;
  inflow: string;
  outflow: string;
  region: string;
};

// Reservoir locations across Uzbekistan regions
const reservoirLocations: Reservoir[] = [
  // Tashkent region
  { id: 1, name: "Chorvoq suv ombori", location: [41.4639, 70.0253], capacity: "2000 mln m³", level: "78%", inflow: "35 m³/s", outflow: "25 m³/s", region: "Toshkent" },
  { id: 2, name: "Tuyabug'iz suv ombori", location: [40.9505, 69.3639], capacity: "250 mln m³", level: "62%", inflow: "15 m³/s", outflow: "12 m³/s", region: "Toshkent" },
  
  // Namangan region
  { id: 3, name: "Kosonsoy suv ombori", location: [41.2333, 71.5500], capacity: "165 mln m³", level: "65%", inflow: "12 m³/s", outflow: "9 m³/s", region: "Namangan" },
  
  // Andijan region
  { id: 4, name: "Andijon suv ombori", location: [40.7667, 73.0333], capacity: "1900 mln m³", level: "81%", inflow: "40 m³/s", outflow: "32 m³/s", region: "Andijon" },
  
  // Fergana region
  { id: 5, name: "Karkidon suv ombori", location: [40.4667, 71.2667], capacity: "218 mln m³", level: "59%", inflow: "14 m³/s", outflow: "10 m³/s", region: "Farg'ona" },
  
  // Jizzakh region
  { id: 6, name: "Zaamin suv ombori", location: [39.9570, 68.3945], capacity: "51 mln m³", level: "45%", inflow: "6 m³/s", outflow: "4 m³/s", region: "Jizzax" },
  
  // Samarkand region
  { id: 7, name: "Qattaqo'rg'on suv ombori", location: [39.9000, 66.2500], capacity: "900 mln m³", level: "53%", inflow: "20 m³/s", outflow: "15 m³/s", region: "Samarqand" },
  
  // Kashkadarya region
  { id: 8, name: "Chimqo'rg'on suv ombori", location: [39.1992, 66.8114], capacity: "500 mln m³", level: "48%", inflow: "12 m³/s", outflow: "9 m³/s", region: "Qashqadaryo" },
  { id: 9, name: "Hisorak suv ombori", location: [38.9761, 66.6744], capacity: "170 mln m³", level: "42%", inflow: "8 m³/s", outflow: "5 m³/s", region: "Qashqadaryo" },
  
  // Surkhandarya region
  { id: 10, name: "Janubiy Surkhan suv ombori", location: [37.8000, 67.2500], capacity: "800 mln m³", level: "64%", inflow: "18 m³/s", outflow: "14 m³/s", region: "Surxondaryo" },
  { id: 11, name: "Toʻpalang suv ombori", location: [38.2000, 67.3500], capacity: "500 mln m³", level: "57%", inflow: "15 m³/s", outflow: "11 m³/s", region: "Surxondaryo" },
  
  // Navoi region
  { id: 12, name: "Tudako'l suv ombori", location: [40.2200, 63.8300], capacity: "1200 mln m³", level: "38%", inflow: "10 m³/s", outflow: "8 m³/s", region: "Navoiy" },
  
  // Bukhara region
  { id: 13, name: "Kuyimozor suv ombori", location: [39.8000, 64.8000], capacity: "310 mln m³", level: "35%", inflow: "8 m³/s", outflow: "6 m³/s", region: "Buxoro" },
  
  // Khorezm region
  { id: 14, name: "Shovot suv ombori", location: [41.3500, 60.6000], capacity: "165 mln m³", level: "68%", inflow: "14 m³/s", outflow: "10 m³/s", region: "Xorazm" },
  
  // Karakalpakstan
  { id: 15, name: "Qoraqalpog'iston suv ombori", location: [42.5000, 59.5000], capacity: "380 mln m³", level: "29%", inflow: "7 m³/s", outflow: "5 m³/s", region: "Qoraqalpog'iston" },
];

// Weather forecast data for different regions
const weatherData: WeatherData = {
  "Toshkent": { temp: 28, condition: "Quyoshli", humidity: 45, windSpeed: 12, precipitation: "0 mm", forecastNext5Days: [
    { day: "Dushanba", temp: 29, condition: "Quyoshli", precipitation: "0 mm" },
    { day: "Seshanba", temp: 30, condition: "Quyoshli", precipitation: "0 mm" },
    { day: "Chorshanba", temp: 27, condition: "Qisman bulutli", precipitation: "0 mm" },
    { day: "Payshanba", temp: 25, condition: "Bulutli", precipitation: "2 mm" },
    { day: "Juma", temp: 24, condition: "Yomg'irli", precipitation: "5 mm" },
  ]},
  "Namangan": { temp: 30, condition: "Quyoshli", humidity: 40, windSpeed: 8, precipitation: "0 mm", forecastNext5Days: [
    { day: "Dushanba", temp: 31, condition: "Quyoshli", precipitation: "0 mm" },
    { day: "Seshanba", temp: 32, condition: "Quyoshli", precipitation: "0 mm" },
    { day: "Chorshanba", temp: 30, condition: "Qisman bulutli", precipitation: "0 mm" },
    { day: "Payshanba", temp: 29, condition: "Bulutli", precipitation: "0 mm" },
    { day: "Juma", temp: 27, condition: "Qisman bulutli", precipitation: "2 mm" },
  ]},
  "Andijon": { temp: 29, condition: "Quyoshli", humidity: 42, windSpeed: 10, precipitation: "0 mm", forecastNext5Days: [
    { day: "Dushanba", temp: 30, condition: "Quyoshli", precipitation: "0 mm" },
    { day: "Seshanba", temp: 31, condition: "Quyoshli", precipitation: "0 mm" },
    { day: "Chorshanba", temp: 29, condition: "Qisman bulutli", precipitation: "0 mm" },
    { day: "Payshanba", temp: 27, condition: "Bulutli", precipitation: "1 mm" },
    { day: "Juma", temp: 26, condition: "Yomg'irli", precipitation: "4 mm" },
  ]},
  "Farg'ona": { temp: 31, condition: "Quyoshli", humidity: 38, windSpeed: 9, precipitation: "0 mm", forecastNext5Days: [
    { day: "Dushanba", temp: 32, condition: "Quyoshli", precipitation: "0 mm" },
    { day: "Seshanba", temp: 33, condition: "Quyoshli", precipitation: "0 mm" },
    { day: "Chorshanba", temp: 31, condition: "Qisman bulutli", precipitation: "0 mm" },
    { day: "Payshanba", temp: 29, condition: "Qisman bulutli", precipitation: "0 mm" },
    { day: "Juma", temp: 28, condition: "Bulutli", precipitation: "2 mm" },
  ]},
  "Jizzax": { temp: 32, condition: "Quyoshli", humidity: 35, windSpeed: 14, precipitation: "0 mm", forecastNext5Days: [
    { day: "Dushanba", temp: 33, condition: "Quyoshli", precipitation: "0 mm" },
    { day: "Seshanba", temp: 34, condition: "Quyoshli", precipitation: "0 mm" },
    { day: "Chorshanba", temp: 33, condition: "Quyoshli", precipitation: "0 mm" },
    { day: "Payshanba", temp: 31, condition: "Qisman bulutli", precipitation: "0 mm" },
    { day: "Juma", temp: 30, condition: "Qisman bulutli", precipitation: "0 mm" },
  ]},
  "Samarqand": { temp: 30, condition: "Quyoshli", humidity: 40, windSpeed: 11, precipitation: "0 mm", forecastNext5Days: [
    { day: "Dushanba", temp: 31, condition: "Quyoshli", precipitation: "0 mm" },
    { day: "Seshanba", temp: 32, condition: "Quyoshli", precipitation: "0 mm" },
    { day: "Chorshanba", temp: 30, condition: "Qisman bulutli", precipitation: "0 mm" },
    { day: "Payshanba", temp: 28, condition: "Bulutli", precipitation: "1 mm" },
    { day: "Juma", temp: 27, condition: "Yomg'irli", precipitation: "3 mm" },
  ]},
  "Qashqadaryo": { temp: 33, condition: "Quyoshli", humidity: 30, windSpeed: 13, precipitation: "0 mm", forecastNext5Days: [
    { day: "Dushanba", temp: 34, condition: "Quyoshli", precipitation: "0 mm" },
    { day: "Seshanba", temp: 35, condition: "Quyoshli", precipitation: "0 mm" },
    { day: "Chorshanba", temp: 34, condition: "Quyoshli", precipitation: "0 mm" },
    { day: "Payshanba", temp: 32, condition: "Qisman bulutli", precipitation: "0 mm" },
    { day: "Juma", temp: 30, condition: "Qisman bulutli", precipitation: "0 mm" },
  ]},
  "Surxondaryo": { temp: 34, condition: "Quyoshli", humidity: 28, windSpeed: 12, precipitation: "0 mm", forecastNext5Days: [
    { day: "Dushanba", temp: 35, condition: "Quyoshli", precipitation: "0 mm" },
    { day: "Seshanba", temp: 36, condition: "Quyoshli", precipitation: "0 mm" },
    { day: "Chorshanba", temp: 35, condition: "Quyoshli", precipitation: "0 mm" },
    { day: "Payshanba", temp: 34, condition: "Qisman bulutli", precipitation: "0 mm" },
    { day: "Juma", temp: 32, condition: "Qisman bulutli", precipitation: "0 mm" },
  ]},
  "Navoiy": { temp: 31, condition: "Quyoshli", humidity: 32, windSpeed: 15, precipitation: "0 mm", forecastNext5Days: [
    { day: "Dushanba", temp: 32, condition: "Quyoshli", precipitation: "0 mm" },
    { day: "Seshanba", temp: 33, condition: "Quyoshli", precipitation: "0 mm" },
    { day: "Chorshanba", temp: 32, condition: "Quyoshli", precipitation: "0 mm" },
    { day: "Payshanba", temp: 30, condition: "Qisman bulutli", precipitation: "0 mm" },
    { day: "Juma", temp: 29, condition: "Qisman bulutli", precipitation: "0 mm" },
  ]},
  "Buxoro": { temp: 32, condition: "Quyoshli", humidity: 30, windSpeed: 14, precipitation: "0 mm", forecastNext5Days: [
    { day: "Dushanba", temp: 33, condition: "Quyoshli", precipitation: "0 mm" },
    { day: "Seshanba", temp: 34, condition: "Quyoshli", precipitation: "0 mm" },
    { day: "Chorshanba", temp: 33, condition: "Quyoshli", precipitation: "0 mm" },
    { day: "Payshanba", temp: 31, condition: "Qisman bulutli", precipitation: "0 mm" },
    { day: "Juma", temp: 30, condition: "Qisman bulutli", precipitation: "0 mm" },
  ]},
  "Xorazm": { temp: 29, condition: "Qisman bulutli", humidity: 45, windSpeed: 11, precipitation: "0 mm", forecastNext5Days: [
    { day: "Dushanba", temp: 30, condition: "Qisman bulutli", precipitation: "0 mm" },
    { day: "Seshanba", temp: 31, condition: "Quyoshli", precipitation: "0 mm" },
    { day: "Chorshanba", temp: 30, condition: "Qisman bulutli", precipitation: "0 mm" },
    { day: "Payshanba", temp: 28, condition: "Bulutli", precipitation: "2 mm" },
    { day: "Juma", temp: 26, condition: "Yomg'irli", precipitation: "5 mm" },
  ]},
  "Qoraqalpog'iston": { temp: 28, condition: "Qisman bulutli", humidity: 48, windSpeed: 13, precipitation: "0 mm", forecastNext5Days: [
    { day: "Dushanba", temp: 29, condition: "Qisman bulutli", precipitation: "0 mm" },
    { day: "Seshanba", temp: 30, condition: "Quyoshli", precipitation: "0 mm" },
    { day: "Chorshanba", temp: 29, condition: "Qisman bulutli", precipitation: "0 mm" },
    { day: "Payshanba", temp: 27, condition: "Bulutli", precipitation: "3 mm" },
    { day: "Juma", temp: 25, condition: "Yomg'irli", precipitation: "7 mm" },
  ]},
};

// Water sources and canal networks
const waterSources = [
  { id: 1, name: "Sirdaryo", type: "Daryo", regions: ["Toshkent", "Namangan", "Farg'ona"] },
  { id: 2, name: "Amudaryo", type: "Daryo", regions: ["Surxondaryo", "Xorazm", "Qoraqalpog'iston"] },
  { id: 3, name: "Zarafshon", type: "Daryo", regions: ["Samarqand", "Navoiy", "Buxoro"] },
  { id: 4, name: "Qashqadaryo", type: "Daryo", regions: ["Qashqadaryo"] },
  { id: 5, name: "Chirchiq", type: "Daryo", regions: ["Toshkent"] },
  { id: 6, name: "Ohangaron", type: "Daryo", regions: ["Toshkent"] },
];

const canalNetworks = [
  { id: 1, name: "Katta Farg'ona kanali", regions: ["Andijon", "Namangan", "Farg'ona"], sourceName: "Sirdaryo" },
  { id: 2, name: "Janubiy Mirzacho'l kanali", regions: ["Jizzax", "Samarqand"], sourceName: "Sirdaryo" },
  { id: 3, name: "Amu-Buxoro kanali", regions: ["Buxoro", "Navoiy"], sourceName: "Amudaryo" },
  { id: 4, name: "Qoraqum kanali", regions: ["Surxondaryo", "Qashqadaryo"], sourceName: "Amudaryo" },
  { id: 5, name: "Toshkent kanali", regions: ["Toshkent"], sourceName: "Chirchiq" },
];

// Utilities for real-time data
const getRandomChange = (min = -2, max = 2) => {
  return Math.round((Math.random() * (max - min) + min) * 10) / 10;
};

const getColor = (value: number) => {
  if (value >= 70) return "#4ade80"; // Green for good levels
  if (value >= 40) return "#facc15"; // Yellow for medium levels
  return "#f87171"; // Red for low levels
};

export default function ReservoirLiveMonitoring() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [selectedRegion, setSelectedRegion] = useState<string>("all");
  const [selectedReservoir, setSelectedReservoir] = useState<number | null>(null);
  const [reservoirData, setReservoirData] = useState(reservoirLocations);
  const [isUpdating, setIsUpdating] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [weatherRegion, setWeatherRegion] = useState<keyof WeatherData>("Toshkent");
  const mapRef = useRef<any>(null);
  
  // Handle region selection
  const handleRegionChange = (value: string) => {
    setSelectedRegion(value);
    if (value === "all") {
      setSelectedReservoir(null);
    }
  };
  
  // Update data periodically to simulate real-time changes
  const updateReservoirData = () => {
    setIsUpdating(true);
    
    setTimeout(() => {
      const updatedData = reservoirData.map(reservoir => {
        // Randomly alter level, inflow and outflow slightly
        const levelValue = parseInt(reservoir.level.replace("%", ""));
        const inflowValue = parseInt(reservoir.inflow.replace(" m³/s", ""));
        const outflowValue = parseInt(reservoir.outflow.replace(" m³/s", ""));
        
        const newLevelValue = Math.max(10, Math.min(95, levelValue + getRandomChange(-1, 1)));
        const newInflowValue = Math.max(5, inflowValue + getRandomChange());
        const newOutflowValue = Math.max(3, outflowValue + getRandomChange());
        
        return {
          ...reservoir,
          level: `${newLevelValue}%`,
          inflow: `${newInflowValue} m³/s`,
          outflow: `${newOutflowValue} m³/s`
        };
      });
      
      setReservoirData(updatedData);
      setLastUpdate(new Date());
      setIsUpdating(false);
      
      toast({
        title: "Ma'lumotlar yangilandi",
        description: `Barcha suv omborlari ma'lumotlari real vaqt rejimida yangilandi.`,
      });
    }, 1000);
  };
  
  // Handle manual refresh
  const handleRefresh = () => {
    if (!isUpdating) {
      updateReservoirData();
    }
  };
  
  // Format time
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('uz-UZ', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  };
  
  // Format date
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('uz-UZ', { 
      day: '2-digit', 
      month: '2-digit',
      year: 'numeric'
    });
  };
  
  // Filter reservoirs based on selected region
  const filteredReservoirs = selectedRegion === "all" 
    ? reservoirData
    : reservoirData.filter(r => r.region === selectedRegion);
  
  // Get selected reservoir details
  const selectedReservoirDetails = selectedReservoir 
    ? reservoirData.find(r => r.id === selectedReservoir)
    : null;
  
  // Set up automatic updates
  useEffect(() => {
    const intervalId = setInterval(() => {
      updateReservoirData();
    }, 60000 * 5); // Update every 5 minutes
    
    return () => clearInterval(intervalId);
  }, [reservoirData]);
  
  // Get related water sources and canals for a region
  const getRegionSources = (region: string) => {
    return waterSources.filter(source => source.regions.includes(region));
  };
  
  const getRegionCanals = (region: string) => {
    return canalNetworks.filter(canal => canal.regions.includes(region));
  };
  
  return (
    <DashboardLayout title="Suv omborlari monitoringi">
      <div className="p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Suv omborlari monitoringi</h1>
            <p className="text-gray-500 mt-1">
              O'zbekiston Respublikasi suv omborlari va kanallari real vaqt monitoringi
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center space-x-2">
            <div className="flex items-center mr-2 text-sm text-gray-500">
              <Calendar className="w-4 h-4 mr-1" />
              <span>{formatDate(lastUpdate)}</span>
              <Clock className="w-4 h-4 ml-2 mr-1" />
              <span>{formatTime(lastUpdate)}</span>
            </div>
            <Button 
              onClick={handleRefresh}
              disabled={isUpdating}
              className="flex items-center"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isUpdating ? 'animate-spin' : ''}`} />
              {isUpdating ? "Yangilanmoqda..." : "Yangilash"}
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="shadow-md">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle>Suv omborlari xaritasi</CardTitle>
                  <Select value={selectedRegion} onValueChange={handleRegionChange}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Viloyatni tanlang" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Barcha viloyatlar</SelectItem>
                      <SelectItem value="Toshkent">Toshkent</SelectItem>
                      <SelectItem value="Namangan">Namangan</SelectItem>
                      <SelectItem value="Andijon">Andijon</SelectItem>
                      <SelectItem value="Farg'ona">Farg'ona</SelectItem>
                      <SelectItem value="Jizzax">Jizzax</SelectItem>
                      <SelectItem value="Samarqand">Samarqand</SelectItem>
                      <SelectItem value="Qashqadaryo">Qashqadaryo</SelectItem>
                      <SelectItem value="Surxondaryo">Surxondaryo</SelectItem>
                      <SelectItem value="Navoiy">Navoiy</SelectItem>
                      <SelectItem value="Buxoro">Buxoro</SelectItem>
                      <SelectItem value="Xorazm">Xorazm</SelectItem>
                      <SelectItem value="Qoraqalpog'iston">Qoraqalpog'iston</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <CardDescription>
                  {selectedRegion === "all" 
                    ? "O'zbekiston bo'yicha barcha suv omborlari"
                    : `${selectedRegion} viloyati suv omborlari`
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[500px] rounded-md overflow-hidden">
                  {/* Map component */}
                  <MapContainer
                    center={[41.3775, 64.5853]} // Center on Uzbekistan
                    zoom={6}
                    style={{ height: "100%", width: "100%" }}
                    ref={mapRef}
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    
                    {/* Reservoir markers */}
                    {filteredReservoirs.map((reservoir) => {
                      const levelPercent = parseInt(reservoir.level.replace("%", ""));
                      return (
                        <div key={reservoir.id}>
                          <Marker 
                            position={reservoir.location}
                            eventHandlers={{
                              click: () => setSelectedReservoir(reservoir.id)
                            }}
                          >
                            <Tooltip direction="top" offset={[0, -10]} opacity={0.9} permanent>
                              {reservoir.name}: {reservoir.level}
                            </Tooltip>
                            <Popup>
                              <div className="p-1">
                                <h3 className="font-bold">{reservoir.name}</h3>
                                <p className="text-sm">Sig'imi: {reservoir.capacity}</p>
                                <p className="text-sm">Suv sathi: <span className="font-semibold">{reservoir.level}</span></p>
                                <p className="text-sm">Oqim kirishi: {reservoir.inflow}</p>
                                <p className="text-sm">Oqim chiqishi: {reservoir.outflow}</p>
                                <div className="mt-2">
                                  <Button 
                                    size="sm" 
                                    className="w-full text-xs"
                                    onClick={() => setSelectedReservoir(reservoir.id)}
                                  >
                                    To'liq ma'lumot
                                  </Button>
                                </div>
                              </div>
                            </Popup>
                          </Marker>
                          
                          {/* Circle to indicate water level */}
                          <Circle
                            center={reservoir.location}
                            radius={10000}
                            pathOptions={{
                              color: getColor(levelPercent),
                              fillColor: getColor(levelPercent),
                              fillOpacity: 0.3
                            }}
                          />
                        </div>
                      );
                    })}
                  </MapContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="space-y-6">
            {/* Weather information panel */}
            <Card className="shadow-md">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-base">Ob-havo ma'lumotlari</CardTitle>
                  <Select value={weatherRegion} onValueChange={setWeatherRegion}>
                    <SelectTrigger className="w-[160px]">
                      <SelectValue placeholder="Viloyatni tanlang" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Toshkent">Toshkent</SelectItem>
                      <SelectItem value="Namangan">Namangan</SelectItem>
                      <SelectItem value="Andijon">Andijon</SelectItem>
                      <SelectItem value="Farg'ona">Farg'ona</SelectItem>
                      <SelectItem value="Jizzax">Jizzax</SelectItem>
                      <SelectItem value="Samarqand">Samarqand</SelectItem>
                      <SelectItem value="Qashqadaryo">Qashqadaryo</SelectItem>
                      <SelectItem value="Surxondaryo">Surxondaryo</SelectItem>
                      <SelectItem value="Navoiy">Navoiy</SelectItem>
                      <SelectItem value="Buxoro">Buxoro</SelectItem>
                      <SelectItem value="Xorazm">Xorazm</SelectItem>
                      <SelectItem value="Qoraqalpog'iston">Qoraqalpog'iston</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex flex-col">
                      <span className="text-2xl font-bold">{weatherData[weatherRegion].temp}°C</span>
                      <span className="text-sm text-gray-500">{weatherData[weatherRegion].condition}</span>
                    </div>
                    <div>
                      <CloudSun className="w-12 h-12 text-blue-500" />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 pt-2">
                    <div className="flex flex-col items-center text-center p-2 bg-gray-50 rounded">
                      <CloudRain className="w-5 h-5 text-blue-500 mb-1" />
                      <span className="text-xs text-gray-500">Yog'ingarchilik</span>
                      <span className="text-sm font-medium">{weatherData[weatherRegion].precipitation}</span>
                    </div>
                    <div className="flex flex-col items-center text-center p-2 bg-gray-50 rounded">
                      <Wind className="w-5 h-5 text-blue-500 mb-1" />
                      <span className="text-xs text-gray-500">Shamol</span>
                      <span className="text-sm font-medium">{weatherData[weatherRegion].windSpeed} km/s</span>
                    </div>
                    <div className="flex flex-col items-center text-center p-2 bg-gray-50 rounded">
                      <Droplet className="w-5 h-5 text-blue-500 mb-1" />
                      <span className="text-xs text-gray-500">Namlik</span>
                      <span className="text-sm font-medium">{weatherData[weatherRegion].humidity}%</span>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <h3 className="text-sm font-medium mb-2">5 kunlik bashorat</h3>
                    <div className="grid grid-cols-5 gap-1">
                      {weatherData[weatherRegion].forecastNext5Days.map((day, index) => (
                        <div key={index} className="flex flex-col items-center text-center p-1">
                          <span className="text-xs font-medium">{day.day.substring(0, 2)}</span>
                          <span className="text-xs">{day.temp}°C</span>
                          <span className="text-xs text-blue-500">{day.precipitation}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Reservoir detail panel or water distribution widget */}
            {selectedReservoirDetails ? (
              <Card className="shadow-md">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-base font-medium">{selectedReservoirDetails.name}</CardTitle>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setSelectedReservoir(null)}
                    >
                      Yopish
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="details">
                    <TabsList className="grid grid-cols-2 mb-4">
                      <TabsTrigger value="details">Tafsilotlar</TabsTrigger>
                      <TabsTrigger value="sources">Suv manbalari</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="details" className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-blue-50 p-3 rounded-lg">
                          <div className="text-xs text-blue-500 mb-1">Sig'imi</div>
                          <div className="font-semibold">{selectedReservoirDetails.capacity}</div>
                        </div>
                        <div className="bg-green-50 p-3 rounded-lg">
                          <div className="text-xs text-green-500 mb-1">Suv sathi</div>
                          <div className="font-semibold">{selectedReservoirDetails.level}</div>
                        </div>
                        <div className="bg-amber-50 p-3 rounded-lg">
                          <div className="text-xs text-amber-500 mb-1">Oqim kirishi</div>
                          <div className="font-semibold">{selectedReservoirDetails.inflow}</div>
                        </div>
                        <div className="bg-red-50 p-3 rounded-lg">
                          <div className="text-xs text-red-500 mb-1">Oqim chiqishi</div>
                          <div className="font-semibold">{selectedReservoirDetails.outflow}</div>
                        </div>
                      </div>
                      
                      <div className="pt-2">
                        <h3 className="text-sm font-medium mb-2">Suv manbaalari</h3>
                        <div className="text-sm">
                          {getRegionSources(selectedReservoirDetails.region).map(source => (
                            <div key={source.id} className="flex items-center py-1.5">
                              <Droplet className="w-4 h-4 text-blue-500 mr-2" />
                              <span>{source.name} ({source.type})</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="pt-2">
                        <h3 className="text-sm font-medium mb-2">Suv kanallari</h3>
                        <div className="text-sm">
                          {getRegionCanals(selectedReservoirDetails.region).map(canal => (
                            <div key={canal.id} className="flex items-center py-1.5">
                              <Droplet className="w-4 h-4 text-blue-500 mr-2" />
                              <span>{canal.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="sources">
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-sm font-medium mb-2">Hudud suv manbalari</h3>
                          <div className="space-y-2">
                            {getRegionSources(selectedReservoirDetails.region).map(source => (
                              <div key={source.id} className="bg-blue-50 p-3 rounded-lg">
                                <div className="flex justify-between items-center">
                                  <div>
                                    <div className="font-medium">{source.name}</div>
                                    <div className="text-xs text-gray-500">{source.type}</div>
                                  </div>
                                  <Droplet className="w-5 h-5 text-blue-500" />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="text-sm font-medium mb-2">Suv kanallari</h3>
                          <div className="space-y-2">
                            {getRegionCanals(selectedReservoirDetails.region).map(canal => (
                              <div key={canal.id} className="bg-blue-50 p-3 rounded-lg">
                                <div className="flex justify-between items-center">
                                  <div>
                                    <div className="font-medium">{canal.name}</div>
                                    <div className="text-xs text-gray-500">
                                      Manba: {canal.sourceName}
                                    </div>
                                  </div>
                                  <Droplet className="w-5 h-5 text-blue-500" />
                                </div>
                                <div className="text-xs mt-1 text-gray-500">
                                  {canal.regions.join(', ')}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            ) : (
              <WaterDistributionWidget />
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}