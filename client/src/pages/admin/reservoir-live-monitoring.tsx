import { useState, useEffect, useRef } from "react";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";
import { DropletIcon, CloudRainIcon, ThermometerIcon, Wind, Map, Clock, Calendar, RefreshCw } from "lucide-react";
import { Reservoir } from "@shared/schema";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { format } from "date-fns";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

// Leaflet ikonasi uchun workaround
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// Custom ikonalar uchun
const dropletIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiMwMDg4ZmYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBjbGFzcz0ibHVjaWRlIGx1Y2lkZS1kcm9wbGV0Ij48cGF0aCBkPSJNMTIgMmwtNS41IDkuNWE3IDcgMCAxIDAgNS41IDVjMS43Mi0yLjAxIDMuOC00Ljc2IDUuNS05LjUiLz48L3N2Zz4=',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32]
});

// Viloyatlar uchun koordinatalar
const regions = [
  { id: 1, name: "Toshkent viloyati", lat: 41.2995, lng: 69.2401, reservoirs: 5 },
  { id: 2, name: "Andijon viloyati", lat: 40.7828, lng: 72.3442, reservoirs: 4 },
  { id: 3, name: "Farg'ona viloyati", lat: 40.3864, lng: 71.7834, reservoirs: 3 },
  { id: 4, name: "Namangan viloyati", lat: 41.0011, lng: 71.6637, reservoirs: 3 },
  { id: 5, name: "Sirdaryo viloyati", lat: 40.8370, lng: 68.6616, reservoirs: 2 },
  { id: 6, name: "Jizzax viloyati", lat: 40.1158, lng: 67.8422, reservoirs: 2 },
  { id: 7, name: "Samarqand viloyati", lat: 39.6542, lng: 66.9597, reservoirs: 3 },
  { id: 8, name: "Qashqadaryo viloyati", lat: 38.8986, lng: 65.7986, reservoirs: 4 },
  { id: 9, name: "Surxondaryo viloyati", lat: 37.9406, lng: 67.5710, reservoirs: 3 },
  { id: 10, name: "Buxoro viloyati", lat: 39.7680, lng: 64.4216, reservoirs: 2 },
  { id: 11, name: "Navoiy viloyati", lat: 40.1011, lng: 65.3792, reservoirs: 2 },
  { id: 12, name: "Xorazm viloyati", lat: 41.3775, lng: 60.3594, reservoirs: 1 },
  { id: 13, name: "Qoraqalpog'iston Respublikasi", lat: 43.8042, lng: 59.0196, reservoirs: 3 },
];

