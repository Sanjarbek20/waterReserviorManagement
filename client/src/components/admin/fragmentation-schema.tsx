import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function FragmentationSchema() {
  return (
    <Card className="shadow-md">
      <CardHeader className="pb-2">
        <CardTitle>Ma'lumotlar bazasi fragmentlash algoritmi</CardTitle>
        <CardDescription>
          Tizimda ishlatiladigan fragmentlash algoritmi sxemasi
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-auto">
          <svg width="900" height="800" viewBox="0 0 900 800" className="mx-auto">
            {/* Boshlash */}
            <ellipse cx="120" cy="60" rx="100" ry="40" fill="#f1f5f9" stroke="#64748b" strokeWidth="2" />
            <text x="120" y="65" textAnchor="middle" fontWeight="bold" fill="#0f172a">Boshlash</text>
            
            {/* N-kiruvchi hujjatlar soni */}
            <rect x="280" y="20" width="360" height="80" rx="5" fill="#f8fafc" stroke="#64748b" strokeWidth="2" />
            <text x="460" y="50" textAnchor="middle" fontWeight="bold" fill="#0f172a">N-kiruvchi hujjatlar soni;</text>
            <text x="460" y="75" textAnchor="middle" fill="#0f172a" fontSize="14">Fragment parametrlari (I-fragment turi,</text>
            <text x="460" y="95" textAnchor="middle" fill="#0f172a" fontSize="14">j-andozadagi raqami, FKS-kalit so'zlar)</text>
            
            {/* Arrow from Boshlash to N-kiruvchi */}
            <line x1="220" y1="60" x2="280" y2="60" stroke="#ca8a04" strokeWidth="2" />
            <polygon points="275,55 285,60 275,65" fill="#ca8a04" />
            
            {/* Berilgan N hujjatlarni o'qish */}
            <polygon points="320,150 600,150 550,200 370,200" fill="#f8fafc" stroke="#64748b" strokeWidth="2" />
            <text x="460" y="165" textAnchor="middle" fontWeight="bold" fill="#0f172a">Berilgan N hujjatlarni</text>
            <text x="460" y="185" textAnchor="middle" fontWeight="bold" fill="#0f172a">o'qish i=1..N</text>
            
            {/* Umumlashgan massiv */}
            <rect x="700" y="150" width="160" height="60" rx="5" fill="#f8fafc" stroke="#64748b" strokeWidth="2" />
            <text x="780" y="185" textAnchor="middle" fontWeight="bold" fill="#0f172a">Umumlashgan</text>
            <text x="780" y="205" textAnchor="middle" fontWeight="bold" fill="#0f172a">massiv</text>
            
            {/* Tamom */}
            <ellipse cx="780" cy="260" rx="70" ry="40" fill="#f1f5f9" stroke="#64748b" strokeWidth="2" />
            <text x="780" y="265" textAnchor="middle" fontWeight="bold" fill="#0f172a">Tamom</text>
            
            {/* Arrow from N-kiruvchi to Berilgan */}
            <line x1="460" y1="100" x2="460" y2="150" stroke="#ca8a04" strokeWidth="2" />
            <polygon points="455,145 460,155 465,145" fill="#ca8a04" />
            
            {/* Arrow from Boshlash to Berilgan */}
            <line x1="120" y1="100" x2="120" y2="175" stroke="#ca8a04" strokeWidth="2" />
            <line x1="120" y1="175" x2="320" y2="175" stroke="#ca8a04" strokeWidth="2" />
            <polygon points="315,170 325,175 315,180" fill="#ca8a04" />
            
            {/* Arrow from Berilgan to Umumlashgan */}
            <line x1="600" y1="175" x2="700" y2="175" stroke="#ca8a04" strokeWidth="2" />
            <polygon points="695,170 705,175 695,180" fill="#ca8a04" />
            
            {/* Arrow from Umumlashgan to Tamom */}
            <line x1="780" y1="210" x2="780" y2="220" stroke="#ca8a04" strokeWidth="2" />
            <polygon points="775,215 780,225 785,215" fill="#ca8a04" />
            
            {/* i-kiruvchi hujjatni o'qish */}
            <rect x="370" y="230" width="180" height="60" rx="5" fill="#f8fafc" stroke="#64748b" strokeWidth="2" />
            <text x="460" y="265" textAnchor="middle" fontWeight="bold" fill="#0f172a">i-kiruvchi hujjatni o'qish</text>
            
            {/* Arrow from Berilgan to i-kiruvchi */}
            <line x1="460" y1="200" x2="460" y2="230" stroke="#ca8a04" strokeWidth="2" />
            <polygon points="455,225 460,235 465,225" fill="#ca8a04" />
            
            {/* Andozadagi fragment raqami */}
            <polygon points="320,320 600,320 550,370 370,370" fill="#f8fafc" stroke="#64748b" strokeWidth="2" />
            <text x="460" y="335" textAnchor="middle" fontWeight="bold" fill="#0f172a">Andozadagi fragment</text>
            <text x="460" y="355" textAnchor="middle" fontWeight="bold" fill="#0f172a">raqami j=1..M</text>
            
            {/* Arrow from i-kiruvchi to Andozadagi */}
            <line x1="460" y1="290" x2="460" y2="320" stroke="#ca8a04" strokeWidth="2" />
            <polygon points="455,315 460,325 465,315" fill="#ca8a04" />
            
            {/* j-fragment blokini oqish */}
            <rect x="370" y="400" width="180" height="60" rx="5" fill="#f8fafc" stroke="#64748b" strokeWidth="2" />
            <text x="460" y="435" textAnchor="middle" fontWeight="bold" fill="#0f172a">j-fragment blokini oqish</text>
            
            {/* Arrow from Andozadagi to j-fragment */}
            <line x1="460" y1="370" x2="460" y2="400" stroke="#ca8a04" strokeWidth="2" />
            <polygon points="455,395 460,405 465,395" fill="#ca8a04" />
            
            {/* Fragmentlash qismi */}
            <rect x="200" y="480" width="520" height="120" rx="10" fill="#f1f5f9" stroke="#64748b" strokeWidth="2" />
            <text x="460" y="500" textAnchor="middle" fontWeight="bold" fill="#0f172a">Fragmentlash</text>
            
            {/* Fragmentlash qoidalari */}
            <path d="M 240,515 C 225,515 225,515 225,530 L 225,550 C 225,565 225,565 240,565 L 270,565 C 285,565 285,565 285,550 L 285,530 C 285,515 285,515 270,515 Z" fill="#ffffff" stroke="#64748b" strokeWidth="1.5" />
            <path d="M 240,515 C 225,515 225,515 225,530 L 225,550 C 225,565 225,565 240,565 L 270,565 C 285,565 285,565 285,550 L 285,530 C 285,515 285,515 270,515 Z" fill="none" stroke="#64748b" strokeWidth="1.5" />
            <ellipse cx="255" cy="525" rx="30" ry="5" fill="none" stroke="#64748b" strokeWidth="1.5" />
            <text x="255" y="545" textAnchor="middle" fontSize="12" fill="#0f172a">Fragmentlash</text>
            <text x="255" y="560" textAnchor="middle" fontSize="12" fill="#0f172a">qoidalari</text>
            
            {/* Fragment qoidalari asosida... */}
            <rect x="320" y="515" width="380" height="70" rx="5" fill="#ffffff" stroke="#64748b" strokeWidth="1.5" />
            <text x="510" y="540" textAnchor="middle" fontSize="14" fill="#0f172a">Fragment qoidalari asosida hujjatdan</text>
            <text x="510" y="560" textAnchor="middle" fontSize="14" fill="#0f172a">fragment blokini chiqarib olish algoritmi</text>
            
            {/* Arrow from j-fragment to Fragmentlash */}
            <line x1="460" y1="460" x2="460" y2="480" stroke="#ca8a04" strokeWidth="2" />
            <polygon points="455,475 460,485 465,475" fill="#ca8a04" />
            
            {/* Arrow from Fragmentlash qoidalari to Fragment qoidalari */}
            <line x1="285" y1="540" x2="320" y2="540" stroke="#ca8a04" strokeWidth="2" />
            <polygon points="315,535 325,540 315,545" fill="#ca8a04" />
            
            {/* Mant tahlili qismi */}
            <rect x="200" y="620" width="520" height="120" rx="10" fill="#f1f5f9" stroke="#64748b" strokeWidth="2" />
            <text x="460" y="640" textAnchor="middle" fontWeight="bold" fill="#0f172a">Mant tahlili</text>
            
            {/* Matn tahlil qoidalari */}
            <path d="M 240,655 C 225,655 225,655 225,670 L 225,690 C 225,705 225,705 240,705 L 270,705 C 285,705 285,705 285,690 L 285,670 C 285,655 285,655 270,655 Z" fill="#ffffff" stroke="#64748b" strokeWidth="1.5" />
            <path d="M 240,655 C 225,655 225,655 225,670 L 225,690 C 225,705 225,705 240,705 L 270,705 C 285,705 285,705 285,690 L 285,670 C 285,655 285,655 270,655 Z" fill="none" stroke="#64748b" strokeWidth="1.5" />
            <ellipse cx="255" cy="665" rx="30" ry="5" fill="none" stroke="#64748b" strokeWidth="1.5" />
            <text x="255" y="680" textAnchor="middle" fontSize="12" fill="#0f172a">Matn tahlil</text>
            <text x="255" y="695" textAnchor="middle" fontSize="12" fill="#0f172a">qoidalari</text>
            
            {/* Fragment kalit so'zlari va gapni tahlil qilish */}
            <rect x="320" y="655" width="380" height="70" rx="5" fill="#ffffff" stroke="#64748b" strokeWidth="1.5" />
            <text x="510" y="680" textAnchor="middle" fontSize="14" fill="#0f172a">Fragment kalit so'zlari va gapni tahlil qilish</text>
            <text x="510" y="700" textAnchor="middle" fontSize="14" fill="#0f172a">qoidalari asosida fragment blokidan axborot</text>
            <text x="510" y="720" textAnchor="middle" fontSize="14" fill="#0f172a">birliklarini chiqarib olish algoritmi</text>
            
            {/* Arrow from Fragmentlash to Mant */}
            <line x1="460" y1="600" x2="460" y2="620" stroke="#ca8a04" strokeWidth="2" />
            <polygon points="455,615 460,625 465,615" fill="#ca8a04" />
            
            {/* Arrow from Matn tahlil to Fragment kalit */}
            <line x1="285" y1="680" x2="320" y2="680" stroke="#ca8a04" strokeWidth="2" />
            <polygon points="315,675 325,680 315,685" fill="#ca8a04" />
            
            {/* Olingan axborot birliklarini... */}
            <rect x="260" y="760" width="400" height="60" rx="5" fill="#f8fafc" stroke="#64748b" strokeWidth="2" />
            <text x="460" y="785" textAnchor="middle" fontWeight="bold" fill="#0f172a">Olingan axborot birliklarini mos fragment bo'yicha</text>
            <text x="460" y="805" textAnchor="middle" fontWeight="bold" fill="#0f172a">umumlashtiruvchi massivga nushalash algoritmi</text>
            
            {/* Arrow from Mant to Olingan */}
            <line x1="460" y1="740" x2="460" y2="760" stroke="#ca8a04" strokeWidth="2" />
            <polygon points="455,755 460,765 465,755" fill="#ca8a04" />
            
            {/* Loop back to Andozadagi */}
            <line x1="260" y1="790" x2="120" y2="790" stroke="#ca8a04" strokeWidth="2" />
            <line x1="120" y1="790" x2="120" y2="345" stroke="#ca8a04" strokeWidth="2" />
            <line x1="120" y1="345" x2="320" y2="345" stroke="#ca8a04" strokeWidth="2" />
            <polygon points="315,340 325,345 315,350" fill="#ca8a04" />
            
            {/* Legend */}
            <rect x="650" y="700" width="200" height="80" rx="5" fill="#f8fafc" stroke="#64748b" strokeWidth="2" />
            <text x="750" y="720" textAnchor="middle" fontWeight="bold" fill="#0f172a" fontSize="14">IZOH</text>
            <line x1="670" y1="740" x2="690" y2="740" stroke="#ca8a04" strokeWidth="2" />
            <polygon points="685,735 695,740 685,745" fill="#ca8a04" />
            <text x="745" y="745" textAnchor="middle" fontSize="12" fill="#0f172a">Algoritm bajarilish yo'li</text>
            <text x="745" y="765" textAnchor="middle" fontSize="12" fill="#0f172a">N, M - fragmentlash parametrlari</text>
          </svg>
        </div>
      </CardContent>
    </Card>
  );
}