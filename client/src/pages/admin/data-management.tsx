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
import IDEF0Model from "@/components/admin/idef0-model";

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
              <TabsList className="grid w-full grid-cols-7">
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
                <TabsTrigger value="idef0model">
                  <GitBranch className="h-4 w-4 mr-2" />
                  IDEF0 model
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
                  
                  <div className="w-full overflow-x-auto mb-4 flex justify-center">
                    <svg width="800" height="900" viewBox="0 0 800 900">
                      {/* Algoritm boshi */}
                      <ellipse cx="350" cy="30" rx="80" ry="30" fill="#dbeafe" stroke="#0c4a6e" strokeWidth="2" />
                      <text x="350" y="35" textAnchor="middle" fontWeight="bold" fill="#0f172a">Boshlash</text>
                      
                      {/* Strelka */}
                      <line x1="350" y1="60" x2="350" y2="90" stroke="#64748b" strokeWidth="2" />
                      <polygon points="345,90 355,90 350,100" fill="#64748b" />
                      
                      {/* Ma'lumotlar bazasini tahlil qilish */}
                      <rect x="250" y="100" width="200" height="60" rx="0" fill="#f8fafc" stroke="#0c4a6e" strokeWidth="2" />
                      <text x="350" y="130" textAnchor="middle" fontWeight="bold" fill="#0f172a">Ma'lumotlar bazasini</text>
                      <text x="350" y="150" textAnchor="middle" fontWeight="bold" fill="#0f172a">tahlil qilish</text>
                      
                      {/* Strelka */}
                      <line x1="350" y1="160" x2="350" y2="190" stroke="#64748b" strokeWidth="2" />
                      <polygon points="345,190 355,190 350,200" fill="#64748b" />
                      
                      {/* Bog'liqliklarni aniqlash */}
                      <rect x="250" y="200" width="200" height="60" rx="0" fill="#f8fafc" stroke="#0c4a6e" strokeWidth="2" />
                      <text x="350" y="230" textAnchor="middle" fontWeight="bold" fill="#0f172a">Ma'lumotlar orasidagi</text>
                      <text x="350" y="250" textAnchor="middle" fontWeight="bold" fill="#0f172a">bog'liqliklarni aniqlash</text>
                      
                      {/* Strelka */}
                      <line x1="350" y1="260" x2="350" y2="290" stroke="#64748b" strokeWidth="2" />
                      <polygon points="345,290 355,290 350,300" fill="#64748b" />
                      
                      {/* Jadvallarni bo'lish */}
                      <rect x="250" y="300" width="200" height="60" rx="0" fill="#f8fafc" stroke="#0c4a6e" strokeWidth="2" />
                      <text x="350" y="330" textAnchor="middle" fontWeight="bold" fill="#0f172a">Jadvallarni mantiqiy</text>
                      <text x="350" y="350" textAnchor="middle" fontWeight="bold" fill="#0f172a">qismlarga bo'lish</text>
                      
                      {/* Strelka */}
                      <line x1="350" y1="360" x2="350" y2="390" stroke="#64748b" strokeWidth="2" />
                      <polygon points="345,390 355,390 350,400" fill="#64748b" />
                      
                      {/* Fragmentlash sikli */}
                      <polygon points="240,400 460,400 400,450 300,450" fill="#f8fafc" stroke="#0c4a6e" strokeWidth="2" />
                      <text x="350" y="430" textAnchor="middle" fontWeight="bold" fill="#0f172a">Fragmentlash sikli</text>
                      
                      {/* Strelka */}
                      <line x1="350" y1="450" x2="350" y2="490" stroke="#64748b" strokeWidth="2" />
                      <polygon points="345,490 355,490 350,500" fill="#64748b" />
                      
                      {/* Fragment qo'llash */}
                      <rect x="250" y="500" width="200" height="60" rx="0" fill="#f8fafc" stroke="#0c4a6e" strokeWidth="2" />
                      <text x="350" y="530" textAnchor="middle" fontWeight="bold" fill="#0f172a">Fragment qoidalarini</text>
                      <text x="350" y="550" textAnchor="middle" fontWeight="bold" fill="#0f172a">qo'llash</text>
                      
                      {/* Strelka */}
                      <line x1="350" y1="560" x2="350" y2="590" stroke="#64748b" strokeWidth="2" />
                      <polygon points="345,590 355,590 350,600" fill="#64748b" />
                      
                      {/* Ma'lumotlarni fragmentlash */}
                      <rect x="250" y="600" width="200" height="60" rx="0" fill="#f8fafc" stroke="#0c4a6e" strokeWidth="2" />
                      <text x="350" y="630" textAnchor="middle" fontWeight="bold" fill="#0f172a">Ma'lumotlarni</text>
                      <text x="350" y="650" textAnchor="middle" fontWeight="bold" fill="#0f172a">fragmentlash</text>
                      
                      {/* Strelka */}
                      <line x1="350" y1="660" x2="350" y2="690" stroke="#64748b" strokeWidth="2" />
                      <polygon points="345,690 355,690 350,700" fill="#64748b" />
                      
                      {/* Kalit so'zlar indekslash */}
                      <rect x="250" y="700" width="200" height="60" rx="0" fill="#f8fafc" stroke="#0c4a6e" strokeWidth="2" />
                      <text x="350" y="730" textAnchor="middle" fontWeight="bold" fill="#0f172a">Kalit so'zlar bilan</text>
                      <text x="350" y="750" textAnchor="middle" fontWeight="bold" fill="#0f172a">indekslash</text>
                      
                      {/* Strelka */}
                      <line x1="350" y1="760" x2="350" y2="790" stroke="#64748b" strokeWidth="2" />
                      <polygon points="345,790 355,790 350,800" fill="#64748b" />
                      
                      {/* Fragmentlarni birlashtirish */}
                      <rect x="250" y="800" width="200" height="60" rx="0" fill="#f8fafc" stroke="#0c4a6e" strokeWidth="2" />
                      <text x="350" y="830" textAnchor="middle" fontWeight="bold" fill="#0f172a">Fragmentlarni</text>
                      <text x="350" y="850" textAnchor="middle" fontWeight="bold" fill="#0f172a">birlashtirish</text>
                      
                      {/* Tsikl qaytish */}
                      <path d="M 250,830 L 150,830 L 150,430 L 240,430" stroke="#64748b" strokeWidth="2" fill="none" />
                      <polygon points="235,425 245,435 235,435" fill="#64748b" />
                      
                      {/* Boshqa yo'nalish: Tsikl tugagan */}
                      <line x1="350" y1="860" x2="350" y2="890" stroke="#64748b" strokeWidth="2" />
                      <polygon points="345,890 355,890 350,900" fill="#64748b" />
                      
                      {/* Yakunlash */}
                      <ellipse cx="350" cy="930" rx="80" ry="30" fill="#dbeafe" stroke="#0c4a6e" strokeWidth="2" />
                      <text x="350" y="935" textAnchor="middle" fontWeight="bold" fill="#0f172a">Yakunlash</text>
                      
                      {/* Qo'shimcha: Fragment qoidalar bazasi */}
                      <rect x="600" y="300" width="150" height="60" rx="0" fill="#f1f5f9" stroke="#0c4a6e" strokeWidth="2" />
                      <text x="675" y="330" textAnchor="middle" fontWeight="bold" fill="#0f172a">Fragment</text>
                      <text x="675" y="350" textAnchor="middle" fontWeight="bold" fill="#0f172a">qoidalar bazasi</text>
                      
                      {/* Qo'shimcha: Tahlil qoidalar bazasi */}
                      <rect x="600" y="600" width="150" height="60" rx="0" fill="#f1f5f9" stroke="#0c4a6e" strokeWidth="2" />
                      <text x="675" y="630" textAnchor="middle" fontWeight="bold" fill="#0f172a">Tahlil</text>
                      <text x="675" y="650" textAnchor="middle" fontWeight="bold" fill="#0f172a">qoidalar bazasi</text>
                      
                      {/* Qo'shimcha yo'nalishlar */}
                      <line x1="600" y1="330" x2="400" y2="510" stroke="#64748b" strokeWidth="2" strokeDasharray="5,5" />
                      <polygon points="395,505 405,515 408,508" fill="#64748b" />
                      
                      <line x1="600" y1="630" x2="400" y2="730" stroke="#64748b" strokeWidth="2" strokeDasharray="5,5" />
                      <polygon points="395,725 405,735 408,728" fill="#64748b" />
                    </svg>
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
                  
                  <div className="p-2 bg-white rounded-lg shadow-sm mb-4 overflow-hidden">
                    <svg width="800" height="800" viewBox="0 0 800 800">
                      {/* Algoritm boshi */}
                      <ellipse cx="400" cy="30" rx="80" ry="30" fill="#dbeafe" stroke="#0c4a6e" strokeWidth="2" />
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
                      <rect x="300" y="200" width="200" height="60" rx="0" fill="#bfdbfe" stroke="#0c4a6e" strokeWidth="2" />
                      <text x="400" y="230" textAnchor="middle" fontWeight="bold" fill="#0f172a">Ma'lumotlarni yig'ish</text>
                      <text x="400" y="250" textAnchor="middle" fontWeight="bold" fill="#0f172a">va tozalash</text>
                      
                      {/* Strelka */}
                      <line x1="400" y1="260" x2="400" y2="290" stroke="#64748b" strokeWidth="2" />
                      <polygon points="395,290 405,290 400,300" fill="#64748b" />
                      
                      {/* Ma'lumotlarni tahlil qilish yo'nalishi */}
                      <polygon points="300,300 500,300 450,360 350,360" fill="#bfdbfe" stroke="#0c4a6e" strokeWidth="2" />
                      <text x="400" y="325" textAnchor="middle" fontWeight="bold" fill="#0f172a">Ma'lumotlar turi?</text>
                      <text x="400" y="345" textAnchor="middle" fontWeight="bold" fill="#0f172a">Tahlil yo'nalishini tanlash</text>
                      
                      {/* 3 ta yo'nalish */}
                      <line x1="300" y1="330" x2="200" y2="400" stroke="#64748b" strokeWidth="2" />
                      <polygon points="195,395 200,405 205,395" fill="#64748b" />
                      <text x="240" y="360" textAnchor="middle" fontSize="12" fill="#0f172a">Suv sarfiyotlari</text>
                      
                      <line x1="400" y1="360" x2="400" y2="400" stroke="#64748b" strokeWidth="2" />
                      <polygon points="395,395 400,405 405,395" fill="#64748b" />
                      <text x="400" y="385" textAnchor="middle" fontSize="12" fill="#0f172a">Suv omborlari</text>
                      
                      <line x1="500" y1="330" x2="600" y2="400" stroke="#64748b" strokeWidth="2" />
                      <polygon points="595,395 600,405 605,395" fill="#64748b" />
                      <text x="550" y="360" textAnchor="middle" fontSize="12" fill="#0f172a">Fermer talablari</text>
                      
                      {/* Tahlil turlari */}
                      <rect x="100" y="400" width="200" height="60" rx="0" fill="#dbeafe" stroke="#0c4a6e" strokeWidth="2" />
                      <text x="200" y="430" textAnchor="middle" fontWeight="bold" fill="#0f172a">Sarfiyot dinamikasi</text>
                      <text x="200" y="450" textAnchor="middle" fontWeight="bold" fill="#0f172a">tahlili</text>
                      
                      <rect x="300" y="400" width="200" height="60" rx="0" fill="#dbeafe" stroke="#0c4a6e" strokeWidth="2" />
                      <text x="400" y="430" textAnchor="middle" fontWeight="bold" fill="#0f172a">Suv sathi</text>
                      <text x="400" y="450" textAnchor="middle" fontWeight="bold" fill="#0f172a">o'zgarishlari tahlili</text>
                      
                      <rect x="500" y="400" width="200" height="60" rx="0" fill="#dbeafe" stroke="#0c4a6e" strokeWidth="2" />
                      <text x="600" y="430" textAnchor="middle" fontWeight="bold" fill="#0f172a">Fermer ehtiyojlari</text>
                      <text x="600" y="450" textAnchor="middle" fontWeight="bold" fill="#0f172a">tahlili</text>
                      
                      {/* Keyingi qadamlar */}
                      <line x1="200" y1="460" x2="200" y2="500" stroke="#64748b" strokeWidth="2" />
                      <polygon points="195,495 200,505 205,495" fill="#64748b" />
                      
                      <line x1="400" y1="460" x2="400" y2="500" stroke="#64748b" strokeWidth="2" />
                      <polygon points="395,495 400,505 405,495" fill="#64748b" />
                      
                      <line x1="600" y1="460" x2="600" y2="500" stroke="#64748b" strokeWidth="2" />
                      <polygon points="595,495 600,505 605,495" fill="#64748b" />
                      
                      {/* Analitika usullari */}
                      <rect x="100" y="500" width="200" height="60" rx="0" fill="#dbeafe" stroke="#0c4a6e" strokeWidth="2" />
                      <text x="200" y="530" textAnchor="middle" fontWeight="bold" fill="#0f172a">Vaqt qatorlari tahlili</text>
                      <text x="200" y="550" textAnchor="middle" fontWeight="bold" fill="#0f172a">va trendlar</text>
                      
                      <rect x="300" y="500" width="200" height="60" rx="0" fill="#dbeafe" stroke="#0c4a6e" strokeWidth="2" />
                      <text x="400" y="530" textAnchor="middle" fontWeight="bold" fill="#0f172a">Mavsumiy o'zgarishlar</text>
                      <text x="400" y="550" textAnchor="middle" fontWeight="bold" fill="#0f172a">tahlili</text>
                      
                      <rect x="500" y="500" width="200" height="60" rx="0" fill="#dbeafe" stroke="#0c4a6e" strokeWidth="2" />
                      <text x="600" y="530" textAnchor="middle" fontWeight="bold" fill="#0f172a">Ekin turlari va</text>
                      <text x="600" y="550" textAnchor="middle" fontWeight="bold" fill="#0f172a">suv talabi tahlili</text>
                      
                      {/* Natijalarni birlashtirish */}
                      <line x1="200" y1="560" x2="200" y2="600" stroke="#64748b" strokeWidth="2" />
                      <polygon points="195,595 200,605 205,595" fill="#64748b" />
                      
                      <line x1="400" y1="560" x2="400" y2="600" stroke="#64748b" strokeWidth="2" />
                      <polygon points="395,595 400,605 405,595" fill="#64748b" />
                      
                      <line x1="600" y1="560" x2="600" y2="600" stroke="#64748b" strokeWidth="2" />
                      <polygon points="595,595 600,605 605,595" fill="#64748b" />
                      
                      <rect x="200" y="600" width="400" height="60" rx="0" fill="#dbeafe" stroke="#0c4a6e" strokeWidth="2" />
                      <text x="400" y="630" textAnchor="middle" fontWeight="bold" fill="#0f172a">Natijalarni birlashtirish</text>
                      <text x="400" y="650" textAnchor="middle" fontWeight="bold" fill="#0f172a">va korrelyatsion tahlil</text>
                      
                      {/* Tavsiyalar tayyorlash */}
                      <line x1="400" y1="660" x2="400" y2="700" stroke="#64748b" strokeWidth="2" />
                      <polygon points="395,695 400,705 405,695" fill="#64748b" />
                      
                      <rect x="200" y="700" width="400" height="60" rx="0" fill="#dbeafe" stroke="#0c4a6e" strokeWidth="2" />
                      <text x="400" y="730" textAnchor="middle" fontWeight="bold" fill="#0f172a">Ma'lumotlar asosida</text>
                      <text x="400" y="750" textAnchor="middle" fontWeight="bold" fill="#0f172a">tavsiyalar tayyorlash</text>
                      
                      {/* Yakunlash */}
                      <line x1="400" y1="760" x2="400" y2="790" stroke="#64748b" strokeWidth="2" />
                      <polygon points="395,785 400,795 405,785" fill="#64748b" />
                      
                      <ellipse cx="400" cy="830" rx="80" ry="30" fill="#dbeafe" stroke="#0c4a6e" strokeWidth="2" />
                      <text x="400" y="835" textAnchor="middle" fontWeight="bold" fill="#0f172a">Yakunlash</text>
                    </svg>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="bg-white p-3 rounded-md shadow-sm">
                      <h4 className="font-medium mb-2">Statistik tahlil algoritmi</h4>
                      <p className="text-gray-600">
                        Ma'lumotlarni statistik usullar orqali tahlil qilish, trend va mavsumiy o'zgarishlarni aniqlash.
                      </p>
                    </div>
                    <div className="bg-white p-3 rounded-md shadow-sm">
                      <h4 className="font-medium mb-2">Korrelyatsiya algoritmi</h4>
                      <p className="text-gray-600">
                        Turli omillar o'rtasidagi bog'liqlikni aniqlash va tahlil qilish uchun korrelyatsion tahlil.
                      </p>
                    </div>
                    <div className="bg-white p-3 rounded-md shadow-sm">
                      <h4 className="font-medium mb-2">Tavsiyalar tayyorlash</h4>
                      <p className="text-gray-600">
                        Tahlil natijalari asosida qaror qabul qilish uchun tavsiyalar tayyorlash algoritmi.
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="security" className="pt-4">
                <div className="border p-4 rounded-md bg-slate-50">
                  <h3 className="text-lg font-medium mb-2 text-center">Xavfsizlik algoritmlari</h3>
                  <p className="text-sm text-gray-500 mb-4 text-center">
                    Tizim xavfsizligini ta'minlash algoritmlari
                  </p>
                  
                  <div className="p-2 bg-white rounded-lg shadow-sm mb-4 overflow-hidden">
                    <svg width="800" height="800" viewBox="0 0 800 800">
                      {/* Algoritm boshi */}
                      <ellipse cx="400" cy="30" rx="80" ry="30" fill="#dbeafe" stroke="#0c4a6e" strokeWidth="2" />
                      <text x="400" y="35" textAnchor="middle" fontWeight="bold" fill="#0f172a">Boshlash</text>
                      
                      {/* So'rov kelishi */}
                      <line x1="400" y1="60" x2="400" y2="90" stroke="#64748b" strokeWidth="2" />
                      <polygon points="395,90 405,90 400,100" fill="#64748b" />
                      
                      <rect x="300" y="100" width="200" height="60" rx="0" fill="#f8fafc" stroke="#0c4a6e" strokeWidth="2" />
                      <text x="400" y="130" textAnchor="middle" fontWeight="bold" fill="#0f172a">Foydalanuvchi</text>
                      <text x="400" y="150" textAnchor="middle" fontWeight="bold" fill="#0f172a">so'rovi kelishi</text>
                      
                      {/* Foydalanuvchini tekshirish */}
                      <line x1="400" y1="160" x2="400" y2="190" stroke="#64748b" strokeWidth="2" />
                      <polygon points="395,190 405,190 400,200" fill="#64748b" />
                      
                      <rect x="300" y="200" width="200" height="60" rx="0" fill="#f8fafc" stroke="#0c4a6e" strokeWidth="2" />
                      <text x="400" y="230" textAnchor="middle" fontWeight="bold" fill="#0f172a">Foydalanuvchini</text>
                      <text x="400" y="250" textAnchor="middle" fontWeight="bold" fill="#0f172a">autentifikatsiya qilish</text>
                      
                      {/* Autentifikatsiya tekshiruvi */}
                      <line x1="400" y1="260" x2="400" y2="290" stroke="#64748b" strokeWidth="2" />
                      <polygon points="395,290 405,290 400,300" fill="#64748b" />
                      
                      <polygon points="300,300 500,300 450,350 350,350" fill="#f8fafc" stroke="#0c4a6e" strokeWidth="2" />
                      <text x="400" y="330" textAnchor="middle" fontWeight="bold" fill="#0f172a">Autentifikatsiya</text>
                      <text x="400" y="330" textAnchor="middle" fontWeight="bold" fill="#0f172a">muvaffaqiytlimi?</text>
                      
                      {/* Yo'q yo'nalishi */}
                      <line x1="300" y1="325" x2="200" y2="400" stroke="#64748b" strokeWidth="2" />
                      <polygon points="195,395 200,405 205,395" fill="#64748b" />
                      <text x="220" y="360" textAnchor="middle" fontSize="12" fill="#0f172a">Yo'q</text>
                      
                      <rect x="100" y="400" width="200" height="60" rx="0" fill="#f8fafc" stroke="#0c4a6e" strokeWidth="2" />
                      <text x="200" y="430" textAnchor="middle" fontWeight="bold" fill="#0f172a">Kirish rad etildi</text>
                      <text x="200" y="450" textAnchor="middle" fontWeight="bold" fill="#0f172a">xatolik qayd etildi</text>
                      
                      {/* Ha yo'nalishi */}
                      <line x1="500" y1="325" x2="600" y2="400" stroke="#64748b" strokeWidth="2" />
                      <polygon points="595,395 600,405 605,395" fill="#64748b" />
                      <text x="570" y="360" textAnchor="middle" fontSize="12" fill="#0f172a">Ha</text>
                      
                      <rect x="500" y="400" width="200" height="60" rx="0" fill="#f8fafc" stroke="#0c4a6e" strokeWidth="2" />
                      <text x="600" y="430" textAnchor="middle" fontWeight="bold" fill="#0f172a">Foydalanuvchi</text>
                      <text x="600" y="450" textAnchor="middle" fontWeight="bold" fill="#0f172a">ruxsatlarini tekshirish</text>
                      
                      {/* Ruxsat tekshiruvi */}
                      <line x1="600" y1="460" x2="600" y2="490" stroke="#64748b" strokeWidth="2" />
                      <polygon points="595,490 605,490 600,500" fill="#64748b" />
                      
                      <polygon points="500,500 700,500 650,550 550,550" fill="#f8fafc" stroke="#0c4a6e" strokeWidth="2" />
                      <text x="600" y="530" textAnchor="middle" fontWeight="bold" fill="#0f172a">Ruxsatlar</text>
                      <text x="600" y="530" textAnchor="middle" fontWeight="bold" fill="#0f172a">yetarlimi?</text>
                      
                      {/* Yo'q yo'nalishi */}
                      <line x1="500" y1="525" x2="400" y2="600" stroke="#64748b" strokeWidth="2" />
                      <polygon points="395,595 400,605 405,595" fill="#64748b" />
                      <text x="430" y="560" textAnchor="middle" fontSize="12" fill="#0f172a">Yo'q</text>
                      
                      <rect x="300" y="600" width="200" height="60" rx="0" fill="#f8fafc" stroke="#0c4a6e" strokeWidth="2" />
                      <text x="400" y="630" textAnchor="middle" fontWeight="bold" fill="#0f172a">Ruxsat rad etildi</text>
                      <text x="400" y="650" textAnchor="middle" fontWeight="bold" fill="#0f172a">qayd yozildi</text>
                      
                      {/* Ha yo'nalishi */}
                      <line x1="700" y1="525" x2="800" y2="600" stroke="#64748b" strokeWidth="2" />
                      <polygon points="795,595 800,605 805,595" fill="#64748b" />
                      <text x="770" y="560" textAnchor="middle" fontSize="12" fill="#0f172a">Ha</text>
                      
                      <rect x="700" y="600" width="200" height="60" rx="0" fill="#f8fafc" stroke="#0c4a6e" strokeWidth="2" />
                      <text x="800" y="630" textAnchor="middle" fontWeight="bold" fill="#0f172a">So'rov bajarildi</text>
                      <text x="800" y="650" textAnchor="middle" fontWeight="bold" fill="#0f172a">qayd yozildi</text>
                      
                      {/* So'rov loglarini saqlash */}
                      <line x1="200" y1="460" x2="200" y2="700" stroke="#64748b" strokeWidth="2" strokeDasharray="5,5" />
                      <line x1="400" y1="660" x2="400" y2="700" stroke="#64748b" strokeWidth="2" strokeDasharray="5,5" />
                      <line x1="800" y1="660" x2="800" y2="700" stroke="#64748b" strokeWidth="2" strokeDasharray="5,5" />
                      
                      <line x1="200" y1="700" x2="400" y2="700" stroke="#64748b" strokeWidth="2" strokeDasharray="5,5" />
                      <line x1="400" y1="700" x2="800" y2="700" stroke="#64748b" strokeWidth="2" strokeDasharray="5,5" />
                      <line x1="400" y1="700" x2="400" y2="740" stroke="#64748b" strokeWidth="2" />
                      <polygon points="395,735 400,745 405,735" fill="#64748b" />
                      
                      <rect x="300" y="740" width="200" height="60" rx="0" fill="#f8fafc" stroke="#0c4a6e" strokeWidth="2" />
                      <text x="400" y="770" textAnchor="middle" fontWeight="bold" fill="#0f172a">Audit log'larini</text>
                      <text x="400" y="790" textAnchor="middle" fontWeight="bold" fill="#0f172a">saqlash</text>
                      
                      {/* Yakunlash */}
                      <line x1="400" y1="800" x2="400" y2="830" stroke="#64748b" strokeWidth="2" />
                      <polygon points="395,825 400,835 405,825" fill="#64748b" />
                      
                      <ellipse cx="400" cy="860" rx="80" ry="30" fill="#dbeafe" stroke="#0c4a6e" strokeWidth="2" />
                      <text x="400" y="865" textAnchor="middle" fontWeight="bold" fill="#0f172a">Yakunlash</text>
                    </svg>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="bg-white p-3 rounded-md shadow-sm">
                      <h4 className="font-medium mb-2">Autentifikatsiya algoritmi</h4>
                      <p className="text-gray-600">
                        Foydalanuvchi shaxsini aniqlash va tekshirish mexanizmlari, xavfsiz login tizimi.
                      </p>
                    </div>
                    <div className="bg-white p-3 rounded-md shadow-sm">
                      <h4 className="font-medium mb-2">Avtorizatsiya algoritmi</h4>
                      <p className="text-gray-600">
                        Foydalanuvchi huquqlarini tekshirish va ruxsatlar asosida ma'lumotlarga kirishni boshqarish.
                      </p>
                    </div>
                    <div className="bg-white p-3 rounded-md shadow-sm">
                      <h4 className="font-medium mb-2">Audit va monitoring</h4>
                      <p className="text-gray-600">
                        Tizimda sodir bo'layotgan barcha muhim voqealarni qayd etish va xavfsizlikni monitoring qilish.
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
                      
                      {/* Back-end qismi */}
                      <rect x="300" y="100" width="200" height="80" rx="5" fill="#dbeafe" stroke="#0c4a6e" strokeWidth="2" />
                      <text x="400" y="125" textAnchor="middle" fontWeight="bold" fill="#0f172a">Back-end qismi</text>
                      <text x="400" y="150" textAnchor="middle" fontSize="12" fill="#64748b">Express, TypeScript</text>
                      
                      {/* Ma'lumotlar qismi */}
                      <rect x="550" y="100" width="200" height="80" rx="5" fill="#dbeafe" stroke="#0c4a6e" strokeWidth="2" />
                      <text x="650" y="125" textAnchor="middle" fontWeight="bold" fill="#0f172a">Ma'lumotlar qismi</text>
                      <text x="650" y="150" textAnchor="middle" fontSize="12" fill="#64748b">PostgreSQL, Drizzle ORM</text>
                      
                      {/* Strelkalar */}
                      <line x1="250" y1="140" x2="300" y2="140" stroke="#64748b" strokeWidth="2" />
                      <polygon points="295,135 305,145 295,145" fill="#64748b" />
                      
                      <line x1="500" y1="140" x2="550" y2="140" stroke="#64748b" strokeWidth="2" />
                      <polygon points="545,135 555,145 545,145" fill="#64748b" />
                      
                      {/* Ikkinchi qator */}
                      <line x1="150" y1="180" x2="150" y2="240" stroke="#64748b" strokeWidth="2" />
                      <polygon points="145,235 155,245 145,245" fill="#64748b" />
                      
                      <line x1="400" y1="180" x2="400" y2="240" stroke="#64748b" strokeWidth="2" />
                      <polygon points="395,235 405,245 395,245" fill="#64748b" />
                      
                      <line x1="650" y1="180" x2="650" y2="240" stroke="#64748b" strokeWidth="2" />
                      <polygon points="645,235 655,245 645,245" fill="#64748b" />
                      
                      {/* Front-end modullar */}
                      <rect x="50" y="240" width="200" height="80" rx="5" fill="#bfdbfe" stroke="#0c4a6e" strokeWidth="2" />
                      <text x="150" y="265" textAnchor="middle" fontWeight="bold" fill="#0f172a">UI komponentlari</text>
                      <text x="150" y="285" textAnchor="middle" fontSize="12" fill="#64748b">ShadCN, Tailwind CSS</text>
                      
                      {/* Back-end modullar */}
                      <rect x="300" y="240" width="200" height="80" rx="5" fill="#bfdbfe" stroke="#0c4a6e" strokeWidth="2" />
                      <text x="400" y="265" textAnchor="middle" fontWeight="bold" fill="#0f172a">API servislari</text>
                      <text x="400" y="285" textAnchor="middle" fontSize="12" fill="#64748b">REST, WebSocket</text>
                      
                      {/* Ma'lumotlar modullar */}
                      <rect x="550" y="240" width="200" height="80" rx="5" fill="#bfdbfe" stroke="#0c4a6e" strokeWidth="2" />
                      <text x="650" y="265" textAnchor="middle" fontWeight="bold" fill="#0f172a">Schema modellari</text>
                      <text x="650" y="285" textAnchor="middle" fontSize="12" fill="#64748b">Drizzle, validatsiya</text>
                      
                      {/* Uchinchi qator */}
                      <line x1="150" y1="320" x2="150" y2="380" stroke="#64748b" strokeWidth="2" />
                      <polygon points="145,375 155,385 145,385" fill="#64748b" />
                      
                      <line x1="400" y1="320" x2="400" y2="380" stroke="#64748b" strokeWidth="2" />
                      <polygon points="395,375 405,385 395,385" fill="#64748b" />
                      
                      <line x1="650" y1="320" x2="650" y2="380" stroke="#64748b" strokeWidth="2" />
                      <polygon points="645,375 655,385 645,385" fill="#64748b" />
                      
                      {/* Front-end modullar */}
                      <rect x="50" y="380" width="200" height="80" rx="5" fill="#bfdbfe" stroke="#0c4a6e" strokeWidth="2" />
                      <text x="150" y="405" textAnchor="middle" fontWeight="bold" fill="#0f172a">Sahifa boshqaruvi</text>
                      <text x="150" y="425" textAnchor="middle" fontSize="12" fill="#64748b">Routing, TanStack Query</text>
                      
                      {/* Back-end modullar */}
                      <rect x="300" y="380" width="200" height="80" rx="5" fill="#bfdbfe" stroke="#0c4a6e" strokeWidth="2" />
                      <text x="400" y="405" textAnchor="middle" fontWeight="bold" fill="#0f172a">Middleware</text>
                      <text x="400" y="425" textAnchor="middle" fontSize="12" fill="#64748b">Auth, Validation, Logging</text>
                      
                      {/* Ma'lumotlar modullar */}
                      <rect x="550" y="380" width="200" height="80" rx="5" fill="#bfdbfe" stroke="#0c4a6e" strokeWidth="2" />
                      <text x="650" y="405" textAnchor="middle" fontWeight="bold" fill="#0f172a">Ma'lumotlar saqlash</text>
                      <text x="650" y="425" textAnchor="middle" fontSize="12" fill="#64748b">CRUD operatsiyalari</text>
                      
                      {/* Yo'nalish liniyalari */}
                      <line x1="400" y1="460" x2="400" y2="500" stroke="#64748b" strokeWidth="2" />
                      <polygon points="395,495 405,505 395,505" fill="#64748b" />
                      
                      <rect x="300" y="500" width="200" height="80" rx="5" fill="#dbeafe" stroke="#0c4a6e" strokeWidth="2" />
                      <text x="400" y="525" textAnchor="middle" fontWeight="bold" fill="#0f172a">LSTM modeli</text>
                      <text x="400" y="545" textAnchor="middle" fontSize="12" fill="#64748b">TensorFlow.js, Bashorat</text>
                      
                      {/* Yakunlash */}
                      <line x1="400" y1="580" x2="400" y2="620" stroke="#64748b" strokeWidth="2" />
                      <polygon points="395,615 405,625 395,625" fill="#64748b" />
                      
                      <ellipse cx="400" cy="650" rx="80" ry="30" fill="#dbeafe" stroke="#0c4a6e" strokeWidth="2" />
                      <text x="400" y="655" textAnchor="middle" fontWeight="bold" fill="#0f172a">Yakunlash</text>
                    </svg>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="bg-white p-3 rounded-md shadow-sm">
                      <h4 className="font-medium mb-2">UI arxitekturasi</h4>
                      <p className="text-gray-600">
                        Foydalanuvchi interfeysi, sahifa komponentlari va UI elementlari boshqaruvi.
                      </p>
                    </div>
                    <div className="bg-white p-3 rounded-md shadow-sm">
                      <h4 className="font-medium mb-2">API arxitekturasi</h4>
                      <p className="text-gray-600">
                        REST API va WebSocket orqali real vaqt ma'lumotlarini uzatish mexanizmlari.
                      </p>
                    </div>
                    <div className="bg-white p-3 rounded-md shadow-sm">
                      <h4 className="font-medium mb-2">Ma'lumotlar modeli</h4>
                      <p className="text-gray-600">
                        PostgreSQL ma'lumotlar bazasi modeli va ORM orqali ma'lumotlar bilan ishlash qatlamlari.
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="idef0model" className="pt-4">
                <div className="border p-4 rounded-md bg-slate-50">
                  <h3 className="text-lg font-medium mb-2 text-center">IDEF0 modeli</h3>
                  <p className="text-sm text-gray-500 mb-4 text-center">
                    Suv resurslari boshqarishning IDEF0 strukturaviy modeli
                  </p>
                  
                  <div className="w-full overflow-x-auto mb-4">
                    <IDEF0Model />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="bg-white p-3 rounded-md shadow-sm">
                      <h4 className="font-medium mb-2">Jarayonlar modellashtirish</h4>
                      <p className="text-gray-600">
                        IDEF0 modellashtirish standartiga asoslangan funksional jarayonlar tavsifi.
                      </p>
                    </div>
                    <div className="bg-white p-3 rounded-md shadow-sm">
                      <h4 className="font-medium mb-2">Xalqaro standart</h4>
                      <p className="text-gray-600">
                        IDEF0 (Integration Definition for Function Modeling) standartiga muvofiq tuzilgan diagrammalar.
                      </p>
                    </div>
                    <div className="bg-white p-3 rounded-md shadow-sm">
                      <h4 className="font-medium mb-2">Tizim dekompozitsiyasi</h4>
                      <p className="text-gray-600">
                        Tizimning yuqori darajadagi funksiyalaridan boshlab pastki darajadagi jarayonlarigacha bo'lgan dekompozitsiya.
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="network" className="pt-4">
                <div className="border p-4 rounded-md bg-slate-50">
                  <h3 className="text-lg font-medium mb-2 text-center">Tarmoq algoritmlari</h3>
                  <p className="text-sm text-gray-500 mb-4 text-center">
                    Ma'lumotlarni uzatish va qayta ishlash uchun tarmoq algoritmlari
                  </p>
                  
                  <div className="p-2 bg-white rounded-lg shadow-sm mb-4 overflow-hidden">
                    <svg width="800" height="700" viewBox="0 0 800 700">
                      {/* Algoritm boshi */}
                      <ellipse cx="400" cy="30" rx="80" ry="30" fill="#dbeafe" stroke="#0c4a6e" strokeWidth="2" />
                      <text x="400" y="35" textAnchor="middle" fontWeight="bold" fill="#0f172a">Boshlash</text>
                      
                      {/* Strelka */}
                      <line x1="400" y1="60" x2="400" y2="90" stroke="#64748b" strokeWidth="2" />
                      <polygon points="395,90 405,90 400,100" fill="#64748b" />
                      
                      {/* Ulanish o'rnatish */}
                      <rect x="300" y="100" width="200" height="60" rx="0" fill="#f8fafc" stroke="#0c4a6e" strokeWidth="2" />
                      <text x="400" y="130" textAnchor="middle" fontWeight="bold" fill="#0f172a">WebSocket server</text>
                      <text x="400" y="150" textAnchor="middle" fontWeight="bold" fill="#0f172a">ishga tushirildi</text>
                      
                      {/* Strelka */}
                      <line x1="400" y1="160" x2="400" y2="190" stroke="#64748b" strokeWidth="2" />
                      <polygon points="395,190 405,190 400,200" fill="#64748b" />
                      
                      {/* Ulanishni kutish */}
                      <rect x="300" y="200" width="200" height="60" rx="0" fill="#f8fafc" stroke="#0c4a6e" strokeWidth="2" />
                      <text x="400" y="230" textAnchor="middle" fontWeight="bold" fill="#0f172a">Mijoz ulanishini</text>
                      <text x="400" y="250" textAnchor="middle" fontWeight="bold" fill="#0f172a">kutish</text>
                      
                      {/* Strelka */}
                      <line x1="400" y1="260" x2="400" y2="290" stroke="#64748b" strokeWidth="2" />
                      <polygon points="395,290 405,290 400,300" fill="#64748b" />
                      
                      {/* Ulanish o'rnatildi */}
                      <polygon points="300,300 500,300 450,350 350,350" fill="#f8fafc" stroke="#0c4a6e" strokeWidth="2" />
                      <text x="400" y="330" textAnchor="middle" fontWeight="bold" fill="#0f172a">Ulanish o'rnatildimi?</text>
                      
                      {/* Yo'q yo'nalishi */}
                      <line x1="300" y1="325" x2="200" y2="400" stroke="#64748b" strokeWidth="2" />
                      <polygon points="195,395 200,405 205,395" fill="#64748b" />
                      <text x="230" y="350" textAnchor="middle" fontSize="12" fill="#0f172a">Yo'q</text>
                      
                      <rect x="100" y="400" width="200" height="60" rx="0" fill="#f8fafc" stroke="#0c4a6e" strokeWidth="2" />
                      <text x="200" y="430" textAnchor="middle" fontWeight="bold" fill="#0f172a">Ulanish xatosi</text>
                      <text x="200" y="450" textAnchor="middle" fontWeight="bold" fill="#0f172a">qayta urinish</text>
                      
                      {/* Qayta urinish */}
                      <path d="M 200,460 L 200,500 L 320,500 L 320,260 L 300,260" stroke="#64748b" strokeWidth="2" fill="none" strokeDasharray="5,5" />
                      <polygon points="305,255 295,265 305,265" fill="#64748b" />
                      
                      {/* Ha yo'nalishi */}
                      <line x1="500" y1="325" x2="600" y2="400" stroke="#64748b" strokeWidth="2" />
                      <polygon points="595,395 600,405 605,395" fill="#64748b" />
                      <text x="570" y="350" textAnchor="middle" fontSize="12" fill="#0f172a">Ha</text>
                      
                      <rect x="500" y="400" width="200" height="60" rx="0" fill="#f8fafc" stroke="#0c4a6e" strokeWidth="2" />
                      <text x="600" y="430" textAnchor="middle" fontWeight="bold" fill="#0f172a">Ma'lumotlar</text>
                      <text x="600" y="450" textAnchor="middle" fontWeight="bold" fill="#0f172a">tayyorlash</text>
                      
                      {/* Strelka */}
                      <line x1="600" y1="460" x2="600" y2="490" stroke="#64748b" strokeWidth="2" />
                      <polygon points="595,490 605,490 600,500" fill="#64748b" />
                      
                      {/* Uzluksiz siklni ko'rsatuvchi */}
                      <polygon points="500,500 700,500 650,550 550,550" fill="#f8fafc" stroke="#0c4a6e" strokeWidth="2" />
                      <text x="600" y="530" textAnchor="middle" fontWeight="bold" fill="#0f172a">Ma'lumotlarni uzatish</text>
                      
                      {/* Tarmoq yo'nalishlari */}
                      <line x1="500" y1="525" x2="400" y2="580" stroke="#64748b" strokeWidth="2" />
                      <polygon points="395,575 400,585 405,575" fill="#64748b" />
                      <text x="440" y="550" textAnchor="middle" fontSize="12" fill="#0f172a">Har 10 soniyada</text>
                      
                      <rect x="300" y="580" width="200" height="60" rx="0" fill="#f8fafc" stroke="#0c4a6e" strokeWidth="2" />
                      <text x="400" y="610" textAnchor="middle" fontWeight="bold" fill="#0f172a">Suv omborlari</text>
                      <text x="400" y="630" textAnchor="middle" fontWeight="bold" fill="#0f172a">ma'lumotlarini uzatish</text>
                      
                      <line x1="700" y1="525" x2="800" y2="580" stroke="#64748b" strokeWidth="2" />
                      <polygon points="795,575 800,585 805,575" fill="#64748b" />
                      <text x="760" y="550" textAnchor="middle" fontSize="12" fill="#0f172a">Talabga ko'ra</text>
                      
                      <rect x="700" y="580" width="200" height="60" rx="0" fill="#f8fafc" stroke="#0c4a6e" strokeWidth="2" />
                      <text x="800" y="610" textAnchor="middle" fontWeight="bold" fill="#0f172a">Maxsus so'rovlarga</text>
                      <text x="800" y="630" textAnchor="middle" fontWeight="bold" fill="#0f172a">javob qaytarish</text>
                      
                      {/* Natija */}
                      <line x1="400" y1="640" x2="400" y2="680" stroke="#64748b" strokeWidth="2" strokeDasharray="5,5" />
                      <line x1="800" y1="640" x2="800" y2="660" stroke="#64748b" strokeWidth="2" strokeDasharray="5,5" />
                      <line x1="800" y1="660" x2="400" y2="680" stroke="#64748b" strokeWidth="2" strokeDasharray="5,5" />
                      <line x1="400" y1="680" x2="400" y2="710" stroke="#64748b" strokeWidth="2" />
                      <polygon points="395,705 400,715 405,705" fill="#64748b" />
                      
                      {/* Sessiya tugatilishi */}
                      <rect x="300" y="710" width="200" height="60" rx="0" fill="#f8fafc" stroke="#0c4a6e" strokeWidth="2" />
                      <text x="400" y="740" textAnchor="middle" fontWeight="bold" fill="#0f172a">Sessiya davom etadi</text>
                      <text x="400" y="760" textAnchor="middle" fontWeight="bold" fill="#0f172a">uzilish vaqtigacha</text>
                      
                      {/* Qaytar yo'l */}
                      <path d="M 500,740 L 720,740 L 720,480 L 600,480" stroke="#64748b" strokeWidth="2" fill="none" />
                      <polygon points="605,475 595,485 605,485" fill="#64748b" />
                    </svg>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="bg-white p-3 rounded-md shadow-sm">
                      <h4 className="font-medium mb-2">WebSocket algoritmi</h4>
                      <p className="text-gray-600">
                        Real vaqt rejimida ma'lumotlarni uzatish uchun WebSocket protokolining ishlash algoritmi.
                      </p>
                    </div>
                    <div className="bg-white p-3 rounded-md shadow-sm">
                      <h4 className="font-medium mb-2">Ma'lumotlarni sinxronlash</h4>
                      <p className="text-gray-600">
                        Serverda yangilangan ma'lumotlarni barcha ulangan mijozlarga sinxron uzatish algoritmi.
                      </p>
                    </div>
                    <div className="bg-white p-3 rounded-md shadow-sm">
                      <h4 className="font-medium mb-2">So'rovlarni qayta ishlash</h4>
                      <p className="text-gray-600">
                        Mijozlar yuborgan so'rovlarni qayta ishlash va javob qaytarish algoritmi.
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Ma'lumotlarni yuklab olish bo'limi */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              Ma'lumotlarni yuklab olish
            </CardTitle>
            <CardDescription>
              Tizimdagi mavjud ma'lumotlarni CSV formatida yuklab olish
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

              <TabsContent value="filter" className="pt-4">
                <div className="border p-4 rounded-md bg-slate-50">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm font-medium mb-2">Ma'lumot turini tanlang</p>
                      <Select value={dataType} onValueChange={setDataType}>
                        <SelectTrigger>
                          <SelectValue placeholder="Ma'lumot turini tanlang" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="reservoirs">Suv omborlari</SelectItem>
                          <SelectItem value="allocations">Suv taqsimoti</SelectItem>
                          <SelectItem value="requests">Suv so'rovlari</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium mb-2">Boshlanish vaqti</p>
                      <DatePicker date={startDate} setDate={setStartDate} />
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium mb-2">Tugash vaqti</p>
                      <DatePicker date={endDate} setDate={setEndDate} />
                    </div>
                  </div>
                  
                  <div className="flex justify-end mt-4">
                    <Button onClick={downloadData} className="flex items-center">
                      <Download className="mr-2 h-4 w-4" /> 
                      Yuklab olish
                    </Button>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="preview" className="pt-4">
                <div className="border p-4 rounded-md bg-slate-50 overflow-auto">
                  <p className="text-sm mb-4">
                    {dataType === "reservoirs" && `Suv omborlari ma'lumotlari (${reservoirs.length})`}
                    {dataType === "allocations" && `Suv taqsimoti ma'lumotlari (${allocations.length})`}
                    {dataType === "requests" && `Suv so'rovlari ma'lumotlari (${requests.length})`}
                  </p>
                  
                  {dataType === "reservoirs" && reservoirs.length > 0 && (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Nomi
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Suv hajmi
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Oxirgi yangilanish
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {filterDataByDate(reservoirs).slice(0, 5).map((reservoir: any, index) => (
                            <tr key={index}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {reservoir.name}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {reservoir.currentLevel}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {reservoir.lastUpdated ? new Date(reservoir.lastUpdated).toLocaleString() : 'N/A'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {reservoirs.length > 5 && (
                        <p className="text-center text-gray-500 text-sm mt-2">
                          Va yana {reservoirs.length - 5} qator...
                        </p>
                      )}
                    </div>
                  )}
                  
                  {dataType === "allocations" && allocations.length > 0 && (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Fermer
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Ajratilgan miqdor
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Ishlatilgan
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {filterDataByDate(allocations).slice(0, 5).map((allocation: any, index) => (
                            <tr key={index}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {allocation.userId}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {allocation.amount}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {allocation.used}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {allocations.length > 5 && (
                        <p className="text-center text-gray-500 text-sm mt-2">
                          Va yana {allocations.length - 5} qator...
                        </p>
                      )}
                    </div>
                  )}
                  
                  {dataType === "requests" && requests.length > 0 && (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Fermer
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              So'ralgan miqdor
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Holati
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {filterDataByDate(requests).slice(0, 5).map((request: any, index) => (
                            <tr key={index}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {request.userId}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {request.amount}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {request.status}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {requests.length > 5 && (
                        <p className="text-center text-gray-500 text-sm mt-2">
                          Va yana {requests.length - 5} qator...
                        </p>
                      )}
                    </div>
                  )}
                  
                  {((dataType === "reservoirs" && reservoirs.length === 0) || 
                    (dataType === "allocations" && allocations.length === 0) || 
                    (dataType === "requests" && requests.length === 0)) && (
                    <div className="text-center py-6">
                      <p className="text-gray-500">Ma'lumotlar mavjud emas.</p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}