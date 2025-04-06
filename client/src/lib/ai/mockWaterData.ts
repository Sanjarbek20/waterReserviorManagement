import { format, addDays, subDays } from 'date-fns';

export type WaterConsumptionDataPoint = {
  date: string; // ISO format date string
  value: number; // Water consumption in cubic meters
};

/**
 * Tarixiy suv iste'moli ma'lumotlarini generatsiya qilish
 * @param days Kunlar soni
 * @returns Suv iste'moli ma'lumotlari
 */
export function generateHistoricalWaterData(days: number): WaterConsumptionDataPoint[] {
  const today = new Date();
  const data: WaterConsumptionDataPoint[] = [];

  // Baza iste'mol darajasi (m³)
  const baseConsumption = 1200;
  
  // So'nggi {days} kunlik ma'lumotlarni generatsiya qilish
  for (let i = days; i > 0; i--) {
    const date = subDays(today, i);
    const dateStr = format(date, 'yyyy-MM-dd');
    
    // Mavsumiy o'zgarish (yilning davri bo'yicha)
    const seasonalComponent = Math.sin((date.getMonth() / 12) * Math.PI * 2) * 100;
    
    // Hafta kuni ta'siri (dam olish kunlari iste'mol kamroq)
    const dayOfWeekEffect = date.getDay() === 0 || date.getDay() === 6 ? -50 : 0;
    
    // Tasodifiy tebranishlar (±50 m³)
    const randomVariation = Math.floor(Math.random() * 100) - 50;
    
    // Tendensiya (vaqt o'tishi bilan ortib borish)
    const trendComponent = (days - i) * 0.5;
    
    // Jami iste'mol
    const consumption = Math.max(
      800, // Minimal iste'mol
      Math.floor(baseConsumption + seasonalComponent + dayOfWeekEffect + randomVariation + trendComponent)
    );
    
    data.push({
      date: dateStr,
      value: consumption
    });
  }

  return data;
}

/**
 * Oddiy bashorat ma'lumotlarini yaratish
 * @param days Bashorat kunlari soni
 * @param historicalData Tarixiy ma'lumotlar
 * @returns Bashorat qilingan ma'lumotlar
 */
export function generateForecastWaterData(
  days: number, 
  historicalData: WaterConsumptionDataPoint[]
): WaterConsumptionDataPoint[] {
  if (historicalData.length === 0) return [];
  
  const lastDate = new Date(historicalData[historicalData.length - 1].date);
  const lastValues = historicalData.slice(-7).map(d => d.value);
  const averageConsumption = lastValues.reduce((sum, val) => sum + val, 0) / lastValues.length;
  
  const data: WaterConsumptionDataPoint[] = [];
  
  // Keyingi {days} kunlik bashoratni generatsiya qilish
  for (let i = 1; i <= days; i++) {
    const date = addDays(lastDate, i);
    const dateStr = format(date, 'yyyy-MM-dd');
    
    // Mavsumiy o'zgarish
    const seasonalComponent = Math.sin((date.getMonth() / 12) * Math.PI * 2) * 100;
    
    // Hafta kuni ta'siri
    const dayOfWeekEffect = date.getDay() === 0 || date.getDay() === 6 ? -50 : 0;
    
    // Tasodifiy o'zgarish
    const randomVariation = Math.floor(Math.random() * 60) - 30;
    
    // Trend (ma'lum darajada o'sish)
    const trendComponent = i * 2;
    
    // Jami bashoratlangan iste'mol
    let forecastValue = Math.max(
      800,
      Math.floor(averageConsumption + seasonalComponent + dayOfWeekEffect + randomVariation + trendComponent)
    );
    
    data.push({
      date: dateStr,
      value: forecastValue
    });
  }
  
  return data;
}

/**
 * Iste'mol o'zgarishini foizlarda hisoblash
 * @param historicalData Tarixiy ma'lumotlar
 * @returns O'zgarish foizi
 */
export function calculateConsumptionChange(historicalData: WaterConsumptionDataPoint[]): number {
  if (historicalData.length < 30) return 0;
  
  // So'nggi 30 kunlik ma'lumotlar
  const recentData = historicalData.slice(-30);
  
  // So'nggi 15 kun
  const last15Days = recentData.slice(-15);
  const last15DaysAvg = last15Days.reduce((sum, item) => sum + item.value, 0) / 15;
  
  // Oldingi 15 kun
  const previous15Days = recentData.slice(0, 15);
  const previous15DaysAvg = previous15Days.reduce((sum, item) => sum + item.value, 0) / 15;
  
  // O'zgarish foizi
  const changePercent = Math.round(((last15DaysAvg - previous15DaysAvg) / previous15DaysAvg) * 100);
  
  return changePercent;
}

/**
 * Suv tanqisligi bashorati
 * @param historicalData Tarixiy ma'lumotlar
 * @param forecastData Bashorat ma'lumotlari
 * @returns Tanqislik analizi
 */
export function predictWaterShortage(
  historicalData: WaterConsumptionDataPoint[],
  forecastData: WaterConsumptionDataPoint[]
): {
  willHaveShortage: boolean,
  shortageStartDate: string | null,
  shortageAmount: number,
  shortagePercentage: number
} {
  // Suv ta'minoti imkoniyati (m³/kun)
  const waterSupplyCapacity = 1500;
  
  let willHaveShortage = false;
  let shortageStartDate: string | null = null;
  let shortageAmount = 0;
  let shortagePercentage = 0;
  
  // Bashorat ma'lumotlarini ko'rib chiqish
  for (const dataPoint of forecastData) {
    if (dataPoint.value > waterSupplyCapacity) {
      if (!willHaveShortage) {
        willHaveShortage = true;
        shortageStartDate = dataPoint.date;
      }
      
      // Tanqislik miqdorini hisoblash
      const currentShortage = dataPoint.value - waterSupplyCapacity;
      shortageAmount += currentShortage;
    }
  }
  
  // Tanqislik aniqlangan bo'lsa, umumiy foizni hisoblash
  if (willHaveShortage) {
    const totalForecastConsumption = forecastData.reduce((sum, item) => sum + item.value, 0);
    shortagePercentage = Math.round((shortageAmount / totalForecastConsumption) * 100);
  }
  
  return {
    willHaveShortage,
    shortageStartDate,
    shortageAmount,
    shortagePercentage
  };
}