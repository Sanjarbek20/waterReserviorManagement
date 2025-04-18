import { useState, useEffect, useRef } from "react";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Camera, Map, Minimize2, Maximize2, MapPin, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { cn } from "@/lib/utils";

// Define the available camera grid layouts
type GridLayout = "2x2" | "4x4" | "8x8";

// Define the reservoir location type
type ReservoirLocation = {
  id: number;
  name: string;
  position: [number, number]; // [latitude, longitude]
  cameras: number[]; // IDs of cameras at this location
};

// Define the camera type
type Camera = {
  id: number;
  name: string;
  online: boolean;
  reservoirId?: number;
  minimized?: boolean;
};

export default function AdminSurveillance() {
  const { t } = useTranslation();
  const [layout, setLayout] = useState<GridLayout>("2x2");
  const [cameras, setCameras] = useState<Camera[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("cameras");
  const [selectedCamera, setSelectedCamera] = useState<Camera | null>(null);
  const [minimizedCameras, setMinimizedCameras] = useState<Camera[]>([]);
  
  // Mock reservoir locations for the map
  const [reservoirLocations] = useState<ReservoirLocation[]>([
    {
      id: 1,
      name: "Main Reservoir",
      position: [41.2995, 69.2401], // Tashkent coordinates
      cameras: [1, 2],
    },
    {
      id: 2,
      name: "Eastern Reservoir",
      position: [41.3111, 69.2797],
      cameras: [3, 4],
    },
    {
      id: 3,
      name: "Southern Reservoir",
      position: [41.2565, 69.2168],
      cameras: [5, 6, 7, 8],
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

  // In a real application, we would fetch the cameras from the API
  useEffect(() => {
    // Simulate loading cameras from an API
    setIsLoading(true);
    const timeout = setTimeout(() => {
      // Generate mock camera data - in a real app, this would come from an API
      const generateCameras = (count: number) => {
        return Array.from({ length: count }, (_, i) => {
          // Assign cameras to reservoirs for the first few cameras
          let reservoirId: number | undefined = undefined;
          
          for (const reservoir of reservoirLocations) {
            if (reservoir.cameras.includes(i + 1)) {
              reservoirId = reservoir.id;
              break;
            }
          }
          
          return {
            id: i + 1,
            name: `Reservoir Camera ${i + 1}`,
            online: Math.random() > 0.2, // 80% chance of being online
            reservoirId
          };
        });
      };

      const cameraCount = layout === "2x2" ? 4 : layout === "4x4" ? 16 : 64;
      setCameras(generateCameras(cameraCount));
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timeout);
  }, [layout, reservoirLocations]);

  // Calculate grid class based on the selected layout
  const getGridClass = () => {
    switch (layout) {
      case "2x2":
        return "grid-cols-2";
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
                <div className="flex items-center space-x-2">
                  <RadioGroup
                    value={layout}
                    onValueChange={(value) => setLayout(value as GridLayout)}
                    className="flex items-center space-x-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="2x2" id="layout-2x2" />
                      <Label htmlFor="layout-2x2">2×2</Label>
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
                ) : (
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
                      center={[41.2995, 69.2401] as [number, number]} 
                      zoom={11} 
                      scrollWheelZoom={false}
                      style={{ height: '100%', width: '100%' }}
                    >
                      <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />
                    
                      {reservoirLocations.map(reservoir => (
                        <Marker key={reservoir.id} position={reservoir.position}>
                          <Popup>
                            <div className="p-2">
                              <h3 className="font-bold text-sm">{reservoir.name}</h3>
                              <p className="text-xs mt-1">
                                {t("Cameras")}: {reservoir.cameras.length}
                              </p>
                              <p className="text-xs mt-1">
                                {t("Online")}: {cameras.filter(cam => reservoir.cameras.includes(cam.id) && cam.online).length}
                              </p>
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
                    </MapContainer>
                  )}
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
                    ({Math.round((cameras.filter(cam => cam.online).length / cameras.length) * 100)}%)
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>{t("Offline")}:</span>
                  <span className="font-semibold text-red-600">
                    {cameras.filter(cam => !cam.online).length}
                    ({Math.round((cameras.filter(cam => !cam.online).length / cameras.length) * 100)}%)
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