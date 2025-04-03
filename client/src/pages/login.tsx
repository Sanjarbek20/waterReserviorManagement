import { useState } from "react";
import { Link } from "wouter";
import { useAuth } from "@/lib/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Droplet, Waves } from "lucide-react";

const formSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().default(false),
});

export default function Login() {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
      rememberMe: false,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true);
      await login({
        username: values.username,
        password: values.password,
      });
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-700 p-4">
      <div className="w-full max-w-5xl flex flex-col md:flex-row overflow-hidden rounded-lg shadow-xl">
        {/* Left side - Reservoir Image and Information */}
        <div className="w-full md:w-1/2 bg-blue-900 text-white p-8 flex flex-col justify-center items-center">
          <div className="mb-6 text-center">
            <Waves size={80} className="mx-auto mb-4 text-blue-300" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-300 to-teal-300 bg-clip-text text-transparent mb-2">
              Water Reservoir Management
            </h1>
            <p className="text-blue-200 text-lg">
              Efficient water resource management for sustainable agriculture
            </p>
          </div>
          
          <div className="space-y-6 max-w-md">
            <div className="flex items-center space-x-3">
              <Droplet className="text-blue-300 h-6 w-6" />
              <p>Real-time monitoring of water levels</p>
            </div>
            <div className="flex items-center space-x-3">
              <Droplet className="text-blue-300 h-6 w-6" />
              <p>Fair allocation of water resources</p>
            </div>
            <div className="flex items-center space-x-3">
              <Droplet className="text-blue-300 h-6 w-6" />
              <p>Data-driven decision making</p>
            </div>
            <div className="flex items-center space-x-3">
              <Droplet className="text-blue-300 h-6 w-6" />
              <p>Sustainable farming practices</p>
            </div>
          </div>
        </div>
        
        {/* Right side - Login Form */}
        <div className="w-full md:w-1/2 bg-white p-8">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-blue-800">Sign In</h2>
              <p className="text-gray-500 mt-2">Access your dashboard</p>
              <div className="mt-2 p-2 bg-blue-50 text-blue-800 rounded-md text-sm">
                <p><strong>Test users:</strong></p>
                <p className="font-semibold mt-1">Admin Accounts:</p>
                <p>- <code className="bg-blue-100 px-1">admin_test</code> / <code className="bg-blue-100 px-1">admin123</code> (Admin)</p>
                <p>- <code className="bg-blue-100 px-1">data_test</code> / <code className="bg-blue-100 px-1">data123</code> (Data Admin)</p>
                <p className="font-semibold mt-1">Farmer Accounts:</p>
                <p>- <code className="bg-blue-100 px-1">user</code> / <code className="bg-blue-100 px-1">password</code> (Farmer)</p>
                <p>- <code className="bg-blue-100 px-1">plaintest</code> / <code className="bg-blue-100 px-1">plainpass123</code> (Farmer)</p>
                <p>- <code className="bg-blue-100 px-1">farmer1</code> / <code className="bg-blue-100 px-1">farmer123</code> (Farmer)</p>
              </div>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter username" 
                          {...field} 
                          disabled={isLoading}
                        />
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
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input 
                          type="password" 
                          placeholder="Enter password" 
                          {...field} 
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex items-center justify-between">
                  <FormField
                    control={form.control}
                    name="rememberMe"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            disabled={isLoading}
                          />
                        </FormControl>
                        <FormLabel className="text-sm cursor-pointer">Remember me</FormLabel>
                      </FormItem>
                    )}
                  />
                  <div className="text-sm">
                    <span className="font-medium text-blue-500 hover:text-blue-700 cursor-pointer">
                      Forgot password?
                    </span>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800" 
                  disabled={isLoading}
                >
                  {isLoading ? "Signing in..." : "Sign in"}
                </Button>
              </form>
            </Form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                Need an account? Please contact your system administrator.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}