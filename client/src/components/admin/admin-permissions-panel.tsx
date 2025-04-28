import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  AlertTriangle, 
  Check, 
  Lock, 
  Edit, 
  FileText, 
  Droplet, 
  BarChart2, 
  Database, 
  Settings, 
  Users, 
  ShieldCheck,
  RefreshCw,
  Video,
  GaugeCircle,
  LineChart,
  Map,
  Download
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface PermissionItem {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: React.ReactNode;
  enabled: boolean;
}

interface PermissionCategory {
  id: string;
  name: string;
  description: string;
  permissions: PermissionItem[];
}

export default function AdminPermissionsPanel() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("reservoir");
  
  // Define the base permissions available in the system
  const permissionCategories: PermissionCategory[] = [
    {
      id: "reservoir",
      name: "Suv omborlari",
      description: "Suv omborlari bilan bog'liq huquqlar",
      permissions: [
        {
          id: "reservoir_view",
          name: "Suv omborlarini ko'rish",
          description: "Barcha suv omborlari ma'lumotlarini ko'rish imkoniyati",
          category: "reservoir",
          icon: <Droplet className="h-4 w-4 mr-2" />,
          enabled: true
        },
        {
          id: "reservoir_add",
          name: "Suv ombori qo'shish",
          description: "Yangi suv omborlarini qo'shish imkoniyati",
          category: "reservoir",
          icon: <Edit className="h-4 w-4 mr-2" />,
          enabled: false
        },
        {
          id: "reservoir_edit",
          name: "Suv omborini tahrirlash",
          description: "Mavjud suv omborlarini tahrirlash imkoniyati",
          category: "reservoir",
          icon: <Edit className="h-4 w-4 mr-2" />,
          enabled: false
        },
        {
          id: "reservoir_delete",
          name: "Suv omborini o'chirish",
          description: "Mavjud suv omborlarini o'chirish imkoniyati",
          category: "reservoir",
          icon: <Edit className="h-4 w-4 mr-2" />,
          enabled: false
        },
        {
          id: "reservoir_monitor",
          name: "Suv omborlari monitoringi",
          description: "Suv omborlarining real vaqtdagi monitoringini ko'rish imkoniyati",
          category: "reservoir",
          icon: <GaugeCircle className="h-4 w-4 mr-2" />,
          enabled: false
        },
        {
          id: "reservoir_forecast",
          name: "Suv omborlari bashorati",
          description: "Suv ombori bashoratlarini ko'rish imkoniyati",
          category: "reservoir",
          icon: <LineChart className="h-4 w-4 mr-2" />,
          enabled: false
        }
      ]
    },
    {
      id: "user",
      name: "Foydalanuvchilar",
      description: "Foydalanuvchilar boshqaruvi bilan bog'liq huquqlar",
      permissions: [
        {
          id: "user_view",
          name: "Foydalanuvchilarni ko'rish",
          description: "Barcha foydalanuvchilar ro'yxatini ko'rish imkoniyati",
          category: "user",
          icon: <Users className="h-4 w-4 mr-2" />,
          enabled: true
        },
        {
          id: "user_add",
          name: "Foydalanuvchi qo'shish",
          description: "Tizimga yangi foydalanuvchilar qo'shish imkoniyati",
          category: "user",
          icon: <Users className="h-4 w-4 mr-2" />,
          enabled: true
        },
        {
          id: "user_edit",
          name: "Foydalanuvchini tahrirlash",
          description: "Mavjud foydalanuvchilarni tahrirlash imkoniyati",
          category: "user",
          icon: <Users className="h-4 w-4 mr-2" />,
          enabled: true
        },
        {
          id: "user_delete",
          name: "Foydalanuvchini o'chirish",
          description: "Mavjud foydalanuvchilarni o'chirish imkoniyati",
          category: "user",
          icon: <Users className="h-4 w-4 mr-2" />,
          enabled: true
        },
        {
          id: "user_role_manage",
          name: "Foydalanuvchi rollarini boshqarish",
          description: "Foydalanuvchilar rollarini o'zgartirish imkoniyati",
          category: "user",
          icon: <ShieldCheck className="h-4 w-4 mr-2" />,
          enabled: false
        }
      ]
    },
    {
      id: "data",
      name: "Ma'lumotlar",
      description: "Ma'lumotlar boshqaruvi bilan bog'liq huquqlar",
      permissions: [
        {
          id: "data_view",
          name: "Ma'lumotlarni ko'rish",
          description: "Barcha ma'lumotlarni ko'rish imkoniyati",
          category: "data",
          icon: <Database className="h-4 w-4 mr-2" />,
          enabled: true
        },
        {
          id: "data_export",
          name: "Ma'lumotlarni eksport qilish",
          description: "Tizimdagi ma'lumotlarni eksport qilish imkoniyati",
          category: "data",
          icon: <Download className="h-4 w-4 mr-2" />,
          enabled: true
        },
        {
          id: "data_algorithm_view",
          name: "Algoritmlarni ko'rish",
          description: "Tizim algoritmlarini ko'rish imkoniyati",
          category: "data",
          icon: <FileText className="h-4 w-4 mr-2" />,
          enabled: false
        },
        {
          id: "data_database_view",
          name: "Ma'lumotlar bazasini ko'rish",
          description: "Ma'lumotlar bazasi tuzilishini ko'rish imkoniyati",
          category: "data",
          icon: <Database className="h-4 w-4 mr-2" />,
          enabled: false
        }
      ]
    },
    {
      id: "report",
      name: "Hisobotlar",
      description: "Hisobotlar bilan bog'liq huquqlar",
      permissions: [
        {
          id: "report_view",
          name: "Hisobotlarni ko'rish",
          description: "Barcha hisobotlarni ko'rish imkoniyati",
          category: "report",
          icon: <BarChart2 className="h-4 w-4 mr-2" />,
          enabled: true
        },
        {
          id: "report_download",
          name: "Hisobotlarni yuklab olish",
          description: "Hisobotlarni yuklab olish imkoniyati",
          category: "report",
          icon: <Download className="h-4 w-4 mr-2" />,
          enabled: true
        }
      ]
    },
    {
      id: "video",
      name: "Video nazorat",
      description: "Video nazorat tizimi bilan bog'liq huquqlar",
      permissions: [
        {
          id: "video_view",
          name: "Video nazoratni ko'rish",
          description: "Video nazorat tizimini ko'rish imkoniyati",
          category: "video",
          icon: <Video className="h-4 w-4 mr-2" />,
          enabled: true
        },
        {
          id: "video_config",
          name: "Video nazoratni sozlash",
          description: "Video nazorat tizimini sozlash imkoniyati",
          category: "video",
          icon: <Settings className="h-4 w-4 mr-2" />,
          enabled: true
        }
      ]
    },
    {
      id: "system",
      name: "Tizim boshqaruvi",
      description: "Tizim boshqaruvi bilan bog'liq huquqlar",
      permissions: [
        {
          id: "system_view",
          name: "Tizim ma'lumotlarini ko'rish",
          description: "Tizim ma'lumotlarini ko'rish imkoniyati",
          category: "system",
          icon: <Settings className="h-4 w-4 mr-2" />,
          enabled: false
        },
        {
          id: "system_settings",
          name: "Tizim sozlamalarini o'zgartirish",
          description: "Tizim sozlamalarini o'zgartirish imkoniyati",
          category: "system",
          icon: <Settings className="h-4 w-4 mr-2" />,
          enabled: false
        },
        {
          id: "system_backup",
          name: "Tizim zaxira nusxalash",
          description: "Tizim ma'lumotlarini zaxiralash imkoniyati",
          category: "system",
          icon: <RefreshCw className="h-4 w-4 mr-2" />,
          enabled: false
        }
      ]
    }
  ];

  // Find current tab permissions
  const getCurrentTabPermissions = () => {
    return permissionCategories.find(category => category.id === activeTab);
  };

  // Toggle permission status
  const togglePermission = (permissionId: string) => {
    // In a real app, this would update the database
    toast({
      title: "Huquq o'zgartirildi",
      description: "Foydalanuvchi huquqlari yangilandi",
    });
  };

  // Save permissions
  const savePermissions = () => {
    toast({
      title: "Huquqlar saqlandi",
      description: "Admin foydalanuvchilari uchun huquqlar muvaffaqiyatli saqlandi",
    });
  };

  const currentCategory = getCurrentTabPermissions();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Admin uchun huquqlar boshqaruvi</CardTitle>
          <CardDescription>
            Oddiy admin foydalanuvchilari uchun belgilangan huquqlarni boshqarish
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Alert className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Muhim ma'lumot</AlertTitle>
            <AlertDescription>
              Bu yerda belgilangan huquqlar oddiy admin rollarini belgilaydi. Super admin foydalanuvchilari avtomatik ravishda barcha huquqlarga ega bo'ladi.
            </AlertDescription>
          </Alert>

          <Tabs defaultValue="reservoir" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid grid-cols-3 md:grid-cols-6 gap-2">
              <TabsTrigger value="reservoir">Suv omborlari</TabsTrigger>
              <TabsTrigger value="user">Foydalanuvchilar</TabsTrigger>
              <TabsTrigger value="data">Ma'lumotlar</TabsTrigger>
              <TabsTrigger value="report">Hisobotlar</TabsTrigger>
              <TabsTrigger value="video">Video nazorat</TabsTrigger>
              <TabsTrigger value="system">Tizim boshqaruvi</TabsTrigger>
            </TabsList>

            {permissionCategories.map((category) => (
              <TabsContent key={category.id} value={category.id} className="space-y-4">
                <h3 className="text-lg font-medium">{category.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">{category.description}</p>

                <div className="space-y-4">
                  {category.permissions.map((permission) => (
                    <div key={permission.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center">
                        {permission.icon}
                        <div>
                          <h4 className="text-sm font-medium">{permission.name}</h4>
                          <p className="text-xs text-muted-foreground">{permission.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id={permission.id}
                          checked={permission.enabled}
                          onCheckedChange={() => togglePermission(permission.id)}
                        />
                        <Label htmlFor={permission.id} className="sr-only">
                          {permission.name}
                        </Label>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>

          <div className="mt-6 flex justify-end space-x-4">
            <Button variant="outline">Bekor qilish</Button>
            <Button onClick={savePermissions}>
              <Check className="h-4 w-4 mr-2" />
              Saqlash
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}