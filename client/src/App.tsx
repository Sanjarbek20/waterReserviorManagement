import { Switch, Route, Redirect } from "wouter";
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
import FarmerDashboard from "@/pages/farmer/dashboard";
import FarmerRequests from "@/pages/farmer/requests";
import { AuthProvider, useAuth } from "@/lib/auth";

function ProtectedRoute({ 
  component: Component, 
  adminOnly = false,
  ...rest 
}: { 
  component: React.ComponentType<any>, 
  adminOnly?: boolean,
  [x: string]: any 
}) {
  const { user, isLoading, isAuthChecked } = useAuth();
  
  if (isLoading || !isAuthChecked) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }
  
  if (!user) {
    return <Redirect to="/login" />;
  }
  
  if (adminOnly && user.role !== "admin") {
    return <Redirect to="/dashboard" />;
  }
  
  return <Component {...rest} />;
}

function Router() {
  const { user, isAuthChecked } = useAuth();
  
  // Show a loading indicator while checking authentication status
  if (!isAuthChecked) {
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
        <ProtectedRoute component={AdminDataManagement} adminOnly={true} />
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
          return user.role === "admin" 
            ? <Redirect to="/admin/dashboard" />
            : <Redirect to="/farmer/dashboard" />;
        }}
      </Route>
      
      <Route path="/">
        <Redirect to="/dashboard" />
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
