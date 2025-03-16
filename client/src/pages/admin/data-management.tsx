import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { 
  Download, 
  FileSpreadsheet, 
  BarChart, 
  AreaChart, 
  PieChart, 
  CalendarIcon,
  Filter
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format, startOfMonth, endOfMonth, subMonths } from "date-fns";

export default function DataManagement() {
  const { toast } = useToast();
  const [startDate, setStartDate] = useState<Date | undefined>(startOfMonth(new Date()));
  const [endDate, setEndDate] = useState<Date | undefined>(endOfMonth(new Date()));
  const [dataType, setDataType] = useState("reservoir-levels");
  const [exportFormat, setExportFormat] = useState("csv");
  
  // Fetch reservoir data
  const { data: reservoirs = [], isLoading: isLoadingReservoirs } = useQuery({
    queryKey: ["/api/reservoirs"],
  });
  
  // Fetch water allocations
  const { data: allocations = [], isLoading: isLoadingAllocations } = useQuery({
    queryKey: ["/api/allocations"],
  });
  
  // Fetch water requests
  const { data: requests = [], isLoading: isLoadingRequests } = useQuery({
    queryKey: ["/api/requests"],
  });

  const exportData = () => {
    // In a real application, this would make an API request to get the filtered data
    // For now, we'll simulate it with a success message
    
    let exportFileName = "";
    
    switch(dataType) {
      case "reservoir-levels":
        exportFileName = "reservoir_levels";
        break;
      case "water-allocations":
        exportFileName = "water_allocations";
        break;
      case "water-requests":
        exportFileName = "water_requests";
        break;
      default:
        exportFileName = "water_data";
    }
    
    // Add date range to file name
    if (startDate && endDate) {
      const formattedStart = format(startDate, "yyyy-MM-dd");
      const formattedEnd = format(endDate, "yyyy-MM-dd");
      exportFileName += `_${formattedStart}_to_${formattedEnd}`;
    }
    
    exportFileName += `.${exportFormat}`;
    
    // Simulate download
    toast({
      title: "Export initiated",
      description: `Data will be downloaded as ${exportFileName}`,
    });
  };

  // Helper function to apply date filters to data
  const filterDataByDate = (data: any[]) => {
    if (!startDate || !endDate) return data;
    
    return data.filter((item: any) => {
      const itemDate = new Date(item.date || item.requestDate || item.startDate || new Date());
      return itemDate >= startDate && itemDate <= endDate;
    });
  };

  // Preset date ranges
  const applyDatePreset = (preset: string) => {
    const now = new Date();
    
    switch(preset) {
      case "this-month":
        setStartDate(startOfMonth(now));
        setEndDate(endOfMonth(now));
        break;
      case "last-month":
        const lastMonth = subMonths(now, 1);
        setStartDate(startOfMonth(lastMonth));
        setEndDate(endOfMonth(lastMonth));
        break;
      case "last-3-months":
        setStartDate(startOfMonth(subMonths(now, 3)));
        setEndDate(endOfMonth(now));
        break;
      case "last-6-months":
        setStartDate(startOfMonth(subMonths(now, 6)));
        setEndDate(endOfMonth(now));
        break;
      case "last-12-months":
        setStartDate(startOfMonth(subMonths(now, 12)));
        setEndDate(endOfMonth(now));
        break;
      default:
        // Do nothing
    }
  };

  return (
    <DashboardLayout title="Data Management">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Export Water Management Data</CardTitle>
          <CardDescription>
            Select the type of data, date range, and format for export
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="w-full md:w-1/4">
              <label className="text-sm font-medium mb-1 block">Data Type</label>
              <Select 
                value={dataType} 
                onValueChange={setDataType}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select data type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="reservoir-levels">
                    <div className="flex items-center">
                      <AreaChart className="h-4 w-4 mr-2 text-blue-600" />
                      <span>Reservoir Levels</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="water-allocations">
                    <div className="flex items-center">
                      <PieChart className="h-4 w-4 mr-2 text-green-600" />
                      <span>Water Allocations</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="water-requests">
                    <div className="flex items-center">
                      <BarChart className="h-4 w-4 mr-2 text-amber-600" />
                      <span>Water Requests</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="w-full md:w-1/4">
              <label className="text-sm font-medium mb-1 block">Start Date</label>
              <DatePicker
                date={startDate}
                setDate={setStartDate}
              />
            </div>
            
            <div className="w-full md:w-1/4">
              <label className="text-sm font-medium mb-1 block">End Date</label>
              <DatePicker
                date={endDate}
                setDate={setEndDate}
              />
            </div>
            
            <div className="w-full md:w-1/4">
              <label className="text-sm font-medium mb-1 block">Export Format</label>
              <Select 
                value={exportFormat} 
                onValueChange={setExportFormat}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="csv">
                    <div className="flex items-center">
                      <FileSpreadsheet className="h-4 w-4 mr-2 text-green-600" />
                      <span>CSV</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="xlsx">
                    <div className="flex items-center">
                      <FileSpreadsheet className="h-4 w-4 mr-2 text-blue-600" />
                      <span>Excel (XLSX)</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="json">
                    <div className="flex items-center">
                      <FileSpreadsheet className="h-4 w-4 mr-2 text-orange-600" />
                      <span>JSON</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <p className="text-sm font-medium mb-2">Preset Date Ranges:</p>
              <div className="flex flex-wrap gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => applyDatePreset("this-month")}
                >
                  <CalendarIcon className="h-3 w-3 mr-1" />
                  This Month
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => applyDatePreset("last-month")}
                >
                  <CalendarIcon className="h-3 w-3 mr-1" />
                  Last Month
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => applyDatePreset("last-3-months")}
                >
                  <CalendarIcon className="h-3 w-3 mr-1" />
                  Last 3 Months
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => applyDatePreset("last-6-months")}
                >
                  <CalendarIcon className="h-3 w-3 mr-1" />
                  Last 6 Months
                </Button>
              </div>
            </div>
            
            <Button className="ml-auto" onClick={exportData}>
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="reservoir-levels">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="reservoir-levels">Reservoir Levels</TabsTrigger>
          <TabsTrigger value="water-allocations">Water Allocations</TabsTrigger>
          <TabsTrigger value="water-requests">Water Requests</TabsTrigger>
        </TabsList>
        
        <TabsContent value="reservoir-levels">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Reservoir Levels Data</span>
                <Button variant="outline" size="sm">
                  <Filter className="h-3.5 w-3.5 mr-1.5" />
                  Filter
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Reservoir</TableHead>
                      <TableHead>Capacity (m³)</TableHead>
                      <TableHead>Current Level (m³)</TableHead>
                      <TableHead>Percentage</TableHead>
                      <TableHead>Last Updated</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoadingReservoirs ? (
                      Array(3).fill(0).map((_, index) => (
                        <TableRow key={index}>
                          <TableCell colSpan={5}>
                            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      reservoirs.map((reservoir: any) => (
                        <TableRow key={reservoir.id}>
                          <TableCell className="font-medium">{reservoir.name}</TableCell>
                          <TableCell>{reservoir.capacity.toLocaleString()}</TableCell>
                          <TableCell>{reservoir.currentLevel.toLocaleString()}</TableCell>
                          <TableCell>
                            {Math.round((reservoir.currentLevel / reservoir.capacity) * 100)}%
                          </TableCell>
                          <TableCell>
                            {reservoir.lastUpdated 
                              ? format(new Date(reservoir.lastUpdated), "MMM dd, yyyy HH:mm") 
                              : "N/A"}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="water-allocations">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Water Allocations Data</span>
                <Button variant="outline" size="sm">
                  <Filter className="h-3.5 w-3.5 mr-1.5" />
                  Filter
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Reservoir</TableHead>
                      <TableHead>Amount (m³)</TableHead>
                      <TableHead>Used (m³)</TableHead>
                      <TableHead>Remaining (m³)</TableHead>
                      <TableHead>Period</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoadingAllocations ? (
                      Array(3).fill(0).map((_, index) => (
                        <TableRow key={index}>
                          <TableCell colSpan={6}>
                            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : allocations.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                          No water allocations found
                        </TableCell>
                      </TableRow>
                    ) : (
                      allocations.map((allocation: any) => (
                        <TableRow key={allocation.id}>
                          <TableCell className="font-medium">{allocation.userName || "User " + allocation.userId}</TableCell>
                          <TableCell>{allocation.reservoirName || "Reservoir " + allocation.reservoirId}</TableCell>
                          <TableCell>{allocation.amount.toLocaleString()}</TableCell>
                          <TableCell>{allocation.used.toLocaleString()}</TableCell>
                          <TableCell>{(allocation.amount - allocation.used).toLocaleString()}</TableCell>
                          <TableCell>
                            {allocation.startDate && allocation.endDate 
                              ? `${format(new Date(allocation.startDate), "MMM dd")} - ${format(new Date(allocation.endDate), "MMM dd, yyyy")}` 
                              : "N/A"}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="water-requests">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Water Requests Data</span>
                <Button variant="outline" size="sm">
                  <Filter className="h-3.5 w-3.5 mr-1.5" />
                  Filter
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Request Date</TableHead>
                      <TableHead>Response Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoadingRequests ? (
                      Array(3).fill(0).map((_, index) => (
                        <TableRow key={index}>
                          <TableCell colSpan={6}>
                            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : requests.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                          No water requests found
                        </TableCell>
                      </TableRow>
                    ) : (
                      requests.map((request: any) => (
                        <TableRow key={request.id}>
                          <TableCell className="font-medium">{request.userName || "User " + request.userId}</TableCell>
                          <TableCell>{request.type}</TableCell>
                          <TableCell>{request.amount ? request.amount.toLocaleString() + ' m³' : 'N/A'}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              request.status === 'approved' 
                                ? 'bg-green-100 text-green-800' 
                                : request.status === 'denied'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-amber-100 text-amber-800'
                            }`}>
                              {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                            </span>
                          </TableCell>
                          <TableCell>
                            {request.requestDate 
                              ? format(new Date(request.requestDate), "MMM dd, yyyy") 
                              : "N/A"}
                          </TableCell>
                          <TableCell>
                            {request.responseDate 
                              ? format(new Date(request.responseDate), "MMM dd, yyyy") 
                              : request.status !== 'pending' ? "N/A" : ""}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}