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
import { insertUserSchema, type User } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Loader2, UserPlus } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useTranslation } from "react-i18next";

// Extended schema with additional validations
const createUserSchema = insertUserSchema.extend({
  password: z.string().min(6, {
    message: "Password must be at least 6 characters",
  }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type CreateUserFormValues = z.infer<typeof createUserSchema>;

export default function UsersManagement() {
  const { t } = useTranslation();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { user: currentUser } = useAuth();
  
  // Fetch users
  const { data: users, isLoading } = useQuery<User[]>({
    queryKey: ["/api/users"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/users");
      if (!response.ok) {
        throw new Error(`Error fetching users: ${response.statusText}`);
      }
      return response.json();
    },
  });

  // Create user form
  const form = useForm<CreateUserFormValues>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
      role: "farmer",
      fieldSize: "0",
      cropType: "",
    },
  });

  // Create user mutation
  const createUserMutation = useMutation({
    mutationFn: async (values: CreateUserFormValues) => {
      // Remove confirmPassword since it's not part of the API schema
      const { confirmPassword, ...userData } = values;
      
      const response = await apiRequest("POST", "/api/register", userData);
      if (!response.ok) {
        throw new Error(`Error creating user: ${response.statusText}`);
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: t("User created successfully"),
        description: t("The user has been added to the system"),
      });
      setIsCreateDialogOpen(false);
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
    },
    onError: (error: Error) => {
      toast({
        title: t("Failed to create user"),
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Delete user mutation
  const deleteUserMutation = useMutation({
    mutationFn: async (userId: number) => {
      const response = await apiRequest("DELETE", `/api/users/${userId}`);
      if (!response.ok) {
        throw new Error(`Error deleting user: ${response.statusText}`);
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: t("User deleted successfully"),
        description: t("The user has been removed from the system"),
      });
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
    },
    onError: (error: Error) => {
      toast({
        title: t("Failed to delete user"),
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (values: CreateUserFormValues) => {
    createUserMutation.mutate(values);
  };

  const handleDeleteUser = (userId: number) => {
    if (window.confirm(t("Are you sure you want to delete this user?"))) {
      deleteUserMutation.mutate(userId);
    }
  };

  // Check if current user can manage all roles
  const canManageAllRoles = currentUser?.role === "super_admin";

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">{t("Users Management")}</h2>
          <p className="text-muted-foreground">{t("Manage system users and their permissions")}</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              {t("Add User")}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{t("Create New User")}</DialogTitle>
              <DialogDescription>
                {t("Enter the details for the new user. Click save when you're done.")}
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("First Name")}</FormLabel>
                        <FormControl>
                          <Input {...field} />
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
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("Username")}</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("Password")}</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("Confirm Password")}</FormLabel>
                        <FormControl>
                          <Input type="password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("Role")}</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={t("Select a role")} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="farmer">{t("Farmer")}</SelectItem>
                          <SelectItem value="admin">{t("Administrator")}</SelectItem>
                          <SelectItem value="data_admin">{t("Data Administrator")}</SelectItem>
                          {canManageAllRoles && (
                            <SelectItem value="super_admin">{t("Super Administrator")}</SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {form.watch("role") === "farmer" && (
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="fieldSize"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("Field Size (hectares)")}</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
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
                              <SelectItem value="vegetables">{t("Vegetables")}</SelectItem>
                              <SelectItem value="fruits">{t("Fruits")}</SelectItem>
                              <SelectItem value="mixed">{t("Mixed")}</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}
                <DialogFooter>
                  <Button 
                    type="submit" 
                    disabled={createUserMutation.isPending}
                  >
                    {createUserMutation.isPending && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    {t("Create User")}
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
              <TableCaption>{t("List of all system users")}</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("ID")}</TableHead>
                  <TableHead>{t("Name")}</TableHead>
                  <TableHead>{t("Username")}</TableHead>
                  <TableHead>{t("Role")}</TableHead>
                  <TableHead>{t("Field Size")}</TableHead>
                  <TableHead>{t("Crop Type")}</TableHead>
                  <TableHead className="text-right">{t("Actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users && users.length > 0 ? (
                  users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.id}</TableCell>
                      <TableCell>
                        {user.firstName} {user.lastName}
                      </TableCell>
                      <TableCell>{user.username}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            user.role === "super_admin"
                              ? "destructive"
                              : user.role === "admin"
                              ? "default"
                              : user.role === "data_admin"
                              ? "secondary"
                              : "outline"
                          }
                        >
                          {t(user.role)}
                        </Badge>
                      </TableCell>
                      <TableCell>{user.fieldSize || "-"}</TableCell>
                      <TableCell>{user.cropType ? t(user.cropType) : "-"}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          className="mr-2"
                          onClick={() => {
                            // Edit functionality will be implemented in the future
                            toast({
                              title: t("Feature coming soon"),
                              description: t("User editing will be available in a future update"),
                            });
                          }}
                        >
                          {t("Edit")}
                        </Button>
                        {currentUser?.id !== user.id && (
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteUser(user.id)}
                            disabled={deleteUserMutation.isPending}
                          >
                            {deleteUserMutation.isPending ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              t("Delete")
                            )}
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center">
                      {t("No users found")}
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