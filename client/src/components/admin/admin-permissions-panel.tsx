import React, { useState, useEffect } from "react";
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
  Download,
  Loader2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";

interface Permission {
  id: number;
  name: string;
  code: string;
  description: string;
  category: string;
  createdAt: string;
}

interface Role {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

interface RolePermission {
  id: number;
  roleId: number;
  permissionId: number;
  createdAt: string;
}

interface PermissionItem {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: React.ReactNode;
  enabled: boolean;
  permissionId?: number;
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
  const [localPermissions, setLocalPermissions] = useState<PermissionCategory[]>([]);
  const [permissionsChanged, setPermissionsChanged] = useState(false);
  const [selectedRole, setSelectedRole] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch roles
  const { data: roles = [] } = useQuery<Role[]>({
    queryKey: ["/api/roles"],
  });
  
  // Fetch permissions
  const { data: permissions = [] } = useQuery<Permission[]>({
    queryKey: ["/api/permissions"],
  });
  
  // Fetch role-permissions mapping
  const { data: rolePermissions = [] } = useQuery<RolePermission[]>({
    queryKey: ["/api/role-permissions"],
  });
  
  // Icons mapping for permissions
  const getIconForCategory = (category: string) => {
    const icons: Record<string, React.ReactNode> = {
      "reservoir": <Droplet className="h-4 w-4 mr-2" />,
      "user": <Users className="h-4 w-4 mr-2" />,
      "data": <Database className="h-4 w-4 mr-2" />,
      "report": <BarChart2 className="h-4 w-4 mr-2" />,
      "video": <Video className="h-4 w-4 mr-2" />,
      "system": <Settings className="h-4 w-4 mr-2" />,
      "monitoring": <LineChart className="h-4 w-4 mr-2" />,
      "export": <Download className="h-4 w-4 mr-2" />,
      "settings": <Settings className="h-4 w-4 mr-2" />,
      "algorithm": <FileText className="h-4 w-4 mr-2" />,
    };
    
    return icons[category] || <Lock className="h-4 w-4 mr-2" />;
  };
  
  // Initialize with server data
  useEffect(() => {
    if (permissions.length > 0) {
      // Set default role (admin) if available
      if (roles.length > 0 && !selectedRole) {
        const adminRole = roles.find(r => r.name === "admin");
        if (adminRole) {
          setSelectedRole(adminRole.id);
        } else if (roles[0]) {
          setSelectedRole(roles[0].id);
        }
      }
      
      // Group permissions by category
      const groupedPermissions: Record<string, PermissionItem[]> = {};
      
      permissions.forEach(permission => {
        const category = permission.category || "other";
        
        if (!groupedPermissions[category]) {
          groupedPermissions[category] = [];
        }
        
        // Check if this permission is enabled for the selected role
        const isEnabled = selectedRole
          ? rolePermissions.some(rp => 
              rp.roleId === selectedRole && 
              rp.permissionId === permission.id
            )
          : false;
        
        groupedPermissions[category].push({
          id: permission.code,
          name: permission.name,
          description: permission.description,
          category: permission.category,
          icon: getIconForCategory(permission.category),
          enabled: isEnabled,
          permissionId: permission.id
        });
      });
      
      // Convert to the expected format
      const permissionCategoriesFromServer: PermissionCategory[] = Object.keys(groupedPermissions).map(categoryId => ({
        id: categoryId,
        name: categoryNameMapping[categoryId] || categoryId.charAt(0).toUpperCase() + categoryId.slice(1),
        description: categoryDescriptionMapping[categoryId] || `${categoryId} bilan bog'liq huquqlar`,
        permissions: groupedPermissions[categoryId]
      }));
      
      setLocalPermissions(permissionCategoriesFromServer);
      setIsLoading(false);
    }
  }, [permissions, rolePermissions, selectedRole, roles]);
  
  // Category name mappings
  const categoryNameMapping: Record<string, string> = {
    "reservoir": "Suv omborlari",
    "user": "Foydalanuvchilar",
    "data": "Ma'lumotlar",
    "report": "Hisobotlar",
    "video": "Video nazorat",
    "system": "Tizim boshqaruvi",
  };
  
