import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CloudRain, Wind, Droplet } from "lucide-react";

type WeatherDataItem = {
  temp: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  precipitation: string;
  forecastNext5Days: Array<{
    day: string;
    temp: number;
    condition: string;
    precipitation: string;
  }>;
};

type WeatherData = {
  [key: string]: WeatherDataItem;
};

const weatherData: WeatherData = {
  "Toshkent": { temp: 28, condition: "Quyoshli", humidity: 45, windSpeed: 12, precipitation: "0 mm", forecastNext5Days: [
    { day: "Du", temp: 29, condition: "Quyoshli", precipitation: "0 mm" },
    { day: "Se", temp: 30, condition: "Quyoshli", precipitation: "0 mm" },
    { day: "Ch", temp: 27, condition: "Qisman bulutli", precipitation: "0 mm" },
    { day: "Pa", temp: 25, condition: "Bulutli", precipitation: "2 mm" },
    { day: "Ju", temp: 24, condition: "Yomg'irli", precipitation: "5 mm" },
  ]},
  "Namangan": { temp: 30, condition: "Quyoshli", humidity: 40, windSpeed: 8, precipitation: "0 mm", forecastNext5Days: [
    { day: "Du", temp: 31, condition: "Quyoshli", precipitation: "0 mm" },
    { day: "Se", temp: 32, condition: "Quyoshli", precipitation: "0 mm" },
    { day: "Ch", temp: 30, condition: "Qisman bulutli", precipitation: "0 mm" },
    { day: "Pa", temp: 29, condition: "Bulutli", precipitation: "0 mm" },
    { day: "Ju", temp: 27, condition: "Qisman bulutli", precipitation: "2 mm" },
  ]},
  "Andijon": { temp: 29, condition: "Quyoshli", humidity: 42, windSpeed: 10, precipitation: "0 mm", forecastNext5Days: [
    { day: "Du", temp: 30, condition: "Quyoshli", precipitation: "0 mm" },
    { day: "Se", temp: 31, condition: "Quyoshli", precipitation: "0 mm" },
    { day: "Ch", temp: 29, condition: "Qisman bulutli", precipitation: "0 mm" },
    { day: "Pa", temp: 27, condition: "Bulutli", precipitation: "1 mm" },
    { day: "Ju", temp: 26, condition: "Yomg'irli", precipitation: "4 mm" },
  ]},
  "Farg'ona": { temp: 31, condition: "Quyoshli", humidity: 38, windSpeed: 9, precipitation: "0 mm", forecastNext5Days: [
    { day: "Du", temp: 32, condition: "Quyoshli", precipitation: "0 mm" },
    { day: "Se", temp: 33, condition: "Quyoshli", precipitation: "0 mm" },
    { day: "Ch", temp: 31, condition: "Qisman bulutli", precipitation: "0 mm" },
    { day: "Pa", temp: 29, condition: "Qisman bulutli", precipitation: "0 mm" },
    { day: "Ju", temp: 28, condition: "Bulutli", precipitation: "2 mm" },
  ]},
  "Buxoro": { temp: 32, condition: "Quyoshli", humidity: 30, windSpeed: 14, precipitation: "0 mm", forecastNext5Days: [
    { day: "Du", temp: 33, condition: "Quyoshli", precipitation: "0 mm" },
    { day: "Se", temp: 34, condition: "Quyoshli", precipitation: "0 mm" },
    { day: "Ch", temp: 33, condition: "Quyoshli", precipitation: "0 mm" },
    { day: "Pa", temp: 31, condition: "Qisman bulutli", precipitation: "0 mm" },
    { day: "Ju", temp: 30, condition: "Qisman bulutli", precipitation: "0 mm" },
  ]},
  "Xorazm": { temp: 29, condition: "Qisman bulutli", humidity: 45, windSpeed: 11, precipitation: "0 mm", forecastNext5Days: [
    { day: "Du", temp: 30, condition: "Qisman bulutli", precipitation: "0 mm" },
    { day: "Se", temp: 31, condition: "Quyoshli", precipitation: "0 mm" },
    { day: "Ch", temp: 30, condition: "Qisman bulutli", precipitation: "0 mm" },
    { day: "Pa", temp: 28, condition: "Bulutli", precipitation: "2 mm" },
    { day: "Ju", temp: 26, condition: "Yomg'irli", precipitation: "5 mm" },
  ]},
};

