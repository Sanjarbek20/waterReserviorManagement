import { Switch, Route, Redirect, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Login from "@/pages/login";
import Register from "@/pages/register";
import AdminDashboard from "@/pages/admin/dashboard";
import AdminReservoirs from "@/pages/admin/reservoirs";
import AdminAllocation from "@/pages/admin/allocation";
import AdminUsers from "@/pages/admin/users";
import AdminDataManagement from "@/pages/admin/data-management";
import AdminSurveillance from "@/pages/admin/surveillance";
import FarmerDashboard from "@/pages/farmer/dashboard";
import FarmerRequests from "@/pages/farmer/requests";
import { AuthProvider, useAuth } from "@/lib/auth";
import { useEffect } from "react";

function ProtectedRoute({ 
  component: Component, 
  adminOnly = false,
  dataAdminAllowed = false,
  ...rest 
}: { 
  component: React.ComponentType<any>, 
  adminOnly?: boolean,
  dataAdminAllowed?: boolean,
  [x: string]: any 
}) {
  const { user, isLoading, isAuthChecked } = useAuth();
  const [, setLocation] = useLocation();
  
  useEffect(() => {
    if (isAuthChecked && !isLoading && !user) {
      setLocation("/login");
    }
  }, [user, isLoading, isAuthChecked, setLocation]);
  
  if (isLoading || !isAuthChecked) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }
  
  if (!user) {
    return null; // Redirect will happen via useEffect
  }
  
  if (adminOnly) {
    // Allow data admins if specified
    if (dataAdminAllowed && user.role === "data_admin") {
      // Data admins can access this page
    } else if (user.role !== "admin") {
      return <Redirect to="/dashboard" />;
    }
  }
  
  return <Component {...rest} />;
}

function Router() {
  const { user, isAuthChecked, isLoading } = useAuth();
  const [location, setLocation] = useLocation();
  
  // Redirect to login if not authenticated
  useEffect(() => {
    // Wait for auth check to complete
    if (!isAuthChecked) return;
    
    // If user is not logged in and not on login or register page, redirect to login
    if (!user && location !== "/login" && location !== "/register") {
      setLocation("/login");
    }
    
    // If user is logged in and on the root or login page, redirect to dashboard
    if (user && (location === "/" || location === "/login")) {
      setLocation("/dashboard");
    }
  }, [user, isAuthChecked, location, setLocation]);
  
  // Show a loading indicator while checking authentication status
  if (!isAuthChecked || isLoading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }
  
  return (
    <Switch>
      <Route path="/login">
        {user ? <Redirect to="/dashboard" /> : <Login />}
      </Route>
      <Route path="/register">
        {user ? <Redirect to="/dashboard" /> : <Register />}
      </Route>
      
      {/* Admin Routes */}
      <Route path="/admin/dashboard">
        <ProtectedRoute component={AdminDashboard} adminOnly={true} />
      </Route>
      <Route path="/admin/reservoirs">
        <ProtectedRoute component={AdminReservoirs} adminOnly={true} />
      </Route>
      <Route path="/admin/allocation">
        <ProtectedRoute component={AdminAllocation} adminOnly={true} />
      </Route>
      <Route path="/admin/users">
        <ProtectedRoute component={AdminUsers} adminOnly={true} />
      </Route>
      <Route path="/admin/data-management">
        <ProtectedRoute component={AdminDataManagement} adminOnly={true} dataAdminAllowed={true} />
      </Route>
      <Route path="/admin/surveillance">
        <ProtectedRoute component={AdminSurveillance} adminOnly={true} dataAdminAllowed={true} />
      </Route>
      
      {/* Farmer Routes */}
      <Route path="/farmer/dashboard">
        <ProtectedRoute component={FarmerDashboard} />
      </Route>
      <Route path="/farmer/requests">
        <ProtectedRoute component={FarmerRequests} />
      </Route>
      
      {/* Common Routes */}
      <Route path="/dashboard">
        {() => {
          if (!user) return <Redirect to="/login" />;
          
          if (user.role === "admin") {
            return <Redirect to="/admin/dashboard" />;
          } else if (user.role === "data_admin") {
            return <Redirect to="/admin/data-management" />;
          } else {
            return <Redirect to="/farmer/dashboard" />;
          }
        }}
      </Route>
      
      <Route path="/">
        {!user ? <Redirect to="/login" /> : <Redirect to="/dashboard" />}
      </Route>
      
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
