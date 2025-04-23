import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCaption,
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
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
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
  Checkbox
} from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";
import Layout from "@/components/layout";

// Define the user type
interface User {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  role: string;
  fieldSize?: string;
  cropType?: string;
}

// Define permissions interface
interface Permissions {
  water_requests: boolean;
  map_access: boolean;
  reports: boolean;
  water_allocation: boolean;
  messaging: boolean;
  settings: boolean;
}

const defaultPermissions: Permissions = {
  water_requests: true,
  map_access: true,
  reports: true,
  water_allocation: true,
  messaging: true,
  settings: true
};

export default function FarmerManagement() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedFarmer, setSelectedFarmer] = useState<User | null>(null);
  const [permissions, setPermissions] = useState<Permissions>(defaultPermissions);
  const [isPermissionsDialogOpen, setIsPermissionsDialogOpen] = useState(false);

  // Get users
  const { data: users = [], isLoading } = useQuery<User[]>({
    queryKey: ['/api/users'],
  });

  // Get permissions for the selected farmer
  const getPermissions = async (farmerId: number) => {
    const response = await fetch(`/api/farmer-permissions/${farmerId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch permissions');
    }
    return response.json();
  };

  // Update permissions
  const updatePermissions = async (farmerId: number, permissions: Permissions) => {
    const response = await fetch(`/api/farmer-permissions/${farmerId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(permissions),
    });
    if (!response.ok) {
      throw new Error('Failed to update permissions');
    }
    return response.json();
  };

  // Permission query
  const permissionsQuery = useQuery({
    queryKey: ['/api/farmer-permissions', selectedFarmer?.id],
    queryFn: () => getPermissions(selectedFarmer?.id as number),
    enabled: !!selectedFarmer?.id && isPermissionsDialogOpen,
    onSuccess: (data) => {
      setPermissions(data);
    },
  });

  // Update permissions mutation
  const updatePermissionsMutation = useMutation({
    mutationFn: (permissions: Permissions) => 
      updatePermissions(selectedFarmer?.id as number, permissions),
    onSuccess: () => {
      toast({
        title: t("Permissions updated"),
        description: t("The farmer's permissions have been updated successfully."),
      });
      setIsPermissionsDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ['/api/farmer-permissions', selectedFarmer?.id] });
    },
    onError: (error) => {
      toast({
        title: t("Error"),
        description: (error as Error).message || t("Failed to update permissions"),
        variant: "destructive",
      });
    },
  });

  // Filter for farmers only
  const farmers = users.filter(user => user.role === 'farmer');

  // Handle permission dialog
  const handlePermissionClick = (farmer: User) => {
    setSelectedFarmer(farmer);
    setIsPermissionsDialogOpen(true);
  };

  // Handle permission change
  const handlePermissionChange = (permission: keyof Permissions) => {
    setPermissions(prev => ({
      ...prev,
      [permission]: !prev[permission]
    }));
  };

  // Handle save permissions
  const handleSavePermissions = () => {
    updatePermissionsMutation.mutate(permissions);
  };

  // New farmer form schema
  const formSchema = z.object({
    username: z.string().min(3, {
      message: t("Username must be at least 3 characters.")
    }),
    password: z.string().min(6, {
      message: t("Password must be at least 6 characters.")
    }),
    firstName: z.string().min(1, {
      message: t("First name is required.")
    }),
    lastName: z.string().min(1, {
      message: t("Last name is required.")
    }),
    cropType: z.string().optional(),
    fieldSize: z.string().optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
      firstName: "",
      lastName: "",
      cropType: "",
      fieldSize: "",
    },
  });

  // Create user mutation
  const createUserMutation = useMutation({
    mutationFn: async (userData: z.infer<typeof formSchema>) => {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...userData,
          role: "farmer",
          fieldSize: userData.fieldSize ? parseFloat(userData.fieldSize) : undefined,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create user");
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: t("Farmer created"),
        description: t("The farmer has been created successfully."),
      });
      form.reset();
      queryClient.invalidateQueries({ queryKey: ['/api/users'] });
    },
    onError: (error) => {
      toast({
        title: t("Error"),
        description: (error as Error).message || t("Failed to create farmer"),
        variant: "destructive",
      });
    },
  });

  // Handle form submission
  const onSubmit = (data: z.infer<typeof formSchema>) => {
    createUserMutation.mutate(data);
  };

  // Delete user mutation
  const deleteUserMutation = useMutation({
    mutationFn: async (userId: number) => {
      const response = await fetch(`/api/users/${userId}`, {
        method: "DELETE",
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete user");
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: t("Farmer deleted"),
        description: t("The farmer has been deleted successfully."),
      });
      queryClient.invalidateQueries({ queryKey: ['/api/users'] });
    },
    onError: (error) => {
      toast({
        title: t("Error"),
        description: (error as Error).message || t("Failed to delete farmer"),
        variant: "destructive",
      });
    },
  });

  return (
    <Layout>
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">{t("Farmer Management")}</h1>
        
        <Tabs defaultValue="farmers">
          <TabsList className="mb-6">
            <TabsTrigger value="farmers">{t("Farmers")}</TabsTrigger>
            <TabsTrigger value="add">{t("Add Farmer")}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="farmers">
            <Card>
              <CardHeader>
                <CardTitle>{t("Farmers List")}</CardTitle>
                <CardDescription>
                  {t("View, manage permissions, and delete farmers.")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center p-10">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                  </div>
                ) : farmers.length === 0 ? (
                  <div className="text-center p-6 text-gray-500">
                    {t("No farmers found.")}
                  </div>
                ) : (
                  <Table>
                    <TableCaption>{t("List of all farmers in the system.")}</TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[100px]">ID</TableHead>
                        <TableHead>{t("Name")}</TableHead>
                        <TableHead>{t("Username")}</TableHead>
                        <TableHead>{t("Crop Type")}</TableHead>
                        <TableHead>{t("Field Size")}</TableHead>
                        <TableHead className="text-right">{t("Actions")}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {farmers.map((farmer) => (
                        <TableRow key={farmer.id}>
                          <TableCell className="font-medium">{farmer.id}</TableCell>
                          <TableCell>{`${farmer.firstName} ${farmer.lastName}`}</TableCell>
                          <TableCell>{farmer.username}</TableCell>
                          <TableCell>{farmer.cropType || "-"}</TableCell>
                          <TableCell>{farmer.fieldSize ? `${farmer.fieldSize} ha` : "-"}</TableCell>
                          <TableCell className="text-right space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handlePermissionClick(farmer)}
                            >
                              {t("Permissions")}
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => deleteUserMutation.mutate(farmer.id)}
                            >
                              {t("Delete")}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="add">
            <Card>
              <CardHeader>
                <CardTitle>{t("Add New Farmer")}</CardTitle>
                <CardDescription>
                  {t("Fill out the form to add a new farmer to the system.")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("First Name")}</FormLabel>
                            <FormControl>
                              <Input placeholder={t("First Name")} {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("Last Name")}</FormLabel>
                            <FormControl>
                              <Input placeholder={t("Last Name")} {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("Username")}</FormLabel>
                            <FormControl>
                              <Input placeholder={t("Username")} {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("Password")}</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder={t("Password")} {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="cropType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("Crop Type")}</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder={t("Select crop type")} />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="cotton">{t("Cotton")}</SelectItem>
                                <SelectItem value="wheat">{t("Wheat")}</SelectItem>
                                <SelectItem value="rice">{t("Rice")}</SelectItem>
                                <SelectItem value="corn">{t("Corn")}</SelectItem>
                                <SelectItem value="vegetables">{t("Vegetables")}</SelectItem>
                                <SelectItem value="fruits">{t("Fruits")}</SelectItem>
                                <SelectItem value="other">{t("Other")}</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="fieldSize"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("Field Size (ha)")}</FormLabel>
                            <FormControl>
                              <Input type="number" placeholder="0" {...field} />
                            </FormControl>
                            <FormDescription>
                              {t("Field size in hectares")}
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <Button type="submit" disabled={createUserMutation.isPending}>
                      {createUserMutation.isPending ? (
                        <>
                          <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-b-transparent"></span>
                          {t("Creating...")}
                        </>
                      ) : (
                        t("Create Farmer")
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        {/* Permissions Dialog */}
        <Dialog open={isPermissionsDialogOpen} onOpenChange={setIsPermissionsDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {t("Manage Permissions: {{name}}", {
                  name: selectedFarmer ? `${selectedFarmer.firstName} ${selectedFarmer.lastName}` : ""
                })}
              </DialogTitle>
              <DialogDescription>
                {t("Control what features this farmer can access.")}
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              {permissionsQuery.isLoading ? (
                <div className="flex justify-center p-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="water_requests" 
                      checked={permissions.water_requests}
                      onCheckedChange={() => handlePermissionChange('water_requests')}
                    />
                    <Label htmlFor="water_requests">{t("Water Requests")}</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="map_access" 
                      checked={permissions.map_access}
                      onCheckedChange={() => handlePermissionChange('map_access')}
                    />
                    <Label htmlFor="map_access">{t("Map Access")}</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="reports" 
                      checked={permissions.reports}
                      onCheckedChange={() => handlePermissionChange('reports')}
                    />
                    <Label htmlFor="reports">{t("Reports")}</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="water_allocation" 
                      checked={permissions.water_allocation}
                      onCheckedChange={() => handlePermissionChange('water_allocation')}
                    />
                    <Label htmlFor="water_allocation">{t("Water Allocation")}</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="messaging" 
                      checked={permissions.messaging}
                      onCheckedChange={() => handlePermissionChange('messaging')}
                    />
                    <Label htmlFor="messaging">{t("Messaging")}</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="settings" 
                      checked={permissions.settings}
                      onCheckedChange={() => handlePermissionChange('settings')}
                    />
                    <Label htmlFor="settings">{t("Settings")}</Label>
                  </div>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setIsPermissionsDialogOpen(false)}
              >
                {t("Cancel")}
              </Button>
              <Button 
                onClick={handleSavePermissions}
                disabled={updatePermissionsMutation.isPending}
              >
                {updatePermissionsMutation.isPending ? (
                  <>
                    <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-b-transparent"></span>
                    {t("Saving...")}
                  </>
                ) : (
                  t("Save Changes")
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}