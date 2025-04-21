import React, { useState } from "react";
import DashboardLayout from "@/components/layout/dashboard-layout";
import ExtendedReservoirMap from "@/components/maps/ExtendedReservoirMap";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Download, Filter, Map, TableProperties } from "lucide-react";
import { crossBorderReservoirs, getUzbekControlledReservoirs, getCrossBorderReservoirsByCountry } from "@/data/cross-border-reservoirs";
import { canalSystems, getCanalsByReservoir } from "@/data/canal-systems";

export default function CrossBorderReservoirs() {
  const [view, setView] = useState<"map" | "table">("map");
  const [countryFilter, setCountryFilter] = useState<string>("all");
  
  const filteredReservoirs = countryFilter === "all" 
    ? crossBorderReservoirs 
    : getCrossBorderReservoirsByCountry(countryFilter);

  const handleDownloadCSV = () => {
    // Create CSV content from reservoirs data
    const headers = ["Nomi", "Davlat", "Sig'imi (mln m³)", "Joriy sathi (mln m³)", "Daryolar", "Xizmat ko'rsatadigan hududlar", "Asosiy kanallar", "Nazorat"];
    
    const rows = filteredReservoirs.map(reservoir => [
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

  return (
    <DashboardLayout title="Chegaradan tashqari suv omborlari">
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center space-x-2">
            <Button 
              variant={view === "map" ? "default" : "outline"} 
              size="sm" 
              onClick={() => setView("map")}
            >
              <Map className="h-4 w-4 mr-2" />
              Xarita ko'rinishi
            </Button>
            <Button 
              variant={view === "table" ? "default" : "outline"} 
              size="sm" 
              onClick={() => setView("table")}
            >
              <TableProperties className="h-4 w-4 mr-2" />
              Jadval ko'rinishi
            </Button>
          </div>
          
          <div className="flex items-center space-x-2">
            <Select value={countryFilter} onValueChange={setCountryFilter}>
              <SelectTrigger className="w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Davlat bo'yicha" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Barcha davlatlar</SelectItem>
                <SelectItem value="O'zbekiston">O'zbekiston</SelectItem>
                <SelectItem value="Qirg'iziston">Qirg'iziston</SelectItem>
                <SelectItem value="Qozog'iston">Qozog'iston</SelectItem>
                <SelectItem value="Tojikiston">Tojikiston</SelectItem>
                <SelectItem value="Turkmaniston">Turkmaniston</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline" size="sm" onClick={handleDownloadCSV}>
              <Download className="h-4 w-4 mr-2" />
              CSV yuklab olish
            </Button>
          </div>
        </div>
        
        {view === "map" ? (
          <ExtendedReservoirMap />
        ) : (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Chegaradan tashqari suv omborlari jadvali</CardTitle>
              <CardDescription>
                O'zbekiston nazorati va kuzatuvi ostidagi barcha suv omborlari
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nomi</TableHead>
                    <TableHead>Davlat</TableHead>
                    <TableHead className="text-right">Sig'imi (mln m³)</TableHead>
                    <TableHead className="text-right">Joriy sathi (mln m³)</TableHead>
                    <TableHead>Xizmat ko'rsatadigan hududlar</TableHead>
                    <TableHead>Nazorat holati</TableHead>
                    <TableHead>Asosiy kanallar</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReservoirs.map((reservoir) => (
                    <TableRow key={reservoir.id}>
                      <TableCell className="font-medium">{reservoir.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {reservoir.country}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">{reservoir.capacity}</TableCell>
                      <TableCell className="text-right">{reservoir.currentLevel}</TableCell>
                      <TableCell>
                        <div className="max-w-[200px] truncate">
                          {reservoir.servedRegions.join(', ')}
                        </div>
                      </TableCell>
                      <TableCell>
                        {reservoir.underUzbekControl ? (
                          <Badge variant="default" className="bg-green-500">O'zbekiston nazoratida</Badge>
                        ) : reservoir.sharedControl ? (
                          <Badge variant="default" className="bg-blue-500">Hamkorlikda nazorat</Badge>
                        ) : (
                          <Badge variant="outline">Boshqa davlat nazoratida</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="max-w-[200px] truncate">
                          {reservoir.mainCanals.join(', ')}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
        
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
                  {getUzbekControlledReservoirs().length} ta
                </p>
              </div>
              
              <div className="bg-amber-50 p-4 rounded-lg text-center">
                <h3 className="text-lg font-medium text-amber-800">Asosiy kanallar</h3>
                <p className="text-2xl font-bold text-amber-600">
                  {canalSystems.length} ta
                </p>
              </div>
            </div>
            
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-2">Ma'lumotlar manbalari:</h3>
              <ul className="list-disc list-inside text-sm text-gray-600">
                <li>O'zbekiston Respublikasi Suv xo'jaligi vazirligi</li>
                <li>O'zbekiston va Markaziy Osiyo suv resurslari bo'yicha ICWC ma'lumotlari</li>
                <li>O'zbekiston Respublikasi Vazirlar Mahkamasi huzuridagi Gidrometeorologiya xizmati markazi</li>
                <li>Markaziy Osiyo mintaqaviy ekologik markazi</li>
                <li>O'zbekiston Milliy gidrologik va meteorologik xizmati</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}