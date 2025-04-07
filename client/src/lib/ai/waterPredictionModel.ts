import * as tf from '@tensorflow/tfjs';

// Turli ekinlar uchun o'rtacha suv talabi (litr/kun/gektar)
export const cropWaterRequirements: Record<string, number> = {
  "paxta": 45, // Paxta
  "bug'doy": 35, // Bug'doy
  "sholi": 80, // Sholi
  "makkajo'xori": 40, // Makkajo'xori
  "kartoshka": 30, // Kartoshka
  "pomidor": 35, // Pomidor
  "piyoz": 25, // Piyoz
  "bodring": 40, // Bodring
  "sabzi": 30, // Sabzi
  "olma": 25, // Olma
  "uzum": 20, // Uzum
  "o'rik": 22, // O'rik
};

// Ekinlarning o'sish davrlari va suvga talabi
export interface CropGrowthStage {
  name: string; // Bosqich nomi
  durationDays: number; // Davomiyligi (kun)
  waterMultiplier: number; // Suv koeffitsienti (o'rtacha talabga nisbatan)
}

// Har bir ekin turi uchun o'sish davrlari
export const cropGrowthStages: Record<string, CropGrowthStage[]> = {
  "paxta": [
    { name: "unib chiqish", durationDays: 30, waterMultiplier: 0.6 },
    { name: "vegetativ o'sish", durationDays: 45, waterMultiplier: 1.0 },
    { name: "gullash va hosil tugish", durationDays: 40, waterMultiplier: 1.5 },
    { name: "yetilish", durationDays: 30, waterMultiplier: 0.8 }
  ],
  "bug'doy": [
    { name: "unib chiqish", durationDays: 20, waterMultiplier: 0.5 },
    { name: "tuplanish", durationDays: 30, waterMultiplier: 0.8 },
    { name: "boshoqlash", durationDays: 35, waterMultiplier: 1.3 },
    { name: "pishish", durationDays: 25, waterMultiplier: 0.7 }
  ],
  // Boshqa ekinlar uchun ham shunga o'xshash ma'lumotlar qo'shilishi mumkin
};

/**
 * Suv iste'moli bashorati uchun LSTM modelini yaratuvchi class
 */
export class WaterConsumptionForecastModel {
  private model: tf.LayersModel | null = null;
  private isTraining: boolean = false;
  private windowSize: number = 7; // 7 kunlik ma'lumotlar asosida bashorat
  private lookAhead: number = 1; // Bir kun oldinga bashorat
  
  constructor() {
    // Model arxitekturasini yaratish
    this.buildModel();
  }
  
  /**
   * LSTM model arxitekturasini yaratish
   */
  private buildModel(): void {
    try {
      // Model yaratish
      const model = tf.sequential();
      
      // LSTM qatlami qo'shish
      model.add(tf.layers.lstm({
        units: 50,
        returnSequences: false,
        inputShape: [this.windowSize, 1]
      }));
      
      // Chiqish qatlami
      model.add(tf.layers.dense({
        units: this.lookAhead,
        activation: 'linear'
      }));

      // Modelni kompilatsiya qilish
      model.compile({
        optimizer: tf.train.adam(0.001),
        loss: 'meanSquaredError'
      });
      
      this.model = model;
    } catch (error) {
      console.error('Model yaratishda xatolik:', error);
      throw new Error('TensorFlow.js model yaratib bo\'lmadi');
    }
  }
  
  /**
   * Ma'lumotlarni model o'qitish uchun formatlash
   * @param data Asl ma'lumotlar
   * @returns O'qitish uchun formatlangan ma'lumotlar
   */
  private prepareTrainingData(data: number[]): {
    inputs: tf.Tensor3D,
    outputs: tf.Tensor2D
  } {
    const x: number[][][] = [];
    const y: number[][] = [];
    
    // Ma'lumotlarni oynalar shaklida formatlash
    for (let i = 0; i < data.length - this.windowSize - this.lookAhead + 1; i++) {
      const window = data.slice(i, i + this.windowSize);
      const target = data.slice(i + this.windowSize, i + this.windowSize + this.lookAhead);
      
      // Har bir oyna uchun [window, 1] formatida qo'shamiz (3D tensor uchun)
      const windowWithFeatures: number[][] = window.map(val => [val]);
      x.push(windowWithFeatures);
      y.push(target);
    }
    
    // TensorFlow tensorlariga o'zgartirish
    // 3D tensor: [namunalar soni, vaqt qadamlari, xususiyatlar soni]
    const xs = tf.tensor3d(x);
    const ys = tf.tensor2d(y);
    
    return { inputs: xs, outputs: ys };
  }
  
