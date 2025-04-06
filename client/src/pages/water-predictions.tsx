import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, AreaChart, Area, BarChart, Bar 
} from 'recharts';
import { WaterConsumptionForecastModel } from '@/lib/ai/waterPredictionModel';
import { 
  WaterConsumptionDataPoint, 
  generateHistoricalWaterData, 
  generateForecastWaterData,
  calculateConsumptionChange,
  predictWaterShortage
} from '@/lib/ai/mockWaterData';
import { format, parseISO, subDays } from 'date-fns';
import { Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/badge';
import DashboardLayout from "@/components/layout/dashboard-layout";

export default function WaterPredictions() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [isInitializing, setIsInitializing] = useState(true);
  const [isTraining, setIsTraining] = useState(false);
  const [isPredicting, setIsPredicting] = useState(false);
  const [selectedTab, setSelectedTab] = useState('daily');
  const [waterModel, setWaterModel] = useState<WaterConsumptionForecastModel | null>(null);
  const [historicalData, setHistoricalData] = useState<WaterConsumptionDataPoint[]>([]);
  const [forecastData, setForecastData] = useState<WaterConsumptionDataPoint[]>([]);
  const [aiGeneratedForecast, setAiGeneratedForecast] = useState<WaterConsumptionDataPoint[]>([]);
  const [consumptionChange, setConsumptionChange] = useState<number>(0);
  const [shortageAnalysis, setShortageAnalysis] = useState<{
    willHaveShortage: boolean,
    shortageStartDate: string | null,
    shortageAmount: number,
    shortagePercentage: number
  } | null>(null);

  // Model va ma'lumotlarni boshlang'ich holga keltirish
  useEffect(() => {
    initializeData();
  }, []);

  // Ma'lumotlar va modelni boshlang'ich holga keltirish
  const initializeData = async () => {
    setIsInitializing(true);
    
    try {
      // Tarixiy ma'lumotlarni generatsiya qilish
      const historical = generateHistoricalWaterData(90);
      setHistoricalData(historical);
      
      // Oddiy bashorat ma'lumotlarini generatsiya qilish
      const forecast = generateForecastWaterData(30, historical);
      setForecastData(forecast);
      
      // O'zgarish foizini hisoblash
      const change = calculateConsumptionChange(historical);
      setConsumptionChange(change);
      
      // Tanqislikni bashoratlash
      const shortage = predictWaterShortage(historical, forecast);
      setShortageAnalysis(shortage);
      
      // AI modelni yaratish
      const model = new WaterConsumptionForecastModel();
      setWaterModel(model);
      
    } catch (error) {
      console.error("Ma'lumotlarni yuklashda xatolik:", error);
      toast({
        title: t("error"),
        description: t("water_prediction.data_load_error"),
        variant: "destructive"
      });
    } finally {
      setIsInitializing(false);
    }
  };

  // AI modelni o'qitish
  const trainModel = async () => {
    if (!waterModel || historicalData.length === 0) return;
    
    setIsTraining(true);
    
    try {
      // Ma'lumotlarni model o'qitiladigan formatga o'zgartirish
      const trainingData = historicalData.map(point => point.value);
      
      // Modelni o'qitish
      await waterModel.train(trainingData);
      
      toast({
        title: t("water_prediction.model_trained"),
        description: t("water_prediction.ready_for_prediction"),
      });
      
      // Model o'qitilgach, avtomatik ravishda bashorat qilish
      await generateAIForecast();
      
    } catch (error) {
      console.error("Modelni o'qitishda xatolik:", error);
      toast({
        title: t("error"),
        description: t("water_prediction.training_error"),
        variant: "destructive"
      });
    } finally {
      setIsTraining(false);
    }
  };

  // AI model yordamida suv sarfiyatini bashoratlash
  const generateAIForecast = async () => {
    if (!waterModel || historicalData.length === 0) return;
    
    setIsPredicting(true);
    
    try {
      // Ma'lumotlarni model uchun formatga o'zgartirish
      const inputData = historicalData.map(point => point.value);
      
      // Keyingi 30 kun uchun bashorat
      const forecastValues = await waterModel.predictNextDays(inputData, 30);
      
      // Bashorat qilingan qiymatlarni formatlash
      const lastDate = new Date(historicalData[historicalData.length - 1].date);
      const aiForecasts = forecastValues.map((value, index) => ({
        date: format(addDays(lastDate, index + 1), 'yyyy-MM-dd'),
        value: Math.round(value)
      }));
      
      setAiGeneratedForecast(aiForecasts);
      
      // Yangi bashorat bilan tanqislikni qayta hisoblash
      const newShortage = predictWaterShortage(historicalData, aiForecasts);
      setShortageAnalysis(newShortage);
      
      toast({
        title: t("water_prediction.forecast_generated"),
        description: t("water_prediction.forecast_success"),
      });
      
    } catch (error) {
      console.error("Bashorat qilishda xatolik:", error);
      toast({
        title: t("error"),
        description: t("water_prediction.prediction_error"),
        variant: "destructive"
      });
    } finally {
      setIsPredicting(false);
    }
  };

  // Vaqt oralig'i bo'yicha ma'lumotlarni filtrlash
  const getFilteredData = (data: WaterConsumptionDataPoint[]) => {
    const today = new Date();
    
    switch (selectedTab) {
      case 'daily':
        return data;
      case 'weekly':
        // So'nggi 7 kunlik ma'lumotlar
        return data.filter(item => 
          new Date(item.date) >= subDays(today, 7)
        );
      case 'monthly':
        // So'nggi 30 kunlik ma'lumotlar
        return data.filter(item => 
          new Date(item.date) >= subDays(today, 30)
        );
      default:
        return data;
    }
  };

  // Grafik uchun ma'lumotlarni formatlash
  const formatChartData = (data: WaterConsumptionDataPoint[]) => {
    return data.map(item => ({
      ...item,
      date: format(new Date(item.date), 'dd/MM'),
    }));
  };

  // Sanani formatlash uchun funksiya
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd MMM yyyy');
  };

  // Bashorat va haqiqiy ma'lumotlarni birlashtirish
  const combinedData = () => {
    // Tarixiy ma'lumotlarning so'nggi 30 kuni
    const recentHistory = historicalData
      .slice(-30)
      .map(item => ({ ...item, type: 'historical' }));

    // Qaysi bashoratni ko'rsatish kerakligini tekshirish
    const forecast = aiGeneratedForecast.length > 0 
      ? aiGeneratedForecast.map(item => ({ ...item, type: 'ai_forecast' }))
      : forecastData.map(item => ({ ...item, type: 'simple_forecast' }));
    
    return [...recentHistory, ...forecast];
  };

  // Qo'shimcha helper funksiya - kun qo'shish
  const addDays = (date: Date, days: number) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  };

  return (
    <DashboardLayout title={t('water_prediction.title')}>
      <div className="container mx-auto py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">{t('water_prediction.title')}</h1>
          <p className="text-muted-foreground mt-2">
            {t('water_prediction.subtitle')}
          </p>
        </div>

        {isInitializing ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="overflow-hidden">
                <CardHeader className="p-4">
                  <Skeleton className="h-6 w-1/2" />
                  <Skeleton className="h-4 w-3/4 mt-2" />
                </CardHeader>
                <CardContent className="p-4">
                  <Skeleton className="h-[200px] w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-6">
              {/* Suv iste'moli kard */}
              <Card>
                <CardHeader>
                  <CardTitle>{t('water_prediction.consumption_trends')}</CardTitle>
                  <CardDescription>
                    {t('water_prediction.last_30_days')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[240px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={formatChartData(getFilteredData(historicalData.slice(-30)))}
                        margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                      >
                        <defs>
                          <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#0091ff" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#0091ff" stopOpacity={0.1}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip 
                          formatter={(value) => [`${value} m³`, t('water_prediction.consumption')]}
                          labelFormatter={(label) => `${label}`}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="value" 
                          stroke="#0091ff" 
                          fillOpacity={1} 
                          fill="url(#colorValue)" 
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="mt-4 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">{t('water_prediction.consumption_change')}</p>
                      <div className="flex items-center mt-1">
                        <Badge variant={consumptionChange > 0 ? "destructive" : "success"}>
                          {consumptionChange > 0 ? '↑' : '↓'} {Math.abs(consumptionChange)}%
                        </Badge>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      onClick={initializeData}
                    >
                      {t('refresh')}
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              {/* Suv bashorati kard */}
              <Card className="col-span-1 md:col-span-2">
                <CardHeader>
                  <CardTitle>{t('water_prediction.forecast_title')}</CardTitle>
                  <CardDescription>
                    {t('water_prediction.next_30_days')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[240px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={formatChartData(combinedData())}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip 
                          formatter={(value, name, props) => {
                            return [`${value} m³`, t('water_prediction.consumption')];
                          }}
                          labelFormatter={(label) => `${label}`}
                        />
                        <Legend 
                          formatter={(value) => {
                            if (value === 'value') {
                              return t('water_prediction.consumption_m3');
                            }
                            return value;
                          }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="value" 
                          stroke="#0091ff" 
                          strokeWidth={2}
                          dot={{ r: 1 }}
                          activeDot={{ r: 6 }}
                        />
                        {/* Suv ta'minoti chiziq chegarasi */}
                        <Line 
                          type="monotone" 
                          dataKey={() => 1500} // Tanlangan konstanta qiymat
                          stroke="#ff4d4f" 
                          strokeDasharray="5 5"
                          strokeWidth={2}
                          dot={false}
                          activeDot={false}
                          name={t('water_prediction.supply_capacity')}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">{t('water_prediction.ai_model')}</h4>
                      <div className="flex flex-wrap gap-2">
                        <Button
                          onClick={trainModel}
                          disabled={isTraining || !waterModel}
                        >
                          {isTraining && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                          {isTraining 
                            ? t('water_prediction.training_model') 
                            : t('water_prediction.train_model')}
                        </Button>
                        
                        <Button
                          variant="outline"
                          onClick={generateAIForecast}
                          disabled={isTraining || isPredicting || !waterModel}
                        >
                          {isPredicting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                          {isPredicting 
                            ? t('water_prediction.predicting') 
                            : t('water_prediction.generate_forecast')}
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">{t('water_prediction.shortage_analysis')}</h4>
                      {shortageAnalysis && (
                        <div className="text-sm">
                          {shortageAnalysis.willHaveShortage ? (
                            <div className="flex flex-col gap-1">
                              <Badge variant="destructive" className="w-fit">
                                {t('water_prediction.shortage_predicted')}
                              </Badge>
                              <p>
                                {t('water_prediction.starts_on')}: {' '}
                                <span className="font-medium">
                                  {formatDate(shortageAnalysis.shortageStartDate || '')}
                                </span>
                              </p>
                              <p>
                                {t('water_prediction.shortage_amount')}: {' '}
                                <span className="font-medium">
                                  {shortageAnalysis.shortageAmount} m³
                                </span>
                              </p>
                              <p>
                                {t('water_prediction.shortage_percentage')}: {' '}
                                <span className="font-medium">
                                  {shortageAnalysis.shortagePercentage}%
                                </span>
                              </p>
                            </div>
                          ) : (
                            <Badge variant="success" className="w-fit">
                              {t('water_prediction.no_shortage_predicted')}
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Oylik statistika kartalari */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>{t('water_prediction.consumption_statistics')}</CardTitle>
                <Tabs 
                  defaultValue="daily" 
                  value={selectedTab}
                  onValueChange={setSelectedTab}
                  className="w-full"
                >
                  <TabsList className="grid w-full grid-cols-3 mb-4 md:w-auto">
                    <TabsTrigger value="daily">{t('water_prediction.daily')}</TabsTrigger>
                    <TabsTrigger value="weekly">{t('water_prediction.weekly')}</TabsTrigger>
                    <TabsTrigger value="monthly">{t('water_prediction.monthly')}</TabsTrigger>
                  </TabsList>
                </Tabs>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={formatChartData(getFilteredData(historicalData))}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip 
                        formatter={(value) => [`${value} m³`, t('water_prediction.consumption')]}
                        labelFormatter={(label) => `${label}`}
                      />
                      <Legend />
                      <Bar 
                        dataKey="value" 
                        name={t('water_prediction.consumption_m3')}
                        fill="#0091ff" 
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}