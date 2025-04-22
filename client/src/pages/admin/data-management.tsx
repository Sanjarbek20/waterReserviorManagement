import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Download, Filter, Database, BarChart3, Droplet, LineChart } from "lucide-react";

import DashboardLayout from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DatabaseAlgorithm from "@/components/admin/database-algorithm";
import WaterAlgorithms from "@/components/admin/water-algorithms";

export default function DataManagement() {
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [dataType, setDataType] = useState<string>("reservoirs");
  const { toast } = useToast();

  const { data: reservoirs = [] } = useQuery<any[]>({
    queryKey: ["/api/reservoirs"],
    enabled: dataType === "reservoirs",
  });

  const { data: allocations = [] } = useQuery<any[]>({
    queryKey: ["/api/allocations"],
    enabled: dataType === "allocations",
  });

  const { data: requests = [] } = useQuery<any[]>({
    queryKey: ["/api/requests"],
    enabled: dataType === "requests",
  });

  const downloadData = () => {
    let data;
    let filename;

    if (dataType === "reservoirs") {
      data = filterDataByDate(reservoirs);
      filename = `reservoirs_${formatDateForFilename(new Date())}.csv`;
    } else if (dataType === "allocations") {
      data = filterDataByDate(allocations);
      filename = `allocations_${formatDateForFilename(new Date())}.csv`;
    } else if (dataType === "requests") {
      data = filterDataByDate(requests);
      filename = `requests_${formatDateForFilename(new Date())}.csv`;
    } else {
      toast({
        title: "No data available",
        description: "Please try again later.",
        variant: "destructive",
      });
      return;
    }

    // Convert to CSV
    const csvContent = convertToCSV(data);
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    
    // Create download link
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    link.click();

    toast({
      title: "Download started",
      description: `Downloading ${filename}`,
    });
  };

  const filterDataByDate = (data: any[]) => {
    if (!startDate && !endDate) return data;
    
    return data.filter((item) => {
      const itemDate = new Date(item.createdAt || item.requestDate || item.lastUpdated);
      
      if (startDate && endDate) {
        return itemDate >= startDate && itemDate <= endDate;
      } else if (startDate) {
        return itemDate >= startDate;
      } else if (endDate) {
        return itemDate <= endDate;
      }
      
      return true;
    });
  };

  const formatDateForFilename = (date: Date): string => {
    return format(date, "yyyy-MM-dd");
  };

  const convertToCSV = (data: any[]): string => {
    if (!data || data.length === 0) return '';
    
    const headers = Object.keys(data[0]);
    const headerRow = headers.join(',');
    
    const rows = data.map(item => {
      return headers.map(header => {
        const cell = item[header];
        // Handle dates, nulls, etc.
        if (cell === null || cell === undefined) return '';
        if (cell instanceof Date) return format(cell, "yyyy-MM-dd HH:mm:ss");
        // Ensure strings with commas are quoted
        if (typeof cell === 'string' && cell.includes(',')) {
          return `"${cell}"`;
        }
        return cell;
      }).join(',');
    });
    
    return [headerRow, ...rows].join('\n');
  };

  return (
    <DashboardLayout title="Data Management">
      <div className="space-y-6">
        {/* Tizim algoritmlari bo'limi */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Tizimning to'liq algoritmi
            </CardTitle>
            <CardDescription>
              Suv resurslarini boshqarish tizimi algoritmlarini batafsil ko'rish
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="database" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="database">
                  <Database className="h-4 w-4 mr-2" />
                  Ma'lumotlar bazasi
                </TabsTrigger>
                <TabsTrigger value="water">
                  <Droplet className="h-4 w-4 mr-2" />
                  Suv monitoringi
                </TabsTrigger>
                <TabsTrigger value="analytics">
                  <LineChart className="h-4 w-4 mr-2" />
                  Statistik tahlil
                </TabsTrigger>
              </TabsList>

              <TabsContent value="database" className="pt-4">
                <div className="border p-4 rounded-md bg-slate-50 overflow-auto">
                  <h3 className="text-lg font-medium mb-2 text-center">Ma'lumotlar bazasi algoritmi</h3>
                  <p className="text-sm text-gray-500 mb-4 text-center">
                    Fragmentatsiya, ma'lumotlarni taqsimlash va birlashtirish algoritmlari diagrammasi
                  </p>
                  
                  <div className="w-full overflow-x-auto mb-4">
                    <div className="min-w-[900px] h-[600px]">
                      <DatabaseAlgorithm />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="bg-white p-3 rounded-md shadow-sm">
                      <h4 className="font-medium mb-2">Fragmentatsiya algoritmi</h4>
                      <p className="text-gray-600">
                        Ma'lumotlarni gorizontal va vertikal fragmentlar bo'yicha taqsimlash orqali samarali saqlash.
                      </p>
                    </div>
                    <div className="bg-white p-3 rounded-md shadow-sm">
                      <h4 className="font-medium mb-2">Ma'lumotlarni yig'ish algoritmi</h4>
                      <p className="text-gray-600">
                        Tarqalgan fragmentlardan umumiy ma'lumotlar bazasini shakllantirish uchun ma'lumotlarni yig'ish.
                      </p>
                    </div>
                    <div className="bg-white p-3 rounded-md shadow-sm">
                      <h4 className="font-medium mb-2">Fragment qoidalar algoritmi</h4>
                      <p className="text-gray-600">
                        Fragment qoidalari va tahlil qoidalari asosida ma'lumotlarni ajratish va birlashtirish.
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="water" className="pt-4">
                <div className="border p-4 rounded-md bg-slate-50 overflow-auto">
                  <h3 className="text-lg font-medium mb-2 text-center">Suv monitoringi algoritmlari</h3>
                  <p className="text-sm text-gray-500 mb-4 text-center">
                    Suv sathini kuzatish, tahlil qilish va taqsimlash algoritmlari diagrammasi
                  </p>
                  
                  <div className="w-full overflow-x-auto mb-4">
                    <div className="min-w-[900px] h-[600px]">
                      <WaterAlgorithms />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="bg-white p-3 rounded-md shadow-sm">
                      <h4 className="font-medium mb-2">Monitorlash algoritmi</h4>
                      <p className="text-gray-600">
                        Suv omborlaridagi suv sathini real vaqtda kuzatish va ma'lumotlarni qayta ishlash.
                      </p>
                    </div>
                    <div className="bg-white p-3 rounded-md shadow-sm">
                      <h4 className="font-medium mb-2">Taqsimot algoritmi</h4>
                      <p className="text-gray-600">
                        Ekin turlari va fermer ehtiyojlariga qarab optimal suv taqsimotini hisoblash.
                      </p>
                    </div>
                    <div className="bg-white p-3 rounded-md shadow-sm">
                      <h4 className="font-medium mb-2">Bashorat algoritmi</h4>
                      <p className="text-gray-600">
                        LSTM modellaridan foydalanib, suv sarfi va omborlar sathini bashorat qilish.
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="analytics" className="pt-4">
                <div className="border p-4 rounded-md bg-slate-50">
                  <h3 className="text-lg font-medium mb-2 text-center">Statistik tahlil algoritmlari</h3>
                  <p className="text-sm text-gray-500 mb-4 text-center">
                    Ma'lumotlarni tahlil qilish va statistika algoritmlari diagrammasi
                  </p>
                  
                  <div className="w-full overflow-x-auto mb-4 flex justify-center">
                    <svg width="800" height="400" viewBox="0 0 800 400">
                      {/* Algoritm diagrammasi */}
                      <rect x="300" y="20" width="200" height="60" rx="5" fill="#dbeafe" stroke="#0c4a6e" strokeWidth="2" />
                      <text x="400" y="50" textAnchor="middle" fontWeight="bold" fill="#0f172a">Statistik tahlil algoritmi</text>
                      <text x="400" y="70" textAnchor="middle" fontSize="12" fill="#64748b">Boshlang'ich nuqta</text>
                      
                      {/* Strelka */}
                      <line x1="400" y1="80" x2="400" y2="110" stroke="#64748b" strokeWidth="2" />
                      <polygon points="395,110 405,110 400,120" fill="#64748b" />
                      
                      {/* Ma'lumotlarni yig'ish */}
                      <rect x="300" y="120" width="200" height="60" rx="0" fill="#f8fafc" stroke="#0c4a6e" strokeWidth="2" />
                      <text x="400" y="150" textAnchor="middle" fontWeight="bold" fill="#0f172a">Ma'lumotlarni yig'ish va</text>
                      <text x="400" y="170" textAnchor="middle" fontWeight="bold" fill="#0f172a">normalizatsiya qilish</text>
                      
                      {/* Strelka */}
                      <line x1="400" y1="180" x2="400" y2="210" stroke="#64748b" strokeWidth="2" />
                      <polygon points="395,210 405,210 400,220" fill="#64748b" />
                      
                      {/* Tahlil qilish */}
                      <rect x="300" y="220" width="200" height="60" rx="0" fill="#f8fafc" stroke="#0c4a6e" strokeWidth="2" />
                      <text x="400" y="250" textAnchor="middle" fontWeight="bold" fill="#0f172a">Statistik modellarni</text>
                      <text x="400" y="270" textAnchor="middle" fontWeight="bold" fill="#0f172a">qo'llash va tahlil qilish</text>
                      
                      {/* Strelka */}
                      <line x1="400" y1="280" x2="400" y2="310" stroke="#64748b" strokeWidth="2" />
                      <polygon points="395,310 405,310 400,320" fill="#64748b" />
                      
                      {/* Natijalarni vizualizatsiya qilish */}
                      <rect x="300" y="320" width="200" height="60" rx="0" fill="#f8fafc" stroke="#0c4a6e" strokeWidth="2" />
                      <text x="400" y="350" textAnchor="middle" fontWeight="bold" fill="#0f172a">Natijalarni vizualizatsiya</text>
                      <text x="400" y="370" textAnchor="middle" fontWeight="bold" fill="#0f172a">qilish va hisobot yaratish</text>
                    </svg>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="bg-white p-3 rounded-md shadow-sm">
                      <h4 className="font-medium mb-2">Ma'lumotlar normalizatsiyasi</h4>
                      <p className="text-gray-600">
                        Turli ko'rinishdagi ma'lumotlarni standartlashtirish va tahlilga tayyorlash.
                      </p>
                    </div>
                    <div className="bg-white p-3 rounded-md shadow-sm">
                      <h4 className="font-medium mb-2">Tahlil modellari</h4>
                      <p className="text-gray-600">
                        Regressiya, klassifikatsiya va klusterlash modellari orqali ma'lumotlarni tahlil qilish.
                      </p>
                    </div>
                    <div className="bg-white p-3 rounded-md shadow-sm">
                      <h4 className="font-medium mb-2">Vizualizatsiya usullari</h4>
                      <p className="text-gray-600">
                        Ma'lumotlarni grafiklar, diagrammalar va interaktiv ko'rinishda taqdim etish.
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
        {/* Ma'lumotlarni yuklab olish qismi */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              Ma'lumotlarni yuklab olish
            </CardTitle>
            <CardDescription>
              Suv boshqaruvi ma'lumotlarini tahlil va hisobot uchun yuklab olish
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="filter" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="filter">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter sozlamalari
                </TabsTrigger>
                <TabsTrigger value="preview">
                  Ma'lumotlar ko'rinishi
                </TabsTrigger>
              </TabsList>

              <TabsContent value="filter" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Ma'lumotlar turi</h3>
                    <Select value={dataType} onValueChange={setDataType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Turni tanlang" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="reservoirs">Suv omborlari</SelectItem>
                        <SelectItem value="allocations">Suv taqsimoti</SelectItem>
                        <SelectItem value="requests">Suv so'rovlari</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Boshlanish sanasi</h3>
                    <DatePicker date={startDate} setDate={setStartDate} />
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Tugash sanasi</h3>
                    <DatePicker date={endDate} setDate={setEndDate} />
                  </div>

                  <div className="flex items-end">
                    <Button onClick={downloadData} className="w-full gap-1">
                      <Download className="h-4 w-4" />
                      Ma'lumotlarni yuklab olish
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="preview">
                <div className="rounded-md border h-[300px] overflow-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="h-10 px-4 text-left font-medium">ID</th>
                        <th className="h-10 px-4 text-left font-medium">Nomi/Turi</th>
                        <th className="h-10 px-4 text-left font-medium">Sana</th>
                        <th className="h-10 px-4 text-left font-medium">Status/Daraja</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dataType === "reservoirs" && reservoirs.map((reservoir: any) => (
                        <tr key={reservoir.id} className="border-b">
                          <td className="p-4">{reservoir.id}</td>
                          <td className="p-4">{reservoir.name}</td>
                          <td className="p-4">{reservoir.lastUpdated ? format(new Date(reservoir.lastUpdated), "yyyy-MM-dd") : "-"}</td>
                          <td className="p-4">{`${(reservoir.currentLevel / reservoir.capacity * 100).toFixed(1)}%`}</td>
                        </tr>
                      ))}
                      {dataType === "allocations" && allocations.map((allocation: any) => (
                        <tr key={allocation.id} className="border-b">
                          <td className="p-4">{allocation.id}</td>
                          <td className="p-4">{`Foydalanuvchi ID: ${allocation.userId}`}</td>
                          <td className="p-4">{format(new Date(allocation.startDate), "yyyy-MM-dd")}</td>
                          <td className="p-4">{`${allocation.used}/${allocation.amount}`}</td>
                        </tr>
                      ))}
                      {dataType === "requests" && requests.map((request: any) => (
                        <tr key={request.id} className="border-b">
                          <td className="p-4">{request.id}</td>
                          <td className="p-4">{request.type}</td>
                          <td className="p-4">{format(new Date(request.requestDate), "yyyy-MM-dd")}</td>
                          <td className="p-4">{request.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}