  /**
   * Ma'lumotlarni bashorat uchun normalashtirish
   * @param data Ma'lumotlar massivi
   * @returns Normallashtirish parametrlari va normallashtirilgan ma'lumotlar
   */
  private normalizeData(data: number[]): {
    normalizedData: number[],
    min: number,
    max: number
  } {
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min;
    
    // Ma'lumotlarni [0, 1] oralig'ida normalashtirish
    const normalizedData = data.map(x => (x - min) / range);
    
    return { normalizedData, min, max };
  }
  
  /**
   * Normallashtirilgan ma'lumotlarni asl o'lchoviga qaytarish
   * @param normalizedData Normallashtirilgan ma'lumotlar
   * @param min Minimal qiymat
   * @param max Maksimal qiymat
   * @returns Asl o'lchovdagi ma'lumotlar
   */
  private denormalizeData(normalizedData: number[], min: number, max: number): number[] {
    const range = max - min;
    return normalizedData.map(x => x * range + min);
  }
  
  /**
   * Modelni o'qitish
   * @param data Tarixiy suv iste'moli ma'lumotlari
   */
  async train(data: number[]): Promise<void> {
    if (!this.model || data.length < this.windowSize + this.lookAhead) {
      throw new Error('Model yaratilmagan yoki ma\'lumotlar yetarli emas');
    }
    
    this.isTraining = true;
    
    try {
      // Ma'lumotlarni normalashtirish
      const { normalizedData } = this.normalizeData(data);
      
      // O'qitish uchun ma'lumotlarni tayyorlash
      const { inputs, outputs } = this.prepareTrainingData(normalizedData);
      
      // Modelni o'qitish
      await this.model.fit(inputs, outputs, {
        epochs: 50,
        batchSize: 32,
        shuffle: true,
        verbose: 0
      });
      
      // Xotiradan bo'shatish
      inputs.dispose();
      outputs.dispose();
      
      this.isTraining = false;
    } catch (error) {
      this.isTraining = false;
      throw error;
    }
  }
  
  /**
   * Keyingi bir necha kunlik suv iste'molini bashoratlash
   * @param data Tarixiy ma'lumotlar
   * @param daysToPredict Bashoratlash kerak bo'lgan kunlar soni
   * @returns Bashoratlangan qiymatlar massivi
   */
  async predictNextDays(data: number[], daysToPredict: number): Promise<number[]> {
    if (!this.model || this.isTraining || data.length < this.windowSize) {
      throw new Error('Model tayyor emas yoki ma\'lumotlar yetarli emas');
    }
    
    // Ma'lumotlarni normalashtirish
    const { normalizedData, min, max } = this.normalizeData(data);
    
    // Bashorat qilish uchun so'nggi ma'lumotlar oynasini olish
    let currentWindow = normalizedData.slice(-this.windowSize);
    const results: number[] = [];
    
    // Keyingi kunlar uchun bashorat
    for (let i = 0; i < daysToPredict; i++) {
      try {
        // Tensorni to'g'ridan-to'g'ri yaratish
        const reshapedInput = tf.tensor(currentWindow).reshape([1, this.windowSize, 1]);
        
        // Bashorat
        const prediction = this.model.predict(reshapedInput) as tf.Tensor;
        const predValue = prediction.dataSync()[0];
        
        // Natijalarni saqlash
        results.push(predValue);
        
        // Oynani yangilash
        currentWindow.shift();
        currentWindow.push(predValue);
        
        // Xotiradan bo'shatish
        reshapedInput.dispose();
        prediction.dispose();
      } catch (error) {
        console.error('Bashoratlashda xatolik:', error);
        // Xatolik bo'lsa, o'rtacha qiymatni qo'shamiz
        const avgValue = data.reduce((sum, val) => sum + val, 0) / data.length;
        results.push(avgValue);
      }
    }
    
    // Natijalarni asl o'lchovga qaytarish
    return this.denormalizeData(results, min, max);
  }
  
