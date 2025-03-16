import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Download, Filter } from "lucide-react";

import DashboardLayout from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function DataManagement() {
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [dataType, setDataType] = useState<string>("reservoirs");
  const { toast } = useToast();

  const { data: reservoirs = [] } = useQuery<any[]>({
    queryKey: ["/api/reservoirs"],
    enabled: dataType === "reservoirs",
  });

  const { data: allocations = [] } = useQuery<any[]>({
    queryKey: ["/api/allocations"],
    enabled: dataType === "allocations",
  });

  const { data: requests = [] } = useQuery<any[]>({
    queryKey: ["/api/requests"],
    enabled: dataType === "requests",
  });

  const downloadData = () => {
    let data;
    let filename;

    if (dataType === "reservoirs") {
      data = filterDataByDate(reservoirs);
      filename = `reservoirs_${formatDateForFilename(new Date())}.csv`;
    } else if (dataType === "allocations") {
      data = filterDataByDate(allocations);
      filename = `allocations_${formatDateForFilename(new Date())}.csv`;
    } else if (dataType === "requests") {
      data = filterDataByDate(requests);
      filename = `requests_${formatDateForFilename(new Date())}.csv`;
    } else {
      toast({
        title: "No data available",
        description: "Please try again later.",
        variant: "destructive",
      });
      return;
    }

    // Convert to CSV
    const csvContent = convertToCSV(data);
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    
    // Create download link
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    link.click();

    toast({
      title: "Download started",
      description: `Downloading ${filename}`,
    });
  };

  const filterDataByDate = (data: any[]) => {
    if (!startDate && !endDate) return data;
    
    return data.filter((item) => {
      const itemDate = new Date(item.createdAt || item.requestDate || item.lastUpdated);
      
      if (startDate && endDate) {
        return itemDate >= startDate && itemDate <= endDate;
      } else if (startDate) {
        return itemDate >= startDate;
      } else if (endDate) {
        return itemDate <= endDate;
      }
      
      return true;
    });
  };

  const formatDateForFilename = (date: Date): string => {
    return format(date, "yyyy-MM-dd");
  };

  const convertToCSV = (data: any[]): string => {
    if (!data || data.length === 0) return '';
    
    const headers = Object.keys(data[0]);
    const headerRow = headers.join(',');
    
    const rows = data.map(item => {
      return headers.map(header => {
        const cell = item[header];
        // Handle dates, nulls, etc.
        if (cell === null || cell === undefined) return '';
        if (cell instanceof Date) return format(cell, "yyyy-MM-dd HH:mm:ss");
        // Ensure strings with commas are quoted
        if (typeof cell === 'string' && cell.includes(',')) {
          return `"${cell}"`;
        }
        return cell;
      }).join(',');
    });
    
    return [headerRow, ...rows].join('\n');
  };

  return (
    <DashboardLayout title="Data Management">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Data Download</CardTitle>
            <CardDescription>
              Download water management data for analysis and reporting
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="filter" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="filter">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter Options
                </TabsTrigger>
                <TabsTrigger value="preview">
                  Preview
                </TabsTrigger>
              </TabsList>

              <TabsContent value="filter" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Data Type</h3>
                    <Select value={dataType} onValueChange={setDataType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select data type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="reservoirs">Reservoir Data</SelectItem>
                        <SelectItem value="allocations">Water Allocations</SelectItem>
                        <SelectItem value="requests">Water Requests</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Start Date</h3>
                    <DatePicker date={startDate} setDate={setStartDate} />
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">End Date</h3>
                    <DatePicker date={endDate} setDate={setEndDate} />
                  </div>

                  <div className="flex items-end">
                    <Button onClick={downloadData} className="w-full gap-1">
                      <Download className="h-4 w-4" />
                      Download Data
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="preview">
                <div className="rounded-md border h-[300px] overflow-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="h-10 px-4 text-left font-medium">ID</th>
                        <th className="h-10 px-4 text-left font-medium">Name/Type</th>
                        <th className="h-10 px-4 text-left font-medium">Date</th>
                        <th className="h-10 px-4 text-left font-medium">Status/Level</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dataType === "reservoirs" && reservoirs.map((reservoir: any) => (
                        <tr key={reservoir.id} className="border-b">
                          <td className="p-4">{reservoir.id}</td>
                          <td className="p-4">{reservoir.name}</td>
                          <td className="p-4">{reservoir.lastUpdated ? format(new Date(reservoir.lastUpdated), "yyyy-MM-dd") : "-"}</td>
                          <td className="p-4">{`${(reservoir.currentLevel / reservoir.capacity * 100).toFixed(1)}%`}</td>
                        </tr>
                      ))}
                      {dataType === "allocations" && allocations.map((allocation: any) => (
                        <tr key={allocation.id} className="border-b">
                          <td className="p-4">{allocation.id}</td>
                          <td className="p-4">{`User ID: ${allocation.userId}`}</td>
                          <td className="p-4">{format(new Date(allocation.startDate), "yyyy-MM-dd")}</td>
                          <td className="p-4">{`${allocation.used}/${allocation.amount}`}</td>
                        </tr>
                      ))}
                      {dataType === "requests" && requests.map((request: any) => (
                        <tr key={request.id} className="border-b">
                          <td className="p-4">{request.id}</td>
                          <td className="p-4">{request.type}</td>
                          <td className="p-4">{format(new Date(request.requestDate), "yyyy-MM-dd")}</td>
                          <td className="p-4">{request.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}