// Suv omborlari ma'lumotlari
const reservoirLocations = [
  { id: 1, name: "Chorvoq suv ombori", region: "Toshkent viloyati", lat: 41.5695, lng: 70.0848, capacity: 2000000, currentLevel: 1850000, inflowRate: 450, outflowRate: 380, type: "irrigation", lastUpdated: new Date().toISOString(), rainfallPrediction: 35, waterQuality: "Good" },
  { id: 2, name: "Tuyamo'yin suv ombori", region: "Qoraqalpog'iston", lat: 41.2060, lng: 61.3784, capacity: 7800000, currentLevel: 5200000, inflowRate: 720, outflowRate: 750, type: "irrigation", lastUpdated: new Date().toISOString(), rainfallPrediction: 10, waterQuality: "Moderate" },
  { id: 3, name: "Andijon suv ombori", region: "Andijon viloyati", lat: 40.8929, lng: 73.0651, capacity: 1900000, currentLevel: 1700000, inflowRate: 380, outflowRate: 360, type: "irrigation", lastUpdated: new Date().toISOString(), rainfallPrediction: 45, waterQuality: "Good" },
  { id: 4, name: "Kattaqo'rg'on suv ombori", region: "Samarqand viloyati", lat: 39.9014, lng: 66.2669, capacity: 900000, currentLevel: 750000, inflowRate: 250, outflowRate: 280, type: "irrigation", lastUpdated: new Date().toISOString(), rainfallPrediction: 5, waterQuality: "Good" },
  { id: 5, name: "Talimarjon suv ombori", region: "Qashqadaryo viloyati", lat: 38.4062, lng: 65.7145, capacity: 1525000, currentLevel: 1320000, inflowRate: 290, outflowRate: 320, type: "irrigation", lastUpdated: new Date().toISOString(), rainfallPrediction: 0, waterQuality: "Good" },
  { id: 6, name: "Chim qo'rg'on suv ombori", region: "Qashqadaryo viloyati", lat: 38.7820, lng: 65.6348, capacity: 500000, currentLevel: 380000, inflowRate: 140, outflowRate: 155, type: "irrigation", lastUpdated: new Date().toISOString(), rainfallPrediction: 0, waterQuality: "Moderate" },
  { id: 7, name: "Jizzax suv ombori", region: "Jizzax viloyati", lat: 40.1348, lng: 67.8456, capacity: 100000, currentLevel: 85000, inflowRate: 60, outflowRate: 65, type: "irrigation", lastUpdated: new Date().toISOString(), rainfallPrediction: 20, waterQuality: "Good" },
  { id: 8, name: "Ahangaron suv ombori", region: "Toshkent viloyati", lat: 40.9437, lng: 69.8373, capacity: 260000, currentLevel: 230000, inflowRate: 80, outflowRate: 70, type: "irrigation", lastUpdated: new Date().toISOString(), rainfallPrediction: 30, waterQuality: "Good" },
  { id: 9, name: "Quyimozor suv ombori", region: "Buxoro viloyati", lat: 39.7258, lng: 64.8772, capacity: 310000, currentLevel: 250000, inflowRate: 90, outflowRate: 95, type: "irrigation", lastUpdated: new Date().toISOString(), rainfallPrediction: 0, waterQuality: "Moderate" },
  { id: 10, name: "To'dako'l suv ombori", region: "Navoiy viloyati", lat: 40.2385, lng: 65.0204, capacity: 520000, currentLevel: 480000, inflowRate: 120, outflowRate: 110, type: "irrigation", lastUpdated: new Date().toISOString(), rainfallPrediction: 0, waterQuality: "Good" },
];

// Yog'ingarchilik ma'lumotlari
const rainData = [
  { region: "Toshkent viloyati", prediction: 35, lastMonth: 42, lastYear: 38 },
  { region: "Andijon viloyati", prediction: 45, lastMonth: 50, lastYear: 42 },
  { region: "Farg'ona viloyati", prediction: 40, lastMonth: 45, lastYear: 40 },
  { region: "Namangan viloyati", prediction: 38, lastMonth: 40, lastYear: 36 },
  { region: "Sirdaryo viloyati", prediction: 20, lastMonth: 25, lastYear: 22 },
  { region: "Jizzax viloyati", prediction: 20, lastMonth: 24, lastYear: 18 },
  { region: "Samarqand viloyati", prediction: 30, lastMonth: 32, lastYear: 28 },
  { region: "Qashqadaryo viloyati", prediction: 0, lastMonth: 10, lastYear: 8 },
  { region: "Surxondaryo viloyati", prediction: 5, lastMonth: 12, lastYear: 10 },
  { region: "Buxoro viloyati", prediction: 0, lastMonth: 5, lastYear: 4 },
  { region: "Navoiy viloyati", prediction: 0, lastMonth: 8, lastYear: 6 },
  { region: "Xorazm viloyati", prediction: 15, lastMonth: 20, lastYear: 18 },
  { region: "Qoraqalpog'iston Respublikasi", prediction: 10, lastMonth: 15, lastYear: 12 },
];

