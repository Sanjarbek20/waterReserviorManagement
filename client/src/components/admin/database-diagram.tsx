import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function DatabaseDiagram() {
  return (
    <Card className="shadow-md">
      <CardHeader className="pb-2">
        <CardTitle>Ma'lumotlar bazasi ER modeli</CardTitle>
        <CardDescription>
          Tizim jadvallarining tuzilishi va bog'liqliklari
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-auto">
          <svg width="900" height="620" viewBox="0 0 900 620" className="mx-auto">
            {/* User Table */}
            <rect x="40" y="40" width="220" height="200" rx="5" fill="#f8fafc" stroke="#475569" strokeWidth="2" />
            <text x="150" y="25" textAnchor="middle" fontWeight="bold" fill="#0f172a" fontSize="14">USERS</text>
            <line x1="40" y1="70" x2="260" y2="70" stroke="#475569" strokeWidth="2" />
            <text x="50" y="60" fill="#0f172a" fontWeight="bold">id <tspan fill="#6b7280">(PK, serial)</tspan></text>
            <text x="50" y="90" fill="#0f172a">username <tspan fill="#6b7280">(text, unique)</tspan></text>
            <text x="50" y="110" fill="#0f172a">password <tspan fill="#6b7280">(text)</tspan></text>
            <text x="50" y="130" fill="#0f172a">firstName <tspan fill="#6b7280">(text)</tspan></text>
            <text x="50" y="150" fill="#0f172a">lastName <tspan fill="#6b7280">(text)</tspan></text>
            <text x="50" y="170" fill="#0f172a">role <tspan fill="#6b7280">(text)</tspan></text>
            <text x="50" y="190" fill="#0f172a">fieldSize <tspan fill="#6b7280">(text, nullable)</tspan></text>
            <text x="50" y="210" fill="#0f172a">cropType <tspan fill="#6b7280">(text, nullable)</tspan></text>
            <rect x="40" y="40" width="220" height="200" rx="5" fill="none" stroke="#0369a1" strokeWidth="2" />

            {/* Reservoir Table */}
            <rect x="580" y="40" width="280" height="180" rx="5" fill="#f8fafc" stroke="#475569" strokeWidth="2" />
            <text x="720" y="25" textAnchor="middle" fontWeight="bold" fill="#0f172a" fontSize="14">RESERVOIRS</text>
            <line x1="580" y1="70" x2="860" y2="70" stroke="#475569" strokeWidth="2" />
            <text x="590" y="60" fill="#0f172a" fontWeight="bold">id <tspan fill="#6b7280">(PK, serial)</tspan></text>
            <text x="590" y="90" fill="#0f172a">name <tspan fill="#6b7280">(text)</tspan></text>
            <text x="590" y="110" fill="#0f172a">capacity <tspan fill="#6b7280">(text)</tspan></text>
            <text x="590" y="130" fill="#0f172a">currentLevel <tspan fill="#6b7280">(text)</tspan></text>
            <text x="590" y="150" fill="#0f172a">location <tspan fill="#6b7280">(text, nullable)</tspan></text>
            <text x="590" y="170" fill="#0f172a">lastUpdated <tspan fill="#6b7280">(timestamp, nullable)</tspan></text>
            <rect x="580" y="40" width="280" height="180" rx="5" fill="none" stroke="#0369a1" strokeWidth="2" />

            {/* WaterAllocation Table */}
            <rect x="320" y="300" width="260" height="200" rx="5" fill="#f8fafc" stroke="#475569" strokeWidth="2" />
            <text x="450" y="285" textAnchor="middle" fontWeight="bold" fill="#0f172a" fontSize="14">WATER_ALLOCATIONS</text>
            <line x1="320" y1="330" x2="580" y2="330" stroke="#475569" strokeWidth="2" />
            <text x="330" y="320" fill="#0f172a" fontWeight="bold">id <tspan fill="#6b7280">(PK, serial)</tspan></text>
            <text x="330" y="350" fill="#0f172a">userId <tspan fill="#6b7280">(FK, integer)</tspan></text>
            <text x="330" y="370" fill="#0f172a">reservoirId <tspan fill="#6b7280">(FK, integer)</tspan></text>
            <text x="330" y="390" fill="#0f172a">amount <tspan fill="#6b7280">(text)</tspan></text>
            <text x="330" y="410" fill="#0f172a">startDate <tspan fill="#6b7280">(timestamp)</tspan></text>
            <text x="330" y="430" fill="#0f172a">endDate <tspan fill="#6b7280">(timestamp)</tspan></text>
            <text x="330" y="450" fill="#0f172a">used <tspan fill="#6b7280">(text)</tspan></text>
            <rect x="320" y="300" width="260" height="200" rx="5" fill="none" stroke="#059669" strokeWidth="2" />

            {/* WaterRequest Table */}
            <rect x="40" y="300" width="230" height="200" rx="5" fill="#f8fafc" stroke="#475569" strokeWidth="2" />
            <text x="155" y="285" textAnchor="middle" fontWeight="bold" fill="#0f172a" fontSize="14">WATER_REQUESTS</text>
            <line x1="40" y1="330" x2="270" y2="330" stroke="#475569" strokeWidth="2" />
            <text x="50" y="320" fill="#0f172a" fontWeight="bold">id <tspan fill="#6b7280">(PK, serial)</tspan></text>
            <text x="50" y="350" fill="#0f172a">userId <tspan fill="#6b7280">(FK, integer)</tspan></text>
            <text x="50" y="370" fill="#0f172a">type <tspan fill="#6b7280">(text)</tspan></text>
            <text x="50" y="390" fill="#0f172a">amount <tspan fill="#6b7280">(text, nullable)</tspan></text>
            <text x="50" y="410" fill="#0f172a">status <tspan fill="#6b7280">(text)</tspan></text>
            <text x="50" y="430" fill="#0f172a">requestDate <tspan fill="#6b7280">(timestamp)</tspan></text>
            <text x="50" y="450" fill="#0f172a">responseDate <tspan fill="#6b7280">(timestamp, nullable)</tspan></text>
            <text x="50" y="470" fill="#0f172a">notes <tspan fill="#6b7280">(text, nullable)</tspan></text>
            <rect x="40" y="300" width="230" height="200" rx="5" fill="none" stroke="#059669" strokeWidth="2" />

            {/* Notification Table */}
            <rect x="630" y="300" width="230" height="180" rx="5" fill="#f8fafc" stroke="#475569" strokeWidth="2" />
            <text x="745" y="285" textAnchor="middle" fontWeight="bold" fill="#0f172a" fontSize="14">NOTIFICATIONS</text>
            <line x1="630" y1="330" x2="860" y2="330" stroke="#475569" strokeWidth="2" />
            <text x="640" y="320" fill="#0f172a" fontWeight="bold">id <tspan fill="#6b7280">(PK, serial)</tspan></text>
            <text x="640" y="350" fill="#0f172a">userId <tspan fill="#6b7280">(FK, integer)</tspan></text>
            <text x="640" y="370" fill="#0f172a">title <tspan fill="#6b7280">(text)</tspan></text>
            <text x="640" y="390" fill="#0f172a">message <tspan fill="#6b7280">(text)</tspan></text>
            <text x="640" y="410" fill="#0f172a">isRead <tspan fill="#6b7280">(boolean)</tspan></text>
            <text x="640" y="430" fill="#0f172a">createdAt <tspan fill="#6b7280">(timestamp)</tspan></text>
            <rect x="630" y="300" width="230" height="180" rx="5" fill="none" stroke="#059669" strokeWidth="2" />

            {/* Legend */}
            <rect x="320" y="530" width="260" height="80" rx="5" fill="#f8fafc" stroke="#475569" strokeWidth="2" />
            <text x="450" y="550" textAnchor="middle" fontWeight="bold" fill="#0f172a" fontSize="14">IZOH</text>
            <line x1="340" y1="560" x2="360" y2="560" stroke="#0369a1" strokeWidth="3" />
            <text x="370" y="565" fill="#0f172a" fontSize="12">Asosiy jadvallar</text>
            <line x1="340" y1="580" x2="360" y2="580" stroke="#059669" strokeWidth="3" />
            <text x="370" y="585" fill="#0f172a" fontSize="12">Bog'liq jadvallar</text>
            <text x="370" y="605" fill="#0f172a" fontSize="12">PK - Primary Key, FK - Foreign Key</text>

            {/* Relationships */}
            {/* User to WaterAllocation */}
            <line x1="150" y1="240" x2="150" y2="260" stroke="#475569" strokeWidth="2" strokeDasharray="5,3" />
            <line x1="150" y1="260" x2="350" y2="260" stroke="#475569" strokeWidth="2" strokeDasharray="5,3" />
            <line x1="350" y1="260" x2="350" y2="350" stroke="#475569" strokeWidth="2" strokeDasharray="5,3" />
            <circle cx="150" cy="240" r="5" fill="#475569" />
            <text x="170" y="255" fill="#0f172a" fontSize="12" fontWeight="bold">1</text>
            <text x="330" y="345" fill="#0f172a" fontSize="12" fontWeight="bold">N</text>
            
            {/* User to WaterRequest */}
            <line x1="100" y1="240" x2="100" y2="300" stroke="#475569" strokeWidth="2" strokeDasharray="5,3" />
            <circle cx="100" cy="240" r="5" fill="#475569" />
            <text x="85" y="270" fill="#0f172a" fontSize="12" fontWeight="bold">1</text>
            <text x="85" y="295" fill="#0f172a" fontSize="12" fontWeight="bold">N</text>
            
            {/* User to Notification */}
            <line x1="200" y1="240" x2="200" y2="270" stroke="#475569" strokeWidth="2" strokeDasharray="5,3" />
            <line x1="200" y1="270" x2="745" y2="270" stroke="#475569" strokeWidth="2" strokeDasharray="5,3" />
            <line x1="745" y1="270" x2="745" y2="350" stroke="#475569" strokeWidth="2" strokeDasharray="5,3" />
            <circle cx="200" cy="240" r="5" fill="#475569" />
            <text x="215" y="270" fill="#0f172a" fontSize="12" fontWeight="bold">1</text>
            <text x="760" y="345" fill="#0f172a" fontSize="12" fontWeight="bold">N</text>
            
            {/* Reservoir to WaterAllocation */}
            <line x1="720" y1="220" x2="720" y2="250" stroke="#475569" strokeWidth="2" strokeDasharray="5,3" />
            <line x1="720" y1="250" x2="450" y2="250" stroke="#475569" strokeWidth="2" strokeDasharray="5,3" />
            <line x1="450" y1="250" x2="450" y2="350" stroke="#475569" strokeWidth="2" strokeDasharray="5,3" />
            <circle cx="720" cy="220" r="5" fill="#475569" />
            <text x="730" y="235" fill="#0f172a" fontSize="12" fontWeight="bold">1</text>
            <text x="460" y="345" fill="#0f172a" fontSize="12" fontWeight="bold">N</text>
          </svg>
        </div>
      </CardContent>
    </Card>
  );
}