import React from "react";
import { useTranslation } from "react-i18next";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import LanguageSelector from "@/components/ui/language-selector";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useAuth } from "@/lib/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings as SettingsIcon, User, Globe } from "lucide-react";

export default function Settings() {
  const { t } = useTranslation();
  const { user } = useAuth();

  const userInitials = user 
    ? `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase() 
    : "??";

  return (
    <DashboardLayout title={t("general.settings")}>
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            {t("general.profile")}
          </TabsTrigger>
          <TabsTrigger value="general" className="flex items-center gap-2">
            <SettingsIcon className="h-4 w-4" />
            {t("settings.general_settings")}
          </TabsTrigger>
          <TabsTrigger value="language" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            {t("settings.language")}
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>{t("general.profile")}</CardTitle>
              <CardDescription>
                {t("settings.profile_settings")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center space-y-3">
                <Avatar className="h-24 w-24">
                  <AvatarImage src="" />
                  <AvatarFallback className="text-xl">{userInitials}</AvatarFallback>
                </Avatar>
                <div className="text-center">
                  <h3 className="font-medium text-lg">{user?.firstName} {user?.lastName}</h3>
                  <p className="text-muted-foreground">@{user?.username}</p>
                  <p className="mt-1 capitalize text-sm bg-primary/10 text-primary rounded-full px-2 py-0.5 inline-block">
                    {user?.role.replace('_', ' ')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* General Settings Tab */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>{t("settings.general_settings")}</CardTitle>
              <CardDescription>
                {t("settings.general_description")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Add more general settings here in the future */}
              <div className="space-y-2">
                <h3 className="text-sm font-medium">{t("settings.notifications")}</h3>
                <p className="text-sm text-muted-foreground">
                  {t("settings.notifications_description")}
                </p>
                {/* Notification settings will go here */}
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <h3 className="text-sm font-medium">{t("settings.security")}</h3>
                <p className="text-sm text-muted-foreground">
                  {t("settings.security_description")}
                </p>
                {/* Security settings will go here */}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Language and Theme Tab */}
        <TabsContent value="language">
          <Card>
            <CardHeader>
              <CardTitle>{t("settings.appearance")}</CardTitle>
              <CardDescription>
                {t("settings.appearance_description")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Language Settings */}
              <div className="space-y-2">
                <h3 className="text-sm font-medium">{t("settings.language")}</h3>
                <p className="text-sm text-muted-foreground">
                  {t("settings.language_description")}
                </p>
                <div className="mt-1">
                  <LanguageSelector />
                </div>
              </div>
              
              <Separator />
              
              {/* Theme Settings */}
              <div className="space-y-2">
                <h3 className="text-sm font-medium">{t("settings.theme")}</h3>
                <p className="text-sm text-muted-foreground">
                  {t("settings.theme_description")}
                </p>
                <div className="mt-1">
                  <ThemeToggle />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}