import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function AllAlgorithms() {
  return (
    <Card className="shadow-md">
      <CardHeader className="pb-2">
        <CardTitle>Suv omborlarini boshqarish tizimlari algoritmlari</CardTitle>
        <CardDescription>
          Tizimda ishlatiladigan barcha algoritmlar va ularning ishlash prinsiplari
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="monitoring" className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
            <TabsTrigger value="distribution">Taqsimlash</TabsTrigger>
            <TabsTrigger value="forecast">Bashorat</TabsTrigger>
            <TabsTrigger value="security">Xavfsizlik</TabsTrigger>
            <TabsTrigger value="database">Ma'lumotlar bazasi</TabsTrigger>
            <TabsTrigger value="network">Tarmoq</TabsTrigger>
          </TabsList>
          
          <TabsContent value="monitoring" className="pt-6">
            <div className="space-y-6">
              <div className="border p-4 rounded-lg bg-slate-50">
                <h3 className="text-lg font-medium mb-2 text-center">Suv sathini real vaqtda monitoring qilish algoritmi</h3>
                <p className="text-sm text-gray-500 mb-4 text-center">
                  Suv omborlaridagi suv sathini real vaqtda kuzatish va nazorat qilish algoritmi
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
                  <h4>Algoritm vazifasi va tushuntirish:</h4>
                  <p>
                    Bu algoritm suv omborlaridagi suv sathini real vaqtda monitoring qilish vazifasini bajaradi. 
                    Dastlab sensorlar holati tekshiriladi, agar ular to'g'ri ishlayotgan bo'lsa, suv sathi o'lchanadi. 
                    Olingan ma'lumotlar normallashtiriladi va markaziy serverga yuboriladi. Bu ma'lumotlar asosida 
                    suv sathi haqida hisobot yaratiladi.
                  </p>
                  
                  <p>
                    <strong>Asosiy bosqichlar:</strong>
                    <ul className="list-disc pl-5">
                      <li>Dastlab sensorlarning ishlash holati tekshiriladi</li>
                      <li>Agar sensorlar ishlamasa, texnik xizmat chaqiriladi</li>
                      <li>Sensorlar to'g'ri ishlayotgan bo'lsa, suv sathi o'lchanadi</li>
                      <li>Olingan ma'lumotlar normallashtiriladi</li>
                      <li>Ma'lumotlar markaziy serverga uzatiladi</li>
                      <li>Suv sathi haqida hisobot yaratiladi</li>
                    </ul>
                  </p>
                </div>
              </div>
              
              <div className="border p-4 rounded-lg bg-slate-50">
                <h3 className="text-lg font-medium mb-2 text-center">Anomaliyalarni aniqlash algoritmi</h3>
                <p className="text-sm text-gray-500 mb-4 text-center">
                  Suv sathidagi kutilmagan o'zgarishlarni aniqlash va ogohlantirish yuborish
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
                  <h4>Algoritm vazifasi va tushuntirish:</h4>
                  <p>
                    Bu algoritm suv sathidagi anomaliyalarni (kutilmagan o'zgarishlarni) aniqlash va tegishli xizmatlarni 
                    ogohlantirish uchun xizmat qiladi. Monitoring tizimidan olingan ma'lumotlar tarixiy ma'lumotlar bilan 
                    taqqoslanadi va statistik usullar orqali anomaliyalar aniqlanadi.
                  </p>
                  
                  <p>
                    <strong>Asosiy bosqichlar:</strong>
                    <ul className="list-disc pl-5">
                      <li>Monitoring tizimidan joriy ma'lumotlar olinadi</li>
                      <li>Olingan ma'lumotlar tarixiy ma'lumotlar bilan taqqoslanadi</li>
                      <li>O'zgarish darajasi hisoblanadi</li>
                      <li>Agar anomaliya aniqlansa, uning jiddiylik darajasi baholanadi</li>
                      <li>Anomaliya haqida ogohlantirish xabari yuboriladi</li>
                      <li>Barcha natijalar logga yoziladi</li>
                    </ul>
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="distribution" className="pt-6">
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
                <h4>Algoritm vazifasi va tushuntirish:</h4>
                <p>
                  Bu algoritm suv resurslarini fermerlar o'rtasida optimal tarzda taqsimlash vazifasini bajaradi. 
                  Har bir fermerning ekin turi, maydon hajmi, sug'orish usuli kabi ma'lumotlar asosida suv talab 
                  miqdori aniqlanadi va mavjud resurslarga qarab taqsimlanadi.
                </p>
                
                <p>
                  <strong>Asosiy bosqichlar:</strong>
                  <ul className="list-disc pl-5">
                    <li>Fermerlar haqida ma'lumotlar yig'iladi</li>
                    <li>Ekin turlariga qarab suv talabi hisoblanadi</li>
                    <li>Mavjud suv resurslari tekshiriladi</li>
                    <li>Agar suv yetarli bo'lsa, to'liq suv ajratiladi</li>
                    <li>Suv yetarli bo'lmasa, cheklangan suv uchun optimallash algoritmi ishlatiladi</li>
                    <li>Suv taqsimoti jadvali yaratiladi va fermerlarga xabar yuboriladi</li>
                  </ul>
                </p>
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
                <h4>Algoritm vazifasi va tushuntirish:</h4>
                <p>
                  Bu algoritm LSTM (Long Short-Term Memory) neyron tarmoqlari asosida suv ombori sathi va sarfini 
                  bashorat qilish vazifasini bajaradi. Tarixiy ma'lumotlardan foydalanib, model o'qitiladi va 
                  kelajakdagi suv sarfi va sathi bashorat qilinadi.
                </p>
                
                <p>
                  <strong>Asosiy bosqichlar:</strong>
                  <ul className="list-disc pl-5">
                    <li>Tarixiy ma'lumotlar to'planadi</li>
                    <li>Ma'lumotlar tozalanadi va normallashtiriladi</li>
                    <li>Ma'lumotlar o'qitish va sinov to'plamlariga ajratiladi</li>
                    <li>LSTM modeli yaratilib, o'qitiladi</li>
                    <li>Model sinov ma'lumotlari bilan tekshiriladi</li>
                    <li>Agar model yetarlicha aniq bo'lmasa, parametrlar sozlanadi va qayta o'qitiladi</li>
                    <li>Model yetarlicha aniq bo'lsa, kelajak uchun bashorat natijasi hisoblanadi</li>
                    <li>Natijalar vizuallashtiriladi va hisobot yaratiladi</li>
                  </ul>
                </p>
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
                <h4>Algoritm vazifasi va tushuntirish:</h4>
                <p>
                  Bu algoritm suv omborining xavfsizligini nazorat qilish va potensial xavflarni oldindan aniqlash 
                  vazifasini bajaradi. Asosiy xavf omillari - toshqin xavfi va qurilmalar nosozligi doimiy nazorat 
                  qilinadi.
                </p>
                
                <p>
                  <strong>Asosiy bosqichlar:</strong>
                  <ul className="list-disc pl-5">
                    <li>Asosiy xavfsizlik parametrlari tekshiriladi</li>
                    <li>Toshqin xavfi mavjudligi baholanadi</li>
                    <li>Xavf mavjud bo'lsa, tegishli choralar ko'riladi</li>
                    <li>Qurilmalar va sensorlarning ishlash holati tekshiriladi</li>
                    <li>Nosozlik aniqlansa, ta'mirlash ishlari amalga oshiriladi</li>
                    <li>Xavfsizlik holati to'g'risida hisobot yaratiladi</li>
                    <li>Xavfsizlik tizimi yangilanadi va keyingi tekshiruv grafigi tuziladi</li>
                  </ul>
                </p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="database" className="pt-6">
            <div className="border p-4 rounded-lg bg-slate-50">
              <h3 className="text-lg font-medium mb-2 text-center">Ma'lumotlar bazasini fragmentlash algoritmi</h3>
              <p className="text-sm text-gray-500 mb-4 text-center">
                Katta hajmdagi ma'lumotlarni samarali yuritish uchun fragmentlash jarayoni
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
              
              <div className="prose prose-blue max-w-none">
                <h4>Algoritm vazifasi va tushuntirish:</h4>
                <p>
                  Bu algoritm katta hajmdagi ma'lumotlarni samarali boshqarish va tezkor qidiruv imkoniyatini 
                  yaratish uchun ma'lumotlar bazasini fragmentlash jarayonini boshqaradi. Ma'lumotlar alohida 
                  mantiqiy qismlarga ajratilib, tegishli indekslar va kalit so'zlar bilan bog'lanadi.
                </p>
                
                <p>
                  <strong>Asosiy bosqichlar:</strong>
                  <ul className="list-disc pl-5">
                    <li>Ma'lumotlar bazasi tarkibi va tuzilishi tahlil qilinadi</li>
                    <li>Ma'lumotlar orasidagi bog'liqliklar aniqlanadi</li>
                    <li>Jadvallar mantiqiy qismlarga bo'linadi</li>
                    <li>Fragment qoidalari qo'llanadi</li>
                    <li>Ma'lumotlar fragmentlarga ajratiladi</li>
                    <li>Kalit so'zlar bilan indekslanadi</li>
                    <li>Fragmentlar umumiy ko'rinishga birlashtiriladi</li>
                    <li>Sikl takrorlanadi, barcha jadvallar bo'linguncha</li>
                  </ul>
                </p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="network" className="pt-6">
            <div className="border p-4 rounded-lg bg-slate-50">
              <h3 className="text-lg font-medium mb-2 text-center">Real vaqtda ma'lumotlar uzatish algoritmi (WebSocket)</h3>
              <p className="text-sm text-gray-500 mb-4 text-center">
                Suv omboridagi ma'lumotlarni real vaqtda uzatish va qabul qilish algoritmi
              </p>
              
              <div className="w-full overflow-x-auto mb-4 flex justify-center">
                <svg width="800" height="900" viewBox="0 0 800 900">
                  {/* Algoritm boshi */}
                  <ellipse cx="400" cy="30" rx="80" ry="30" fill="#e0f2fe" stroke="#0c4a6e" strokeWidth="2" />
                  <text x="400" y="35" textAnchor="middle" fontWeight="bold" fill="#0f172a">Boshlash</text>
                  
                  {/* Strelka */}
                  <line x1="400" y1="60" x2="400" y2="90" stroke="#64748b" strokeWidth="2" />
                  <polygon points="395,90 405,90 400,100" fill="#64748b" />
                  
                  {/* WebSocket serverini ishga tushirish */}
                  <rect x="300" y="100" width="200" height="60" rx="0" fill="#e0f2fe" stroke="#0c4a6e" strokeWidth="2" />
                  <text x="400" y="130" textAnchor="middle" fontWeight="bold" fill="#0f172a">WebSocket serverini</text>
                  <text x="400" y="150" textAnchor="middle" fontWeight="bold" fill="#0f172a">ishga tushirish</text>
                  
                  {/* Strelka */}
                  <line x1="400" y1="160" x2="400" y2="190" stroke="#64748b" strokeWidth="2" />
                  <polygon points="395,190 405,190 400,200" fill="#64748b" />
                  
                  {/* Mijozlar ulanishini kutish */}
                  <rect x="300" y="200" width="200" height="60" rx="0" fill="#e0f2fe" stroke="#0c4a6e" strokeWidth="2" />
                  <text x="400" y="230" textAnchor="middle" fontWeight="bold" fill="#0f172a">Mijozlar ulanishini</text>
                  <text x="400" y="250" textAnchor="middle" fontWeight="bold" fill="#0f172a">kutish</text>
                  
                  {/* Strelka */}
                  <line x1="400" y1="260" x2="400" y2="290" stroke="#64748b" strokeWidth="2" />
                  <polygon points="395,290 405,290 400,300" fill="#64748b" />
                  
                  {/* Ulanish mavjudmi? */}
                  <polygon points="400,300 325,350 475,350" fill="#e0f2fe" stroke="#0c4a6e" strokeWidth="2" />
                  <text x="400" y="335" textAnchor="middle" fontWeight="bold" fill="#0f172a">Yangi ulanish</text>
                  <text x="400" y="355" textAnchor="middle" fontWeight="bold" fill="#0f172a">mavjudmi?</text>
                  
                  {/* Yo'q yo'nalish */}
                  <line x1="325" y1="350" x2="225" y2="400" stroke="#64748b" strokeWidth="2" />
                  <polygon points="230,395 220,405 225,408" fill="#64748b" />
                  <text x="260" y="360" textAnchor="middle" fontSize="12" fill="#7f1d1d">Yo'q</text>
                  
                  {/* Mavjud mijozlar ro'yxatini tekshirish */}
                  <rect x="125" y="400" width="200" height="60" rx="0" fill="#e0f2fe" stroke="#0c4a6e" strokeWidth="2" />
                  <text x="225" y="430" textAnchor="middle" fontWeight="bold" fill="#0f172a">Mavjud mijozlar</text>
                  <text x="225" y="450" textAnchor="middle" fontWeight="bold" fill="#0f172a">ro'yxatini tekshirish</text>
                  
                  {/* Ha yo'nalish */}
                  <line x1="475" y1="350" x2="575" y2="400" stroke="#64748b" strokeWidth="2" />
                  <polygon points="570,395 580,405 575,408" fill="#64748b" />
                  <text x="530" y="360" textAnchor="middle" fontSize="12" fill="#15803d">Ha</text>
                  
                  {/* Yangi mijozni ro'yxatga qo'shish */}
                  <rect x="475" y="400" width="200" height="60" rx="0" fill="#e0f2fe" stroke="#0c4a6e" strokeWidth="2" />
                  <text x="575" y="430" textAnchor="middle" fontWeight="bold" fill="#0f172a">Yangi mijozni</text>
                  <text x="575" y="450" textAnchor="middle" fontWeight="bold" fill="#0f172a">ro'yxatga qo'shish</text>
                  
                  {/* Strelka mavjud mijozlardan */}
                  <line x1="225" y1="460" x2="225" y2="500" stroke="#64748b" strokeWidth="2" />
                  <polygon points="220,500 230,500 225,510" fill="#64748b" />
                  
                  {/* Yangi ma'lumotlar mavjudmi? */}
                  <polygon points="225,510 150,560 300,560" fill="#e0f2fe" stroke="#0c4a6e" strokeWidth="2" />
                  <text x="225" y="545" textAnchor="middle" fontWeight="bold" fill="#0f172a">Yangi ma'lumotlar</text>
                  <text x="225" y="565" textAnchor="middle" fontWeight="bold" fill="#0f172a">mavjudmi?</text>
                  
                  {/* Strelka yangi mijozdan */}
                  <line x1="575" y1="460" x2="575" y2="600" stroke="#64748b" strokeWidth="2" />
                  <line x1="575" y1="600" x2="400" y2="600" stroke="#64748b" strokeWidth="2" />
                  <polygon points="405,595 395,605 400,608" fill="#64748b" />
                  
                  {/* Yo'q yo'nalish */}
                  <line x1="150" y1="560" x2="100" y2="610" stroke="#64748b" strokeWidth="2" />
                  <polygon points="105,605 95,615 100,618" fill="#64748b" />
                  <text x="120" y="570" textAnchor="middle" fontSize="12" fill="#7f1d1d">Yo'q</text>
                  
                  {/* Kutish rejimiga o'tish */}
                  <rect x="0" y="610" width="200" height="60" rx="0" fill="#e0f2fe" stroke="#0c4a6e" strokeWidth="2" />
                  <text x="100" y="640" textAnchor="middle" fontWeight="bold" fill="#0f172a">Kutish rejimiga</text>
                  <text x="100" y="660" textAnchor="middle" fontWeight="bold" fill="#0f172a">o'tish</text>
                  
                  {/* Strelka kutish rejimidan */}
                  <path d="M 0,640 L -50,640 L -50,230 L 300,230" stroke="#64748b" strokeWidth="2" fill="none" />
                  <polygon points="295,225 305,235 295,235" fill="#64748b" />
                  
                  {/* Ha yo'nalish */}
                  <line x1="300" y1="560" x2="350" y2="610" stroke="#64748b" strokeWidth="2" />
                  <polygon points="345,605 355,615 350,618" fill="#64748b" />
                  <text x="330" y="570" textAnchor="middle" fontSize="12" fill="#15803d">Ha</text>
                  
                  {/* Ma'lumotlarni olish */}
                  <rect x="300" y="610" width="200" height="60" rx="0" fill="#e0f2fe" stroke="#0c4a6e" strokeWidth="2" />
                  <text x="400" y="640" textAnchor="middle" fontWeight="bold" fill="#0f172a">Ma'lumotlarni</text>
                  <text x="400" y="660" textAnchor="middle" fontWeight="bold" fill="#0f172a">olish</text>
                  
                  {/* Strelka ma'lumotlarni olishdan */}
                  <line x1="400" y1="670" x2="400" y2="700" stroke="#64748b" strokeWidth="2" />
                  <polygon points="395,700 405,700 400,710" fill="#64748b" />
                  
                  {/* Ma'lumotlarni formatlash */}
                  <rect x="300" y="700" width="200" height="60" rx="0" fill="#e0f2fe" stroke="#0c4a6e" strokeWidth="2" />
                  <text x="400" y="730" textAnchor="middle" fontWeight="bold" fill="#0f172a">Ma'lumotlarni</text>
                  <text x="400" y="750" textAnchor="middle" fontWeight="bold" fill="#0f172a">formatlash</text>
                  
                  {/* Strelka ma'lumotlarni formatlashdan */}
                  <line x1="400" y1="760" x2="400" y2="790" stroke="#64748b" strokeWidth="2" />
                  <polygon points="395,790 405,790 400,800" fill="#64748b" />
                  
                  {/* Barcha mijozlarga yuborish */}
                  <rect x="300" y="790" width="200" height="60" rx="0" fill="#e0f2fe" stroke="#0c4a6e" strokeWidth="2" />
                  <text x="400" y="820" textAnchor="middle" fontWeight="bold" fill="#0f172a">Barcha mijozlarga</text>
                  <text x="400" y="840" textAnchor="middle" fontWeight="bold" fill="#0f172a">ma'lumotlarni yuborish</text>
                  
                  {/* Strelka barcha mijozlarga yuborishdan */}
                  <line x1="300" y1="820" x2="150" y2="820" stroke="#64748b" strokeWidth="2" />
                  <line x1="150" y1="820" x2="150" y2="430" stroke="#64748b" strokeWidth="2" />
                  <polygon points="145,435 155,425 155,435" fill="#64748b" />
                  
                  {/* Algoritm tugashi - qo'yilmaydi chunki WSS tizimlarda doimiy ishlaydi */}
                  <text x="600" y="840" textAnchor="middle" fontSize="12" fontStyle="italic" fill="#64748b">Server tizim to'xtatilgunga qadar ishlaydi</text>
                </svg>
              </div>
              
              <div className="prose prose-blue max-w-none">
                <h4>Algoritm vazifasi va tushuntirish:</h4>
                <p>
                  Bu algoritm WebSocket texnologiyasi asosida suv omborlariga o'rnatilgan sensorlardan 
                  keladigan ma'lumotlarni real vaqtda uzatish va barcha foydalanuvchilarga tarqatish vazifasini 
                  bajaradi. Uzluksiz aloqa o'rnatiladi va ma'lumotlar darhol yetkaziladi.
                </p>
                
                <p>
                  <strong>Asosiy bosqichlar:</strong>
                  <ul className="list-disc pl-5">
                    <li>WebSocket serveri ishga tushiriladi</li>
                    <li>Mijozlar ulanishi kutiladi</li>
                    <li>Yangi mijoz ulanganda, u ro'yxatga qo'shiladi</li>
                    <li>Sensor ma'lumotlari kelib tushishi kutiladi</li>
                    <li>Yangi ma'lumotlar kelib tushganda, ular formatlashtiriladi</li>
                    <li>Formatlashtirilgan ma'lumotlar barcha ulangan mijozlarga yuboriladi</li>
                    <li>Jarayon uzluksiz davom etadi</li>
                  </ul>
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}