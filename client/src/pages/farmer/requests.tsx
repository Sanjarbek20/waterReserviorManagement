import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { 
  AlertCircle, 
  CalendarIcon, 
  CheckCircle, 
  Clock, 
  Download, 
  FileText, 
  Plus, 
  RefreshCw, 
  XCircle 
} from "lucide-react";

// Form validation schema for water request
const waterRequestSchema = z.object({
  type: z.enum(["additional", "schedule_change", "emergency"]),
  amount: z.coerce.number().positive().optional().nullable(),
  notes: z.string().max(500).optional(),
});

export default function FarmerRequests() {
  const { toast } = useToast();
  const [openDialog, setOpenDialog] = useState(false);
  
  // Define the request type
  type WaterRequestResponse = {
    id: number;
    userId: number;
    type: string;
    amount: string | null;
    status: string;
    requestDate: string;
    responseDate: string | null;
    notes: string | null;
  };

  // Fetch requests data
  const { data: requests = [], isLoading: isLoadingRequests } = useQuery<WaterRequestResponse[]>({
    queryKey: ["/api/requests"],
  });
  
  // Setup form for new request
  const form = useForm<z.infer<typeof waterRequestSchema>>({
    resolver: zodResolver(waterRequestSchema),
    defaultValues: {
      type: "additional",
      amount: null,
      notes: "",
    },
  });
  
  // Get the type to conditionally render amount field
  const requestType = form.watch("type");
  
  // Create request mutation
  const createRequestMutation = useMutation({
    mutationFn: async (requestData: z.infer<typeof waterRequestSchema>) => {
      // Convert amount to string for backend storage if it exists
      const formattedData = {
        ...requestData,
        amount: requestData.amount !== null ? String(requestData.amount) : null
      };
      const res = await apiRequest("POST", "/api/requests", formattedData);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/requests"] });
      toast({
        title: "Request submitted",
        description: "Your water request has been submitted successfully",
      });
      setOpenDialog(false);
      form.reset();
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Request failed",
        description: error.message || "Could not submit water request",
      });
    },
  });
  
  // Handle form submission
  const onSubmit = (data: z.infer<typeof waterRequestSchema>) => {
    createRequestMutation.mutate(data);
  };
  
  // Helper function to get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return (
          <Badge className="bg-green-500">
            <CheckCircle className="h-3 w-3 mr-1" /> Approved
          </Badge>
        );
      case 'denied':
        return (
          <Badge variant="destructive">
            <XCircle className="h-3 w-3 mr-1" /> Denied
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="text-amber-500 border-amber-500">
            <Clock className="h-3 w-3 mr-1" /> Pending
          </Badge>
        );
    }
  };
  
  // Format request type for display
  const formatRequestType = (type: string) => {
    return type.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <DashboardLayout title="Water Requests">
      <Tabs defaultValue="active" className="space-y-4">
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="active">Active Requests</TabsTrigger>
            <TabsTrigger value="history">Request History</TabsTrigger>
          </TabsList>
          <Button onClick={() => setOpenDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Request
          </Button>
        </div>
        
        <TabsContent value="active" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Current Requests</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingRequests ? (
                <div className="flex flex-col items-center justify-center py-6">
                  <RefreshCw className="h-8 w-8 text-gray-400 animate-spin" />
                  <p className="mt-2 text-gray-500">Loading requests...</p>
                </div>
              ) : !requests || requests.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <FileText className="h-12 w-12 text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-800">No Active Requests</h3>
                  <p className="mt-1 text-gray-500 max-w-md">
                    You don't have any pending water requests. Click "New Request" to create one.
                  </p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Notes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {requests
                      .filter((request) => request.status === 'pending')
                      .map((request) => (
                        <TableRow key={request.id}>
                          <TableCell className="font-medium capitalize">
                            {formatRequestType(request.type)}
                          </TableCell>
                          <TableCell>
                            {request.amount ? `${Number(request.amount).toLocaleString()} m³` : '--'}
                          </TableCell>
                          <TableCell>
                            {format(new Date(request.requestDate), 'MMM d, yyyy')}
                          </TableCell>
                          <TableCell>{getStatusBadge(request.status)}</TableCell>
                          <TableCell className="max-w-xs truncate">
                            {request.notes || ''}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Request History</CardTitle>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </CardHeader>
            <CardContent>
              {isLoadingRequests ? (
                <div className="flex flex-col items-center justify-center py-6">
                  <RefreshCw className="h-8 w-8 text-gray-400 animate-spin" />
                  <p className="mt-2 text-gray-500">Loading history...</p>
                </div>
              ) : !requests || requests.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <CalendarIcon className="h-12 w-12 text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-800">No Request History</h3>
                  <p className="mt-1 text-gray-500 max-w-md">
                    You haven't made any water requests yet.
                  </p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Response</TableHead>
                      <TableHead>Notes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {requests
                      .filter((request) => request.status !== 'pending')
                      .sort((a, b) => 
                        new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime()
                      )
                      .map((request) => (
                        <TableRow key={request.id}>
                          <TableCell className="font-medium capitalize">
                            {formatRequestType(request.type)}
                          </TableCell>
                          <TableCell>
                            {request.amount ? `${Number(request.amount).toLocaleString()} m³` : '--'}
                          </TableCell>
                          <TableCell>
                            {format(new Date(request.requestDate), 'MMM d, yyyy')}
                          </TableCell>
                          <TableCell>{getStatusBadge(request.status)}</TableCell>
                          <TableCell>
                            {request.responseDate ? 
                              format(new Date(request.responseDate), 'MMM d, yyyy') : 
                              '--'
                            }
                          </TableCell>
                          <TableCell className="max-w-xs truncate">
                            {request.notes || ''}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* New Request Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>New Water Request</DialogTitle>
            <DialogDescription>
              Submit a new request for water allocation or schedule changes.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Request Type</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select the type of request" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="additional">Additional Water Allocation</SelectItem>
                        <SelectItem value="schedule_change">Schedule Change</SelectItem>
                        <SelectItem value="emergency">Emergency Request</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Select the type of water request you need.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {(requestType === "additional" || requestType === "emergency") && (
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount (m³)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="Enter water amount" 
                          {...field}
                          value={field.value === null ? '' : field.value}
                          onChange={(e) => {
                            const value = e.target.value;
                            field.onChange(value === '' ? null : parseFloat(value));
                          }}
                        />
                      </FormControl>
                      <FormDescription>
                        How much additional water are you requesting (in cubic meters)?
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Additional Notes</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Please provide any details about your request"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Explain why you need this water allocation or schedule change.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="bg-amber-50 border border-amber-200 rounded-md p-3 flex items-start">
                <AlertCircle className="text-amber-500 h-5 w-5 mt-0.5 mr-2 flex-shrink-0" />
                <div className="text-sm text-amber-800">
                  <p className="font-medium mb-1">Important Information</p>
                  <p>All water requests are reviewed by administrators. Approval depends on current reservoir levels and overall demand. You'll receive a notification once your request is processed.</p>
                </div>
              </div>
              
              <DialogFooter>
                <Button 
                  type="submit" 
                  disabled={createRequestMutation.isPending}
                >
                  {createRequestMutation.isPending ? "Submitting..." : "Submit Request"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
