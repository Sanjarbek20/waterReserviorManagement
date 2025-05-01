import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function WaterManagementAlgorithm() {
  return (
    <div className="p-1">
      <Card className="shadow-md mb-8">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">Suv resurslari boshqarish algoritmi</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full overflow-x-auto">
            <svg width="800" height="1100" viewBox="0 0 800 1100" className="mx-auto">
              {/* Start */}
              <circle cx="400" cy="50" r="40" fill="#dbeafe" stroke="#0c4a6e" strokeWidth="2"/>
              <text x="400" y="55" textAnchor="middle" fontWeight="bold" fill="#0f172a">Boshlash</text>
              
              {/* Flow arrow */}
              <line x1="400" y1="90" x2="400" y2="120" stroke="#64748b" strokeWidth="2"/>
              <polygon points="395,120 405,120 400,130" fill="#64748b"/>
              
              {/* Data collection */}
              <rect x="300" y="130" width="200" height="60" rx="0" fill="#dbeafe" stroke="#0c4a6e" strokeWidth="2"/>
              <text x="400" y="165" textAnchor="middle" fontWeight="bold" fill="#0f172a">Ma'lumotlarni yig'ish</text>
              
              {/* Flow arrow */}
              <line x1="400" y1="190" x2="400" y2="220" stroke="#64748b" strokeWidth="2"/>
              <polygon points="395,220 405,220 400,230" fill="#64748b"/>
              
              {/* Validation */}
              <rect x="300" y="230" width="200" height="60" rx="0" fill="#dbeafe" stroke="#0c4a6e" strokeWidth="2"/>
              <text x="400" y="265" textAnchor="middle" fontWeight="bold" fill="#0f172a">Ma'lumotlarni tekshirish</text>
              
              {/* Flow arrow */}
              <line x1="400" y1="290" x2="400" y2="320" stroke="#64748b" strokeWidth="2"/>
              <polygon points="395,320 405,320 400,330" fill="#64748b"/>
              
              {/* Decision */}
              <polygon points="400,330 500,380 400,430 300,380" fill="#dbeafe" stroke="#0c4a6e" strokeWidth="2"/>
              <text x="400" y="385" textAnchor="middle" fontWeight="bold" fill="#0f172a">Ma'lumotlar</text>
              <text x="400" y="405" textAnchor="middle" fontWeight="bold" fill="#0f172a">to'g'rimi?</text>
              
              {/* No path */}
              <line x1="300" y1="380" x2="200" y2="380" stroke="#64748b" strokeWidth="2"/>
              <polygon points="210,375 200,380 210,385" fill="#64748b"/>
              <text x="250" y="370" textAnchor="middle" fontSize="12" fill="#ef4444">Yo'q</text>
              
              {/* Error handling */}
              <rect x="100" y="350" width="100" height="60" rx="0" fill="#fee2e2" stroke="#7f1d1d" strokeWidth="2"/>
              <text x="150" y="380" textAnchor="middle" fontWeight="bold" fill="#0f172a">Xatolikni</text>
              <text x="150" y="395" textAnchor="middle" fontWeight="bold" fill="#0f172a">tuzatish</text>
              
              {/* Return arrow */}
              <line x1="150" y1="350" x2="150" y2="260" stroke="#64748b" strokeWidth="2"/>
              <line x1="150" y1="260" x2="300" y2="260" stroke="#64748b" strokeWidth="2"/>
              <polygon points="290,255 300,260 290,265" fill="#64748b"/>
              
              {/* Yes path */}
              <line x1="400" y1="430" x2="400" y2="460" stroke="#64748b" strokeWidth="2"/>
              <polygon points="395,460 405,460 400,470" fill="#64748b"/>
              <text x="420" y="445" textAnchor="middle" fontSize="12" fill="#16a34a">Ha</text>
              
              {/* Data analysis */}
              <rect x="300" y="470" width="200" height="60" rx="0" fill="#dbeafe" stroke="#0c4a6e" strokeWidth="2"/>
              <text x="400" y="505" textAnchor="middle" fontWeight="bold" fill="#0f172a">Ma'lumotlarni tahlil qilish</text>
              
              {/* Flow arrow */}
              <line x1="400" y1="530" x2="400" y2="560" stroke="#64748b" strokeWidth="2"/>
              <polygon points="395,560 405,560 400,570" fill="#64748b"/>
              
              {/* Decision - Water sufficiency */}
              <polygon points="400,570 500,620 400,670 300,620" fill="#dbeafe" stroke="#0c4a6e" strokeWidth="2"/>
              <text x="400" y="615" textAnchor="middle" fontWeight="bold" fill="#0f172a">Suv yetarlimi?</text>
              
              {/* No path */}
              <line x1="300" y1="620" x2="175" y2="620" stroke="#64748b" strokeWidth="2"/>
              <polygon points="185,615 175,620 185,625" fill="#64748b"/>
              <text x="250" y="610" textAnchor="middle" fontSize="12" fill="#ef4444">Yo'q</text>
              
              {/* Optimization algorithm */}
              <rect x="100" y="590" width="150" height="60" rx="0" fill="#fee2e2" stroke="#7f1d1d" strokeWidth="2"/>
              <text x="175" y="620" textAnchor="middle" fontWeight="bold" fill="#0f172a">Cheklangan suv uchun</text>
              <text x="175" y="640" textAnchor="middle" fontWeight="bold" fill="#0f172a">optimallash</text>
              
              {/* Yes path */}
              <line x1="500" y1="620" x2="600" y2="620" stroke="#64748b" strokeWidth="2"/>
              <polygon points="590,615 600,620 590,625" fill="#64748b"/>
              <text x="550" y="610" textAnchor="middle" fontSize="12" fill="#16a34a">Ha</text>
              
              {/* Full allocation */}
              <rect x="600" y="590" width="150" height="60" rx="0" fill="#dcfce7" stroke="#166534" strokeWidth="2"/>
              <text x="675" y="620" textAnchor="middle" fontWeight="bold" fill="#0f172a">To'liq suv</text>
              <text x="675" y="640" textAnchor="middle" fontWeight="bold" fill="#0f172a">ajratish</text>
              
              {/* Flow arrows to next step */}
              <line x1="175" y1="650" x2="175" y2="700" stroke="#64748b" strokeWidth="2"/>
              <line x1="175" y1="700" x2="400" y2="700" stroke="#64748b" strokeWidth="2"/>
              <polygon points="390,695 400,700 390,705" fill="#64748b"/>
              
              <line x1="675" y1="650" x2="675" y2="700" stroke="#64748b" strokeWidth="2"/>
              <line x1="675" y1="700" x2="400" y2="700" stroke="#64748b" strokeWidth="2"/>
              <polygon points="410,695 400,700 410,705" fill="#64748b"/>
              
              {/* Create water distribution plan */}
              <rect x="300" y="700" width="200" height="60" rx="0" fill="#dbeafe" stroke="#0c4a6e" strokeWidth="2"/>
              <text x="400" y="730" textAnchor="middle" fontWeight="bold" fill="#0f172a">Suv taqsimot</text>
              <text x="400" y="750" textAnchor="middle" fontWeight="bold" fill="#0f172a">rejasini tuzish</text>
              
              {/* Flow arrow */}
              <line x1="400" y1="760" x2="400" y2="790" stroke="#64748b" strokeWidth="2"/>
              <polygon points="395,790 405,790 400,800" fill="#64748b"/>
              
              {/* Generate alerts */}
              <rect x="300" y="800" width="200" height="60" rx="0" fill="#dbeafe" stroke="#0c4a6e" strokeWidth="2"/>
              <text x="400" y="830" textAnchor="middle" fontWeight="bold" fill="#0f172a">Ogohlantirishlarni</text>
              <text x="400" y="850" textAnchor="middle" fontWeight="bold" fill="#0f172a">shakllantirish</text>
              
              {/* Flow arrow */}
              <line x1="400" y1="860" x2="400" y2="890" stroke="#64748b" strokeWidth="2"/>
              <polygon points="395,890 405,890 400,900" fill="#64748b"/>
              
              {/* Update system */}
              <rect x="300" y="900" width="200" height="60" rx="0" fill="#dbeafe" stroke="#0c4a6e" strokeWidth="2"/>
              <text x="400" y="930" textAnchor="middle" fontWeight="bold" fill="#0f172a">Tizimni</text>
              <text x="400" y="950" textAnchor="middle" fontWeight="bold" fill="#0f172a">yangilash</text>
              
              {/* Flow arrow */}
              <line x1="400" y1="960" x2="400" y2="990" stroke="#64748b" strokeWidth="2"/>
              <polygon points="395,990 405,990 400,1000" fill="#64748b"/>
              
              {/* End */}
              <ellipse cx="400" cy="1030" rx="80" ry="40" fill="#dbeafe" stroke="#0c4a6e" strokeWidth="2"/>
              <text x="400" y="1030" textAnchor="middle" fontWeight="bold" fill="#0f172a">Jarayon</text>
              <text x="400" y="1050" textAnchor="middle" fontWeight="bold" fill="#0f172a">tugadi</text>
              
              {/* Algorithm sections */}
              <rect x="50" y="150" width="5" height="160" fill="#94a3b8" opacity="0.5" rx="2.5"/>
              <text x="30" y="230" transform="rotate(270 30,230)" textAnchor="middle" fill="#475569" fontSize="12">Ma'lumotlarni yig'ish</text>
              
              <rect x="50" y="320" width="5" height="260" fill="#94a3b8" opacity="0.5" rx="2.5"/>
              <text x="30" y="450" transform="rotate(270 30,450)" textAnchor="middle" fill="#475569" fontSize="12">Tahlil va qaror qabul qilish</text>
              
              <rect x="50" y="590" width="5" height="250" fill="#94a3b8" opacity="0.5" rx="2.5"/>
              <text x="30" y="715" transform="rotate(270 30,715)" textAnchor="middle" fill="#475569" fontSize="12">Resurslarni taqsimlash</text>
              
              <rect x="50" y="850" width="5" height="180" fill="#94a3b8" opacity="0.5" rx="2.5"/>
              <text x="30" y="940" transform="rotate(270 30,940)" textAnchor="middle" fill="#475569" fontSize="12">Tizimni yangilash</text>
            </svg>
          </div>
          
          <div className="p-4 bg-slate-50 mt-4 rounded-md">
            <h3 className="font-medium text-lg mb-2">Algoritm tushuntirishi:</h3>
            <p className="mb-2">Ushbu algoritm suv resurslari boshqarish tizimining asosiy jarayonlarini ko'rsatadi:</p>
            
            <ol className="list-decimal list-inside space-y-1 ml-2">
              <li><span className="font-medium">Ma'lumotlarni yig'ish:</span> Suv ombori, ob-havo, fermer talablari va boshqa ma'lumotlarni yig'ish</li>
              <li><span className="font-medium">Ma'lumotlarni tekshirish:</span> Tizimga kiritilgan ma'lumotlarning to'g'riligini tekshirish va xatoliklarni bartaraf etish</li>
              <li><span className="font-medium">Ma'lumotlarni tahlil qilish:</span> Yig'ilgan ma'lumotlarni tahlil qilish va suv zahirasini aniqlash</li>
              <li><span className="font-medium">Suv yetarliligini tekshirish:</span> Talab qilingan miqdordagi suvni taqsimlash imkoniyatini baholash</li>
              <li><span className="font-medium">Optimallash:</span> Agar suv resurslari yetarli bo'lmasa, mavjud suv zahirasini eng samarali taqsimlash</li>
              <li><span className="font-medium">Suv taqsimot rejasini tuzish:</span> Tahlil va qaror qabul qilish asosida taqsimot rejasini yaratish</li>
              <li><span className="font-medium">Ogohlantirishlarni shakllantirish:</span> Fermerlar va boshqa foydalanuvchilarni rejadagi o'zgarishlar haqida ogohlantirish</li>
              <li><span className="font-medium">Tizimni yangilash:</span> Tizim ma'lumotlar bazasini yangi ma'lumotlar bilan yangilash</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}