import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import WaterLevel from "@/components/ui/water-level";
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
import { Droplet, Edit, RefreshCw, Plus } from "lucide-react";

export default function AdminReservoirs() {
  const { toast } = useToast();
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [selectedReservoir, setSelectedReservoir] = useState<any>(null);
  const [newLevel, setNewLevel] = useState<number>(0);
  const [newReservoir, setNewReservoir] = useState({
    name: "",
    capacity: "",
    currentLevel: "",
    location: ""
  });
  
  // Fetch reservoirs data
  const { data: reservoirs, isLoading } = useQuery({
    queryKey: ["/api/reservoirs"],
  });
  
  // Update reservoir level mutation
  const updateLevelMutation = useMutation({
    mutationFn: async ({ id, level }: { id: number; level: number }) => {
      const res = await apiRequest("PATCH", `/api/reservoirs/${id}/level`, { level });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/reservoirs"] });
      toast({
        title: "Reservoir updated",
        description: "Water level has been updated successfully.",
      });
      setOpenUpdateDialog(false);
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Update failed",
        description: error.message || "Failed to update reservoir level",
      });
    },
  });

  // Create new reservoir mutation
  const createReservoirMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await apiRequest("POST", "/api/reservoirs", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/reservoirs"] });
      toast({
        title: "Reservoir created",
        description: "New reservoir has been added successfully.",
      });
      setOpenAddDialog(false);
      setNewReservoir({
        name: "",
        capacity: "",
        currentLevel: "",
        location: ""
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Creation failed",
        description: error.message || "Failed to create new reservoir",
      });
    },
  });
  
  const handleUpdateLevel = () => {
    if (selectedReservoir) {
      updateLevelMutation.mutate({
        id: selectedReservoir.id,
        level: newLevel,
      });
    }
  };
  
  const handleAddReservoir = () => {
    createReservoirMutation.mutate(newReservoir);
  };
  
  const openEditDialog = (reservoir: any) => {
    setSelectedReservoir(reservoir);
    setNewLevel(parseFloat(reservoir.currentLevel));
    setOpenUpdateDialog(true);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewReservoir(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <DashboardLayout title="Reservoir Management">
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="details">Detailed View</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold">Reservoirs Overview</h2>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button size="sm" onClick={() => setOpenAddDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Reservoir
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              Array(3).fill(0).map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader className="pb-2">
                    <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-40 bg-gray-200 rounded mb-4"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded"></div>
                      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              reservoirs && reservoirs.map((reservoir: any) => {
                const percentFull = Math.round((reservoir.currentLevel / reservoir.capacity) * 100);
                
                return (
                  <Card key={reservoir.id} className="overflow-hidden">
                    <CardHeader className="pb-2">
                      <CardTitle className="flex justify-between items-center">
                        <span>{reservoir.name}</span>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => openEditDialog(reservoir)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <WaterLevel percentage={percentFull} />
                      
                      <div className="mt-4 space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Current Level:</span>
                          <span className="font-medium">
                            {Number(reservoir.currentLevel).toLocaleString()} m³
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Total Capacity:</span>
                          <span className="font-medium">
                            {Number(reservoir.capacity).toLocaleString()} m³
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Last Updated:</span>
                          <span className="font-medium">
                            {format(new Date(reservoir.lastUpdated), 'MMM d, yyyy h:mm a')}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="details">
          <Card>
            <CardHeader>
              <CardTitle>Detailed Reservoir Data</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Current Level (m³)</TableHead>
                    <TableHead>Capacity (m³)</TableHead>
                    <TableHead>Percentage</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    Array(3).fill(0).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell colSpan={6} className="h-16">
                          <div className="animate-pulse flex items-center space-x-4">
                            <div className="h-4 bg-gray-200 rounded w-full"></div>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    reservoirs && reservoirs.map((reservoir: any) => {
                      const percentFull = Math.round((reservoir.currentLevel / reservoir.capacity) * 100);
                      
                      return (
                        <TableRow key={reservoir.id}>
                          <TableCell className="font-medium">{reservoir.name}</TableCell>
                          <TableCell>{Number(reservoir.currentLevel).toLocaleString()}</TableCell>
                          <TableCell>{Number(reservoir.capacity).toLocaleString()}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <span 
                                className={`
                                  mr-2 w-3 h-3 rounded-full
                                  ${percentFull > 70 ? 'bg-green-500' : 
                                    percentFull > 30 ? 'bg-amber-500' : 'bg-red-500'}
                                `}
                              />
                              {percentFull}%
                            </div>
                          </TableCell>
                          <TableCell>
                            {format(new Date(reservoir.lastUpdated), 'MMM d, yyyy h:mm a')}
                          </TableCell>
                          <TableCell>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => openEditDialog(reservoir)}
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              Update
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Reservoir History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center p-8 text-gray-500">
                <Droplet className="h-8 w-8 mr-2 opacity-50" />
                <p>Historical data visualization will be available soon.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Update Reservoir Dialog */}
      <Dialog open={openUpdateDialog} onOpenChange={setOpenUpdateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Reservoir Level</DialogTitle>
            <DialogDescription>
              Adjust the water level for {selectedReservoir?.name}
            </DialogDescription>
          </DialogHeader>
          
          {selectedReservoir && (
            <div className="py-4">
              <div className="mb-4">
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Current Level:</span>
                  <span className="text-sm">
                    {Number(selectedReservoir.currentLevel).toLocaleString()} m³
                  </span>
                </div>
                <div className="flex justify-between mb-4">
                  <span className="text-sm font-medium">Capacity:</span>
                  <span className="text-sm">
                    {Number(selectedReservoir.capacity).toLocaleString()} m³
                  </span>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <label className="text-sm font-medium">
                      New Level: {Number(newLevel).toLocaleString()} m³ 
                      ({Math.round((newLevel / selectedReservoir.capacity) * 100)}%)
                    </label>
                    <Slider
                      value={[newLevel]}
                      max={parseFloat(selectedReservoir.capacity)}
                      step={100}
                      onValueChange={(value) => setNewLevel(value[0])}
                      className="mt-2"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium block mb-2">
                      Or enter exact value:
                    </label>
                    <Input
                      type="number"
                      value={newLevel}
                      onChange={(e) => setNewLevel(parseFloat(e.target.value))}
                      max={selectedReservoir.capacity}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenUpdateDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleUpdateLevel}
              disabled={updateLevelMutation.isPending}
            >
              {updateLevelMutation.isPending ? "Updating..." : "Update Level"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Add Reservoir Dialog */}
      <Dialog open={openAddDialog} onOpenChange={setOpenAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Reservoir</DialogTitle>
            <DialogDescription>
              Enter the details for the new water reservoir
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium block mb-2">Reservoir Name:</label>
                <Input
                  name="name"
                  placeholder="Enter reservoir name"
                  value={newReservoir.name}
                  onChange={handleInputChange}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium block mb-2">Total Capacity (m³):</label>
                <Input
                  name="capacity"
                  type="number"
                  placeholder="Enter total capacity"
                  value={newReservoir.capacity}
                  onChange={handleInputChange}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium block mb-2">Current Level (m³):</label>
                <Input
                  name="currentLevel"
                  type="number"
                  placeholder="Enter current water level"
                  value={newReservoir.currentLevel}
                  onChange={handleInputChange}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium block mb-2">Location:</label>
                <Input
                  name="location"
                  placeholder="Enter geographical location"
                  value={newReservoir.location}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenAddDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleAddReservoir}
              disabled={createReservoirMutation.isPending}
            >
              {createReservoirMutation.isPending ? "Creating..." : "Add Reservoir"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
