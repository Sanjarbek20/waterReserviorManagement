import * as tf from '@tensorflow/tfjs';
import { ReservoirData, ReservoirForecast, ReservoirModelParams } from './waterPredictionModel';

/**
 * Suv omborlari uchun LSTM modelini yaratuvchi va bashorat qiluvchi class
 */
export class ReservoirPredictionModel {
  private params: ReservoirModelParams = {
    inflowModel: null,
    outflowModel: null,
    levelModel: null,
    inflowNormalization: { min: 0, max: 1 },
    outflowNormalization: { min: 0, max: 1 },
    levelNormalization: { min: 0, max: 1 }
  };

  private isTraining: boolean = false;
  private windowSize: number = 14; // 14 kunlik ma'lumotlar asosida bashorat
  private lookAhead: number = 1; // Bir kun oldinga bashorat
  
  constructor() {
    // Modelllarni yaratish
    this.buildAllModels();
  }
  
  /**
   * Barcha modellarni yaratish
   */
  private buildAllModels(): void {
    try {
      this.params.inflowModel = this.buildLSTMModel();
      this.params.outflowModel = this.buildLSTMModel();
      this.params.levelModel = this.buildLSTMModel();
    } catch (error) {
      console.error('Modellarni yaratishda xatolik:', error);
      throw new Error('TensorFlow.js modellar yaratib bo\'lmadi');
    }
  }
  
  /**
   * Alohida LSTM model yaratish
   */
  private buildLSTMModel(): tf.LayersModel {
    // Model yaratish
    const model = tf.sequential();
    
    // LSTM qatlami
    model.add(tf.layers.lstm({
      units: 64,
      returnSequences: true,
      inputShape: [this.windowSize, 1]
    }));
    
    // Ikkinchi LSTM qatlami
    model.add(tf.layers.lstm({
      units: 32,
      returnSequences: false
    }));
    
    // Dropout qatlami (overfitting oldini olish uchun)
    model.add(tf.layers.dropout({ rate: 0.2 }));
    
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
    
    return model;
  }
  
  /**
   * Ma'lumotlarni model o'qitish uchun formatlash
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
    const xs = tf.tensor3d(x);
    const ys = tf.tensor2d(y);
    
    return { inputs: xs, outputs: ys };
  }
  
  /**
   * Ma'lumotlarni bashorat uchun normalashtirish
   */
  private normalizeData(data: number[]): {
    normalizedData: number[],
    min: number,
    max: number
  } {
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1; // 0ga bo'lishdan saqlanish
    
    // Ma'lumotlarni [0, 1] oralig'ida normalashtirish
    const normalizedData = data.map(x => (x - min) / range);
    
    return { normalizedData, min, max };
  }
  
  /**
   * Normallashtirilgan ma'lumotlarni asl o'lchoviga qaytarish
   */
  private denormalizeData(normalizedData: number[], min: number, max: number): number[] {
    const range = max - min || 1;
    return normalizedData.map(x => x * range + min);
  }
  
  /**
   * Barcha modellarni o'qitish
   */
  async trainAllModels(historicalData: ReservoirData[]): Promise<void> {
    if (historicalData.length < this.windowSize + this.lookAhead) {
      throw new Error('O\'qitish uchun ma\'lumotlar yetarli emas');
    }
    
    this.isTraining = true;
    
    try {
      // Ma'lumotlarni ajratib olish
      const inflowData = historicalData.map(d => d.inflow);
      const outflowData = historicalData.map(d => d.outflow);
      const levelData = historicalData.map(d => d.level);
      
      // Ma'lumotlarni normalashtirish
      const inflowNorm = this.normalizeData(inflowData);
      const outflowNorm = this.normalizeData(outflowData);
      const levelNorm = this.normalizeData(levelData);
      
      // Normalashtirish parametrlarini saqlash
      this.params.inflowNormalization = { min: inflowNorm.min, max: inflowNorm.max };
      this.params.outflowNormalization = { min: outflowNorm.min, max: outflowNorm.max };
      this.params.levelNormalization = { min: levelNorm.min, max: levelNorm.max };
      
      // INFLOW modelini o'qitish
      if (this.params.inflowModel) {
        const { inputs: inflowInputs, outputs: inflowOutputs } = this.prepareTrainingData(inflowNorm.normalizedData);
        await this.params.inflowModel.fit(inflowInputs, inflowOutputs, {
          epochs: 100,
          batchSize: 32,
          shuffle: true,
          verbose: 0
        });
        inflowInputs.dispose();
        inflowOutputs.dispose();
      }
      
      // OUTFLOW modelini o'qitish
      if (this.params.outflowModel) {
        const { inputs: outflowInputs, outputs: outflowOutputs } = this.prepareTrainingData(outflowNorm.normalizedData);
        await this.params.outflowModel.fit(outflowInputs, outflowOutputs, {
          epochs: 100,
          batchSize: 32,
          shuffle: true,
          verbose: 0
        });
        outflowInputs.dispose();
        outflowOutputs.dispose();
      }
      
      // LEVEL modelini o'qitish
      if (this.params.levelModel) {
        const { inputs: levelInputs, outputs: levelOutputs } = this.prepareTrainingData(levelNorm.normalizedData);
        await this.params.levelModel.fit(levelInputs, levelOutputs, {
          epochs: 100,
          batchSize: 32,
          shuffle: true,
          verbose: 0
        });
        levelInputs.dispose();
        levelOutputs.dispose();
      }
      
      this.isTraining = false;
    } catch (error) {
      console.error('Modellarni o\'qitishda xatolik:', error);
      this.isTraining = false;
      throw error;
    }
  }
  