  // Category description mappings
  const categoryDescriptionMapping: Record<string, string> = {
    "reservoir": "Suv omborlari bilan bog'liq huquqlar",
    "user": "Foydalanuvchilar boshqaruvi bilan bog'liq huquqlar",
    "data": "Ma'lumotlar boshqaruvi bilan bog'liq huquqlar",
    "report": "Hisobotlar bilan bog'liq huquqlar",
    "video": "Video nazorat tizimi bilan bog'liq huquqlar",
    "system": "Tizim boshqaruvi bilan bog'liq huquqlar",
  };
  
  // Define the base permissions available in the system (fallback if server data is not available)
  const basePermissionCategories: PermissionCategory[] = [
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

  // Add role-permission mutation
  const addRolePermissionMutation = useMutation({
    mutationFn: async (data: { roleId: number, permissionId: number }) => {
      const response = await apiRequest("POST", "/api/role-permissions", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/role-permissions"] });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Xatolik yuz berdi",
        description: error.message || "Huquqlar qo'shilmadi",
      });
    }
  });
  
  // Remove role-permission mutation
  const removeRolePermissionMutation = useMutation({
    mutationFn: async (rolePermissionId: number) => {
      const response = await apiRequest("DELETE", `/api/role-permissions/${rolePermissionId}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/role-permissions"] });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Xatolik yuz berdi",
        description: error.message || "Huquq o'chirilmadi",
      });
    }
  });

  // Toggle permission status
  const togglePermission = (permissionId: string, category: string) => {
    if (!selectedRole) return;
    
    // Find the permission in our local state
    const updatedPermissions = [...localPermissions];
    const categoryIndex = updatedPermissions.findIndex(c => c.id === category);
    
    if (categoryIndex === -1) return;
    
    const permissionIndex = updatedPermissions[categoryIndex].permissions.findIndex(p => p.id === permissionId);
    
    if (permissionIndex === -1) return;
    
    const permission = updatedPermissions[categoryIndex].permissions[permissionIndex];
    const newEnabledState = !permission.enabled;
    
    // Update local state
    updatedPermissions[categoryIndex].permissions[permissionIndex] = {
      ...permission,
      enabled: newEnabledState
    };
    
    setLocalPermissions(updatedPermissions);
    setPermissionsChanged(true);
    
    // If we have the permissionId from the server, update the database
    if (permission.permissionId) {
      if (newEnabledState) {
        // Add permission to role
        addRolePermissionMutation.mutate({
          roleId: selectedRole,
          permissionId: permission.permissionId
        });
      } else {
        // Find the role-permission mapping
        const rolePermission = rolePermissions.find(
          rp => rp.roleId === selectedRole && rp.permissionId === permission.permissionId
        );
        
        if (rolePermission) {
          // Remove permission from role
          removeRolePermissionMutation.mutate(rolePermission.id);
        }
      }
    }
  };

  // Save all permissions
  const savePermissions = () => {
    if (!selectedRole) return;
    
    toast({
      title: "Huquqlar saqlandi",
      description: "Admin foydalanuvchilari uchun huquqlar muvaffaqiyatli saqlandi",
    });
    
    setPermissionsChanged(false);
  };
  
  // Handle role change
  const handleRoleChange = (roleId: number) => {
    setSelectedRole(roleId);
  };

  // Find current tab permissions
  const getCurrentTabPermissions = () => {
    return localPermissions.find(category => category.id === activeTab);
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

            {isLoading ? (
              <div className="flex items-center justify-center py-10">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              localPermissions.map((category) => (
                <TabsContent key={category.id} value={category.id} className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-medium">{category.name}</h3>
                      <p className="text-sm text-muted-foreground mb-4">{category.description}</p>
                    </div>
                    
                    {/* Role selector */}
                    <div className="flex items-center space-x-2">
                      <label htmlFor="role-select" className="text-sm">Rol: </label>
                      <select 
                        id="role-select"
                        className="p-2 border rounded-md" 
                        value={selectedRole || ''}
                        onChange={(e) => handleRoleChange(Number(e.target.value))}
                      >
                        {roles.map(role => (
                          role.name !== 'super_admin' && (
                            <option key={role.id} value={role.id}>
                              {role.name}
                            </option>
                          )
                        ))}
                      </select>
                    </div>
                  </div>

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
                            onCheckedChange={() => togglePermission(permission.id, category.id)}
                            disabled={addRolePermissionMutation.isPending || removeRolePermissionMutation.isPending}
                          />
                          <Label htmlFor={permission.id} className="sr-only">
                            {permission.name}
                          </Label>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              ))
            )}
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