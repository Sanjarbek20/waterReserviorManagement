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
                          placeholder="your.username" 
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
                          placeholder="••••••••" 
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
                    <Link href="/forgot-password">
                      <a className="font-medium text-blue-500 hover:text-blue-700">
                        Forgot password?
                      </a>
                    </Link>
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
                Don't have an account?{" "}
                <Link href="/register">
                  <a className="font-medium text-blue-500 hover:text-blue-700">
                    Register now
                  </a>
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
