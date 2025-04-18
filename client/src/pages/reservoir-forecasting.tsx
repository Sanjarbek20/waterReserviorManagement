import { useState, useEffect } from "react";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";
import * as tf from '@tensorflow/tfjs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, ComposedChart } from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ReservoirData, ReservoirForecast } from "@/lib/ai/waterPredictionModel";
import { ReservoirPredictionModel } from "@/lib/ai/reservoirPredictionModel";
import { Download, Upload, FileUp, BarChart3, RefreshCw, CalendarRange } from "lucide-react";
import { format, addDays } from "date-fns";

// Yangi model yaratish
let reservoirModel: ReservoirPredictionModel | null = null;

export default function ReservoirForecasting() {
  const { t } = useTranslation();
  const { toast } = useToast();
  
  // Suv ombori ro'yxati
  const [reservoirs, setReservoirs] = useState<{ id: number; name: string; }[]>([]);
  const [selectedReservoirId, setSelectedReservoirId] = useState<string>("");
  
  // Model va bashorat holati
  const [isLoadingModel, setIsLoadingModel] = useState<boolean>(false);
  const [isTrainingModel, setIsTrainingModel] = useState<boolean>(false);
  const [isForecasting, setIsForecasting] = useState<boolean>(false);
  
  // Tarixiy ma'lumotlar va bashorat
  const [historicalData, setHistoricalData] = useState<ReservoirData[]>([]);
  const [forecastData, setForecastData] = useState<ReservoirForecast | null>(null);
  
  // Suv ombori uchun test ma'lumotlarni tayyorlash
  const generateTestData = (): ReservoirData[] => {
    const data: ReservoirData[] = [];
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 60); // 60 kun oldingi sana
    
    let level = 5000000; // 5 million m³
    
    for (let i = 0; i < 60; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      
      // Mavsumiy va tasodifiy tebranishlar bilan suv oqimlari
      const season = Math.sin((i / 60) * Math.PI) * 50000; // Mavsumiy omil
      const random = (Math.random() - 0.5) * 20000; // Tasodifiy tebranish
      
      const inflow = Math.max(40000 + season + random, 10000); // Kiruvchi suv
      const outflow = Math.max(35000 + season * 0.8 + random * 0.9, 8000); // Chiquvchi suv
      
      // Suv darajasini yangilash
      level = level + inflow - outflow;
      level = Math.max(level, 1000000); // Minimal daraja
      level = Math.min(level, 10000000); // Maksimal daraja
      
      data.push({
        date: date.toISOString().split('T')[0],
        inflow: Math.round(inflow),
        outflow: Math.round(outflow),
        level: Math.round(level)
      });
    }
    
    return data;
  };
  
  // Suv omborlari ro'yxatini olish
  useEffect(() => {
    const fetchReservoirs = async () => {
      try {
        const response = await fetch('/api/reservoirs');
        const data = await response.json();
        
        setReservoirs(data.map((reservoir: any, index: number) => ({
          id: reservoir.id || index + 1,
          name: reservoir.name
        })));
        
        if (data.length > 0) {
          setSelectedReservoirId(String(data[0].id || 1));
        }
      } catch (error) {
        console.error('Suv omborlarini olishda xatolik:', error);
        toast({
          title: t("Error"),
          description: t("Failed to fetch reservoirs"),
          variant: "destructive"
        });
      }
    };
    
    fetchReservoirs();
  }, [toast, t]);
  
  // Modelni tayyorlash
  useEffect(() => {
    const initializeModel = async () => {
      try {
        setIsLoadingModel(true);
        // TensorFlow.js ni ishga tushirish
        await tf.ready();
        
        // Model yaratish
        if (!reservoirModel) {
          reservoirModel = new ReservoirPredictionModel();
        }
        
        setIsLoadingModel(false);
      } catch (error) {
        console.error('Model tayyorlashda xatolik:', error);
        setIsLoadingModel(false);
        toast({
          title: t("Error"),
          description: t("Failed to initialize the TensorFlow model"),
          variant: "destructive"
        });
      }
    };
    
    initializeModel();
  }, [toast, t]);
  
  // Tarixiy ma'lumotlarni yuklash
  const loadHistoricalData = async () => {
    if (!selectedReservoirId) {
      toast({
        title: t("Warning"),
        description: t("Please select a reservoir first"),
        variant: "destructive"
      });
      return;
    }
    
    try {
      // Haqiqiy API dan ma'lumotlarni olish
      // const response = await fetch(`/api/reservoirs/${selectedReservoirId}/historical-data`);
      // const data = await response.json();
      
      // Test ma'lumotlarni generatsiya qilish
      const testData = generateTestData();
      setHistoricalData(testData);
      
      toast({
        title: t("Success"),
        description: t("Historical data loaded successfully"),
        variant: "success"
      });
    } catch (error) {
      console.error('Tarixiy ma\'lumotlarni yuklashda xatolik:', error);
      toast({
        title: t("Error"),
        description: t("Failed to load historical data"),
        variant: "destructive"
      });
    }
  };
  
  // Modelni o'qitish
  const trainModel = async () => {
    if (!reservoirModel || historicalData.length === 0) {
      toast({
        title: t("Warning"),
        description: t("Model or historical data is not ready"),
        variant: "warning"
      });
      return;
    }
    
    try {
      setIsTrainingModel(true);
      toast({
        title: t("Training Started"),
        description: t("Model training has started. This may take a minute..."),
      });
      
      // Modelni o'qitish
      await reservoirModel.trainAllModels(historicalData);
      
      toast({
        title: t("Success"),
        description: t("Model trained successfully"),
        variant: "success"
      });
    } catch (error) {
      console.error('Modelni o\'qitishda xatolik:', error);
      toast({
        title: t("Error"),
        description: t("Failed to train the model"),
        variant: "destructive"
      });
    } finally {
      setIsTrainingModel(false);
    }
  };
  
  // Bashorat qilish
  const generateForecast = async () => {
    if (!reservoirModel || historicalData.length === 0) {
      toast({
        title: t("Warning"),
        description: t("Model or historical data is not ready"),
        variant: "warning"
      });
      return;
    }
    
    try {
      setIsForecasting(true);
      
      // Bashorat qilish
      const forecast = await reservoirModel.forecastReservoir(historicalData);
      setForecastData(forecast);
      
      toast({
        title: t("Success"),
        description: t("Forecast generated successfully"),
        variant: "success"
      });
    } catch (error) {
      console.error('Bashorat qilishda xatolik:', error);
      toast({
        title: t("Error"),
        description: t("Failed to generate forecast"),
        variant: "destructive"
      });
    } finally {
      setIsForecasting(false);
    }
  };
  
  // Bashorat ma'lumotlarini JSON formatida yuklab olish
  const downloadForecastAsJSON = () => {
    if (!forecastData) return;
    
    try {
      const jsonData = reservoirModel?.getForecastAsJSON(forecastData) || JSON.stringify(forecastData);
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `reservoir_forecast_${selectedReservoirId}_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('JSON yuklab olishda xatolik:', error);
      toast({
        title: t("Error"),
        description: t("Failed to download JSON data"),
        variant: "destructive"
      });
    }
  };
  
  // Bashorat ma'lumotlarini CSV formatida yuklab olish
  const downloadForecastAsCSV = () => {
    if (!forecastData || !reservoirModel) return;
    
    try {
      const csvData = reservoirModel.getForecastAsCSV(forecastData);
      const blob = new Blob([csvData], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `reservoir_forecast_${selectedReservoirId}_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('CSV yuklab olishda xatolik:', error);
      toast({
        title: t("Error"),
        description: t("Failed to download CSV data"),
        variant: "destructive"
      });
    }
  };
  
  // Grafik uchun tarixiy va bashorat ma'lumotlarini birlashtirish
  const getCombinedChartData = () => {
    if (!historicalData.length) return [];
    
    // Tarixiy ma'lumotlar (so'nggi 30 kun)
    const historical = historicalData.slice(-30).map(item => ({
      ...item,
      type: 'historical'
    }));
    
    // Bashorat ma'lumotlari (mavjud bo'lsa)
    const forecast = forecastData?.daily.map(item => ({
      ...item,
      type: 'forecast'
    })) || [];
    
    return [...historical, ...forecast];
  };
  
  return (
    <DashboardLayout title={t("Reservoir Forecasting")}>
      <div className="space-y-6">
        {/* Asosiy ma'lumotlar va boshqaruv paneli */}
        <Card>
          <CardHeader>
            <CardTitle>{t("Water Reservoir Forecasting")}</CardTitle>
            <CardDescription>
              {t("Analyze historical data and predict future water levels, inflow, and outflow for selected reservoirs")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reservoir-select">{t("Select Reservoir")}</Label>
                  <Select 
                    value={selectedReservoirId} 
                    onValueChange={setSelectedReservoirId}
                  >
                    <SelectTrigger id="reservoir-select">
                      <SelectValue placeholder={t("Select a reservoir")} />
                    </SelectTrigger>
                    <SelectContent>
                      {reservoirs.map(reservoir => (
                        <SelectItem key={reservoir.id} value={String(reservoir.id)}>
                          {reservoir.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex flex-col space-y-2">
                  <Button 
                    onClick={loadHistoricalData} 
                    className="w-full" 
                    disabled={!selectedReservoirId || isLoadingModel}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    {t("Load Historical Data")}
                  </Button>
                  
                  <Button 
                    onClick={trainModel} 
                    className="w-full" 
                    disabled={historicalData.length === 0 || isTrainingModel || isLoadingModel}
                    variant="secondary"
                  >
                    <BarChart3 className="mr-2 h-4 w-4" />
                    {isTrainingModel ? t("Training...") : t("Train Model")}
                  </Button>
                  
                  <Button 
                    onClick={generateForecast} 
                    className="w-full" 
                    disabled={historicalData.length === 0 || isForecasting || isTrainingModel || isLoadingModel}
                    variant="default"
                  >
                    <RefreshCw className={`mr-2 h-4 w-4 ${isForecasting ? 'animate-spin' : ''}`} />
                    {isForecasting ? t("Generating...") : t("Generate Forecast")}
                  </Button>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="text-sm">
                  <div className="font-medium">{t("Status")}:</div>
                  <div className="mt-1 space-y-1">
                    <div className="flex justify-between">
                      <span>{t("Model")}:</span>
                      <span className={isLoadingModel ? "text-yellow-500" : "text-green-500"}>
                        {isLoadingModel ? t("Initializing...") : t("Ready")}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t("Historical Data")}:</span>
                      <span className={historicalData.length === 0 ? "text-red-500" : "text-green-500"}>
                        {historicalData.length === 0 ? t("Not Loaded") : `${historicalData.length} ${t("days")}`}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t("Forecast")}:</span>
                      <span className={!forecastData ? "text-red-500" : "text-green-500"}>
                        {!forecastData ? t("Not Generated") : t("Available")}
                      </span>
                    </div>
                  </div>
                </div>
                
                {forecastData && (
                  <div className="flex flex-col space-y-2">
                    <Button 
                      onClick={downloadForecastAsJSON}
                      className="w-full" 
                      variant="outline"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      {t("Download as JSON")}
                    </Button>
                    
                    <Button 
                      onClick={downloadForecastAsCSV}
                      className="w-full" 
                      variant="outline"
                    >
                      <FileUp className="mr-2 h-4 w-4" />
                      {t("Download as CSV")}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Tarixiy ma'lumotlar va bashorat grafiklari */}
        {(historicalData.length > 0 || forecastData) && (
          <Tabs defaultValue="combined" className="space-y-4">
            <TabsList>
              <TabsTrigger value="combined">{t("Combined View")}</TabsTrigger>
              <TabsTrigger value="inflow">{t("Inflow")}</TabsTrigger>
              <TabsTrigger value="outflow">{t("Outflow")}</TabsTrigger>
              <TabsTrigger value="level">{t("Water Level")}</TabsTrigger>
              <TabsTrigger value="balance">{t("Water Balance")}</TabsTrigger>
            </TabsList>
            
            <TabsContent value="combined" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>{t("Combined Reservoir Analysis")}</CardTitle>
                  <CardDescription>
                    {t("Historical data (last 30 days) and forecasted values for the next 30 days")}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart data={getCombinedChartData()}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="date" 
                          tick={{ fontSize: 12 }} 
                          tickFormatter={(value) => {
                            const date = new Date(value);
                            return format(date, 'MM/dd');
                          }}
                        />
                        <YAxis yAxisId="left" orientation="left" />
                        <YAxis yAxisId="right" orientation="right" />
                        <Tooltip
                          formatter={(value, name) => {
                            if (name === 'level') return [`${Number(value).toLocaleString()} m³`, t("Water Level")];
                            if (name === 'inflow') return [`${Number(value).toLocaleString()} m³`, t("Inflow")];
                            if (name === 'outflow') return [`${Number(value).toLocaleString()} m³`, t("Outflow")];
                            return [value, name];
                          }}
                          labelFormatter={(label) => {
                            const date = new Date(label);
                            return format(date, 'yyyy-MM-dd');
                          }}
                        />
                        <Legend 
                          formatter={(value) => {
                            if (value === 'level') return t("Water Level");
                            if (value === 'inflow') return t("Inflow");
                            if (value === 'outflow') return t("Outflow");
                            return value;
                          }}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="level" 
                          yAxisId="left"
                          fill="#8884d8" 
                          fillOpacity={0.2}
                          stroke="#8884d8"
                          strokeDasharray={(d) => d.type === 'forecast' ? '5 5' : '0'}
                          strokeWidth={(d) => d.type === 'forecast' ? 2 : 3}
                          name="level"
                        />
                        <Line 
                          type="monotone" 
                          dataKey="inflow" 
                          yAxisId="right" 
                          stroke="#82ca9d"
                          strokeDasharray={(d) => d.type === 'forecast' ? '5 5' : '0'}
                          strokeWidth={(d) => d.type === 'forecast' ? 2 : 3}
                          name="inflow"
                        />
                        <Line 
                          type="monotone" 
                          dataKey="outflow" 
                          yAxisId="right" 
                          stroke="#ff7300"
                          strokeDasharray={(d) => d.type === 'forecast' ? '5 5' : '0'}
                          strokeWidth={(d) => d.type === 'forecast' ? 2 : 3}
                          name="outflow"
                        />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                  
                  {/* Grafik izohli jadval */}
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-0.5 bg-[#8884d8]" />
                      <span className="text-sm font-medium">{t("Water Level")}</span>
                      <div className="w-4 h-0.5 border border-dashed border-[#8884d8]" />
                      <span className="text-xs text-muted-foreground">{t("Forecasted Water Level")}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-0.5 bg-[#82ca9d]" />
                      <span className="text-sm font-medium">{t("Inflow")}</span>
                      <div className="w-4 h-0.5 border border-dashed border-[#82ca9d]" />
                      <span className="text-xs text-muted-foreground">{t("Forecasted Inflow")}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-0.5 bg-[#ff7300]" />
                      <span className="text-sm font-medium">{t("Outflow")}</span>
                      <div className="w-4 h-0.5 border border-dashed border-[#ff7300]" />
                      <span className="text-xs text-muted-foreground">{t("Forecasted Outflow")}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="inflow">
              <Card>
                <CardHeader>
                  <CardTitle>{t("Water Inflow Analysis")}</CardTitle>
                  <CardDescription>
                    {t("Historical and forecasted inflow values (m³)")}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={getCombinedChartData()}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="date" 
                          tick={{ fontSize: 12 }} 
                          tickFormatter={(value) => {
                            const date = new Date(value);
                            return format(date, 'MM/dd');
                          }}
                        />
                        <YAxis />
                        <Tooltip
                          formatter={(value) => [`${Number(value).toLocaleString()} m³`, t("Inflow")]}
                          labelFormatter={(label) => {
                            const date = new Date(label);
                            return format(date, 'yyyy-MM-dd');
                          }}
                        />
                        <Legend formatter={() => t("Inflow")} />
                        <Line 
                          type="monotone" 
                          dataKey="inflow" 
                          stroke="#82ca9d"
                          strokeDasharray={(d) => d.type === 'forecast' ? '5 5' : '0'}
                          strokeWidth={(d) => d.type === 'forecast' ? 2 : 3}
                          name="inflow"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="outflow">
              <Card>
                <CardHeader>
                  <CardTitle>{t("Water Outflow Analysis")}</CardTitle>
                  <CardDescription>
                    {t("Historical and forecasted outflow values (m³)")}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={getCombinedChartData()}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="date" 
                          tick={{ fontSize: 12 }} 
                          tickFormatter={(value) => {
                            const date = new Date(value);
                            return format(date, 'MM/dd');
                          }}
                        />
                        <YAxis />
                        <Tooltip
                          formatter={(value) => [`${Number(value).toLocaleString()} m³`, t("Outflow")]}
                          labelFormatter={(label) => {
                            const date = new Date(label);
                            return format(date, 'yyyy-MM-dd');
                          }}
                        />
                        <Legend formatter={() => t("Outflow")} />
                        <Line 
                          type="monotone" 
                          dataKey="outflow" 
                          stroke="#ff7300"
                          strokeDasharray={(d) => d.type === 'forecast' ? '5 5' : '0'}
                          strokeWidth={(d) => d.type === 'forecast' ? 2 : 3}
                          name="outflow"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="level">
              <Card>
                <CardHeader>
                  <CardTitle>{t("Water Level Analysis")}</CardTitle>
                  <CardDescription>
                    {t("Historical and forecasted water level values (m³)")}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={getCombinedChartData()}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="date" 
                          tick={{ fontSize: 12 }} 
                          tickFormatter={(value) => {
                            const date = new Date(value);
                            return format(date, 'MM/dd');
                          }}
                        />
                        <YAxis />
                        <Tooltip
                          formatter={(value) => [`${Number(value).toLocaleString()} m³`, t("Water Level")]}
                          labelFormatter={(label) => {
                            const date = new Date(label);
                            return format(date, 'yyyy-MM-dd');
                          }}
                        />
                        <Legend formatter={() => t("Water Level")} />
                        <Line 
                          type="monotone" 
                          dataKey="level" 
                          stroke="#8884d8"
                          strokeDasharray={(d) => d.type === 'forecast' ? '5 5' : '0'}
                          strokeWidth={(d) => d.type === 'forecast' ? 2 : 3}
                          name="level"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="balance">
              <Card>
                <CardHeader>
                  <CardTitle>{t("Water Balance Analysis")}</CardTitle>
                  <CardDescription>
                    {t("Difference between inflow and outflow (positive means accumulation, negative means drainage)")}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart data={getCombinedChartData().map(item => ({
                        ...item,
                        balance: item.inflow - item.outflow
                      }))}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="date" 
                          tick={{ fontSize: 12 }} 
                          tickFormatter={(value) => {
                            const date = new Date(value);
                            return format(date, 'MM/dd');
                          }}
                        />
                        <YAxis />
                        <Tooltip
                          formatter={(value) => [`${Number(value).toLocaleString()} m³`, t("Balance")]}
                          labelFormatter={(label) => {
                            const date = new Date(label);
                            return format(date, 'yyyy-MM-dd');
                          }}
                        />
                        <Legend formatter={() => t("Water Balance")} />
                        <Area 
                          type="monotone" 
                          dataKey="balance" 
                          fill="#2563eb" 
                          fillOpacity={0.2}
                          stroke="#2563eb"
                          strokeDasharray={(d) => d.type === 'forecast' ? '5 5' : '0'}
                          strokeWidth={(d) => d.type === 'forecast' ? 2 : 3}
                          name="balance"
                        />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
        
        {/* Bashorat ma'lumotlari jadvali */}
        {forecastData && (
          <Card>
            <CardHeader>
              <CardTitle>{t("Detailed Forecast Data")}</CardTitle>
              <CardDescription>
                {t("Daily forecast values for the next 30 days")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">{t("Date")}</th>
                      <th className="text-right p-2">{t("Inflow")} (m³)</th>
                      <th className="text-right p-2">{t("Outflow")} (m³)</th>
                      <th className="text-right p-2">{t("Water Level")} (m³)</th>
                      <th className="text-right p-2">{t("Balance")} (m³)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {forecastData.daily.map((day, index) => (
                      <tr key={index} className="border-b hover:bg-muted/50">
                        <td className="p-2 font-medium">
                          {day.date}
                          {index === 0 && (
                            <span className="ml-2 text-xs text-blue-500 font-normal">
                              ({t("Tomorrow")})
                            </span>
                          )}
                          {index === 6 && (
                            <span className="ml-2 text-xs text-blue-500 font-normal">
                              ({t("Next Week")})
                            </span>
                          )}
                          {index === 29 && (
                            <span className="ml-2 text-xs text-blue-500 font-normal">
                              ({t("Next Month")})
                            </span>
                          )}
                        </td>
                        <td className="text-right p-2">{Math.round(day.inflow).toLocaleString()}</td>
                        <td className="text-right p-2">{Math.round(day.outflow).toLocaleString()}</td>
                        <td className="text-right p-2">{Math.round(day.level).toLocaleString()}</td>
                        <td className={`text-right p-2 ${day.inflow > day.outflow ? 'text-green-600' : 'text-red-600'}`}>
                          {Math.round(day.inflow - day.outflow).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="mt-6 space-y-4">
                <h3 className="text-lg font-semibold">{t("Summary Forecast")}</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {/* Haftalik bashorat xulosasi */}
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">{t("Weekly Outlook")}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {forecastData.weekly.length > 0 && (
                        <dl className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <dt>{t("Avg. Inflow")}:</dt>
                            <dd className="font-medium">
                              {Math.round(forecastData.daily.slice(0, 7).reduce((sum, day) => sum + day.inflow, 0) / 7).toLocaleString()} m³
                            </dd>
                          </div>
                          <div className="flex justify-between">
                            <dt>{t("Avg. Outflow")}:</dt>
                            <dd className="font-medium">
                              {Math.round(forecastData.daily.slice(0, 7).reduce((sum, day) => sum + day.outflow, 0) / 7).toLocaleString()} m³
                            </dd>
                          </div>
                          <div className="flex justify-between">
                            <dt>{t("Net Change")}:</dt>
                            <dd className={`font-medium ${forecastData.daily[6].level > forecastData.daily[0].level ? 'text-green-600' : 'text-red-600'}`}>
                              {Math.round(forecastData.daily[6].level - forecastData.daily[0].level).toLocaleString()} m³
                            </dd>
                          </div>
                        </dl>
                      )}
                    </CardContent>
                  </Card>
                  
                  {/* Oylik bashorat xulosasi */}
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">{t("Monthly Outlook")}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {forecastData.monthly.length > 0 && (
                        <dl className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <dt>{t("Avg. Inflow")}:</dt>
                            <dd className="font-medium">
                              {Math.round(forecastData.daily.reduce((sum, day) => sum + day.inflow, 0) / forecastData.daily.length).toLocaleString()} m³
                            </dd>
                          </div>
                          <div className="flex justify-between">
                            <dt>{t("Avg. Outflow")}:</dt>
                            <dd className="font-medium">
                              {Math.round(forecastData.daily.reduce((sum, day) => sum + day.outflow, 0) / forecastData.daily.length).toLocaleString()} m³
                            </dd>
                          </div>
                          <div className="flex justify-between">
                            <dt>{t("Net Change")}:</dt>
                            <dd className={`font-medium ${forecastData.daily[29].level > forecastData.daily[0].level ? 'text-green-600' : 'text-red-600'}`}>
                              {Math.round(forecastData.daily[29].level - forecastData.daily[0].level).toLocaleString()} m³
                            </dd>
                          </div>
                        </dl>
                      )}
                    </CardContent>
                  </Card>
                  
                  {/* Yuqori va past nuqtalar */}
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">{t("Critical Points")}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {forecastData.daily.length > 0 && (() => {
                        // Maksimal va minimal suv darajalari
                        const maxLevel = Math.max(...forecastData.daily.map(d => d.level));
                        const minLevel = Math.min(...forecastData.daily.map(d => d.level));
                        
                        // Maksimal va minimal suv darajasi kunlari
                        const maxLevelDay = forecastData.daily.find(d => d.level === maxLevel);
                        const minLevelDay = forecastData.daily.find(d => d.level === minLevel);
                        
                        return (
                          <dl className="space-y-1 text-sm">
                            <div className="flex justify-between">
                              <dt>{t("Highest Level")}:</dt>
                              <dd className="font-medium text-green-600">
                                {Math.round(maxLevel).toLocaleString()} m³
                              </dd>
                            </div>
                            <div className="flex justify-between">
                              <dt>{t("Expected On")}:</dt>
                              <dd className="font-medium">
                                {maxLevelDay?.date}
                              </dd>
                            </div>
                            <div className="flex justify-between mt-2">
                              <dt>{t("Lowest Level")}:</dt>
                              <dd className="font-medium text-red-600">
                                {Math.round(minLevel).toLocaleString()} m³
                              </dd>
                            </div>
                            <div className="flex justify-between">
                              <dt>{t("Expected On")}:</dt>
                              <dd className="font-medium">
                                {minLevelDay?.date}
                              </dd>
                            </div>
                          </dl>
                        );
                      })()}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}