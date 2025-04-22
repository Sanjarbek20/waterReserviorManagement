import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function DatabaseAlgorithm() {
  return (
    <Card className="shadow-md">
      <CardHeader className="pb-2">
        <CardTitle>Ma'lumotlar fragmentlash algoritmi (blok-sxema)</CardTitle>
        <CardDescription>
          Tizimda ishlatiladigan ma'lumotlarni qayta ishlash algoritmi
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-auto">
          <svg width="900" height="1000" viewBox="0 0 900 1000" className="mx-auto">
            {/* Boshlash */}
            <ellipse cx="180" cy="50" rx="120" ry="40" fill="#f1f5f9" stroke="#0c4a6e" strokeWidth="2" />
            <text x="180" y="55" textAnchor="middle" fontWeight="bold" fill="#0f172a">Boshlash</text>

            {/* Ma'lumotlar bazasi modelini yaratish */}
            <rect x="80" y="130" width="200" height="80" rx="0" fill="#f8fafc" stroke="#0c4a6e" strokeWidth="2" />
            <text x="180" y="170" textAnchor="middle" fontWeight="bold" fill="#0f172a">Ma'lumotlar bazasi</text>
            <text x="180" y="190" textAnchor="middle" fontWeight="bold" fill="#0f172a">modelini yaratish</text>

            {/* Bog'liqliklar aniqlash */}
            <polygon points="80,250 280,250 240,310 120,310" fill="#f8fafc" stroke="#0c4a6e" strokeWidth="2" />
            <text x="180" y="270" textAnchor="middle" fontWeight="bold" fill="#0f172a">Jadvallar orasidagi</text>
            <text x="180" y="290" textAnchor="middle" fontWeight="bold" fill="#0f172a">bog'liqliklarni aniqlash</text>

            {/* Jadvallarni bo'lish */}
            <rect x="80" y="350" width="200" height="80" rx="0" fill="#f8fafc" stroke="#0c4a6e" strokeWidth="2" />
            <text x="180" y="390" textAnchor="middle" fontWeight="bold" fill="#0f172a">Jadvallarni vertikal va</text>
            <text x="180" y="410" textAnchor="middle" fontWeight="bold" fill="#0f172a">gorizontal fragmentlash</text>

            {/* Ma'lumotlarni fragmentlarga bo'lish sikl */}
            <polygon points="80,470 280,470 240,530 120,530" fill="#f8fafc" stroke="#0c4a6e" strokeWidth="2" />
            <text x="180" y="490" textAnchor="middle" fontWeight="bold" fill="#0f172a">Har bir fragment uchun</text>
            <text x="180" y="510" textAnchor="middle" fontWeight="bold" fill="#0f172a">j=1..M sikl</text>

            {/* Fragment qoidalarini qo'llash */}
            <rect x="80" y="570" width="200" height="80" rx="0" fill="#f8fafc" stroke="#0c4a6e" strokeWidth="2" />
            <text x="180" y="610" textAnchor="middle" fontWeight="bold" fill="#0f172a">Fragment qoidalarini</text>
            <text x="180" y="630" textAnchor="middle" fontWeight="bold" fill="#0f172a">qo'llash</text>

            {/* Ma'lumotlarni fragmentlarga ajratish */}
            <polygon points="80,690 280,690 240,750 120,750" fill="#f8fafc" stroke="#0c4a6e" strokeWidth="2" />
            <text x="180" y="710" textAnchor="middle" fontWeight="bold" fill="#0f172a">Ma'lumotlarni</text>
            <text x="180" y="730" textAnchor="middle" fontWeight="bold" fill="#0f172a">fragmentlarga ajratish</text>

            {/* Kalit so'zlar orqali aniqlash */}
            <rect x="80" y="790" width="200" height="80" rx="0" fill="#f8fafc" stroke="#0c4a6e" strokeWidth="2" />
            <text x="180" y="830" textAnchor="middle" fontWeight="bold" fill="#0f172a">Kalit so'zlar orqali</text>
            <text x="180" y="850" textAnchor="middle" fontWeight="bold" fill="#0f172a">fragmentlarni aniqlash</text>

            {/* Fragmentlarni birlashtirish */}
            <polygon points="80,910 280,910 240,970 120,970" fill="#f8fafc" stroke="#0c4a6e" strokeWidth="2" />
            <text x="180" y="930" textAnchor="middle" fontWeight="bold" fill="#0f172a">Fragmentlarni</text>
            <text x="180" y="950" textAnchor="middle" fontWeight="bold" fill="#0f172a">birlashtirish</text>

            {/* Fragment qoidalar bazasi */}
            <path d="M 500,350 C 480,350 480,350 480,370 L 480,430 C 480,450 480,450 500,450 L 560,450 C 580,450 580,450 580,430 L 580,370 C 580,350 580,350 560,350 Z" fill="#ffffff" stroke="#0c4a6e" strokeWidth="2" />
            <path d="M 500,350 C 480,350 480,350 480,370 L 480,430 C 480,450 480,450 500,450 L 560,450 C 580,450 580,450 580,430 L 580,370 C 580,350 580,350 560,350 Z" fill="none" stroke="#0c4a6e" strokeWidth="2" />
            <ellipse cx="530" cy="360" rx="50" ry="8" fill="none" stroke="#0c4a6e" strokeWidth="2" />
            <text x="530" y="390" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#0f172a">Fragment</text>
            <text x="530" y="410" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#0f172a">qoidalar</text>
            <text x="530" y="430" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#0f172a">bazasi</text>

            {/* Tahlil qoidalar bazasi */}
            <path d="M 500,670 C 480,670 480,670 480,690 L 480,750 C 480,770 480,770 500,770 L 560,770 C 580,770 580,770 580,750 L 580,690 C 580,670 580,670 560,670 Z" fill="#ffffff" stroke="#0c4a6e" strokeWidth="2" />
            <path d="M 500,670 C 480,670 480,670 480,690 L 480,750 C 480,770 480,770 500,770 L 560,770 C 580,770 580,770 580,750 L 580,690 C 580,670 580,670 560,670 Z" fill="none" stroke="#0c4a6e" strokeWidth="2" />
            <ellipse cx="530" cy="680" rx="50" ry="8" fill="none" stroke="#0c4a6e" strokeWidth="2" />
            <text x="530" y="710" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#0f172a">Tahlil</text>
            <text x="530" y="730" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#0f172a">qoidalar</text>
            <text x="530" y="750" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#0f172a">bazasi</text>

            {/* Fragment qoidalarini yaratish */}
            <rect x="400" y="130" width="260" height="80" rx="0" fill="#f8fafc" stroke="#0c4a6e" strokeWidth="2" />
            <text x="530" y="170" textAnchor="middle" fontWeight="bold" fill="#0f172a">Fragment qoidalarini</text>
            <text x="530" y="190" textAnchor="middle" fontWeight="bold" fill="#0f172a">yaratish va optimize qilish</text>

            {/* Tahlil qoidalarini yaratish */}
            <rect x="400" y="250" width="260" height="80" rx="0" fill="#f8fafc" stroke="#0c4a6e" strokeWidth="2" />
            <text x="530" y="290" textAnchor="middle" fontWeight="bold" fill="#0f172a">Tahlil qoidalarini</text>
            <text x="530" y="310" textAnchor="middle" fontWeight="bold" fill="#0f172a">yaratish va qo'llash</text>

            {/* Ma'lumotlarni yig'ish */}
            <rect x="400" y="570" width="260" height="80" rx="0" fill="#f8fafc" stroke="#0c4a6e" strokeWidth="2" />
            <text x="530" y="610" textAnchor="middle" fontWeight="bold" fill="#0f172a">Fragment bo'yicha</text>
            <text x="530" y="630" textAnchor="middle" fontWeight="bold" fill="#0f172a">ma'lumotlarni yig'ish</text>

            {/* Umumiy ma'lumotlar bazasi */}
            <rect x="400" y="910" width="260" height="80" rx="0" fill="#f8fafc" stroke="#0c4a6e" strokeWidth="2" />
            <text x="530" y="950" textAnchor="middle" fontWeight="bold" fill="#0f172a">Umumiy ma'lumotlar</text>
            <text x="530" y="970" textAnchor="middle" fontWeight="bold" fill="#0f172a">bazasini yaratish</text>

            {/* Yakunlash */}
            <ellipse cx="700" cy="950" rx="80" ry="40" fill="#dbeafe" stroke="#0c4a6e" strokeWidth="2" />
            <text x="700" y="955" textAnchor="middle" fontWeight="bold" fill="#0f172a">Yakunlash</text>

            {/* Arrows */}
            {/* Boshlash -> Ma'lumotlar bazasi */}
            <line x1="180" y1="90" x2="180" y2="130" stroke="#ca8a04" strokeWidth="2" />
            <polygon points="175,125 180,135 185,125" fill="#ca8a04" />

            {/* Ma'lumotlar bazasi -> Bog'liqliklar */}
            <line x1="180" y1="210" x2="180" y2="250" stroke="#ca8a04" strokeWidth="2" />
            <polygon points="175,245 180,255 185,245" fill="#ca8a04" />

            {/* Bog'liqliklar -> Jadvallarni bo'lish */}
            <line x1="180" y1="310" x2="180" y2="350" stroke="#ca8a04" strokeWidth="2" />
            <polygon points="175,345 180,355 185,345" fill="#ca8a04" />

            {/* Jadvallarni bo'lish -> Sikl */}
            <line x1="180" y1="430" x2="180" y2="470" stroke="#ca8a04" strokeWidth="2" />
            <polygon points="175,465 180,475 185,465" fill="#ca8a04" />

            {/* Sikl -> Fragment qo'llash */}
            <line x1="180" y1="530" x2="180" y2="570" stroke="#ca8a04" strokeWidth="2" />
            <polygon points="175,565 180,575 185,565" fill="#ca8a04" />

            {/* Fragment qo'llash -> Ma'lumotlarni fragmentlash */}
            <line x1="180" y1="650" x2="180" y2="690" stroke="#ca8a04" strokeWidth="2" />
            <polygon points="175,685 180,695 185,685" fill="#ca8a04" />

            {/* Ma'lumotlarni fragmentlash -> Kalit so'zlar */}
            <line x1="180" y1="750" x2="180" y2="790" stroke="#ca8a04" strokeWidth="2" />
            <polygon points="175,785 180,795 185,785" fill="#ca8a04" />

            {/* Kalit so'zlar -> Fragmentlarni birlashtirish */}
            <line x1="180" y1="870" x2="180" y2="910" stroke="#ca8a04" strokeWidth="2" />
            <polygon points="175,905 180,915 185,905" fill="#ca8a04" />

            {/* Fragmentlarni birlashtirish -> Fragment qo'llash (Loop back) */}
            <path d="M 80,970 L 50,970 L 50,570 L 80,570" stroke="#ca8a04" strokeWidth="2" fill="none" />
            <polygon points="75,565 85,570 75,575" fill="#ca8a04" />

            {/* Fragment qoidalar bazasi -> Fragment qo'llash */}
            <line x1="480" y1="400" x2="280" y2="610" stroke="#ca8a04" strokeWidth="2" />
            <polygon points="282,602 275,612 290,608" fill="#ca8a04" />

            {/* Tahlil qoidalar bazasi -> Kalit so'zlar */}
            <line x1="480" y1="720" x2="280" y2="830" stroke="#ca8a04" strokeWidth="2" />
            <polygon points="282,822 275,832 290,828" fill="#ca8a04" />

            {/* Boshlash -> Fragment qoidalarini yaratish */}
            <path d="M 240,50 L 530,50 L 530,130" stroke="#ca8a04" strokeWidth="2" fill="none" />
            <polygon points="525,125 530,135 535,125" fill="#ca8a04" />

            {/* Fragment qoidalarini yaratish -> Tahlil qoidalarini yaratish */}
            <line x1="530" y1="210" x2="530" y2="250" stroke="#ca8a04" strokeWidth="2" />
            <polygon points="525,245 530,255 535,245" fill="#ca8a04" />

            {/* Tahlil qoidalarini yaratish -> Fragment qoidalar bazasi */}
            <line x1="530" y1="330" x2="530" y2="350" stroke="#ca8a04" strokeWidth="2" />
            <polygon points="525,345 530,355 535,345" fill="#ca8a04" />

            {/* Fragment qo'llash -> Ma'lumotlarni yig'ish */}
            <line x1="280" y1="610" x2="400" y2="610" stroke="#ca8a04" strokeWidth="2" />
            <polygon points="395,605 405,610 395,615" fill="#ca8a04" />

            {/* Ma'lumotlarni yig'ish -> Tahlil qoidalar bazasi */}
            <line x1="530" y1="650" x2="530" y2="670" stroke="#ca8a04" strokeWidth="2" />
            <polygon points="525,665 530,675 535,665" fill="#ca8a04" />

            {/* Fragmentlarni birlashtirish -> Umumiy ma'lumotlar bazasi */}
            <line x1="280" y1="940" x2="400" y2="940" stroke="#ca8a04" strokeWidth="2" />
            <polygon points="395,935 405,940 395,945" fill="#ca8a04" />

            {/* Umumiy ma'lumotlar bazasi -> Tamom */}
            <line x1="660" y1="950" x2="620" y2="950" stroke="#ca8a04" strokeWidth="2" />
            <polygon points="625,945 615,950 625,955" fill="#ca8a04" />

            {/* Legend */}
            <rect x="620" y="130" width="240" height="160" rx="5" fill="#f8fafc" stroke="#0c4a6e" strokeWidth="2" />
            <text x="740" y="160" textAnchor="middle" fontWeight="bold" fill="#0f172a" fontSize="16">Ma'lumotlar fragmentlash</text>
            <text x="740" y="180" textAnchor="middle" fontWeight="bold" fill="#0f172a" fontSize="16">algoritmi elementlari</text>
            
            <rect x="640" y="200" width="20" height="20" rx="0" fill="#f8fafc" stroke="#0c4a6e" strokeWidth="2" />
            <text x="700" y="215" fontSize="14" fill="#0f172a">Jarayon</text>
            
            <polygon points="640,240 660,240 650,260 630,260" fill="#f8fafc" stroke="#0c4a6e" strokeWidth="2" />
            <text x="710" y="250" fontSize="14" fill="#0f172a">Shart/Sikl</text>
            
            <ellipse cx="650" cy="280" rx="20" ry="10" fill="#f1f5f9" stroke="#0c4a6e" strokeWidth="2" />
            <text x="725" y="285" fontSize="14" fill="#0f172a">Boshlash/Yakunlash</text>
          </svg>
        </div>
      </CardContent>
    </Card>
  );
}