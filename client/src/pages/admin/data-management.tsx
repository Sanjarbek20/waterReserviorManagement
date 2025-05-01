import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { useAuth } from "@/lib/auth";
import { useLocation } from "wouter";
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
import WaterManagementAlgorithm from "@/components/admin/suv-algorithm";
import AllAlgorithms from "@/components/admin/all-algorithms";
import SystemAlgorithm from "@/components/admin/system-algorithm";

export default function DataManagement() {
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [dataType, setDataType] = useState<string>("reservoirs");
  const { toast } = useToast();
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  
  // Tekshirish: faqat superadmin uchun
  useEffect(() => {
    if (user && user.role !== "super_admin") {
      toast({
        variant: "destructive",
        title: "Faqat superadmin uchun",
        description: "Ushbu sahifaga kirish huquqingiz yo'q."
      });
      setLocation("/dashboard");
    }
  }, [user, setLocation, toast]);

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
        {/* Tizim algoritmlari bo'limi - faqat superadmin uchun */}
        {user?.role === "super_admin" && (
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
              <Tabs defaultValue="system" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                {user?.role === "super_admin" && (
                  <TabsTrigger value="database">
                    <Database className="h-4 w-4 mr-2" />
                    Ma'lumotlar bazasi
                  </TabsTrigger>
                )}
                {user?.role === "super_admin" && (
                  <TabsTrigger value="water">
                    <Droplet className="h-4 w-4 mr-2" />
                    Suv monitoringi
                  </TabsTrigger>
                )}
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
                <TabsTrigger value="algorithm">
                  <Cpu className="h-4 w-4 mr-2" />
                  Suv algoritm
                </TabsTrigger>
                <TabsTrigger value="network">
                  <Network className="h-4 w-4 mr-2" />
                  Tarmoq
                </TabsTrigger>
              </TabsList>

              {user?.role === "super_admin" && (
                <TabsContent value="database" className="pt-4">
                  <DatabaseAlgorithm />
                </TabsContent>
              )}

              {user?.role === "super_admin" && (
                <TabsContent value="water" className="pt-4">
                  <WaterAlgorithms />
                </TabsContent>
              )}

              <TabsContent value="analytics" className="pt-4">
                <div className="border p-4 rounded-md bg-slate-50 overflow-auto">
                  <h3 className="text-lg font-medium mb-2 text-center">Statistik tahlil algoritmi</h3>
                  <p className="text-sm text-gray-500 mb-4 text-center">
                    Suv omborlaridagi va taqsimotlaridagi ma'lumotlarni statistik tahlil qilish
                  </p>
                  
                  <div className="w-full overflow-x-auto mb-4 flex justify-center">
                    <svg width="800" height="600" viewBox="0 0 800 600">
                      {/* Algoritm boshi */}
                      <ellipse cx="400" cy="30" rx="80" ry="30" fill="#dbeafe" stroke="#0c4a6e" strokeWidth="2" />
                      <text x="400" y="35" textAnchor="middle" fontWeight="bold" fill="#0f172a">Boshlash</text>
                      
                      {/* Strelka */}
                      <line x1="400" y1="60" x2="400" y2="90" stroke="#64748b" strokeWidth="2" />
                      <polygon points="395,90 405,90 400,100" fill="#64748b" />
                      
                      {/* Ma'lumotlar yig'ish */}
                      <rect x="300" y="100" width="200" height="60" rx="0" fill="#f8fafc" stroke="#0c4a6e" strokeWidth="2" />
                      <text x="400" y="130" textAnchor="middle" fontWeight="bold" fill="#0f172a">Ma'lumotlarni</text>
                      <text x="400" y="150" textAnchor="middle" fontWeight="bold" fill="#0f172a">yig'ish</text>
                      
                      {/* Strelka */}
                      <line x1="400" y1="160" x2="400" y2="190" stroke="#64748b" strokeWidth="2" />
                      <polygon points="395,190 405,190 400,200" fill="#64748b" />
                      
                      {/* Ma'lumotlarni tozalash */}
                      <rect x="300" y="200" width="200" height="60" rx="0" fill="#f8fafc" stroke="#0c4a6e" strokeWidth="2" />
                      <text x="400" y="230" textAnchor="middle" fontWeight="bold" fill="#0f172a">Ma'lumotlarni</text>
                      <text x="400" y="250" textAnchor="middle" fontWeight="bold" fill="#0f172a">tozalash va tayyorlash</text>
                      
                      {/* Strelka */}
                      <line x1="400" y1="260" x2="400" y2="290" stroke="#64748b" strokeWidth="2" />
                      <polygon points="395,290 405,290 400,300" fill="#64748b" />
                      
                      {/* Tahlil usulini tanlash */}
                      <polygon points="300,300 500,300 450,370 350,370" fill="#f8fafc" stroke="#0c4a6e" strokeWidth="2" />
                      <text x="400" y="335" textAnchor="middle" fontWeight="bold" fill="#0f172a">Tahlil usulini tanlash</text>
                      
                      {/* Strelkalar - tarmoqlanish */}
                      <line x1="350" y1="370" x2="200" y2="420" stroke="#64748b" strokeWidth="2" />
                      <polygon points="195,420 205,420 200,430" fill="#64748b" />
                      
                      <line x1="450" y1="370" x2="600" y2="420" stroke="#64748b" strokeWidth="2" />
                      <polygon points="595,420 605,420 600,430" fill="#64748b" />
                      
                      <line x1="400" y1="370" x2="400" y2="420" stroke="#64748b" strokeWidth="2" />
                      <polygon points="395,420 405,420 400,430" fill="#64748b" />
                      
                      {/* Tahlil turlari */}
                      <rect x="100" y="430" width="200" height="60" rx="0" fill="#f8fafc" stroke="#0c4a6e" strokeWidth="2" />
                      <text x="200" y="460" textAnchor="middle" fontWeight="bold" fill="#0f172a">Vaqt qatorlari tahlili</text>
                      <text x="200" y="480" textAnchor="middle" fontWeight="bold" fill="#0f172a">(ARIMA, LSTM)</text>
                      
                      <rect x="300" y="430" width="200" height="60" rx="0" fill="#f8fafc" stroke="#0c4a6e" strokeWidth="2" />
                      <text x="400" y="460" textAnchor="middle" fontWeight="bold" fill="#0f172a">Statistik tahlil</text>
                      <text x="400" y="480" textAnchor="middle" fontWeight="bold" fill="#0f172a">(Korrelyatsiya, Regressiya)</text>
                      
                      <rect x="500" y="430" width="200" height="60" rx="0" fill="#f8fafc" stroke="#0c4a6e" strokeWidth="2" />
                      <text x="600" y="460" textAnchor="middle" fontWeight="bold" fill="#0f172a">Bashorat modellarini</text>
                      <text x="600" y="480" textAnchor="middle" fontWeight="bold" fill="#0f172a">qurish</text>
                      
                      {/* Strelkalar - birlashtirish */}
                      <line x1="200" y1="490" x2="200" y2="520" stroke="#64748b" strokeWidth="2" />
                      <line x1="400" y1="490" x2="400" y2="520" stroke="#64748b" strokeWidth="2" />
                      <line x1="600" y1="490" x2="600" y2="520" stroke="#64748b" strokeWidth="2" />
                      
                      <line x1="200" y1="520" x2="400" y2="520" stroke="#64748b" strokeWidth="2" />
                      <line x1="400" y1="520" x2="600" y2="520" stroke="#64748b" strokeWidth="2" />
                      <line x1="400" y1="520" x2="400" y2="550" stroke="#64748b" strokeWidth="2" />
                      <polygon points="395,550 405,550 400,560" fill="#64748b" />
                      
                      {/* Natijalarni tahlil qilish */}
                      <rect x="300" y="560" width="200" height="60" rx="0" fill="#f8fafc" stroke="#0c4a6e" strokeWidth="2" />
                      <text x="400" y="590" textAnchor="middle" fontWeight="bold" fill="#0f172a">Natijalarni tahlil</text>
                      <text x="400" y="610" textAnchor="middle" fontWeight="bold" fill="#0f172a">qilish va taqdim etish</text>
                    </svg>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="bg-white p-3 rounded-md shadow-sm">
                      <h4 className="font-medium mb-2">Vaqt qatorlari tahlili</h4>
                      <p className="text-gray-600">
                        Suv omborlari darajasini va suv taqsimoti ma'lumotlarini vaqt bo'yicha tahlil qilish.
                      </p>
                    </div>
                    <div className="bg-white p-3 rounded-md shadow-sm">
                      <h4 className="font-medium mb-2">Statistik tahlil</h4>
                      <p className="text-gray-600">
                        Ma'lumotlarni statistik usullar orqali tahlil qilish, trend va mavsumiy o'zgarishlarni aniqlash.
                      </p>
                    </div>
                    <div className="bg-white p-3 rounded-md shadow-sm">
                      <h4 className="font-medium mb-2">Bashorat modellari</h4>
                      <p className="text-gray-600">
                        Suv resurslari taqsimotini va suv darajasini oldindan bashorat qilish uchun modellar yaratish.
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="security" className="pt-4">
                <div className="border p-4 rounded-md bg-slate-50 overflow-auto">
                  <h3 className="text-lg font-medium mb-2 text-center">Xavfsizlik algoritmi</h3>
                  <p className="text-sm text-gray-500 mb-4 text-center">
                    Tizim xavfsizligini ta'minlash va ruxsatsiz kirishlarni nazorat qilish
                  </p>
                  
                  <div className="w-full overflow-x-auto mb-4 flex justify-center">
                    <svg width="800" height="600" viewBox="0 0 800 600">
                      {/* Algoritm boshi */}
                      <ellipse cx="400" cy="30" rx="80" ry="30" fill="#dbeafe" stroke="#0c4a6e" strokeWidth="2" />
                      <text x="400" y="35" textAnchor="middle" fontWeight="bold" fill="#0f172a">Boshlash</text>
                      
                      {/* Strelka */}
                      <line x1="400" y1="60" x2="400" y2="90" stroke="#64748b" strokeWidth="2" />
                      <polygon points="395,90 405,90 400,100" fill="#64748b" />
                      
                      {/* Login so'rovi */}
                      <rect x="300" y="100" width="200" height="60" rx="0" fill="#f8fafc" stroke="#0c4a6e" strokeWidth="2" />
                      <text x="400" y="130" textAnchor="middle" fontWeight="bold" fill="#0f172a">Login so'rovi</text>
                      <text x="400" y="150" textAnchor="middle" fontWeight="bold" fill="#0f172a">qabul qilish</text>
                      
                      {/* Strelka */}
                      <line x1="400" y1="160" x2="400" y2="190" stroke="#64748b" strokeWidth="2" />
                      <polygon points="395,190 405,190 400,200" fill="#64748b" />
                      
                      {/* Maʼlumotlarni tekshirish */}
                      <polygon points="320,200 480,200 500,260 300,260" fill="#f8fafc" stroke="#0c4a6e" strokeWidth="2" />
                      <text x="400" y="230" textAnchor="middle" fontWeight="bold" fill="#0f172a">Login maʼlumotlarini</text>
                      <text x="400" y="250" textAnchor="middle" fontWeight="bold" fill="#0f172a">tekshirish</text>
                      
                      {/* Strelkalar - toʻgʻri/notoʻgʻri */}
                      <line x1="300" y1="230" x2="200" y2="300" stroke="#64748b" strokeWidth="2" />
                      <polygon points="195,300 205,300 200,310" fill="#64748b" />
                      <text x="250" y="270" textAnchor="middle" fill="#0f172a">Notog'ri</text>
                      
                      <line x1="500" y1="230" x2="600" y2="300" stroke="#64748b" strokeWidth="2" />
                      <polygon points="595,300 605,300 600,310" fill="#64748b" />
                      <text x="550" y="270" textAnchor="middle" fill="#0f172a">To'g'ri</text>
                      
                      {/* Notog'ri login */}
                      <rect x="100" y="310" width="200" height="60" rx="0" fill="#f8fafc" stroke="#0c4a6e" strokeWidth="2" />
                      <text x="200" y="340" textAnchor="middle" fontWeight="bold" fill="#0f172a">Login urinishlari sonini</text>
                      <text x="200" y="360" textAnchor="middle" fontWeight="bold" fill="#0f172a">qayd qilish</text>
                      
                      {/* To'g'ri login */}
                      <rect x="500" y="310" width="200" height="60" rx="0" fill="#f8fafc" stroke="#0c4a6e" strokeWidth="2" />
                      <text x="600" y="340" textAnchor="middle" fontWeight="bold" fill="#0f172a">JWT token</text>
                      <text x="600" y="360" textAnchor="middle" fontWeight="bold" fill="#0f172a">yaratish</text>
                      
                      {/* Strelkalar */}
                      <line x1="200" y1="370" x2="200" y2="400" stroke="#64748b" strokeWidth="2" />
                      <polygon points="195,400 205,400 200,410" fill="#64748b" />
                      
                      <line x1="600" y1="370" x2="600" y2="400" stroke="#64748b" strokeWidth="2" />
                      <polygon points="595,400 605,400 600,410" fill="#64748b" />
                      
                      {/* Urinishlar soni tekshirish */}
                      <polygon points="100,410 300,410 280,470 120,470" fill="#f8fafc" stroke="#0c4a6e" strokeWidth="2" />
                      <text x="200" y="440" textAnchor="middle" fontWeight="bold" fill="#0f172a">Urinishlar soni 3 dan ko&apos;pmi?</text>
                      
                      {/* Ruxsatlarni tekshirish */}
                      <rect x="500" y="410" width="200" height="60" rx="0" fill="#f8fafc" stroke="#0c4a6e" strokeWidth="2" />
                      <text x="600" y="440" textAnchor="middle" fontWeight="bold" fill="#0f172a">Foydalanuvchi</text>
                      <text x="600" y="460" textAnchor="middle" fontWeight="bold" fill="#0f172a">ruxsatlarini tekshirish</text>
                      
                      {/* Strelkalar - tarmoqlanish */}
                      <line x1="280" y1="440" x2="380" y2="440" stroke="#64748b" strokeWidth="2" />
                      <polygon points="375,435 385,445 385,435" fill="#64748b" />
                      <text x="330" y="430" textAnchor="middle" fill="#0f172a">Yo'q</text>
                      
                      <line x1="200" y1="470" x2="200" y2="500" stroke="#64748b" strokeWidth="2" />
                      <polygon points="195,500 205,500 200,510" fill="#64748b" />
                      <text x="170" y="490" textAnchor="middle" fill="#0f172a">Ha</text>
                      
                      <line x1="600" y1="470" x2="600" y2="500" stroke="#64748b" strokeWidth="2" />
                      <polygon points="595,500 605,500 600,510" fill="#64748b" />
                      
                      {/* Akkauntni bloklash */}
                      <rect x="20" y="510" width="200" height="60" rx="0" fill="#f8fafc" stroke="#f43f5e" strokeWidth="2" />
                      <text x="120" y="540" textAnchor="middle" fontWeight="bold" fill="#0f172a">Akkauntni bloklash</text>
                      <text x="120" y="560" textAnchor="middle" fontWeight="bold" fill="#0f172a">va administratorga xabar</text>
                      
                      {/* Tizimga kirish */}
                      <rect x="500" y="510" width="200" height="60" rx="0" fill="#f8fafc" stroke="#0c4a6e" strokeWidth="2" />
                      <text x="600" y="540" textAnchor="middle" fontWeight="bold" fill="#0f172a">Foydalanuvchi roliga</text>
                      <text x="600" y="560" textAnchor="middle" fontWeight="bold" fill="#0f172a">mos interfeysni yuklash</text>
                    </svg>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="bg-white p-3 rounded-md shadow-sm">
                      <h4 className="font-medium mb-2">Autentifikatsiya algoritmi</h4>
                      <p className="text-gray-600">
                        Foydalanuvchilarni identifikatsiya qilish va ularning kimligini tasdiqlash.
                      </p>
                    </div>
                    <div className="bg-white p-3 rounded-md shadow-sm">
                      <h4 className="font-medium mb-2">Ruxsatlar nazorati</h4>
                      <p className="text-gray-600">
                        Foydalanuvchi roli va huquqlariga asoslangan holda tizim resurslariga kirish ruxsatlarini nazorat qilish.
                      </p>
                    </div>
                    <div className="bg-white p-3 rounded-md shadow-sm">
                      <h4 className="font-medium mb-2">Xavfsizlik auditi</h4>
                      <p className="text-gray-600">
                        Tizimga kirishlar va muhim operatsiyalarni qayd qilish, shubhali faoliyatlarni kuzatish.
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="system" className="pt-4">
                <SystemAlgorithm />
              </TabsContent>

              <TabsContent value="idef0model" className="pt-4">
                <IDEF0Model />
              </TabsContent>
              
              <TabsContent value="algorithm" className="pt-4">
                <AllAlgorithms />
              </TabsContent>

              <TabsContent value="network" className="pt-4">
                <div className="border p-4 rounded-md bg-slate-50 overflow-auto">
                  <h3 className="text-lg font-medium mb-2 text-center">Tarmoq algoritmi</h3>
                  <p className="text-sm text-gray-500 mb-4 text-center">
                    Ma'lumotlarni uzatish va qayta ishlash uchun tarmoq algoritmlari
                  </p>
                  
                  <div className="w-full overflow-x-auto mb-4 flex justify-center">
                    <svg width="800" height="600" viewBox="0 0 800 600">
                      {/* Algoritm boshi */}
                      <ellipse cx="400" cy="30" rx="80" ry="30" fill="#dbeafe" stroke="#0c4a6e" strokeWidth="2" />
                      <text x="400" y="35" textAnchor="middle" fontWeight="bold" fill="#0f172a">Boshlash</text>
                      
                      {/* Strelka */}
                      <line x1="400" y1="60" x2="400" y2="90" stroke="#64748b" strokeWidth="2" />
                      <polygon points="395,90 405,90 400,100" fill="#64748b" />
                      
                      {/* WebSocket ulanishini tekshirish */}
                      <rect x="300" y="100" width="200" height="60" rx="0" fill="#f8fafc" stroke="#0c4a6e" strokeWidth="2" />
                      <text x="400" y="130" textAnchor="middle" fontWeight="bold" fill="#0f172a">WebSocket ulanishini</text>
                      <text x="400" y="150" textAnchor="middle" fontWeight="bold" fill="#0f172a">tekshirish</text>
                      
                      {/* Strelka */}
                      <line x1="400" y1="160" x2="400" y2="190" stroke="#64748b" strokeWidth="2" />
                      <polygon points="395,190 405,190 400,200" fill="#64748b" />
                      
                      {/* Ulanish holati */}
                      <polygon points="300,200 500,200 450,270 350,270" fill="#f8fafc" stroke="#0c4a6e" strokeWidth="2" />
                      <text x="400" y="235" textAnchor="middle" fontWeight="bold" fill="#0f172a">Ulanish mavjudmi?</text>
                      
                      {/* Strelkalar - tarmoqlanish */}
                      <line x1="350" y1="270" x2="200" y2="320" stroke="#64748b" strokeWidth="2" />
                      <polygon points="195,320 205,320 200,330" fill="#64748b" />
                      <text x="270" y="300" textAnchor="middle" fill="#0f172a">Yo'q</text>
                      
                      <line x1="450" y1="270" x2="600" y2="320" stroke="#64748b" strokeWidth="2" />
                      <polygon points="595,320 605,320 600,330" fill="#64748b" />
                      <text x="530" y="300" textAnchor="middle" fill="#0f172a">Ha</text>
                      
                      {/* Bog'lanishni tiklash */}
                      <rect x="100" y="330" width="200" height="60" rx="0" fill="#f8fafc" stroke="#0c4a6e" strokeWidth="2" />
                      <text x="200" y="360" textAnchor="middle" fontWeight="bold" fill="#0f172a">WebSocket bog'lanishini</text>
                      <text x="200" y="380" textAnchor="middle" fontWeight="bold" fill="#0f172a">qayta tiklash</text>
                      
                      {/* Real-time ma'lumotlarni qabul qilish */}
                      <rect x="500" y="330" width="200" height="60" rx="0" fill="#f8fafc" stroke="#0c4a6e" strokeWidth="2" />
                      <text x="600" y="360" textAnchor="middle" fontWeight="bold" fill="#0f172a">Real-time ma'lumotlarni</text>
                      <text x="600" y="380" textAnchor="middle" fontWeight="bold" fill="#0f172a">qabul qilish</text>
                      
                      {/* Strelkalar */}
                      <line x1="200" y1="390" x2="200" y2="420" stroke="#64748b" strokeWidth="2" />
                      <polygon points="195,420 205,420 200,430" fill="#64748b" />
                      
                      <line x1="600" y1="390" x2="600" y2="420" stroke="#64748b" strokeWidth="2" />
                      <polygon points="595,420 605,420 600,430" fill="#64748b" />
                      
                      {/* Qayta ulanish sikli */}
                      <rect x="100" y="430" width="200" height="60" rx="0" fill="#f8fafc" stroke="#0c4a6e" strokeWidth="2" />
                      <text x="200" y="460" textAnchor="middle" fontWeight="bold" fill="#0f172a">Qayta ulanish</text>
                      <text x="200" y="480" textAnchor="middle" fontWeight="bold" fill="#0f172a">sikli (exponential backoff)</text>
                      
                      {/* Ma'lumotlarni qayta ishlash */}
                      <rect x="500" y="430" width="200" height="60" rx="0" fill="#f8fafc" stroke="#0c4a6e" strokeWidth="2" />
                      <text x="600" y="460" textAnchor="middle" fontWeight="bold" fill="#0f172a">Ma'lumotlarni</text>
                      <text x="600" y="480" textAnchor="middle" fontWeight="bold" fill="#0f172a">qayta ishlash</text>
                      
                      {/* Strelkalar */}
                      <line x1="200" y1="490" x2="200" y2="520" stroke="#64748b" strokeWidth="2" />
                      <polygon points="195,520 205,520 200,530" fill="#64748b" />
                      
                      <line x1="600" y1="490" x2="600" y2="520" stroke="#64748b" strokeWidth="2" />
                      <polygon points="595,520 605,520 600,530" fill="#64748b" />
                      
                      {/* JWT tokenni tekshirish */}
                      <rect x="100" y="530" width="200" height="60" rx="0" fill="#f8fafc" stroke="#0c4a6e" strokeWidth="2" />
                      <text x="200" y="560" textAnchor="middle" fontWeight="bold" fill="#0f172a">Autentifikatsiya</text>
                      <text x="200" y="580" textAnchor="middle" fontWeight="bold" fill="#0f172a">tokenini yangilash</text>
                      
                      {/* Ma'lumotlarni saqlash va ko'rsatish */}
                      <rect x="500" y="530" width="200" height="60" rx="0" fill="#f8fafc" stroke="#0c4a6e" strokeWidth="2" />
                      <text x="600" y="560" textAnchor="middle" fontWeight="bold" fill="#0f172a">Ma'lumotlarni saqlash</text>
                      <text x="600" y="580" textAnchor="middle" fontWeight="bold" fill="#0f172a">va ko'rsatish</text>
                      
                      {/* Qayta ulanish */}
                      <path d="M 200,590 L 200,620 L 400,620 L 400,60" stroke="#64748b" strokeWidth="2" fill="none" />
                      <polygon points="395,65 405,65 400,60" fill="#64748b" />
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
        )}
        
        {/* Ma'lumotlarni yuklash va ko'rish bo'limi */}
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
                          {reservoirs.map((reservoir, index) => (
                            <tr key={index}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {reservoir.name}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {reservoir.currentLevel}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {reservoir.lastUpdated ? format(new Date(reservoir.lastUpdated), "yyyy-MM-dd HH:mm") : "Ma'lumot yo'q"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                  
                  {dataType === "allocations" && allocations.length > 0 && (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Foydalanuvchi
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Suv hajmi
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Ishlatilgan
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Sana
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {allocations.map((allocation, index) => (
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
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {format(new Date(allocation.createdAt), "yyyy-MM-dd")}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                  
                  {dataType === "requests" && requests.length > 0 && (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Foydalanuvchi
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Suv hajmi
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Status
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              So'rov sanasi
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {requests.map((request, index) => (
                            <tr key={index}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {request.userId}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {request.amount}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                <span className={`px-2 py-1 rounded text-xs font-medium ${request.status === 'approved' ? 'bg-green-100 text-green-800' : request.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                  {request.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {format(new Date(request.requestDate), "yyyy-MM-dd")}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
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
