import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup } from "@/components/ui/radio-group";
import { Radio } from "@/components/ui/radio";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
}

// Define notification type
interface Notification {
  id: number;
  userId: number;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

export default function SendNotifications() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [recipientType, setRecipientType] = useState<string>("individual");
  
  // Form schema for sending notifications
  const formSchema = z.object({
    recipientType: z.enum(["individual", "all", "farmers", "admins"], {
      required_error: "Please select recipient type",
    }),
    userId: z.coerce.number().optional().or(z.literal("")),
    title: z.string().min(1, "Title is required"),
    message: z.string().min(1, "Message is required").max(500, "Message is too long (max 500 characters)"),
    type: z.enum(["info", "warning", "error"], {
      required_error: "Please select notification type",
    }),
  });

  // Set up form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      recipientType: "individual",
      title: "",
      message: "",
      type: "info",
    },
  });
  
  // Get users
  const { data: users = [], isLoading: isLoadingUsers } = useQuery<User[]>({
    queryKey: ['/api/users'],
  });
  
  // Get all notifications for admin view
  const { data: notifications = [], isLoading: isLoadingNotifications } = useQuery<Notification[]>({
    queryKey: ['/api/notifications'],
  });
  
  // Update form fields when recipient type changes
  const handleRecipientTypeChange = (value: string) => {
    setRecipientType(value);
    form.setValue("recipientType", value as any);
    // Clear userId if not individual
    if (value !== "individual") {
      form.setValue("userId", "" as any);
    }
  };
  
  // Send notification mutation
  const sendSingleNotificationMutation = useMutation({
    mutationFn: async (data: { userId: number; title: string; message: string; type: string }) => {
      const response = await fetch("/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to send notification");
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: t("Notification sent"),
        description: t("The notification has been sent successfully."),
      });
      form.reset({
        recipientType: "individual",
        title: "",
        message: "",
        type: "info",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/notifications'] });
    },
    onError: (error) => {
      toast({
        title: t("Error"),
        description: (error as Error).message || t("Failed to send notification"),
        variant: "destructive",
      });
    },
  });
  
  // Send bulk notification mutation
  const sendBulkNotificationMutation = useMutation({
    mutationFn: async (data: { recipients: string; title: string; message: string; type: string }) => {
      const response = await fetch("/api/notifications/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to send notifications");
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: t("Notifications sent"),
        description: t("{{count}} notifications have been sent successfully.", { count: data.count }),
      });
      form.reset({
        recipientType: "individual",
        title: "",
        message: "",
        type: "info",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/notifications'] });
    },
    onError: (error) => {
      toast({
        title: t("Error"),
        description: (error as Error).message || t("Failed to send notifications"),
        variant: "destructive",
      });
    },
  });
  
  // Handle form submission
  const onSubmit = (data: z.infer<typeof formSchema>) => {
    if (data.recipientType === "individual") {
      if (!data.userId) {
        return toast({
          title: t("Error"),
          description: t("Please select a recipient"),
          variant: "destructive",
        });
      }
      
      sendSingleNotificationMutation.mutate({
        userId: data.userId,
        title: data.title,
        message: data.message,
        type: data.type,
      });
    } else {
      sendBulkNotificationMutation.mutate({
        recipients: data.recipientType,
        title: data.title,
        message: data.message,
        type: data.type,
      });
    }
  };
  
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };
  
  // Get notification type badge class
  const getTypeClass = (type: string) => {
    switch (type) {
      case "info":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "warning":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "error":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };
  
  return (
    <Layout>
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">{t("Notification Management")}</h1>
        
        <Tabs defaultValue="send">
          <TabsList className="mb-6">
            <TabsTrigger value="send">{t("Send Notifications")}</TabsTrigger>
            <TabsTrigger value="history">{t("Notification History")}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="send">
            <Card>
              <CardHeader>
                <CardTitle>{t("Send Notifications")}</CardTitle>
                <CardDescription>
                  {t("Send notifications to farmers, administrators, or specific users.")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="recipientType"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel>{t("Recipient Type")}</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={handleRecipientTypeChange}
                              defaultValue={field.value}
                              className="flex flex-col space-y-1"
                            >
                              <div className="flex items-center space-x-2">
                                <Radio value="individual" id="individual" />
                                <label htmlFor="individual">{t("Individual User")}</label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Radio value="all" id="all" />
                                <label htmlFor="all">{t("All Users")}</label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Radio value="farmers" id="farmers" />
                                <label htmlFor="farmers">{t("All Farmers")}</label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Radio value="admins" id="admins" />
                                <label htmlFor="admins">{t("All Administrators")}</label>
                              </div>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {recipientType === "individual" && (
                      <FormField
                        control={form.control}
                        name="userId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("Recipient")}</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value?.toString() || ""}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder={t("Select a recipient")} />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {isLoadingUsers ? (
                                  <SelectItem value="" disabled>
                                    {t("Loading users...")}
                                  </SelectItem>
                                ) : (
                                  users.map((user) => (
                                    <SelectItem key={user.id} value={user.id.toString()}>
                                      {`${user.firstName} ${user.lastName} (${user.username}, ${user.role})`}
                                    </SelectItem>
                                  ))
                                )}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                    
                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("Notification Type")}</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder={t("Select notification type")} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="info">{t("Information")}</SelectItem>
                              <SelectItem value="warning">{t("Warning")}</SelectItem>
                              <SelectItem value="error">{t("Critical")}</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            {t("Select the type of notification to send")}
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("Title")}</FormLabel>
                          <FormControl>
                            <Input placeholder={t("Notification title")} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("Message")}</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder={t("Type your message here...")}
                              rows={5}
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            {t("Maximum 500 characters")}
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button
                      type="submit"
                      disabled={
                        sendSingleNotificationMutation.isPending ||
                        sendBulkNotificationMutation.isPending
                      }
                    >
                      {sendSingleNotificationMutation.isPending ||
                      sendBulkNotificationMutation.isPending ? (
                        <>
                          <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-b-transparent"></span>
                          {t("Sending...")}
                        </>
                      ) : (
                        t("Send Notification")
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>{t("Notification History")}</CardTitle>
                <CardDescription>
                  {t("View all sent notifications in the system.")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingNotifications ? (
                  <div className="flex justify-center p-10">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="text-center p-6 text-gray-500">
                    {t("No notifications found.")}
                  </div>
                ) : (
                  <div className="overflow-auto">
                    <Table>
                      <TableCaption>{t("List of all notifications in the system.")}</TableCaption>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[60px]">ID</TableHead>
                          <TableHead>{t("Title")}</TableHead>
                          <TableHead>{t("Message")}</TableHead>
                          <TableHead>{t("Type")}</TableHead>
                          <TableHead>{t("User ID")}</TableHead>
                          <TableHead>{t("Status")}</TableHead>
                          <TableHead>{t("Date")}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {notifications.map((notification) => (
                          <TableRow key={notification.id}>
                            <TableCell className="font-medium">{notification.id}</TableCell>
                            <TableCell>{notification.title}</TableCell>
                            <TableCell className="max-w-[200px] truncate">
                              {notification.message}
                            </TableCell>
                            <TableCell>
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeClass(
                                  notification.type
                                )}`}
                              >
                                {t(
                                  notification.type.charAt(0).toUpperCase() +
                                    notification.type.slice(1)
                                )}
                              </span>
                            </TableCell>
                            <TableCell>{notification.userId}</TableCell>
                            <TableCell>
                              {notification.isRead ? (
                                <span className="text-green-600 dark:text-green-500">
                                  {t("Read")}
                                </span>
                              ) : (
                                <span className="text-amber-600 dark:text-amber-500">
                                  {t("Unread")}
                                </span>
                              )}
                            </TableCell>
                            <TableCell>{formatDate(notification.createdAt)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button
                  variant="outline"
                  onClick={() => queryClient.invalidateQueries({ queryKey: ['/api/notifications'] })}
                >
                  {t("Refresh")}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}