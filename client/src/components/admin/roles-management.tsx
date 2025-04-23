import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation } from "@tanstack/react-query";
import { insertRoleSchema, type Role, type Permission } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Loader2, Shield, Plus } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useTranslation } from "react-i18next";

// Extended schema with additional validations
const createRoleSchema = z.object({
  name: z.string().min(3, {
    message: "Role name must be at least 3 characters",
  }),
  description: z.string(),
  permissions: z.array(z.number()),
});

type CreateRoleFormValues = z.infer<typeof createRoleSchema>;

export default function RolesManagement() {
  const { t } = useTranslation();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { user: currentUser } = useAuth();
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [rolePermissions, setRolePermissions] = useState<{[key: number]: number[]}>({});
  
  // Fetch roles
  const { data: roles, isLoading: isLoadingRoles } = useQuery<Role[]>({
    queryKey: ["/api/roles"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/roles");
      if (!response.ok) {
        throw new Error(`Error fetching roles: ${response.statusText}`);
      }
      return response.json();
    },
  });

  // Fetch permissions
  const { data: permissions, isLoading: isLoadingPermissions } = useQuery<Permission[]>({
    queryKey: ["/api/permissions"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/permissions");
      if (!response.ok) {
        throw new Error(`Error fetching permissions: ${response.statusText}`);
      }
      return response.json();
    },
  });

  // Fetch role permissions
  const { data: rolePermissionsData, isLoading: isLoadingRolePermissions } = useQuery({
    queryKey: ["/api/role-permissions"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/role-permissions");
      if (!response.ok) {
        throw new Error(`Error fetching role permissions: ${response.statusText}`);
      }
      return response.json();
    },
    onSuccess: (data) => {
      // Organize by roleId
      const permsById: {[key: number]: number[]} = {};
      data.forEach((rp: any) => {
        if (!permsById[rp.roleId]) {
          permsById[rp.roleId] = [];
        }
        permsById[rp.roleId].push(rp.permissionId);
      });
      setRolePermissions(permsById);
    }
  });

  // Create role form
  const form = useForm<CreateRoleFormValues>({
    resolver: zodResolver(createRoleSchema),
    defaultValues: {
      name: "",
      description: "",
      permissions: [],
    },
  });

  // Reset form when dialog is opened
  useEffect(() => {
    if (isCreateDialogOpen) {
      form.reset({
        name: "",
        description: "",
        permissions: [],
      });
    }
  }, [isCreateDialogOpen, form]);

  // Update form when a role is selected for editing
  useEffect(() => {
    if (selectedRole && rolePermissions[selectedRole.id]) {
      form.reset({
        name: selectedRole.name,
        description: selectedRole.description || "",
        permissions: rolePermissions[selectedRole.id] || [],
      });
      setIsCreateDialogOpen(true);
    }
  }, [selectedRole, rolePermissions, form]);

  // Create role mutation
  const createRoleMutation = useMutation({
    mutationFn: async (values: CreateRoleFormValues) => {
      const roleData = {
        name: values.name,
        description: values.description,
      };
      
      const response = await apiRequest("POST", "/api/roles", roleData);
      if (!response.ok) {
        throw new Error(`Error creating role: ${response.statusText}`);
      }
      
      const newRole = await response.json();
      
      // Now assign permissions to the role
      if (values.permissions.length > 0) {
        const permissionPromises = values.permissions.map(permId => 
          apiRequest("POST", "/api/role-permissions", {
            roleId: newRole.id,
            permissionId: permId,
          })
        );
        
        await Promise.all(permissionPromises);
      }
      
      return newRole;
    },
    onSuccess: () => {
      toast({
        title: t("Role created successfully"),
        description: t("The role has been added to the system"),
      });
      setIsCreateDialogOpen(false);
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/roles"] });
      queryClient.invalidateQueries({ queryKey: ["/api/role-permissions"] });
    },
    onError: (error: Error) => {
      toast({
        title: t("Failed to create role"),
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Update role mutation
  const updateRoleMutation = useMutation({
    mutationFn: async (values: CreateRoleFormValues & { id: number }) => {
      const { id, permissions, ...roleData } = values;
      
      // Update role details
      const response = await apiRequest("PATCH", `/api/roles/${id}`, roleData);
      if (!response.ok) {
        throw new Error(`Error updating role: ${response.statusText}`);
      }
      
      // Delete existing permissions
      const deleteResponse = await apiRequest("DELETE", `/api/role-permissions/${id}`);
      if (!deleteResponse.ok) {
        throw new Error(`Error removing existing permissions: ${deleteResponse.statusText}`);
      }
      
      // Add new permissions
      if (permissions.length > 0) {
        const permissionPromises = permissions.map(permId => 
          apiRequest("POST", "/api/role-permissions", {
            roleId: id,
            permissionId: permId,
          })
        );
        
        await Promise.all(permissionPromises);
      }
      
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: t("Role updated successfully"),
        description: t("The role has been updated"),
      });
      setIsCreateDialogOpen(false);
      setSelectedRole(null);
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/roles"] });
      queryClient.invalidateQueries({ queryKey: ["/api/role-permissions"] });
    },
    onError: (error: Error) => {
      toast({
        title: t("Failed to update role"),
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Delete role mutation
  const deleteRoleMutation = useMutation({
    mutationFn: async (roleId: number) => {
      const response = await apiRequest("DELETE", `/api/roles/${roleId}`);
      if (!response.ok) {
        throw new Error(`Error deleting role: ${response.statusText}`);
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: t("Role deleted successfully"),
        description: t("The role has been removed from the system"),
      });
      queryClient.invalidateQueries({ queryKey: ["/api/roles"] });
      queryClient.invalidateQueries({ queryKey: ["/api/role-permissions"] });
    },
    onError: (error: Error) => {
      toast({
        title: t("Failed to delete role"),
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (values: CreateRoleFormValues) => {
    if (selectedRole) {
      updateRoleMutation.mutate({ ...values, id: selectedRole.id });
    } else {
      createRoleMutation.mutate(values);
    }
  };

  const handleDeleteRole = (roleId: number) => {
    if (window.confirm(t("Are you sure you want to delete this role?"))) {
      deleteRoleMutation.mutate(roleId);
    }
  };

  // Group permissions by category
  const permissionsByCategory = permissions
    ? permissions.reduce((acc, permission) => {
        const category = permission.category || "Uncategorized";
        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category].push(permission);
        return acc;
      }, {} as Record<string, Permission[]>)
    : {};

  const isLoading = isLoadingRoles || isLoadingPermissions || isLoadingRolePermissions;
  const isPending = createRoleMutation.isPending || updateRoleMutation.isPending || deleteRoleMutation.isPending;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">{t("Roles Management")}</h2>
          <p className="text-muted-foreground">{t("Manage system roles and their permissions")}</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={(open) => {
          setIsCreateDialogOpen(open);
          if (!open) setSelectedRole(null);
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              {t("Add Role")}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[700px]">
            <DialogHeader>
              <DialogTitle>{selectedRole ? t("Edit Role") : t("Create New Role")}</DialogTitle>
              <DialogDescription>
                {t("Enter the details for the role. Click save when you're done.")}
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("Role Name")}</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("Description")}</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div>
                  <FormLabel>{t("Permissions")}</FormLabel>
                  <div className="border rounded-md p-4 mt-2 space-y-4">
                    {Object.entries(permissionsByCategory).map(([category, perms]) => (
                      <div key={category} className="space-y-2">
                        <h3 className="font-medium text-sm">{t(category)}</h3>
                        <div className="grid grid-cols-2 gap-4">
                          {perms.map((permission) => (
                            <FormField
                              key={permission.id}
                              control={form.control}
                              name="permissions"
                              render={({ field }) => {
                                return (
                                  <FormItem
                                    key={permission.id}
                                    className="flex flex-row items-start space-x-3 space-y-0"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(permission.id)}
                                        onCheckedChange={(checked) => {
                                          const updatedPermissions = checked
                                            ? [...field.value, permission.id]
                                            : field.value.filter(
                                                (id) => id !== permission.id
                                              );
                                          field.onChange(updatedPermissions);
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      {t(permission.name)}
                                      <p className="text-xs text-muted-foreground">
                                        {t(permission.description || "")}
                                      </p>
                                    </FormLabel>
                                  </FormItem>
                                );
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <DialogFooter>
                  <Button 
                    type="submit" 
                    disabled={isPending}
                  >
                    {isPending && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    {selectedRole ? t("Update Role") : t("Create Role")}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="pt-6">
          {isLoading ? (
            <div className="flex justify-center items-center h-60">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <Table>
              <TableCaption>{t("List of all system roles")}</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("ID")}</TableHead>
                  <TableHead>{t("Role Name")}</TableHead>
                  <TableHead>{t("Description")}</TableHead>
                  <TableHead>{t("Permissions")}</TableHead>
                  <TableHead className="text-right">{t("Actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {roles && roles.length > 0 ? (
                  roles.map((role) => (
                    <TableRow key={role.id}>
                      <TableCell>{role.id}</TableCell>
                      <TableCell className="font-medium">{role.name}</TableCell>
                      <TableCell>{role.description}</TableCell>
                      <TableCell>
                        {rolePermissions[role.id] ? (
                          <Badge variant="outline">
                            {rolePermissions[role.id]?.length || 0} {t("permissions")}
                          </Badge>
                        ) : (
                          "-"
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          className="mr-2"
                          onClick={() => setSelectedRole(role)}
                        >
                          {t("Edit")}
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteRole(role.id)}
                          disabled={isPending}
                        >
                          {isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            t("Delete")
                          )}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">
                      {t("No roles found")}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}