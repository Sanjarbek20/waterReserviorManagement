import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, CircleMarker, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { crossBorderReservoirs, getReservoirById } from "@/data/cross-border-reservoirs";
import { canalSystems, getCanalsByReservoir } from "@/data/canal-systems";

// Leaflet icon settings
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

// Custom icon for reservoirs
const reservoirIcon = new L.Icon({
  iconUrl: '/images/icons/reservoir-icon.png',
  iconSize: [30, 30],
  iconAnchor: [15, 15],
  popupAnchor: [0, -15],
});

// Custom icon for monitoring stations
const monitoringIcon = new L.Icon({
  iconUrl: '/images/icons/monitoring-station.png',
  iconSize: [20, 20],
  iconAnchor: [10, 10],
  popupAnchor: [0, -10],
});

export default function ExtendedReservoirMap() {
  const [showCanals, setShowCanals] = useState(true);
  const [showDistricts, setShowDistricts] = useState(true);
  const [showCrossBorder, setShowCrossBorder] = useState(true);
  const [selectedCountry, setSelectedCountry] = useState<string>("all");
  const [selectedRegion, setSelectedRegion] = useState<string>("all");

  // Filter reservoirs based on selections
  const filteredReservoirs = crossBorderReservoirs.filter(reservoir => {
    if (selectedCountry !== "all" && !reservoir.country.includes(selectedCountry)) return false;
    if (selectedRegion !== "all" && !reservoir.servedRegions.some(region => region.includes(selectedRegion))) return false;
    return true;
  });

  const colorByCountry = (country: string) => {
    if (country.includes("Qirg'iziston")) return "#FF5733";
    if (country.includes("Qozog'iston")) return "#33A1FF";
    if (country.includes("Tojikiston")) return "#33FFC1";
    if (country.includes("Turkmaniston")) return "#FF33A8";
    return "#4CAF50"; // O'zbekiston
  };

  const getCanalColor = (canal: any) => {
    // Color based on capacity
    if (canal.capacity > 200) return "#0000FF"; // Blue for large canals
    if (canal.capacity > 100) return "#4169E1"; // Royal blue for medium canals
    return "#87CEEB"; // Sky blue for smaller canals
  };

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

  return (
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
              <Select value={selectedRegion} onValueChange={setSelectedRegion}>
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
              {filteredReservoirs.map((reservoir) => (
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
  );
}