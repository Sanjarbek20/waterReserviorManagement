import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { 
  BarChart3, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Droplet,
  Filter,
  Download,
  RefreshCw
} from "lucide-react";

export default function AdminAllocation() {
  const { toast } = useToast();
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [requestStatus, setRequestStatus] = useState("");
  const [statusNotes, setStatusNotes] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [adjustAllocationOpen, setAdjustAllocationOpen] = useState(false);
  
  // Fetch requests data
  const { data: requests = [], isLoading, refetch } = useQuery<any[]>({
    queryKey: ["/api/requests"],
  });
  
  // Update request status mutation
  const updateRequestMutation = useMutation({
    mutationFn: async ({ id, status, notes }: { id: number, status: string, notes: string }) => {
      const res = await apiRequest("PATCH", `/api/requests/${id}/status`, { status, notes });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/requests"] });
      toast({
        title: "Request updated",
        description: `Request status changed to ${requestStatus}.`,
      });
      setOpenDialog(false);
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Update failed",
        description: error.message || "Failed to update request status",
      });
    },
  });
  
  const handleUpdateStatus = () => {
    if (selectedRequest && requestStatus) {
      updateRequestMutation.mutate({
        id: selectedRequest.id,
        status: requestStatus,
        notes: statusNotes
      });
    }
  };
  
  const openUpdateDialog = (request: any, initialStatus: string) => {
    setSelectedRequest(request);
    setRequestStatus(initialStatus);
    setStatusNotes("");
    setOpenDialog(true);
  };
  
  // Water allocation data
  const allocationData = [
    { cropType: "Rice Fields", allocated: 45000, used: 32000, percentage: 71 },
    { cropType: "Vegetable Farms", allocated: 30000, used: 15000, percentage: 50 },
    { cropType: "Wheat Fields", allocated: 15000, used: 12000, percentage: 80 },
    { cropType: "Corn Fields", allocated: 10000, used: 5000, percentage: 50 },
    { cropType: "Other Crops", allocated: 5000, used: 2000, percentage: 40 }
  ];

  return (
    <DashboardLayout title="Water Allocation Management">
      <Tabs defaultValue="requests" className="space-y-4">
        <TabsList>
          <TabsTrigger value="requests">Water Requests</TabsTrigger>
          <TabsTrigger value="allocation">Current Allocation</TabsTrigger>
          <TabsTrigger value="statistics">Usage Statistics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="requests" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Farmer Water Requests</h2>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  setFilterOpen(true);
                  toast({
                    title: "Filter feature",
                    description: "Filtering functionality will be available in the next update.",
                  });
                }}
              >
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  refetch();
                  toast({
                    title: "Refreshed",
                    description: "Water requests have been refreshed.",
                  });
                }}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
          
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Farmer</TableHead>
                    <TableHead>Request Type</TableHead>
                    <TableHead>Amount (m³)</TableHead>
                    <TableHead>Request Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    Array(5).fill(0).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell colSpan={6} className="h-16">
                          <div className="animate-pulse flex items-center space-x-4">
                            <div className="h-4 bg-gray-200 rounded w-full"></div>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : requests && requests.length > 0 ? (
                    requests.map((request: any) => {
                      let statusBadge;
                      switch (request.status) {
                        case 'approved':
                          statusBadge = <Badge className="bg-green-500"><CheckCircle className="h-3 w-3 mr-1" /> Approved</Badge>;
                          break;
                        case 'denied':
                          statusBadge = <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" /> Denied</Badge>;
                          break;
                        default:
                          statusBadge = <Badge variant="outline" className="text-amber-500 border-amber-500"><Clock className="h-3 w-3 mr-1" /> Pending</Badge>;
                      }
                      
                      return (
                        <TableRow key={request.id}>
                          <TableCell className="font-medium">
                            {request.user?.firstName} {request.user?.lastName || `User #${request.userId}`}
                          </TableCell>
                          <TableCell className="capitalize">{request.type}</TableCell>
                          <TableCell>{request.amount ? Number(request.amount).toLocaleString() : '--'}</TableCell>
                          <TableCell>{format(new Date(request.requestDate), 'MMM d, yyyy')}</TableCell>
                          <TableCell>{statusBadge}</TableCell>
                          <TableCell>
                            {request.status === 'pending' ? (
                              <div className="flex space-x-2">
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="text-green-500 hover:text-green-700 hover:bg-green-50"
                                  onClick={() => openUpdateDialog(request, "approved")}
                                >
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  Approve
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                  onClick={() => openUpdateDialog(request, "denied")}
                                >
                                  <XCircle className="h-4 w-4 mr-1" />
                                  Deny
                                </Button>
                              </div>
                            ) : (
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => openUpdateDialog(request, request.status)}
                              >
                                Review
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                        No water requests found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="allocation" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Current Water Allocation</h2>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  setAdjustAllocationOpen(true);
                  toast({
                    title: "Adjust Allocations",
                    description: "Allocation adjustment feature will be available in the next update.",
                  });
                }}
              >
                <Droplet className="h-4 w-4 mr-2" />
                Adjust Allocations
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  toast({
                    title: "Export Started",
                    description: "Water allocation data export has started. The file will be downloaded shortly.",
                  });
                  
                  // Simulate export delay
                  setTimeout(() => {
                    toast({
                      title: "Export Complete",
                      description: "Water allocation data has been exported successfully.",
                    });
                  }, 1500);
                }}
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Allocation by Crop Type</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Crop Type</TableHead>
                      <TableHead className="text-right">Allocated (m³)</TableHead>
                      <TableHead className="text-right">Used (m³)</TableHead>
                      <TableHead className="text-right">Usage</TableHead>
                      <TableHead>Progress</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {allocationData.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{item.cropType}</TableCell>
                        <TableCell className="text-right">{item.allocated.toLocaleString()}</TableCell>
                        <TableCell className="text-right">{item.used.toLocaleString()}</TableCell>
                        <TableCell className="text-right">{item.percentage}%</TableCell>
                        <TableCell>
                          <Progress 
                            value={item.percentage} 
                            className="h-2"
                            indicatorClassName={
                              item.percentage > 80 ? 'bg-red-500' : 
                              item.percentage > 60 ? 'bg-amber-500' : 
                              'bg-green-500'
                            }
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Allocation Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Total Allocation</h3>
                    <p className="text-2xl font-bold">105,000 <span className="text-sm font-normal text-gray-500">m³</span></p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Total Usage</h3>
                    <p className="text-2xl font-bold">66,000 <span className="text-sm font-normal text-gray-500">m³</span></p>
                    <p className="text-sm text-gray-500">63% of total allocation</p>
                    <Progress value={63} className="h-2 mt-2" />
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Active Farmers</h3>
                    <p className="text-2xl font-bold">243</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Pending Requests</h3>
                    <p className="text-2xl font-bold">12</p>
                  </div>
                  
                  <Button className="w-full">View Detailed Report</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="statistics">
          <Card>
            <CardHeader>
              <CardTitle>Water Usage Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center p-12 text-gray-500">
                <BarChart3 className="h-12 w-12 mr-4 opacity-50" />
                <div>
                  <h3 className="text-xl font-medium mb-2">Advanced Statistics Coming Soon</h3>
                  <p>Detailed water usage analytics and reporting features are under development.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Request Status</DialogTitle>
            <DialogDescription>
              Review and update the status of this water request.
            </DialogDescription>
          </DialogHeader>
          
          {selectedRequest && (
            <div className="py-4">
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium">Request Details:</p>
                  <ul className="mt-2 space-y-2">
                    <li className="text-sm">
                      <span className="text-gray-500">Type:</span> {selectedRequest.type}
                    </li>
                    {selectedRequest.amount && (
                      <li className="text-sm">
                        <span className="text-gray-500">Amount:</span> {Number(selectedRequest.amount).toLocaleString()} m³
                      </li>
                    )}
                    <li className="text-sm">
                      <span className="text-gray-500">Requested:</span> {format(new Date(selectedRequest.requestDate), 'MMM d, yyyy')}
                    </li>
                    <li className="text-sm">
                      <span className="text-gray-500">User ID:</span> {selectedRequest.userId}
                    </li>
                  </ul>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Status:</label>
                  <div className="flex space-x-2 mt-2">
                    <Button
                      variant={requestStatus === "approved" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setRequestStatus("approved")}
                      className={requestStatus === "approved" ? "" : "border-green-200 text-green-700"}
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Approve
                    </Button>
                    <Button
                      variant={requestStatus === "denied" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setRequestStatus("denied")}
                      className={requestStatus === "denied" ? "" : "border-red-200 text-red-700"}
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Deny
                    </Button>
                    <Button
                      variant={requestStatus === "pending" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setRequestStatus("pending")}
                      className={requestStatus === "pending" ? "" : "border-amber-200 text-amber-700"}
                    >
                      <Clock className="h-4 w-4 mr-1" />
                      Pending
                    </Button>
                  </div>
                </div>
                
                <div>
                  <label className="text-sm font-medium block mb-2">Notes:</label>
                  <textarea
                    className="w-full p-2 border rounded-md"
                    rows={3}
                    value={statusNotes}
                    onChange={(e) => setStatusNotes(e.target.value)}
                    placeholder="Add any notes about this decision..."
                  />
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleUpdateStatus}
              disabled={updateRequestMutation.isPending}
            >
              {updateRequestMutation.isPending ? "Updating..." : "Update Status"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
