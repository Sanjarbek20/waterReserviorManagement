import React from 'react';
import DashboardLayout from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { AlertTriangle } from 'lucide-react';
import UsersManagement from "@/components/admin/users-management";

export default function UserManagementPage() {
  const { user } = useAuth();

  // Admin or Superadmin check
  if (user?.role !== "admin" && user?.role !== "super_admin") {
    return (
      <DashboardLayout title="Access Denied">
        <div className="container mx-auto p-4">
          <Card className="border-destructive">
            <CardHeader>
              <CardTitle className="text-destructive">Access Denied</CardTitle>
              <CardDescription>
                You don't have permission to access the User Management page.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-5 w-5" />
                <p>This section is restricted to Administrators only.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="User Management">
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">User Management</h1>
            <p className="text-muted-foreground">Create and manage users in the system</p>
          </div>
        </div>

        <UsersManagement />
      </div>
    </DashboardLayout>
  );
}