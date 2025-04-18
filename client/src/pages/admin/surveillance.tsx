import { useState, useEffect, useRef } from "react";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Camera, Map, Minimize2, Maximize2, MapPin, X, Droplet } from "lucide-react";
import { useTranslation } from "react-i18next";
import { MapContainer, TileLayer, Marker, Popup, Polyline, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { LatLngTuple, LatLngExpression, PathOptions } from 'leaflet';
import { cn } from "@/lib/utils";

// Define the available camera grid layouts
type GridLayout = "1x1" | "2x2" | "4x2" | "4x4" | "8x8";

// Define the reservoir location type
type ReservoirLocation = {
  id: number;
  name: string;
  position: [number, number]; // [latitude, longitude]
  cameras: number[]; // IDs of cameras at this location
  source?: string; // Water source (river, etc.)
  canals?: string[]; // Canal networks from this reservoir
  sourceLocation?: [number, number]; // Source location coordinates
  canalRoutes?: Array<Array<[number, number]>>; // Routes for the canals
  allocationAreas?: Array<{
    name: string;
    position: [number, number];
    allocatedAmount: number;
    maxCapacity: number;
    region: string;
  }>; // Areas where water is allocated
};

// Define the camera type
type Camera = {
  id: number;
  name: string;
  online: boolean;
  reservoirId?: number;
  minimized?: boolean;
  ip?: string;
};

export default function AdminSurveillance() {
  const { t } = useTranslation();
  const [layout, setLayout] = useState<GridLayout>("2x2");
  const [cameras, setCameras] = useState<Camera[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("cameras");
  const [selectedCamera, setSelectedCamera] = useState<Camera | null>(null);
  const [minimizedCameras, setMinimizedCameras] = useState<Camera[]>([]);
  
  // Show/hide all cameras
  const [showCameras, setShowCameras] = useState<boolean>(true);
  
  // Camera IP address input
  const [cameraIpAddresses, setCameraIpAddresses] = useState<{[key: number]: string}>({});
  
  // Uzbekistan reservoir locations with water sources and canal networks
  const [reservoirLocations] = useState<ReservoirLocation[]>([
    {
      id: 1,
      name: "Charvak Suv Ombori",
      position: [41.6183, 70.0897],
      cameras: [1, 2, 3],
      source: "Chirchiq daryosi",
      canals: ["Bozsuv", "Keles kanali", "Parkent kanali"],
      sourceLocation: [41.7500, 70.0500],
      canalRoutes: [
        [[41.6183, 70.0897], [41.5500, 70.0500], [41.4800, 69.9800], [41.4000, 69.8500]],
        [[41.6183, 70.0897], [41.5800, 70.1500], [41.5300, 70.2000], [41.5000, 70.2800]]
      ],
      allocationAreas: [
        {
          name: "Toshkent viloyati",
          position: [41.4000, 69.8500],
          allocatedAmount: 450,
          maxCapacity: 600,
          region: "Toshkent"
        },
        {
          name: "Parkent tumani",
          position: [41.5000, 70.2800],
          allocatedAmount: 220,
          maxCapacity: 300,
          region: "Toshkent viloyati"
        }
      ]
    },
    {
      id: 2,
      name: "Tuyamuyun Suv Ombori",
      position: [41.2047, 61.4053],
      cameras: [4, 5, 6, 7],
      source: "Amudaryo",
      canals: ["Qorakalpog'iston kanali", "Qoraqum kanali", "Xorazm suv arig'i"],
      sourceLocation: [41.3000, 61.3000],
      canalRoutes: [
        [[41.2047, 61.4053], [41.1500, 61.4500], [41.0800, 61.5000], [41.0000, 61.5500]],
        [[41.2047, 61.4053], [41.1800, 61.3500], [41.1500, 61.3000], [41.1000, 61.2500]]
      ],
      allocationAreas: [
        {
          name: "Xorazm viloyati",
          position: [41.0000, 61.5500],
          allocatedAmount: 780,
          maxCapacity: 1000,
          region: "Xorazm"
        },
        {
          name: "Qoraqalpog'iston Respublikasi",
          position: [41.1000, 61.2500],
          allocatedAmount: 620,
          maxCapacity: 800,
          region: "Qoraqalpog'iston"
        }
      ]
    },
    {
      id: 3,
      name: "Andijon Suv Ombori",
      position: [40.7731, 73.0642],
      cameras: [8, 9, 10],
      source: "Qoradaryo",
      canals: ["Shahrixonsoy", "Andijon kanali", "Namangan suv yo'li"],
      sourceLocation: [40.8500, 73.0000],
      canalRoutes: [
        [[40.7731, 73.0642], [40.7500, 73.0000], [40.7000, 72.9500], [40.6500, 72.9000]],
        [[40.7731, 73.0642], [40.8000, 73.1000], [40.8500, 73.1500], [40.9000, 73.2000]]
      ],
      allocationAreas: [
        {
          name: "Andijon viloyati",
          position: [40.6500, 72.9000],
          allocatedAmount: 300,
          maxCapacity: 450,
          region: "Andijon"
        },
        {
          name: "Namangan viloyati",
          position: [40.9000, 73.2000],
          allocatedAmount: 250,
          maxCapacity: 350,
          region: "Namangan"
        }
      ]
    },
    {
      id: 4,
      name: "Kattaqo'rg'on Suv Ombori",
      position: [39.8952, 66.2851],
      cameras: [11, 12, 13],
      source: "Zarafshon daryosi",
      canals: ["Eski Angor", "Samarqand suv tizimi", "Qashqadaryo kanali"],
      sourceLocation: [39.9500, 66.2000],
      canalRoutes: [
        [[39.8952, 66.2851], [39.8500, 66.3500], [39.8000, 66.4000], [39.7500, 66.4500]],
        [[39.8952, 66.2851], [39.8500, 66.2000], [39.8000, 66.1500], [39.7500, 66.1000]]
      ],
      allocationAreas: [
        {
          name: "Samarqand viloyati",
          position: [39.7500, 66.4500],
          allocatedAmount: 350,
          maxCapacity: 500,
          region: "Samarqand"
        },
        {
          name: "Qashqadaryo shimoli",
          position: [39.7500, 66.1000],
          allocatedAmount: 280,
          maxCapacity: 400,
          region: "Qashqadaryo"
        }
      ]
    },
    {
      id: 5,
      name: "Chimqo'rg'on Suv Ombori",
      position: [39.5000, 67.2500],
      cameras: [14, 15, 16],
      source: "Qashqadaryo",
      canals: ["Qamashi kanali", "Qarshi magistral kanali"],
      sourceLocation: [39.5500, 67.2000],
      canalRoutes: [
        [[39.5000, 67.2500], [39.4500, 67.3000], [39.4000, 67.3500], [39.3500, 67.4000]],
        [[39.5000, 67.2500], [39.4500, 67.2000], [39.4000, 67.1500], [39.3500, 67.1000]]
      ],
      allocationAreas: [
        {
          name: "Qarshi shahri",
          position: [39.3500, 67.4000],
          allocatedAmount: 320,
          maxCapacity: 400,
          region: "Qashqadaryo"
        },
        {
          name: "Qamashi tumani",
          position: [39.3500, 67.1000],
          allocatedAmount: 180,
          maxCapacity: 250,
          region: "Qashqadaryo"
        }
      ]
    },
    {
      id: 6,
      name: "To'dako'l Suv Ombori",
      position: [40.2500, 65.2000],
      cameras: [17, 18, 19, 20],
      source: "Amudaryo",
      canals: ["Buxoro suv tizimi", "Qorakul kanali"],
      sourceLocation: [40.3000, 65.1500],
      canalRoutes: [
        [[40.2500, 65.2000], [40.2000, 65.2500], [40.1500, 65.3000], [40.1000, 65.3500]],
        [[40.2500, 65.2000], [40.2000, 65.1500], [40.1500, 65.1000], [40.1000, 65.0500]]
      ],
      allocationAreas: [
        {
          name: "Buxoro viloyati",
          position: [40.1000, 65.3500],
          allocatedAmount: 350,
          maxCapacity: 450,
          region: "Buxoro"
        },
        {
          name: "Qorakul tumani",
          position: [40.1000, 65.0500],
          allocatedAmount: 150,
          maxCapacity: 200,
          region: "Buxoro"
        }
      ]
    },
    {
      id: 7,
      name: "Janubiy Surxon Suv Ombori",
      position: [37.8000, 67.5000],
      cameras: [21, 22, 23],
      source: "Surxondaryo",
      canals: ["Sherobod suv tizimi", "Jarqo'rg'on kanali"],
      sourceLocation: [37.8500, 67.4500],
      canalRoutes: [
        [[37.8000, 67.5000], [37.7500, 67.5500], [37.7000, 67.6000], [37.6500, 67.6500]],
        [[37.8000, 67.5000], [37.7500, 67.4500], [37.7000, 67.4000], [37.6500, 67.3500]]
      ],
      allocationAreas: [
        {
          name: "Sherobod tumani",
          position: [37.6500, 67.6500],
          allocatedAmount: 180,
          maxCapacity: 250,
          region: "Surxondaryo"
        },
        {
          name: "Jarqo'rg'on tumani",
          position: [37.6500, 67.3500],
          allocatedAmount: 150,
          maxCapacity: 200,
          region: "Surxondaryo"
        }
      ]
    },
    {
      id: 8,
      name: "Toshkent Suv Ombori",
      position: [41.2995, 69.2401],
      cameras: [24, 25, 26, 27, 28],
      source: "Chirchiq daryosi",
      canals: ["Bozsuv", "Salar", "Qorasu", "Bo'zsuv kanali"],
      sourceLocation: [41.3500, 69.2000],
      canalRoutes: [
        [[41.2995, 69.2401], [41.2500, 69.3000], [41.2000, 69.3500], [41.1500, 69.4000]],
        [[41.2995, 69.2401], [41.2500, 69.2000], [41.2000, 69.1500], [41.1500, 69.1000]],
        [[41.2995, 69.2401], [41.3500, 69.3000], [41.4000, 69.3500], [41.4500, 69.4000]]
      ],
      allocationAreas: [
        {
          name: "Toshkent shahri shimoli",
          position: [41.1500, 69.4000],
          allocatedAmount: 400,
          maxCapacity: 500,
          region: "Toshkent"
        },
        {
          name: "Toshkent shahri janubi",
          position: [41.1500, 69.1000],
          allocatedAmount: 300,
          maxCapacity: 400,
          region: "Toshkent"
        },
        {
          name: "Zangiota tumani",
          position: [41.4500, 69.4000],
          allocatedAmount: 250,
          maxCapacity: 350,
          region: "Toshkent viloyati"
        }
      ]
    },
  ]);

  // Function to toggle camera minimization
  const toggleMinimize = (camera: Camera) => {
    // If camera is already minimized, remove it from minimized cameras
    if (minimizedCameras.some(cam => cam.id === camera.id)) {
      setMinimizedCameras(prevCameras => prevCameras.filter(cam => cam.id !== camera.id));
    } else {
      // Otherwise add it to minimized cameras
      setMinimizedCameras(prevCameras => [...prevCameras, camera]);
    }
  };

  // Close a minimized camera
  const closeMinimizedCamera = (cameraId: number) => {
    setMinimizedCameras(prevCameras => prevCameras.filter(cam => cam.id !== cameraId));
  };
  
  // Function to update camera IP
  const updateCameraIp = (cameraId: number, ipAddress: string) => {
    setCameraIpAddresses(prev => ({
      ...prev,
      [cameraId]: ipAddress
    }));
  };
  
  // Function to toggle visibility of all cameras
  const toggleCamerasVisibility = () => {
    setShowCameras(prev => !prev);
  };
  
  // In a real application, we would fetch the cameras from the API
  useEffect(() => {
    // Simulate loading cameras from an API
    setIsLoading(true);
    const timeout = setTimeout(() => {
      // Generate mock camera data - in a real app, this would come from an API
      const generateCameras = (count: number) => {
        return Array.from({ length: Math.min(count, 100) }, (_, i) => {
          // Assign cameras to reservoirs for the first few cameras
          let reservoirId: number | undefined = undefined;
          
          for (const reservoir of reservoirLocations) {
            if (reservoir.cameras.includes(i + 1)) {
              reservoirId = reservoir.id;
              break;
            }
          }
          
          // Generate a random IP address for this camera
          const randomIp = `192.168.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`;
          
          // Update the IP addresses state
          updateCameraIp(i + 1, randomIp);
          
          return {
            id: i + 1,
            name: `Reservoir Camera ${i + 1}`,
            online: Math.random() > 0.2, // 80% chance of being online
            reservoirId,
            ip: randomIp
          };
        });
      };

      const cameraCount = layout === "1x1" ? 1 : 
                        layout === "2x2" ? 4 : 
                        layout === "4x2" ? 8 : 
                        layout === "4x4" ? 16 : 64;
                        
      setCameras(generateCameras(cameraCount));
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timeout);
  }, [layout, reservoirLocations]);

  // Calculate grid class based on the selected layout
  const getGridClass = () => {
    switch (layout) {
      case "1x1":
        return "grid-cols-1";
      case "2x2":
        return "grid-cols-2";
      case "4x2":
        return "grid-cols-4 md:grid-rows-2";
      case "4x4":
        return "grid-cols-4";
      case "8x8":
        return "grid-cols-8";
      default:
        return "grid-cols-2";
    }
  };

  return (
    <DashboardLayout title={t("Video Surveillance")}>
      <div className="space-y-6">
        <Tabs defaultValue="cameras" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="cameras">{t("Cameras")}</TabsTrigger>
            <TabsTrigger value="map">{t("Map View")}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="cameras">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xl font-bold">{t("Reservoir Surveillance Cameras")}</CardTitle>
                <div className="flex flex-col sm:flex-row items-end sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                  <RadioGroup
                    value={layout}
                    onValueChange={(value) => setLayout(value as GridLayout)}
                    className="flex flex-wrap items-center space-x-2 sm:space-x-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="1x1" id="layout-1x1" />
                      <Label htmlFor="layout-1x1">1×1</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="2x2" id="layout-2x2" />
                      <Label htmlFor="layout-2x2">2×2</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="4x2" id="layout-4x2" />
                      <Label htmlFor="layout-4x2">4×2</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="4x4" id="layout-4x4" />
                      <Label htmlFor="layout-4x4">4×4</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="8x8" id="layout-8x8" />
                      <Label htmlFor="layout-8x8">8×8</Label>
                    </div>
                  </RadioGroup>
                  
                  <Button 
                    variant={showCameras ? "outline" : "destructive"} 
                    size="sm"
                    onClick={toggleCamerasVisibility}
                    className="whitespace-nowrap"
                  >
                    {showCameras ? t("Hide All Cameras") : t("Show All Cameras")}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Separator className="my-4" />
                
                {isLoading ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[...Array(4)].map((_, i) => (
                      <div
                        key={i}
                        className="aspect-video bg-slate-200 animate-pulse rounded-md flex items-center justify-center"
                      >
                        <Camera className="h-10 w-10 text-slate-400" />
                      </div>
                    ))}
                  </div>
                ) : showCameras ? (
                  <div className={cn("grid gap-2 md:gap-4", getGridClass())}>
                    {cameras.map((camera) => (
                      <div key={camera.id} className="relative group">
                        <div 
                          className={cn(
                            "aspect-video rounded-md flex items-center justify-center relative overflow-hidden border-2",
                            camera.online 
                              ? "bg-gray-800 border-blue-500 text-white" 
                              : "bg-gray-200 border-gray-400 text-gray-500"
                          )}
                        >
                          {camera.online ? (
                            <>
                              {/* This would be a real video stream in a production environment */}
                              <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-gray-900/60" />
                              
                              {/* Minimize/maximize button */}
                              <button
                                onClick={() => toggleMinimize(camera)}
                                className="absolute top-2 right-2 bg-black/50 p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10"
                                title={minimizedCameras.some(cam => cam.id === camera.id) ? "Maximize" : "Minimize"}
                              >
                                {minimizedCameras.some(cam => cam.id === camera.id) ? (
                                  <Maximize2 className="h-4 w-4" />
                                ) : (
                                  <Minimize2 className="h-4 w-4" />
                                )}
                              </button>
                              
                              <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center">
                                <span className="text-xs font-medium bg-black/50 px-2 py-1 rounded">
                                  {camera.name}
                                </span>
                                <span className="flex items-center">
                                  <span className="h-2 w-2 bg-green-500 rounded-full animate-pulse mr-1"></span>
                                  <span className="text-xs bg-black/50 px-2 py-1 rounded">{t("Live")}</span>
                                </span>
                              </div>
                              <Camera className={cn(
                                "h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity", 
                                layout === "8x8" ? "h-4 w-4" : layout === "4x4" ? "h-6 w-6" : "h-8 w-8"
                              )} />
                            </>
                          ) : (
                            <>
                              <Camera className={cn(
                                "opacity-50",
                                layout === "8x8" ? "h-4 w-4" : layout === "4x4" ? "h-6 w-6" : "h-8 w-8"
                              )} />
                              <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center">
                                <span className="text-xs font-medium bg-black/50 px-2 py-1 rounded text-white">
                                  {camera.name}
                                </span>
                                <span className="flex items-center">
                                  <span className="h-2 w-2 bg-red-500 rounded-full mr-1"></span>
                                  <span className="text-xs bg-black/50 px-2 py-1 rounded text-white">{t("Offline")}</span>
                                </span>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12">
                    <Camera className="h-16 w-16 text-slate-300 mb-4" />
                    <p className="text-slate-500 text-center">
                      {t("All cameras are currently hidden. Click 'Show All Cameras' to display them.")}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="map">
            <Card>
              <CardHeader>
                <CardTitle>{t("Reservoir Locations")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="map-container">
                  {typeof window !== 'undefined' && (
                    <MapContainer 
                      center={[41.2995, 69.2401] as LatLngExpression} 
                      zoom={6} 
                      scrollWheelZoom={true}
                      style={{ height: '700px', width: '100%' }}
                    >
                      <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />
                    
                      {/* Reservoirs */}
                      {reservoirLocations.map(reservoir => (
                        <Marker 
                          key={reservoir.id} 
                          position={reservoir.position as LatLngExpression}
                          icon={L.divIcon({
                            className: 'reservoir-marker',
                            html: `<div class="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 border-2 border-white shadow-lg">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-white"><path d="M8 17.9a4 4 0 1 1 8 .2 8.33 8.33 0 0 1-4 1.9 8.33 8.33 0 0 1-4-2.1Z"/><path d="M12 13V4"/></svg>
                                  </div>`,
                            iconSize: [32, 32],
                            iconAnchor: [16, 16]
                          })}
                        >
                          <Popup>
                            <div className="p-2">
                              <h3 className="font-bold text-sm">{reservoir.name}</h3>
                              <p className="text-xs mt-1">
                                {t("Source")}: {reservoir.source}
                              </p>
                              <p className="text-xs mt-1">
                                {t("Cameras")}: {reservoir.cameras.length}
                              </p>
                              <p className="text-xs mt-1">
                                {t("Online")}: {cameras.filter(cam => reservoir.cameras.includes(cam.id) && cam.online).length}
                              </p>
                              {reservoir.canals && reservoir.canals.length > 0 && (
                                <div className="mt-1">
                                  <p className="text-xs font-medium">{t("Canal Networks")}:</p>
                                  <ul className="text-xs list-disc pl-4 mt-1">
                                    {reservoir.canals.map((canal, index) => (
                                      <li key={index}>{canal}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="w-full mt-2 text-xs"
                                onClick={() => {
                                  setActiveTab("cameras");
                                }}
                              >
                                <Camera className="h-3 w-3 mr-1" />
                                {t("View Cameras")}
                              </Button>
                            </div>
                          </Popup>
                        </Marker>
                      ))}
                      
                      {/* Water Sources */}
                      {reservoirLocations.map(reservoir => 
                        reservoir.sourceLocation && (
                          <Marker 
                            key={`source-${reservoir.id}`} 
                            position={reservoir.sourceLocation as LatLngExpression}
                            icon={L.divIcon({
                              className: 'source-marker',
                              html: `<div class="flex items-center justify-center w-6 h-6 rounded-full bg-blue-400 border-2 border-white shadow-md">
                                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-white"><path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/></svg>
                                    </div>`,
                              iconSize: [24, 24],
                              iconAnchor: [12, 12]
                            })}
                          >
                            <Tooltip direction="top" offset={[0, -10]} opacity={0.9} permanent>
                              <span className="text-xs">{reservoir.source}</span>
                            </Tooltip>
                          </Marker>
                        )
                      )}
                      
                      {/* Canal Routes */}
                      {reservoirLocations.map(reservoir => 
                        reservoir.canalRoutes && reservoir.canalRoutes.map((route, idx) => (
                          <Polyline
                            key={`canal-${reservoir.id}-${idx}`}
                            positions={route as LatLngExpression[]}
                            pathOptions={{ 
                              color: '#3b82f6', 
                              weight: 3, 
                              opacity: 0.7,
                              dashArray: '5, 5',
                            }}
                          >
                            <Tooltip direction="top">
                              <span className="text-xs">
                                {reservoir.canals && reservoir.canals[idx] ? 
                                  reservoir.canals[idx] : 
                                  `${reservoir.name} kanali ${idx + 1}`
                                }
                              </span>
                            </Tooltip>
                          </Polyline>
                        ))
                      )}
                      
                      {/* Allocation Areas */}
                      {reservoirLocations.map(reservoir => 
                        reservoir.allocationAreas && reservoir.allocationAreas.map((area, idx) => (
                          <Marker 
                            key={`allocation-${reservoir.id}-${idx}`} 
                            position={area.position as LatLngExpression}
                            icon={L.divIcon({
                              className: 'allocation-marker',
                              html: `<div class="flex items-center justify-center w-7 h-7 rounded-full bg-green-500 border-2 border-white shadow-md">
                                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-white"><path d="M2 22h20"></path><path d="M17 22v-5"></path><path d="M15 7v4"></path><path d="M9 11V7"></path><path d="M7 22v-8"></path><path d="M17 8a5 5 0 0 0-10 0"></path></svg>
                                    </div>`,
                              iconSize: [28, 28],
                              iconAnchor: [14, 14]
                            })}
                          >
                            <Popup>
                              <div className="p-2">
                                <h3 className="font-bold text-sm">{area.name}</h3>
                                <p className="text-xs mt-1">
                                  {t("Region")}: {area.region}
                                </p>
                                <p className="text-xs mt-1">
                                  {t("Allocated")}: {area.allocatedAmount} mln m³
                                </p>
                                <p className="text-xs mt-1">
                                  {t("Capacity")}: {area.maxCapacity} mln m³
                                </p>
                                <p className="text-xs mt-1">
                                  {t("Usage")}: {Math.round((area.allocatedAmount / area.maxCapacity) * 100)}%
                                </p>
                                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                                  <div 
                                    className="bg-blue-600 h-2 rounded-full" 
                                    style={{ width: `${Math.round((area.allocatedAmount / area.maxCapacity) * 100)}%` }}
                                  ></div>
                                </div>
                              </div>
                            </Popup>
                          </Marker>
                        ))
                      )}
                    </MapContainer>
                  )}
                </div>
                
                <div className="mt-6 space-y-4">
                  <h3 className="text-lg font-semibold">{t("Map Legend")}</h3>
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 rounded-full bg-blue-600"></div>
                      <span className="text-sm">{t("Reservoirs")}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 rounded-full bg-blue-400"></div>
                      <span className="text-sm">{t("Water Sources")}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="h-1 w-8 bg-blue-500 border-dashed border-2"></div>
                      <span className="text-sm">{t("Canal Networks")}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 rounded-full bg-green-500"></div>
                      <span className="text-sm">{t("Allocation Areas")}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        {/* Minimized video windows */}
        {minimizedCameras.map(camera => (
          <div 
            key={`minimized-${camera.id}`} 
            className="video-container minimized"
            style={{ 
              right: `${(minimizedCameras.indexOf(camera) * 320) + 20}px` 
            }}
          >
            <div className="relative h-full w-full bg-gray-800 border border-blue-500">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-gray-900/60" />
              
              <div className="absolute top-0 left-0 right-0 bg-black/70 p-1 flex justify-between items-center">
                <span className="text-xs font-medium text-white pl-1">
                  {camera.name}
                </span>
                <div className="flex space-x-1">
                  <button
                    onClick={() => toggleMinimize(camera)}
                    className="text-white p-1 hover:bg-gray-700 rounded"
                  >
                    <Maximize2 className="h-3 w-3" />
                  </button>
                  <button
                    onClick={() => closeMinimizedCamera(camera.id)}
                    className="text-white p-1 hover:bg-gray-700 rounded"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              </div>
              
              <div className="absolute bottom-1 left-1 flex items-center">
                <span className="h-2 w-2 bg-green-500 rounded-full animate-pulse mr-1"></span>
                <span className="text-xs text-white">{t("Live")}</span>
              </div>
              
              <div className="flex items-center justify-center h-full">
                <Camera className="h-10 w-10 text-gray-400 opacity-30" />
              </div>
            </div>
          </div>
        ))}
        
        {/* Camera IP Address Configuration */}
        <Card>
          <CardHeader>
            <CardTitle>{t("Camera IP Configuration")}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {t("Configure IP addresses for up to 100 surveillance cameras.")}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {cameras.slice(0, 20).map(camera => (
                  <div key={`ip-${camera.id}`} className="space-y-2">
                    <Label htmlFor={`camera-ip-${camera.id}`} className="text-xs">
                      {camera.name}
                    </Label>
                    <div className="flex">
                      <input
                        id={`camera-ip-${camera.id}`}
                        type="text"
                        value={cameraIpAddresses[camera.id] || ''}
                        onChange={(e) => updateCameraIp(camera.id, e.target.value)}
                        className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="192.168.1.100"
                      />
                      <Badge variant={camera.online ? "success" : "destructive"} className="ml-2 h-9 px-2 flex items-center">
                        {camera.online ? t("Online") : t("Offline")}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
              
              {cameras.length > 20 && (
                <div className="flex justify-end">
                  <Button variant="outline" size="sm">
                    {t("Show All IP Addresses")}
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("Camera Controls")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col space-y-2">
                <Label htmlFor="camera-selection">{t("Select Camera")}</Label>
                <select 
                  id="camera-selection"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">{t("Select a camera")}</option>
                  {cameras.filter(cam => cam.online).map((camera) => (
                    <option key={camera.id} value={camera.id}>
                      {camera.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <Button variant="outline" size="sm" disabled>{t("Pan Left")}</Button>
                <Button variant="outline" size="sm" disabled>{t("Pan Up")}</Button>
                <Button variant="outline" size="sm" disabled>{t("Pan Right")}</Button>
                <Button variant="outline" size="sm" disabled>{t("Zoom Out")}</Button>
                <Button variant="outline" size="sm" disabled>{t("Pan Down")}</Button>
                <Button variant="outline" size="sm" disabled>{t("Zoom In")}</Button>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" size="sm" className="w-full" disabled>
                  {t("Capture Image")}
                </Button>
                <div className="w-4"></div>
                <Button variant="destructive" size="sm" className="w-full" disabled>
                  {t("Start Recording")}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t("Camera Status")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>{t("Total Cameras")}:</span>
                  <span className="font-semibold">{cameras.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t("Online")}:</span>
                  <span className="font-semibold text-green-600">
                    {cameras.filter(cam => cam.online).length} 
                    ({cameras.length > 0 ? Math.round((cameras.filter(cam => cam.online).length / cameras.length) * 100) : 0}%)
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>{t("Offline")}:</span>
                  <span className="font-semibold text-red-600">
                    {cameras.filter(cam => !cam.online).length}
                    ({cameras.length > 0 ? Math.round((cameras.filter(cam => !cam.online).length / cameras.length) * 100) : 0}%)
                  </span>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <h4 className="font-medium">{t("Recently Offline")}</h4>
                  {cameras.filter(cam => !cam.online).slice(0, 3).map(camera => (
                    <div key={camera.id} className="flex justify-between text-sm py-1 border-b">
                      <span>{camera.name}</span>
                      <span className="text-red-600">{t("Offline")}</span>
                    </div>
                  ))}
                  {cameras.filter(cam => !cam.online).length === 0 && (
                    <p className="text-sm text-gray-500">{t("No offline cameras")}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}