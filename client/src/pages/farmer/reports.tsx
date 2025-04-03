import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
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
  const { data: usageData = [], isLoading: isLoadingUsage, refetch: refetchUsage } = useQuery({
    queryKey: ["/api/reports/usage", dateRange?.from, dateRange?.to],
    enabled: false, // We'll trigger this manually
  });
  
  // Query for allocation data
  const { data: allocationData = [], isLoading: isLoadingAllocation, refetch: refetchAllocation } = useQuery({
    queryKey: ["/api/reports/allocation", dateRange?.from, dateRange?.to],
    enabled: false, // We'll trigger this manually
  });
  
  // Sample water usage data for chart
  const sampleUsageData = [
    { date: "Week 1", used: 245, allocated: 300 },
    { date: "Week 2", used: 320, allocated: 300 },
    { date: "Week 3", used: 278, allocated: 300 },
    { date: "Week 4", used: 290, allocated: 300 },
  ];
  
  // Sample water request history
  const sampleRequestHistory = [
    { 
      id: 1, 
      date: "2025-03-15", 
      type: "Additional Water", 
      amount: "500", 
      status: "Approved", 
      notes: "For extended dry period" 
    },
    { 
      id: 2, 
      date: "2025-03-05", 
      type: "Schedule Change", 
      amount: null, 
      status: "Approved", 
      notes: "Requested earlier irrigation time" 
    },
    { 
      id: 3, 
      date: "2025-02-28", 
      type: "Emergency", 
      amount: "300", 
      status: "Denied", 
      notes: "Insufficient reservoir levels" 
    },
  ];
  
  // Generate report function
  const generateReport = () => {
    setIsGenerating(true);
    
    // Based on the report type, trigger the appropriate query
    if (reportType === "usage") {
      refetchUsage();
    } else if (reportType === "allocation") {
      refetchAllocation();
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
    
    // Simulate export process
    setTimeout(() => {
      toast({
        title: "Export Complete",
        description: `Your report has been downloaded as ${format.toUpperCase()}.`,
      });
    }, 1500);
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
                        data={sampleUsageData}
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
                      {sampleUsageData.map((item, index) => (
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
                      ))}
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
                      <TableRow>
                        <TableCell className="font-medium">January 2025</TableCell>
                        <TableCell>4500</TableCell>
                        <TableCell>+300</TableCell>
                        <TableCell>4800</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">February 2025</TableCell>
                        <TableCell>4500</TableCell>
                        <TableCell>0</TableCell>
                        <TableCell>4500</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">March 2025</TableCell>
                        <TableCell>4500</TableCell>
                        <TableCell>+500</TableCell>
                        <TableCell>5000</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">April 2025</TableCell>
                        <TableCell>4500</TableCell>
                        <TableCell>+700</TableCell>
                        <TableCell>5200</TableCell>
                      </TableRow>
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
                      {sampleRequestHistory.map((request) => (
                        <TableRow key={request.id}>
                          <TableCell className="font-medium">
                            {format(new Date(request.date), "MMM d, yyyy")}
                          </TableCell>
                          <TableCell>{request.type}</TableCell>
                          <TableCell>{request.amount || "--"}</TableCell>
                          <TableCell>
                            <span 
                              className={`px-2 py-1 text-xs rounded-full ${
                                request.status === "Approved" 
                                  ? "bg-green-100 text-green-800" 
                                  : request.status === "Denied" 
                                    ? "bg-red-100 text-red-800" 
                                    : "bg-amber-100 text-amber-800"
                              }`}
                            >
                              {request.status}
                            </span>
                          </TableCell>
                          <TableCell className="max-w-xs truncate">
                            {request.notes}
                          </TableCell>
                        </TableRow>
                      ))}
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
                          <p className="text-3xl font-bold mt-1">12</p>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <p className="text-sm text-gray-500">Approval Rate</p>
                          <p className="text-3xl font-bold mt-1">75%</p>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6">
                        <div className="text-center">
                          <p className="text-sm text-gray-500">Additional Water</p>
                          <p className="text-3xl font-bold mt-1">2,500 m³</p>
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