import { useState } from "react";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { DateRange } from "react-day-picker";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Download, FileText, BarChart3, LineChart as LineChartIcon, Database, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Sample data for demonstration
const waterUsageData = [
  { month: 'Jan', usage: 4000, target: 3000 },
  { month: 'Feb', usage: 3500, target: 3000 },
  { month: 'Mar', usage: 3200, target: 3000 },
  { month: 'Apr', usage: 3800, target: 3000 },
  { month: 'May', usage: 4200, target: 3000 },
  { month: 'Jun', usage: 4800, target: 3000 },
  { month: 'Jul', usage: 5200, target: 3000 },
];

const reservoirLevelData = [
  { date: '01/07', level: 92 },
  { date: '02/07', level: 91 },
  { date: '03/07', level: 89.5 },
  { date: '04/07', level: 88 },
  { date: '05/07', level: 90 },
  { date: '06/07', level: 93 },
  { date: '07/07', level: 94 },
  { date: '08/07', level: 95 },
  { date: '09/07', level: 94.5 },
  { date: '10/07', level: 93 },
];

const waterRequestsData = [
  { month: 'Jan', approved: 65, denied: 12, pending: 5 },
  { month: 'Feb', approved: 59, denied: 8, pending: 7 },
  { month: 'Mar', approved: 80, denied: 10, pending: 3 },
  { month: 'Apr', approved: 81, denied: 15, pending: 4 },
  { month: 'May', approved: 76, denied: 5, pending: 6 },
  { month: 'Jun', approved: 84, denied: 7, pending: 8 },
  { month: 'Jul', approved: 95, denied: 3, pending: 2 },
];

