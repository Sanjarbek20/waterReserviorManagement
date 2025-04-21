import React, { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { MapContainer, TileLayer, Marker, Popup, Tooltip, Circle, Polyline, CircleMarker } from "react-leaflet";
import { Droplet, CloudRain, Wind, Thermometer, CloudSun, Calendar, Clock, RefreshCw, Map as MapIcon, Filter, Download, Database } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DashboardLayout from "@/components/layout/dashboard-layout";
import WaterDistributionWidget from "@/components/dashboard/water-distribution-widget";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { crossBorderReservoirs } from "@/data/cross-border-reservoirs";
import { canalSystems, getCanalsByReservoir } from "@/data/canal-systems";

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

// Custom icon for reservoirs
const reservoirIcon = new L.Icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

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

const canalNetworkData = [
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

// Helper function for canal colors
const getCanalColor = (canal: any) => {
  // Color based on capacity
  if (canal.capacity > 200) return "#0000FF"; // Blue for large canals
  if (canal.capacity > 100) return "#4169E1"; // Royal blue for medium canals
  return "#87CEEB"; // Sky blue for smaller canals
};

// Color for cross-border reservoirs by country
const colorByCountry = (country: string) => {
  if (country.includes("Qirg'iziston")) return "#FF5733";
  if (country.includes("Qozog'iston")) return "#33A1FF";
  if (country.includes("Tojikiston")) return "#33FFC1";
  if (country.includes("Turkmaniston")) return "#FF33A8";
  return "#4CAF50"; // O'zbekiston
};

export default function ReservoirCombinedMonitoring() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [selectedRegion, setSelectedRegion] = useState<string>("all");
  const [selectedReservoir, setSelectedReservoir] = useState<number | null>(null);
  const [reservoirData, setReservoirData] = useState(reservoirLocations);
  const [isUpdating, setIsUpdating] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [weatherRegion, setWeatherRegion] = useState<keyof WeatherData>("Toshkent");
  const mapRef = useRef<any>(null);
  const [activeTab, setActiveTab] = useState("local");
  
  // Cross-border reservoir states
  const [showCanals, setShowCanals] = useState(true);
  const [showDistricts, setShowDistricts] = useState(true);
  const [showCrossBorder, setShowCrossBorder] = useState(true);
  const [selectedCountry, setSelectedCountry] = useState<string>("all");
  const [selectedCBRegion, setSelectedCBRegion] = useState<string>("all");
  
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

  // Filter cross-border reservoirs
  const filteredCrossReservoirs = crossBorderReservoirs.filter(reservoir => {
    if (!showCrossBorder) return false;
    if (selectedCountry !== "all" && !reservoir.country.includes(selectedCountry)) return false;
    if (selectedCBRegion !== "all" && !reservoir.servedRegions.some(region => region.includes(selectedCBRegion))) return false;
    return true;
  });
  
  // Download CSV function for cross-border reservoirs
  const handleDownloadCSV = () => {
    // Create CSV content from reservoirs data
    const headers = ["Nomi", "Davlat", "Sig'imi (mln m³)", "Joriy sathi (mln m³)", "Daryolar", "Xizmat ko'rsatadigan hududlar", "Asosiy kanallar", "Nazorat"];
    
    const rows = filteredCrossReservoirs.map(reservoir => [
      reservoir.name,
      reservoir.country,
      reservoir.capacity,
      reservoir.currentLevel,
      reservoir.rivers.join(', '),
      reservoir.servedRegions.join(', '),
      reservoir.mainCanals.join(', '),
      reservoir.underUzbekControl 
        ? "O'zbekiston nazoratida" 
        : reservoir.sharedControl 
          ? "Hamkorlikda nazorat qilinadi" 
          : "Boshqa davlat nazoratida"
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');
    
    // Create and download the file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'chegaradan-tashqari-suv-omborlari.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Render canals function for cross-border map
  const renderCanals = () => {
    if (!showCanals) return null;
    
    return canalSystems.map(canal => {
      // Simplify by using the start and end points if no path is provided
      const pathCoordinates = canal.coordinates.path || [
        [canal.coordinates.startPoint.lat, canal.coordinates.startPoint.lng],
        [canal.coordinates.endPoint.lat, canal.coordinates.endPoint.lng]
      ];
      
      // If path exists, convert to the format needed by Polyline
      const formattedPath = canal.coordinates.path 
        ? canal.coordinates.path.map(point => [point.lat, point.lng])
        : pathCoordinates;
      
      return (
        <React.Fragment key={canal.id}>
          <Polyline
            positions={formattedPath as any}
            color={getCanalColor(canal)}
            weight={3}
            opacity={0.8}
          >
            <Tooltip permanent direction="top" className="canal-tooltip">
              {canal.name}
            </Tooltip>
          </Polyline>
          
          {/* Add markers for canal start and end points */}
          <CircleMarker 
            center={[canal.coordinates.startPoint.lat, canal.coordinates.startPoint.lng]}
            radius={5}
            color="#000"
            fillColor={getCanalColor(canal)}
            fillOpacity={1}
          >
            <Tooltip>
              {canal.name} boshi
            </Tooltip>
          </CircleMarker>
          
          <CircleMarker 
            center={[canal.coordinates.endPoint.lat, canal.coordinates.endPoint.lng]}
            radius={5}
            color="#000"
            fillColor={getCanalColor(canal)}
            fillOpacity={1}
          >
            <Tooltip>
              {canal.name} oxiri
            </Tooltip>
          </CircleMarker>
        </React.Fragment>
      );
    });
  };
  
  // Set up automatic updates
  useEffect(() => {
    const intervalId = setInterval(() => {
      updateReservoirData();
    }, 60000 * 5); // Update every 5 minutes
    
    return () => clearInterval(intervalId);
  }, [reservoirData]);
  
  return (
    <DashboardLayout title="Suv omborlari monitoringi xaritada">
      <Tabs defaultValue="local" className="space-y-4" onValueChange={setActiveTab}>
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="local">O'zbekiston suv omborlari</TabsTrigger>
            <TabsTrigger value="cross-border">Chegaradoshi davlatlar suv omborlari</TabsTrigger>
          </TabsList>
          
          <div className="flex items-center space-x-2">
            {activeTab === "local" && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={isUpdating}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isUpdating ? 'animate-spin' : ''}`} />
                {isUpdating ? "Yangilanmoqda..." : "Yangilash"}
              </Button>
            )}
            
            {activeTab === "cross-border" && (
              <Button variant="outline" size="sm" onClick={handleDownloadCSV}>
                <Download className="h-4 w-4 mr-2" />
                CSV yuklab olish
              </Button>
            )}
          </div>
        </div>

        {/* O'zbekiston suv omborlari tab */}
        <TabsContent value="local" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Left column - map and controls */}
            <div className="md:col-span-8 space-y-4">
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>O'zbekiston suv omborlari xaritasi</CardTitle>
                      <CardDescription>
                        Real vaqt rejimida suv omborlari monitoringi
                      </CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="text-sm text-gray-500">
                        <Calendar className="h-4 w-4 inline-block mr-1" />
                        {formatDate(lastUpdate)}
                      </div>
                      <div className="text-sm text-gray-500">
                        <Clock className="h-4 w-4 inline-block mr-1" />
                        {formatTime(lastUpdate)}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="mb-4 flex flex-wrap gap-4">
                    <Select value={selectedRegion} onValueChange={handleRegionChange}>
                      <SelectTrigger className="w-full md:w-[200px]">
                        <SelectValue placeholder="Viloyatni tanlang" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Barcha viloyatlar</SelectItem>
                        <SelectItem value="Toshkent">Toshkent</SelectItem>
                        <SelectItem value="Andijon">Andijon</SelectItem>
                        <SelectItem value="Namangan">Namangan</SelectItem>
                        <SelectItem value="Farg'ona">Farg'ona</SelectItem>
                        <SelectItem value="Jizzax">Jizzax</SelectItem>
                        <SelectItem value="Sirdaryo">Sirdaryo</SelectItem>
                        <SelectItem value="Samarqand">Samarqand</SelectItem>
                        <SelectItem value="Qashqadaryo">Qashqadaryo</SelectItem>
                        <SelectItem value="Surxondaryo">Surxondaryo</SelectItem>
                        <SelectItem value="Navoiy">Navoiy</SelectItem>
                        <SelectItem value="Buxoro">Buxoro</SelectItem>
                        <SelectItem value="Xorazm">Xorazm</SelectItem>
                        <SelectItem value="Qoraqalpog'iston">Qoraqalpog'iston</SelectItem>
                      </SelectContent>
                    </Select>

                    {selectedRegion !== "all" && (
                      <Select 
                        value={weatherRegion}
                        onValueChange={(value: string) => setWeatherRegion(value as keyof WeatherData)}
                      >
                        <SelectTrigger className="w-full md:w-[200px]">
                          <SelectValue placeholder="Ob-havo ma'lumotlarini ko'rish" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.keys(weatherData).map(region => (
                            <SelectItem key={region} value={region}>{region}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                  
                  <div className="h-[500px] rounded overflow-hidden">
                    <MapContainer 
                      center={[41.3775, 64.5853]} 
                      zoom={6} 
                      style={{ height: "100%", width: "100%" }}
                      scrollWheelZoom={true}
                      ref={mapRef}
                    >
                      <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />
                      
                      {filteredReservoirs.map((reservoir) => {
                        const levelPercentage = parseInt(reservoir.level.replace("%", ""));
                        return (
                          <React.Fragment key={reservoir.id}>
                            <Circle
                              center={reservoir.location}
                              radius={20000} // 20km radius, scaled to show importance
                              pathOptions={{
                                fillColor: getColor(levelPercentage),
                                fillOpacity: 0.5,
                                color: getColor(levelPercentage),
                                weight: 1
                              }}
                            />
                            <Marker 
                              position={reservoir.location}
                              eventHandlers={{
                                click: () => {
                                  setSelectedReservoir(reservoir.id);
                                }
                              }}
                            >
                              <Tooltip permanent={selectedReservoir === reservoir.id}>
                                {reservoir.name} ({reservoir.level})
                              </Tooltip>
                              <Popup>
                                <div className="p-1">
                                  <h3 className="font-medium text-lg">{reservoir.name}</h3>
                                  <p><strong>Hajmi:</strong> {reservoir.capacity}</p>
                                  <p><strong>Suv sathi:</strong> {reservoir.level}</p>
                                  <p><strong>Kirim:</strong> {reservoir.inflow}</p>
                                  <p><strong>Chiqim:</strong> {reservoir.outflow}</p>
                                  <p><strong>Viloyat:</strong> {reservoir.region}</p>
                                </div>
                              </Popup>
                            </Marker>
                          </React.Fragment>
                        );
                      })}
                    </MapContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Right column - weather and reservoir details */}
            <div className="md:col-span-4 space-y-4">
              {/* Weather card */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Ob-havo ma'lumotlari</CardTitle>
                  <CardDescription>
                    {selectedRegion === "all" ? "O'zbekiston" : selectedRegion} viloyati
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between border-b pb-4 mb-4">
                    <div>
                      <h3 className="text-xl font-medium">{weatherData[weatherRegion].condition}</h3>
                      <p className="text-sm text-gray-500">{selectedRegion === "all" ? "Toshkent" : weatherRegion}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold">{weatherData[weatherRegion].temp}°C</p>
                      <div className="flex items-center justify-end gap-2 text-sm text-gray-500">
                        <span><CloudRain className="h-4 w-4 inline mr-1" />{weatherData[weatherRegion].precipitation}</span>
                        <span><Wind className="h-4 w-4 inline mr-1" />{weatherData[weatherRegion].windSpeed} km/s</span>
                      </div>
                    </div>
                  </div>
                  
                  <h4 className="font-medium mb-2">Yaqin kunlar ob-havosi</h4>
                  <div className="grid grid-cols-5 gap-2">
                    {weatherData[weatherRegion].forecastNext5Days.map((day, idx) => (
                      <div key={idx} className="text-center">
                        <p className="text-xs">{day.day.substring(0, 3)}</p>
                        <p className="text-lg font-medium">{day.temp}°</p>
                        <p className="text-xs text-gray-500">{day.precipitation}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              {/* Selected reservoir details */}
              {selectedReservoirDetails && (
                <Card>
                  <CardHeader>
                    <CardTitle>{selectedReservoirDetails.name}</CardTitle>
                    <CardDescription>Suv ombori ma'lumotlari</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="text-sm font-medium">Suv hajmi</div>
                          <div className="text-2xl font-bold">{selectedReservoirDetails.capacity}</div>
                        </div>
                        <div className="space-y-2">
                          <div className="text-sm font-medium">Suv sathi</div>
                          <div className="text-2xl font-bold">{selectedReservoirDetails.level}</div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="text-sm font-medium">Kirim</div>
                          <div className="text-2xl font-bold">{selectedReservoirDetails.inflow}</div>
                        </div>
                        <div className="space-y-2">
                          <div className="text-sm font-medium">Chiqim</div>
                          <div className="text-2xl font-bold">{selectedReservoirDetails.outflow}</div>
                        </div>
                      </div>
                      
                      <div className="pt-4 border-t">
                        <h4 className="font-medium mb-2">Viloyat ob-havosi</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <div className="text-sm text-gray-500 flex items-center">
                              <Thermometer className="h-4 w-4 mr-1" /> Harorat
                            </div>
                            <div>{weatherData[selectedReservoirDetails.region].temp}°C</div>
                          </div>
                          <div className="space-y-1">
                            <div className="text-sm text-gray-500 flex items-center">
                              <CloudSun className="h-4 w-4 mr-1" /> Ob-havo
                            </div>
                            <div>{weatherData[selectedReservoirDetails.region].condition}</div>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mt-2">
                          <div className="space-y-1">
                            <div className="text-sm text-gray-500 flex items-center">
                              <CloudRain className="h-4 w-4 mr-1" /> Yog'ingarchilik
                            </div>
                            <div>{weatherData[selectedReservoirDetails.region].precipitation}</div>
                          </div>
                          <div className="space-y-1">
                            <div className="text-sm text-gray-500 flex items-center">
                              <Wind className="h-4 w-4 mr-1" /> Shamol tezligi
                            </div>
                            <div>{weatherData[selectedReservoirDetails.region].windSpeed} km/s</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {/* Canal information if no reservoir is selected */}
              {!selectedReservoirDetails && (
                <Card>
                  <CardHeader>
                    <CardTitle>Suv manbalari va kanallar</CardTitle>
                    <CardDescription>
                      O'zbekistondagi asosiy suv manbalari va magistral kanallar
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <h4 className="font-medium mb-2">Asosiy daryolar</h4>
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      {waterSources.map(source => (
                        <div key={source.id} className="flex items-center space-x-2">
                          <Droplet className="h-4 w-4 text-blue-500" />
                          <span>{source.name}</span>
                        </div>
                      ))}
                    </div>
                    
                    <h4 className="font-medium mb-2">Asosiy magistral kanallar</h4>
                    <div className="space-y-2">
                      {canalNetworkData.map(canal => (
                        <div key={canal.id} className="border-b pb-2 last:border-0">
                          <div className="font-medium">{canal.name}</div>
                          <div className="text-sm text-gray-500">
                            Manba: {canal.sourceName} | 
                            Viloyatlar: {canal.regions.join(", ")}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
          
          {/* Water distribution widget */}
          <div className="grid grid-cols-1 gap-4">
            <WaterDistributionWidget />
          </div>
        </TabsContent>

        {/* Chegaradoshi davlatlar tab */}
        <TabsContent value="cross-border" className="space-y-4">
          <Card className="shadow-md w-full">
            <CardHeader className="pb-2">
              <CardTitle>O'zbekiston va chegaradosh davlatlar suv omborlari va kanal tarmoqlari</CardTitle>
              <CardDescription>
                O'zbekiston nazorati ostidagi barcha suv omborlari va ulardan chiqadigan suv ta'minoti kanallari
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-4">
                <div className="flex flex-wrap gap-4 mb-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={showCanals}
                      onCheckedChange={setShowCanals}
                      id="show-canals"
                    />
                    <Label htmlFor="show-canals">Kanallarni ko'rsatish</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={showDistricts}
                      onCheckedChange={setShowDistricts}
                      id="show-districts"
                    />
                    <Label htmlFor="show-districts">Tumanlarni ko'rsatish</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={showCrossBorder}
                      onCheckedChange={setShowCrossBorder}
                      id="show-cross-border"
                    />
                    <Label htmlFor="show-cross-border">Chegaradan tashqaridagi suv omborlarini ko'rsatish</Label>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-4 mb-4">
                  <div className="w-full md:w-1/3">
                    <Label htmlFor="country-filter">Davlat bo'yicha saralash</Label>
                    <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Davlatni tanlang" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Barchasi</SelectItem>
                        <SelectItem value="O'zbekiston">O'zbekiston</SelectItem>
                        <SelectItem value="Qirg'iziston">Qirg'iziston</SelectItem>
                        <SelectItem value="Qozog'iston">Qozog'iston</SelectItem>
                        <SelectItem value="Tojikiston">Tojikiston</SelectItem>
                        <SelectItem value="Turkmaniston">Turkmaniston</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="w-full md:w-1/3">
                    <Label htmlFor="region-filter">Viloyat bo'yicha saralash</Label>
                    <Select value={selectedCBRegion} onValueChange={setSelectedCBRegion}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Viloyatni tanlang" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Barchasi</SelectItem>
                        <SelectItem value="Andijon">Andijon viloyati</SelectItem>
                        <SelectItem value="Farg'ona">Farg'ona viloyati</SelectItem>
                        <SelectItem value="Namangan">Namangan viloyati</SelectItem>
                        <SelectItem value="Sirdaryo">Sirdaryo viloyati</SelectItem>
                        <SelectItem value="Jizzax">Jizzax viloyati</SelectItem>
                        <SelectItem value="Xorazm">Xorazm viloyati</SelectItem>
                        <SelectItem value="Qoraqalpog'iston">Qoraqalpog'iston Respublikasi</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="h-[600px] rounded overflow-hidden">
                  <MapContainer
                    center={[41.3775, 64.5853]}
                    zoom={6}
                    scrollWheelZoom={true}
                    style={{ height: "100%", width: "100%" }}
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    {/* Render reservoirs */}
                    {filteredCrossReservoirs.map((reservoir) => (
                      <Marker
                        key={reservoir.id}
                        position={[reservoir.location.lat, reservoir.location.lng]}
                        icon={reservoirIcon}
                      >
                        <Popup>
                          <div className="text-sm">
                            <h3 className="font-medium text-base">{reservoir.name}</h3>
                            <p className="mb-1">
                              <Badge variant="outline" style={{ backgroundColor: colorByCountry(reservoir.country) }}>
                                {reservoir.country}
                              </Badge>
                            </p>
                            <p><strong>Hajmi:</strong> {reservoir.capacity} mln m³</p>
                            <p><strong>Joriy suv sathi:</strong> {reservoir.currentLevel} mln m³</p>
                            <p><strong>Daryolar:</strong> {reservoir.rivers.join(', ')}</p>
                            <div className="mt-2">
                              <strong>Xizmat ko'rsatadigan hududlar:</strong>
                              <ul className="list-disc list-inside text-xs">
                                {reservoir.servedRegions.map((region, idx) => (
                                  <li key={idx}>{region}</li>
                                ))}
                              </ul>
                            </div>
                            <div className="mt-2">
                              <strong>Asosiy kanallar:</strong>
                              <ul className="list-disc list-inside text-xs">
                                {reservoir.mainCanals.map((canal, idx) => (
                                  <li key={idx}>{canal}</li>
                                ))}
                              </ul>
                            </div>
                            <div className="mt-2">
                              <p>
                                <strong>Nazorat:</strong>{" "}
                                {reservoir.underUzbekControl 
                                  ? "O'zbekiston tomonidan nazorat qilinadi" 
                                  : reservoir.sharedControl 
                                    ? "Hamkorlikda nazorat qilinadi" 
                                    : "Boshqa davlat nazoratida"}
                              </p>
                            </div>
                          </div>
                        </Popup>
                      </Marker>
                    ))}

                    {/* Render canals */}
                    {renderCanals()}
                  </MapContainer>
                </div>

                <div className="mt-4 border rounded-md p-4">
                  <h3 className="text-lg font-medium mb-2">Ma'lumotlar manbalari</h3>
                  <ul className="list-disc list-inside">
                    <li>O'zbekiston Respublikasi Suv xo'jaligi vazirligi</li>
                    <li>ICWC - Xalqaro suv muvofiqlashtirish komissiyasi</li>
                    <li>Interstate Commission for Water Coordination of Central Asia</li>
                    <li>Oʻzbekiston Suv resurslari markazi</li>
                    <li>GIS ma'lumotlar bazasi - Oʻzbekiston Gidrogeologiya va Davlat suv kadastri</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Suv omborlari statistikasi</CardTitle>
              <CardDescription>
                O'zbekiston nazorati ostidagi suv omborlari to'g'risida umumiy ma'lumot
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <h3 className="text-lg font-medium text-blue-800">Umumiy hajmi</h3>
                  <p className="text-2xl font-bold text-blue-600">
                    {crossBorderReservoirs.reduce((sum, r) => sum + parseInt(r.capacity), 0).toLocaleString()} mln m³
                  </p>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg text-center">
                  <h3 className="text-lg font-medium text-green-800">O'zbekiston nazoratidagi suv omborlari</h3>
                  <p className="text-2xl font-bold text-green-600">
                    {crossBorderReservoirs.filter(r => r.underUzbekControl || r.sharedControl).length} ta
                  </p>
                </div>
                
                <div className="bg-amber-50 p-4 rounded-lg text-center">
                  <h3 className="text-lg font-medium text-amber-800">Asosiy kanallar</h3>
                  <p className="text-2xl font-bold text-amber-600">
                    {canalSystems.length} ta
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}