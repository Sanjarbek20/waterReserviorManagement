import React, { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Search,
  PlusSquare,
  Bell,
  UserCog,
  AlertTriangle,
  Settings,
  MessageSquare,
  BarChart,
  MapPin,
  Lock,
  Unlock
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

// Sample farmer features that can be enabled/disabled
const farmerFeatures = [
  {
    id: "water_requests",
    name: "Suv so'rovlarini yuborish",
    description: "Foydalanuvchi yangi suv so'rovlarini yarata oladi",
    icon: <Droplet className="h-4 w-4 text-blue-500 mr-2" />
  },
  {
    id: "map_access",
    name: "Xarita ko'rinish",
    description: "Umumiy suv resurslari xaritasini ko'rish imkoniyati",
    icon: <MapPin className="h-4 w-4 text-green-500 mr-2" />
  },
  {
    id: "reports",
    name: "Hisobotlarni ko'rish",
    description: "Tizim hisobotlarini ko'rish imkoniyati",
    icon: <BarChart className="h-4 w-4 text-purple-500 mr-2" />
  },
  {
    id: "water_allocation",
    name: "Suv taqsimoti",
    description: "Suv taqsimoti jadvalini ko'rish imkoniyati",
    icon: <Droplet className="h-4 w-4 text-cyan-500 mr-2" />
  },
  {
    id: "messaging",
    name: "Xabarlar almashinuvi",
    description: "Adminlar bilan xabar almashish imkoniyati",
    icon: <MessageSquare className="h-4 w-4 text-indigo-500 mr-2" />
  },
  {
    id: "settings",
    name: "Sozlamalar", 
    description: "Shaxsiy ma'lumotlarni o'zgartirish imkoniyati",
    icon: <Settings className="h-4 w-4 text-slate-500 mr-2" />
  }
];

export default function FarmerManagement() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFarmer, setSelectedFarmer] = useState<any>(null);
  const [isPermissionsDialogOpen, setIsPermissionsDialogOpen] = useState(false);
  const [isNotifyDialogOpen, setIsNotifyDialogOpen] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationType, setNotificationType] = useState<"info" | "warning" | "error">("info");
  const [features, setFeatures] = useState<Record<string, boolean>>({});

  // Query to fetch all users that have "farmer" role
  const { data: farmers = [], isLoading } = useQuery<any[]>({
    queryKey: ["/api/users/farmers"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/users", {});
      const data = await response.json();
      return data.filter((user: any) => user.role === "farmer");
    }
  });

  // Query to fetch farmer permissions
  const { data: permissions = {}, isLoading: isLoadingPermissions } = useQuery({
    queryKey: ["/api/farmer-permissions", selectedFarmer?.id],
    queryFn: async () => {
      if (!selectedFarmer) return {};
      try {
        const response = await apiRequest("GET", `/api/farmer-permissions/${selectedFarmer.id}`, {});
        return response.json();
      } catch (error) {
        // If permissions don't exist yet, return default permissions
        return farmerFeatures.reduce((acc, feature) => {
          acc[feature.id] = true;
          return acc;
        }, {});
      }
    },
    enabled: !!selectedFarmer,
    onSuccess: (data) => {
      setFeatures(data);
    }
  });

  // Mutation to update farmer permissions
  const updatePermissionsMutation = useMutation({
    mutationFn: async (data: { farmerId: number, permissions: Record<string, boolean> }) => {
      const response = await apiRequest(
        "PUT",
        `/api/farmer-permissions/${data.farmerId}`,
        data.permissions
      );
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/farmer-permissions"] });
      toast({
        title: "Huquqlar yangilandi",
        description: "Fermer huquqlari muvaffaqiyatli yangilandi",
      });
      setIsPermissionsDialogOpen(false);
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Xato",
        description: error.message || "Huquqlarni yangilashda xatolik yuz berdi",
      });
    }
  });

  // Mutation to send notification
  const sendNotificationMutation = useMutation({
    mutationFn: async (data: { userId: number, message: string, type: string }) => {
      const response = await apiRequest(
        "POST", 
        "/api/notifications",
        {
          userId: data.userId,
          message: data.message,
          type: data.type,
        }
      );
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Bildirishnoma yuborildi",
        description: "Bildirishnoma muvaffaqiyatli yuborildi",
      });
      setIsNotifyDialogOpen(false);
      setNotificationMessage("");
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Xato",
        description: error.message || "Bildirishnomani yuborishda xatolik yuz berdi",
      });
    }
  });

  // Filter farmers based on search query
  const filteredFarmers = farmers.filter((farmer) => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      farmer.username.toLowerCase().includes(query) ||
      farmer.firstName.toLowerCase().includes(query) ||
      farmer.lastName.toLowerCase().includes(query) ||
      (farmer.cropType && farmer.cropType.toLowerCase().includes(query))
    );
  });

  // Handle opening the permissions dialog
  const handleOpenPermissions = (farmer: any) => {
    setSelectedFarmer(farmer);
    setIsPermissionsDialogOpen(true);
  };

  // Handle opening the notification dialog
  const handleOpenNotify = (farmer: any) => {
    setSelectedFarmer(farmer);
    setIsNotifyDialogOpen(true);
  };

  // Handle toggle all permissions
  const handleToggleAll = (value: boolean) => {
    setFeatures(prev => {
      const newFeatures = { ...prev };
      farmerFeatures.forEach(feature => {
        newFeatures[feature.id] = value;
      });
      return newFeatures;
    });
  };

  // Handle saving the permissions
  const handleSavePermissions = () => {
    if (selectedFarmer) {
      updatePermissionsMutation.mutate({
        farmerId: selectedFarmer.id,
        permissions: features
      });
    }
  };

  // Handle sending the notification
  const handleSendNotification = () => {
    if (selectedFarmer && notificationMessage) {
      sendNotificationMutation.mutate({
        userId: selectedFarmer.id,
        message: notificationMessage,
        type: notificationType
      });
    }
  };

  return (
    <DashboardLayout title="Fermerlar huquqlari boshqaruvi">
      <div className="space-y-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle>Fermerlar ro'yxati</CardTitle>
              <CardDescription>
                Fermerlar uchun huquqlarini boshqarish va xabarlar yuborish
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Fermer qidirish..."
                  className="pl-8 w-64"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Foydalanuvchi</TableHead>
                    <TableHead>Ekin turi</TableHead>
                    <TableHead>Maydon o'lchami</TableHead>
                    <TableHead>Huquqlar</TableHead>
                    <TableHead className="text-right">Amallar</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center">
                        Ma'lumotlar yuklanmoqda...
                      </TableCell>
                    </TableRow>
                  ) : filteredFarmers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center">
                        Fermerlar topilmadi
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredFarmers.map((farmer) => (
                      <TableRow key={farmer.id}>
                        <TableCell>
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                              <UserCog className="h-4 w-4 text-blue-600" />
                            </div>
                            <div>
                              <div className="font-medium">{farmer.firstName} {farmer.lastName}</div>
                              <div className="text-xs text-gray-500">{farmer.username}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {farmer.cropType ? (
                            <Badge variant="outline" className="bg-green-50">
                              {farmer.cropType}
                            </Badge>
                          ) : (
                            <span className="text-gray-400 text-sm">Ko'rsatilmagan</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {farmer.fieldSize ? (
                            <span>{farmer.fieldSize} gektar</span>
                          ) : (
                            <span className="text-gray-400 text-sm">Ko'rsatilmagan</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            {farmer.permissionsStatus === "restricted" ? (
                              <Badge variant="outline" className="bg-red-50 text-red-700 flex items-center">
                                <Lock className="h-3 w-3 mr-1" />
                                Cheklangan
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="bg-green-50 text-green-700 flex items-center">
                                <Unlock className="h-3 w-3 mr-1" />
                                To'liq
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleOpenPermissions(farmer)}
                            >
                              <Settings className="h-4 w-4 mr-2" />
                              Huquqlar
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleOpenNotify(farmer)}
                            >
                              <Bell className="h-4 w-4 mr-2" />
                              Xabar yuborish
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Permissions Dialog */}
      <Dialog open={isPermissionsDialogOpen} onOpenChange={setIsPermissionsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Fermer huquqlarini boshqarish</DialogTitle>
            <DialogDescription>
              {selectedFarmer && `${selectedFarmer.firstName} ${selectedFarmer.lastName} uchun huquqlarni sozlash`}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="flex justify-between items-center mb-4 pb-2 border-b">
              <div className="text-sm font-medium">Barcha huquqlar</div>
              <div className="flex items-center space-x-2">
                <Switch 
                  checked={Object.values(features).every(v => v === true)}
                  onCheckedChange={handleToggleAll}
                />
                <Label>Barchasi</Label>
              </div>
            </div>
            
            <div className="space-y-3">
              {farmerFeatures.map((feature) => (
                <div key={feature.id} className="flex justify-between items-center">
                  <div className="flex items-center">
                    {feature.icon}
                    <div>
                      <div className="text-sm font-medium">{feature.name}</div>
                      <div className="text-xs text-gray-500">{feature.description}</div>
                    </div>
                  </div>
                  <Switch 
                    checked={features[feature.id] || false}
                    onCheckedChange={(checked) => {
                      setFeatures(prev => ({ ...prev, [feature.id]: checked }));
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPermissionsDialogOpen(false)}>
              Bekor qilish
            </Button>
            <Button 
              onClick={handleSavePermissions}
              disabled={updatePermissionsMutation.isPending}
            >
              {updatePermissionsMutation.isPending ? "Saqlanmoqda..." : "Saqlash"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Notification Dialog */}
      <Dialog open={isNotifyDialogOpen} onOpenChange={setIsNotifyDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Bildirishnoma yuborish</DialogTitle>
            <DialogDescription>
              {selectedFarmer && `${selectedFarmer.firstName} ${selectedFarmer.lastName} ga bildirishnoma yuborish`}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="space-y-4">
              <div>
                <Label>Bildirishnoma turi</Label>
                <div className="flex space-x-4 mt-1">
                  <div 
                    className={`
                      flex-1 border rounded-md p-3 cursor-pointer 
                      ${notificationType === 'info' ? 'bg-blue-50 border-blue-200' : ''}
                    `}
                    onClick={() => setNotificationType('info')}
                  >
                    <div className="flex items-center">
                      <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                        <Bell className="h-3 w-3 text-blue-600" />
                      </div>
                      <span className="text-sm font-medium">Ma'lumot</span>
                    </div>
                  </div>
                  <div 
                    className={`
                      flex-1 border rounded-md p-3 cursor-pointer 
                      ${notificationType === 'warning' ? 'bg-amber-50 border-amber-200' : ''}
                    `}
                    onClick={() => setNotificationType('warning')}
                  >
                    <div className="flex items-center">
                      <div className="h-6 w-6 rounded-full bg-amber-100 flex items-center justify-center mr-2">
                        <AlertTriangle className="h-3 w-3 text-amber-600" />
                      </div>
                      <span className="text-sm font-medium">Ogohlantirish</span>
                    </div>
                  </div>
                  <div 
                    className={`
                      flex-1 border rounded-md p-3 cursor-pointer 
                      ${notificationType === 'error' ? 'bg-red-50 border-red-200' : ''}
                    `}
                    onClick={() => setNotificationType('error')}
                  >
                    <div className="flex items-center">
                      <div className="h-6 w-6 rounded-full bg-red-100 flex items-center justify-center mr-2">
                        <AlertTriangle className="h-3 w-3 text-red-600" />
                      </div>
                      <span className="text-sm font-medium">Muhim</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <Label>Xabar matni</Label>
                <Textarea 
                  className="mt-1"
                  placeholder="Bildirishnoma matnini kiriting..."
                  value={notificationMessage}
                  onChange={(e) => setNotificationMessage(e.target.value)}
                  rows={4}
                />
              </div>
            </div>
            
            {notificationType === 'warning' && (
              <Alert className="mt-4 bg-amber-50 text-amber-800 border-amber-200">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Ogohlantirish</AlertTitle>
                <AlertDescription>
                  Bu xabar foydalanuvchi uchun ogohlantirish sifatida ko'rsatiladi.
                </AlertDescription>
              </Alert>
            )}
            
            {notificationType === 'error' && (
              <Alert className="mt-4 bg-red-50 text-red-800 border-red-200">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Muhim</AlertTitle>
                <AlertDescription>
                  Bu xabar foydalanuvchi uchun muhim bildirishnoma sifatida ko'rsatiladi.
                </AlertDescription>
              </Alert>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNotifyDialogOpen(false)}>
              Bekor qilish
            </Button>
            <Button 
              onClick={handleSendNotification}
              disabled={sendNotificationMutation.isPending || !notificationMessage}
            >
              {sendNotificationMutation.isPending ? "Yuborilmoqda..." : "Yuborish"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}

function Droplet(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      {...props}
    >
      <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
    </svg>
  );
}