export default function Reports() {
  const { toast } = useToast();
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(2023, 0, 1),
    to: new Date()
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Generate dummy data for export
  const generateExportData = () => {
    // CSV format data
    let csvData = 'Month,Usage,Target\n';
    waterUsageData.forEach(item => {
      csvData += `${item.month},${item.usage},${item.target}\n`;
    });
    
    return {
      csv: csvData,
      // Simple representations for other formats
      pdf: 'PDF data would be generated here',
      excel: 'Excel data would be generated here'
    };
  };

  // Helper function to trigger file download
  const downloadFile = (data: string, filename: string, mimeType: string) => {
    // Create a blob with the data and appropriate MIME type
    const blob = new Blob([data], { type: mimeType });
    
    // Create a link element
    const link = document.createElement('a');
    
    // Create a URL for the blob
    const url = URL.createObjectURL(blob);
    
    // Set link properties
    link.href = url;
    link.download = filename;
    
    // Append the link to the body
    document.body.appendChild(link);
    
    // Trigger the download
    link.click();
    
    // Clean up
    URL.revokeObjectURL(url);
    document.body.removeChild(link);
  };

  const handleExport = (format: string) => {
    setIsLoading(true);
    
    // Get the current date for the filename
    const date = new Date();
    const dateStr = date.toISOString().split('T')[0];
    
    // Generate the export data
    const exportData = generateExportData();
    
    // Wait a bit to simulate processing
    setTimeout(() => {
      try {
        if (format === 'csv') {
          downloadFile(
            exportData.csv,
            `water-usage-report-${dateStr}.csv`,
            'text/csv;charset=utf-8;'
          );
        } else if (format === 'excel') {
          // For Excel, we're just simulating with a CSV for demo
          // In a real implementation, you'd use a library like xlsx
          downloadFile(
            exportData.csv,
            `water-usage-report-${dateStr}.xlsx`,
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          );
        } else if (format === 'pdf') {
          // For PDF, we're just simulating
          // In a real implementation, you'd use a library like jsPDF
          const pdfData = 
            '%PDF-1.4\n' +
            '1 0 obj\n' +
            '<<\n/Title (Water Usage Report)\n/Author (Water Management System)\n/Creator (System)\n>>\nendobj\n' +
            '2 0 obj\n<<\n/Type /Catalog\n/Pages 3 0 R\n>>\nendobj\n' +
            '3 0 obj\n<<\n/Type /Pages\n/Count 1\n/Kids [4 0 R]\n>>\nendobj\n' +
            '4 0 obj\n<<\n/Type /Page\n/Parent 3 0 R\n/Resources <<\n/Font <<\n/F1 5 0 R\n>>\n>>\n' +
            '/Contents 6 0 R\n>>\nendobj\n' +
            '5 0 obj\n<<\n/Type /Font\n/Subtype /Type1\n/BaseFont /Helvetica\n>>\nendobj\n' +
            '6 0 obj\n<<\n/Length 44\n>>\nstream\nBT\n/F1 12 Tf\n100 700 Td\n(Water Usage Report) Tj\nET\nendstream\nendobj\n' +
            'xref\n0 7\n0000000000 65535 f\n0000000009 00000 n\n0000000098 00000 n\n0000000147 00000 n\n' +
            '0000000206 00000 n\n0000000302 00000 n\n0000000370 00000 n\ntrailer\n<<\n/Size 7\n/Root 2 0 R\n' +
            '/Info 1 0 R\n>>\nstartxref\n465\n%%EOF\n';
          
          downloadFile(
            pdfData,
            `water-usage-report-${dateStr}.pdf`,
            'application/pdf'
          );
        }
        
        toast({
          title: "Export Successful",
          description: `Report has been exported in ${format.toUpperCase()} format.`,
        });
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Export Failed",
          description: `There was an error exporting the report: ${error instanceof Error ? error.message : 'Unknown error'}`,
        });
      } finally {
        setIsLoading(false);
      }
    }, 1000);
  };

  const handleRefresh = () => {
    setIsLoading(true);
    // Simulate data refresh
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Data Refreshed",
        description: "Report data has been updated with the latest information.",
      });
    }, 1500);
  };

  return (
    <DashboardLayout title="Reports">
      <div className="space-y-5">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <Card className="w-full sm:w-auto">
            <CardContent className="pt-6">
              <DateRangePicker dateRange={dateRange} setDateRange={setDateRange} />
            </CardContent>
          </Card>

          <div className="flex gap-2 flex-wrap">
            <Button onClick={handleRefresh} variant="outline" disabled={isLoading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button onClick={() => handleExport('pdf')} variant="outline" disabled={isLoading}>
              <FileText className="h-4 w-4 mr-2" />
              Export PDF
            </Button>
            <Button onClick={() => handleExport('excel')} variant="outline" disabled={isLoading}>
              <Download className="h-4 w-4 mr-2" />
              Export Excel
            </Button>
            <Button onClick={() => handleExport('csv')} variant="outline" disabled={isLoading}>
              <Database className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </div>

        <Tabs defaultValue="water-usage">
          <TabsList className="mb-4">
            <TabsTrigger value="water-usage">
              <BarChart3 className="h-4 w-4 mr-2" />
              Water Usage
            </TabsTrigger>
            <TabsTrigger value="reservoir-levels">
              <LineChartIcon className="h-4 w-4 mr-2" />
              Reservoir Levels
            </TabsTrigger>
            <TabsTrigger value="water-requests">
              <BarChart3 className="h-4 w-4 mr-2" />
              Water Requests
            </TabsTrigger>
          </TabsList>

          <TabsContent value="water-usage">
            <Card>
              <CardHeader>
                <CardTitle>Water Usage Analysis</CardTitle>
                <CardDescription>
                  Monthly water usage compared to target allocation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={waterUsageData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="usage" fill="#3b82f6" name="Actual Usage (m³)" />
                      <Bar dataKey="target" fill="#e11d48" name="Target Usage (m³)" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reservoir-levels">
            <Card>
              <CardHeader>
                <CardTitle>Reservoir Level Trends</CardTitle>
                <CardDescription>
                  Daily water level percentage over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={reservoirLevelData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis domain={[85, 100]} />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="level" stroke="#3b82f6" name="Water Level (%)" activeDot={{ r: 8 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="water-requests">
            <Card>
              <CardHeader>
                <CardTitle>Water Request Statistics</CardTitle>
                <CardDescription>
                  Monthly breakdown of water requests by status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={waterRequestsData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="approved" stackId="a" fill="#10b981" name="Approved Requests" />
                      <Bar dataKey="denied" stackId="a" fill="#ef4444" name="Denied Requests" />
                      <Bar dataKey="pending" stackId="a" fill="#f59e0b" name="Pending Requests" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Card>
          <CardHeader>
            <CardTitle>Report Summary</CardTitle>
            <CardDescription>
              Key insights from the selected time period
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-md font-semibold mb-2">Water Usage</h3>
                <p className="text-sm text-gray-600">Overall water usage has increased by 12% compared to the previous period. The largest consumption is observed in July, exceeding the target by 73.3%.</p>
              </div>
              
              <div>
                <h3 className="text-md font-semibold mb-2">Reservoir Levels</h3>
                <p className="text-sm text-gray-600">The main reservoir has maintained a healthy level above 88% throughout the period, with a slight increase in the most recent days. The trend indicates good reserve capacity for upcoming seasonal demands.</p>
              </div>
              
              <div>
                <h3 className="text-md font-semibold mb-2">Water Requests</h3>
                <p className="text-sm text-gray-600">The approval rate for water requests has improved to 96.9% in July, which is the highest in the year. The number of pending requests has decreased significantly, indicating improved processing efficiency.</p>
              </div>
              
              <div>
                <h3 className="text-md font-semibold mb-2">Recommendations</h3>
                <p className="text-sm text-gray-600">Based on the current data, consider reviewing the water allocation targets as current usage consistently exceeds targets. Also, the high approval rate may indicate that the current allocation allowances may be too generous or that water availability is better than anticipated.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}