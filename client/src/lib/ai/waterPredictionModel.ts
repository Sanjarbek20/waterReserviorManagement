import * as tf from '@tensorflow/tfjs';

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
    // Model yaratish
    this.model = tf.sequential();
    
    // LSTM qatlami qo'shish
    this.model.add(tf.layers.lstm({
      units: 50,
      returnSequences: false,
      inputShape: [this.windowSize, 1]
    }));
    
    // Chiqish qatlami
    this.model.add(tf.layers.dense({
      units: this.lookAhead,
      activation: 'linear'
    }));
    
    // Modelni kompilatsiya qilish
    this.model.compile({
      optimizer: tf.train.adam(0.001),
      loss: 'meanSquaredError'
    });
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
    const x = [];
    const y = [];
    
    // Ma'lumotlarni oynalar shaklida formatlash
    for (let i = 0; i < data.length - this.windowSize - this.lookAhead + 1; i++) {
      const window = data.slice(i, i + this.windowSize);
      const target = data.slice(i + this.windowSize, i + this.windowSize + this.lookAhead);
      x.push(window);
      y.push(target);
    }
    
    // TensorFlow tensorlariga o'zgartirish
    const xs = tf.tensor3d(x, [x.length, this.windowSize, 1]);
    const ys = tf.tensor2d(y, [y.length, this.lookAhead]);
    
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
      // Tensor yaratish
      const input = tf.tensor3d([currentWindow], [1, this.windowSize, 1]);
      
      // Bashorat
      const prediction = this.model.predict(input) as tf.Tensor;
      const predValue = prediction.dataSync()[0];
      
      // Natijalarni saqlash
      results.push(predValue);
      
      // Oynani yangilash
      currentWindow.shift();
      currentWindow.push(predValue);
      
      // Xotiradan bo'shatish
      input.dispose();
      prediction.dispose();
    }
    
    // Natijalarni asl o'lchovga qaytarish
    return this.denormalizeData(results, min, max);
  }
}