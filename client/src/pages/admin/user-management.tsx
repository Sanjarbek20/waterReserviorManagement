import { useAuth } from "@/lib/auth";
import DashboardLayout from "@/components/layout/dashboard-layout";
import UsersManagement from "@/components/admin/users-management";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "react-i18next";

export default function UserManagementPage() {
  const { user } = useAuth();
  const { t } = useTranslation();

  // Admin check
  if (user?.role !== "admin" && user?.role !== "super_admin") {
    return (
      <DashboardLayout title={t("Access Denied")}>
        <div className="container mx-auto p-4">
          <Card className="border-destructive">
            <CardHeader>
              <CardTitle className="text-destructive">{t("Access Denied")}</CardTitle>
              <CardDescription>
                {t("You don't have permission to access the User Management console.")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>{t("This section is restricted to administrators only.")}</p>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title={t("User Management")}>
      <div className="container mx-auto p-4">
        <UsersManagement />
      </div>
    </DashboardLayout>
  );
}