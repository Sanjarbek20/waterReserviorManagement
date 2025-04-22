import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function IDEF0Model() {
  return (
    <Card className="shadow-md">
      <CardHeader className="pb-2">
        <CardTitle>Suv ombori boshqaruvi tizimi IDEF0 modeli</CardTitle>
        <CardDescription>
          Tizimning funksional strukturasi va axborot oqimlarining IDEF0 standartidagi tasviri
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="a0" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="a0">A-0 Diagramma</TabsTrigger>
            <TabsTrigger value="a0full">A0 Diagramma</TabsTrigger>
            <TabsTrigger value="a1">A1 Monitorlash</TabsTrigger>
            <TabsTrigger value="a2">A2 Taqsimot</TabsTrigger>
          </TabsList>
          
          <TabsContent value="a0" className="space-y-4 mt-4">
            <div className="border p-4 rounded-md bg-slate-50">
              <h3 className="text-lg font-medium mb-2 text-center">Tizimning yuqori darajadagi IDEF0 diagrammasi (A-0)</h3>
              <p className="text-sm text-gray-500 mb-4 text-center">
                Butun suv ombori boshqaruv tizimining asosiy kirish/chiqish parametrlari
              </p>
              
              <div className="w-full overflow-x-auto mb-4 flex justify-center">
                <svg width="800" height="500" viewBox="0 0 800 500" className="mx-auto">
                  {/* Asosiy IDEF0 to'rtburchak */}
                  <rect x="250" y="150" width="300" height="200" rx="0" fill="#f8fafc" stroke="#0c4a6e" strokeWidth="3" />
                  <text x="400" y="250" textAnchor="middle" fontSize="20" fontWeight="bold" fill="#0f172a">
                    Suv ombori boshqaruvi
                  </text>
                  <text x="400" y="280" textAnchor="middle" fontSize="12" fill="#0f172a">A-0</text>
                  
                  {/* Kirishlar */}
                  <line x1="150" y1="200" x2="250" y2="200" stroke="#0c4a6e" strokeWidth="2" />
                  <polygon points="240,195 250,200 240,205" fill="#0c4a6e" />
                  <text x="190" y="190" textAnchor="middle" fontSize="12" fill="#0f172a">Sensor ma'lumotlari</text>
                  
                  <line x1="150" y1="250" x2="250" y2="250" stroke="#0c4a6e" strokeWidth="2" />
                  <polygon points="240,245 250,250 240,255" fill="#0c4a6e" />
                  <text x="190" y="240" textAnchor="middle" fontSize="12" fill="#0f172a">Fermerlar so'rovlari</text>
                  
                  <line x1="150" y1="300" x2="250" y2="300" stroke="#0c4a6e" strokeWidth="2" />
                  <polygon points="240,295 250,300 240,305" fill="#0c4a6e" />
                  <text x="190" y="290" textAnchor="middle" fontSize="12" fill="#0f172a">Ob-havo ma'lumotlari</text>
                  
                  {/* Nazorat (Control) */}
                  <line x1="320" y1="100" x2="320" y2="150" stroke="#0c4a6e" strokeWidth="2" />
                  <polygon points="315,140 325,140 320,150" fill="#0c4a6e" />
                  <text x="320" y="90" textAnchor="middle" fontSize="12" fill="#0f172a">Qonunlar va tartiblar</text>
                  
                  <line x1="400" y1="100" x2="400" y2="150" stroke="#0c4a6e" strokeWidth="2" />
                  <polygon points="395,140 405,140 400,150" fill="#0c4a6e" />
                  <text x="400" y="90" textAnchor="middle" fontSize="12" fill="#0f172a">Standartlar</text>
                  
                  <line x1="480" y1="100" x2="480" y2="150" stroke="#0c4a6e" strokeWidth="2" />
                  <polygon points="475,140 485,140 480,150" fill="#0c4a6e" />
                  <text x="480" y="90" textAnchor="middle" fontSize="12" fill="#0f172a">Boshqaruv qarorlari</text>
                  
                  {/* Chiqishlar */}
                  <line x1="550" y1="200" x2="650" y2="200" stroke="#0c4a6e" strokeWidth="2" />
                  <polygon points="640,195 650,200 640,205" fill="#0c4a6e" />
                  <text x="600" y="190" textAnchor="middle" fontSize="12" fill="#0f172a">Monitoring hisobotlari</text>
                  
                  <line x1="550" y1="250" x2="650" y2="250" stroke="#0c4a6e" strokeWidth="2" />
                  <polygon points="640,245 650,250 640,255" fill="#0c4a6e" />
                  <text x="600" y="240" textAnchor="middle" fontSize="12" fill="#0f172a">Suv taqsimoti jadvali</text>
                  
                  <line x1="550" y1="300" x2="650" y2="300" stroke="#0c4a6e" strokeWidth="2" />
                  <polygon points="640,295 650,300 640,305" fill="#0c4a6e" />
                  <text x="600" y="290" textAnchor="middle" fontSize="12" fill="#0f172a">Bashorat natijasi</text>
                  
                  {/* Mexanizm/Resurslar */}
                  <line x1="320" y1="350" x2="320" y2="400" stroke="#0c4a6e" strokeWidth="2" />
                  <polygon points="315,360 325,360 320,350" fill="#0c4a6e" />
                  <text x="320" y="415" textAnchor="middle" fontSize="12" fill="#0f172a">LSTM modellari</text>
                  
                  <line x1="400" y1="350" x2="400" y2="400" stroke="#0c4a6e" strokeWidth="2" />
                  <polygon points="395,360 405,360 400,350" fill="#0c4a6e" />
                  <text x="400" y="415" textAnchor="middle" fontSize="12" fill="#0f172a">Ma'lumotlar bazasi</text>
                  
                  <line x1="480" y1="350" x2="480" y2="400" stroke="#0c4a6e" strokeWidth="2" />
                  <polygon points="475,360 485,360 480,350" fill="#0c4a6e" />
                  <text x="480" y="415" textAnchor="middle" fontSize="12" fill="#0f172a">Xodimlar</text>
                </svg>
              </div>
              
              <div className="prose prose-blue max-w-none">
                <h4>A-0 yuqori darajali diagramma tushuntirishi:</h4>
                <p>
                  Bu diagramma butun suv ombori boshqaruv tizimining asosiy funksiyasini ko'rsatadi. 
                  Unda quyidagi elementlar mavjud:
                </p>
                
                <ul className="list-disc pl-5">
                  <li><strong>Kiruvchi ma'lumotlar (Inputs):</strong> Tizimga kirib keluvchi dastlabki ma'lumotlar</li>
                  <ul className="list-disc pl-5">
                    <li>Sensorlardan olingan ma'lumotlar</li>
                    <li>Fermerlarning suv so'rovlari</li>
                    <li>Ob-havo ma'lumotlari</li>
                  </ul>
                  
                  <li><strong>Nazorat (Controls):</strong> Jarayonni boshqaruvchi ko'rsatmalar va cheklovlar</li>
                  <ul className="list-disc pl-5">
                    <li>Qonunlar va tartiblar</li>
                    <li>Texnik standartlar</li>
                    <li>Boshqaruv qarorlari</li>
                  </ul>
                  
                  <li><strong>Chiquvchi ma'lumotlar (Outputs):</strong> Tizim ishidan olingan natijalar</li>
                  <ul className="list-disc pl-5">
                    <li>Monitoring hisobotlari</li>
                    <li>Suv taqsimoti jadvali</li>
                    <li>Bashorat natijasi</li>
                  </ul>
                  
                  <li><strong>Mexanizmlar (Mechanisms):</strong> Ishni bajarish uchun zarur resurslar</li>
                  <ul className="list-disc pl-5">
                    <li>LSTM modellar</li>
                    <li>Ma'lumotlar bazasi</li>
                    <li>Tizim xodimlari</li>
                  </ul>
                </ul>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="a0full" className="space-y-4 mt-4">
            <div className="border p-4 rounded-md bg-slate-50">
              <h3 className="text-lg font-medium mb-2 text-center">A0 diagramma - Asosiy funksional bloklar</h3>
              <p className="text-sm text-gray-500 mb-4 text-center">
                Suv ombori boshqaruv tizimi asosiy funksiyalari
              </p>
              
              <div className="w-full overflow-x-auto mb-4 flex justify-center">
                <svg width="800" height="700" viewBox="0 0 800 700" className="mx-auto">
                  {/* Kirishlar */}
                  <line x1="50" y1="150" x2="200" y2="150" stroke="#0c4a6e" strokeWidth="2" />
                  <polygon points="190,145 200,150 190,155" fill="#0c4a6e" />
                  <text x="125" y="140" textAnchor="middle" fontSize="12" fill="#0f172a">Sensor ma'lumotlari</text>
                  
                  <line x1="50" y1="350" x2="200" y2="350" stroke="#0c4a6e" strokeWidth="2" />
                  <polygon points="190,345 200,350 190,355" fill="#0c4a6e" />
                  <text x="125" y="340" textAnchor="middle" fontSize="12" fill="#0f172a">Fermerlar so'rovlari</text>
                  
                  <line x1="50" y1="450" x2="200" y2="450" stroke="#0c4a6e" strokeWidth="2" />
                  <polygon points="190,445 200,450 190,455" fill="#0c4a6e" />
                  <text x="125" y="440" textAnchor="middle" fontSize="12" fill="#0f172a">Ob-havo ma'lumotlari</text>
                  
                  {/* Nazorat */}
                  <line x1="300" y1="50" x2="300" y2="100" stroke="#0c4a6e" strokeWidth="2" />
                  <polygon points="295,90 305,90 300,100" fill="#0c4a6e" />
                  <text x="300" y="40" textAnchor="middle" fontSize="12" fill="#0f172a">Qonunlar va standartlar</text>
                  
                  <line x1="500" y1="50" x2="500" y2="100" stroke="#0c4a6e" strokeWidth="2" />
                  <polygon points="495,90 505,90 500,100" fill="#0c4a6e" />
                  <text x="500" y="40" textAnchor="middle" fontSize="12" fill="#0f172a">Boshqaruv qarorlari</text>
                  
                  {/* A1: Monitorlash bloki */}
                  <rect x="200" y="100" width="200" height="100" rx="0" fill="#dbeafe" stroke="#0c4a6e" strokeWidth="2" />
                  <text x="300" y="140" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#0f172a">
                    Monitorlash
                  </text>
                  <text x="300" y="165" textAnchor="middle" fontSize="12" fill="#0f172a">A1</text>
                  
                  {/* A2: Tahlil qilish bloki */}
                  <rect x="200" y="250" width="200" height="100" rx="0" fill="#dbeafe" stroke="#0c4a6e" strokeWidth="2" />
                  <text x="300" y="290" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#0f172a">
                    Tahlil qilish
                  </text>
                  <text x="300" y="315" textAnchor="middle" fontSize="12" fill="#0f172a">A2</text>
                  
                  {/* A3: Taqsimot bloki */}
                  <rect x="200" y="400" width="200" height="100" rx="0" fill="#e0f2fe" stroke="#0c4a6e" strokeWidth="2" />
                  <text x="300" y="440" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#0f172a">
                    Taqsimot
                  </text>
                  <text x="300" y="465" textAnchor="middle" fontSize="12" fill="#0f172a">A3</text>
                  
                  {/* A4: Bashorat qilish bloki */}
                  <rect x="450" y="250" width="200" height="100" rx="0" fill="#dbeafe" stroke="#0c4a6e" strokeWidth="2" />
                  <text x="550" y="290" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#0f172a">
                    Bashorat qilish
                  </text>
                  <text x="550" y="315" textAnchor="middle" fontSize="12" fill="#0f172a">A4</text>
                  
                  {/* A5: Xavfsizlikni ta'minlash bloki */}
                  <rect x="450" y="400" width="200" height="100" rx="0" fill="#fee2e2" stroke="#0c4a6e" strokeWidth="2" />
                  <text x="550" y="440" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#0f172a">
                    Xavfsizlikni ta'minlash
                  </text>
                  <text x="550" y="465" textAnchor="middle" fontSize="12" fill="#0f172a">A5</text>
                  
                  {/* Chiqishlar */}
                  <line x1="400" y1="150" x2="700" y2="150" stroke="#0c4a6e" strokeWidth="2" />
                  <polygon points="690,145 700,150 690,155" fill="#0c4a6e" />
                  <text x="550" y="140" textAnchor="middle" fontSize="12" fill="#0f172a">Monitoring hisobotlari</text>
                  
                  <line x1="400" y1="450" x2="700" y2="450" stroke="#0c4a6e" strokeWidth="2" />
                  <polygon points="690,445 700,450 690,455" fill="#0c4a6e" />
                  <text x="690" y="440" textAnchor="middle" fontSize="12" fill="#0f172a">Suv taqsimoti jadvali</text>
                  
                  <line x1="650" y1="300" x2="700" y2="300" stroke="#0c4a6e" strokeWidth="2" />
                  <polygon points="690,295 700,300 690,305" fill="#0c4a6e" />
                  <text x="675" y="290" textAnchor="middle" fontSize="12" fill="#0f172a">Bashorat natijasi</text>
                  
                  {/* Mexanizmlar */}
                  <line x1="250" y1="500" x2="250" y2="550" stroke="#0c4a6e" strokeWidth="2" />
                  <polygon points="245,510 255,510 250,500" fill="#0c4a6e" />
                  <text x="250" y="565" textAnchor="middle" fontSize="12" fill="#0f172a">Ma'lumotlar bazasi</text>
                  
                  <line x1="350" y1="500" x2="350" y2="550" stroke="#0c4a6e" strokeWidth="2" />
                  <polygon points="345,510 355,510 350,500" fill="#0c4a6e" />
                  <text x="350" y="565" textAnchor="middle" fontSize="12" fill="#0f172a">LSTM modellar</text>
                  
                  <line x1="550" y1="500" x2="550" y2="550" stroke="#0c4a6e" strokeWidth="2" />
                  <polygon points="545,510 555,510 550,500" fill="#0c4a6e" />
                  <text x="550" y="565" textAnchor="middle" fontSize="12" fill="#0f172a">Xodimlar</text>
                  
                  {/* Ichki bog'lanishlar */}
                  <line x1="300" y1="200" x2="300" y2="250" stroke="#64748b" strokeWidth="2" />
                  <polygon points="295,240 305,240 300,250" fill="#64748b" />
                  <text x="330" y="225" textAnchor="middle" fontSize="12" fill="#475569">Ma'lumotlar</text>
                  
                  <line x1="300" y1="350" x2="300" y2="400" stroke="#64748b" strokeWidth="2" />
                  <polygon points="295,390 305,390 300,400" fill="#64748b" />
                  <text x="330" y="375" textAnchor="middle" fontSize="12" fill="#475569">Tahlil natijasi</text>
                  
                  <line x1="400" y1="300" x2="450" y2="300" stroke="#64748b" strokeWidth="2" />
                  <polygon points="440,295 450,300 440,305" fill="#64748b" />
                  <text x="425" y="285" textAnchor="middle" fontSize="12" fill="#475569">Tarixiy ma'lumotlar</text>
                  
                  <line x1="550" y1="350" x2="550" y2="400" stroke="#64748b" strokeWidth="2" />
                  <polygon points="545,390 555,390 550,400" fill="#64748b" />
                  <text x="580" y="375" textAnchor="middle" fontSize="12" fill="#475569">Toshqin xavfi</text>
                  
                  <path d="M 400,440 C 450,440 450,300 400,300" fill="none" stroke="#64748b" strokeWidth="2" />
                  <polygon points="405,300 400,290 395,300" fill="#64748b" />
                  <text x="435" y="380" textAnchor="middle" fontSize="12" fill="#475569">So'rov natijalari</text>
                </svg>
              </div>
              
              <div className="prose prose-blue max-w-none">
                <h4>A0 diagramma tushuntirishi:</h4>
                <p>
                  A0 diagramma suv ombori boshqaruv tizimining asosiy funksional bloklarini ko'rsatadi:
                </p>
                
                <ul className="list-disc pl-5">
                  <li><strong>A1: Monitorlash</strong> - Suv omboridan sensorlar orqali olingan ma'lumotlarni olish va kuzatish</li>
                  <li><strong>A2: Tahlil qilish</strong> - Yig'ilgan ma'lumotlarni tahlil qilish va qarorlar uchun tayyorlash</li>
                  <li><strong>A3: Taqsimot</strong> - Suv resurslarini fermerlar orasida optimal taqsimlash</li>
                  <li><strong>A4: Bashorat qilish</strong> - LSTM modellar orqali kelajakdagi suv sarfi va sathini bashorat qilish</li>
                  <li><strong>A5: Xavfsizlikni ta'minlash</strong> - Toshqin va boshqa xavflarni oldini olish</li>
                </ul>
                
                <p>
                  Diagrammada bloklarning bir-biri bilan bog'liqligi, shuningdek ularning nazorat 
                  mexanizmlari va foydalaniladigan resurslar ko'rsatilgan.
                </p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="a1" className="space-y-4 mt-4">
            <div className="border p-4 rounded-md bg-slate-50">
              <h3 className="text-lg font-medium mb-2 text-center">A1 diagramma - Monitorlash jarayoni</h3>
              <p className="text-sm text-gray-500 mb-4 text-center">
                Suv omborlarini monitorlash uchun tizim funksiyalari
              </p>
              
              <div className="w-full overflow-x-auto mb-4 flex justify-center">
                <svg width="800" height="600" viewBox="0 0 800 600" className="mx-auto">
                  {/* Nazorat */}
                  <line x1="300" y1="50" x2="300" y2="100" stroke="#0c4a6e" strokeWidth="2" />
                  <polygon points="295,90 305,90 300,100" fill="#0c4a6e" />
                  <text x="300" y="40" textAnchor="middle" fontSize="12" fill="#0f172a">Standartlar</text>
                  
                  {/* Kirishlar */}
                  <line x1="50" y1="150" x2="200" y2="150" stroke="#0c4a6e" strokeWidth="2" />
                  <polygon points="190,145 200,150 190,155" fill="#0c4a6e" />
                  <text x="125" y="140" textAnchor="middle" fontSize="12" fill="#0f172a">Sensor ma'lumotlari</text>
                  
                  {/* A11: Ma'lumotlarni yig'ish bloki */}
                  <rect x="200" y="100" width="200" height="100" rx="0" fill="#dbeafe" stroke="#0c4a6e" strokeWidth="2" />
                  <text x="300" y="140" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#0f172a">
                    Ma'lumotlarni yig'ish
                  </text>
                  <text x="300" y="165" textAnchor="middle" fontSize="12" fill="#0f172a">A11</text>
                  
                  {/* A12: Ma'lumotlarni normalizatsiya qilish */}
                  <rect x="200" y="250" width="200" height="100" rx="0" fill="#dbeafe" stroke="#0c4a6e" strokeWidth="2" />
                  <text x="300" y="290" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#0f172a">
                    Ma'lumotlarni normalizatsiya
                  </text>
                  <text x="300" y="315" textAnchor="middle" fontSize="12" fill="#0f172a">A12</text>
                  
                  {/* A13: Anomaliyalarni aniqlash */}
                  <rect x="200" y="400" width="200" height="100" rx="0" fill="#dbeafe" stroke="#0c4a6e" strokeWidth="2" />
                  <text x="300" y="440" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#0f172a">
                    Anomaliyalarni aniqlash
                  </text>
                  <text x="300" y="465" textAnchor="middle" fontSize="12" fill="#0f172a">A13</text>
                  
                  {/* A14: Hisobotlarni shakllantirish */}
                  <rect x="500" y="250" width="200" height="100" rx="0" fill="#dbeafe" stroke="#0c4a6e" strokeWidth="2" />
                  <text x="600" y="290" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#0f172a">
                    Hisobotlarni shakllantirish
                  </text>
                  <text x="600" y="315" textAnchor="middle" fontSize="12" fill="#0f172a">A14</text>
                  
                  {/* Ichki bog'lanishlar */}
                  <line x1="300" y1="200" x2="300" y2="250" stroke="#64748b" strokeWidth="2" />
                  <polygon points="295,240 305,240 300,250" fill="#64748b" />
                  <text x="330" y="225" textAnchor="middle" fontSize="12" fill="#475569">Xom ma'lumotlar</text>
                  
                  <line x1="300" y1="350" x2="300" y2="400" stroke="#64748b" strokeWidth="2" />
                  <polygon points="295,390 305,390 300,400" fill="#64748b" />
                  <text x="330" y="375" textAnchor="middle" fontSize="12" fill="#475569">Normalizatsiya qilingan</text>
                  
                  <line x1="400" y1="300" x2="500" y2="300" stroke="#64748b" strokeWidth="2" />
                  <polygon points="490,295 500,300 490,305" fill="#64748b" />
                  <text x="450" y="285" textAnchor="middle" fontSize="12" fill="#475569">Tayyor ma'lumotlar</text>
                  
                  <line x1="400" y1="450" x2="680" y2="450" stroke="#64748b" strokeWidth="2" />
                  <line x1="680" y1="450" x2="680" y2="300" stroke="#64748b" strokeWidth="2" />
                  <polygon points="675,310 685,310 680,300" fill="#64748b" />
                  <text x="680" y="375" textAnchor="middle" fontSize="12" fill="#475569">Anomaliya haqida xabar</text>
                  
                  {/* Chiqishlar */}
                  <line x1="700" y1="300" x2="750" y2="300" stroke="#0c4a6e" strokeWidth="2" />
                  <polygon points="740,295 750,300 740,305" fill="#0c4a6e" />
                  <text x="725" y="290" textAnchor="middle" fontSize="12" fill="#0f172a">Monitoring hisobotlari</text>
                  
                  {/* Mexanizmlar */}
                  <line x1="250" y1="500" x2="250" y2="550" stroke="#0c4a6e" strokeWidth="2" />
                  <polygon points="245,510 255,510 250,500" fill="#0c4a6e" />
                  <text x="250" y="565" textAnchor="middle" fontSize="12" fill="#0f172a">Sensorlar</text>
                  
                  <line x1="350" y1="500" x2="350" y2="550" stroke="#0c4a6e" strokeWidth="2" />
                  <polygon points="345,510 355,510 350,500" fill="#0c4a6e" />
                  <text x="350" y="565" textAnchor="middle" fontSize="12" fill="#0f172a">Ma'lumotlar bazasi</text>
                  
                  <line x1="550" y1="500" x2="550" y2="550" stroke="#0c4a6e" strokeWidth="2" />
                  <polygon points="545,510 555,510 550,500" fill="#0c4a6e" />
                  <text x="550" y="565" textAnchor="middle" fontSize="12" fill="#0f172a">WebSocket server</text>
                </svg>
              </div>
              
              <div className="prose prose-blue max-w-none">
                <h4>A1 Monitorlash diagrammasi tushuntirishi:</h4>
                <p>
                  Bu diagramma monitorlash jarayonining ichki tuzilishini ko'rsatadi. Monitorlash quyidagi 
                  asosiy bosqichlardan iborat:
                </p>
                
                <ul className="list-disc pl-5">
                  <li><strong>A11: Ma'lumotlarni yig'ish</strong> - Suv omboridagi sensorlardan ma'lumotlarni olish</li>
                  <li><strong>A12: Ma'lumotlarni normalizatsiya</strong> - Xom ma'lumotlarni tozalash va standart formatga keltirish</li>
                  <li><strong>A13: Anomaliyalarni aniqlash</strong> - Kutilmagan o'zgarishlarni aniqlash va ogohlantirishlar yaratish</li>
                  <li><strong>A14: Hisobotlarni shakllantirish</strong> - Ma'lumotlar asosida hisobotlar yaratish</li>
                </ul>
                
                <p>
                  Bu jarayonda real vaqtda ma'lumotlar olinib, tahlil qilinadi va natijalar hisobotlarga
                  kiritiladi. Anomaliya aniqlanganda, maxsus xabarlar hisobotga qo'shiladi.
                </p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="a2" className="space-y-4 mt-4">
            <div className="border p-4 rounded-md bg-slate-50">
              <h3 className="text-lg font-medium mb-2 text-center">A2 diagramma - Suv taqsimoti jarayoni</h3>
              <p className="text-sm text-gray-500 mb-4 text-center">
                Fermerlar o'rtasida suv resurslarini taqsimlash jarayoni
              </p>
              
              <div className="w-full overflow-x-auto mb-4 flex justify-center">
                <svg width="800" height="600" viewBox="0 0 800 600" className="mx-auto">
                  {/* Nazorat */}
                  <line x1="300" y1="50" x2="300" y2="100" stroke="#0c4a6e" strokeWidth="2" />
                  <polygon points="295,90 305,90 300,100" fill="#0c4a6e" />
                  <text x="300" y="40" textAnchor="middle" fontSize="12" fill="#0f172a">Taqsimot qoidalari</text>
                  
                  <line x1="500" y1="50" x2="500" y2="100" stroke="#0c4a6e" strokeWidth="2" />
                  <polygon points="495,90 505,90 500,100" fill="#0c4a6e" />
                  <text x="500" y="40" textAnchor="middle" fontSize="12" fill="#0f172a">Boshqaruv qarorlari</text>
                  
                  {/* Kirishlar */}
                  <line x1="50" y1="150" x2="200" y2="150" stroke="#0c4a6e" strokeWidth="2" />
                  <polygon points="190,145 200,150 190,155" fill="#0c4a6e" />
                  <text x="125" y="140" textAnchor="middle" fontSize="12" fill="#0f172a">Fermerlar so'rovlari</text>
                  
                  <line x1="50" y1="300" x2="200" y2="300" stroke="#0c4a6e" strokeWidth="2" />
                  <polygon points="190,295 200,300 190,305" fill="#0c4a6e" />
                  <text x="125" y="290" textAnchor="middle" fontSize="12" fill="#0f172a">Monitoring ma'lumotlari</text>
                  
                  {/* A21: So'rovlarni qayta ishlash */}
                  <rect x="200" y="100" width="200" height="100" rx="0" fill="#e0f2fe" stroke="#0c4a6e" strokeWidth="2" />
                  <text x="300" y="140" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#0f172a">
                    So'rovlarni qayta ishlash
                  </text>
                  <text x="300" y="165" textAnchor="middle" fontSize="12" fill="#0f172a">A21</text>
                  
                  {/* A22: Resurslari tekshirish */}
                  <rect x="200" y="250" width="200" height="100" rx="0" fill="#e0f2fe" stroke="#0c4a6e" strokeWidth="2" />
                  <text x="300" y="290" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#0f172a">
                    Mavjud suv resurslarini tekshirish
                  </text>
                  <text x="300" y="315" textAnchor="middle" fontSize="12" fill="#0f172a">A22</text>
                  
                  {/* A23: Taqsimot algoritmini hisoblash */}
                  <rect x="500" y="250" width="200" height="100" rx="0" fill="#e0f2fe" stroke="#0c4a6e" strokeWidth="2" />
                  <text x="600" y="290" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#0f172a">
                    Taqsimot algoritmini hisoblash
                  </text>
                  <text x="600" y="315" textAnchor="middle" fontSize="12" fill="#0f172a">A23</text>
                  
                  {/* A24: Taqsimot jadvalini yaratish */}
                  <rect x="500" y="400" width="200" height="100" rx="0" fill="#e0f2fe" stroke="#0c4a6e" strokeWidth="2" />
                  <text x="600" y="440" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#0f172a">
                    Taqsimot jadvalini yaratish
                  </text>
                  <text x="600" y="465" textAnchor="middle" fontSize="12" fill="#0f172a">A24</text>
                  
                  {/* Ichki bog'lanishlar */}
                  <line x1="300" y1="200" x2="300" y2="250" stroke="#64748b" strokeWidth="2" />
                  <polygon points="295,240 305,240 300,250" fill="#64748b" />
                  <text x="330" y="225" textAnchor="middle" fontSize="12" fill="#475569">So'rov ma'lumotlari</text>
                  
                  <line x1="400" y1="300" x2="500" y2="300" stroke="#64748b" strokeWidth="2" />
                  <polygon points="490,295 500,300 490,305" fill="#64748b" />
                  <text x="450" y="285" textAnchor="middle" fontSize="12" fill="#475569">Mavjud suv miqdori</text>
                  
                  <line x1="600" y1="350" x2="600" y2="400" stroke="#64748b" strokeWidth="2" />
                  <polygon points="595,390 605,390 600,400" fill="#64748b" />
                  <text x="630" y="375" textAnchor="middle" fontSize="12" fill="#475569">Taqsimot algoritmi</text>
                  
                  {/* Chiqishlar */}
                  <line x1="700" y1="450" x2="750" y2="450" stroke="#0c4a6e" strokeWidth="2" />
                  <polygon points="740,445 750,450 740,455" fill="#0c4a6e" />
                  <text x="725" y="440" textAnchor="middle" fontSize="12" fill="#0f172a">Suv taqsimoti jadvali</text>
                  
                  {/* Mexanizmlar */}
                  <line x1="250" y1="500" x2="250" y2="550" stroke="#0c4a6e" strokeWidth="2" />
                  <polygon points="245,510 255,510 250,500" fill="#0c4a6e" />
                  <text x="250" y="565" textAnchor="middle" fontSize="12" fill="#0f172a">Ma'lumotlar bazasi</text>
                  
                  <line x1="600" y1="500" x2="600" y2="550" stroke="#0c4a6e" strokeWidth="2" />
                  <polygon points="595,510 605,510 600,500" fill="#0c4a6e" />
                  <text x="600" y="565" textAnchor="middle" fontSize="12" fill="#0f172a">Optimizatsiya algoritmlari</text>
                </svg>
              </div>
              
              <div className="prose prose-blue max-w-none">
                <h4>A3 Taqsimot diagrammasi tushuntirishi:</h4>
                <p>
                  Bu diagramma suv taqsimoti jarayonining ichki tuzilishini ko'rsatadi. Suv taqsimoti 
                  quyidagi asosiy bosqichlardan iborat:
                </p>
                
                <ul className="list-disc pl-5">
                  <li><strong>A21: So'rovlarni qayta ishlash</strong> - Fermerlardan keladigan suv so'rovlarini qabul qilish va tekshirish</li>
                  <li><strong>A22: Mavjud suv resurslarini tekshirish</strong> - Suv omborida mavjud suvlarni hisobga olish</li>
                  <li><strong>A23: Taqsimot algoritmini hisoblash</strong> - Ekin turlari, maydon hajmi, sug'orish usuli kabi omillarni inobatga olib, optimal suv taqsimotini hisoblash</li>
                  <li><strong>A24: Taqsimot jadvalini yaratish</strong> - Hisoblangan suv taqsimoti asosida fermerlar uchun suv ajratish jadvalini yaratish</li>
                </ul>
                
                <p>
                  Bu jarayonda suv ombori tizimi, barcha fermerlarga optimal va adolatli suv taqsimotini hisoblab chiqadi 
                  va reja asosida suv beriladi. Bu ayniqsa suv tanqis bo'lgan mavsumda muhim hisoblanadi.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}