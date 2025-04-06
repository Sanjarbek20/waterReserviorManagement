import React from "react";
import { useTranslation } from "react-i18next";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import LanguageSelector from "@/components/ui/language-selector";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useAuth } from "@/lib/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Settings() {
  const { t } = useTranslation();
  const { user } = useAuth();

  const userInitials = user 
    ? `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase() 
    : "??";

  return (
    <DashboardLayout title={t("general.settings")}>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* User Profile Section */}
        <Card className="col-span-1">
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

        {/* General Settings Section */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>{t("settings.general_settings")}</CardTitle>
            <CardDescription>
              {t("settings.general_settings")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Language Settings */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium">{t("settings.language")}</h3>
              <p className="text-sm text-muted-foreground">
                {t("settings.language")}
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
                {t("settings.theme")}
              </p>
              <div className="mt-1">
                <ThemeToggle />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}