import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CloudRain, Wind, Droplet, CloudSun } from "lucide-react";

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

export default function WeatherWidget() {
  const [selectedCity, setSelectedCity] = useState<keyof WeatherData>("Toshkent");

  return (
    <Card className="shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-base">Ob-havo ma'lumotlari</CardTitle>
          <Select 
            value={String(selectedCity)} 
            onValueChange={(value: string) => setSelectedCity(value as keyof WeatherData)}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Shaharni tanlang" />
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
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <span className="text-3xl font-bold">{weatherData[selectedCity].temp}°C</span>
              <span className="text-sm text-gray-500">{selectedCity}, Quyoshli</span>
            </div>
            <div>
              <CloudSun className="w-16 h-16 text-blue-500" />
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-2 mt-4">
            <div className="flex flex-col items-center text-center p-2 bg-blue-50 rounded">
              <CloudRain className="w-6 h-6 text-blue-500 mb-2" />
              <span className="text-xs text-gray-500">Yog'ingarchilik</span>
              <span className="text-sm font-medium">{weatherData[selectedCity].precipitation}</span>
            </div>
            <div className="flex flex-col items-center text-center p-2 bg-blue-50 rounded">
              <Wind className="w-6 h-6 text-blue-500 mb-2" />
              <span className="text-xs text-gray-500">Shamol</span>
              <span className="text-sm font-medium">{weatherData[selectedCity].windSpeed} km/s</span>
            </div>
            <div className="flex flex-col items-center text-center p-2 bg-blue-50 rounded">
              <Droplet className="w-6 h-6 text-blue-500 mb-2" />
              <span className="text-xs text-gray-500">Namlik</span>
              <span className="text-sm font-medium">{weatherData[selectedCity].humidity}%</span>
            </div>
          </div>
          
          <div className="mt-4">
            <h3 className="text-sm font-medium mb-2">5 kunlik bashorat</h3>
            <div className="grid grid-cols-5 gap-2 bg-gray-50 rounded-lg p-2">
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