import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

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
        <div className="overflow-auto">
          <svg width="900" height="1200" viewBox="0 0 900 1200" className="mx-auto">
            {/* Boshlash */}
            <ellipse cx="180" cy="50" rx="120" ry="40" fill="#f1f5f9" stroke="#0c4a6e" strokeWidth="2" />
            <text x="180" y="55" textAnchor="middle" fontWeight="bold" fill="#0f172a">Boshlash</text>

            {/* Ikki asosiy algoritm guruhi */}
            <rect x="80" y="130" width="200" height="80" rx="0" fill="#f8fafc" stroke="#0c4a6e" strokeWidth="2" />
            <text x="180" y="160" textAnchor="middle" fontWeight="bold" fill="#0f172a">Asosiy algoritm</text>
            <text x="180" y="185" textAnchor="middle" fontWeight="bold" fill="#0f172a">guruhlarini tanlash</text>

            /* Decision Node 1 */
            <polygon points="180,250 260,310 180,370 100,310" fill="#f1f5f9" stroke="#0c4a6e" strokeWidth="2" />
            <text x="180" y="315" textAnchor="middle" fontWeight="bold" fill="#0f172a">Monitoring yoki</text>
            <text x="180" y="335" textAnchor="middle" fontWeight="bold" fill="#0f172a">Taqsimot?</text>

            {/* MONITORING ALGORTIMLAR */}
            <rect x="320" y="270" width="200" height="80" rx="0" fill="#dbeafe" stroke="#0c4a6e" strokeWidth="2" />
            <text x="420" y="300" textAnchor="middle" fontWeight="bold" fill="#0f172a">Monitoring</text>
            <text x="420" y="320" textAnchor="middle" fontWeight="bold" fill="#0f172a">algoritmlari</text>

            {/* Suv sathini kuzatish algoritmi */}
            <rect x="600" y="150" width="240" height="80" rx="0" fill="#dbeafe" stroke="#0c4a6e" strokeWidth="2" />
            <text x="720" y="180" textAnchor="middle" fontWeight="bold" fill="#0f172a">1. Suv sathini real vaqtda</text>
            <text x="720" y="200" textAnchor="middle" fontWeight="bold" fill="#0f172a">kuzatish algoritmi</text>

            {/* O'zgarishlarni tahlil qilish */}
            <rect x="600" y="250" width="240" height="80" rx="0" fill="#dbeafe" stroke="#0c4a6e" strokeWidth="2" />
            <text x="720" y="280" textAnchor="middle" fontWeight="bold" fill="#0f172a">2. Suv sathidagi o'zgarishlarni</text>
            <text x="720" y="300" textAnchor="middle" fontWeight="bold" fill="#0f172a">tahlil qilish algoritmi</text>

            {/* Bashorat algoritmi */}
            <rect x="600" y="350" width="240" height="80" rx="0" fill="#dbeafe" stroke="#0c4a6e" strokeWidth="2" />
            <text x="720" y="380" textAnchor="middle" fontWeight="bold" fill="#0f172a">3. LSTM asosida suv sarfini</text>
            <text x="720" y="400" textAnchor="middle" fontWeight="bold" fill="#0f172a">bashorat qilish algoritmi</text>

            {/* TAQSIMOT ALGORITMLAR */}
            <rect x="320" y="470" width="200" height="80" rx="0" fill="#e0f2fe" stroke="#0c4a6e" strokeWidth="2" />
            <text x="420" y="500" textAnchor="middle" fontWeight="bold" fill="#0f172a">Suv taqsimoti</text>
            <text x="420" y="520" textAnchor="middle" fontWeight="bold" fill="#0f172a">algoritmlari</text>

            {/* Suv ajratish algoritmi */}
            <rect x="600" y="450" width="240" height="80" rx="0" fill="#e0f2fe" stroke="#0c4a6e" strokeWidth="2" />
            <text x="720" y="480" textAnchor="middle" fontWeight="bold" fill="#0f172a">1. Fermerlar uchun suv ajratish</text>
            <text x="720" y="500" textAnchor="middle" fontWeight="bold" fill="#0f172a">algoritmi</text>

            {/* Ekin turiga ko'ra taqsimot */}
            <rect x="600" y="550" width="240" height="80" rx="0" fill="#e0f2fe" stroke="#0c4a6e" strokeWidth="2" />
            <text x="720" y="580" textAnchor="middle" fontWeight="bold" fill="#0f172a">2. Ekin turiga ko'ra suv</text>
            <text x="720" y="600" textAnchor="middle" fontWeight="bold" fill="#0f172a">taqsimoti algoritmi</text>

            {/* So'rovlarni qayta ishlash algoritmi */}
            <rect x="80" y="620" width="200" height="80" rx="0" fill="#f8fafc" stroke="#0c4a6e" strokeWidth="2" />
            <text x="180" y="650" textAnchor="middle" fontWeight="bold" fill="#0f172a">Suv so'rovlarini qayta</text>
            <text x="180" y="670" textAnchor="middle" fontWeight="bold" fill="#0f172a">ishlash algoritmi</text>

            {/* So'rov tahlil sikl */}
            <polygon points="80,740 280,740 240,800 120,800" fill="#f8fafc" stroke="#0c4a6e" strokeWidth="2" />
            <text x="180" y="760" textAnchor="middle" fontWeight="bold" fill="#0f172a">So'rovlarni tahlil qilish</text>
            <text x="180" y="780" textAnchor="middle" fontWeight="bold" fill="#0f172a">sikli</text>

            {/* Suv mavjudligini tekshirish */}
            <polygon points="180,840 260,900 180,960 100,900" fill="#f1f5f9" stroke="#0c4a6e" strokeWidth="2" />
            <text x="180" y="890" textAnchor="middle" fontWeight="bold" fill="#0f172a">Suv resursi</text>
            <text x="180" y="910" textAnchor="middle" fontWeight="bold" fill="#0f172a">mavjudmi?</text>

            {/* Tasdiqlash */}
            <rect x="320" y="860" width="200" height="80" rx="0" fill="#dcfce7" stroke="#0c4a6e" strokeWidth="2" />
            <text x="420" y="890" textAnchor="middle" fontWeight="bold" fill="#0f172a">So'rovni tasdiqlash</text>
            <text x="420" y="910" textAnchor="middle" fontWeight="bold" fill="#0f172a">algoritmi</text>

            {/* Rad etish */}
            <rect x="80" y="1000" width="200" height="80" rx="0" fill="#fee2e2" stroke="#0c4a6e" strokeWidth="2" />
            <text x="180" y="1030" textAnchor="middle" fontWeight="bold" fill="#0f172a">So'rovni rad etish</text>
            <text x="180" y="1050" textAnchor="middle" fontWeight="bold" fill="#0f172a">algoritmi</text>

            {/* Statistik hisob va xabar */}
            <rect x="80" y="1120" width="440" height="80" rx="0" fill="#f8fafc" stroke="#0c4a6e" strokeWidth="2" />
            <text x="300" y="1150" textAnchor="middle" fontWeight="bold" fill="#0f172a">Statistik hisobotlar tayyorlash va bildirishnomalar</text>
            <text x="300" y="1170" textAnchor="middle" fontWeight="bold" fill="#0f172a">yuborish algoritmi</text>

            {/* Arrows */}
            {/* Boshlash -> Asosiy algoritm */}
            <line x1="180" y1="90" x2="180" y2="130" stroke="#ca8a04" strokeWidth="2" />
            <polygon points="175,125 180,135 185,125" fill="#ca8a04" />

            {/* Asosiy algoritm -> Decision Node 1 */}
            <line x1="180" y1="210" x2="180" y2="250" stroke="#ca8a04" strokeWidth="2" />
            <polygon points="175,245 180,255 185,245" fill="#ca8a04" />

            {/* Decision Node 1 -> Monitoring */}
            <line x1="260" y1="310" x2="320" y2="310" stroke="#ca8a04" strokeWidth="2" />
            <polygon points="315,305 325,310 315,315" fill="#ca8a04" />
            <text x="285" y="300" textAnchor="middle" fontSize="12" fill="#0f172a">Monitoring</text>

            {/* Decision Node 1 -> Taqsimot */}
            <line x1="180" y1="370" x2="180" y2="420" stroke="#ca8a04" strokeWidth="2" />
            <line x1="180" y1="420" x2="320" y2="510" stroke="#ca8a04" strokeWidth="2" />
            <polygon points="315,505 325,515 322,502" fill="#ca8a04" />
            <text x="180" y="400" textAnchor="middle" fontSize="12" fill="#0f172a">Taqsimot</text>

            {/* Monitoring -> Suv sathini kuzatish algoritmi */}
            <line x1="520" y1="290" x2="550" y2="290" stroke="#ca8a04" strokeWidth="2" />
            <line x1="550" y1="290" x2="550" y2="190" stroke="#ca8a04" strokeWidth="2" />
            <line x1="550" y1="190" x2="600" y2="190" stroke="#ca8a04" strokeWidth="2" />
            <polygon points="595,185 605,190 595,195" fill="#ca8a04" />

            {/* Monitoring -> O'zgarishlarni tahlil qilish */}
            <line x1="520" y1="310" x2="600" y2="310" stroke="#ca8a04" strokeWidth="2" />
            <polygon points="595,305 605,310 595,315" fill="#ca8a04" />

            {/* Monitoring -> Bashorat algoritmi */}
            <line x1="520" y1="330" x2="550" y2="330" stroke="#ca8a04" strokeWidth="2" />
            <line x1="550" y1="330" x2="550" y2="390" stroke="#ca8a04" strokeWidth="2" />
            <line x1="550" y1="390" x2="600" y2="390" stroke="#ca8a04" strokeWidth="2" />
            <polygon points="595,385 605,390 595,395" fill="#ca8a04" />

            {/* Taqsimot -> Suv ajratish algoritmi */}
            <line x1="520" y1="490" x2="600" y2="490" stroke="#ca8a04" strokeWidth="2" />
            <polygon points="595,485 605,490 595,495" fill="#ca8a04" />

            {/* Taqsimot -> Ekin turiga ko'ra taqsimot */}
            <line x1="520" y1="530" x2="550" y2="530" stroke="#ca8a04" strokeWidth="2" />
            <line x1="550" y1="530" x2="550" y2="590" stroke="#ca8a04" strokeWidth="2" />
            <line x1="550" y1="590" x2="600" y2="590" stroke="#ca8a04" strokeWidth="2" />
            <polygon points="595,585 605,590 595,595" fill="#ca8a04" />

            {/* Decision Node 1 -> So'rovlarni qayta ishlash algoritmi */}
            <line x1="100" y1="310" x2="50" y2="310" stroke="#ca8a04" strokeWidth="2" />
            <line x1="50" y1="310" x2="50" y2="660" stroke="#ca8a04" strokeWidth="2" />
            <line x1="50" y1="660" x2="80" y2="660" stroke="#ca8a04" strokeWidth="2" />
            <polygon points="75,655 85,660 75,665" fill="#ca8a04" />

            {/* So'rovlarni qayta ishlash algoritmi -> So'rov tahlil sikl */}
            <line x1="180" y1="700" x2="180" y2="740" stroke="#ca8a04" strokeWidth="2" />
            <polygon points="175,735 180,745 185,735" fill="#ca8a04" />

            {/* So'rov tahlil sikl -> Suv mavjudligini tekshirish */}
            <line x1="180" y1="800" x2="180" y2="840" stroke="#ca8a04" strokeWidth="2" />
            <polygon points="175,835 180,845 185,835" fill="#ca8a04" />

            {/* Suv mavjudligini tekshirish -> Tasdiqlash */}
            <line x1="260" y1="900" x2="320" y2="900" stroke="#ca8a04" strokeWidth="2" />
            <polygon points="315,895 325,900 315,905" fill="#ca8a04" />
            <text x="290" y="885" textAnchor="middle" fontSize="12" fill="#0f172a">Ha</text>

            {/* Suv mavjudligini tekshirish -> Rad etish */}
            <line x1="180" y1="960" x2="180" y2="1000" stroke="#ca8a04" strokeWidth="2" />
            <polygon points="175,995 180,1005 185,995" fill="#ca8a04" />
            <text x="195" y="980" textAnchor="middle" fontSize="12" fill="#0f172a">Yo'q</text>

            {/* Tasdiqlash -> Statistik hisob */}
            <line x1="420" y1="940" x2="420" y2="1160" stroke="#ca8a04" strokeWidth="2" />
            <polygon points="415,1155 420,1165 425,1155" fill="#ca8a04" />

            {/* Rad etish -> Statistik hisob */}
            <line x1="180" y1="1080" x2="180" y2="1120" stroke="#ca8a04" strokeWidth="2" />
            <polygon points="175,1115 180,1125 185,1115" fill="#ca8a04" />

            {/* Statistik hisob -> So'rov tahlil sikl (Loop back) */}
            <line x1="80" y1="1160" x2="30" y2="1160" stroke="#ca8a04" strokeWidth="2" />
            <line x1="30" y1="1160" x2="30" y2="770" stroke="#ca8a04" strokeWidth="2" />
            <line x1="30" y1="770" x2="80" y2="770" stroke="#ca8a04" strokeWidth="2" />
            <polygon points="75,765 85,770 75,775" fill="#ca8a04" />

            {/* Legend */}
            <rect x="600" y="650" width="240" height="170" rx="5" fill="#f8fafc" stroke="#0c4a6e" strokeWidth="2" />
            <text x="720" y="680" textAnchor="middle" fontWeight="bold" fill="#0f172a" fontSize="16">Algoritm turlari</text>
            
            <rect x="620" y="700" width="20" height="20" rx="0" fill="#f8fafc" stroke="#0c4a6e" strokeWidth="2" />
            <text x="730" y="715" fontSize="14" fill="#0f172a">Umumiy algoritmlar</text>
            
            <rect x="620" y="730" width="20" height="20" rx="0" fill="#dbeafe" stroke="#0c4a6e" strokeWidth="2" />
            <text x="735" y="745" fontSize="14" fill="#0f172a">Monitoring algoritmlari</text>
            
            <rect x="620" y="760" width="20" height="20" rx="0" fill="#e0f2fe" stroke="#0c4a6e" strokeWidth="2" />
            <text x="740" y="775" fontSize="14" fill="#0f172a">Taqsimot algoritmlari</text>
            
            <polygon points="620,790 640,790 630,805 610,805" fill="#f1f5f9" stroke="#0c4a6e" strokeWidth="2" />
            <text x="700" y="800" fontSize="14" fill="#0f172a">Qaror qabul qilish</text>
          </svg>
        </div>
      </CardContent>
    </Card>
  );
}