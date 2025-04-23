import React, { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  AlertTriangle, 
  Bell, 
  Info, 
  Send, 
  Users, 
  CheckCircle, 
  Filter,
  UserCircle,
  UserCog
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

export default function SendNotifications() {
  const { toast } = useToast();
  const [notificationType, setNotificationType] = useState<"info" | "warning" | "error">("info");
  const [notificationTitle, setNotificationTitle] = useState("");
  const [notificationMessage, setNotificationMessage] = useState("");
  const [recipientType, setRecipientType] = useState<"all" | "farmers" | "admins" | "selected">("all");
  const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [previewVisible, setPreviewVisible] = useState(false);

  // Query to fetch all users
  const { data: users = [], isLoading } = useQuery<any[]>({
    queryKey: ["/api/users"],
  });

  // Filter users based on search query
  const filteredUsers = users.filter((user) => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      user.username.toLowerCase().includes(query) ||
      user.firstName.toLowerCase().includes(query) ||
      user.lastName.toLowerCase().includes(query) ||
      user.role.toLowerCase().includes(query)
    );
  });

  // Get selectable users based on recipient type
  const selectableUsers = filteredUsers.filter(user => {
    if (recipientType === "all") return true;
    if (recipientType === "farmers") return user.role === "farmer";
    if (recipientType === "admins") return user.role === "admin" || user.role === "data_admin";
    return true;
  });

  // Get count of recipients
  const getRecipientCount = () => {
    if (recipientType === "selected") return selectedUserIds.length;
    if (recipientType === "farmers") return users.filter(user => user.role === "farmer").length;
    if (recipientType === "admins") return users.filter(user => user.role === "admin" || user.role === "data_admin").length;
    return users.length;
  };

  // Determine if form is valid
  const isFormValid = () => {
    if (!notificationTitle.trim() || !notificationMessage.trim()) return false;
    if (recipientType === "selected" && selectedUserIds.length === 0) return false;
    return true;
  };

  // Toggle user selection
  const toggleUserSelection = (userId: number) => {
    setSelectedUserIds(prev => 
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  // Handle selecting all filtered users
  const handleSelectAll = () => {
    setSelectedUserIds(selectableUsers.map(user => user.id));
  };

  // Handle clearing all selections
  const handleClearSelection = () => {
    setSelectedUserIds([]);
  };

  // Mutation to send notifications
  const sendNotificationMutation = useMutation({
    mutationFn: async (data: {
      recipients: "all" | "farmers" | "admins" | number[],
      title: string,
      message: string,
      type: string
    }) => {
      const response = await apiRequest(
        "POST",
        "/api/notifications/bulk",
        data
      );
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Bildirishnomalar yuborildi",
        description: `${getRecipientCount()} ta foydalanuvchiga bildirishnomalar muvaffaqiyatli yuborildi`,
      });
      // Reset form
      setNotificationTitle("");
      setNotificationMessage("");
      setRecipientType("all");
      setSelectedUserIds([]);
      setPreviewVisible(false);
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Xato",
        description: error.message || "Bildirishnomalarni yuborishda xatolik yuz berdi",
      });
    }
  });

  // Handle sending notifications
  const handleSendNotifications = () => {
    if (!isFormValid()) return;

    let recipients: "all" | "farmers" | "admins" | number[] = "all";
    
    if (recipientType === "selected") {
      recipients = selectedUserIds;
    } else {
      recipients = recipientType;
    }

    sendNotificationMutation.mutate({
      recipients,
      title: notificationTitle,
      message: notificationMessage,
      type: notificationType
    });
  };

  return (
    <DashboardLayout title="Bildirishnomalar yuborish">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Compose Notification */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Yangi bildirishnoma</CardTitle>
              <CardDescription>
                Foydalanuvchilarga bildirishnoma yuborish uchun ma'lumotlarni kiriting
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="compose" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="compose">
                    <Send className="h-4 w-4 mr-2" />
                    Tuzish
                  </TabsTrigger>
                  <TabsTrigger value="recipients">
                    <Users className="h-4 w-4 mr-2" />
                    Oluvchilar
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="compose" className="space-y-4">
                  <div>
                    <Label>Bildirishnoma turi</Label>
                    <RadioGroup 
                      defaultValue="info" 
                      className="flex space-x-4 mt-2"
                      value={notificationType}
                      onValueChange={(value) => setNotificationType(value as any)}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="info" id="info" />
                        <Label 
                          htmlFor="info"
                          className="flex items-center cursor-pointer text-blue-700"
                        >
                          <Info className="h-4 w-4 mr-1" />
                          Ma'lumot
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="warning" id="warning" />
                        <Label 
                          htmlFor="warning"
                          className="flex items-center cursor-pointer text-amber-700"
                        >
                          <AlertTriangle className="h-4 w-4 mr-1" />
                          Ogohlantirish
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="error" id="error" />
                        <Label 
                          htmlFor="error"
                          className="flex items-center cursor-pointer text-red-700"
                        >
                          <AlertTriangle className="h-4 w-4 mr-1" />
                          Muhim
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="title">Bildirishnoma sarlavhasi</Label>
                      <Input 
                        id="title" 
                        placeholder="Sarlavhani kiriting..."
                        value={notificationTitle}
                        onChange={(e) => setNotificationTitle(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="message">Bildirishnoma matni</Label>
                      <Textarea 
                        id="message" 
                        placeholder="Bildirishnoma matnini kiriting..."
                        value={notificationMessage}
                        onChange={(e) => setNotificationMessage(e.target.value)}
                        rows={6}
                        className="mt-1"
                      />
                    </div>

                    <div className="pt-2">
                      <Button 
                        type="button"
                        variant="outline"
                        onClick={() => setPreviewVisible(!previewVisible)}
                      >
                        {previewVisible ? "Ko'rinishni yashirish" : "Ko'rinishni ko'rish"}
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="recipients" className="space-y-4">
                  <div>
                    <Label>Qabul qiluvchilar</Label>
                    <RadioGroup 
                      defaultValue="all" 
                      className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2"
                      value={recipientType}
                      onValueChange={(value) => setRecipientType(value as any)}
                    >
                      <div className="flex items-center space-x-2 p-2 border rounded-md">
                        <RadioGroupItem value="all" id="all" />
                        <Label htmlFor="all" className="cursor-pointer flex items-center">
                          <Users className="h-4 w-4 mr-2 text-slate-500" />
                          Barcha foydalanuvchilar
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-2 border rounded-md">
                        <RadioGroupItem value="farmers" id="farmers" />
                        <Label htmlFor="farmers" className="cursor-pointer flex items-center">
                          <UserCircle className="h-4 w-4 mr-2 text-green-500" />
                          Faqat fermerlar
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-2 border rounded-md">
                        <RadioGroupItem value="admins" id="admins" />
                        <Label htmlFor="admins" className="cursor-pointer flex items-center">
                          <UserCog className="h-4 w-4 mr-2 text-blue-500" />
                          Faqat adminlar
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-2 border rounded-md">
                        <RadioGroupItem value="selected" id="selected" />
                        <Label htmlFor="selected" className="cursor-pointer flex items-center">
                          <CheckCircle className="h-4 w-4 mr-2 text-purple-500" />
                          Tanlangan foydalanuvchilar
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {recipientType === "selected" && (
                    <div className="border rounded-md p-4 space-y-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="text-sm font-medium">Foydalanuvchilarni tanlang</h3>
                          <p className="text-xs text-muted-foreground">
                            {selectedUserIds.length} ta foydalanuvchi tanlangan
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={handleClearSelection}
                            disabled={selectedUserIds.length === 0}
                          >
                            Tozalash
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={handleSelectAll}
                            disabled={selectableUsers.length === 0 || selectableUsers.length === selectedUserIds.length}
                          >
                            Barchasini tanlash
                          </Button>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <div className="relative flex-1">
                          <Filter className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder="Foydalanuvchilarni qidirish..."
                            className="pl-8"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                          />
                        </div>
                        <Select>
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Ro'l bo'yicha" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Barcha</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="data_admin">Data admin</SelectItem>
                            <SelectItem value="farmer">Fermer</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="border rounded-md max-h-[300px] overflow-y-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="w-[50px]">Tanlash</TableHead>
                              <TableHead>Foydalanuvchi</TableHead>
                              <TableHead>Rol</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {isLoading ? (
                              <TableRow>
                                <TableCell colSpan={3} className="h-24 text-center">
                                  Ma'lumotlar yuklanmoqda...
                                </TableCell>
                              </TableRow>
                            ) : selectableUsers.length === 0 ? (
                              <TableRow>
                                <TableCell colSpan={3} className="h-24 text-center">
                                  Foydalanuvchilar topilmadi
                                </TableCell>
                              </TableRow>
                            ) : (
                              selectableUsers.map((user) => (
                                <TableRow key={user.id}>
                                  <TableCell>
                                    <Checkbox 
                                      checked={selectedUserIds.includes(user.id)}
                                      onCheckedChange={() => toggleUserSelection(user.id)}
                                    />
                                  </TableCell>
                                  <TableCell>
                                    <div className="flex items-center">
                                      <div>
                                        <div className="font-medium">{user.firstName} {user.lastName}</div>
                                        <div className="text-xs text-muted-foreground">{user.username}</div>
                                      </div>
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    <Badge variant="outline">
                                      {user.role === "admin" && "Admin"}
                                      {user.role === "data_admin" && "Data admin"}
                                      {user.role === "farmer" && "Fermer"}
                                    </Badge>
                                  </TableCell>
                                </TableRow>
                              ))
                            )}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  )}

                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertTitle>Qabul qiluvchilar</AlertTitle>
                    <AlertDescription>
                      Ushbu bildirishnoma {getRecipientCount()} ta foydalanuvchiga yuboriladi
                    </AlertDescription>
                  </Alert>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button 
              size="lg"
              onClick={handleSendNotifications}
              disabled={!isFormValid() || sendNotificationMutation.isPending}
            >
              <Send className="h-4 w-4 mr-2" />
              {sendNotificationMutation.isPending ? "Yuborilmoqda..." : "Bildirishnomani yuborish"}
            </Button>
          </div>
        </div>

        {/* Preview and Templates */}
        <div className="space-y-6">
          {previewVisible && (
            <Card>
              <CardHeader>
                <CardTitle>Bildirishnoma ko'rinishi</CardTitle>
                <CardDescription>
                  Bildirishnoma foydalanuvchilarga quyidagicha ko'rinadi
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div
                  className={`
                    border-l-4 p-4 rounded
                    ${notificationType === 'error' 
                      ? 'bg-red-50 border-red-500' 
                      : notificationType === 'warning'
                        ? 'bg-amber-50 border-amber-500'
                        : 'bg-blue-50 border-blue-500'
                    }
                  `}
                >
                  <div className="flex">
                    <span className={`
                      mr-2
                      ${notificationType === 'error' 
                        ? 'text-red-500' 
                        : notificationType === 'warning'
                          ? 'text-amber-500'
                          : 'text-blue-500'
                      }
                    `}>
                      {notificationType === 'error' && <AlertTriangle className="h-4 w-4" />}
                      {notificationType === 'warning' && <AlertTriangle className="h-4 w-4" />}
                      {notificationType === 'info' && <Info className="h-4 w-4" />}
                    </span>
                    <div>
                      <div className="flex items-center">
                        <p className="text-sm font-medium text-gray-800">
                          {notificationTitle || "Bildirishnoma sarlavhasi"}
                        </p>
                        <Badge variant="secondary" className="ml-2">New</Badge>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {notificationMessage || "Bildirishnoma matni shu yerda ko'rsatiladi"}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">Hozir</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Tayyor andozalar</CardTitle>
              <CardDescription>
                Tez yozish uchun tayyor bildirishnoma andozalari
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div 
                  className="border rounded-md p-3 cursor-pointer hover:bg-gray-50"
                  onClick={() => {
                    setNotificationType("info");
                    setNotificationTitle("Yangi yangilanish o'rnatildi");
                    setNotificationMessage("Tizimda yangi funksionalliklar qo'shildi. Yangiliklar bilan tanishing.");
                  }}
                >
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                      <Info className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium">Yangi yangilanish o'rnatildi</div>
                      <div className="text-xs text-gray-500">Ma'lumot bildirishnomasi</div>
                    </div>
                  </div>
                </div>

                <div 
                  className="border rounded-md p-3 cursor-pointer hover:bg-gray-50"
                  onClick={() => {
                    setNotificationType("warning");
                    setNotificationTitle("Suv sarfiyoti me'yoridan oshdi");
                    setNotificationMessage("Sizning suv sarfiyotingiz ajratilgan me'yorlardan oshib ketdi. Iltimos, sarfiyotni kamaytiring.");
                  }}
                >
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center mr-2">
                      <AlertTriangle className="h-4 w-4 text-amber-600" />
                    </div>
                    <div>
                      <div className="font-medium">Suv sarfiyoti me'yoridan oshdi</div>
                      <div className="text-xs text-gray-500">Ogohlantirish bildirishnomasi</div>
                    </div>
                  </div>
                </div>

                <div 
                  className="border rounded-md p-3 cursor-pointer hover:bg-gray-50"
                  onClick={() => {
                    setNotificationType("error");
                    setNotificationTitle("Suv ta'minoti to'xtatiladi");
                    setNotificationMessage("Texnik sabablarga ko'ra, suv ta'minoti vaqtincha to'xtatiladi. Muammo hal qilinishi bilan xabar beriladi.");
                  }}
                >
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center mr-2">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                    </div>
                    <div>
                      <div className="font-medium">Suv ta'minoti to'xtatiladi</div>
                      <div className="text-xs text-gray-500">Muhim bildirishnoma</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}