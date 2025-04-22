import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { 
  Download, 
  Filter, 
  Database, 
  BarChart3, 
  Droplet, 
  LineChart, 
  Settings, 
  GitBranch, 
  Layers,
  Network,
  Cpu,
  Lock,
  BarChart4,
  Server
} from "lucide-react";

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
              <TabsList className="grid w-full grid-cols-6">
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
                <TabsTrigger value="security">
                  <Lock className="h-4 w-4 mr-2" />
                  Xavfsizlik
                </TabsTrigger>
                <TabsTrigger value="system">
                  <Cpu className="h-4 w-4 mr-2" />
                  Tizim arxitekturasi
                </TabsTrigger>
                <TabsTrigger value="network">
                  <Network className="h-4 w-4 mr-2" />
                  Tarmoq
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
                    <svg width="800" height="550" viewBox="0 0 800 550">
                      {/* Algoritm boshi */}
                      <ellipse cx="400" cy="30" rx="80" ry="30" fill="#bfdbfe" stroke="#0c4a6e" strokeWidth="2" />
                      <text x="400" y="35" textAnchor="middle" fontWeight="bold" fill="#0f172a">Boshlash</text>
                      
                      {/* Strelka */}
                      <line x1="400" y1="60" x2="400" y2="90" stroke="#64748b" strokeWidth="2" />
                      <polygon points="395,90 405,90 400,100" fill="#64748b" />
                      
                      {/* Ma'lumotlar manbalari */}
                      <rect x="300" y="100" width="200" height="60" rx="0" fill="#bfdbfe" stroke="#0c4a6e" strokeWidth="2" />
                      <text x="400" y="130" textAnchor="middle" fontWeight="bold" fill="#0f172a">Ma'lumotlar manbalarini</text>
                      <text x="400" y="150" textAnchor="middle" fontWeight="bold" fill="#0f172a">aniqlash</text>
                      
                      {/* Strelka */}
                      <line x1="400" y1="160" x2="400" y2="190" stroke="#64748b" strokeWidth="2" />
                      <polygon points="395,190 405,190 400,200" fill="#64748b" />
                      
                      {/* Ma'lumotlarni yig'ish */}
                      <rect x="300" y="200" width="200" height="60" rx="0" fill="#f8fafc" stroke="#0c4a6e" strokeWidth="2" />
                      <text x="400" y="230" textAnchor="middle" fontWeight="bold" fill="#0f172a">Ma'lumotlarni yig'ish va</text>
                      <text x="400" y="250" textAnchor="middle" fontWeight="bold" fill="#0f172a">normalizatsiya qilish</text>
                      
                      {/* Shart tekshirish */}
                      <polygon points="400,280 325,330 475,330" fill="#bfdbfe" stroke="#0c4a6e" strokeWidth="2" />
                      <text x="400" y="315" textAnchor="middle" fontWeight="bold" fill="#0f172a">Ma'lumotlar yetarli?</text>
                      
                      {/* Strelka yo'q */}
                      <line x1="325" y1="330" x2="200" y2="330" stroke="#64748b" strokeWidth="2" />
                      <polygon points="210,325 200,330 210,335" fill="#64748b" />
                      <text x="260" y="315" textAnchor="middle" fontSize="12" fill="#7f1d1d">Yo'q</text>
                      
                      {/* Ma'lumotlarni to'ldirish */}
                      <rect x="100" y="300" width="100" height="60" rx="0" fill="#dbeafe" stroke="#0c4a6e" strokeWidth="2" />
                      <text x="150" y="330" textAnchor="middle" fontWeight="bold" fill="#0f172a">Qo'shimcha</text>
                      <text x="150" y="350" textAnchor="middle" fontWeight="bold" fill="#0f172a">ma'lumotlar</text>
                      
                      {/* Strelka qaytish */}
                      <line x1="100" y1="330" x2="100" y2="230" stroke="#64748b" strokeWidth="2" />
                      <line x1="100" y1="230" x2="300" y2="230" stroke="#64748b" strokeWidth="2" />
                      <polygon points="290,225 300,230 290,235" fill="#64748b" />
                      
                      {/* Strelka ha */}
                      <line x1="400" y1="330" x2="400" y2="360" stroke="#64748b" strokeWidth="2" />
                      <polygon points="395,360 405,360 400,370" fill="#64748b" />
                      <text x="415" y="345" textAnchor="middle" fontSize="12" fill="#15803d">Ha</text>
                      
                      {/* Tahlil qilish */}
                      <rect x="300" y="370" width="200" height="60" rx="0" fill="#f8fafc" stroke="#0c4a6e" strokeWidth="2" />
                      <text x="400" y="400" textAnchor="middle" fontWeight="bold" fill="#0f172a">Statistik modellarni</text>
                      <text x="400" y="420" textAnchor="middle" fontWeight="bold" fill="#0f172a">qo'llash va tahlil qilish</text>
                      
                      {/* Strelka */}
                      <line x1="400" y1="430" x2="400" y2="460" stroke="#64748b" strokeWidth="2" />
                      <polygon points="395,460 405,460 400,470" fill="#64748b" />
                      
                      {/* Natijalarni vizualizatsiya qilish */}
                      <rect x="300" y="470" width="200" height="60" rx="0" fill="#f8fafc" stroke="#0c4a6e" strokeWidth="2" />
                      <text x="400" y="500" textAnchor="middle" fontWeight="bold" fill="#0f172a">Natijalarni vizualizatsiya</text>
                      <text x="400" y="520" textAnchor="middle" fontWeight="bold" fill="#0f172a">qilish va hisobot yaratish</text>
                      
                      {/* Tugash */}
                      <line x1="400" y1="530" x2="400" y2="560" stroke="#64748b" strokeWidth="2" />
                      <polygon points="395,560 405,560 400,570" fill="#64748b" />
                      
                      {/* Algoritm oxiri */}
                      <ellipse cx="400" cy="590" rx="80" ry="30" fill="#bfdbfe" stroke="#0c4a6e" strokeWidth="2" />
                      <text x="400" y="595" textAnchor="middle" fontWeight="bold" fill="#0f172a">Yakunlash</text>
                      
                      {/* Yon ta'riflar */}
                      <rect x="550" y="300" width="150" height="80" rx="5" fill="#f5f5f4" stroke="#78716c" strokeWidth="1.5" />
                      <text x="625" y="330" textAnchor="middle" fontSize="12" fill="#0f172a">LSTM modeli</text>
                      <text x="625" y="350" textAnchor="middle" fontSize="12" fill="#0f172a">bashorat uchun</text>
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
              
              <TabsContent value="security" className="pt-4">
                <div className="border p-4 rounded-md bg-slate-50">
                  <h3 className="text-lg font-medium mb-2 text-center">Xavfsizlik algoritmlari</h3>
                  <p className="text-sm text-gray-500 mb-4 text-center">
                    Tizim xavfsizligini ta'minlash uchun qo'llaniladigan algoritmlar
                  </p>
                  
                  <div className="w-full overflow-x-auto mb-4 flex justify-center">
                    <svg width="800" height="500" viewBox="0 0 800 500">
                      {/* Algoritm boshi */}
                      <ellipse cx="400" cy="30" rx="80" ry="30" fill="#fee2e2" stroke="#7f1d1d" strokeWidth="2" />
                      <text x="400" y="35" textAnchor="middle" fontWeight="bold" fill="#0f172a">Boshlash</text>
                      
                      {/* Strelka */}
                      <line x1="400" y1="60" x2="400" y2="90" stroke="#64748b" strokeWidth="2" />
                      <polygon points="395,90 405,90 400,100" fill="#64748b" />
                      
                      {/* Kirish ma'lumotlari */}
                      <rect x="300" y="100" width="200" height="60" rx="0" fill="#fecaca" stroke="#7f1d1d" strokeWidth="2" />
                      <text x="400" y="130" textAnchor="middle" fontWeight="bold" fill="#0f172a">Kirish ma'lumotlarini</text>
                      <text x="400" y="150" textAnchor="middle" fontWeight="bold" fill="#0f172a">qabul qilish</text>
                      
                      {/* Strelka */}
                      <line x1="400" y1="160" x2="400" y2="190" stroke="#64748b" strokeWidth="2" />
                      <polygon points="395,190 405,190 400,200" fill="#64748b" />
                      
                      {/* Autentifikatsiya tekshirish */}
                      <rect x="300" y="200" width="200" height="60" rx="0" fill="#f8fafc" stroke="#7f1d1d" strokeWidth="2" />
                      <text x="400" y="230" textAnchor="middle" fontWeight="bold" fill="#0f172a">Foydalanuvchi</text>
                      <text x="400" y="250" textAnchor="middle" fontWeight="bold" fill="#0f172a">autentifikatsiyasi</text>
                      
                      {/* Shart tekshirish */}
                      <polygon points="400,280 325,330 475,330" fill="#fee2e2" stroke="#7f1d1d" strokeWidth="2" />
                      <text x="400" y="315" textAnchor="middle" fontWeight="bold" fill="#0f172a">Tasdiqlandi?</text>
                      
                      {/* Strelka yo'q */}
                      <line x1="325" y1="330" x2="200" y2="330" stroke="#64748b" strokeWidth="2" />
                      <polygon points="205,325 195,330 205,335" fill="#64748b" />
                      <text x="260" y="315" textAnchor="middle" fontSize="12" fill="#7f1d1d">Yo'q</text>
                      
                      {/* Xatolik xabari */}
                      <rect x="100" y="300" width="100" height="60" rx="0" fill="#fecaca" stroke="#7f1d1d" strokeWidth="2" />
                      <text x="150" y="335" textAnchor="middle" fontWeight="bold" fill="#0f172a">Xatolik</text>
                      
                      {/* Strelka qaytish */}
                      <line x1="150" y1="300" x2="150" y2="130" stroke="#64748b" strokeWidth="2" />
                      <line x1="150" y1="130" x2="300" y2="130" stroke="#64748b" strokeWidth="2" />
                      <polygon points="290,125 300,130 290,135" fill="#64748b" />
                      
                      {/* Strelka ha */}
                      <line x1="400" y1="330" x2="400" y2="360" stroke="#64748b" strokeWidth="2" />
                      <polygon points="395,360 405,360 400,370" fill="#64748b" />
                      <text x="415" y="345" textAnchor="middle" fontSize="12" fill="#15803d">Ha</text>
                      
                      {/* Avtorizatsiya */}
                      <rect x="300" y="370" width="200" height="60" rx="0" fill="#f8fafc" stroke="#7f1d1d" strokeWidth="2" />
                      <text x="400" y="400" textAnchor="middle" fontWeight="bold" fill="#0f172a">Ruxsatlarni tekshirish</text>
                      <text x="400" y="420" textAnchor="middle" fontWeight="bold" fill="#0f172a">(Avtorizatsiya)</text>
                      
                      {/* Strelka */}
                      <line x1="400" y1="430" x2="400" y2="460" stroke="#64748b" strokeWidth="2" />
                      <polygon points="395,460 405,460 400,470" fill="#64748b" />
                      
                      {/* Algoritm soni */}
                      <ellipse cx="400" cy="490" rx="80" ry="30" fill="#fee2e2" stroke="#7f1d1d" strokeWidth="2" />
                      <text x="400" y="495" textAnchor="middle" fontWeight="bold" fill="#0f172a">Yakunlash</text>
                    </svg>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="bg-white p-3 rounded-md shadow-sm">
                      <h4 className="font-medium mb-2">Autentifikatsiya algoritmi</h4>
                      <p className="text-gray-600">
                        Foydalanuvchi identifikatsiyasi va tasdiqlash jarayonlarini ta'minlash.
                      </p>
                    </div>
                    <div className="bg-white p-3 rounded-md shadow-sm">
                      <h4 className="font-medium mb-2">Ruxsat boshqaruvi</h4>
                      <p className="text-gray-600">
                        Rollar asosida resurslar va ma'lumotlarga ruxsat berish va ruxsatlarni boshqarish.
                      </p>
                    </div>
                    <div className="bg-white p-3 rounded-md shadow-sm">
                      <h4 className="font-medium mb-2">Xavfsizlik auditi</h4>
                      <p className="text-gray-600">
                        Tizim operatsiyalari va foydalanuvchi harakatlarini qayd qilish va tekshirish.
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="system" className="pt-4">
                <div className="border p-4 rounded-md bg-slate-50">
                  <h3 className="text-lg font-medium mb-2 text-center">Tizim arxitekturasi</h3>
                  <p className="text-sm text-gray-500 mb-4 text-center">
                    Tizimning asosiy komponentlari va ularning o'zaro bog'liqligi
                  </p>
                  
                  <div className="w-full overflow-x-auto mb-4 flex justify-center">
                    <svg width="800" height="600" viewBox="0 0 800 600">
                      {/* Algoritm boshi */}
                      <ellipse cx="400" cy="30" rx="80" ry="30" fill="#dbeafe" stroke="#0c4a6e" strokeWidth="2" />
                      <text x="400" y="35" textAnchor="middle" fontWeight="bold" fill="#0f172a">Boshlash</text>
                      
                      {/* Strelka */}
                      <line x1="400" y1="60" x2="400" y2="90" stroke="#64748b" strokeWidth="2" />
                      <polygon points="395,90 405,90 400,100" fill="#64748b" />
                      
                      {/* Front-end qismi */}
                      <rect x="50" y="100" width="200" height="80" rx="5" fill="#dbeafe" stroke="#0c4a6e" strokeWidth="2" />
                      <text x="150" y="125" textAnchor="middle" fontWeight="bold" fill="#0f172a">Front-end qismi</text>
                      <text x="150" y="150" textAnchor="middle" fontSize="12" fill="#64748b">React, TypeScript, Vite</text>
                      
                      {/* Strelka */}
                      <line x1="250" y1="140" x2="350" y2="140" stroke="#64748b" strokeWidth="2" />
                      <polygon points="340,135 350,140 340,145" fill="#64748b" />
                      
                      {/* Ma'lumotlar uzatish */}
                      <rect x="350" y="100" width="100" height="80" rx="0" fill="#f1f5f9" stroke="#0c4a6e" strokeWidth="2" />
                      <text x="400" y="140" textAnchor="middle" fontWeight="bold" fill="#0f172a">HTTP/</text>
                      <text x="400" y="160" textAnchor="middle" fontWeight="bold" fill="#0f172a">WebSocket</text>
                      
                      {/* Strelka */}
                      <line x1="450" y1="140" x2="550" y2="140" stroke="#64748b" strokeWidth="2" />
                      <polygon points="540,135 550,140 540,145" fill="#64748b" />
                      
                      {/* Back-end qismi */}
                      <rect x="550" y="100" width="200" height="80" rx="5" fill="#cffafe" stroke="#164e63" strokeWidth="2" />
                      <text x="650" y="125" textAnchor="middle" fontWeight="bold" fill="#0f172a">Back-end qismi</text>
                      <text x="650" y="150" textAnchor="middle" fontSize="12" fill="#64748b">Node.js, Express</text>
                      
                      {/* AI modellari */}
                      <rect x="150" y="250" width="200" height="80" rx="5" fill="#fef9c3" stroke="#713f12" strokeWidth="2" />
                      <text x="250" y="285" textAnchor="middle" fontWeight="bold" fill="#0f172a">AI modellari</text>
                      <text x="250" y="310" textAnchor="middle" fontSize="12" fill="#64748b">TensorFlow.js, LSTM</text>
                      
                      {/* Strelka */}
                      <line x1="150" y1="180" x2="150" y2="250" stroke="#64748b" strokeWidth="2" />
                      <line x1="150" y1="180" x2="150" y2="200" stroke="#64748b" strokeWidth="2" />
                      <polygon points="145,240 150,250 155,240" fill="#64748b" />
                      <text x="110" y="220" textAnchor="middle" fontSize="12" fill="#64748b">JavaScript API</text>
                      
                      {/* Ma'lumotlar bazasi */}
                      <rect x="450" y="250" width="200" height="80" rx="5" fill="#ecfccb" stroke="#3f6212" strokeWidth="2" />
                      <text x="550" y="285" textAnchor="middle" fontWeight="bold" fill="#0f172a">Ma'lumotlar bazasi</text>
                      <text x="550" y="310" textAnchor="middle" fontSize="12" fill="#64748b">PostgreSQL, Drizzle ORM</text>
                      
                      {/* Strelka */}
                      <line x1="650" y1="180" x2="650" y2="250" stroke="#64748b" strokeWidth="2" />
                      <polygon points="645,240 650,250 655,240" fill="#64748b" />
                      <text x="680" y="220" textAnchor="middle" fontSize="12" fill="#64748b">SQL</text>
                      
                      {/* Strelka */}
                      <line x1="350" y1="290" x2="450" y2="290" stroke="#64748b" strokeWidth="2" />
                      <polygon points="440,285 450,290 440,295" fill="#64748b" />
                      <text x="400" y="275" textAnchor="middle" fontSize="12" fill="#64748b">Ma'lumotlar uzatish</text>
                      
                      {/* Tizim boshqaruvi */}
                      <rect x="300" y="400" width="200" height="80" rx="5" fill="#fae8ff" stroke="#701a75" strokeWidth="2" />
                      <text x="400" y="435" textAnchor="middle" fontWeight="bold" fill="#0f172a">Tizim boshqaruvi</text>
                      <text x="400" y="455" textAnchor="middle" fontSize="12" fill="#64748b">WebSocket, mikroxizmatlar</text>
                      
                      {/* Strelka */}
                      <line x1="250" y1="330" x2="320" y2="400" stroke="#64748b" strokeWidth="2" />
                      <polygon points="313,392 320,400 327,392" fill="#64748b" />
                      
                      {/* Strelka */}
                      <line x1="550" y1="330" x2="480" y2="400" stroke="#64748b" strokeWidth="2" />
                      <polygon points="473,392 480,400 487,392" fill="#64748b" />
                      
                      {/* Strelka */}
                      <line x1="400" y1="480" x2="400" y2="540" stroke="#64748b" strokeWidth="2" />
                      <polygon points="395,530 400,540 405,530" fill="#64748b" />
                      
                      {/* Algoritm tugashi */}
                      <ellipse cx="400" cy="570" rx="80" ry="30" fill="#dbeafe" stroke="#0c4a6e" strokeWidth="2" />
                      <text x="400" y="575" textAnchor="middle" fontWeight="bold" fill="#0f172a">Yakunlash</text>
                    </svg>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="bg-white p-3 rounded-md shadow-sm">
                      <h4 className="font-medium mb-2">Frontend arxitekturasi</h4>
                      <p className="text-gray-600">
                        React va TypeScript asosida komponentli tizim, React Query orqali ma'lumotlarni boshqarish.
                      </p>
                    </div>
                    <div className="bg-white p-3 rounded-md shadow-sm">
                      <h4 className="font-medium mb-2">Backend arxitekturasi</h4>
                      <p className="text-gray-600">
                        Express.js, WebSocket serverlar va RESTful API endpointlari, Middleware qatlamlari.
                      </p>
                    </div>
                    <div className="bg-white p-3 rounded-md shadow-sm">
                      <h4 className="font-medium mb-2">Ma'lumotlar bazasi</h4>
                      <p className="text-gray-600">
                        PostgreSQL asosida ma'lumotlar bazasi sxemasi, Drizzle ORM qatlamlari.
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="network" className="pt-4">
                <div className="border p-4 rounded-md bg-slate-50">
                  <h3 className="text-lg font-medium mb-2 text-center">Tarmoq algoritmlari</h3>
                  <p className="text-sm text-gray-500 mb-4 text-center">
                    Ma'lumotlarni uzatish va sinxronizatsiya algoritmlari
                  </p>
                  
                  <div className="w-full overflow-x-auto mb-4 flex justify-center">
                    <svg width="800" height="600" viewBox="0 0 800 600">
                      {/* Algoritm boshi */}
                      <ellipse cx="400" cy="30" rx="80" ry="30" fill="#e9d5ff" stroke="#581c87" strokeWidth="2" />
                      <text x="400" y="35" textAnchor="middle" fontWeight="bold" fill="#0f172a">Boshlash</text>
                      
                      {/* Strelka */}
                      <line x1="400" y1="60" x2="400" y2="90" stroke="#64748b" strokeWidth="2" />
                      <polygon points="395,90 405,90 400,100" fill="#64748b" />
                      
                      {/* Server ishga tushirish */}
                      <rect x="300" y="100" width="200" height="60" rx="0" fill="#e9d5ff" stroke="#581c87" strokeWidth="2" />
                      <text x="400" y="130" textAnchor="middle" fontWeight="bold" fill="#0f172a">WebSocket serverni</text>
                      <text x="400" y="150" textAnchor="middle" fontWeight="bold" fill="#0f172a">ishga tushirish</text>
                      
                      {/* Strelka */}
                      <line x1="400" y1="160" x2="400" y2="190" stroke="#64748b" strokeWidth="2" />
                      <polygon points="395,190 405,190 400,200" fill="#64748b" />
                      
                      {/* Mijoz ulangan? */}
                      <polygon points="400,200 325,250 475,250" fill="#e9d5ff" stroke="#581c87" strokeWidth="2" />
                      <text x="400" y="235" textAnchor="middle" fontWeight="bold" fill="#0f172a">Mijoz ulangan?</text>
                      
                      {/* Strelka yo'q */}
                      <line x1="325" y1="250" x2="250" y2="250" stroke="#64748b" strokeWidth="2" />
                      <polygon points="255,245 245,250 255,255" fill="#64748b" />
                      <text x="300" y="235" textAnchor="middle" fontSize="12" fill="#7f1d1d">Yo'q</text>
                      
                      {/* Kutish */}
                      <rect x="150" y="220" width="100" height="60" rx="0" fill="#f5f5f4" stroke="#78716c" strokeWidth="2" />
                      <text x="200" y="250" textAnchor="middle" fontWeight="bold" fill="#0f172a">Kutish</text>
                      
                      {/* Strelka qaytish */}
                      <line x1="150" y1="250" x2="100" y2="250" stroke="#64748b" strokeWidth="2" />
                      <line x1="100" y1="250" x2="100" y2="130" stroke="#64748b" strokeWidth="2" />
                      <line x1="100" y1="130" x2="300" y2="130" stroke="#64748b" strokeWidth="2" />
                      <polygon points="290,125 300,130 290,135" fill="#64748b" />
                      
                      {/* Strelka ha */}
                      <line x1="400" y1="250" x2="400" y2="280" stroke="#64748b" strokeWidth="2" />
                      <polygon points="395,280 405,280 400,290" fill="#64748b" />
                      <text x="415" y="265" textAnchor="middle" fontSize="12" fill="#15803d">Ha</text>
                      
                      {/* Ulanishni o'rnatish */}
                      <rect x="300" y="290" width="200" height="60" rx="0" fill="#f8fafc" stroke="#581c87" strokeWidth="2" />
                      <text x="400" y="320" textAnchor="middle" fontWeight="bold" fill="#0f172a">Ulanishni o'rnatish</text>
                      <text x="400" y="340" textAnchor="middle" fontWeight="bold" fill="#0f172a">va autentifikatsiya</text>
                      
                      {/* Strelka */}
                      <line x1="400" y1="350" x2="400" y2="380" stroke="#64748b" strokeWidth="2" />
                      <polygon points="395,380 405,380 400,390" fill="#64748b" />
                      
                      {/* Ma'lumotlarni uzatish */}
                      <rect x="300" y="390" width="200" height="60" rx="0" fill="#f8fafc" stroke="#581c87" strokeWidth="2" />
                      <text x="400" y="420" textAnchor="middle" fontWeight="bold" fill="#0f172a">Ma'lumotlarni</text>
                      <text x="400" y="440" textAnchor="middle" fontWeight="bold" fill="#0f172a">uzatish va qabul qilish</text>
                      
                      {/* Strelka */}
                      <line x1="400" y1="450" x2="400" y2="480" stroke="#64748b" strokeWidth="2" />
                      <polygon points="395,480 405,480 400,490" fill="#64748b" />
                      
                      {/* Ulanish uzildi? */}
                      <polygon points="400,490 325,540 475,540" fill="#e9d5ff" stroke="#581c87" strokeWidth="2" />
                      <text x="400" y="525" textAnchor="middle" fontWeight="bold" fill="#0f172a">Ulanish uzildi?</text>
                      
                      {/* Strelka yo'q (tsikl) */}
                      <line x1="475" y1="540" x2="600" y2="540" stroke="#64748b" strokeWidth="2" />
                      <line x1="600" y1="540" x2="600" y2="420" stroke="#64748b" strokeWidth="2" />
                      <line x1="600" y1="420" x2="500" y2="420" stroke="#64748b" strokeWidth="2" />
                      <polygon points="510,415 500,420 510,425" fill="#64748b" />
                      <text x="540" y="525" textAnchor="middle" fontSize="12" fill="#15803d">Yo'q</text>
                      
                      {/* Strelka ha */}
                      <line x1="400" y1="540" x2="400" y2="570" stroke="#64748b" strokeWidth="2" />
                      <polygon points="395,570 405,570 400,580" fill="#64748b" />
                      <text x="385" y="555" textAnchor="middle" fontSize="12" fill="#7f1d1d">Ha</text>
                      
                      {/* Algoritm oxiri */}
                      <ellipse cx="400" cy="600" rx="80" ry="30" fill="#e9d5ff" stroke="#581c87" strokeWidth="2" />
                      <text x="400" y="605" textAnchor="middle" fontWeight="bold" fill="#0f172a">Yakunlash</text>
                      
                      {/* Yon ta'riflar */}
                      <rect x="550" y="200" width="150" height="80" rx="5" fill="#f5f5f4" stroke="#78716c" strokeWidth="1.5" />
                      <text x="625" y="230" textAnchor="middle" fontSize="12" fill="#0f172a">Har 10 soniyada</text>
                      <text x="625" y="250" textAnchor="middle" fontSize="12" fill="#0f172a">ma'lumot yangilanadi</text>
                      
                      <rect x="500" y="300" width="150" height="80" rx="5" fill="#f5f5f4" stroke="#78716c" strokeWidth="1.5" />
                      <text x="575" y="330" textAnchor="middle" fontSize="12" fill="#0f172a">WebSocket</text>
                      <text x="575" y="350" textAnchor="middle" fontSize="12" fill="#0f172a">real vaqtda aloqa</text>
                      
                      <line x1="500" y1="320" x2="450" y2="320" stroke="#78716c" strokeWidth="1.5" strokeDasharray="5,5" />
                    </svg>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="bg-white p-3 rounded-md shadow-sm">
                      <h4 className="font-medium mb-2">WebSocket protokoli</h4>
                      <p className="text-gray-600">
                        Doimiy ulanishni ta'minlash uchun WebSocket protokoli va ma'lumotlarni uzatish algoritmi.
                      </p>
                    </div>
                    <div className="bg-white p-3 rounded-md shadow-sm">
                      <h4 className="font-medium mb-2">Ma'lumotlarni tarqatish</h4>
                      <p className="text-gray-600">
                        Bir vaqtning o'zida ko'p foydalanuvchilarga ma'lumotlarni broadcast qilish algoritmi.
                      </p>
                    </div>
                    <div className="bg-white p-3 rounded-md shadow-sm">
                      <h4 className="font-medium mb-2">Xatoliklarni bartaraf etish</h4>
                      <p className="text-gray-600">
                        Ulanish uzilganda va xatoliklar yuz berganda qayta ulanish va ma'lumotlarni tiklash algoritmi.
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