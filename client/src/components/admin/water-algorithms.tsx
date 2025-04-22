import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function WaterAlgorithms() {
  return (
    <Card className="shadow-md">
      <CardHeader className="pb-2">
        <CardTitle>Suv resurslarini boshqarish algoritmlarining blok-sxemasi</CardTitle>
        <CardDescription>
          Tizimda suv resurslari bilan ishlash uchun qo'llaniladigan asosiy algoritmlar
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="monitoring" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="monitoring">Monitoring algoritmlari</TabsTrigger>
            <TabsTrigger value="distribution">Taqsimot algoritmlari</TabsTrigger>
            <TabsTrigger value="prediction">Bashorat algoritmlari</TabsTrigger>
          </TabsList>
          
          <TabsContent value="monitoring" className="space-y-4 mt-4">
            <div className="border p-4 rounded-md bg-slate-50">
              <h3 className="text-lg font-medium mb-2 text-center">Suv omborini monitoring qilish algoritmi</h3>
              <p className="text-sm text-gray-500 mb-4 text-center">
                Real vaqtda suv omborini nazorat qilish va ma'lumotlarni to'plash algoritmi
              </p>
              <div className="w-full overflow-x-auto mb-4 flex justify-center">
                <svg width="800" height="600" viewBox="0 0 800 600" className="mx-auto">
                  {/* Algoritm boshi */}
                  <ellipse cx="400" cy="30" rx="80" ry="30" fill="#dbeafe" stroke="#0c4a6e" strokeWidth="2" />
                  <text x="400" y="35" textAnchor="middle" fontWeight="bold" fill="#0f172a">Boshlash</text>
                  
                  {/* Strelka */}
                  <line x1="400" y1="60" x2="400" y2="90" stroke="#64748b" strokeWidth="2" />
                  <polygon points="395,90 405,90 400,100" fill="#64748b" />
                  
                  {/* Sensor o'rnatish */}
                  <rect x="300" y="100" width="200" height="60" rx="0" fill="#dbeafe" stroke="#0c4a6e" strokeWidth="2" />
                  <text x="400" y="130" textAnchor="middle" fontWeight="bold" fill="#0f172a">Sensorlarni o'rnatish</text>
                  <text x="400" y="150" textAnchor="middle" fontWeight="bold" fill="#0f172a">va kalibratsiya qilish</text>
                  
                  {/* Strelka */}
                  <line x1="400" y1="160" x2="400" y2="190" stroke="#64748b" strokeWidth="2" />
                  <polygon points="395,190 405,190 400,200" fill="#64748b" />
                  
                  {/* Suv sathini o'lchash */}
                  <rect x="300" y="200" width="200" height="60" rx="0" fill="#f1f5f9" stroke="#0c4a6e" strokeWidth="2" />
                  <text x="400" y="230" textAnchor="middle" fontWeight="bold" fill="#0f172a">Suv sathini o'lchash</text>
                  <text x="400" y="250" textAnchor="middle" fontWeight="bold" fill="#0f172a">va ma'lumotlarni to'plash</text>
                  
                  {/* Strelka */}
                  <line x1="400" y1="260" x2="400" y2="290" stroke="#64748b" strokeWidth="2" />
                  <polygon points="395,290 405,290 400,300" fill="#64748b" />
                  
                  {/* Ma'lumotlarni qayta ishlash */}
                  <rect x="300" y="300" width="200" height="60" rx="0" fill="#f1f5f9" stroke="#0c4a6e" strokeWidth="2" />
                  <text x="400" y="330" textAnchor="middle" fontWeight="bold" fill="#0f172a">Ma'lumotlarni qayta ishlash</text>
                  <text x="400" y="350" textAnchor="middle" fontWeight="bold" fill="#0f172a">va normallash</text>
                  
                  {/* Shart */}
                  <polygon points="400,390 320,440 400,490 480,440" fill="#dbeafe" stroke="#0c4a6e" strokeWidth="2" />
                  <text x="400" y="435" textAnchor="middle" fontWeight="bold" fill="#0f172a">Suv sathida</text>
                  <text x="400" y="455" textAnchor="middle" fontWeight="bold" fill="#0f172a">o'zgarish bormi?</text>
                  
                  {/* Ha yo'li */}
                  <line x1="480" y1="440" x2="600" y2="440" stroke="#64748b" strokeWidth="2" />
                  <polygon points="595,435 605,440 595,445" fill="#64748b" />
                  <text x="540" y="425" textAnchor="middle" fontSize="12" fill="#15803d">Ha</text>
                  
                  {/* Bildirishnoma */}
                  <rect x="600" y="410" width="180" height="60" rx="0" fill="#fee2e2" stroke="#7f1d1d" strokeWidth="2" />
                  <text x="690" y="440" textAnchor="middle" fontWeight="bold" fill="#0f172a">Bildirishnoma yuborish</text>
                  
                  {/* Yo'q yo'li */}
                  <line x1="400" y1="490" x2="400" y2="520" stroke="#64748b" strokeWidth="2" />
                  <polygon points="395,520 405,520 400,530" fill="#64748b" />
                  <text x="415" y="505" textAnchor="middle" fontSize="12" fill="#0f172a">Yo'q</text>
                  
                  {/* Ma'lumotlarni serverga saqlash */}
                  <rect x="300" y="530" width="200" height="60" rx="0" fill="#f1f5f9" stroke="#0c4a6e" strokeWidth="2" />
                  <text x="400" y="560" textAnchor="middle" fontWeight="bold" fill="#0f172a">Ma'lumotlarni bazaga saqlash</text>
                  
                  {/* Bildirishnomadan o'tish */}
                  <line x1="690" y1="470" x2="690" y2="560" stroke="#64748b" strokeWidth="2" />
                  <line x1="690" y1="560" x2="500" y2="560" stroke="#64748b" strokeWidth="2" />
                  <polygon points="505,555 500,560 505,565" fill="#64748b" />
                  
                  {/* Tsikl qaytish */}
                  <path d="M 300,560 L 150,560 L 150,230 L 300,230" stroke="#64748b" strokeWidth="2" fill="none" />
                  <polygon points="295,225 305,235 295,235" fill="#64748b" />
                </svg>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="bg-white p-3 rounded-md shadow-sm">
                  <h4 className="font-medium mb-2">Suv sathini monitoring algoritmi vazifalari</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Suv omborlaridagi suv sathini real vaqtda kuzatish</li>
                    <li>Suv sathining o'zgarishlarini tahlil qilish</li>
                    <li>Xavfli o'zgarishlarda bildirishnomalar yuborish</li>
                    <li>Barcha ma'lumotlarni ma'lumotlar bazasiga saqlash</li>
                    <li>Vaqt bo'yicha o'zgarishlar tarixini kuzatish</li>
                  </ul>
                </div>
                <div className="bg-white p-3 rounded-md shadow-sm">
                  <h4 className="font-medium mb-2">Monitoring algoritmi komponentlari</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>IoT sensorlar va o'lchov qurilmalari</li>
                    <li>Ma'lumotlarni qayta ishlash moduli</li>
                    <li>Real vaqtda ma'lumotlar uzatish tizimi</li>
                    <li>WebSocket protokoli orqali ma'lumotlar almashinuvi</li>
                    <li>Suv sathining kritik darajalarini kuzatish tizimi</li>
                  </ul>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="distribution" className="space-y-4 mt-4">
            <div className="border p-4 rounded-md bg-slate-50">
              <h3 className="text-lg font-medium mb-2 text-center">Suv taqsimoti algoritmi</h3>
              <p className="text-sm text-gray-500 mb-4 text-center">
                Fermerlar va ekin turlari bo'yicha suv taqsimotini amalga oshirish algoritmi
              </p>
              <div className="w-full overflow-x-auto mb-4 flex justify-center">
                <svg width="800" height="700" viewBox="0 0 800 700" className="mx-auto">
                  {/* Boshlash */}
                  <ellipse cx="400" cy="30" rx="80" ry="30" fill="#dbeafe" stroke="#0c4a6e" strokeWidth="2" />
                  <text x="400" y="35" textAnchor="middle" fontWeight="bold" fill="#0f172a">Boshlash</text>
                  
                  {/* Strelka */}
                  <line x1="400" y1="60" x2="400" y2="90" stroke="#64748b" strokeWidth="2" />
                  <polygon points="395,90 405,90 400,100" fill="#64748b" />
                  
                  {/* So'rovlarni qabul qilish */}
                  <rect x="300" y="100" width="200" height="60" rx="0" fill="#e0f2fe" stroke="#0c4a6e" strokeWidth="2" />
                  <text x="400" y="130" textAnchor="middle" fontWeight="bold" fill="#0f172a">Fermerlardan suv so'rovlarini</text>
                  <text x="400" y="150" textAnchor="middle" fontWeight="bold" fill="#0f172a">qabul qilish</text>
                  
                  {/* Strelka */}
                  <line x1="400" y1="160" x2="400" y2="190" stroke="#64748b" strokeWidth="2" />
                  <polygon points="395,190 405,190 400,100" fill="#64748b" />
                  
                  {/* So'rovlarni tahlil qilish */}
                  <rect x="300" y="200" width="200" height="60" rx="0" fill="#e0f2fe" stroke="#0c4a6e" strokeWidth="2" />
                  <text x="400" y="230" textAnchor="middle" fontWeight="bold" fill="#0f172a">So'rovlarni tahlil qilish</text>
                  <text x="400" y="250" textAnchor="middle" fontWeight="bold" fill="#0f172a">va tasdiqlash</text>
                  
                  {/* Strelka */}
                  <line x1="400" y1="260" x2="400" y2="290" stroke="#64748b" strokeWidth="2" />
                  <polygon points="395,290 405,290 400,300" fill="#64748b" />
                  
                  {/* Ekinlarni tahlil */}
                  <polygon points="400,300 300,350 400,400 500,350" fill="#e0f2fe" stroke="#0c4a6e" strokeWidth="2" />
                  <text x="400" y="345" textAnchor="middle" fontWeight="bold" fill="#0f172a">Ekin turiga</text>
                  <text x="400" y="365" textAnchor="middle" fontWeight="bold" fill="#0f172a">qarab ajratish</text>
                  
                  {/* Suvga talabchan */}
                  <line x1="500" y1="350" x2="600" y2="350" stroke="#64748b" strokeWidth="2" />
                  <polygon points="595,345 605,350 595,355" fill="#64748b" />
                  <text x="550" y="335" textAnchor="middle" fontSize="12" fill="#0f172a">Suvga talabchan</text>
                  
                  {/* Yuqori suv sarfi */}
                  <rect x="600" y="320" width="180" height="60" rx="0" fill="#e0f2fe" stroke="#0c4a6e" strokeWidth="2" />
                  <text x="690" y="340" textAnchor="middle" fontWeight="bold" fill="#0f172a">Yuqori suv sarfi bilan</text>
                  <text x="690" y="360" textAnchor="middle" fontWeight="bold" fill="#0f172a">ta'minlash</text>
                  
                  {/* O'rtacha suv sarfi */}
                  <line x1="400" y1="400" x2="400" y2="450" stroke="#64748b" strokeWidth="2" />
                  <polygon points="395,445 405,445 400,455" fill="#64748b" />
                  <text x="440" y="425" textAnchor="middle" fontSize="12" fill="#0f172a">O'rtacha talab</text>
                  
                  {/* O'rtacha suv sarfi */}
                  <rect x="300" y="450" width="200" height="60" rx="0" fill="#e0f2fe" stroke="#0c4a6e" strokeWidth="2" />
                  <text x="400" y="480" textAnchor="middle" fontWeight="bold" fill="#0f172a">O'rtacha suv sarfi bilan</text>
                  <text x="400" y="500" textAnchor="middle" fontWeight="bold" fill="#0f172a">ta'minlash</text>
                  
                  {/* Kam suv sarfi */}
                  <line x1="300" y1="350" x2="200" y2="350" stroke="#64748b" strokeWidth="2" />
                  <polygon points="205,345 195,350 205,355" fill="#64748b" />
                  <text x="250" y="335" textAnchor="middle" fontSize="12" fill="#0f172a">Kam talab</text>
                  
                  {/* Past suv sarfi */}
                  <rect x="20" y="320" width="180" height="60" rx="0" fill="#e0f2fe" stroke="#0c4a6e" strokeWidth="2" />
                  <text x="110" y="340" textAnchor="middle" fontWeight="bold" fill="#0f172a">Past suv sarfi bilan</text>
                  <text x="110" y="360" textAnchor="middle" fontWeight="bold" fill="#0f172a">ta'minlash</text>
                  
                  {/* Yuqori sarfdan chiqish */}
                  <line x1="690" y1="380" x2="690" y2="590" stroke="#64748b" strokeWidth="2" />
                  <line x1="690" y1="590" x2="500" y2="590" stroke="#64748b" strokeWidth="2" />
                  <polygon points="505,585 495,590 505,595" fill="#64748b" />
                  
                  {/* O'rtacha sarfdan chiqish */}
                  <line x1="400" y1="510" x2="400" y2="590" stroke="#64748b" strokeWidth="2" />
                  <polygon points="395,585 405,585 400,595" fill="#64748b" />
                  
                  {/* Past sarfdan chiqish */}
                  <line x1="110" y1="380" x2="110" y2="590" stroke="#64748b" strokeWidth="2" />
                  <line x1="110" y1="590" x2="300" y2="590" stroke="#64748b" strokeWidth="2" />
                  <polygon points="295,585 305,590 295,595" fill="#64748b" />
                  
                  {/* Suv taqsimoti grafigi */}
                  <rect x="300" y="590" width="200" height="60" rx="0" fill="#dcfce7" stroke="#0c4a6e" strokeWidth="2" />
                  <text x="400" y="620" textAnchor="middle" fontWeight="bold" fill="#0f172a">Suv taqsimoti jadvalini</text>
                  <text x="400" y="640" textAnchor="middle" fontWeight="bold" fill="#0f172a">shakllantirish</text>
                  
                  {/* Yakunlash */}
                  <ellipse cx="400" cy="700" rx="80" ry="30" fill="#dbeafe" stroke="#0c4a6e" strokeWidth="2" />
                  <text x="400" y="705" textAnchor="middle" fontWeight="bold" fill="#0f172a">Yakunlash</text>
                  
                  {/* Oxirgi strelka */}
                  <line x1="400" y1="650" x2="400" y2="670" stroke="#64748b" strokeWidth="2" />
                  <polygon points="395,665 405,665 400,675" fill="#64748b" />
                </svg>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="bg-white p-3 rounded-md shadow-sm">
                  <h4 className="font-medium mb-2">Suv taqsimoti algoritmi vazifalari</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Fermerlardan so'rovlarni qabul qilish va ro'yxatga olish</li>
                    <li>Ekin turlariga qarab suv talabini hisoblash</li>
                    <li>Mavsum va ob-havo sharoitiga ko'ra tuzatish koeffisiyentlarini qo'llash</li>
                    <li>Ekin maydoni ko'lamini hisobga olish</li>
                    <li>Suv taqsimoti rejasini shakllantirish</li>
                  </ul>
                </div>
                <div className="bg-white p-3 rounded-md shadow-sm">
                  <h4 className="font-medium mb-2">Ekin turlariga ko'ra suv sarfi</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Yuqori talab: sholi, yem-xashak, sabzavotlar</li>
                    <li>O'rtacha talab: g'alla, makkajo'xori, kartoshka</li>
                    <li>Past talab: uzum, mevali daraxtlar</li>
                    <li>Tomchilatib sug'orish: standart sarfning 60%</li>
                    <li>An'anaviy sug'orish: standart sarf 100%</li>
                  </ul>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="prediction" className="space-y-4 mt-4">
            <div className="border p-4 rounded-md bg-slate-50">
              <h3 className="text-lg font-medium mb-2 text-center">Suv sarfini bashoratlash algoritmi</h3>
              <p className="text-sm text-gray-500 mb-4 text-center">
                LSTM neyron tarmoqlari orqali suv sarfini bashoratlash va modellashtirish algoritmi
              </p>
              <div className="w-full overflow-x-auto mb-4 flex justify-center">
                <svg width="800" height="900" viewBox="0 0 800 900" className="mx-auto">
                  {/* Boshlash */}
                  <ellipse cx="400" cy="30" rx="80" ry="30" fill="#dbeafe" stroke="#0c4a6e" strokeWidth="2" />
                  <text x="400" y="35" textAnchor="middle" fontWeight="bold" fill="#0f172a">Boshlash</text>
                  
                  {/* Strelka */}
                  <line x1="400" y1="60" x2="400" y2="90" stroke="#64748b" strokeWidth="2" />
                  <polygon points="395,90 405,90 400,100" fill="#64748b" />
                  
                  {/* Ma'lumotlarni yig'ish */}
                  <rect x="300" y="100" width="200" height="60" rx="0" fill="#dbeafe" stroke="#0c4a6e" strokeWidth="2" />
                  <text x="400" y="130" textAnchor="middle" fontWeight="bold" fill="#0f172a">Tarixiy ma'lumotlarni</text>
                  <text x="400" y="150" textAnchor="middle" fontWeight="bold" fill="#0f172a">yig'ish</text>
                  
                  {/* Strelka */}
                  <line x1="400" y1="160" x2="400" y2="190" stroke="#64748b" strokeWidth="2" />
                  <polygon points="395,190 405,190 400,200" fill="#64748b" />
                  
                  {/* Ma'lumotlarni normallash */}
                  <rect x="300" y="200" width="200" height="60" rx="0" fill="#dbeafe" stroke="#0c4a6e" strokeWidth="2" />
                  <text x="400" y="230" textAnchor="middle" fontWeight="bold" fill="#0f172a">Ma'lumotlarni normallash</text>
                  <text x="400" y="250" textAnchor="middle" fontWeight="bold" fill="#0f172a">va tayyorlash</text>
                  
                  {/* Strelka */}
                  <line x1="400" y1="260" x2="400" y2="290" stroke="#64748b" strokeWidth="2" />
                  <polygon points="395,290 405,290 400,300" fill="#64748b" />
                  
                  {/* Trening va test guruhlash */}
                  <rect x="300" y="300" width="200" height="60" rx="0" fill="#dbeafe" stroke="#0c4a6e" strokeWidth="2" />
                  <text x="400" y="330" textAnchor="middle" fontWeight="bold" fill="#0f172a">Ma'lumotlarni trening va</text>
                  <text x="400" y="350" textAnchor="middle" fontWeight="bold" fill="#0f172a">test guruhlariga ajratish</text>
                  
                  {/* Strelka */}
                  <line x1="400" y1="360" x2="400" y2="390" stroke="#64748b" strokeWidth="2" />
                  <polygon points="395,390 405,390 400,400" fill="#64748b" />
                  
                  {/* LSTM model yaratish */}
                  <rect x="300" y="400" width="200" height="60" rx="0" fill="#dbeafe" stroke="#0c4a6e" strokeWidth="2" />
                  <text x="400" y="430" textAnchor="middle" fontWeight="bold" fill="#0f172a">LSTM modelini</text>
                  <text x="400" y="450" textAnchor="middle" fontWeight="bold" fill="#0f172a">shakllantirish</text>
                  
                  {/* Strelka */}
                  <line x1="400" y1="460" x2="400" y2="490" stroke="#64748b" strokeWidth="2" />
                  <polygon points="395,490 405,490 400,500" fill="#64748b" />
                  
                  {/* Modelni trenirovka qilish */}
                  <rect x="300" y="500" width="200" height="60" rx="0" fill="#dbeafe" stroke="#0c4a6e" strokeWidth="2" />
                  <text x="400" y="530" textAnchor="middle" fontWeight="bold" fill="#0f172a">Modelni trenirovka</text>
                  <text x="400" y="550" textAnchor="middle" fontWeight="bold" fill="#0f172a">qilish</text>
                  
                  {/* Strelka */}
                  <line x1="400" y1="560" x2="400" y2="590" stroke="#64748b" strokeWidth="2" />
                  <polygon points="395,590 405,590 400,600" fill="#64748b" />
                  
                  {/* Modelni test qilish */}
                  <rect x="300" y="600" width="200" height="60" rx="0" fill="#dbeafe" stroke="#0c4a6e" strokeWidth="2" />
                  <text x="400" y="630" textAnchor="middle" fontWeight="bold" fill="#0f172a">Modelni test</text>
                  <text x="400" y="650" textAnchor="middle" fontWeight="bold" fill="#0f172a">ma'lumotlarda tekshirish</text>
                  
                  {/* Strelka */}
                  <line x1="400" y1="660" x2="400" y2="690" stroke="#64748b" strokeWidth="2" />
                  <polygon points="395,690 405,690 400,700" fill="#64748b" />
                  
                  {/* Natijalar */}
                  <polygon points="400,700 320,740 400,780 480,740" fill="#dbeafe" stroke="#0c4a6e" strokeWidth="2" />
                  <text x="400" y="730" textAnchor="middle" fontWeight="bold" fill="#0f172a">Model</text>
                  <text x="400" y="750" textAnchor="middle" fontWeight="bold" fill="#0f172a">aniqmi?</text>
                  
                  {/* Yo'q yo'li */}
                  <line x1="320" y1="740" x2="200" y2="740" stroke="#64748b" strokeWidth="2" />
                  <polygon points="205,735 195,740 205,745" fill="#64748b" />
                  <text x="250" y="725" textAnchor="middle" fontSize="12" fill="#0f172a">Yo'q</text>
                  
                  {/* Modelni qayta sozlash */}
                  <rect x="20" y="710" width="180" height="60" rx="0" fill="#fee2e2" stroke="#0c4a6e" strokeWidth="2" />
                  <text x="110" y="740" textAnchor="middle" fontWeight="bold" fill="#0f172a">Modelni qayta sozlash</text>
                  
                  {/* Qayta sozlashdan o'tish */}
                  <path d="M 110,710 L 110,430 L 300,430" stroke="#64748b" strokeWidth="2" fill="none" />
                  <polygon points="295,425 305,435 295,435" fill="#64748b" />
                  
                  {/* Ha yo'li */}
                  <line x1="400" y1="780" x2="400" y2="810" stroke="#64748b" strokeWidth="2" />
                  <polygon points="395,805 405,805 400,815" fill="#64748b" />
                  <text x="415" y="795" textAnchor="middle" fontSize="12" fill="#0f172a">Ha</text>
                  
                  {/* Bashorat qilish */}
                  <rect x="300" y="810" width="200" height="60" rx="0" fill="#dbeafe" stroke="#0c4a6e" strokeWidth="2" />
                  <text x="400" y="840" textAnchor="middle" fontWeight="bold" fill="#0f172a">Suv sarfini bashorat qilish</text>
                  
                  {/* Yakunlash */}
                  <ellipse cx="400" cy="920" rx="80" ry="30" fill="#dbeafe" stroke="#0c4a6e" strokeWidth="2" />
                  <text x="400" y="925" textAnchor="middle" fontWeight="bold" fill="#0f172a">Yakunlash</text>
                  
                  {/* Oxirgi strelka */}
                  <line x1="400" y1="870" x2="400" y2="890" stroke="#64748b" strokeWidth="2" />
                  <polygon points="395,885 405,885 400,895" fill="#64748b" />
                </svg>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="bg-white p-3 rounded-md shadow-sm">
                  <h4 className="font-medium mb-2">LSTM bashorat algoritmi vazifalari</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Suv sarfini vaqt bo'yicha bashoratlash</li>
                    <li>Ob-havo sharoitlarini modelga qo'shish</li>
                    <li>Mavsum o'zgarishlarini inobatga olish</li>
                    <li>Suv sathi o'zgarishlarini modellashtirish</li>
                    <li>Quymishlardan suv kelishini bashoratlash</li>
                  </ul>
                </div>
                <div className="bg-white p-3 rounded-md shadow-sm">
                  <h4 className="font-medium mb-2">LSTM modeli ishlash tamoyillari</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Tarixiy ma'lumotlar asosida o'rganish</li>
                    <li>Ketma-ketlik ma'lumotlarini qayta ishlash</li>
                    <li>Uzoq muddatli bog'liqliklarni topish</li>
                    <li>Anomaliyalarni aniqlash va hisobga olish</li>
                    <li>Bir necha vaqt birliklari oldinga bashorat qilish</li>
                  </ul>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}