import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

// Define types for our data
interface UsageData {
  date: string;
  allocated: number;
  used: number;
}

interface AllocationData {
  date?: string;
  month?: string;
  amount?: number;
  baseAllocation?: string;
  adjustments?: string;
  totalAllocation?: string;
  allocation?: number;
  used?: number;
  remaining?: number;
  percentUsed?: number;
}

interface RequestData {
  id: number;
  date: string;
  type: string;
  amount?: string;
  status: string;
  notes?: string;
}
import DashboardLayout from "@/components/layout/dashboard-layout";
import { useAuth } from "@/lib/auth";
import { format, subMonths, startOfMonth, endOfMonth } from "date-fns";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { DateRange } from "react-day-picker";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { 
  Download, 
  FileSpreadsheet, 
  FileText, 
  BarChart2, 
  Calendar, 
  FileDown, 
  RefreshCw,
  FilePieChart,
  Droplet
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line
} from "recharts";

export default function FarmerReports() {
  const { toast } = useToast();
  const [reportType, setReportType] = useState<string>("usage");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: startOfMonth(subMonths(new Date(), 1)),
    to: endOfMonth(subMonths(new Date(), 1))
  });
  const [exportFormat, setExportFormat] = useState<string>("pdf");
  
  // Query for water usage data
  const { data: usageData = [] as UsageData[], isLoading: isLoadingUsage, refetch: refetchUsage } = useQuery<UsageData[]>({
    queryKey: ["/api/reports/usage", dateRange?.from, dateRange?.to],
    enabled: false, // We'll trigger this manually
  });
  
  // Query for allocation data
  const { data: allocationData = [] as AllocationData[], isLoading: isLoadingAllocation, refetch: refetchAllocation } = useQuery<AllocationData[]>({
    queryKey: ["/api/reports/allocation", dateRange?.from, dateRange?.to],
    enabled: false, // We'll trigger this manually
  });
  
  // Query for requests history data
  const { data: requestsData = [] as RequestData[], isLoading: isLoadingRequests, refetch: refetchRequests } = useQuery<RequestData[]>({
    queryKey: ['/api/reports/requests', dateRange?.from, dateRange?.to],
    enabled: false, // We'll trigger this manually
  });
  
  // Generate report function
  const generateReport = () => {
    setIsGenerating(true);
    
    // Based on the report type, trigger the appropriate query
    if (reportType === "usage") {
      refetchUsage();
    } else if (reportType === "allocation") {
      refetchAllocation();
    } else if (reportType === "requests") {
      refetchRequests();
    }
    
    // Simulate report generation
    setTimeout(() => {
      setIsGenerating(false);
      toast({
        title: "Report Generated",
        description: `${reportType.charAt(0).toUpperCase() + reportType.slice(1)} report has been generated for the selected period.`,
      });
    }, 1500);
  };
  
  // Export report function
  const exportReport = (format: string) => {
    toast({
      title: "Export Started",
      description: `Exporting report as ${format.toUpperCase()}...`,
    });
    
    // Create data for the export based on report type
    let data: any[] = [];
    
    if (reportType === "usage") {
      data = usageData.map((item: UsageData) => ({
        period: item.date,
        allocated: item.allocated,
        used: item.used,
        percentage: Math.round((item.used / item.allocated) * 100) + '%'
      }));
    } else if (reportType === "allocation") {
      data = allocationData.map((item: AllocationData) => {
        const monthValue = item.month || 'Current Month';
        const baseValue = item.baseAllocation || '4500';
        const adjustValue = item.adjustments || '0';
        const totalValue = item.totalAllocation || '4500';
        
        return {
          month: monthValue,
          baseAllocation: baseValue,
          adjustments: adjustValue,
          totalAllocation: totalValue
        };
      });
    } else if (reportType === "requests") {
      data = requestsData.map((item: RequestData) => ({
        date: new Date(item.date).toLocaleDateString(),
        type: item.type,
        amount: item.amount || 'N/A',
        status: item.status,
        notes: item.notes || 'None'
      }));
    }
    
    // Convert data to the appropriate format
    let fileContent = '';
    let fileName = '';
    let mimeType = '';
    
    if (format === 'csv') {
      // Create CSV content
      const headers = Object.keys(data[0]).join(',');
      const rows = data.map(row => Object.values(row).join(','));
      fileContent = `${headers}\n${rows.join('\n')}`;
      fileName = `water_usage_report_${new Date().toISOString().split('T')[0]}.csv`;
      mimeType = 'text/csv';
    } else if (format === 'excel') {
      // Create a simple Excel (TSV) format for demonstration
      const headers = Object.keys(data[0]).join('\t');
      const rows = data.map(row => Object.values(row).join('\t'));
      fileContent = `${headers}\n${rows.join('\n')}`;
      fileName = `water_usage_report_${new Date().toISOString().split('T')[0]}.xls`;
      mimeType = 'application/vnd.ms-excel';
    } else {
      // Create a simple text representation for PDF (in real app, would use PDF generation library)
      fileContent = `Water Usage Report\n\n`;
      fileContent += `Generated: ${new Date().toLocaleString()}\n\n`;
      fileContent += `Period\tAllocated\tUsed\tPercentage\n`;
      data.forEach(row => {
        fileContent += `${row.period}\t${row.allocated}\t${row.used}\t${row.percentage}\n`;
      });
      fileName = `water_usage_report_${new Date().toISOString().split('T')[0]}.txt`;
      mimeType = 'text/plain';
      // Note: In a real app, you would use a PDF library to generate actual PDF files
    }
    
    // Create a blob and download link
    const blob = new Blob([fileContent], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast({
        title: "Export Complete",
        description: `Your report has been downloaded as ${fileName}.`,
      });
    }, 1000);
  };
  
  // Handle export button click
  const handleExport = () => {
    exportReport(exportFormat);
  };
  
  return (
    <DashboardLayout title="Water Usage Reports">
      <Tabs defaultValue="usage" className="space-y-6" onValueChange={setReportType}>
        <TabsList>
          <TabsTrigger value="usage">Usage Reports</TabsTrigger>
          <TabsTrigger value="allocation">Allocation History</TabsTrigger>
          <TabsTrigger value="requests">Request History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="usage" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Water Usage Reports</CardTitle>
              <CardDescription>
                View and export your water usage data for a specific time period
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row gap-4 md:items-end">
                  <div className="flex-1 space-y-2">
                    <h3 className="text-sm font-medium">Date Range</h3>
                    <DateRangePicker 
                      dateRange={dateRange} 
                      setDateRange={setDateRange} 
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      onClick={generateReport}
                      disabled={isGenerating || !dateRange?.from || !dateRange?.to}
                    >
                      {isGenerating ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <FileText className="h-4 w-4 mr-2" />
                          Generate Report
                        </>
                      )}
                    </Button>
                  </div>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h3 className="text-lg font-medium mb-4">Water Usage Overview</h3>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={usageData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis label={{ value: 'Cubic meters (m³)', angle: -90, position: 'insideLeft' }} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="used" fill="#3b82f6" name="Used Water" />
                        <Bar dataKey="allocated" fill="#22c55e" name="Allocated Water" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h3 className="text-lg font-medium mb-4">Usage Details</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Period</TableHead>
                        <TableHead>Allocated Amount (m³)</TableHead>
                        <TableHead>Used Amount (m³)</TableHead>
                        <TableHead>Usage Percentage</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {usageData.length > 0 ? (
                        usageData.map((item: UsageData, index: number) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">{item.date}</TableCell>
                            <TableCell>{item.allocated}</TableCell>
                            <TableCell>{item.used}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                                  <div 
                                    className={`h-full ${
                                      (item.used / item.allocated) > 1 
                                        ? 'bg-red-500' 
                                        : (item.used / item.allocated) > 0.8 
                                          ? 'bg-amber-500' 
                                          : 'bg-green-500'
                                    }`}
                                    style={{ width: `${Math.min(100, (item.used / item.allocated) * 100)}%` }}
                                  />
                                </div>
                                <span className="text-sm">
                                  {Math.round((item.used / item.allocated) * 100)}%
                                </span>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-4 text-gray-500">
                            No data available. Generate a report to view usage details.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t p-4 bg-gray-50">
              <div className="flex items-center gap-2">
                <Select value={exportFormat} onValueChange={setExportFormat}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">PDF</SelectItem>
                    <SelectItem value="excel">Excel</SelectItem>
                    <SelectItem value="csv">CSV</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" onClick={handleExport}>
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
              <Button variant="outline" size="sm" onClick={() => generateReport()}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh Data
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="allocation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Water Allocation History</CardTitle>
              <CardDescription>
                Track your historical water allocations over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row gap-4 md:items-end">
                  <div className="flex-1 space-y-2">
                    <h3 className="text-sm font-medium">Date Range</h3>
                    <DateRangePicker 
                      dateRange={dateRange} 
                      setDateRange={setDateRange} 
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      onClick={generateReport}
                      disabled={isGenerating || !dateRange?.from || !dateRange?.to}
                    >
                      {isGenerating ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <FilePieChart className="h-4 w-4 mr-2" />
                          Generate Report
                        </>
                      )}
                    </Button>
                  </div>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h3 className="text-lg font-medium mb-4">Allocation Trend</h3>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={[
                          { month: 'Jan', allocation: 4800 },
                          { month: 'Feb', allocation: 4500 },
                          { month: 'Mar', allocation: 5000 },
                          { month: 'Apr', allocation: 5200 },
                          { month: 'May', allocation: 5500 },
                          { month: 'Jun', allocation: 5800 },
                        ]}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis label={{ value: 'Allocation (m³)', angle: -90, position: 'insideLeft' }} />
                        <Tooltip />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="allocation" 
                          stroke="#3b82f6" 
                          name="Monthly Allocation"
                          strokeWidth={2}
                          dot={{ r: 5 }}
                          activeDot={{ r: 8 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h3 className="text-lg font-medium mb-4">Allocation Details</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Month</TableHead>
                        <TableHead>Base Allocation (m³)</TableHead>
                        <TableHead>Adjustments (m³)</TableHead>
                        <TableHead>Total Allocation (m³)</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {allocationData.length > 0 ? (
                        allocationData.map((item: AllocationData, index: number) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">{item.month || `Month ${index+1}`}</TableCell>
                            <TableCell>{parseInt(item.baseAllocation || '4500').toLocaleString()}</TableCell>
                            <TableCell>
                              {parseInt(item.adjustments || '0') > 0 
                                ? `+${parseInt(item.adjustments || '0').toLocaleString()}` 
                                : parseInt(item.adjustments || '0').toLocaleString()}
                            </TableCell>
                            <TableCell>{parseInt(item.totalAllocation || '4500').toLocaleString()}</TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-4 text-gray-500">
                            No allocation history available. Generate a report to view details.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t p-4 bg-gray-50">
              <div className="flex items-center gap-2">
                <Select value={exportFormat} onValueChange={setExportFormat}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">PDF</SelectItem>
                    <SelectItem value="excel">Excel</SelectItem>
                    <SelectItem value="csv">CSV</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" onClick={handleExport}>
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
              <Button variant="outline" size="sm" onClick={() => generateReport()}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh Data
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="requests" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Water Request History</CardTitle>
              <CardDescription>
                Review all your past water requests and their statuses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row gap-4 md:items-end">
                  <div className="flex-1 space-y-2">
                    <h3 className="text-sm font-medium">Date Range</h3>
                    <DateRangePicker 
                      dateRange={dateRange} 
                      setDateRange={setDateRange} 
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      onClick={generateReport}
                      disabled={isGenerating || !dateRange?.from || !dateRange?.to}
                    >
                      {isGenerating ? (
                        <>
                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Droplet className="h-4 w-4 mr-2" />
                          Generate Report
                        </>
                      )}
                    </Button>
                  </div>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h3 className="text-lg font-medium mb-4">Request History</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Request Type</TableHead>
                        <TableHead>Amount (m³)</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Notes</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {requestsData.length > 0 ? (
                        requestsData.map((request: RequestData) => (
                          <TableRow key={request.id}>
                            <TableCell className="font-medium">
                              {format(new Date(request.date), "MMM d, yyyy")}
                            </TableCell>
                            <TableCell>{request.type}</TableCell>
                            <TableCell>{request.amount || "--"}</TableCell>
                            <TableCell>
                              <span 
                                className={`px-2 py-1 text-xs rounded-full ${
                                  request.status === "approved" 
                                    ? "bg-green-100 text-green-800" 
                                    : request.status === "denied" 
                                      ? "bg-red-100 text-red-800" 
                                      : "bg-amber-100 text-amber-800"
                                }`}
                              >
                                {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                              </span>
                            </TableCell>
                            <TableCell className="max-w-xs truncate">
                              {request.notes || "No notes"}
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-4 text-gray-500">
                            No request history available. Generate a report to view your requests.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h3 className="text-lg font-medium mb-4">Request Summary</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <p className="text-sm text-gray-500">Total Requests</p>
                          <p className="text-3xl font-bold mt-1">{requestsData.length}</p>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <p className="text-sm text-gray-500">Approval Rate</p>
                          {requestsData.length > 0 ? (
                            <p className="text-3xl font-bold mt-1">
                              {Math.round((requestsData.filter((r: RequestData) => r.status === "approved").length / requestsData.length) * 100)}%
                            </p>
                          ) : (
                            <p className="text-3xl font-bold mt-1">0%</p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <p className="text-sm text-gray-500">Additional Water</p>
                          {requestsData.length > 0 ? (
                            <p className="text-3xl font-bold mt-1">
                              {requestsData
                                .filter((r: RequestData) => r.type === "Additional Water" && r.status === "approved")
                                .reduce((sum: number, r: RequestData) => sum + (parseInt(r.amount || '0') || 0), 0)
                                .toLocaleString()} m³
                            </p>
                          ) : (
                            <p className="text-3xl font-bold mt-1">0 m³</p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t p-4 bg-gray-50">
              <div className="flex items-center gap-2">
                <Select value={exportFormat} onValueChange={setExportFormat}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">PDF</SelectItem>
                    <SelectItem value="excel">Excel</SelectItem>
                    <SelectItem value="csv">CSV</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" onClick={handleExport}>
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
              <Button variant="outline" size="sm" onClick={() => generateReport()}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh Data
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}