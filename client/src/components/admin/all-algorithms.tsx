import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Download, Info, ZoomIn, ZoomOut } from "lucide-react";
import WaterManagementAlgorithm from "./suv-algorithm";

export default function AllAlgorithms() {
  const [zoomLevel, setZoomLevel] = useState(100);

  const increaseZoom = () => {
    if (zoomLevel < 150) setZoomLevel(zoomLevel + 10);
  };

  const decreaseZoom = () => {
    if (zoomLevel > 50) setZoomLevel(zoomLevel - 10);
  };
  
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Suv Resurslari Algoritmlari</h2>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" onClick={decreaseZoom}>
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="text-sm">{zoomLevel}%</span>
          <Button variant="outline" size="icon" onClick={increaseZoom}>
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-1" />
            Yuklab olish
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="waterManagement" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="waterManagement">Suv boshqaruvi</TabsTrigger>
          <TabsTrigger value="prediction">Bashorat</TabsTrigger>
          <TabsTrigger value="allocation">Taqsimlash</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
          <TabsTrigger value="optimization">Optimallash</TabsTrigger>
        </TabsList>
        
        <TabsContent value="waterManagement" className="pt-4">
          <WaterManagementAlgorithm />
        </TabsContent>
        
        <TabsContent value="prediction" className="pt-4">
          <Card className="shadow-md mb-8">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Suv miqdori bashorati algoritmi (LSTM)</CardTitle>
            </CardHeader>
            <CardContent>
              <div style={{transform: `scale(${zoomLevel/100})`, transformOrigin: 'top center'}} className="w-full overflow-x-auto transition-transform duration-200 ease-in-out">
                <svg width="800" height="800" viewBox="0 0 800 800" className="mx-auto">
                  {/* Start */}
                  <circle cx="400" cy="50" r="40" fill="#dbeafe" stroke="#0c4a6e" strokeWidth="2"/>
                  <text x="400" y="55" textAnchor="middle" fontWeight="bold" fill="#0f172a">Boshlash</text>
                  
                  {/* Flow arrow */}
                  <line x1="400" y1="90" x2="400" y2="120" stroke="#64748b" strokeWidth="2"/>
                  <polygon points="395,120 405,120 400,130" fill="#64748b"/>
                  
                  {/* Historical data collection */}
                  <rect x="300" y="130" width="200" height="60" rx="0" fill="#dbeafe" stroke="#0c4a6e" strokeWidth="2"/>
                  <text x="400" y="165" textAnchor="middle" fontWeight="bold" fill="#0f172a">Tarixiy ma'lumotlarni yig'ish</text>
                  
                  {/* Flow arrow */}
                  <line x1="400" y1="190" x2="400" y2="220" stroke="#64748b" strokeWidth="2"/>
                  <polygon points="395,220 405,220 400,230" fill="#64748b"/>
                  
                  {/* Data preprocessing */}
                  <rect x="300" y="230" width="200" height="60" rx="0" fill="#dbeafe" stroke="#0c4a6e" strokeWidth="2"/>
                  <text x="400" y="265" textAnchor="middle" fontWeight="bold" fill="#0f172a">Ma'lumotlarni tayyorlash</text>
                  
                  {/* Flow arrow */}
                  <line x1="400" y1="290" x2="400" y2="320" stroke="#64748b" strokeWidth="2"/>
                  <polygon points="395,320 405,320 400,330" fill="#64748b"/>
                  
                  {/* Feature extraction */}
                  <rect x="300" y="330" width="200" height="60" rx="0" fill="#dbeafe" stroke="#0c4a6e" strokeWidth="2"/>
                  <text x="400" y="365" textAnchor="middle" fontWeight="bold" fill="#0f172a">Xususiyatlarni ajratib olish</text>
                  
                  {/* Flow arrow */}
                  <line x1="400" y1="390" x2="400" y2="420" stroke="#64748b" strokeWidth="2"/>
                  <polygon points="395,420 405,420 400,430" fill="#64748b"/>
                  
                  {/* Model selection */}
                  <polygon points="300,430 500,430 450,490 350,490" fill="#dbeafe" stroke="#0c4a6e" strokeWidth="2"/>
                  <text x="400" y="460" textAnchor="middle" fontWeight="bold" fill="#0f172a">LSTM modelini tanlash</text>
                  
                  {/* Flow arrow */}
                  <line x1="400" y1="490" x2="400" y2="520" stroke="#64748b" strokeWidth="2"/>
                  <polygon points="395,520 405,520 400,530" fill="#64748b"/>
                  
                  {/* Model training */}
                  <rect x="300" y="530" width="200" height="60" rx="0" fill="#dbeafe" stroke="#0c4a6e" strokeWidth="2"/>
                  <text x="400" y="565" textAnchor="middle" fontWeight="bold" fill="#0f172a">Modelni o'qitish</text>
                  
                  {/* Flow arrow */}
                  <line x1="400" y1="590" x2="400" y2="620" stroke="#64748b" strokeWidth="2"/>
                  <polygon points="395,620 405,620 400,630" fill="#64748b"/>
                  
                  {/* Model evaluation */}
                  <rect x="300" y="630" width="200" height="60" rx="0" fill="#dbeafe" stroke="#0c4a6e" strokeWidth="2"/>
                  <text x="400" y="665" textAnchor="middle" fontWeight="bold" fill="#0f172a">Modelni baholash</text>
                  
                  {/* Flow arrow to left */}
                  <line x1="300" y1="660" x2="200" y2="660" stroke="#64748b" strokeWidth="2"/>
                  <polygon points="210,655 200,660 210,665" fill="#64748b"/>
                  
                  {/* Adjust hyperparameters */}
                  <rect x="100" y="630" width="100" height="60" rx="0" fill="#fee2e2" stroke="#7f1d1d" strokeWidth="2"/>
                  <text x="150" y="653" textAnchor="middle" fontWeight="bold" fill="#0f172a" fontSize="10">Giper-</text>
                  <text x="150" y="668" textAnchor="middle" fontWeight="bold" fill="#0f172a" fontSize="10">parametrlarni</text>
                  <text x="150" y="683" textAnchor="middle" fontWeight="bold" fill="#0f172a" fontSize="10">sozlash</text>
                  
                  {/* Return arrow */}
                  <line x1="150" y1="630" x2="150" y2="560" stroke="#64748b" strokeWidth="2"/>
                  <line x1="150" y1="560" x2="300" y2="560" stroke="#64748b" strokeWidth="2"/>
                  <polygon points="290,555 300,560 290,565" fill="#64748b"/>
                  
                  {/* Flow arrow */}
                  <line x1="400" y1="690" x2="400" y2="720" stroke="#64748b" strokeWidth="2"/>
                  <polygon points="395,720 405,720 400,730" fill="#64748b"/>
                  
                  {/* End */}
                  <ellipse cx="400" cy="750" rx="80" ry="30" fill="#dbeafe" stroke="#0c4a6e" strokeWidth="2"/>
                  <text x="400" y="750" textAnchor="middle" fontWeight="bold" fill="#0f172a">Suv miqdori bashorati</text>
                  <text x="400" y="765" textAnchor="middle" fontWeight="bold" fill="#0f172a">tayyor</text>
                </svg>
              </div>
              
              <div className="p-4 bg-slate-50 mt-4 rounded-md">
                <h3 className="font-medium text-lg mb-2">LSTM bashorat algoritmi tushuntirishi:</h3>
                <p className="mb-2">Long Short-Term Memory (LSTM) modeli suv miqdorini bashorat qilish uchun foydalaniladi:</p>
                
                <ol className="list-decimal list-inside space-y-1 ml-2">
                  <li><span className="font-medium">Tarixiy ma'lumotlarni yig'ish:</span> Suv ombori, ob-havo ma'lumotlari, mavsumiy o'zgarishlar</li>
                  <li><span className="font-medium">Ma'lumotlarni tayyorlash:</span> Normalizatsiya, standarlashtirish, xatoliklarni tuzatish</li>
                  <li><span className="font-medium">Xususiyatlarni ajratib olish:</span> Muhim ko'rsatkichlarni tanlash (yog'ingarchilik, harorat, suv oqimi)</li>
                  <li><span className="font-medium">LSTM modelini tanlash:</span> Ma'lumotlarga mos LSTM arxitekturasini yaratish</li>
                  <li><span className="font-medium">Modelni o'qitish:</span> Tarixiy ma'lumotlar orqali LSTM modelini o'qitish</li>
                  <li><span className="font-medium">Modelni baholash:</span> Test ma'lumotlari orqali modelning aniqligini baholash</li>
                  <li><span className="font-medium">Giper-parametrlarni sozlash:</span> Agar aniqlik etarli bo'lmasa, modelni qayta sozlash</li>
                  <li><span className="font-medium">Suv miqdori bashorati:</span> Kelgusi davrlar uchun suv miqdorini bashorat qilish</li>
                </ol>
                
                <div className="mt-4 text-sm text-gray-600">
                  <p className="font-medium">Bashorat davriylik darajalari:</p>
                  <ul className="list-disc list-inside ml-2">
                    <li>Qisqa muddatli (1-3 kun)</li>
                    <li>O'rta muddatli (1-4 hafta)</li>
                    <li>Uzoq muddatli (1-6 oy)</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="allocation" className="pt-4">
          <Card className="shadow-md mb-8">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Suv taqsimlash algoritmi</CardTitle>
            </CardHeader>
            <CardContent>
              <div style={{transform: `scale(${zoomLevel/100})`, transformOrigin: 'top center'}} className="w-full overflow-x-auto transition-transform duration-200 ease-in-out">
                <svg width="800" height="800" viewBox="0 0 800 800" className="mx-auto">
                  {/* Start */}
                  <circle cx="400" cy="50" r="40" fill="#dbeafe" stroke="#0c4a6e" strokeWidth="2"/>
                  <text x="400" y="55" textAnchor="middle" fontWeight="bold" fill="#0f172a">Boshlash</text>
                  
                  {/* Flow arrow */}
                  <line x1="400" y1="90" x2="400" y2="120" stroke="#64748b" strokeWidth="2"/>
                  <polygon points="395,120 405,120 400,130" fill="#64748b"/>
                  
                  {/* Water demand collection */}
                  <rect x="300" y="130" width="200" height="60" rx="0" fill="#dbeafe" stroke="#0c4a6e" strokeWidth="2"/>
                  <text x="400" y="165" textAnchor="middle" fontWeight="bold" fill="#0f172a">Suv talablarini yig'ish</text>
                  
                  {/* Flow arrow */}
                  <line x1="400" y1="190" x2="400" y2="220" stroke="#64748b" strokeWidth="2"/>
                  <polygon points="395,220 405,220 400,230" fill="#64748b"/>
                  
                  {/* Water supply assessment */}
                  <rect x="300" y="230" width="200" height="60" rx="0" fill="#dbeafe" stroke="#0c4a6e" strokeWidth="2"/>
                  <text x="400" y="265" textAnchor="middle" fontWeight="bold" fill="#0f172a">Suv zahirasini baholash</text>
                  
                  {/* Flow arrow */}
                  <line x1="400" y1="290" x2="400" y2="320" stroke="#64748b" strokeWidth="2"/>
                  <polygon points="395,320 405,320 400,330" fill="#64748b"/>
                  
                  {/* Decision: Is water sufficient? */}
                  <polygon points="300,330 500,330 450,390 350,390" fill="#dbeafe" stroke="#0c4a6e" strokeWidth="2"/>
                  <text x="400" y="350" textAnchor="middle" fontWeight="bold" fill="#0f172a">Suv zahirasi</text>
                  <text x="400" y="370" textAnchor="middle" fontWeight="bold" fill="#0f172a">ehtiyojni qoplaydimi?</text>
                  
                  {/* No path */}
                  <line x1="350" y1="390" x2="200" y2="450" stroke="#64748b" strokeWidth="2"/>
                  <polygon points="195,450 205,450 200,460" fill="#64748b"/>
                  <text x="260" y="400" textAnchor="middle" fontSize="12" fill="#ef4444">Yo'q</text>
                  
                  {/* Yes path */}
                  <line x1="450" y1="390" x2="600" y2="450" stroke="#64748b" strokeWidth="2"/>
                  <polygon points="595,450 605,450 600,460" fill="#64748b"/>
                  <text x="540" y="400" textAnchor="middle" fontSize="12" fill="#16a34a">Ha</text>
                  
                  {/* Water allocation optimization */}
                  <rect x="100" y="460" width="200" height="60" rx="0" fill="#fee2e2" stroke="#7f1d1d" strokeWidth="2"/>
                  <text x="200" y="485" textAnchor="middle" fontWeight="bold" fill="#0f172a">Suv taqsimotini</text>
                  <text x="200" y="505" textAnchor="middle" fontWeight="bold" fill="#0f172a">optimallash</text>
                  
                  {/* Full water allocation */}
                  <rect x="500" y="460" width="200" height="60" rx="0" fill="#dcfce7" stroke="#166534" strokeWidth="2"/>
                  <text x="600" y="485" textAnchor="middle" fontWeight="bold" fill="#0f172a">To'liq suv</text>
                  <text x="600" y="505" textAnchor="middle" fontWeight="bold" fill="#0f172a">taqsimoti</text>
                  
                  {/* Flow arrows converge */}
                  <line x1="200" y1="520" x2="200" y2="580" stroke="#64748b" strokeWidth="2"/>
                  <line x1="600" y1="520" x2="600" y2="580" stroke="#64748b" strokeWidth="2"/>
                  <line x1="200" y1="580" x2="400" y2="580" stroke="#64748b" strokeWidth="2"/>
                  <line x1="600" y1="580" x2="400" y2="580" stroke="#64748b" strokeWidth="2"/>
                  <line x1="400" y1="580" x2="400" y2="610" stroke="#64748b" strokeWidth="2"/>
                  <polygon points="395,610 405,610 400,620" fill="#64748b"/>
                  
                  {/* Apply water allocation */}
                  <rect x="300" y="620" width="200" height="60" rx="0" fill="#dbeafe" stroke="#0c4a6e" strokeWidth="2"/>
                  <text x="400" y="655" textAnchor="middle" fontWeight="bold" fill="#0f172a">Suv taqsimotini qo'llash</text>
                  
                  {/* Flow arrow */}
                  <line x1="400" y1="680" x2="400" y2="710" stroke="#64748b" strokeWidth="2"/>
                  <polygon points="395,710 405,710 400,720" fill="#64748b"/>
                  
                  {/* End */}
                  <ellipse cx="400" cy="750" rx="80" ry="30" fill="#dbeafe" stroke="#0c4a6e" strokeWidth="2"/>
                  <text x="400" y="750" textAnchor="middle" fontWeight="bold" fill="#0f172a">Suv taqsimlash</text>
                  <text x="400" y="765" textAnchor="middle" fontWeight="bold" fill="#0f172a">yakunlandi</text>
                </svg>
              </div>
              
              <div className="p-4 bg-slate-50 mt-4 rounded-md">
                <h3 className="font-medium text-lg mb-2">Suv taqsimlash algoritmi tushuntirishi:</h3>
                <p className="mb-2">Bu algoritm fermerlar va boshqa foydalanuvchilar talablariga ko'ra suv resurslarini samarali taqsimlash imkonini beradi:</p>
                
                <ol className="list-decimal list-inside space-y-1 ml-2">
                  <li><span className="font-medium">Suv talablarini yig'ish:</span> Fermerlar va boshqa foydalanuvchilardan suv talablarini qabul qilish</li>
                  <li><span className="font-medium">Suv zahirasini baholash:</span> Suv omborlaridagi mavjud suv hajmini baholash</li>
                  <li><span className="font-medium">Suv yetarliligini tekshirish:</span> Talab qilingan suv miqdorini mavjud zaxira bilan taqqoslash</li>
                  <li><span className="font-medium">Optimallash (zarur bo'lganda):</span> Agar suv yetarli bo'lmasa, muhimlik darajasi va ekin turlariga ko'ra optimallash</li>
                  <li><span className="font-medium">To'liq taqsimot (imkon bo'lganda):</span> Agar suv yetarli bo'lsa, barcha talablarga to'liq javob berish</li>
                  <li><span className="font-medium">Taqsimotni qo'llash:</span> Taqsimot rejasini tizimda aktivlashtirish va foydalanuvchilarni xabardor qilish</li>
                </ol>
                
                <div className="mt-4 text-sm text-gray-600">
                  <p className="font-medium">Taqsimot ustuvorliklari:</p>
                  <ul className="list-disc list-inside ml-2">
                    <li>Ichimlik suvi - eng yuqori ustunlik</li>
                    <li>Oziq-ovqat ekinlari</li>
                    <li>Ko'p yillik ekinlar</li>
                    <li>Sanoat ehtiyojlari</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="monitoring" className="pt-4">
          <Card className="shadow-md mb-8">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Suv omborlari monitoring algoritmi</CardTitle>
            </CardHeader>
            <CardContent>
              <div style={{transform: `scale(${zoomLevel/100})`, transformOrigin: 'top center'}} className="w-full overflow-x-auto transition-transform duration-200 ease-in-out">
                <svg width="800" height="800" viewBox="0 0 800 800" className="mx-auto">
                  {/* Start */}
                  <circle cx="400" cy="50" r="40" fill="#dbeafe" stroke="#0c4a6e" strokeWidth="2"/>
                  <text x="400" y="55" textAnchor="middle" fontWeight="bold" fill="#0f172a">Boshlash</text>
                  
                  {/* Flow arrow */}
                  <line x1="400" y1="90" x2="400" y2="120" stroke="#64748b" strokeWidth="2"/>
                  <polygon points="395,120 405,120 400,130" fill="#64748b"/>
                  
                  {/* Initialize sensors */}
                  <rect x="300" y="130" width="200" height="60" rx="0" fill="#dbeafe" stroke="#0c4a6e" strokeWidth="2"/>
                  <text x="400" y="165" textAnchor="middle" fontWeight="bold" fill="#0f172a">Sensorlarni ishga tushirish</text>
                  
                  {/* Flow arrow */}
                  <line x1="400" y1="190" x2="400" y2="220" stroke="#64748b" strokeWidth="2"/>
                  <polygon points="395,220 405,220 400,230" fill="#64748b"/>
                  
                  {/* Collect data */}
                  <rect x="300" y="230" width="200" height="60" rx="0" fill="#dbeafe" stroke="#0c4a6e" strokeWidth="2"/>
                  <text x="400" y="265" textAnchor="middle" fontWeight="bold" fill="#0f172a">Ma'lumotlarni yig'ish</text>
                  
                  {/* Flow arrow */}
                  <line x1="400" y1="290" x2="400" y2="320" stroke="#64748b" strokeWidth="2"/>
                  <polygon points="395,320 405,320 400,330" fill="#64748b"/>
                  
                  {/* Validate data */}
                  <rect x="300" y="330" width="200" height="60" rx="0" fill="#dbeafe" stroke="#0c4a6e" strokeWidth="2"/>
                  <text x="400" y="365" textAnchor="middle" fontWeight="bold" fill="#0f172a">Ma'lumotlarni tekshirish</text>
                  
                  {/* Flow arrow */}
                  <line x1="400" y1="390" x2="400" y2="420" stroke="#64748b" strokeWidth="2"/>
                  <polygon points="395,420 405,420 400,430" fill="#64748b"/>
                  
                  {/* Decision: Data valid? */}
                  <polygon points="300,430 500,430 450,490 350,490" fill="#dbeafe" stroke="#0c4a6e" strokeWidth="2"/>
                  <text x="400" y="460" textAnchor="middle" fontWeight="bold" fill="#0f172a">Ma'lumotlar to'g'rimi?</text>
                  
                  {/* No path */}
                  <line x1="350" y1="490" x2="150" y2="490" stroke="#64748b" strokeWidth="2"/>
                  <polygon points="160,485 150,490 160,495" fill="#64748b"/>
                  <text x="260" y="480" textAnchor="middle" fontSize="12" fill="#ef4444">Yo'q</text>
                  
                  {/* Error correction */}
                  <rect x="50" y="460" width="100" height="60" rx="0" fill="#fee2e2" stroke="#7f1d1d" strokeWidth="2"/>
                  <text x="100" y="485" textAnchor="middle" fontWeight="bold" fill="#0f172a" fontSize="10">Xatoliklarni</text>
                  <text x="100" y="500" textAnchor="middle" fontWeight="bold" fill="#0f172a" fontSize="10">tuzatish</text>
                  
                  {/* Return arrow */}
                  <line x1="50" y1="490" x2="30" y2="490" stroke="#64748b" strokeWidth="2"/>
                  <line x1="30" y1="490" x2="30" y2="260" stroke="#64748b" strokeWidth="2"/>
                  <line x1="30" y1="260" x2="300" y2="260" stroke="#64748b" strokeWidth="2"/>
                  <polygon points="290,255 300,260 290,265" fill="#64748b"/>
                  
                  {/* Yes path */}
                  <line x1="400" y1="490" x2="400" y2="520" stroke="#64748b" strokeWidth="2"/>
                  <polygon points="395,520 405,520 400,530" fill="#64748b"/>
                  <text x="420" y="505" textAnchor="middle" fontSize="12" fill="#16a34a">Ha</text>
                  
                  {/* Store data */}
                  <rect x="300" y="530" width="200" height="60" rx="0" fill="#dbeafe" stroke="#0c4a6e" strokeWidth="2"/>
                  <text x="400" y="565" textAnchor="middle" fontWeight="bold" fill="#0f172a">Ma'lumotlarni saqlash</text>
                  
                  {/* Flow arrow */}
                  <line x1="400" y1="590" x2="400" y2="620" stroke="#64748b" strokeWidth="2"/>
                  <polygon points="395,620 405,620 400,630" fill="#64748b"/>
                  
                  {/* Analyze data */}
                  <rect x="300" y="630" width="200" height="60" rx="0" fill="#dbeafe" stroke="#0c4a6e" strokeWidth="2"/>
                  <text x="400" y="665" textAnchor="middle" fontWeight="bold" fill="#0f172a">Ma'lumotlarni tahlil qilish</text>
                  
                  {/* Flow arrow */}
                  <line x1="400" y1="690" x2="400" y2="720" stroke="#64748b" strokeWidth="2"/>
                  <polygon points="395,720 405,720 400,730" fill="#64748b"/>
                  
                  {/* End + loop back */}
                  <ellipse cx="400" cy="750" rx="80" ry="30" fill="#dbeafe" stroke="#0c4a6e" strokeWidth="2"/>
                  <text x="400" y="750" textAnchor="middle" fontWeight="bold" fill="#0f172a">Ma'lumotlarni</text>
                  <text x="400" y="765" textAnchor="middle" fontWeight="bold" fill="#0f172a">yangilash</text>
                  
                  {/* Loop back */}
                  <path d="M 480,750 L 700,750 L 700,260 L 500,260" stroke="#64748b" strokeWidth="2" fill="none" strokeDasharray="5,5" />
                  <polygon points="510,255 500,260 510,265" fill="#64748b"/>
                </svg>
              </div>
              
              <div className="p-4 bg-slate-50 mt-4 rounded-md">
                <h3 className="font-medium text-lg mb-2">Monitoring algoritmi tushuntirishi:</h3>
                <p className="mb-2">Suv omborlarini real vaqt rejimida monitoring qilish jarayoni quyidagi bosqichlardan iborat:</p>
                
                <ol className="list-decimal list-inside space-y-1 ml-2">
                  <li><span className="font-medium">Sensorlarni ishga tushirish:</span> Suv sathi, sifati va boshqa parametrlarni o'lchovchi sensorlarni ishga tushirish</li>
                  <li><span className="font-medium">Ma'lumotlarni yig'ish:</span> Barcha datchiklar va sensorlardan ma'lumotlarni qabul qilish</li>
                  <li><span className="font-medium">Ma'lumotlarni tekshirish:</span> Qabul qilingan ma'lumotlar to'g'riligini tekshirish</li>
                  <li><span className="font-medium">Xatoliklarni tuzatish:</span> Agar ma'lumotlarda xatoliklar aniqlansa, ularni tuzatish yoki qayta so'rov yuborish</li>
                  <li><span className="font-medium">Ma'lumotlarni saqlash:</span> Tekshirilgan ma'lumotlarni ma'lumotlar bazasiga saqlash</li>
                  <li><span className="font-medium">Ma'lumotlarni tahlil qilish:</span> Yig'ilgan ma'lumotlarni real vaqt rejimida tahlil qilish</li>
                  <li><span className="font-medium">Ma'lumotlarni yangilash:</span> Belgilangan vaqt oralig'ida jarayonni qayta boshlash</li>
                </ol>
                
                <div className="mt-4 text-sm text-gray-600">
                  <p className="font-medium">Monitoring turlari:</p>
                  <ul className="list-disc list-inside ml-2">
                    <li>Suv sathi monitoringi (har 10 daqiqada)</li>
                    <li>Suv sifati monitoringi (har soatda)</li>
                    <li>Suv oqimi monitoringi (har 30 daqiqada)</li>
                    <li>Video monitoring (real vaqt rejimida)</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="optimization" className="pt-4">
          <Card className="shadow-md mb-8">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">Suv resurslarini optimallash algoritmi</CardTitle>
            </CardHeader>
            <CardContent>
              <div style={{transform: `scale(${zoomLevel/100})`, transformOrigin: 'top center'}} className="w-full overflow-x-auto transition-transform duration-200 ease-in-out">
                <svg width="800" height="800" viewBox="0 0 800 800" className="mx-auto">
                  {/* Start */}
                  <circle cx="400" cy="50" r="40" fill="#dbeafe" stroke="#0c4a6e" strokeWidth="2"/>
                  <text x="400" y="55" textAnchor="middle" fontWeight="bold" fill="#0f172a">Boshlash</text>
                  
                  {/* Flow arrow */}
                  <line x1="400" y1="90" x2="400" y2="120" stroke="#64748b" strokeWidth="2"/>
                  <polygon points="395,120 405,120 400,130" fill="#64748b"/>
                  
                  {/* Available resources */}
                  <rect x="300" y="130" width="200" height="60" rx="0" fill="#dbeafe" stroke="#0c4a6e" strokeWidth="2"/>
                  <text x="400" y="165" textAnchor="middle" fontWeight="bold" fill="#0f172a">Mavjud resurslarni aniqlash</text>
                  
                  {/* Flow arrow */}
                  <line x1="400" y1="190" x2="400" y2="220" stroke="#64748b" strokeWidth="2"/>
                  <polygon points="395,220 405,220 400,230" fill="#64748b"/>
                  
                  {/* Demand identification */}
                  <rect x="300" y="230" width="200" height="60" rx="0" fill="#dbeafe" stroke="#0c4a6e" strokeWidth="2"/>
                  <text x="400" y="265" textAnchor="middle" fontWeight="bold" fill="#0f172a">Talablar va ehtiyojlarni aniqlash</text>
                  
                  {/* Flow arrow */}
                  <line x1="400" y1="290" x2="400" y2="320" stroke="#64748b" strokeWidth="2"/>
                  <polygon points="395,320 405,320 400,330" fill="#64748b"/>
                  
                  {/* Prioritization */}
                  <rect x="300" y="330" width="200" height="60" rx="0" fill="#dbeafe" stroke="#0c4a6e" strokeWidth="2"/>
                  <text x="400" y="365" textAnchor="middle" fontWeight="bold" fill="#0f172a">Ustuvorliklarni belgilash</text>
                  
                  {/* Flow arrow */}
                  <line x1="400" y1="390" x2="400" y2="420" stroke="#64748b" strokeWidth="2"/>
                  <polygon points="395,420 405,420 400,430" fill="#64748b"/>
                  
                  {/* Mathematical model */}
                  <rect x="300" y="430" width="200" height="60" rx="0" fill="#dbeafe" stroke="#0c4a6e" strokeWidth="2"/>
                  <text x="400" y="465" textAnchor="middle" fontWeight="bold" fill="#0f172a">Matematik model yaratish</text>
                  
                  {/* Flow arrow */}
                  <line x1="400" y1="490" x2="400" y2="520" stroke="#64748b" strokeWidth="2"/>
                  <polygon points="395,520 405,520 400,530" fill="#64748b"/>
                  
                  {/* Run optimization */}
                  <rect x="300" y="530" width="200" height="60" rx="0" fill="#dbeafe" stroke="#0c4a6e" strokeWidth="2"/>
                  <text x="400" y="565" textAnchor="middle" fontWeight="bold" fill="#0f172a">Optimallash algoritmi ishga tushirish</text>
                  
                  {/* Flow arrow */}
                  <line x1="400" y1="590" x2="400" y2="620" stroke="#64748b" strokeWidth="2"/>
                  <polygon points="395,620 405,620 400,630" fill="#64748b"/>
                  
                  {/* Solution evaluation */}
                  <rect x="300" y="630" width="200" height="60" rx="0" fill="#dbeafe" stroke="#0c4a6e" strokeWidth="2"/>
                  <text x="400" y="665" textAnchor="middle" fontWeight="bold" fill="#0f172a">Yechim sifatini baholash</text>
                  
                  {/* Flow arrow to decision */}
                  <line x1="400" y1="690" x2="400" y2="720" stroke="#64748b" strokeWidth="2"/>
                  <polygon points="395,720 405,720 400,730" fill="#64748b"/>
                  
                  {/* Decision: Is solution acceptable? */}
                  <polygon points="300,730 500,730 450,790 350,790" fill="#dbeafe" stroke="#0c4a6e" strokeWidth="2"/>
                  <text x="400" y="760" textAnchor="middle" fontWeight="bold" fill="#0f172a">Yechim qoniqarlimi?</text>
                  
                  {/* No path */}
                  <line x1="300" y1="760" x2="150" y2="760" stroke="#64748b" strokeWidth="2"/>
                  <polygon points="160,755 150,760 160,765" fill="#64748b"/>
                  <text x="230" y="750" textAnchor="middle" fontSize="12" fill="#ef4444">Yo'q</text>
                  
                  {/* Adjust parameters */}
                  <rect x="50" y="730" width="100" height="60" rx="0" fill="#fee2e2" stroke="#7f1d1d" strokeWidth="2"/>
                  <text x="100" y="753" textAnchor="middle" fontWeight="bold" fill="#0f172a" fontSize="10">Parametrlarni</text>
                  <text x="100" y="768" textAnchor="middle" fontWeight="bold" fill="#0f172a" fontSize="10">sozlash</text>
                  
                  {/* Return arrow */}
                  <line x1="50" y1="730" x2="50" y2="460" stroke="#64748b" strokeWidth="2"/>
                  <line x1="50" y1="460" x2="300" y2="460" stroke="#64748b" strokeWidth="2"/>
                  <polygon points="290,455 300,460 290,465" fill="#64748b"/>
                  
                  {/* Yes path */}
                  <line x1="500" y1="760" x2="650" y2="760" stroke="#64748b" strokeWidth="2"/>
                  <polygon points="640,755 650,760 640,765" fill="#64748b"/>
                  <text x="570" y="750" textAnchor="middle" fontSize="12" fill="#16a34a">Ha</text>
                  
                  {/* Apply solution */}
                  <rect x="650" y="730" width="100" height="60" rx="0" fill="#dcfce7" stroke="#166534" strokeWidth="2"/>
                  <text x="700" y="755" textAnchor="middle" fontWeight="bold" fill="#0f172a" fontSize="10">Yechimni</text>
                  <text x="700" y="770" textAnchor="middle" fontWeight="bold" fill="#0f172a" fontSize="10">qo'llash</text>
                  
                </svg>
              </div>
              
              <div className="p-4 bg-slate-50 mt-4 rounded-md">
                <h3 className="font-medium text-lg mb-2">Suv resurslarini optimallash algoritmi tushuntirishi:</h3>
                <p className="mb-2">Cheklangan suv resurlaridan eng samarali foydalanish uchun murakkab optimallash algoritmi qo'llaniladi:</p>
                
                <ol className="list-decimal list-inside space-y-1 ml-2">
                  <li><span className="font-medium">Mavjud resurslarni aniqlash:</span> Suv omborlaridagi suv miqdori, suv oqimi va mavjud suv zahiralarini aniqlash</li>
                  <li><span className="font-medium">Talablar va ehtiyojlarni aniqlash:</span> Turli foydalanuvchilar, ekinlar va hududlar bo'yicha suv ehtiyojlarini aniqlash</li>
                  <li><span className="font-medium">Ustuvorliklarni belgilash:</span> Suv taqsimotida ustuvorliklarni aniqlash (ichimlik suvi, qishloq xo'jaligi, sanoat)</li>
                  <li><span className="font-medium">Matematik model yaratish:</span> Maqsad funksiyasi va cheklovlar tizimini yaratish</li>
                  <li><span className="font-medium">Optimallash algoritmi ishga tushirish:</span> Chiziqli dasturlash, genetik algoritm yoki boshqa usullarni qo'llash</li>
                  <li><span className="font-medium">Yechim sifatini baholash:</span> Olingan yechimning samaradorligi va qoniqarliligini baholash</li>
                  <li><span className="font-medium">Parametrlarni sozlash:</span> Zarur hollarda model parametrlarini o'zgartirish</li>
                  <li><span className="font-medium">Yechimni qo'llash:</span> Optimal taqsimot rejasini tizimda aktivlashtirish</li>
                </ol>
                
                <div className="mt-4 text-sm text-gray-600">
                  <p className="font-medium">Optimallash maqsadlari:</p>
                  <ul className="list-disc list-inside ml-2">
                    <li>Suv yo'qotishlarini minimallashtirish</li>
                    <li>Foydalanuvchilar qoniqish darajasini maksimallashtirish</li>
                    <li>Hosildorlikni maksimallashtirish</li>
                    <li>Suv tanqisligini adolatli taqsimlash</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}