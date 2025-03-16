import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Camera } from "lucide-react";
import { cn } from "@/lib/utils";

// Define the available camera grid layouts
type GridLayout = "2x2" | "4x4" | "8x8";

export default function AdminSurveillance() {
  const [layout, setLayout] = useState<GridLayout>("2x2");
  const [cameras, setCameras] = useState<{ id: number; name: string; online: boolean }[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // In a real application, we would fetch the cameras from the API
  useEffect(() => {
    // Simulate loading cameras from an API
    setIsLoading(true);
    const timeout = setTimeout(() => {
      // Generate mock camera data - in a real app, this would come from an API
      const generateCameras = (count: number) => {
        return Array.from({ length: count }, (_, i) => ({
          id: i + 1,
          name: `Reservoir Camera ${i + 1}`,
          online: Math.random() > 0.2, // 80% chance of being online
        }));
      };

      const cameraCount = layout === "2x2" ? 4 : layout === "4x4" ? 16 : 64;
      setCameras(generateCameras(cameraCount));
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timeout);
  }, [layout]);

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
    <DashboardLayout title="Video Surveillance">
      <div className="space-y-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xl font-bold">Reservoir Surveillance Cameras</CardTitle>
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
                          <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center">
                            <span className="text-xs font-medium bg-black/50 px-2 py-1 rounded">
                              {camera.name}
                            </span>
                            <span className="flex items-center">
                              <span className="h-2 w-2 bg-green-500 rounded-full animate-pulse mr-1"></span>
                              <span className="text-xs bg-black/50 px-2 py-1 rounded">Live</span>
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
                              <span className="text-xs bg-black/50 px-2 py-1 rounded text-white">Offline</span>
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Camera Controls</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col space-y-2">
                <Label htmlFor="camera-selection">Select Camera</Label>
                <select 
                  id="camera-selection"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">Select a camera</option>
                  {cameras.filter(cam => cam.online).map((camera) => (
                    <option key={camera.id} value={camera.id}>
                      {camera.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <Button variant="outline" size="sm" disabled>Pan Left</Button>
                <Button variant="outline" size="sm" disabled>Pan Up</Button>
                <Button variant="outline" size="sm" disabled>Pan Right</Button>
                <Button variant="outline" size="sm" disabled>Zoom Out</Button>
                <Button variant="outline" size="sm" disabled>Pan Down</Button>
                <Button variant="outline" size="sm" disabled>Zoom In</Button>
              </div>

              <div className="flex justify-between">
                <Button variant="outline" size="sm" className="w-full" disabled>
                  Capture Image
                </Button>
                <div className="w-4"></div>
                <Button variant="destructive" size="sm" className="w-full" disabled>
                  Start Recording
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Camera Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Total Cameras:</span>
                  <span className="font-semibold">{cameras.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Online:</span>
                  <span className="font-semibold text-green-600">
                    {cameras.filter(cam => cam.online).length} 
                    ({Math.round((cameras.filter(cam => cam.online).length / cameras.length) * 100)}%)
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Offline:</span>
                  <span className="font-semibold text-red-600">
                    {cameras.filter(cam => !cam.online).length}
                    ({Math.round((cameras.filter(cam => !cam.online).length / cameras.length) * 100)}%)
                  </span>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <h4 className="font-medium">Recently Offline</h4>
                  {cameras.filter(cam => !cam.online).slice(0, 3).map(camera => (
                    <div key={camera.id} className="flex justify-between text-sm py-1 border-b">
                      <span>{camera.name}</span>
                      <span className="text-red-600">Offline</span>
                    </div>
                  ))}
                  {cameras.filter(cam => !cam.online).length === 0 && (
                    <p className="text-sm text-gray-500">No offline cameras</p>
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