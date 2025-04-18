import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DatabaseDiagram() {
  return (
    <Card className="shadow-md">
      <CardHeader className="pb-2">
        <CardTitle>Ma'lumotlar bazasi ER modeli</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-auto">
          <svg width="800" height="500" viewBox="0 0 800 500" className="mx-auto">
            {/* User Table */}
            <rect x="40" y="40" width="180" height="180" rx="5" fill="#f8fafc" stroke="#475569" strokeWidth="2" />
            <text x="130" y="25" textAnchor="middle" fontWeight="bold" fill="#0f172a">USERS</text>
            <line x1="40" y1="70" x2="220" y2="70" stroke="#475569" strokeWidth="2" />
            <text x="50" y="60" fill="#0f172a" fontWeight="bold">id <tspan fill="#6b7280">(PK)</tspan></text>
            <text x="50" y="90" fill="#0f172a">username</text>
            <text x="50" y="110" fill="#0f172a">password</text>
            <text x="50" y="130" fill="#0f172a">firstName</text>
            <text x="50" y="150" fill="#0f172a">lastName</text>
            <text x="50" y="170" fill="#0f172a">role</text>
            <text x="50" y="190" fill="#0f172a">fieldSize</text>
            <text x="50" y="210" fill="#0f172a">cropType</text>

            {/* Reservoir Table */}
            <rect x="560" y="40" width="180" height="160" rx="5" fill="#f8fafc" stroke="#475569" strokeWidth="2" />
            <text x="650" y="25" textAnchor="middle" fontWeight="bold" fill="#0f172a">RESERVOIRS</text>
            <line x1="560" y1="70" x2="740" y2="70" stroke="#475569" strokeWidth="2" />
            <text x="570" y="60" fill="#0f172a" fontWeight="bold">id <tspan fill="#6b7280">(PK)</tspan></text>
            <text x="570" y="90" fill="#0f172a">name</text>
            <text x="570" y="110" fill="#0f172a">capacity</text>
            <text x="570" y="130" fill="#0f172a">currentLevel</text>
            <text x="570" y="150" fill="#0f172a">location</text>
            <text x="570" y="170" fill="#0f172a">lastUpdated</text>

            {/* WaterAllocation Table */}
            <rect x="300" y="260" width="180" height="180" rx="5" fill="#f8fafc" stroke="#475569" strokeWidth="2" />
            <text x="390" y="245" textAnchor="middle" fontWeight="bold" fill="#0f172a">WATER_ALLOCATIONS</text>
            <line x1="300" y1="290" x2="480" y2="290" stroke="#475569" strokeWidth="2" />
            <text x="310" y="280" fill="#0f172a" fontWeight="bold">id <tspan fill="#6b7280">(PK)</tspan></text>
            <text x="310" y="310" fill="#0f172a">userId <tspan fill="#6b7280">(FK)</tspan></text>
            <text x="310" y="330" fill="#0f172a">reservoirId <tspan fill="#6b7280">(FK)</tspan></text>
            <text x="310" y="350" fill="#0f172a">amount</text>
            <text x="310" y="370" fill="#0f172a">startDate</text>
            <text x="310" y="390" fill="#0f172a">endDate</text>
            <text x="310" y="410" fill="#0f172a">used</text>

            {/* WaterRequest Table */}
            <rect x="40" y="260" width="180" height="180" rx="5" fill="#f8fafc" stroke="#475569" strokeWidth="2" />
            <text x="130" y="245" textAnchor="middle" fontWeight="bold" fill="#0f172a">WATER_REQUESTS</text>
            <line x1="40" y1="290" x2="220" y2="290" stroke="#475569" strokeWidth="2" />
            <text x="50" y="280" fill="#0f172a" fontWeight="bold">id <tspan fill="#6b7280">(PK)</tspan></text>
            <text x="50" y="310" fill="#0f172a">userId <tspan fill="#6b7280">(FK)</tspan></text>
            <text x="50" y="330" fill="#0f172a">type</text>
            <text x="50" y="350" fill="#0f172a">amount</text>
            <text x="50" y="370" fill="#0f172a">status</text>
            <text x="50" y="390" fill="#0f172a">requestDate</text>
            <text x="50" y="410" fill="#0f172a">responseDate</text>
            <text x="50" y="430" fill="#0f172a">notes</text>

            {/* Notification Table */}
            <rect x="560" y="260" width="180" height="160" rx="5" fill="#f8fafc" stroke="#475569" strokeWidth="2" />
            <text x="650" y="245" textAnchor="middle" fontWeight="bold" fill="#0f172a">NOTIFICATIONS</text>
            <line x1="560" y1="290" x2="740" y2="290" stroke="#475569" strokeWidth="2" />
            <text x="570" y="280" fill="#0f172a" fontWeight="bold">id <tspan fill="#6b7280">(PK)</tspan></text>
            <text x="570" y="310" fill="#0f172a">userId <tspan fill="#6b7280">(FK)</tspan></text>
            <text x="570" y="330" fill="#0f172a">title</text>
            <text x="570" y="350" fill="#0f172a">message</text>
            <text x="570" y="370" fill="#0f172a">isRead</text>
            <text x="570" y="390" fill="#0f172a">createdAt</text>

            {/* Relationships */}
            {/* User to WaterAllocation */}
            <line x1="130" y1="220" x2="130" y2="240" stroke="#475569" strokeWidth="2" />
            <line x1="130" y1="240" x2="310" y2="240" stroke="#475569" strokeWidth="2" />
            <line x1="310" y1="240" x2="310" y2="310" stroke="#475569" strokeWidth="2" />
            <circle cx="130" cy="220" r="5" fill="#475569" />
            <text x="150" y="235" fill="#0f172a" fontSize="12">1</text>
            <text x="290" y="305" fill="#0f172a" fontSize="12">N</text>
            
            {/* User to WaterRequest */}
            <line x1="90" y1="220" x2="90" y2="260" stroke="#475569" strokeWidth="2" />
            <circle cx="90" cy="220" r="5" fill="#475569" />
            <text x="95" y="235" fill="#0f172a" fontSize="12">1</text>
            <text x="95" y="255" fill="#0f172a" fontSize="12">N</text>
            
            {/* User to Notification */}
            <line x1="170" y1="220" x2="170" y2="240" stroke="#475569" strokeWidth="2" />
            <line x1="170" y1="240" x2="650" y2="240" stroke="#475569" strokeWidth="2" />
            <line x1="650" y1="240" x2="650" y2="310" stroke="#475569" strokeWidth="2" />
            <circle cx="170" cy="220" r="5" fill="#475569" />
            <text x="180" y="235" fill="#0f172a" fontSize="12">1</text>
            <text x="640" y="305" fill="#0f172a" fontSize="12">N</text>
            
            {/* Reservoir to WaterAllocation */}
            <line x1="650" y1="200" x2="650" y2="220" stroke="#475569" strokeWidth="2" />
            <line x1="650" y1="220" x2="450" y2="220" stroke="#475569" strokeWidth="2" />
            <line x1="450" y1="220" x2="450" y2="310" stroke="#475569" strokeWidth="2" />
            <circle cx="650" cy="200" r="5" fill="#475569" />
            <text x="640" y="215" fill="#0f172a" fontSize="12">1</text>
            <text x="440" y="305" fill="#0f172a" fontSize="12">N</text>
          </svg>
        </div>
      </CardContent>
    </Card>
  );
}