import { Switch, Route, Redirect, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Login from "@/pages/login";
// Register page is disabled - only admins can create users
import Register from "@/pages/register";
import Settings from "@/pages/settings";
import WaterPredictions from "@/pages/water-predictions";
import AdminDashboard from "@/pages/admin/dashboard";
import AdminReservoirs from "@/pages/admin/reservoirs";
import AdminAllocation from "@/pages/admin/allocation";
import AdminUsers from "@/pages/admin/users";
import AdminDataManagement from "@/pages/admin/data-management";
import AdminSurveillance from "@/pages/admin/surveillance";
import AdminReports from "@/pages/admin/reports";
import AdminSettings from "@/pages/admin/settings";
import AdminActivities from "@/pages/admin/activities";
import AdminNotifications from "@/pages/admin/notifications";
import FarmerDashboard from "@/pages/farmer/dashboard";
import FarmerRequests from "@/pages/farmer/requests";
import FarmerProfile from "@/pages/farmer/profile";
import FarmerReports from "@/pages/farmer/reports";
import NotificationDetailPage from "@/pages/farmer/notifications/[id]";
import { AuthProvider, useAuth } from "@/lib/auth";
import { ThemeProvider } from "@/lib/theme-provider";
import { useEffect, Suspense } from "react";
import { I18nextProvider } from "react-i18next";
import i18n from "./lib/i18n";

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
    
    // If user is not logged in and not on login page, redirect to login
    if (!user && location !== "/login") {
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
      {/* Register route disabled - only admins can create users */}
      <Route path="/register">
        {() => <Redirect to="/login" />}
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
      <Route path="/admin/reports">
        <ProtectedRoute component={AdminReports} adminOnly={true} dataAdminAllowed={true} />
      </Route>
      <Route path="/admin/settings">
        <ProtectedRoute component={AdminSettings} adminOnly={true} />
      </Route>
      <Route path="/admin/activities">
        <ProtectedRoute component={AdminActivities} adminOnly={true} dataAdminAllowed={true} />
      </Route>
      <Route path="/admin/notifications">
        <ProtectedRoute component={AdminNotifications} adminOnly={true} dataAdminAllowed={true} />
      </Route>
      
      <Route path="/settings">
        <ProtectedRoute component={Settings} />
      </Route>
      
      <Route path="/water-predictions">
        <ProtectedRoute component={WaterPredictions} adminOnly={true} dataAdminAllowed={true} />
      </Route>
      
      {/* Farmer Routes */}
      <Route path="/farmer/dashboard">
        <ProtectedRoute component={FarmerDashboard} />
      </Route>
      <Route path="/farmer/requests">
        <ProtectedRoute component={FarmerRequests} />
      </Route>
      <Route path="/farmer/profile">
        <ProtectedRoute component={FarmerProfile} />
      </Route>
      <Route path="/farmer/reports">
        <ProtectedRoute component={FarmerReports} />
      </Route>
      <Route path="/farmer/notifications/:id">
        <ProtectedRoute component={NotificationDetailPage} />
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
      <I18nextProvider i18n={i18n}>
        <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading translations...</div>}>
          <ThemeProvider defaultTheme="light">
            <AuthProvider>
              <Router />
              <Toaster />
            </AuthProvider>
          </ThemeProvider>
        </Suspense>
      </I18nextProvider>
    </QueryClientProvider>
  );
}

export default App;
