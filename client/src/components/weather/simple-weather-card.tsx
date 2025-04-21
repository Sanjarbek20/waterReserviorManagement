import { Card, CardContent } from "@/components/ui/card";
import { CloudSun } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

const cities = [
  { name: "Toshkent", temp: 28, conditions: "Quyoshli" },
  { name: "Samarqand", temp: 30, conditions: "Quyoshli" },
  { name: "Buxoro", temp: 32, conditions: "Quyoshli" },
  { name: "Andijon", temp: 29, conditions: "Qisman bulutli" },
  { name: "Namangan", temp: 30, conditions: "Quyoshli" },
  { name: "Farg'ona", temp: 31, conditions: "Quyoshli" },
];

interface SimpleWeatherCardProps {
  className?: string;
}

export default function SimpleWeatherCard({ className = "" }: SimpleWeatherCardProps) {
  const [selectedCity, setSelectedCity] = useState("Toshkent");
  
  const city = cities.find(c => c.name === selectedCity) || cities[0];
  
  return (
    <Card className={`overflow-hidden ${className}`}>
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-lg font-semibold mb-1">Ob-havo ma'lumotlari</h2>
            <p className="text-sm text-gray-500">O'zbekiston viloyati</p>
          </div>
          <Select 
            value={selectedCity} 
            onValueChange={(value: string) => setSelectedCity(value)}
          >
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Shahar" />
            </SelectTrigger>
            <SelectContent>
              {cities.map(city => (
                <SelectItem key={city.name} value={city.name}>{city.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <p className="text-3xl font-bold">{city.temp}°C</p>
            <p className="text-sm text-gray-600">{city.name}</p>
          </div>
          <div className="text-blue-500">
            <CloudSun size={64} />
          </div>
        </div>
        
        <div className="mt-4 grid grid-cols-5 gap-2">
          {[
            { day: "Du", temp: 29, precipitation: "0 mm" },
            { day: "Se", temp: 30, precipitation: "0 mm" },
            { day: "Ch", temp: 27, precipitation: "0 mm" },
            { day: "Pa", temp: 25, precipitation: "2 mm" },
            { day: "Ju", temp: 24, precipitation: "5 mm" }
          ].map((day, i) => (
            <div key={i} className="text-center">
              <p className="text-xs font-medium">{day.day}</p>
              <p className="text-sm font-bold my-1">{day.temp}°</p>
              <p className="text-xs text-blue-500">{day.precipitation}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}