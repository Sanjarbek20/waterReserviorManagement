import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { User, Lock, Shield, Crop, MapPin } from "lucide-react";

// Form schema for personal information
const personalInfoSchema = z.object({
  firstName: z.string().min(2, { message: "First name must be at least 2 characters." }),
  lastName: z.string().min(2, { message: "Last name must be at least 2 characters." }),
  fieldSize: z.string().optional(),
  cropType: z.string().optional(),
});

// Form schema for password update
const passwordSchema = z.object({
  currentPassword: z.string().min(6, { message: "Current password is required." }),
  newPassword: z.string().min(6, { message: "Password must be at least 6 characters." }),
  confirmPassword: z.string().min(6, { message: "Please confirm your password." }),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export default function FarmerProfile() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  
  // Form for personal information
  const personalInfoForm = useForm<z.infer<typeof personalInfoSchema>>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      fieldSize: user?.fieldSize || "",
      cropType: user?.cropType || "",
    },
  });
  
  // Form for password update
  const passwordForm = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });
  
  // Mock update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (data: z.infer<typeof personalInfoSchema>) => {
      const res = await apiRequest("PATCH", "/api/user/profile", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      toast({
        title: "Profile updated",
        description: "Your profile information has been updated.",
      });
      setIsEditing(false);
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Update failed",
        description: error.message || "Failed to update profile. Please try again.",
      });
    },
  });
  
  // Mock change password mutation
  const changePasswordMutation = useMutation({
    mutationFn: async (data: z.infer<typeof passwordSchema>) => {
      const res = await apiRequest("POST", "/api/user/change-password", {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Password updated",
        description: "Your password has been changed successfully.",
      });
      passwordForm.reset();
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Password change failed",
        description: error.message || "Failed to update password. Please check your current password.",
      });
    },
  });
  
  // Handle personal info form submission
  const onPersonalInfoSubmit = (data: z.infer<typeof personalInfoSchema>) => {
    updateProfileMutation.mutate(data);
  };
  
  // Handle password form submission
  const onPasswordSubmit = (data: z.infer<typeof passwordSchema>) => {
    changePasswordMutation.mutate(data);
  };
  
  return (
    <DashboardLayout title="Profile">
      <Tabs defaultValue="personal" className="space-y-6">
        <TabsList>
          <TabsTrigger value="personal">Personal Information</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>
        
        <TabsContent value="personal" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-16 w-16">
                    <AvatarFallback className="bg-blue-500 text-white text-xl">
                      {user ? `${user.firstName[0]}${user.lastName[0]}` : "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle>{user?.firstName} {user?.lastName}</CardTitle>
                    <CardDescription className="capitalize">{user?.role}</CardDescription>
                  </div>
                </div>
                <Button 
                  onClick={() => setIsEditing(!isEditing)}
                  variant={isEditing ? "outline" : "default"}
                >
                  {isEditing ? "Cancel Editing" : "Edit Profile"}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <Form {...personalInfoForm}>
                  <form onSubmit={personalInfoForm.handleSubmit(onPersonalInfoSubmit)} className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                      <FormField
                        control={personalInfoForm.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>First Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter your first name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={personalInfoForm.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Last Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter your last name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <Separator />
                    <h3 className="text-lg font-medium">Farm Information</h3>
                    
                    <div className="grid gap-6 md:grid-cols-2">
                      <FormField
                        control={personalInfoForm.control}
                        name="fieldSize"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Field Size (hectares)</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                step="0.01" 
                                placeholder="Enter field size" 
                                {...field} 
                              />
                            </FormControl>
                            <FormDescription>
                              Size of your farm in hectares
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={personalInfoForm.control}
                        name="cropType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Primary Crop Type</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select crop type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="rice">Rice</SelectItem>
                                <SelectItem value="wheat">Wheat</SelectItem>
                                <SelectItem value="corn">Corn</SelectItem>
                                <SelectItem value="vegetables">Vegetables</SelectItem>
                                <SelectItem value="cotton">Cotton</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              Main crop you are growing
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full md:w-auto"
                      disabled={updateProfileMutation.isPending}
                    >
                      {updateProfileMutation.isPending ? "Saving Changes..." : "Save Changes"}
                    </Button>
                  </form>
                </Form>
              ) : (
                <div className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 flex items-center">
                        <User className="h-4 w-4 mr-2" /> Full Name
                      </h3>
                      <p className="mt-1 text-lg">{user?.firstName} {user?.lastName}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 flex items-center">
                        <Shield className="h-4 w-4 mr-2" /> Account Type
                      </h3>
                      <p className="mt-1 text-lg capitalize">{user?.role}</p>
                    </div>
                  </div>
                  
                  <Separator />
                  <h3 className="text-lg font-medium">Farm Information</h3>
                  
                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 flex items-center">
                        <MapPin className="h-4 w-4 mr-2" /> Field Size
                      </h3>
                      <p className="mt-1 text-lg">{user?.fieldSize ? `${user.fieldSize} hectares` : "Not specified"}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 flex items-center">
                        <Crop className="h-4 w-4 mr-2" /> Primary Crop
                      </h3>
                      <p className="mt-1 text-lg capitalize">{user?.cropType || "Not specified"}</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Password Settings</CardTitle>
              <CardDescription>
                Update your password to maintain account security
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...passwordForm}>
                <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-6">
                  <FormField
                    control={passwordForm.control}
                    name="currentPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="Enter current password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid gap-6 md:grid-cols-2">
                    <FormField
                      control={passwordForm.control}
                      name="newPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>New Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="Enter new password" {...field} />
                          </FormControl>
                          <FormDescription>
                            At least 6 characters
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={passwordForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm New Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="Confirm new password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="flex items-center pt-4">
                    <Button 
                      type="submit" 
                      className="w-full md:w-auto"
                      disabled={changePasswordMutation.isPending}
                    >
                      {changePasswordMutation.isPending ? "Updating Password..." : "Update Password"}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
            <CardFooter className="bg-blue-50 border-t text-sm text-gray-600 flex items-start p-4">
              <Lock className="h-4 w-4 mt-0.5 mr-2 text-blue-500" />
              <div>
                Password security tips:<br />
                - Use a combination of letters, numbers, and symbols<br />
                - Don't reuse passwords across different services<br />
                - Consider using a password manager for better security
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}