import React, { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/lib/auth";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  BarChart3, 
  Settings, 
  LogOut, 
  ChevronDown, 
  Droplets, 
  Home, 
  Users, 
  FileText, 
  Database, 
  AlertCircle,
  Video,
  Brain
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import LanguageSelector from "./ui/language-selector";
import { ThemeToggle } from "./ui/theme-toggle";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { t } = useTranslation();
  const [location] = useLocation();
  const { user, logout } = useAuth();
  
  if (!user) return null;
  
  // Foydalanuvchi ismi va familiyasi initsiallari
  const getInitials = () => {
    if (!user) return "U";
    return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
  };

  // Qaysi bo'limda ekanligimizni tekshirish
  const isActive = (path: string) => {
    return location === path;
  };

  const isAdmin = user.role === "admin";
  const isDataAdmin = user.role === "data_admin";
  const isFarmer = user.role === "farmer";

  // Foydalanuvchi turiga qarab menyu elementlari
  const getMenuItems = () => {
    // Asosiy admin menyusi
    if (isAdmin) {
      return [
        { name: t("dashboard"), path: "/admin/dashboard", icon: <Home className="h-5 w-5 mr-2" /> },
        { name: t("reservoirs"), path: "/admin/reservoirs", icon: <Droplets className="h-5 w-5 mr-2" /> },
        { name: t("water_allocation"), path: "/admin/allocation", icon: <BarChart3 className="h-5 w-5 mr-2" /> },
        { name: t("users"), path: "/admin/users", icon: <Users className="h-5 w-5 mr-2" /> },
        { name: t("data_management"), path: "/admin/data-management", icon: <Database className="h-5 w-5 mr-2" /> },
        { name: t("surveillance"), path: "/admin/surveillance", icon: <Video className="h-5 w-5 mr-2" /> },
        { name: t("reports"), path: "/admin/reports", icon: <FileText className="h-5 w-5 mr-2" /> },
        { name: t("water_prediction.title"), path: "/water-predictions", icon: <Brain className="h-5 w-5 mr-2" /> },
        { name: t("settings"), path: "/admin/settings", icon: <Settings className="h-5 w-5 mr-2" /> },
      ];
    }
    
    // Data admin menyusi
    if (isDataAdmin) {
      return [
        { name: t("data_management"), path: "/admin/data-management", icon: <Database className="h-5 w-5 mr-2" /> },
        { name: t("surveillance"), path: "/admin/surveillance", icon: <Video className="h-5 w-5 mr-2" /> },
        { name: t("reports"), path: "/admin/reports", icon: <FileText className="h-5 w-5 mr-2" /> },
        { name: t("water_prediction.title"), path: "/water-predictions", icon: <Brain className="h-5 w-5 mr-2" /> },
        { name: t("settings"), path: "/settings", icon: <Settings className="h-5 w-5 mr-2" /> },
      ];
    }
    
    // Fermer menyusi
    return [
      { name: t("dashboard"), path: "/farmer/dashboard", icon: <Home className="h-5 w-5 mr-2" /> },
      { name: t("water_requests"), path: "/farmer/requests", icon: <Droplets className="h-5 w-5 mr-2" /> },
      { name: t("profile"), path: "/farmer/profile", icon: <Users className="h-5 w-5 mr-2" /> },
      { name: t("reports"), path: "/farmer/reports", icon: <FileText className="h-5 w-5 mr-2" /> },
      { name: t("settings"), path: "/settings", icon: <Settings className="h-5 w-5 mr-2" /> },
    ];
  };

  const menuItems = getMenuItems();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Navigation */}
      <header className="border-b sticky top-0 z-50 bg-background shadow-sm">
        <div className="h-16 flex items-center px-4 md:px-6">
          <div className="flex items-center">
            <Droplets className="h-6 w-6 text-primary mr-2" />
            <span className="font-bold text-lg hidden md:inline-block">
              {t("app_title")}
            </span>
          </div>
          
          <div className="flex-1"></div>
          
          <div className="flex items-center gap-2 md:gap-4">
            <LanguageSelector />
            <ThemeToggle />
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{getInitials()}</AvatarFallback>
                  </Avatar>
                  <span className="hidden md:inline-block font-medium">
                    {user?.firstName} {user?.lastName}
                  </span>
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                  {user?.firstName} {user?.lastName}
                  <div className="text-xs text-muted-foreground">
                    {t(`roles.${user?.role}`)}
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/settings" className="cursor-pointer flex w-full">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>{t("settings")}</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => logout()} className="text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>{t("logout")}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
      
      {/* Main Content with Sidebar */}
      <div className="flex-1 flex">
        {/* Sidebar */}
        <aside className="hidden md:block w-64 border-r bg-muted/40 min-h-[calc(100vh-4rem)]">
          <nav className="flex flex-col p-4 gap-2 h-full">
            {menuItems.map((item) => (
              <Link 
                key={item.path} 
                href={item.path}
                className={cn(
                  "flex items-center px-3 py-2 rounded-md text-sm font-medium hover:bg-muted transition-colors",
                  isActive(item.path) ? "bg-muted" : ""
                )}
              >
                {item.icon}
                {item.name}
              </Link>
            ))}
            
            <div className="flex-1"></div>
            
            {/* Notification area at bottom of sidebar */}
            <div className="mt-auto">
              {user?.role === "farmer" && (
                <div className="flex flex-col gap-2 p-3 rounded-md bg-yellow-100 dark:bg-yellow-950 text-yellow-800 dark:text-yellow-300 text-sm">
                  <div className="flex items-center">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    <span className="font-medium">{t("next_allocation")}</span>
                  </div>
                  <div>23 {t("april")} 2025, 09:00 - 12:00</div>
                </div>
              )}
            </div>
          </nav>
        </aside>
        
        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}