export default function NewWeatherWidget() {
  const [selectedCity, setSelectedCity] = useState<keyof WeatherData>("Toshkent");

  // Icon rendering function based on condition
  const renderWeatherIcon = () => {
    // You can replace this with more detailed SVG icons for different weather conditions
    return (
      <svg width="80" height="80" viewBox="0 0 64 64" className="text-blue-500">
        <path fill="currentColor" d="M16 10a6 6 0 0112 0 6 6 0 01-12 0zm6-8a8 8 0 100 16 8 8 0 000-16zM4 30a4 4 0 018 0 4 4 0 01-8 0zm4-6a6 6 0 100 12 6 6 0 000-12zm10 8a3 3 0 01-3-3h-2a5 5 0 005 5h22a5 5 0 000-10H33a1 1 0 01-1-1c0-2.21-1.79-4-4-4a4 4 0 00-3.91 3.18 1 1 0 01-.78.82A5 5 0 0018 28h-2a7 7 0 1113.91-1h7.09a7 7 0 110 14H18z"/>
      </svg>
    );
  };

  return (
    <Card className="shadow-md">
      <CardContent className="p-6 pb-4">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-lg font-semibold mb-1">Ob-havo ma'lumotlari</h2>
            <div className="text-sm text-gray-500">O'zbekiston viloyati</div>
          </div>
          <Select 
            value={selectedCity} 
            onValueChange={(value: string) => setSelectedCity(value as keyof WeatherData)}
          >
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Shahar" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Toshkent">Toshkent</SelectItem>
              <SelectItem value="Namangan">Namangan</SelectItem>
              <SelectItem value="Andijon">Andijon</SelectItem>
              <SelectItem value="Farg'ona">Farg'ona</SelectItem>
              <SelectItem value="Buxoro">Buxoro</SelectItem>
              <SelectItem value="Xorazm">Xorazm</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex flex-col">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-3xl font-bold mb-1">{weatherData[selectedCity].temp}°C</div>
              <div className="text-base">{selectedCity}</div>
            </div>
            <div className="text-blue-500">
              {renderWeatherIcon()}
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="flex flex-col items-center bg-gray-50 rounded-md p-3">
              <CloudRain className="w-5 h-5 text-blue-500 mb-1" />
              <span className="text-xs text-gray-500 mb-1">Yog'ingarchilik</span>
              <span className="text-sm font-medium">{weatherData[selectedCity].precipitation}</span>
            </div>
            <div className="flex flex-col items-center bg-gray-50 rounded-md p-3">
              <Wind className="w-5 h-5 text-blue-500 mb-1" />
              <span className="text-xs text-gray-500 mb-1">Shamol</span>
              <span className="text-sm font-medium">{weatherData[selectedCity].windSpeed} km/s</span>
            </div>
            <div className="flex flex-col items-center bg-gray-50 rounded-md p-3">
              <Droplet className="w-5 h-5 text-blue-500 mb-1" />
              <span className="text-xs text-gray-500 mb-1">Namlik</span>
              <span className="text-sm font-medium">{weatherData[selectedCity].humidity}%</span>
            </div>
          </div>
          
          <div className="mt-6">
            <h3 className="text-sm font-medium mb-2">5 kunlik bashorat</h3>
            <div className="grid grid-cols-5 divide-x divide-gray-100">
              {weatherData[selectedCity].forecastNext5Days.map((day, index) => (
                <div key={index} className="flex flex-col items-center text-center p-1">
                  <span className="text-xs font-medium">{day.day}</span>
                  <span className="text-sm font-semibold my-1">{day.temp}°C</span>
                  <span className="text-xs text-blue-500">{day.precipitation}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}