  /**
   * Ekin turiga qarab suv talabini hisoblash
   * @param cropType Ekin turi
   * @param fieldSizeHectares Maydon hajmi (gektar)
   * @param daysSincePlanting Ekishdan beri o'tgan kunlar
   * @returns Kunlik suv talabi (litr)
   */
  public static calculateCropWaterRequirement(
    cropType: string,
    fieldSizeHectares: number,
    daysSincePlanting: number
  ): number {
    // Agar ekin turi ma'lum bo'lmasa, o'rtacha qiymatni qaytarish
    if (!cropWaterRequirements[cropType]) {
      // O'rtacha suv talabi (barcha ekinlar uchun)
      const averageRequirement = Object.values(cropWaterRequirements).reduce((sum, val) => sum + val, 0) / 
                                Object.values(cropWaterRequirements).length;
      return averageRequirement * fieldSizeHectares;
    }
    
    // Asosiy suv talabi
    const baseRequirement = cropWaterRequirements[cropType];
    
    // Agar o'sish davrlari ma'lumotlari bo'lsa
    if (cropGrowthStages[cropType]) {
      const stages = cropGrowthStages[cropType];
      let currentDayInCycle = daysSincePlanting;
      let currentStageIndex = 0;
      
      // Joriy o'sish bosqichini aniqlash
      for (let i = 0; i < stages.length; i++) {
        if (currentDayInCycle <= stages[i].durationDays) {
          currentStageIndex = i;
          break;
        }
        currentDayInCycle -= stages[i].durationDays;
      }
      
      // Agar barcha bosqichlardan o'tgan bo'lsa, oxirgi bosqichni olish
      if (currentDayInCycle > 0 && currentStageIndex >= stages.length) {
        currentStageIndex = stages.length - 1;
      }
      
      // Bosqichga mos suv koeffitsientini qo'llash
      const waterMultiplier = stages[currentStageIndex].waterMultiplier;
      return baseRequirement * waterMultiplier * fieldSizeHectares;
    }
    
    // O'sish davrlari ma'lumotlari bo'lmasa, asosiy talabni qaytarish
    return baseRequirement * fieldSizeHectares;
  }
  
  /**
   * Suv ajratish tavsiyalarini shakllantirish
   * @param cropType Ekin turi
   * @param fieldSizeHectares Maydon hajmi (gektar)
   * @param daysSincePlanting Ekishdan beri o'tgan kunlar
   * @param forecastedWaterLevels Bashoratlangan suv hajmi
   * @param reservoirCapacity Suv ombori hajmi
   * @returns Suv ajratish tavsiyalari
   */
  public static generateWaterAllocationRecommendations(
    cropType: string,
    fieldSizeHectares: number,
    daysSincePlanting: number,
    forecastedWaterLevels: number[],
    reservoirCapacity: number
  ): {
    recommendedAmount: number;
    recommendedDate: string;
    status: 'optimal' | 'warning' | 'critical';
    message: string;
  } {
    // Kunlik suv talabini hisoblash
    const dailyRequirement = this.calculateCropWaterRequirement(
      cropType,
      fieldSizeHectares,
      daysSincePlanting
    );
    
    // Keyingi 7 kunlik umumiy talab
    const weeklyRequirement = dailyRequirement * 7;
    
    // Suv ombori holatini tekshirish
    const currentLevel = forecastedWaterLevels[0] || 0;
    const levelPercentage = (currentLevel / reservoirCapacity) * 100;
    
    // Tavsiyalarni shakllantirish
    let recommendedAmount = 0;
    let recommendedDate = new Date().toISOString().split('T')[0]; // Bugungi sana
    let status: 'optimal' | 'warning' | 'critical' = 'optimal';
    let message = '';
    
    if (levelPercentage < 30) {
      // Suv tanqis - faqat minimal miqdorni ajratish
      recommendedAmount = dailyRequirement * 3; // 3 kunlik
      status = 'critical';
      message = 'Suv tanqisligi! Faqat minimal miqdorda suv ajratilishi tavsiya etiladi.';
    } else if (levelPercentage < 60) {
      // Suv o'rtacha - ehtiyot bilan ajratish
      recommendedAmount = dailyRequirement * 5; // 5 kunlik
      status = 'warning';
      message = 'Suv zahirasi o\'rtacha. Ehtiyot bilan suv ajratilishi tavsiya etiladi.';
    } else {
      // Suv yetarli - optimal miqdorni ajratish
      recommendedAmount = weeklyRequirement;
      status = 'optimal';
      message = 'Suv zahirasi yetarli. Optimal miqdorda suv ajratish mumkin.';
    }
    
    // Eng yaxshi suv ajratish sanasini aniqlash
    // (Bu murakkab hisob-kitoblar talab qiladi, hozircha sodda variant)
    const nextWeekForecast = forecastedWaterLevels.slice(0, 7);
    const maxLevelDay = nextWeekForecast.indexOf(Math.max(...nextWeekForecast));
    if (maxLevelDay > 0) {
      const recommendedDay = new Date();
      recommendedDay.setDate(recommendedDay.getDate() + maxLevelDay);
      recommendedDate = recommendedDay.toISOString().split('T')[0];
    }
    
    return {
      recommendedAmount: Math.round(recommendedAmount),
      recommendedDate,
      status,
      message
    };
  }
}