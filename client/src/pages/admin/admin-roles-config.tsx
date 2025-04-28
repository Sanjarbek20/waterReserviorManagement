import { useState } from "react";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { useAuth } from "@/lib/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminPermissionsPanel from "@/components/admin/admin-permissions-panel";
import { AlertCircle, Users, Shield, Settings } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useTranslation } from "react-i18next";

export default function AdminRolesConfigPage() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("permissions");

  // Super admin check
  if (user?.role !== "super_admin") {
    return (
      <DashboardLayout title="Ruxsat yo'q">
        <div className="container mx-auto p-4">
          <Card className="border-destructive">
            <CardHeader>
              <CardTitle className="text-destructive">Ruxsat yo'q</CardTitle>
              <CardDescription>
                Sizda ushbu sahifaga kirish uchun ruxsat mavjud emas.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Bu bo'lim faqat super administratorlar uchun ochiq.</p>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Administrator rollari boshqaruvi">
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Administrator rollari boshqaruvi</h1>
            <p className="text-muted-foreground">Admin foydalanuvchilari uchun huquqlarni va rollarni sozlash</p>
          </div>
        </div>

        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Superadmin uchun maxsus ruxsat</AlertTitle>
          <AlertDescription>
            Ushbu sahifada siz oddiy adminlar qanday huquqlar va imkoniyatlarga ega bo'lishini belgilashingiz mumkin. Super adminlar barcha imkoniyatlarga avtomatik ravishda ega bo'ladilar.
          </AlertDescription>
        </Alert>

        <Tabs defaultValue="permissions" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="permissions" className="flex items-center justify-center">
              <Shield className="h-4 w-4 mr-2" />
              Huquqlar
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center justify-center">
              <Users className="h-4 w-4 mr-2" />
              Foydalanuvchilar
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center justify-center">
              <Settings className="h-4 w-4 mr-2" />
              Sozlamalar
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="permissions" className="space-y-4">
            <AdminPermissionsPanel />
          </TabsContent>
          
          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Admin foydalanuvchilari boshqaruvi</CardTitle>
                <CardDescription>
                  Administrator rollarini belgilash va foydalanuvchilarni boshqarish
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-10 text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p>Bu funksiya hozircha ishlab chiqilmoqda.</p>
                  <p className="text-sm">Administrator foydalanuvchilarini boshqarish imkoniyatlari tez orada qo'shiladi.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Admin sozlamalari</CardTitle>
                <CardDescription>
                  Administrator paneli sozlamalarini sozlash
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-10 text-muted-foreground">
                  <Settings className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p>Bu funksiya hozircha ishlab chiqilmoqda.</p>
                  <p className="text-sm">Admin boshqaruv paneli sozlamalari tez orada qo'shiladi.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}