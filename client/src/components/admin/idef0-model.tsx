import React from 'react';

export default function IDEF0Model() {
  return (
    <div className="overflow-x-auto">
      <svg width="900" height="720" viewBox="0 0 900 720" className="mx-auto">
        {/* Main Process Block */}
        <rect x="350" y="300" width="200" height="120" fill="#dbeafe" stroke="#0c4a6e" strokeWidth="2" />
        <text x="450" y="340" textAnchor="middle" fontWeight="bold" fill="#0f172a" fontSize="16">
          Suv resurslari boshqarish
        </text>
        <text x="450" y="360" textAnchor="middle" fontWeight="bold" fill="#0f172a" fontSize="16">
          tizimi
        </text>
        <text x="450" y="380" textAnchor="middle" fill="#0f172a" fontSize="12">A0</text>

        {/* Input arrows */}
        <line x1="100" y1="310" x2="350" y2="310" stroke="#0c4a6e" strokeWidth="2" />
        <polygon points="340,305 350,310 340,315" fill="#0c4a6e" />
        <text x="200" y="300" textAnchor="middle" fill="#0f172a" fontSize="12">Suv ombori ma'lumotlari</text>

        <line x1="100" y1="330" x2="350" y2="330" stroke="#0c4a6e" strokeWidth="2" />
        <polygon points="340,325 350,330 340,335" fill="#0c4a6e" />
        <text x="200" y="350" textAnchor="middle" fill="#0f172a" fontSize="12">Fermerlar talablari</text>

        <line x1="100" y1="350" x2="350" y2="350" stroke="#0c4a6e" strokeWidth="2" />
        <polygon points="340,345 350,350 340,355" fill="#0c4a6e" />
        <text x="200" y="370" textAnchor="middle" fill="#0f172a" fontSize="12">Suv hajmi va sarfiyot</text>

        <line x1="100" y1="390" x2="350" y2="390" stroke="#0c4a6e" strokeWidth="2" />
        <polygon points="340,385 350,390 340,395" fill="#0c4a6e" />
        <text x="200" y="410" textAnchor="middle" fill="#0f172a" fontSize="12">Videonazorat ma'lumotlari</text>
        
        {/* Output arrows */}
        <line x1="550" y1="310" x2="800" y2="310" stroke="#0c4a6e" strokeWidth="2" />
        <polygon points="790,305 800,310 790,315" fill="#0c4a6e" />
        <text x="675" y="300" textAnchor="middle" fill="#0f172a" fontSize="12">Suv taqsimot rejasi</text>

        <line x1="550" y1="340" x2="800" y2="340" stroke="#0c4a6e" strokeWidth="2" />
        <polygon points="790,335 800,340 790,345" fill="#0c4a6e" />
        <text x="675" y="360" textAnchor="middle" fill="#0f172a" fontSize="12">Suv sarfiyoti hisoboti</text>

        <line x1="550" y1="370" x2="800" y2="370" stroke="#0c4a6e" strokeWidth="2" />
        <polygon points="790,365 800,370 790,375" fill="#0c4a6e" />
        <text x="675" y="390" textAnchor="middle" fill="#0f172a" fontSize="12">Bashorat ma'lumotlari</text>

        {/* Control arrows (top) */}
        <line x1="450" y1="100" x2="450" y2="300" stroke="#0c4a6e" strokeWidth="2" />
        <polygon points="445,290 450,300 455,290" fill="#0c4a6e" />
        <text x="450" y="150" textAnchor="middle" fill="#0f172a" fontSize="12">Qonunchilik va me'yoriy hujjatlar</text>

        <line x1="390" y1="100" x2="390" y2="300" stroke="#0c4a6e" strokeWidth="2" />
        <polygon points="385,290 390,300 395,290" fill="#0c4a6e" />
        <text x="390" y="180" textAnchor="middle" fill="#0f172a" fontSize="12">Ob-havo ma'lumotlari</text>

        <line x1="510" y1="100" x2="510" y2="300" stroke="#0c4a6e" strokeWidth="2" />
        <polygon points="505,290 510,300 515,290" fill="#0c4a6e" />
        <text x="510" y="180" textAnchor="middle" fill="#0f172a" fontSize="12">Xalqaro shartnomalar</text>

        {/* Mechanism arrows (bottom) */}
        <line x1="390" y1="600" x2="390" y2="420" stroke="#0c4a6e" strokeWidth="2" />
        <polygon points="385,430 390,420 395,430" fill="#0c4a6e" />
        <text x="390" y="550" textAnchor="middle" fill="#0f172a" fontSize="12">Monitoring tizimi</text>

        <line x1="450" y1="600" x2="450" y2="420" stroke="#0c4a6e" strokeWidth="2" />
        <polygon points="445,430 450,420 455,430" fill="#0c4a6e" />
        <text x="450" y="550" textAnchor="middle" fill="#0f172a" fontSize="12">LSTM bashorat modeli</text>

        <line x1="510" y1="600" x2="510" y2="420" stroke="#0c4a6e" strokeWidth="2" />
        <polygon points="505,430 510,420 515,430" fill="#0c4a6e" />
        <text x="510" y="550" textAnchor="middle" fill="#0f172a" fontSize="12">GIS tizimi</text>

        {/* A0 Title */}
        <text x="450" y="50" textAnchor="middle" fontWeight="bold" fill="#0f172a" fontSize="20">
          Suv resurslari boshqarish IDEF0 modeli
        </text>
        <text x="450" y="75" textAnchor="middle" fontWeight="bold" fill="#0f172a" fontSize="14">
          A-0 darajasi
        </text>

        {/* Legend */}
        <rect x="700" y="600" width="180" height="100" fill="white" stroke="#64748b" strokeWidth="1" />
        <text x="790" y="620" textAnchor="middle" fontWeight="bold" fill="#0f172a" fontSize="14">
          Belgilar
        </text>
        
        <line x1="710" y1="640" x2="740" y2="640" stroke="#0c4a6e" strokeWidth="2" />
        <polygon points="730,635 740,640 730,645" fill="#0c4a6e" />
        <text x="765" y="645" textAnchor="start" fill="#0f172a" fontSize="12">Kirishlar</text>
        
        <line x1="710" y1="660" x2="740" y2="660" stroke="#0c4a6e" strokeWidth="2" />
        <polygon points="730,655 740,660 730,665" fill="#0c4a6e" />
        <text x="765" y="665" textAnchor="start" fill="#0f172a" fontSize="12">Chiqishlar</text>
        
        <line x1="725" y1="680" x2="725" y2="695" stroke="#0c4a6e" strokeWidth="2" />
        <polygon points="720,685 725,675 730,685" fill="#0c4a6e" />
        <text x="765" y="685" textAnchor="start" fill="#0f172a" fontSize="12">Boshqaruv</text>
        
        <line x1="725" y1="695" x2="725" y2="680" stroke="#0c4a6e" strokeWidth="2" />
        <polygon points="720,690 725,700 730,690" fill="#0c4a6e" />
        <text x="770" y="705" textAnchor="start" fill="#0f172a" fontSize="12">Mexanizmlar</text>
      </svg>
      
      {/* Decomposition diagram - A0 level */}
      <svg width="900" height="720" viewBox="0 0 900 720" className="mx-auto mt-10">
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
        
        {/* Control lines (top) */}
        <line x1="275" y1="100" x2="275" y2="150" stroke="#0c4a6e" strokeWidth="2" />
        <polygon points="270,140 275,150 280,140" fill="#0c4a6e" />
        <text x="275" y="90" textAnchor="middle" fill="#0f172a" fontSize="10">Me'yoriy hujjatlar</text>
        
        <line x1="475" y1="100" x2="475" y2="150" stroke="#0c4a6e" strokeWidth="2" />
        <polygon points="470,140 475,150 480,140" fill="#0c4a6e" />
        <text x="475" y="90" textAnchor="middle" fill="#0f172a" fontSize="10">Tahlil algoritmlari</text>
        
        <line x1="675" y1="100" x2="675" y2="150" stroke="#0c4a6e" strokeWidth="2" />
        <polygon points="670,140 675,150 680,140" fill="#0c4a6e" />
        <text x="675" y="90" textAnchor="middle" fill="#0f172a" fontSize="10">LSTM model parametrlari</text>
        
        {/* Mechanism lines (bottom) */}
        <line x1="275" y1="500" x2="275" y2="450" stroke="#0c4a6e" strokeWidth="2" />
        <polygon points="270,460 275,450 280,460" fill="#0c4a6e" />
        <text x="275" y="510" textAnchor="middle" fill="#0f172a" fontSize="10">GIS tizimi</text>
        
        <line x1="475" y1="500" x2="475" y2="450" stroke="#0c4a6e" strokeWidth="2" />
        <polygon points="470,460 475,450 480,460" fill="#0c4a6e" />
        <text x="475" y="510" textAnchor="middle" fill="#0f172a" fontSize="10">Videonazorat tizimi</text>
        
        <line x1="675" y1="500" x2="675" y2="450" stroke="#0c4a6e" strokeWidth="2" />
        <polygon points="670,460 675,450 680,460" fill="#0c4a6e" />
        <text x="675" y="510" textAnchor="middle" fill="#0f172a" fontSize="10">Hisobotlar tizimi</text>
      </svg>
    </div>
  );
}