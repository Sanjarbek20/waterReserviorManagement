import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Download, Info, ZoomIn, ZoomOut } from "lucide-react";
import WaterManagementAlgorithm from "./suv-algorithm";

export default function IDEF0Model() {
  const [showLegend, setShowLegend] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(100);

  const increaseZoom = () => {
    if (zoomLevel < 150) setZoomLevel(zoomLevel + 10);
  };

  const decreaseZoom = () => {
    if (zoomLevel > 50) setZoomLevel(zoomLevel - 10);
  };
  
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Suv resurslari boshqarish tizimi - IDEF0 modeli</span>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={() => setShowLegend(!showLegend)}>
                {showLegend ? <ChevronUp className="h-4 w-4 mr-1" /> : <ChevronDown className="h-4 w-4 mr-1" />}
                Model haqida
              </Button>
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
          </CardTitle>
          <CardDescription>
            Tizimning turli darajalardagi IDEF0 modellari va ularning tushuntirishlari
          </CardDescription>
        </CardHeader>
        <CardContent>
          {showLegend && (
            <div className="bg-slate-50 p-4 rounded-md mb-4 text-sm">
              <h4 className="font-medium mb-2 flex items-center">
                <Info className="h-4 w-4 mr-2 text-blue-500" />
                IDEF0 modeli haqida ma'lumot
              </h4>
              <p className="mb-2">IDEF0 (Integration Definition for Function Modeling) - bu funksional modellashtirish uchun standart metodologiya. U tizimlar va biznes jarayonlarini vizual modellashtirish imkonini beradi.</p>
              <div className="grid grid-cols-2 gap-4 mt-3">
                <div>
                  <h5 className="font-medium mb-1">Asosiy elementlar:</h5>
                  <ul className="list-disc list-inside space-y-1">
                    <li><span className="font-medium">Funksiya bloki</span> - jarayon yoki amaliyot (to'rtburchak)</li>
                    <li><span className="font-medium">Kirish</span> - chap tomondan keluvchi ma'lumotlar va resurslar</li>
                    <li><span className="font-medium">Chiqish</span> - o'ng tomonga chiquvchi natijalar</li>
                    <li><span className="font-medium">Boshqaruv</span> - tepadan keluvchi qoidalar, cheklovlar</li>
                    <li><span className="font-medium">Mexanizm</span> - pastdan keluvchi resurslar va vositalar</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium mb-1">Modelni o'qish:</h5>
                  <ul className="list-disc list-inside space-y-1">
                    <li>A-0 - eng yuqori daraja, butun tizim</li>
                    <li>A0 - asosiy jarayonlar</li>
                    <li>A1, A2, ... - har bir jarayonni detallari</li>
                    <li>Har bir blok raqami (A1, A2) blok vazifasini ko'rsatadi</li>
                    <li>O'qlar va strelkalar ma'lumotlar oqimini ko'rsatadi</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
          
          <Tabs defaultValue="a0" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="a-0">A-0 (Kontekst darajasi)</TabsTrigger>
              <TabsTrigger value="a0">A0 (Asosiy jarayonlar)</TabsTrigger>
              <TabsTrigger value="a1">A1-A6 (Detallashtirilgan)</TabsTrigger>
            </TabsList>
            
            <TabsContent value="a-0" className="pt-4">
              <div className="overflow-x-auto">
                <div style={{transform: `scale(${zoomLevel/100})`, transformOrigin: 'top center'}} className="transition-transform duration-200 ease-in-out">
                  <svg width="900" height="600" viewBox="0 0 900 600" className="mx-auto">
                    {/* A-0 Title */}
                    <text x="450" y="50" textAnchor="middle" fontWeight="bold" fill="#0f172a" fontSize="20">
                      Suv resurslari boshqarish IDEF0 modeli
                    </text>
                    <text x="450" y="75" textAnchor="middle" fontWeight="bold" fill="#0f172a" fontSize="14">
                      A-0 darajasi (Kontekst)
                    </text>
                  
                    {/* Main Process Block */}
                    <rect x="350" y="200" width="200" height="120" fill="#dbeafe" stroke="#0c4a6e" strokeWidth="2" />
                    <text x="450" y="240" textAnchor="middle" fontWeight="bold" fill="#0f172a" fontSize="16">
                      Suv resurslari boshqarish
                    </text>
                    <text x="450" y="260" textAnchor="middle" fontWeight="bold" fill="#0f172a" fontSize="16">
                      tizimi
                    </text>
                    <text x="450" y="280" textAnchor="middle" fill="#0f172a" fontSize="12">A-0</text>
                  
                    {/* Input arrows */}
                    <line x1="100" y1="210" x2="350" y2="210" stroke="#0c4a6e" strokeWidth="2" />
                    <polygon points="340,205 350,210 340,215" fill="#0c4a6e" />
                    <text x="200" y="200" textAnchor="middle" fill="#0f172a" fontSize="12">Suv ombori ma'lumotlari</text>
                  
                    <line x1="100" y1="230" x2="350" y2="230" stroke="#0c4a6e" strokeWidth="2" />
                    <polygon points="340,225 350,230 340,235" fill="#0c4a6e" />
                    <text x="200" y="220" textAnchor="middle" fill="#0f172a" fontSize="12">Fermerlar talablari</text>
                  
                    <line x1="100" y1="250" x2="350" y2="250" stroke="#0c4a6e" strokeWidth="2" />
                    <polygon points="340,245 350,250 340,255" fill="#0c4a6e" />
                    <text x="200" y="270" textAnchor="middle" fill="#0f172a" fontSize="12">Suv hajmi va sarfiyot ma'lumotlari</text>
                  
                    <line x1="100" y1="290" x2="350" y2="290" stroke="#0c4a6e" strokeWidth="2" />
                    <polygon points="340,285 350,290 340,295" fill="#0c4a6e" />
                    <text x="200" y="310" textAnchor="middle" fill="#0f172a" fontSize="12">Videonazorat ma'lumotlari</text>
                    
                    {/* Control arrows (top) */}
                    <line x1="450" y1="100" x2="450" y2="200" stroke="#0c4a6e" strokeWidth="2" />
                    <polygon points="445,190 450,200 455,190" fill="#0c4a6e" />
                    <text x="450" y="90" textAnchor="middle" fill="#0f172a" fontSize="12">Qonunchilik va me'yoriy hujjatlar</text>
                  
                    <line x1="400" y1="100" x2="400" y2="200" stroke="#0c4a6e" strokeWidth="2" />
                    <polygon points="395,190 400,200 405,190" fill="#0c4a6e" />
                    <text x="400" y="120" textAnchor="middle" fill="#0f172a" fontSize="12">Ob-havo ma'lumotlari</text>
                  
                    <line x1="500" y1="100" x2="500" y2="200" stroke="#0c4a6e" strokeWidth="2" />
                    <polygon points="495,190 500,200 505,190" fill="#0c4a6e" />
                    <text x="500" y="120" textAnchor="middle" fill="#0f172a" fontSize="12">Xalqaro shartnomalar</text>
                    
                    {/* Output arrows (right) */}
                    <line x1="550" y1="210" x2="800" y2="210" stroke="#0c4a6e" strokeWidth="2" />
                    <polygon points="790,205 800,210 790,215" fill="#0c4a6e" />
                    <text x="675" y="200" textAnchor="middle" fill="#0f172a" fontSize="12">Suv taqsimot rejasi</text>
                  
                    <line x1="550" y1="240" x2="800" y2="240" stroke="#0c4a6e" strokeWidth="2" />
                    <polygon points="790,235 800,240 790,245" fill="#0c4a6e" />
                    <text x="675" y="260" textAnchor="middle" fill="#0f172a" fontSize="12">Suv sarfiyoti hisoboti</text>
                  
                    <line x1="550" y1="270" x2="800" y2="270" stroke="#0c4a6e" strokeWidth="2" />
                    <polygon points="790,265 800,270 790,275" fill="#0c4a6e" />
                    <text x="675" y="290" textAnchor="middle" fill="#0f172a" fontSize="12">Bashorat ma'lumotlari</text>
                  
                    {/* Mechanism arrows (bottom) */}
                    <line x1="380" y1="400" x2="380" y2="320" stroke="#0c4a6e" strokeWidth="2" />
                    <polygon points="375,330 380,320 385,330" fill="#0c4a6e" />
                    <text x="380" y="420" textAnchor="middle" fill="#0f172a" fontSize="12">Monitoring tizimi</text>
                  
                    <line x1="450" y1="400" x2="450" y2="320" stroke="#0c4a6e" strokeWidth="2" />
                    <polygon points="445,330 450,320 455,330" fill="#0c4a6e" />
                    <text x="450" y="420" textAnchor="middle" fill="#0f172a" fontSize="12">LSTM bashorat modeli</text>
                  
                    <line x1="520" y1="400" x2="520" y2="320" stroke="#0c4a6e" strokeWidth="2" />
                    <polygon points="515,330 520,320 525,330" fill="#0c4a6e" />
                    <text x="520" y="420" textAnchor="middle" fill="#0f172a" fontSize="12">GIS tizimi</text>
                  </svg>
                </div>
                
                <div className="mt-4 p-4 bg-blue-50 rounded border border-blue-200">
                  <h4 className="font-medium mb-2">A-0 darajasi tushuntirishi:</h4>
                  <p>Bu eng yuqori darajadagi model bo'lib, butun tizimning asosiy maqsadini ko'rsatadi. Tizim to'rt turdagi ma'lumotlarni (suv ombori, fermerlari talablari, suv hajmi va sarfiyot, videonazorat) oladi va uch turdagi natija (suv taqsimot rejasi, hisobotlar, bashorat) beradi. Tizim qonunchilik va normativlar asosida ishlaydi, hamda axborot tizimlari, monitoring uskunalari va mutaxassislar tomonidan boshqariladi.</p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="a0" className="pt-4">
              <div className="overflow-x-auto">
                <div style={{transform: `scale(${zoomLevel/100})`, transformOrigin: 'top center'}} className="transition-transform duration-200 ease-in-out">
                  <svg width="900" height="720" viewBox="0 0 900 720" className="mx-auto mt-4">
                    {/* Title */}
                    <text x="450" y="30" textAnchor="middle" fontWeight="bold" fill="#0f172a" fontSize="20">
                      Suv resurslari boshqarish tizimi tarkibi
                    </text>
                    <text x="450" y="55" textAnchor="middle" fontWeight="bold" fill="#0f172a" fontSize="14">
                      A0 darajasi dekompozitsiyasi
                    </text>
                    
                    {/* Process Block 1 - Monitoring */}
                    <rect x="200" y="150" width="150" height="100" fill="#dbeafe" stroke="#0c4a6e" strokeWidth="2" />
                    <text x="275" y="180" textAnchor="middle" fontWeight="bold" fill="#0f172a" fontSize="14">
                      Suv omborlari
                    </text>
                    <text x="275" y="200" textAnchor="middle" fontWeight="bold" fill="#0f172a" fontSize="14">
                      monitoringi
                    </text>
                    <text x="275" y="220" textAnchor="middle" fill="#0f172a" fontSize="12">A1</text>
                    
                    {/* Process Block 2 - Analysis */}
                    <rect x="400" y="150" width="150" height="100" fill="#dbeafe" stroke="#0c4a6e" strokeWidth="2" />
                    <text x="475" y="180" textAnchor="middle" fontWeight="bold" fill="#0f172a" fontSize="14">
                      Ma'lumotlarni
                    </text>
                    <text x="475" y="200" textAnchor="middle" fontWeight="bold" fill="#0f172a" fontSize="14">
                      tahlil qilish
                    </text>
                    <text x="475" y="220" textAnchor="middle" fill="#0f172a" fontSize="12">A2</text>
                    
                    {/* Process Block 3 - Prediction */}
                    <rect x="600" y="150" width="150" height="100" fill="#dbeafe" stroke="#0c4a6e" strokeWidth="2" />
                    <text x="675" y="180" textAnchor="middle" fontWeight="bold" fill="#0f172a" fontSize="14">
                      Suv sarfiyoti
                    </text>
                    <text x="675" y="200" textAnchor="middle" fontWeight="bold" fill="#0f172a" fontSize="14">
                      bashorati
                    </text>
                    <text x="675" y="220" textAnchor="middle" fill="#0f172a" fontSize="12">A3</text>
                    
                    {/* Process Block 4 - Allocation */}
                    <rect x="200" y="350" width="150" height="100" fill="#dbeafe" stroke="#0c4a6e" strokeWidth="2" />
                    <text x="275" y="380" textAnchor="middle" fontWeight="bold" fill="#0f172a" fontSize="14">
                      Suv resurslarini
                    </text>
                    <text x="275" y="400" textAnchor="middle" fontWeight="bold" fill="#0f172a" fontSize="14">
                      taqsimlash
                    </text>
                    <text x="275" y="420" textAnchor="middle" fill="#0f172a" fontSize="12">A4</text>
                    
                    {/* Process Block 5 - Control */}
                    <rect x="400" y="350" width="150" height="100" fill="#dbeafe" stroke="#0c4a6e" strokeWidth="2" />
                    <text x="475" y="380" textAnchor="middle" fontWeight="bold" fill="#0f172a" fontSize="14">
                      Suv sarfiyotini
                    </text>
                    <text x="475" y="400" textAnchor="middle" fontWeight="bold" fill="#0f172a" fontSize="14">
                      nazorat qilish
                    </text>
                    <text x="475" y="420" textAnchor="middle" fill="#0f172a" fontSize="12">A5</text>
                    
                    {/* Process Block 6 - Reporting */}
                    <rect x="600" y="350" width="150" height="100" fill="#dbeafe" stroke="#0c4a6e" strokeWidth="2" />
                    <text x="675" y="380" textAnchor="middle" fontWeight="bold" fill="#0f172a" fontSize="14">
                      Hisobotlarni
                    </text>
                    <text x="675" y="400" textAnchor="middle" fontWeight="bold" fill="#0f172a" fontSize="14">
                      shakllantirish
                    </text>
                    <text x="675" y="420" textAnchor="middle" fill="#0f172a" fontSize="12">A6</text>
                    
                    {/* Connections between blocks */}
                    <line x1="100" y1="170" x2="200" y2="170" stroke="#0c4a6e" strokeWidth="2" />
                    <polygon points="190,165 200,170 190,175" fill="#0c4a6e" />
                    <text x="150" y="160" textAnchor="middle" fill="#0f172a" fontSize="10">Suv ombori ma'lumotlari</text>
                    
                    <line x1="350" y1="170" x2="400" y2="170" stroke="#0c4a6e" strokeWidth="2" />
                    <polygon points="390,165 400,170 390,175" fill="#0c4a6e" />
                    <text x="375" y="160" textAnchor="middle" fill="#0f172a" fontSize="10">Monitoring ma'lumotlari</text>
                    
                    <line x1="550" y1="170" x2="600" y2="170" stroke="#0c4a6e" strokeWidth="2" />
                    <polygon points="590,165 600,170 590,175" fill="#0c4a6e" />
                    <text x="575" y="160" textAnchor="middle" fill="#0f172a" fontSize="10">Tahlil natijalari</text>
                    
                    <line x1="275" y1="250" x2="275" y2="350" stroke="#0c4a6e" strokeWidth="2" />
                    <polygon points="270,340 275,350 280,340" fill="#0c4a6e" />
                    <text x="295" y="300" textAnchor="middle" fill="#0f172a" fontSize="10">Suv sathi ma'lumotlari</text>
                    
                    <line x1="675" y1="250" x2="275" y2="350" stroke="#0c4a6e" strokeWidth="2" strokeDasharray="5,5" />
                    <polygon points="275,340 285,350 285,340" fill="#0c4a6e" />
                    <text x="475" y="290" textAnchor="middle" fill="#0f172a" fontSize="10">Bashorat ma'lumotlari</text>
                    
                    <line x1="350" y1="370" x2="400" y2="370" stroke="#0c4a6e" strokeWidth="2" />
                    <polygon points="390,365 400,370 390,375" fill="#0c4a6e" />
                    <text x="375" y="360" textAnchor="middle" fill="#0f172a" fontSize="10">Taqsimot rejasi</text>
                    
                    <line x1="550" y1="370" x2="600" y2="370" stroke="#0c4a6e" strokeWidth="2" />
                    <polygon points="590,365 600,370 590,375" fill="#0c4a6e" />
                    <text x="575" y="360" textAnchor="middle" fill="#0f172a" fontSize="10">Nazorat ma'lumotlari</text>
                    
                    <line x1="750" y1="170" x2="800" y2="170" stroke="#0c4a6e" strokeWidth="2" />
                    <polygon points="790,165 800,170 790,175" fill="#0c4a6e" />
                    <text x="775" y="160" textAnchor="middle" fill="#0f172a" fontSize="10">Bashorat natijalari</text>
                    
                    <line x1="750" y1="370" x2="800" y2="370" stroke="#0c4a6e" strokeWidth="2" />
                    <polygon points="790,365 800,370 790,375" fill="#0c4a6e" />
                    <text x="775" y="360" textAnchor="middle" fill="#0f172a" fontSize="10">Hisobotlar</text>
                  </svg>
                </div>
                
                <div className="mt-4 p-4 bg-blue-50 rounded border border-blue-200">
                  <h4 className="font-medium mb-2">A0 darajasi tushuntirishi:</h4>
                  <p>A0 darajasi butun tizimni 6 ta asosiy jarayonga bo'ladi: monitoring, tahlil, bashorat, taqsimlash, nazorat va hisobot. Har bir jarayon ma'lum ma'lumotlarni qabul qiladi va yakuniy natijani yaratishga hissa qo'shadi. Strelkalar orqali jarayonlar o'rtasidagi ma'lumotlar almashinuvini ko'rish mumkin.</p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="a1" className="pt-4">
              <WaterManagementAlgorithm />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}