import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut, Download, Info } from "lucide-react";

export default function SystemAlgorithm() {
  const [zoomLevel, setZoomLevel] = useState(100);
  const [showDetail, setShowDetail] = useState<string | null>(null);

  const increaseZoom = () => {
    if (zoomLevel < 150) setZoomLevel(zoomLevel + 10);
  };

  const decreaseZoom = () => {
    if (zoomLevel > 50) setZoomLevel(zoomLevel - 10);
  };
  
  const toggleDetail = (id: string) => {
    if (showDetail === id) {
      setShowDetail(null);
    } else {
      setShowDetail(id);
    }
  };
  
  return (
    <Card className="shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl">Suv resurslari boshqarish tizimi ishlash algoritmi</CardTitle>
            <CardDescription>Tizimning umumiy ishlash prinsipi va komponentlar o'rtasidagi aloqalar</CardDescription>
          </div>
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
      </CardHeader>
      <CardContent>
        <div style={{transform: `scale(${zoomLevel/100})`, transformOrigin: 'top center'}} 
             className="w-full overflow-x-auto transition-transform duration-200 ease-in-out">
          <svg width="900" height="900" viewBox="0 0 900 900" className="mx-auto">
            {/* Sarlavha */}
            <text x="450" y="40" textAnchor="middle" fontWeight="bold" fill="#0f172a" fontSize="24">
              Suv resurslari boshqarish tizimi
            </text>
            <text x="450" y="70" textAnchor="middle" fill="#64748b" fontSize="16">
              Umumiy tizim algoritmi
            </text>
            
            {/* Foydalanuvchi interfeysi (front-end) */}
            <rect x="50" y="120" width="800" height="100" rx="5" fill="#f1f5f9" stroke="#64748b" strokeWidth="2" />
            <text x="450" y="150" textAnchor="middle" fontWeight="bold" fill="#0f172a" fontSize="18">
              Foydalanuvchi interfeysi (Front-end)
            </text>
            <text x="450" y="180" textAnchor="middle" fill="#64748b" fontSize="14">
              Suv omborlari monitoringi, boshqaruv paneli, xaritalar, ma'lumotlar vizualizatsiyasi
            </text>
            <rect id="frontend-box" x="50" y="120" width="800" height="100" rx="5" fill="transparent" 
                  stroke="transparent" strokeWidth="2" style={{cursor: 'pointer'}} 
                  onClick={() => toggleDetail('frontend')}/>
            
            {/* Strelka - yuborib olish */}
            <line x1="450" y1="220" x2="450" y2="250" stroke="#64748b" strokeWidth="2" strokeDasharray="5,5" />
            <polygon points="445,250 455,250 450,260" fill="#64748b" />
            
            {/* API qatlami */}
            <rect x="150" y="260" width="600" height="80" rx="5" fill="#dbeafe" stroke="#2563eb" strokeWidth="2" />
            <text x="450" y="300" textAnchor="middle" fontWeight="bold" fill="#0f172a" fontSize="18">
              API va WebSocket qatlami
            </text>
            <text x="450" y="325" textAnchor="middle" fill="#64748b" fontSize="14">
              Ma'lumotlarni uzatish, real-time monitoring, autentifikatsiya
            </text>
            <rect id="api-box" x="150" y="260" width="600" height="80" rx="5" fill="transparent" 
                  stroke="transparent" strokeWidth="2" style={{cursor: 'pointer'}} 
                  onClick={() => toggleDetail('api')}/>
            
            {/* Strelka - server */}
            <line x1="450" y1="340" x2="450" y2="370" stroke="#64748b" strokeWidth="2" />
            <polygon points="445,370 455,370 450,380" fill="#64748b" />
            
            {/* Tizim logikasi */}
            <rect x="100" y="380" width="700" height="120" rx="5" fill="#e0f2fe" stroke="#0c4a6e" strokeWidth="2" />
            <text x="450" y="410" textAnchor="middle" fontWeight="bold" fill="#0f172a" fontSize="18">
              Tizim logikasi (Back-end)
            </text>
            <text x="450" y="435" textAnchor="middle" fill="#64748b" fontSize="14">
              Ma'lumotlarni qayta ishlash, biznes logikasi, xavfsizlik, ruxsatlar boshqaruvi
            </text>
            
            {/* Ichki komponentlar */}
            <rect x="130" y="445" width="180" height="40" rx="3" fill="#bae6fd" stroke="#0c4a6e" strokeWidth="1" />
            <text x="220" y="470" textAnchor="middle" fill="#0f172a" fontSize="13">
              Suv monitoringi moduli
            </text>
            
            <rect x="360" y="445" width="180" height="40" rx="3" fill="#bae6fd" stroke="#0c4a6e" strokeWidth="1" />
            <text x="450" y="470" textAnchor="middle" fill="#0f172a" fontSize="13">
              Bashorat qilish moduli
            </text>
            
            <rect x="590" y="445" width="180" height="40" rx="3" fill="#bae6fd" stroke="#0c4a6e" strokeWidth="1" />
            <text x="680" y="470" textAnchor="middle" fill="#0f172a" fontSize="13">
              Taqsimlash moduli
            </text>
            <rect id="backend-box" x="100" y="380" width="700" height="120" rx="5" fill="transparent" 
                  stroke="transparent" strokeWidth="2" style={{cursor: 'pointer'}} 
                  onClick={() => toggleDetail('backend')}/>
            
            {/* Strelkalar - yo'nalishlar */}
            <line x1="220" y1="485" x2="220" y2="530" stroke="#64748b" strokeWidth="1.5" />
            <line x1="450" y1="485" x2="450" y2="530" stroke="#64748b" strokeWidth="1.5" />
            <line x1="680" y1="485" x2="680" y2="530" stroke="#64748b" strokeWidth="1.5" />
            
            <line x1="220" y1="530" x2="450" y2="530" stroke="#64748b" strokeWidth="1.5" />
            <line x1="450" y1="530" x2="680" y2="530" stroke="#64748b" strokeWidth="1.5" />
            <line x1="450" y1="530" x2="450" y2="550" stroke="#64748b" strokeWidth="1.5" />
            <polygon points="445,550 455,550 450,560" fill="#64748b" />
            
            {/* Ma'lumotlar bazasi qatlami */}
            <rect x="150" y="560" width="600" height="80" rx="5" fill="#d8b4fe" stroke="#7e22ce" strokeWidth="2" />
            <text x="450" y="595" textAnchor="middle" fontWeight="bold" fill="#0f172a" fontSize="18">
              Ma'lumotlar bazasi qatlami
            </text>
            <text x="450" y="620" textAnchor="middle" fill="#64748b" fontSize="14">
              PostgreSQL, foydalanuvchilar, suv omborlari, taqsimot ma'lumotlari
            </text>
            <rect id="db-box" x="150" y="560" width="600" height="80" rx="5" fill="transparent" 
                  stroke="transparent" strokeWidth="2" style={{cursor: 'pointer'}} 
                  onClick={() => toggleDetail('db')}/>
            
            {/* Strelka - tashqi tizimlar */}
            <line x1="450" y1="640" x2="450" y2="670" stroke="#64748b" strokeWidth="2" strokeDasharray="5,5" />
            <polygon points="445,670 455,670 450,680" fill="#64748b" />
            
            {/* Tashqi tizimlar */}
            <rect x="50" y="680" width="800" height="100" rx="5" fill="#fee2e2" stroke="#ef4444" strokeWidth="2" />
            <text x="450" y="710" textAnchor="middle" fontWeight="bold" fill="#0f172a" fontSize="18">
              Tashqi tizimlar va integratsiyalar
            </text>
            <text x="450" y="740" textAnchor="middle" fill="#64748b" fontSize="14">
              Ob-havo ma'lumotlari API, GIS tizimi, video monitoring, IoT sensorlar
            </text>
            <rect id="external-box" x="50" y="680" width="800" height="100" rx="5" fill="transparent" 
                  stroke="transparent" strokeWidth="2" style={{cursor: 'pointer'}} 
                  onClick={() => toggleDetail('external')}/>
            
            {/* Legenda */}
            <rect x="710" y="800" width="180" height="80" rx="3" fill="#f8fafc" stroke="#94a3b8" strokeWidth="1" />
            <text x="800" y="820" textAnchor="middle" fontWeight="bold" fill="#64748b" fontSize="12">
              Legenda
            </text>
            
            <rect x="720" y="830" width="15" height="10" fill="#f1f5f9" stroke="#64748b" strokeWidth="1" />
            <text x="780" y="838" textAnchor="middle" fill="#64748b" fontSize="10">Foydalanuvchi interfeysi</text>
            
            <rect x="720" y="845" width="15" height="10" fill="#dbeafe" stroke="#2563eb" strokeWidth="1" />
            <text x="780" y="853" textAnchor="middle" fill="#64748b" fontSize="10">API va WebSocket</text>
            
            <rect x="720" y="860" width="15" height="10" fill="#e0f2fe" stroke="#0c4a6e" strokeWidth="1" />
            <text x="780" y="868" textAnchor="middle" fill="#64748b" fontSize="10">Tizim logikasi</text>
            
            <rect x="720" y="875" width="15" height="10" fill="#d8b4fe" stroke="#7e22ce" strokeWidth="1" />
            <text x="780" y="883" textAnchor="middle" fill="#64748b" fontSize="10">Ma'lumotlar bazasi</text>

            <rect x="720" y="890" width="15" height="10" fill="#fee2e2" stroke="#ef4444" strokeWidth="1" />
            <text x="780" y="898" textAnchor="middle" fill="#64748b" fontSize="10">Tashqi tizimlar</text>
          </svg>
        </div>
        
        {/* Tushuntirish qismi */}
        <div className="mt-6 p-4 bg-slate-50 rounded-md border border-slate-200">
          <h3 className="text-lg font-medium mb-2 flex items-center">
            <Info className="h-5 w-5 mr-2 text-blue-500" />
            {showDetail ? "Tanlangan komponent tushuntirishi" : "Tizim ishlash algoritmi tushuntirishi"}
          </h3>
          
          {!showDetail && (
            <div className="space-y-3">
              <p>Suv resurslari boshqarish tizimining umumiy ishlash algoritmi quyidagi asosiy qatlamlarni o'z ichiga oladi:</p>
              
              <ol className="list-decimal list-inside space-y-2 ml-2">
                <li className="font-medium">Foydalanuvchi interfeysi (Front-end) <span className="font-normal text-gray-600">- bu qatlam foydalanuvchi bilan o'zaro aloqada bo'ladi va ma'lumotlarni vizual ko'rinishda taqdim etadi.</span></li>
                <li className="font-medium">API va WebSocket qatlami <span className="font-normal text-gray-600">- front-end va back-end o'rtasida ma'lumotlarni uzatish va real vaqt rejimida yangilanishlarni ta'minlaydi.</span></li>
                <li className="font-medium">Tizim logikasi (Back-end) <span className="font-normal text-gray-600">- asosiy biznes logikasini o'z ichiga oladi va barcha hisob-kitoblarni, bashoratlarni va qarorlarni amalga oshiradi.</span></li>
                <li className="font-medium">Ma'lumotlar bazasi qatlami <span className="font-normal text-gray-600">- barcha ma'lumotlarni saqlaydi va turli xil so'rovlarni bajaradi.</span></li>
                <li className="font-medium">Tashqi tizimlar va integratsiyalar <span className="font-normal text-gray-600">- ob-havo ma'lumotlari, sensorlar va boshqa tashqi tizimlarga ulanish imkonini beradi.</span></li>
              </ol>
              
              <p className="text-sm mt-4">Har bir komponent to'g'risida batafsilroq ma'lumot olish uchun diagrammadagi tegishli qismni bosing.</p>
            </div>
          )}
          
          {showDetail === 'frontend' && (
            <div className="space-y-3">
              <h4 className="font-medium">Foydalanuvchi interfeysi (Front-end) qatlami</h4>
              <p>Bu qatlamda foydalanuvchi bilan o'zaro aloqa ta'minlanadi. Asosiy komponentlar:</p>
              
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li><span className="font-medium">Boshqaruv paneli</span>: Suv omborlari holati, bashorat va boshqa ma'lumotlarni vizual ko'rinishda taqdim etadi.</li>
                <li><span className="font-medium">Xarita interfeysi</span>: GIS tizimi bilan integratsiya qilingan kanallar va suv omborlarini ko'rsatadi.</li>
                <li><span className="font-medium">Suv taqsimoti interfeysi</span>: Fermerlar va boshqa foydalanuvchilar uchun suv taqsimotini boshqarish imkonini beradi.</li>
                <li><span className="font-medium">Video nazorat moduli</span>: Suv obyektlari ustidan videokuzatuv tizimini ta'minlaydi.</li>
                <li><span className="font-medium">Hisobotlar va analitika</span>: Ma'lumotlarni tahlil qilish va hisobotlar yaratish uchun interfeys.</li>
              </ul>
              
              <p className="text-sm font-medium mt-2">Ishlash jarayoni:</p>
              <p>Front-end React va TypeScript yordamida yaratilgan bo'lib, API va WebSocket orqali real vaqt rejimida ma'lumotlarni oladi. Foydalanuvchi interfeysi foydalanuvchi rollariga ko'ra adaptiv bo'lib, ularga tegishli ma'lumotlar va funksionallikni ko'rsatadi.</p>
            </div>
          )}
          
          {showDetail === 'api' && (
            <div className="space-y-3">
              <h4 className="font-medium">API va WebSocket qatlami</h4>
              <p>Bu qatlam front-end va back-end o'rtasida ma'lumotlarni uzatishni ta'minlaydi:</p>
              
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li><span className="font-medium">REST API</span>: Ma'lumotlarni so'rash va yuborish uchun standart HTTP so'rovlari orqali ishlaydi.</li>
                <li><span className="font-medium">WebSocket server</span>: Real vaqt rejimida ma'lumotlarni uzatish, ayniqsa suv sathi, oqim tezligi kabi o'zgaruvchan parametrlar uchun.</li>
                <li><span className="font-medium">Autentifikatsiya</span>: Xavfsiz kirish va token-based autentifikatsiya tizimi.</li>
                <li><span className="font-medium">Ruxsatlar boshqaruvi</span>: Foydalanuvchi rollariga ko'ra API endpointlariga kirishni boshqaradi.</li>
              </ul>
              
              <p className="text-sm font-medium mt-2">Ishlash jarayoni:</p>
              <p>WebSocket server har 10 soniyada suv omborlari ma'lumotlarini barcha ulangan mijozlarga uzatadi. REST API esa boshqa turdagi so'rovlarni bajaradi. API Gateway orqali barcha so'rovlar xavfsizlik tekshiruvidan o'tadi va tegishli xizmatga yo'naltiriladi.</p>
            </div>
          )}
          
          {showDetail === 'backend' && (
            <div className="space-y-3">
              <h4 className="font-medium">Tizim logikasi (Back-end) qatlami</h4>
              <p>Bu qatlam tizimning asosiy biznes logikasini o'z ichiga oladi va foydalanuvchi so'rovlarini qayta ishlaydi:</p>
              
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li><span className="font-medium">Suv monitoringi moduli</span>: Suv omborlaridan kelgan ma'lumotlarni qayta ishlaydi.</li>
                <li><span className="font-medium">Bashorat qilish moduli</span>: LSTM va boshqa modellar orqali suv miqdori va ehtiyojini bashorat qiladi.</li>
                <li><span className="font-medium">Taqsimlash moduli</span>: Suv resurslarini optimal taqsimlashni ta'minlaydi.</li>
                <li><span className="font-medium">Xavfsizlik moduli</span>: Ma'lumotlarni himoya qilish va ruxsatlarni tekshirish.</li>
              </ul>
              
              <p className="text-sm font-medium mt-2">Ishlash algoritmi:</p>
              <ol className="list-decimal list-inside space-y-1 ml-2">
                <li>Ma'lumotlarni qabul qilish (API yoki WebSocket orqali)</li>
                <li>Ma'lumotlarni tekshirish va tasdiqdan o'tkazish</li>
                <li>So'ralgan amaliyotni bajarish (monitoring, bashorat, taqsimlash)</li>
                <li>Natijani tayyorlash va qaytarish</li>
                <li>Agar kerak bo'lsa, boshqa modullarni xabardor qilish</li>
              </ol>
            </div>
          )}
          
          {showDetail === 'db' && (
            <div className="space-y-3">
              <h4 className="font-medium">Ma'lumotlar bazasi qatlami</h4>
              <p>PostgreSQL ma'lumotlar bazasi butun tizim uchun barqaror saqlash muhitini ta'minlaydi:</p>
              
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li><span className="font-medium">Foydalanuvchilar jadvali</span>: Barcha foydalanuvchilar ma'lumotlari, rollar va ruxsatlar.</li>
                <li><span className="font-medium">Suv omborlari jadvali</span>: Suv omborlari ma'lumotlari, joylashuvi, sig'imi.</li>
                <li><span className="font-medium">Suv taqsimoti jadvali</span>: Suv taqsimoti rejalari va tarixiy ma'lumotlar.</li>
                <li><span className="font-medium">Suv so'rovlari jadvali</span>: Fermerlar va boshqa foydalanuvchilardan keladigan suv so'rovlari.</li>
                <li><span className="font-medium">Xabarlar jadvali</span>: Tizimdagi xabarlar va bildirishnomalar.</li>
              </ul>
              
              <p className="text-sm font-medium mt-2">Ma'lumotlar saqlash strategiyasi:</p>
              <p>Ma'lumotlar bazasi Drizzle ORM orqali ishlaydi va vaqtinchalik ma'lumotlar uchun keshlardan foydalaniladi. Muhim ma'lumotlar uchun muntazam ravishda zaxira nusxalar olinadi. Real vaqt ma'lumotlari va tarixiy ma'lumotlar partitsiyalash orqali samarali saqlanadi.</p>
            </div>
          )}
          
          {showDetail === 'external' && (
            <div className="space-y-3">
              <h4 className="font-medium">Tashqi tizimlar va integratsiyalar</h4>
              <p>Tizim bir qator tashqi xizmatlar va ma'lumotlar manbalari bilan integratsiya qilingan:</p>
              
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li><span className="font-medium">Ob-havo ma'lumotlari API</span>: Ob-havo bashorati va yog'ingarchilik ma'lumotlarini olish.</li>
                <li><span className="font-medium">GIS tizimi</span>: Geografik ma'lumotlar va xaritalar bilan ishlash.</li>
                <li><span className="font-medium">IoT sensorlar tarmog'i</span>: Suv sathi, sifat va oqim tezligini o'lchovchi sensorlar.</li>
                <li><span className="font-medium">Video monitoring tizimi</span>: Suv obyektlarini kuzatish uchun video uzatish.</li>
                <li><span className="font-medium">SMS va elektron pochta xizmatlari</span>: Foydalanuvchilarga bildirishnomalar yuborish.</li>
              </ul>
              
              <p className="text-sm font-medium mt-2">Integratsiya algoritmi:</p>
              <ol className="list-decimal list-inside space-y-1 ml-2">
                <li>Tashqi tizimga ulanish va autentifikatsiya</li>
                <li>Ma'lumotlarni belgilangan vaqt oralig'ida yoki talabga ko'ra so'rash</li>
                <li>Olingan ma'lumotlarni tekshirish va tozalash</li>
                <li>Ma'lumotlarni tizim formatiga o'tkazish va saqlash</li>
                <li>Ma'lumotlar asosida qarorlar qabul qilish va bashoratlar yaratish</li>
              </ol>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}