// Suv taqsimoti ma'lumotlari (viloyatlarga ko'ra)
const waterDistribution = [
  { name: "Sholi maydonlari", value: 45 },
  { name: "Sabzavot fermalari", value: 30 },
  { name: "Bug'doy maydonlari", value: 15 },
  { name: "Boshqa ekinlar", value: 10 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

// Suv sifati indikatori
type WaterQuality = "Good" | "Moderate" | "Poor";
const getWaterQualityColor = (quality: WaterQuality) => {
  switch (quality) {
    case "Good": return "bg-green-500";
    case "Moderate": return "bg-yellow-500";
    case "Poor": return "bg-red-500";
    default: return "bg-gray-500";
  }
};

export default function ReservoirLiveMonitoring() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [selectedReservoirId, setSelectedReservoirId] = useState<string>("");
  const [selectedRegionId, setSelectedRegionId] = useState<string>("");
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [mapCenter, setMapCenter] = useState<[number, number]>([41.3111, 69.2402]);
  const [mapZoom, setMapZoom] = useState<number>(6);
  const mapRef = useRef<any>(null);
  const [reservoirs, setReservoirs] = useState<any[]>(reservoirLocations);
  const [selectedReservoir, setSelectedReservoir] = useState<any | null>(null);
  const [infoType, setInfoType] = useState<"current" | "forecast">("current");
  const [waterlevelHistory, setWaterlevelHistory] = useState<any[]>([]);
  const [weatherForecast, setWeatherForecast] = useState<any[]>([]);
  const [regionalData, setRegionalData] = useState<any[]>(regions);
  
  // WebSocket bilan bog'lanish
  useEffect(() => {
    const ws = new WebSocket(`${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}/ws`);
    
    ws.onopen = () => {
      console.log('WebSocket connected');
      ws.send(JSON.stringify({ type: 'get_reservoirs' }));
    };
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      if (data.type === 'reservoir_data') {
        // Real ma'lumotlar kelganda yangilash
        // setReservoirs(data.reservoirs);
      }
    };
    
    ws.onclose = () => {
      console.log('WebSocket disconnected');
    };
    
    return () => {
      ws.close();
    };
  }, []);
  
  // Suv ombori tanlanishi
  useEffect(() => {
    if (selectedReservoirId) {
      const reservoir = reservoirLocations.find(r => r.id === parseInt(selectedReservoirId));
      
      if (reservoir) {
        setSelectedReservoir(reservoir);
        setMapCenter([reservoir.lat, reservoir.lng]);
        setMapZoom(10);
        
        // Suv ombori tarixiy ma'lumotlarini generatsiya qilish
        generateWaterLevelHistory(reservoir);
        generateWeatherForecast(reservoir);
      }
    }
  }, [selectedReservoirId]);
  
  // Viloyat tanlanishi
  useEffect(() => {
    if (selectedRegionId) {
      const region = regions.find(r => r.id === parseInt(selectedRegionId));
      
      if (region) {
        setMapCenter([region.lat, region.lng]);
        setMapZoom(8);
      }
    }
  }, [selectedRegionId]);
  
  // Ma'lumotlarni yangilash (har 10 sekundda)
  useEffect(() => {
    const interval = setInterval(() => {
      updateReservoirs();
    }, 10000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Test uchun - so'nggi 30 kunlik tarixiy ma'lumotlarni generatsiya qilish
  const generateWaterLevelHistory = (reservoir: any) => {
    const now = new Date();
    const history = [];
    
    // So'nggi 30 kun uchun
    for (let i = 30; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      
      // Tarixiy ma'lumotlarni simulatsiya qilish
      // Tarixda suv sathi biroz o'zgaruvchan
      const randomFactor = Math.random() * 0.1 - 0.05; // -5% to +5%
      const level = Math.round(reservoir.currentLevel * (1 + randomFactor));
      
      history.push({
        date: date.toISOString().split('T')[0],
        level,
        inflow: Math.round(reservoir.inflowRate * (1 + Math.random() * 0.2 - 0.1)),
        outflow: Math.round(reservoir.outflowRate * (1 + Math.random() * 0.2 - 0.1)),
      });
    }
    
    setWaterlevelHistory(history);
  };
  
  // Test uchun - Keyingi 10 kunlik ob-havo bashorati
  const generateWeatherForecast = (reservoir: any) => {
    const now = new Date();
    const forecast = [];
    
    // region uchun yog'ingarchilik ma'lumotlari
    const regionRainData = rainData.find(r => r.region === reservoir.region) || {
      prediction: 0,
      lastMonth: 0,
      lastYear: 0
    };
    
    // Keyingi 10 kun uchun
    for (let i = 1; i <= 10; i++) {
      const date = new Date(now);
      date.setDate(date.getDate() + i);
      
      // Ob-havo bashoratini simulatsiya qilish
      // Yog'ingarchilik ehtimoli
      const rainChance = Math.min(regionRainData.prediction + (Math.random() * 20 - 10), 100);
      
      // Harorat (25±5 °C)
      const temperature = Math.round(25 + (Math.random() * 10 - 5));
      
      // Shamol tezligi (5±3 m/s)
      const windSpeed = Math.round(5 + (Math.random() * 6 - 3));
      
      forecast.push({
        date: date.toISOString().split('T')[0],
        rainChance: Math.max(0, Math.round(rainChance)),
        temperature,
        windSpeed,
      });
    }
    
    setWeatherForecast(forecast);
  };
  
  // Ma'lumotlarni yangilash (simulatsiya)
  const updateReservoirs = () => {
    // Barcha suv omborlarini yangilaymiz
    const updatedReservoirs = reservoirs.map(reservoir => {
      // Kiruvchi va chiquvchi suv o'zgarishlari
      const inflowChange = Math.random() * 0.05 - 0.02; // -2% to +3%
      const outflowChange = Math.random() * 0.05 - 0.02; // -2% to +3%
      
      const inflowRate = Math.round(reservoir.inflowRate * (1 + inflowChange));
      const outflowRate = Math.round(reservoir.outflowRate * (1 + outflowChange));
      
      // Suv sathi o'zgarishi
      const levelChange = inflowRate - outflowRate;
      const currentLevel = Math.min(
        Math.max(reservoir.currentLevel + levelChange, 0),
        reservoir.capacity
      );
      
      return {
        ...reservoir,
        inflowRate,
        outflowRate,
        currentLevel,
        lastUpdated: new Date().toISOString()
      };
    });
    
    setReservoirs(updatedReservoirs);
    
    // Agar biror suv ombori tanlangan bo'lsa, uning ma'lumotlarini yangilash
    if (selectedReservoir) {
      const updatedReservoir = updatedReservoirs.find(r => r.id === selectedReservoir.id);
      if (updatedReservoir) {
        setSelectedReservoir(updatedReservoir);
      }
    }
  };
  
  // Ma'lumotlarni yangilash (qo'lda)
  const handleRefresh = () => {
    setIsRefreshing(true);
    updateReservoirs();
    
    toast({
      title: t("Yangilandi"),
      description: t("Suv omborlari ma'lumotlari muvaffaqiyatli yangilandi"),
      variant: "default"
    });
    
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };
  
  // Suv omborining to'lganlik foizini hisoblash
  const calculateFillPercentage = (reservoir: any) => {
    return Math.round((reservoir.currentLevel / reservoir.capacity) * 100);
  };
  
  // Suv ombori xavf darajasini aniqlash
  const getReservoirStatus = (reservoir: any) => {
    const fillPercentage = calculateFillPercentage(reservoir);
    if (fillPercentage < 30) return { name: "Xavfli", color: "bg-red-500" };
    if (fillPercentage < 60) return { name: "O'rtacha", color: "bg-yellow-500" };
    return { name: "Yaxshi", color: "bg-green-500" };
  };
  
  // Harita uchun suv ombori o'lchamini aniqlash
  const getReservoirSizeForMap = (capacity: number) => {
    // Suv ombori sigimi qanchalik katta bo'lsa, shunchalik katta aylana
    return Math.max(Math.sqrt(capacity) / 30, 500);
  };
  
  return (
    <DashboardLayout title={t("Suv omborlari monitoringi")}>
      <div className="space-y-6">
        {/* Boshqaruv paneli */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>{t("Suv omborlari real vaqt monitoringi")}</CardTitle>
                <CardDescription>
                  {t("Suv omborlari holati, suv sathi va ob-havo bashorati")
                  }
                </CardDescription>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleRefresh}
                disabled={isRefreshing}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                {t("Yangilash")}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="reservoir-select">{t("Suv omborini tanlang")}</Label>
                <Select 
                  value={selectedReservoirId} 
                  onValueChange={setSelectedReservoirId}
                >
                  <SelectTrigger id="reservoir-select">
                    <SelectValue placeholder={t("Suv omborini tanlang")} />
                  </SelectTrigger>
                  <SelectContent>
                    {reservoirs.map(reservoir => (
                      <SelectItem key={reservoir.id} value={String(reservoir.id)}>
                        {reservoir.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="region-select">{t("Viloyatni tanlang")}</Label>
                <Select 
                  value={selectedRegionId} 
                  onValueChange={setSelectedRegionId}
                >
                  <SelectTrigger id="region-select">
                    <SelectValue placeholder={t("Viloyatni tanlang")} />
                  </SelectTrigger>
                  <SelectContent>
                    {regions.map(region => (
                      <SelectItem key={region.id} value={String(region.id)}>
                        {region.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="info-type">{t("Axborot turi")}</Label>
                <Select 
                  value={infoType} 
                  onValueChange={(value) => setInfoType(value as "current" | "forecast")}
                >
                  <SelectTrigger id="info-type">
                    <SelectValue placeholder={t("Axborot turini tanlang")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="current">{t("Joriy ma'lumotlar")}</SelectItem>
                    <SelectItem value="forecast">{t("Bashorat ma'lumotlari")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Xarita seksiyasi */}
        <Card>
          <CardHeader>
            <CardTitle>{t("Suv omborlari joylashuvi")}</CardTitle>
            <CardDescription>
              {t("O'zbekiston hududidagi barcha suv omborlarining joylashuvi")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div style={{ height: "500px", width: "100%" }}>
              <MapContainer 
                center={mapCenter} 
                zoom={mapZoom} 
                style={{ height: "100%", width: "100%" }}
                ref={mapRef}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                
                {/* Suv omborlari markerlarini chizish */}
                {reservoirs.map(reservoir => (
                  <div key={reservoir.id}>
                    <Marker 
                      position={[reservoir.lat, reservoir.lng]}
                      icon={dropletIcon}
                      eventHandlers={{
                        click: () => {
                          setSelectedReservoirId(String(reservoir.id));
                        }
                      }}
                    >
                      <Popup>
                        <div className="text-sm">
                          <h3 className="font-bold mb-1">{reservoir.name}</h3>
                          <p><strong>{t("Suv sathi")}:</strong> {Math.round(reservoir.currentLevel / 1000)} ming m³</p>
                          <p><strong>{t("Sig'imi")}:</strong> {Math.round(reservoir.capacity / 1000)} ming m³</p>
                          <p><strong>{t("To'ldirilgan")}:</strong> {calculateFillPercentage(reservoir)}%</p>
                          <div className="mt-1">
                            <Progress value={calculateFillPercentage(reservoir)} />
                          </div>
                        </div>
                      </Popup>
                    </Marker>
                    
                    <Circle 
                      center={[reservoir.lat, reservoir.lng]} 
                      radius={getReservoirSizeForMap(reservoir.capacity)}
                      pathOptions={{
                        fillColor: '#0080ff',
                        fillOpacity: 0.3,
                        weight: 1,
                        color: '#0066cc'
                      }}
                    />
                  </div>
                ))}
                
                {/* Viloyat markerlarini chizish */}
                {regions.map(region => (
                  <Marker 
                    key={region.id} 
                    position={[region.lat, region.lng]}
                    eventHandlers={{
                      click: () => {
                        setSelectedRegionId(String(region.id));
                      }
                    }}
                  >
                    <Popup>
                      <div className="text-sm">
                        <h3 className="font-bold mb-1">{region.name}</h3>
                        <p><strong>{t("Suv omborlari soni")}:</strong> {region.reservoirs}</p>
                        <p>
                          <strong>{t("Yog'ingarchilik bashorati")}:</strong>{" "}
                          {rainData.find(r => r.region === region.name)?.prediction || 0}mm
                        </p>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          </CardContent>
        </Card>
        
        {/* Tanlangan suv ombori ma'lumotlari */}
        {selectedReservoir && (
          <Card>
            <CardHeader>
              <CardTitle>{selectedReservoir.name}</CardTitle>
              <CardDescription>
                {selectedReservoir.region} {t("hududida joylashgan")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {/* Suv sathi */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      {t("Suv sathi")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {Math.round(selectedReservoir.currentLevel / 1000)} ming m³
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {t("Sig'imdan")} {calculateFillPercentage(selectedReservoir)}%
                    </p>
                    <Progress 
                      value={calculateFillPercentage(selectedReservoir)} 
                      className="mt-2"
                    />
                  </CardContent>
                </Card>
                
                {/* Suv oqimi */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      {t("Suv oqimi")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm font-medium">{t("Kirish")}</div>
                        <div className="text-xl font-bold text-green-500">
                          {selectedReservoir.inflowRate} m³/s
                        </div>
                      </div>
                      <div>
                        <div className="text-sm font-medium">{t("Chiqish")}</div>
                        <div className="text-xl font-bold text-red-500">
                          {selectedReservoir.outflowRate} m³/s
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Yog'ingarchilik bashorati */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      {t("Yog'ingarchilik bashorati")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {selectedReservoir.rainfallPrediction} mm
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {t("Keyingi 7 kun uchun")}
                    </p>
                    <div className="flex items-center mt-2">
                      <CloudRainIcon className={`h-4 w-4 mr-1 ${selectedReservoir.rainfallPrediction > 0 ? 'text-blue-500' : 'text-gray-400'}`} />
                      <span className="text-sm">
                        {selectedReservoir.rainfallPrediction > 30
                          ? t("Kuchli yog'ingarchilik")
                          : selectedReservoir.rainfallPrediction > 10
                          ? t("O'rtacha yog'ingarchilik")
                          : selectedReservoir.rainfallPrediction > 0
                          ? t("Yengil yog'ingarchilik")
                          : t("Yog'ingarchilik kutilmaydi")
                        }
                      </span>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Suv sifati */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      {t("Suv sifati")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center">
                      <div className={`h-3 w-3 rounded-full ${getWaterQualityColor(selectedReservoir.waterQuality as WaterQuality)} mr-2`}></div>
                      <div className="text-xl font-bold">
                        {selectedReservoir.waterQuality === "Good" 
                          ? t("Yaxshi") 
                          : selectedReservoir.waterQuality === "Moderate"
                          ? t("O'rtacha")
                          : t("Yomon")
                        }
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {t("So'nggi yangilanish")}: {format(new Date(selectedReservoir.lastUpdated), 'dd.MM.yyyy HH:mm')}
                    </p>
                  </CardContent>
                </Card>
              </div>
              
              {/* Ma'lumotlar tahlili */}
              <Tabs defaultValue="water-level" className="mt-6">
                <TabsList>
                  <TabsTrigger value="water-level">{t("Suv sathi")}</TabsTrigger>
                  <TabsTrigger value="flow-rate">{t("Suv oqimi")}</TabsTrigger>
                  <TabsTrigger value="weather">{t("Ob-havo bashorati")}</TabsTrigger>
                  <TabsTrigger value="distribution">{t("Suv taqsimoti")}</TabsTrigger>
                </TabsList>
                
                <TabsContent value="water-level" className="space-y-4">
                  <div className="h-[300px] mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={waterlevelHistory}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip 
                          formatter={(value) => [`${Number(value).toLocaleString()} m³`, t("Suv sathi")]}
                        />
                        <Legend />
                        <Area 
                          type="monotone" 
                          dataKey="level" 
                          stroke="#8884d8" 
                          fill="#8884d8" 
                          name={t("Suv sathi")}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {t("So'nggi 30 kunlik suv sathi o'zgarishi")}
                  </div>
                </TabsContent>
                
                <TabsContent value="flow-rate" className="space-y-4">
                  <div className="h-[300px] mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={waterlevelHistory}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip 
                          formatter={(value) => [`${value} m³/s`, ""]}
                        />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="inflow" 
                          stroke="#82ca9d" 
                          name={t("Kiruvchi suv")}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="outflow" 
                          stroke="#ff7300" 
                          name={t("Chiquvchi suv")}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {t("So'nggi 30 kunlik suv oqimi o'zgarishi")}
                  </div>
                </TabsContent>
                
                <TabsContent value="weather" className="space-y-4">
                  <div className="h-[300px] mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={weatherForecast}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis yAxisId="left" orientation="left" />
                        <YAxis yAxisId="right" orientation="right" />
                        <Tooltip />
                        <Legend />
                        <Bar 
                          yAxisId="left" 
                          dataKey="rainChance" 
                          fill="#8884d8" 
                          name={t("Yog'ingarchilik ehtimoli (%)")}
                        />
                        <Bar 
                          yAxisId="right" 
                          dataKey="temperature" 
                          fill="#ff7300" 
                          name={t("Harorat (°C)")}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {t("Keyingi 10 kunlik ob-havo bashorati")}
                  </div>
                </TabsContent>
                
                <TabsContent value="distribution" className="space-y-4">
                  <div className="h-[300px] mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={waterDistribution}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {waterDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value}%`, ""]} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {t("Suv taqsimoti bo'yicha ma'lumotlar")}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}
        
        {/* Suv taqsimoti umumiy ma'lumotlari */}
        <Card>
          <CardHeader>
            <CardTitle>{t("Suv taqsimoti")}</CardTitle>
            <CardDescription>
              {t("Suv resurslarining taqsimlanishi bo'yicha umumiy ma'lumotlar")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Ekin turlari bo'yicha suv taqsimoti */}
              <div>
                <h3 className="text-lg font-semibold mb-4">{t("Ekin turlari bo'yicha taqsimot")}</h3>
                <div className="space-y-3">
                  {waterDistribution.map((item, index) => (
                    <div key={index} className="space-y-1">
                      <div className="flex justify-between">
                        <span>{item.name}</span>
                        <span className="font-medium">{item.value}%</span>
                      </div>
                      <Progress value={item.value} className="h-2" 
                        style={{ backgroundColor: 'rgba(0,0,0,0.1)' }}
                      />
                    </div>
                  ))}
                </div>
              </div>
              
              <Separator />
              
              {/* Viloyatlar bo'yicha suv taqsimoti */}
              <div>
                <h3 className="text-lg font-semibold mb-4">{t("Viloyatlar bo'yicha suv ombori zaxiralari")}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {regions.map((region) => {
                    // Viloyatdagi suv omborlari
                    const regionReservoirs = reservoirs.filter(r => r.region === region.name);
                    
                    // Umumiy suv zaxirasi va sig'imi
                    const totalWater = regionReservoirs.reduce((sum, r) => sum + r.currentLevel, 0);
                    const totalCapacity = regionReservoirs.reduce((sum, r) => sum + r.capacity, 0);
                    
                    // To'lganlik foizi
                    const fillPercentage = totalCapacity > 0 ? Math.round((totalWater / totalCapacity) * 100) : 0;
                    
                    // Yog'ingarchilik ma'lumotlari
                    const regionRain = rainData.find(r => r.region === region.name);
                    
                    return (
                      <Card key={region.id} className="overflow-hidden">
                        <CardHeader className="p-4 pb-0">
                          <CardTitle className="text-base">{region.name}</CardTitle>
                        </CardHeader>
                        <CardContent className="p-4">
                          <div className="text-sm space-y-2">
                            <div className="flex justify-between">
                              <span>{t("Suv omborlari")}:</span>
                              <span className="font-medium">{region.reservoirs}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>{t("Suv zaxirasi")}:</span>
                              <span className="font-medium">{Math.round(totalWater / 1000000)} mln m³</span>
                            </div>
                            <div className="flex justify-between">
                              <span>{t("To'ldirilgan")}:</span>
                              <span className="font-medium">{fillPercentage}%</span>
                            </div>
                            <Progress value={fillPercentage} className="h-2 mt-1" />
                            
                            <div className="flex justify-between items-center mt-3">
                              <div className="flex items-center">
                                <CloudRainIcon className="h-4 w-4 mr-1 text-blue-500" />
                                <span>{t("Yog'ingarchilik")}:</span>
                              </div>
                              <span className="font-medium">{regionRain?.prediction || 0} mm</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}