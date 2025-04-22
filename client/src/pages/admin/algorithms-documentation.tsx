import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Layout from "@/components/layout";

export default function AlgorithmsDocumentation() {
  return (
    <Layout>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold">Suv ombori boshqaruvi tizimlari algoritmlari</h1>
          <p className="text-muted-foreground">
            Tizimda ishlatiladigan barcha algoritmlar va ularning ishlash prinsiplari to'g'risida ma'lumot
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Suv omborlarini boshqarish algoritmlari</CardTitle>
            <CardDescription>
              Suv omborlarini boshqarish uchun ishlatiladigan asosiy algoritmlar va ularning vazifalari
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="monitoring" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
                <TabsTrigger value="allocation">Taqsimlash</TabsTrigger>
                <TabsTrigger value="forecast">Bashorat</TabsTrigger>
                <TabsTrigger value="security">Xavfsizlik</TabsTrigger>
              </TabsList>
              
              <TabsContent value="monitoring" className="pt-6">
                <div className="space-y-6">
                  <div className="border p-4 rounded-lg bg-slate-50">
                    <h3 className="text-lg font-medium mb-2 text-center">Suv sathini real vaqtda monitoring qilish algoritmi</h3>
                    <p className="text-sm text-gray-500 mb-4 text-center">
                      Suv omborlaridagi suv sathini real vaqtda kuzatish va nazorat qilish
                    </p>
                    
                    <div className="w-full overflow-x-auto mb-4 flex justify-center">
                      <svg width="700" height="700" viewBox="0 0 700 700">
                        {/* Algoritm boshi */}
                        <ellipse cx="350" cy="30" rx="80" ry="30" fill="#dbeafe" stroke="#0c4a6e" strokeWidth="2" />
                        <text x="350" y="35" textAnchor="middle" fontWeight="bold" fill="#0f172a">Boshlash</text>
                        
                        {/* Strelka */}
                        <line x1="350" y1="60" x2="350" y2="90" stroke="#64748b" strokeWidth="2" />
                        <polygon points="345,90 355,90 350,100" fill="#64748b" />
                        
                        {/* Sensorlarni tekshirish */}
                        <rect x="250" y="100" width="200" height="60" rx="0" fill="#dbeafe" stroke="#0c4a6e" strokeWidth="2" />
                        <text x="350" y="130" textAnchor="middle" fontWeight="bold" fill="#0f172a">Suv sathi sensorlarini</text>
                        <text x="350" y="150" textAnchor="middle" fontWeight="bold" fill="#0f172a">tekshirish</text>
                        
                        {/* Strelka */}
                        <line x1="350" y1="160" x2="350" y2="190" stroke="#64748b" strokeWidth="2" />
                        <polygon points="345,190 355,190 350,200" fill="#64748b" />
                        
                        {/* Sensorlar ishlayaptimi? */}
                        <polygon points="350,200 275,250 425,250" fill="#dbeafe" stroke="#0c4a6e" strokeWidth="2" />
                        <text x="350" y="235" textAnchor="middle" fontWeight="bold" fill="#0f172a">Sensorlar</text>
                        <text x="350" y="255" textAnchor="middle" fontWeight="bold" fill="#0f172a">ishlayaptimi?</text>
                        
                        {/* Yo'q yo'nalish */}
                        <line x1="275" y1="250" x2="175" y2="300" stroke="#64748b" strokeWidth="2" />
                        <polygon points="180,295 170,305 175,308" fill="#64748b" />
                        <text x="215" y="260" textAnchor="middle" fontSize="12" fill="#7f1d1d">Yo'q</text>
                        
                        {/* Texnik xizmat */}
                        <rect x="100" y="300" width="150" height="60" rx="0" fill="#fee2e2" stroke="#7f1d1d" strokeWidth="2" />
                        <text x="175" y="330" textAnchor="middle" fontWeight="bold" fill="#0f172a">Texnik xizmat</text>
                        <text x="175" y="350" textAnchor="middle" fontWeight="bold" fill="#0f172a">chaqirish</text>
                        
                        {/* Texnik xizmatdan qaytish */}
                        <line x1="175" y1="360" x2="175" y2="400" stroke="#64748b" strokeWidth="2" />
                        <line x1="175" y1="400" x2="350" y2="400" stroke="#64748b" strokeWidth="2" />
                        <line x1="350" y1="400" x2="350" y2="130" stroke="#64748b" strokeWidth="2" strokeDasharray="5,5" />
                        <polygon points="345,135 355,135 350,125" fill="#64748b" />
                        
                        {/* Ha yo'nalish */}
                        <line x1="350" y1="250" x2="350" y2="300" stroke="#64748b" strokeWidth="2" />
                        <polygon points="345,300 355,300 350,310" fill="#64748b" />
                        <text x="365" y="275" textAnchor="middle" fontSize="12" fill="#15803d">Ha</text>
                        
                        {/* Suv sathini o'lchash */}
                        <rect x="250" y="310" width="200" height="60" rx="0" fill="#bfdbfe" stroke="#0c4a6e" strokeWidth="2" />
                        <text x="350" y="340" textAnchor="middle" fontWeight="bold" fill="#0f172a">Suv sathini</text>
                        <text x="350" y="360" textAnchor="middle" fontWeight="bold" fill="#0f172a">o'lchash</text>
                        
                        {/* Strelka */}
                        <line x1="350" y1="370" x2="350" y2="400" stroke="#64748b" strokeWidth="2" />
                        <polygon points="345,400 355,400 350,410" fill="#64748b" />
                        
                        {/* Ma'lumotlarni normallash */}
                        <rect x="250" y="410" width="200" height="60" rx="0" fill="#bfdbfe" stroke="#0c4a6e" strokeWidth="2" />
                        <text x="350" y="440" textAnchor="middle" fontWeight="bold" fill="#0f172a">Ma'lumotlarni</text>
                        <text x="350" y="460" textAnchor="middle" fontWeight="bold" fill="#0f172a">normallash</text>
                        
                        {/* Strelka */}
                        <line x1="350" y1="470" x2="350" y2="500" stroke="#64748b" strokeWidth="2" />
                        <polygon points="345,500 355,500 350,510" fill="#64748b" />
                        
                        {/* Ma'lumotlarni markazga yuborish */}
                        <rect x="250" y="510" width="200" height="60" rx="0" fill="#bfdbfe" stroke="#0c4a6e" strokeWidth="2" />
                        <text x="350" y="540" textAnchor="middle" fontWeight="bold" fill="#0f172a">Ma'lumotlarni markaziy</text>
                        <text x="350" y="560" textAnchor="middle" fontWeight="bold" fill="#0f172a">serverga yuborish</text>
                        
                        {/* Strelka */}
                        <line x1="350" y1="570" x2="350" y2="600" stroke="#64748b" strokeWidth="2" />
                        <polygon points="345,600 355,600 350,610" fill="#64748b" />
                        
                        {/* Mavjud suv sathi haqida hisobot */}
                        <rect x="250" y="610" width="200" height="60" rx="0" fill="#bfdbfe" stroke="#0c4a6e" strokeWidth="2" />
                        <text x="350" y="635" textAnchor="middle" fontWeight="bold" fill="#0f172a">Mavjud suv sathi haqida</text>
                        <text x="350" y="655" textAnchor="middle" fontWeight="bold" fill="#0f172a">hisobot yaratish</text>
                        
                        {/* Yakunlash */}
                        <line x1="350" y1="670" x2="350" y2="700" stroke="#64748b" strokeWidth="2" />
                        <polygon points="345,700 355,700 350,710" fill="#64748b" />
                        
                        {/* Algoritm tugashi */}
                        <ellipse cx="350" cy="730" rx="80" ry="30" fill="#dbeafe" stroke="#0c4a6e" strokeWidth="2" />
                        <text x="350" y="735" textAnchor="middle" fontWeight="bold" fill="#0f172a">Yakunlash</text>
                      </svg>
                    </div>
                    
                    <div className="prose prose-blue max-w-none">
                      <h4>Algoritm vazifasi:</h4>
                      <p>
                        Ushbu algoritm suv omborlaridagi suv sathini real vaqtda kuzatish, sensorlardan olingan ma'lumotlarni qayta ishlash va
                        markaziy boshqaruv tizimiga yuborish jarayonini avtomatlashtiradi. Bu orqali suv ombori boshqaruvchilari
                        va foydalanuvchilar rezervuarlar holatini doimiy nazorat qilish imkoniyatiga ega bo'ladilar.
                      </p>
                      
                      <h4>Asosiy bosqichlar:</h4>
                      <ol>
                        <li><strong>Suv sathi sensorlarini tekshirish</strong> - Barcha o'lchov asboblarining ishlash holati tekshiriladi</li>
                        <li><strong>Sensor ishlashini tekshirish</strong> - Nosoz sensorlar aniqlansa, texnik xizmat chaqiriladi</li>
                        <li><strong>Suv sathini o'lchash</strong> - Ishlayotgan sensorlar orqali joriy suv sathi o'lchanadi</li>
                        <li><strong>Ma'lumotlarni normallash</strong> - Turli sensorlardan olingan ma'lumotlar birliklar bo'yicha standartlashtiriladi</li>
                        <li><strong>Ma'lumotlarni markaziy serverga yuborish</strong> - To'plangan ma'lumotlar WebSocket protokoli orqali uzatiladi</li>
                        <li><strong>Hisobot yaratish</strong> - Suv sathi haqida barcha tegishli ma'lumotlar hisobotga jamlashtiriladi</li>
                      </ol>
                    </div>
                  </div>
                  
                  <div className="border p-4 rounded-lg bg-slate-50">
                    <h3 className="text-lg font-medium mb-2 text-center">Anomaliyalarni aniqlash algoritmi</h3>
                    <p className="text-sm text-gray-500 mb-4 text-center">
                      Suv sathidagi kutilmagan o'zgarishlarni aniqlash va ogohlantirishlar yuborish
                    </p>
                    
                    <div className="w-full overflow-x-auto mb-4 flex justify-center">
                      <svg width="700" height="800" viewBox="0 0 700 800">
                        {/* Algoritm boshi */}
                        <ellipse cx="350" cy="30" rx="80" ry="30" fill="#dbeafe" stroke="#0c4a6e" strokeWidth="2" />
                        <text x="350" y="35" textAnchor="middle" fontWeight="bold" fill="#0f172a">Boshlash</text>
                        
                        {/* Strelka */}
                        <line x1="350" y1="60" x2="350" y2="90" stroke="#64748b" strokeWidth="2" />
                        <polygon points="345,90 355,90 350,100" fill="#64748b" />
                        
                        {/* Ma'lumotlarni olish */}
                        <rect x="250" y="100" width="200" height="60" rx="0" fill="#dbeafe" stroke="#0c4a6e" strokeWidth="2" />
                        <text x="350" y="130" textAnchor="middle" fontWeight="bold" fill="#0f172a">Monitoring tizimidan</text>
                        <text x="350" y="150" textAnchor="middle" fontWeight="bold" fill="#0f172a">ma'lumotlarni olish</text>
                        
                        {/* Strelka */}
                        <line x1="350" y1="160" x2="350" y2="190" stroke="#64748b" strokeWidth="2" />
                        <polygon points="345,190 355,190 350,200" fill="#64748b" />
                        
                        {/* Tarixiy ma'lumotlar bilan solishtirish */}
                        <rect x="250" y="200" width="200" height="60" rx="0" fill="#dbeafe" stroke="#0c4a6e" strokeWidth="2" />
                        <text x="350" y="230" textAnchor="middle" fontWeight="bold" fill="#0f172a">Tarixiy ma'lumotlar bilan</text>
                        <text x="350" y="250" textAnchor="middle" fontWeight="bold" fill="#0f172a">solishtirish</text>
                        
                        {/* Strelka */}
                        <line x1="350" y1="260" x2="350" y2="290" stroke="#64748b" strokeWidth="2" />
                        <polygon points="345,290 355,290 350,300" fill="#64748b" />
                        
                        {/* O'zgarish darajasini hisoblash */}
                        <rect x="250" y="300" width="200" height="60" rx="0" fill="#dbeafe" stroke="#0c4a6e" strokeWidth="2" />
                        <text x="350" y="330" textAnchor="middle" fontWeight="bold" fill="#0f172a">O'zgarish darajasini</text>
                        <text x="350" y="350" textAnchor="middle" fontWeight="bold" fill="#0f172a">hisoblash</text>
                        
                        {/* Strelka */}
                        <line x1="350" y1="360" x2="350" y2="390" stroke="#64748b" strokeWidth="2" />
                        <polygon points="345,390 355,390 350,400" fill="#64748b" />
                        
                        {/* Anomaliya bormi? */}
                        <polygon points="350,400 275,450 425,450" fill="#dbeafe" stroke="#0c4a6e" strokeWidth="2" />
                        <text x="350" y="435" textAnchor="middle" fontWeight="bold" fill="#0f172a">Anomaliya</text>
                        <text x="350" y="455" textAnchor="middle" fontWeight="bold" fill="#0f172a">aniqlandi?</text>
                        
                        {/* Yo'q yo'nalish */}
                        <line x1="275" y1="450" x2="200" y2="500" stroke="#64748b" strokeWidth="2" />
                        <polygon points="205,495 195,505 200,508" fill="#64748b" />
                        <text x="230" y="460" textAnchor="middle" fontSize="12" fill="#7f1d1d">Yo'q</text>
                        
                        {/* Normali holatni qayd etish */}
                        <rect x="100" y="500" width="200" height="60" rx="0" fill="#dcfce7" stroke="#166534" strokeWidth="2" />
                        <text x="200" y="530" textAnchor="middle" fontWeight="bold" fill="#0f172a">Normal holatni</text>
                        <text x="200" y="550" textAnchor="middle" fontWeight="bold" fill="#0f172a">qayd etish</text>
                        
                        {/* Ha yo'nalish */}
                        <line x1="425" y1="450" x2="500" y2="500" stroke="#64748b" strokeWidth="2" />
                        <polygon points="495,495 505,505 500,508" fill="#64748b" />
                        <text x="475" y="460" textAnchor="middle" fontSize="12" fill="#15803d">Ha</text>
                        
                        {/* Anomaliya darajasini aniqlash */}
                        <rect x="400" y="500" width="200" height="60" rx="0" fill="#fee2e2" stroke="#7f1d1d" strokeWidth="2" />
                        <text x="500" y="530" textAnchor="middle" fontWeight="bold" fill="#0f172a">Anomaliya darajasini</text>
                        <text x="500" y="550" textAnchor="middle" fontWeight="bold" fill="#0f172a">aniqlash</text>
                        
                        {/* Strelka anomaliyadan */}
                        <line x1="500" y1="560" x2="500" y2="590" stroke="#64748b" strokeWidth="2" />
                        <polygon points="495,590 505,590 500,600" fill="#64748b" />
                        
                        {/* Ogohlantirish yuborish */}
                        <rect x="400" y="600" width="200" height="60" rx="0" fill="#fee2e2" stroke="#7f1d1d" strokeWidth="2" />
                        <text x="500" y="630" textAnchor="middle" fontWeight="bold" fill="#0f172a">Ogohlantirish</text>
                        <text x="500" y="650" textAnchor="middle" fontWeight="bold" fill="#0f172a">yuborish</text>
                        
                        {/* Strelka normaldan */}
                        <line x1="200" y1="560" x2="200" y2="700" stroke="#64748b" strokeWidth="2" />
                        <line x1="200" y1="700" x2="350" y2="700" stroke="#64748b" strokeWidth="2" />
                        <polygon points="345,695 355,705 350,710" fill="#64748b" />
                        
                        {/* Strelka anomaliyadan */}
                        <line x1="500" y1="660" x2="500" y2="700" stroke="#64748b" strokeWidth="2" />
                        <line x1="500" y1="700" x2="350" y2="700" stroke="#64748b" strokeWidth="2" />
                        <polygon points="355,695 345,705 350,710" fill="#64748b" />
                        
                        {/* Natijani logga yozish */}
                        <rect x="250" y="700" width="200" height="60" rx="0" fill="#dbeafe" stroke="#0c4a6e" strokeWidth="2" />
                        <text x="350" y="730" textAnchor="middle" fontWeight="bold" fill="#0f172a">Natijani logga</text>
                        <text x="350" y="750" textAnchor="middle" fontWeight="bold" fill="#0f172a">yozish</text>
                        
                        {/* Yakunlash */}
                        <line x1="350" y1="760" x2="350" y2="790" stroke="#64748b" strokeWidth="2" />
                        <polygon points="345,790 355,790 350,800" fill="#64748b" />
                        
                        {/* Algoritm tugashi */}
                        <ellipse cx="350" cy="820" rx="80" ry="30" fill="#dbeafe" stroke="#0c4a6e" strokeWidth="2" />
                        <text x="350" y="825" textAnchor="middle" fontWeight="bold" fill="#0f172a">Yakunlash</text>
                      </svg>
                    </div>
                    
                    <div className="prose prose-blue max-w-none">
                      <h4>Algoritm vazifasi:</h4>
                      <p>
                        Ushbu algoritm suv omborlaridagi anomaliyalarni (kutilmagan o'zgarishlarni) kuzatish va aniqlash uchun mo'ljallangan.
                        Suv sathidagi tez o'zgarishlar, tarixiy ma'lumotlarga nisbatan chetlanishlar va boshqa anomaliyalarni aniqlaydi
                        va tegishli xizmatlarni ogohlantirishlar orqali xabardor qiladi.
                      </p>
                      
                      <h4>Asosiy bosqichlar:</h4>
                      <ol>
                        <li><strong>Ma'lumotlarni olish</strong> - Monitoring tizimidan joriy ko'rsatkichlarni olish</li>
                        <li><strong>Tarixiy ma'lumotlar bilan solishtirish</strong> - Joriy ko'rsatkichlarni o'tgan davrdagi ma'lumotlar bilan solishtirish</li>
                        <li><strong>O'zgarish darajasini hisoblash</strong> - Statistik modellar orqali chetlanish darajasini aniqlash</li>
                        <li><strong>Anomaliyani aniqlash</strong> - Belgilangan chegaralardan tashqarida bo'lgan o'zgarishlarni aniqlash</li>
                        <li><strong>Anomaliya darajasini aniqlash</strong> - Anomaliyaning jiddiylik darajasini hisoblash</li>
                        <li><strong>Ogohlantirish yuborish</strong> - Aniqlangan anomaliya haqida mas'ul shaxslarni xabardor qilish</li>
                      </ol>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="allocation" className="pt-6">
                <div className="space-y-6">
                  <div className="border p-4 rounded-lg bg-slate-50">
                    <h3 className="text-lg font-medium mb-2 text-center">Suv taqsimoti optimallash algoritmi</h3>
                    <p className="text-sm text-gray-500 mb-4 text-center">
                      Fermer va dehqonlar uchun suv taqsimotini ekin turlari va maydonga qarab optimallash
                    </p>
                    
                    <div className="w-full overflow-x-auto mb-4 flex justify-center">
                      <svg width="700" height="850" viewBox="0 0 700 850">
                        {/* Algoritm boshi */}
                        <ellipse cx="350" cy="30" rx="80" ry="30" fill="#e0f2fe" stroke="#0c4a6e" strokeWidth="2" />
                        <text x="350" y="35" textAnchor="middle" fontWeight="bold" fill="#0f172a">Boshlash</text>
                        
                        {/* Strelka */}
                        <line x1="350" y1="60" x2="350" y2="90" stroke="#64748b" strokeWidth="2" />
                        <polygon points="345,90 355,90 350,100" fill="#64748b" />
                        
                        {/* Fermer ma'lumotlarini olish */}
                        <rect x="250" y="100" width="200" height="60" rx="0" fill="#e0f2fe" stroke="#0c4a6e" strokeWidth="2" />
                        <text x="350" y="130" textAnchor="middle" fontWeight="bold" fill="#0f172a">Fermer ma'lumotlarini</text>
                        <text x="350" y="150" textAnchor="middle" fontWeight="bold" fill="#0f172a">olish</text>
                        
                        {/* Strelka */}
                        <line x1="350" y1="160" x2="350" y2="190" stroke="#64748b" strokeWidth="2" />
                        <polygon points="345,190 355,190 350,200" fill="#64748b" />
                        
                        {/* Ekin turlari va maydon haqida ma'lumot */}
                        <rect x="250" y="200" width="200" height="60" rx="0" fill="#e0f2fe" stroke="#0c4a6e" strokeWidth="2" />
                        <text x="350" y="230" textAnchor="middle" fontWeight="bold" fill="#0f172a">Ekin turlari va</text>
                        <text x="350" y="250" textAnchor="middle" fontWeight="bold" fill="#0f172a">maydon haqida ma'lumot</text>
                        
                        {/* Strelka */}
                        <line x1="350" y1="260" x2="350" y2="290" stroke="#64748b" strokeWidth="2" />
                        <polygon points="345,290 355,290 350,300" fill="#64748b" />
                        
                        {/* Suv talabini hisoblash */}
                        <rect x="250" y="300" width="200" height="60" rx="0" fill="#e0f2fe" stroke="#0c4a6e" strokeWidth="2" />
                        <text x="350" y="330" textAnchor="middle" fontWeight="bold" fill="#0f172a">Ekinlar uchun suv</text>
                        <text x="350" y="350" textAnchor="middle" fontWeight="bold" fill="#0f172a">talabini hisoblash</text>
                        
                        {/* Strelka */}
                        <line x1="350" y1="360" x2="350" y2="390" stroke="#64748b" strokeWidth="2" />
                        <polygon points="345,390 355,390 350,400" fill="#64748b" />
                        
                        {/* Mavjud suv resurslarini tekshirish */}
                        <rect x="250" y="400" width="200" height="60" rx="0" fill="#e0f2fe" stroke="#0c4a6e" strokeWidth="2" />
                        <text x="350" y="430" textAnchor="middle" fontWeight="bold" fill="#0f172a">Mavjud suv resurslarini</text>
                        <text x="350" y="450" textAnchor="middle" fontWeight="bold" fill="#0f172a">tekshirish</text>
                        
                        {/* Strelka */}
                        <line x1="350" y1="460" x2="350" y2="490" stroke="#64748b" strokeWidth="2" />
                        <polygon points="345,490 355,490 350,500" fill="#64748b" />
                        
                        {/* Suv yetarlimi? */}
                        <polygon points="350,500 275,550 425,550" fill="#e0f2fe" stroke="#0c4a6e" strokeWidth="2" />
                        <text x="350" y="530" textAnchor="middle" fontWeight="bold" fill="#0f172a">Suv</text>
                        <text x="350" y="550" textAnchor="middle" fontWeight="bold" fill="#0f172a">yetarlimi?</text>
                        
                        {/* Yo'q yo'nalish */}
                        <line x1="275" y1="550" x2="175" y2="600" stroke="#64748b" strokeWidth="2" />
                        <polygon points="180,595 170,605 180,608" fill="#64748b" />
                        <text x="220" y="560" textAnchor="middle" fontSize="12" fill="#7f1d1d">Yo'q</text>
                        
                        {/* Optimallash algoritmi */}
                        <rect x="100" y="600" width="150" height="60" rx="0" fill="#fee2e2" stroke="#7f1d1d" strokeWidth="2" />
                        <text x="175" y="630" textAnchor="middle" fontWeight="bold" fill="#0f172a">Cheklangan suv uchun</text>
                        <text x="175" y="650" textAnchor="middle" fontWeight="bold" fill="#0f172a">optimallash</text>
                        
                        {/* Ha yo'nalish */}
                        <line x1="425" y1="550" x2="525" y2="600" stroke="#64748b" strokeWidth="2" />
                        <polygon points="520,595 530,605 525,608" fill="#64748b" />
                        <text x="480" y="560" textAnchor="middle" fontSize="12" fill="#15803d">Ha</text>
                        
                        {/* To'liq suv ajratish */}
                        <rect x="450" y="600" width="150" height="60" rx="0" fill="#dcfce7" stroke="#166534" strokeWidth="2" />
                        <text x="525" y="630" textAnchor="middle" fontWeight="bold" fill="#0f172a">To'liq suv</text>
                        <text x="525" y="650" textAnchor="middle" fontWeight="bold" fill="#0f172a">ajratish</text>
                        
                        {/* Strelka optimallashdan */}
                        <line x1="175" y1="660" x2="175" y2="700" stroke="#64748b" strokeWidth="2" />
                        <line x1="175" y1="700" x2="350" y2="700" stroke="#64748b" strokeWidth="2" />
                        <polygon points="345,695 355,705 350,710" fill="#64748b" />
                        
                        {/* Strelka to'liq suzdan */}
                        <line x1="525" y1="660" x2="525" y2="700" stroke="#64748b" strokeWidth="2" />
                        <line x1="525" y1="700" x2="350" y2="700" stroke="#64748b" strokeWidth="2" />
                        <polygon points="355,695 345,705 350,710" fill="#64748b" />
                        
                        {/* Taqsimot jadvalini yaratish */}
                        <rect x="250" y="700" width="200" height="60" rx="0" fill="#e0f2fe" stroke="#0c4a6e" strokeWidth="2" />
                        <text x="350" y="730" textAnchor="middle" fontWeight="bold" fill="#0f172a">Suv taqsimoti</text>
                        <text x="350" y="750" textAnchor="middle" fontWeight="bold" fill="#0f172a">jadvalini yaratish</text>
                        
                        {/* Strelka */}
                        <line x1="350" y1="760" x2="350" y2="790" stroke="#64748b" strokeWidth="2" />
                        <polygon points="345,790 355,790 350,800" fill="#64748b" />
                        
                        {/* Xabar yuborish */}
                        <rect x="250" y="800" width="200" height="60" rx="0" fill="#e0f2fe" stroke="#0c4a6e" strokeWidth="2" />
                        <text x="350" y="830" textAnchor="middle" fontWeight="bold" fill="#0f172a">Fermerlarga xabar</text>
                        <text x="350" y="850" textAnchor="middle" fontWeight="bold" fill="#0f172a">yuborish</text>
                        
                        {/* Yakunlash */}
                        <line x1="350" y1="860" x2="350" y2="890" stroke="#64748b" strokeWidth="2" />
                        <polygon points="345,890 355,890 350,900" fill="#64748b" />
                        
                        {/* Algoritm tugashi */}
                        <ellipse cx="350" cy="920" rx="80" ry="30" fill="#e0f2fe" stroke="#0c4a6e" strokeWidth="2" />
                        <text x="350" y="925" textAnchor="middle" fontWeight="bold" fill="#0f172a">Yakunlash</text>
                      </svg>
                    </div>
                    
                    <div className="prose prose-blue max-w-none">
                      <h4>Algoritm vazifasi:</h4>
                      <p>
                        Ushbu algoritm fermerlar va dehqonlar uchun suvni adolatli va samarali taqsimlash vazifasini bajaradi. 
                        Har bir fermerning yetishtiraётgan ekin turi, yer maydoni o'lchami va irrigatsiya usuli kabi omillarni
                        hisobga olgan holda optimal suv taqsimoti jadvalini shakllantiradi.
                      </p>
                      
                      <h4>Asosiy bosqichlar:</h4>
                      <ol>
                        <li><strong>Fermer ma'lumotlarini olish</strong> - Barcha fermerlar haqidagi asosiy ma'lumotlarni olish</li>
                        <li><strong>Ekin turlari va maydon haqida ma'lumot</strong> - Yer maydoni va ekin turlari bo'yicha ma'lumotlarni yig'ish</li>
                        <li><strong>Suv talabini hisoblash</strong> - Har bir ekin turi uchun maydon birligiga kerak bo'ladigan suv miqdorini hisoblash</li>
                        <li><strong>Mavjud suv resurslarini tekshirish</strong> - Omborda mavjud bo'lgan suv miqdorini aniqlash</li>
                        <li><strong>Suv yetarliligini tekshirish</strong> - Mavjud suv barcha ehtiyojlar uchun yetarli yoki yetarli emasligini aniqlash</li>
                        <li><strong>Optimallash</strong> - Suv yetarli bo'lmagan holda ekin turlariga qarab suv taqsimotini optimallash</li>
                        <li><strong>Taqsimot jadvalini yaratish</strong> - Har bir fermer uchun suv berilish jadvalini shakllantirish</li>
                        <li><strong>Xabar yuborish</strong> - Fermerlarga sms yoki tizim orqali xabar yuborish</li>
                      </ol>
                    </div>
                  </div>
                  
                  <div className="border p-4 rounded-lg bg-slate-50">
                    <h3 className="text-lg font-medium mb-2 text-center">Suv so'rovlarini qayta ishlash algoritmi</h3>
                    <p className="text-sm text-gray-500 mb-4 text-center">
                      Fermerlarning suv so'rovlarini qayta ishlash va javob berish jarayoni
                    </p>
                    
                    <div className="w-full overflow-x-auto mb-4 flex justify-center">
                      <svg width="700" height="750" viewBox="0 0 700 750">
                        {/* Algoritm boshi */}
                        <ellipse cx="350" cy="30" rx="80" ry="30" fill="#e0f2fe" stroke="#0c4a6e" strokeWidth="2" />
                        <text x="350" y="35" textAnchor="middle" fontWeight="bold" fill="#0f172a">Boshlash</text>
                        
                        {/* Strelka */}
                        <line x1="350" y1="60" x2="350" y2="90" stroke="#64748b" strokeWidth="2" />
                        <polygon points="345,90 355,90 350,100" fill="#64748b" />
                        
                        {/* Suv so'rovlarini qabul qilish */}
                        <rect x="250" y="100" width="200" height="60" rx="0" fill="#e0f2fe" stroke="#0c4a6e" strokeWidth="2" />
                        <text x="350" y="130" textAnchor="middle" fontWeight="bold" fill="#0f172a">Fermerlardan suv</text>
                        <text x="350" y="150" textAnchor="middle" fontWeight="bold" fill="#0f172a">so'rovlarini qabul qilish</text>
                        
                        {/* Strelka */}
                        <line x1="350" y1="160" x2="350" y2="190" stroke="#64748b" strokeWidth="2" />
                        <polygon points="345,190 355,190 350,200" fill="#64748b" />
                        
                        {/* So'rovlarni tekshirish */}
                        <rect x="250" y="200" width="200" height="60" rx="0" fill="#e0f2fe" stroke="#0c4a6e" strokeWidth="2" />
                        <text x="350" y="230" textAnchor="middle" fontWeight="bold" fill="#0f172a">So'rov ma'lumotlarini</text>
                        <text x="350" y="250" textAnchor="middle" fontWeight="bold" fill="#0f172a">tekshirish</text>
                        
                        {/* Strelka */}
                        <line x1="350" y1="260" x2="350" y2="290" stroke="#64748b" strokeWidth="2" />
                        <polygon points="345,290 355,290 350,300" fill="#64748b" />
                        
                        {/* Ma'lumotlar to'g'rimi? */}
                        <polygon points="350,300 275,350 425,350" fill="#e0f2fe" stroke="#0c4a6e" strokeWidth="2" />
                        <text x="350" y="330" textAnchor="middle" fontWeight="bold" fill="#0f172a">Ma'lumotlar</text>
                        <text x="350" y="350" textAnchor="middle" fontWeight="bold" fill="#0f172a">to'g'rimi?</text>
                        
                        {/* Yo'q yo'nalish */}
                        <line x1="275" y1="350" x2="200" y2="400" stroke="#64748b" strokeWidth="2" />
                        <polygon points="205,395 195,405 200,408" fill="#64748b" />
                        <text x="230" y="360" textAnchor="middle" fontSize="12" fill="#7f1d1d">Yo'q</text>
                        
                        {/* So'rovni qaytarish */}
                        <rect x="100" y="400" width="200" height="60" rx="0" fill="#fee2e2" stroke="#7f1d1d" strokeWidth="2" />
                        <text x="200" y="430" textAnchor="middle" fontWeight="bold" fill="#0f172a">Tuzatish uchun</text>
                        <text x="200" y="450" textAnchor="middle" fontWeight="bold" fill="#0f172a">so'rovni qaytarish</text>
                        
                        {/* So'rovni qaytarish -> Boshlash */}
                        <line x1="100" y1="430" x2="50" y2="430" stroke="#64748b" strokeWidth="2" />
                        <line x1="50" y1="430" x2="50" y2="130" stroke="#64748b" strokeWidth="2" />
                        <line x1="50" y1="130" x2="250" y2="130" stroke="#64748b" strokeWidth="2" />
                        <polygon points="245,125 255,135 250,140" fill="#64748b" />
                        
                        {/* Ha yo'nalish */}
                        <line x1="425" y1="350" x2="500" y2="400" stroke="#64748b" strokeWidth="2" />
                        <polygon points="495,395 505,405 500,408" fill="#64748b" />
                        <text x="470" y="360" textAnchor="middle" fontSize="12" fill="#15803d">Ha</text>
                        
                        {/* Mavjud suv resurslarini tekshirish */}
                        <rect x="400" y="400" width="200" height="60" rx="0" fill="#e0f2fe" stroke="#0c4a6e" strokeWidth="2" />
                        <text x="500" y="430" textAnchor="middle" fontWeight="bold" fill="#0f172a">Mavjud suv resurslarini</text>
                        <text x="500" y="450" textAnchor="middle" fontWeight="bold" fill="#0f172a">tekshirish</text>
                        
                        {/* Strelka */}
                        <line x1="500" y1="460" x2="500" y2="490" stroke="#64748b" strokeWidth="2" />
                        <polygon points="495,490 505,490 500,500" fill="#64748b" />
                        
                        {/* Suv yetarlimi? */}
                        <polygon points="500,500 425,550 575,550" fill="#e0f2fe" stroke="#0c4a6e" strokeWidth="2" />
                        <text x="500" y="535" textAnchor="middle" fontWeight="bold" fill="#0f172a">Suv yetarlimi?</text>
                        
                        {/* Yo'q yo'nalish */}
                        <line x1="425" y1="550" x2="350" y2="600" stroke="#64748b" strokeWidth="2" />
                        <polygon points="355,595 345,605 350,608" fill="#64748b" />
                        <text x="380" y="560" textAnchor="middle" fontSize="12" fill="#7f1d1d">Yo'q</text>
                        
                        {/* So'rovni rad etish */}
                        <rect x="250" y="600" width="200" height="60" rx="0" fill="#fee2e2" stroke="#7f1d1d" strokeWidth="2" />
                        <text x="350" y="630" textAnchor="middle" fontWeight="bold" fill="#0f172a">So'rovni rad etish</text>
                        <text x="350" y="650" textAnchor="middle" fontWeight="bold" fill="#0f172a">va sabab bildirish</text>
                        
                        {/* Ha yo'nalish */}
                        <line x1="575" y1="550" x2="650" y2="600" stroke="#64748b" strokeWidth="2" />
                        <polygon points="645,595 655,605 650,608" fill="#64748b" />
                        <text x="620" y="560" textAnchor="middle" fontSize="12" fill="#15803d">Ha</text>
                        
                        {/* So'rovni tasdiqlash */}
                        <rect x="550" y="600" width="200" height="60" rx="0" fill="#dcfce7" stroke="#166534" strokeWidth="2" />
                        <text x="650" y="630" textAnchor="middle" fontWeight="bold" fill="#0f172a">So'rovni tasdiqlash va</text>
                        <text x="650" y="650" textAnchor="middle" fontWeight="bold" fill="#0f172a">jadvalga qo'shish</text>
                        
                        {/* Strelka rad etishdan */}
                        <line x1="350" y1="660" x2="350" y2="700" stroke="#64748b" strokeWidth="2" />
                        <polygon points="345,700 355,700 350,710" fill="#64748b" />
                        
                        {/* Strelka tasdiqlashdan */}
                        <line x1="650" y1="660" x2="650" y2="680" stroke="#64748b" strokeWidth="2" />
                        <line x1="650" y1="680" x2="400" y2="680" stroke="#64748b" strokeWidth="2" />
                        <line x1="400" y1="680" x2="400" y2="700" stroke="#64748b" strokeWidth="2" />
                        <polygon points="395,700 405,700 400,710" fill="#64748b" />
                        
                        {/* Fermerlarga xabar yuborish */}
                        <rect x="250" y="700" width="200" height="60" rx="0" fill="#e0f2fe" stroke="#0c4a6e" strokeWidth="2" />
                        <text x="350" y="720" textAnchor="middle" fontWeight="bold" fill="#0f172a">Fermerlarga</text>
                        <text x="350" y="740" textAnchor="middle" fontWeight="bold" fill="#0f172a">xabar yuborish</text>
                        
                        {/* Algoritm tugashi */}
                        <line x1="350" y1="760" x2="350" y2="790" stroke="#64748b" strokeWidth="2" />
                        <polygon points="345,790 355,790 350,800" fill="#64748b" />
                        
                        {/* Yakunlash */}
                        <ellipse cx="350" cy="820" rx="80" ry="30" fill="#e0f2fe" stroke="#0c4a6e" strokeWidth="2" />
                        <text x="350" y="825" textAnchor="middle" fontWeight="bold" fill="#0f172a">Yakunlash</text>
                      </svg>
                    </div>
                    
                    <div className="prose prose-blue max-w-none">
                      <h4>Algoritm vazifasi:</h4>
                      <p>
                        Ushbu algoritm fermerlardan keladigan suv so'rovlarini qayta ishlash, tekshirish va ular bo'yicha qaror qabul qilish
                        jarayonini avtomatlashtiradi. Har bir so'rov ma'lumotlar to'g'riligi, mavjud suv resurslari va taqsimot jadvali
                        bo'yicha tekshiriladi va natijaga ko'ra tasdiqlash yoki rad etish qarorlari qabul qilinadi.
                      </p>
                      
                      <h4>Asosiy bosqichlar:</h4>
                      <ol>
                        <li><strong>So'rovlarni qabul qilish</strong> - Fermerlardan keladigan suv so'rovlarini tizimga qabul qilish</li>
                        <li><strong>Ma'lumotlarni tekshirish</strong> - So'rovdagi fermer ma'lumotlari, ekin va maydon ma'lumotlarini tekshirish</li>
                        <li><strong>To'g'rilik tekshiruvi</strong> - Ma'lumotlar to'g'ri bo'lmasa, so'rovni tuzatish uchun qaytarish</li>
                        <li><strong>Suv resurslarini tekshirish</strong> - So'ralgan miqdordagi suv mavjudligini tekshirish</li>
                        <li><strong>Suv yetarliligini tekshirish</strong> - Agar suv yetarli bo'lmasa, so'rovni rad etish</li>
                        <li><strong>So'rovni tasdiqlash</strong> - Agar suv yetarli bo'lsa, so'rovni tasdiqlash va taqsimot jadvaliga qo'shish</li>
                        <li><strong>Xabar yuborish</strong> - Fermerlarga so'rov natijasi haqida xabar yuborish</li>
                      </ol>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="forecast" className="pt-6">
                <div className="border p-4 rounded-lg bg-slate-50">
                  <h3 className="text-lg font-medium mb-2 text-center">LSTM asosida suv sarfini bashorat qilish algoritmi</h3>
                  <p className="text-sm text-gray-500 mb-4 text-center">
                    Suv ombori sathi, sarfi va oqimini kelajak uchun bashorat qilish
                  </p>
                  
                  <div className="w-full overflow-x-auto mb-4 flex justify-center">
                    <svg width="700" height="900" viewBox="0 0 700 900">
                      {/* Algoritm boshi */}
                      <ellipse cx="350" cy="30" rx="80" ry="30" fill="#dbeafe" stroke="#0e7490" strokeWidth="2" />
                      <text x="350" y="35" textAnchor="middle" fontWeight="bold" fill="#0f172a">Boshlash</text>
                      
                      {/* Strelka */}
                      <line x1="350" y1="60" x2="350" y2="90" stroke="#64748b" strokeWidth="2" />
                      <polygon points="345,90 355,90 350,100" fill="#64748b" />
                      
                      {/* Tarixiy ma'lumotlarni yig'ish */}
                      <rect x="250" y="100" width="200" height="60" rx="0" fill="#dbeafe" stroke="#0e7490" strokeWidth="2" />
                      <text x="350" y="130" textAnchor="middle" fontWeight="bold" fill="#0f172a">Tarixiy ma'lumotlarni</text>
                      <text x="350" y="150" textAnchor="middle" fontWeight="bold" fill="#0f172a">yig'ish</text>
                      
                      {/* Strelka */}
                      <line x1="350" y1="160" x2="350" y2="190" stroke="#64748b" strokeWidth="2" />
                      <polygon points="345,190 355,190 350,200" fill="#64748b" />
                      
                      {/* Ma'lumotlarni tozalash */}
                      <rect x="250" y="200" width="200" height="60" rx="0" fill="#dbeafe" stroke="#0e7490" strokeWidth="2" />
                      <text x="350" y="230" textAnchor="middle" fontWeight="bold" fill="#0f172a">Ma'lumotlarni tozalash</text>
                      <text x="350" y="250" textAnchor="middle" fontWeight="bold" fill="#0f172a">va normallash</text>
                      
                      {/* Strelka */}
                      <line x1="350" y1="260" x2="350" y2="290" stroke="#64748b" strokeWidth="2" />
                      <polygon points="345,290 355,290 350,300" fill="#64748b" />
                      
                      {/* O'qitish/sinov ma'lumotlarini ajratish */}
                      <rect x="250" y="300" width="200" height="60" rx="0" fill="#dbeafe" stroke="#0e7490" strokeWidth="2" />
                      <text x="350" y="330" textAnchor="middle" fontWeight="bold" fill="#0f172a">O'qitish/sinov uchun</text>
                      <text x="350" y="350" textAnchor="middle" fontWeight="bold" fill="#0f172a">ma'lumotlarni ajratish</text>
                      
                      {/* Strelka */}
                      <line x1="350" y1="360" x2="350" y2="390" stroke="#64748b" strokeWidth="2" />
                      <polygon points="345,390 355,390 350,400" fill="#64748b" />
                      
                      {/* LSTM modelini yaratish */}
                      <rect x="250" y="400" width="200" height="60" rx="0" fill="#dbeafe" stroke="#0e7490" strokeWidth="2" />
                      <text x="350" y="430" textAnchor="middle" fontWeight="bold" fill="#0f172a">LSTM modelini</text>
                      <text x="350" y="450" textAnchor="middle" fontWeight="bold" fill="#0f172a">yaratish</text>
                      
                      {/* Strelka */}
                      <line x1="350" y1="460" x2="350" y2="490" stroke="#64748b" strokeWidth="2" />
                      <polygon points="345,490 355,490 350,500" fill="#64748b" />
                      
                      {/* Modelni o'qitish */}
                      <rect x="250" y="500" width="200" height="60" rx="0" fill="#dbeafe" stroke="#0e7490" strokeWidth="2" />
                      <text x="350" y="530" textAnchor="middle" fontWeight="bold" fill="#0f172a">Modelni</text>
                      <text x="350" y="550" textAnchor="middle" fontWeight="bold" fill="#0f172a">o'qitish</text>
                      
                      {/* Strelka */}
                      <line x1="350" y1="560" x2="350" y2="590" stroke="#64748b" strokeWidth="2" />
                      <polygon points="345,590 355,590 350,600" fill="#64748b" />
                      
                      {/* Modelni sinash */}
                      <rect x="250" y="600" width="200" height="60" rx="0" fill="#dbeafe" stroke="#0e7490" strokeWidth="2" />
                      <text x="350" y="630" textAnchor="middle" fontWeight="bold" fill="#0f172a">Modelni</text>
                      <text x="350" y="650" textAnchor="middle" fontWeight="bold" fill="#0f172a">sinash</text>
                      
                      {/* Strelka */}
                      <line x1="350" y1="660" x2="350" y2="690" stroke="#64748b" strokeWidth="2" />
                      <polygon points="345,690 355,690 350,700" fill="#64748b" />
                      
                      {/* Model yetarlicha aniqmi? */}
                      <polygon points="350,700 275,750 425,750" fill="#dbeafe" stroke="#0e7490" strokeWidth="2" />
                      <text x="350" y="735" textAnchor="middle" fontWeight="bold" fill="#0f172a">Model aniqlik</text>
                      <text x="350" y="755" textAnchor="middle" fontWeight="bold" fill="#0f172a">darajasi yetarlimi?</text>
                      
                      {/* Yo'q yo'nalish */}
                      <line x1="275" y1="750" x2="175" y2="800" stroke="#64748b" strokeWidth="2" />
                      <polygon points="180,795 170,805 175,810" fill="#64748b" />
                      <text x="220" y="760" textAnchor="middle" fontSize="12" fill="#7f1d1d">Yo'q</text>
                      
                      {/* Modelni sozlash */}
                      <rect x="100" y="800" width="150" height="60" rx="0" fill="#dbeafe" stroke="#0e7490" strokeWidth="2" />
                      <text x="175" y="830" textAnchor="middle" fontWeight="bold" fill="#0f172a">Modelni</text>
                      <text x="175" y="850" textAnchor="middle" fontWeight="bold" fill="#0f172a">sozlash</text>
                      
                      {/* Modelni sozlash -> Modelni o'qitish */}
                      <line x1="100" y1="830" x2="50" y2="830" stroke="#64748b" strokeWidth="2" />
                      <line x1="50" y1="830" x2="50" y2="530" stroke="#64748b" strokeWidth="2" />
                      <line x1="50" y1="530" x2="250" y2="530" stroke="#64748b" strokeWidth="2" />
                      <polygon points="245,525 255,535 250,540" fill="#64748b" />
                      
                      {/* Ha yo'nalish */}
                      <line x1="425" y1="750" x2="525" y2="800" stroke="#64748b" strokeWidth="2" />
                      <polygon points="520,795 530,805 525,810" fill="#64748b" />
                      <text x="480" y="760" textAnchor="middle" fontSize="12" fill="#15803d">Ha</text>
                      
                      {/* Bashorat natijasini hisoblash */}
                      <rect x="450" y="800" width="150" height="60" rx="0" fill="#dbeafe" stroke="#0e7490" strokeWidth="2" />
                      <text x="525" y="830" textAnchor="middle" fontWeight="bold" fill="#0f172a">Bashorat natijasini</text>
                      <text x="525" y="850" textAnchor="middle" fontWeight="bold" fill="#0f172a">hisoblash</text>
                      
                      {/* Strelka bashoratdan */}
                      <line x1="525" y1="860" x2="525" y2="880" stroke="#64748b" strokeWidth="2" />
                      <line x1="525" y1="880" x2="350" y2="880" stroke="#64748b" strokeWidth="2" />
                      <polygon points="355,875 345,885 350,890" fill="#64748b" />
                      
                      {/* Natijalarni vizuallash */}
                      <rect x="250" y="880" width="200" height="60" rx="0" fill="#dbeafe" stroke="#0e7490" strokeWidth="2" />
                      <text x="350" y="910" textAnchor="middle" fontWeight="bold" fill="#0f172a">Natijalarni vizuallash</text>
                      <text x="350" y="930" textAnchor="middle" fontWeight="bold" fill="#0f172a">va hisobot yaratish</text>
                      
                      {/* Yakunlash */}
                      <line x1="350" y1="940" x2="350" y2="970" stroke="#64748b" strokeWidth="2" />
                      <polygon points="345,970 355,970 350,980" fill="#64748b" />
                      
                      {/* Algoritm tugashi */}
                      <ellipse cx="350" cy="1000" rx="80" ry="30" fill="#dbeafe" stroke="#0e7490" strokeWidth="2" />
                      <text x="350" y="1005" textAnchor="middle" fontWeight="bold" fill="#0f172a">Yakunlash</text>
                    </svg>
                  </div>
                  
                  <div className="prose prose-blue max-w-none">
                    <h4>Algoritm vazifasi:</h4>
                    <p>
                      Ushbu algoritm LSTM (Long Short-Term Memory) neyron tarmoqlari asosida suv ombori sathi va sarfini
                      bashorat qilish vazifasini bajaradi. Tarixiy ma'lumotlar asosida model o'qitiladi va 
                      kelajakdagi suv sathi, suv oqimi va suv hajmi prognozlari tayyorlanadi.
                    </p>
                    
                    <h4>Asosiy bosqichlar:</h4>
                    <ol>
                      <li><strong>Tarixiy ma'lumotlarni yig'ish</strong> - O'tgan davrlardagi suv sathi, oqimi va meteorologik ma'lumotlarni to'plash</li>
                      <li><strong>Ma'lumotlarni tozalash</strong> - Xato ma'lumotlarni aniqlash, tasodifiy shovqinlarni filtrlash va ma'lumotlarni normallash</li>
                      <li><strong>Ma'lumotlarni ajratish</strong> - Ma'lumotlarni o'qitish (70-80%) va sinov (20-30%) to'plamlariga ajratish</li>
                      <li><strong>LSTM modelini yaratish</strong> - Neyron tarmoq arxitekturasini loyihalash va model qatlamlarini shakllantirish</li>
                      <li><strong>Modelni o'qitish</strong> - O'qitish to'plami orqali modelni tarixiy ma'lumotlarga moslash</li>
                      <li><strong>Modelni sinash</strong> - Sinov to'plami orqali modelning aniqligini tekshirish</li>
                      <li><strong>Aniqlik tekshiruvi</strong> - Model aniqligini baholash va kerak bo'lsa, modelni sozlash</li>
                      <li><strong>Bashorat natijasini hisoblash</strong> - Kelgusi davr uchun suv sathi va sarfi prognozlarini tayyorlash</li>
                      <li><strong>Natijalarni vizuallash</strong> - Bashorat natijalarini grafiklar va jadvallar ko'rinishida namoyish etish</li>
                    </ol>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="security" className="pt-6">
                <div className="border p-4 rounded-lg bg-slate-50">
                  <h3 className="text-lg font-medium mb-2 text-center">Suv ombori xavfsizlik monitoring algoritmi</h3>
                  <p className="text-sm text-gray-500 mb-4 text-center">
                    Suv omborlarida xavfsizlik monitoringini amalga oshirish
                  </p>
                  
                  <div className="w-full overflow-x-auto mb-4 flex justify-center">
                    <svg width="700" height="850" viewBox="0 0 700 850">
                      {/* Algoritm boshi */}
                      <ellipse cx="350" cy="30" rx="80" ry="30" fill="#fee2e2" stroke="#7f1d1d" strokeWidth="2" />
                      <text x="350" y="35" textAnchor="middle" fontWeight="bold" fill="#0f172a">Boshlash</text>
                      
                      {/* Strelka */}
                      <line x1="350" y1="60" x2="350" y2="90" stroke="#64748b" strokeWidth="2" />
                      <polygon points="345,90 355,90 350,100" fill="#64748b" />
                      
                      {/* Xavfsizlik parametrlarini tekshirish */}
                      <rect x="250" y="100" width="200" height="60" rx="0" fill="#fee2e2" stroke="#7f1d1d" strokeWidth="2" />
                      <text x="350" y="130" textAnchor="middle" fontWeight="bold" fill="#0f172a">Xavfsizlik parametrlarini</text>
                      <text x="350" y="150" textAnchor="middle" fontWeight="bold" fill="#0f172a">tekshirish</text>
                      
                      {/* Strelka */}
                      <line x1="350" y1="160" x2="350" y2="190" stroke="#64748b" strokeWidth="2" />
                      <polygon points="345,190 355,190 350,200" fill="#64748b" />
                      
                      {/* Toshqin xavfi tekshiruvi */}
                      <rect x="250" y="200" width="200" height="60" rx="0" fill="#fee2e2" stroke="#7f1d1d" strokeWidth="2" />
                      <text x="350" y="230" textAnchor="middle" fontWeight="bold" fill="#0f172a">Toshqin xavfi</text>
                      <text x="350" y="250" textAnchor="middle" fontWeight="bold" fill="#0f172a">tekshiruvi</text>
                      
                      {/* Strelka */}
                      <line x1="350" y1="260" x2="350" y2="290" stroke="#64748b" strokeWidth="2" />
                      <polygon points="345,290 355,290 350,300" fill="#64748b" />
                      
                      {/* Toshqin xavfi bormi? */}
                      <polygon points="350,300 275,350 425,350" fill="#fee2e2" stroke="#7f1d1d" strokeWidth="2" />
                      <text x="350" y="335" textAnchor="middle" fontWeight="bold" fill="#0f172a">Toshqin xavfi</text>
                      <text x="350" y="355" textAnchor="middle" fontWeight="bold" fill="#0f172a">mavjudmi?</text>
                      
                      {/* Yo'q yo'nalish */}
                      <line x1="275" y1="350" x2="175" y2="400" stroke="#64748b" strokeWidth="2" />
                      <polygon points="180,395 170,405 175,408" fill="#64748b" />
                      <text x="220" y="360" textAnchor="middle" fontSize="12" fill="#7f1d1d">Yo'q</text>
                      
                      {/* Ha yo'nalish */}
                      <line x1="425" y1="350" x2="525" y2="400" stroke="#64748b" strokeWidth="2" />
                      <polygon points="520,395 530,405 525,408" fill="#64748b" />
                      <text x="480" y="360" textAnchor="middle" fontSize="12" fill="#15803d">Ha</text>
                      
                      {/* Toshqinga qarshi choralar */}
                      <rect x="425" y="400" width="200" height="60" rx="0" fill="#fee2e2" stroke="#7f1d1d" strokeWidth="2" />
                      <text x="525" y="430" textAnchor="middle" fontWeight="bold" fill="#0f172a">Toshqinga qarshi</text>
                      <text x="525" y="450" textAnchor="middle" fontWeight="bold" fill="#0f172a">choralar ko'rish</text>
                      
                      {/* Qurilma nosozligi tekshiruvi */}
                      <rect x="75" y="400" width="200" height="60" rx="0" fill="#fee2e2" stroke="#7f1d1d" strokeWidth="2" />
                      <text x="175" y="430" textAnchor="middle" fontWeight="bold" fill="#0f172a">Qurilma nosozligi</text>
                      <text x="175" y="450" textAnchor="middle" fontWeight="bold" fill="#0f172a">tekshiruvi</text>
                      
                      {/* Strelka */}
                      <line x1="175" y1="460" x2="175" y2="490" stroke="#64748b" strokeWidth="2" />
                      <polygon points="170,490 180,490 175,500" fill="#64748b" />
                      
                      {/* Nosozlik bormi? */}
                      <polygon points="175,500 100,550 250,550" fill="#fee2e2" stroke="#7f1d1d" strokeWidth="2" />
                      <text x="175" y="535" textAnchor="middle" fontWeight="bold" fill="#0f172a">Nosozlik</text>
                      <text x="175" y="555" textAnchor="middle" fontWeight="bold" fill="#0f172a">bormi?</text>
                      
                      {/* Yo'q yo'nalish */}
                      <line x1="100" y1="550" x2="50" y2="600" stroke="#64748b" strokeWidth="2" />
                      <polygon points="55,595 45,605 50,608" fill="#64748b" />
                      <text x="70" y="560" textAnchor="middle" fontSize="12" fill="#7f1d1d">Yo'q</text>
                      
                      {/* Ha yo'nalish */}
                      <line x1="250" y1="550" x2="300" y2="600" stroke="#64748b" strokeWidth="2" />
                      <polygon points="295,595 305,605 300,608" fill="#64748b" />
                      <text x="280" y="560" textAnchor="middle" fontSize="12" fill="#15803d">Ha</text>
                      
                      {/* Qurilmani ta'mirlash */}
                      <rect x="200" y="600" width="200" height="60" rx="0" fill="#fee2e2" stroke="#7f1d1d" strokeWidth="2" />
                      <text x="300" y="630" textAnchor="middle" fontWeight="bold" fill="#0f172a">Qurilmani ta'mirlash</text>
                      <text x="300" y="650" textAnchor="middle" fontWeight="bold" fill="#0f172a">va qayta ishga tushirish</text>
                      
                      {/* Normal ishlash */}
                      <rect x="0" y="600" width="100" height="60" rx="0" fill="#dcfce7" stroke="#166534" strokeWidth="2" />
                      <text x="50" y="630" textAnchor="middle" fontWeight="bold" fill="#0f172a">Normal</text>
                      <text x="50" y="650" textAnchor="middle" fontWeight="bold" fill="#0f172a">ishlash</text>
                      
                      {/* Strelka normal ishlashdan */}
                      <line x1="50" y1="660" x2="50" y2="700" stroke="#64748b" strokeWidth="2" />
                      <line x1="50" y1="700" x2="350" y2="700" stroke="#64748b" strokeWidth="2" />
                      <polygon points="345,695 355,705 350,710" fill="#64748b" />
                      
                      {/* Strelka toshqin choralardan */}
                      <line x1="525" y1="460" x2="525" y2="700" stroke="#64748b" strokeWidth="2" />
                      <line x1="525" y1="700" x2="350" y2="700" stroke="#64748b" strokeWidth="2" />
                      <polygon points="355,695 345,705 350,710" fill="#64748b" />
                      
                      {/* Strelka qurilma ta'mirlashdan */}
                      <line x1="300" y1="660" x2="300" y2="700" stroke="#64748b" strokeWidth="2" />
                      <line x1="300" y1="700" x2="350" y2="700" stroke="#64748b" strokeWidth="2" />
                      <polygon points="345,695 355,705 350,710" fill="#64748b" />
                      
                      {/* Hisobot yaratish */}
                      <rect x="250" y="700" width="200" height="60" rx="0" fill="#fee2e2" stroke="#7f1d1d" strokeWidth="2" />
                      <text x="350" y="730" textAnchor="middle" fontWeight="bold" fill="#0f172a">Xavfsizlik holati</text>
                      <text x="350" y="750" textAnchor="middle" fontWeight="bold" fill="#0f172a">hisobotini yaratish</text>
                      
                      {/* Strelka */}
                      <line x1="350" y1="760" x2="350" y2="790" stroke="#64748b" strokeWidth="2" />
                      <polygon points="345,790 355,790 350,800" fill="#64748b" />
                      
                      {/* Tizimni yangilash */}
                      <rect x="250" y="800" width="200" height="60" rx="0" fill="#fee2e2" stroke="#7f1d1d" strokeWidth="2" />
                      <text x="350" y="830" textAnchor="middle" fontWeight="bold" fill="#0f172a">Xavfsizlik tizimini</text>
                      <text x="350" y="850" textAnchor="middle" fontWeight="bold" fill="#0f172a">yangilash</text>
                      
                      {/* Algoritm tugashi */}
                      <line x1="350" y1="860" x2="350" y2="890" stroke="#64748b" strokeWidth="2" />
                      <polygon points="345,890 355,890 350,900" fill="#64748b" />
                      
                      {/* Yakunlash */}
                      <ellipse cx="350" cy="920" rx="80" ry="30" fill="#fee2e2" stroke="#7f1d1d" strokeWidth="2" />
                      <text x="350" y="925" textAnchor="middle" fontWeight="bold" fill="#0f172a">Yakunlash</text>
                    </svg>
                  </div>
                  
                  <div className="prose prose-blue max-w-none">
                    <h4>Algoritm vazifasi:</h4>
                    <p>
                      Ushbu algoritm suv omborida xavfsizlik monitoringini amalga oshirish va xavfli vaziyatlarni aniqlash hamda
                      ularni bartaraf etish choralarini ko'rish vazifasini bajaradi. Suv ombori toshqin xavfi, 
                      qurilmalar nosozliklari va boshqa xavfsizlik parametrlari doimiy nazorat qilinadi.
                    </p>
                    
                    <h4>Asosiy bosqichlar:</h4>
                    <ol>
                      <li><strong>Xavfsizlik parametrlarini tekshirish</strong> - Suv ombori xavfsizligi uchun muhim barcha parametrlarni o'lchash</li>
                      <li><strong>Toshqin xavfi tekshiruvi</strong> - Suv ombori sathi va oqimini tahlil qilib, toshqin ehtimolini baholash</li>
                      <li><strong>Toshqinga qarshi choralar</strong> - Xavf aniqlanganda suv chiqarish shlyuzlarini boshqarish choralarini ko'rish</li>
                      <li><strong>Qurilma nosozligi tekshiruvi</strong> - Ombor qurilmalari, sensorlar va boshqaruv mexanizmlarini tekshirish</li>
                      <li><strong>Qurilmani ta'mirlash</strong> - Nosozliklar aniqlanganda ularni bartaraf etish choralarini ko'rish</li>
                      <li><strong>Hisobot yaratish</strong> - Xavfsizlik holati to'g'risida batafsil hisobot tayyorlash</li>
                      <li><strong>Tizimni yangilash</strong> - Xavfsizlik tizimini yangilash va keyingi tekshiruv vaqtini belgilash</li>
                    </ol>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Tizimning asosiy algoritmlari</CardTitle>
            <CardDescription>
              Suv omborlarini boshqarish tizimining yadro algoritmlari
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="border p-4 rounded-lg bg-slate-50">
                <h3 className="text-lg font-medium mb-2 text-center">Suv resurslari boshqaruvi avtomatlashtirilgan tizimi (SRBAT) asosiy algoritmi</h3>
                <p className="text-sm text-gray-500 mb-4 text-center">
                  Umumiy tizim ishlash algoritmi
                </p>
                
                <div className="w-full overflow-x-auto mb-4 flex justify-center">
                  <svg width="800" height="900" viewBox="0 0 800 900">
                    {/* Algoritm boshi */}
                    <ellipse cx="400" cy="30" rx="100" ry="30" fill="#dbeafe" stroke="#0c4a6e" strokeWidth="2" />
                    <text x="400" y="35" textAnchor="middle" fontWeight="bold" fill="#0f172a">Boshlash</text>
                    
                    {/* Strelka */}
                    <line x1="400" y1="60" x2="400" y2="90" stroke="#64748b" strokeWidth="2" />
                    <polygon points="395,90 405,90 400,100" fill="#64748b" />
                    
                    {/* Tizimni ishga tushirish */}
                    <rect x="300" y="100" width="200" height="60" rx="0" fill="#dbeafe" stroke="#0c4a6e" strokeWidth="2" />
                    <text x="400" y="130" textAnchor="middle" fontWeight="bold" fill="#0f172a">Suv boshqaruvi</text>
                    <text x="400" y="150" textAnchor="middle" fontWeight="bold" fill="#0f172a">tizimini ishga tushirish</text>
                    
                    {/* Strelka */}
                    <line x1="400" y1="160" x2="400" y2="190" stroke="#64748b" strokeWidth="2" />
                    <polygon points="395,190 405,190 400,200" fill="#64748b" />
                    
                    {/* Parametrlarni tekshirish */}
                    <rect x="300" y="200" width="200" height="60" rx="0" fill="#dbeafe" stroke="#0c4a6e" strokeWidth="2" />
                    <text x="400" y="230" textAnchor="middle" fontWeight="bold" fill="#0f172a">Barcha parametrlarni</text>
                    <text x="400" y="250" textAnchor="middle" fontWeight="bold" fill="#0f172a">tekshirish</text>
                    
                    {/* Strelka */}
                    <line x1="400" y1="260" x2="400" y2="290" stroke="#64748b" strokeWidth="2" />
                    <polygon points="395,290 405,290 400,300" fill="#64748b" />
                    
                    {/* Tizim parametrlari meyorida? */}
                    <polygon points="400,300 325,350 475,350" fill="#dbeafe" stroke="#0c4a6e" strokeWidth="2" />
                    <text x="400" y="330" textAnchor="middle" fontWeight="bold" fill="#0f172a">Tizim parametrlari</text>
                    <text x="400" y="350" textAnchor="middle" fontWeight="bold" fill="#0f172a">meyorida?</text>
                    
                    {/* Yo'q yo'nalish */}
                    <line x1="325" y1="350" x2="225" y2="400" stroke="#64748b" strokeWidth="2" />
                    <polygon points="230,395 220,405 225,408" fill="#64748b" />
                    <text x="270" y="360" textAnchor="middle" fontSize="12" fill="#7f1d1d">Yo'q</text>
                    
                    {/* Xatoliklarni tuzatish */}
                    <rect x="150" y="400" width="150" height="60" rx="0" fill="#fee2e2" stroke="#7f1d1d" strokeWidth="2" />
                    <text x="225" y="430" textAnchor="middle" fontWeight="bold" fill="#0f172a">Xatoliklarni</text>
                    <text x="225" y="450" textAnchor="middle" fontWeight="bold" fill="#0f172a">tuzatish</text>
                    
                    {/* Xatoliklarni tuzatish -> Tizimni ishga tushirish */}
                    <line x1="150" y1="430" x2="100" y2="430" stroke="#64748b" strokeWidth="2" />
                    <line x1="100" y1="430" x2="100" y2="130" stroke="#64748b" strokeWidth="2" />
                    <line x1="100" y1="130" x2="300" y2="130" stroke="#64748b" strokeWidth="2" />
                    <polygon points="295,125 305,135 300,138" fill="#64748b" />
                    
                    {/* Ha yo'nalish */}
                    <line x1="475" y1="350" x2="575" y2="400" stroke="#64748b" strokeWidth="2" />
                    <polygon points="570,395 580,405 575,408" fill="#64748b" />
                    <text x="530" y="360" textAnchor="middle" fontSize="12" fill="#15803d">Ha</text>
                    
                    {/* Monitoring tizimini ishga tushirish */}
                    <rect x="500" y="400" width="150" height="60" rx="0" fill="#dbeafe" stroke="#0c4a6e" strokeWidth="2" />
                    <text x="575" y="430" textAnchor="middle" fontWeight="bold" fill="#0f172a">Monitoring tizimini</text>
                    <text x="575" y="450" textAnchor="middle" fontWeight="bold" fill="#0f172a">ishga tushirish</text>
                    
                    {/* Strelka */}
                    <line x1="575" y1="460" x2="575" y2="490" stroke="#64748b" strokeWidth="2" />
                    <polygon points="570,490 580,490 575,500" fill="#64748b" />
                    
                    {/* Taqsimot tizimini ishga tushirish */}
                    <rect x="500" y="500" width="150" height="60" rx="0" fill="#e0f2fe" stroke="#0c4a6e" strokeWidth="2" />
                    <text x="575" y="530" textAnchor="middle" fontWeight="bold" fill="#0f172a">Taqsimot tizimini</text>
                    <text x="575" y="550" textAnchor="middle" fontWeight="bold" fill="#0f172a">ishga tushirish</text>
                    
                    {/* Strelka */}
                    <line x1="575" y1="560" x2="575" y2="590" stroke="#64748b" strokeWidth="2" />
                    <polygon points="570,590 580,590 575,600" fill="#64748b" />
                    
                    {/* Bashorat tizimini ishga tushirish */}
                    <rect x="500" y="600" width="150" height="60" rx="0" fill="#dbeafe" stroke="#0c4a6e" strokeWidth="2" />
                    <text x="575" y="630" textAnchor="middle" fontWeight="bold" fill="#0f172a">Bashorat tizimini</text>
                    <text x="575" y="650" textAnchor="middle" fontWeight="bold" fill="#0f172a">ishga tushirish</text>
                    
                    {/* Strelka */}
                    <line x1="575" y1="660" x2="575" y2="690" stroke="#64748b" strokeWidth="2" />
                    <polygon points="570,690 580,690 575,700" fill="#64748b" />
                    
                    {/* Xavfsizlik tizimini ishga tushirish */}
                    <rect x="500" y="700" width="150" height="60" rx="0" fill="#fee2e2" stroke="#7f1d1d" strokeWidth="2" />
                    <text x="575" y="730" textAnchor="middle" fontWeight="bold" fill="#0f172a">Xavfsizlik tizimini</text>
                    <text x="575" y="750" textAnchor="middle" fontWeight="bold" fill="#0f172a">ishga tushirish</text>
                    
                    {/* Strelka */}
                    <line x1="575" y1="760" x2="575" y2="780" stroke="#64748b" strokeWidth="2" />
                    <line x1="575" y1="780" x2="400" y2="780" stroke="#64748b" strokeWidth="2" />
                    <line x1="400" y1="780" x2="400" y2="800" stroke="#64748b" strokeWidth="2" />
                    <polygon points="395,800 405,800 400,810" fill="#64748b" />
                    
                    {/* Umumiy tizim monitoringi */}
                    <rect x="300" y="800" width="200" height="60" rx="0" fill="#dbeafe" stroke="#0c4a6e" strokeWidth="2" />
                    <text x="400" y="830" textAnchor="middle" fontWeight="bold" fill="#0f172a">Umumiy tizim</text>
                    <text x="400" y="850" textAnchor="middle" fontWeight="bold" fill="#0f172a">monitoring jarayoni</text>
                    
                    {/* Algoritm tugashi */}
                    <line x1="400" y1="860" x2="400" y2="890" stroke="#64748b" strokeWidth="2" />
                    <polygon points="395,890 405,890 400,900" fill="#64748b" />
                    
                    {/* Yakunlash */}
                    <ellipse cx="400" cy="920" rx="100" ry="30" fill="#dbeafe" stroke="#0c4a6e" strokeWidth="2" />
                    <text x="400" y="925" textAnchor="middle" fontWeight="bold" fill="#0f172a">Tugallanmaslik</text>
                  </svg>
                </div>
                
                <div className="prose prose-blue max-w-none">
                  <h4>Algoritm vazifasi:</h4>
                  <p>
                    Bu algoritm butun tizimning ishlashini ta'minlovchi asosiy algoritm. Tizimning barcha komponentlarini
                    ishga tushiradi, ularning o'zaro aloqasini ta'minlaydi va butun suv ombori boshqaruv tizimining
                    uzluksiz ishlashini nazorat qiladi.
                  </p>
                  
                  <h4>Asosiy bosqichlar:</h4>
                  <ol>
                    <li><strong>Tizimni ishga tushirish</strong> - Asosiy tizim komponentlarini ishga tushirish va sozlash</li>
                    <li><strong>Parametrlarni tekshirish</strong> - Tizim parametrlarining to'g'riligini tekshirish</li>
                    <li><strong>Xatoliklarni tuzatish</strong> - Aniqlangan xatoliklarni tuzatish va qayta o'rnatish</li>
                    <li><strong>Monitoring tizimini ishga tushirish</strong> - Suv ombori monitoring qurilmalarini ishga tushirish</li>
                    <li><strong>Taqsimot tizimini ishga tushirish</strong> - Suv taqsimoti algoritmlari va modullarini ishga tushirish</li>
                    <li><strong>Bashorat tizimini ishga tushirish</strong> - LSTM asosidagi bashorat modullarini ishga tushirish</li>
                    <li><strong>Xavfsizlik tizimini ishga tushirish</strong> - Xavfsizlik parametrlarini monitoring qiluvchi tizimni ishga tushirish</li>
                    <li><strong>Umumiy tizim monitoringi</strong> - Barcha tizim komponentlari ishlashini doimiy nazorat qilish</li>
                  </ol>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}