  /**
   * Ma'lum turdagi ma'lumotlar uchun bashorat qilish
   */
  private async predictValues(
    model: tf.LayersModel | null, 
    data: number[], 
    daysToPredict: number,
    normalization: { min: number, max: number }
  ): Promise<number[]> {
    if (!model) {
      throw new Error('Model yaratilmagan');
    }
    
    // Ma'lumotlarni normalashtirish
    const { normalizedData } = this.normalizeData(data);
    const { min, max } = normalization;
    
    // Bashorat qilish uchun so'nggi ma'lumotlar oynasini olish
    let currentWindow = normalizedData.slice(-this.windowSize);
    const results: number[] = [];
    
    // Keyingi kunlar uchun bashorat
    for (let i = 0; i < daysToPredict; i++) {
      try {
        // Tensorni to'g'ridan-to'g'ri yaratish
        const reshapedInput = tf.tensor(currentWindow).reshape([1, this.windowSize, 1]);
        
        // Bashorat
        const prediction = model.predict(reshapedInput) as tf.Tensor;
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
        const avgValue = 0.5; // Normalizatsiya qilingan, shuning uchun 0.5 o'rtacha
        results.push(avgValue);
      }
    }
    
    // Natijalarni asl o'lchovga qaytarish
    return this.denormalizeData(results, min, max);
  }
  
  /**
   * Suv ombori uchun barcha parametrlarni bashoratlash
   */
  async forecastReservoir(historicalData: ReservoirData[]): Promise<ReservoirForecast> {
    if (this.isTraining || historicalData.length < this.windowSize) {
      throw new Error('Model hali o\'qitilmoqda yoki ma\'lumotlar yetarli emas');
    }
    
    const inflowData = historicalData.map(d => d.inflow);
    const outflowData = historicalData.map(d => d.outflow);
    const levelData = historicalData.map(d => d.level);
    
    // Kunlik bashorat (30 kun)
    const futureInflow = await this.predictValues(
      this.params.inflowModel, 
      inflowData, 
      30, 
      this.params.inflowNormalization
    );
    
    const futureOutflow = await this.predictValues(
      this.params.outflowModel, 
      outflowData, 
      30, 
      this.params.outflowNormalization
    );
    
    const futureLevel = await this.predictValues(
      this.params.levelModel, 
      levelData, 
      30, 
      this.params.levelNormalization
    );
    
    // Bashorat natijalarini ReservoirData formatiga o'zgartirish
    const startDate = new Date();
    const dailyForecast: ReservoirData[] = [];
    const weeklyForecast: ReservoirData[] = [];
    const monthlyForecast: ReservoirData[] = [];
    
    // Kunlik bashorat
    for (let i = 0; i < 30; i++) {
      const forecastDate = new Date(startDate);
      forecastDate.setDate(startDate.getDate() + i);
      
      const dailyData: ReservoirData = {
        date: forecastDate.toISOString().split('T')[0],
        inflow: Math.max(0, futureInflow[i] || 0),  // Manfiy qiymatlarni oldini olish
        outflow: Math.max(0, futureOutflow[i] || 0),
        level: Math.max(0, futureLevel[i] || 0)
      };
      
      dailyForecast.push(dailyData);
      
      // Haftalik bashorat
      if (i % 7 === 6) {
        weeklyForecast.push(dailyData);
      }
      
      // Oylik bashorat
      if (i === 29) {
        monthlyForecast.push(dailyData);
      }
    }
    
    return {
      daily: dailyForecast,
      weekly: weeklyForecast,
      monthly: monthlyForecast
    };
  }
  
  /**
   * Bashorat natijalarini JSON formatida olish 
   * (yuklab olish uchun)
   */
  getForecastAsJSON(forecast: ReservoirForecast): string {
    return JSON.stringify(forecast, null, 2);
  }
  
  /**
   * Bashorat natijalarini CSV formatida olish
   * (yuklab olish uchun)
   */
  getForecastAsCSV(forecast: ReservoirForecast): string {
    const headers = ['Date', 'Inflow (m³)', 'Outflow (m³)', 'Level (m³)'];
    const rows = forecast.daily.map(d => [
      d.date,
      d.inflow.toFixed(2),
      d.outflow.toFixed(2),
      d.level.toFixed(2)
    ]);
    
    // CSV formatiga o'zgartirish
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
    
    return csvContent;
  }
}