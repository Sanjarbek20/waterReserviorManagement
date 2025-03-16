import { Link, useLocation } from "wouter";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";
import {
  Home,
  Droplet,
  Settings,
  LogOut,
  BarChart3,
  Share2,
  User,
  Users,
  Database,
  Download
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function Sidebar() {
  const [location] = useLocation();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  const adminNavItems = [
    { 
      name: "Dashboard", 
      path: "/admin/dashboard", 
      icon: <Home className="h-4 w-4 mr-3" /> 
    },
    { 
      name: "Reservoirs", 
      path: "/admin/reservoirs", 
      icon: <Droplet className="h-4 w-4 mr-3" /> 
    },
    { 
      name: "Water Allocation", 
      path: "/admin/allocation", 
      icon: <Share2 className="h-4 w-4 mr-3" /> 
    },
    { 
      name: "User Management", 
      path: "/admin/users", 
      icon: <Users className="h-4 w-4 mr-3" /> 
    },
    { 
      name: "Data Management", 
      path: "/admin/data-management", 
      icon: <Database className="h-4 w-4 mr-3" /> 
    },
    { 
      name: "Reports", 
      path: "/admin/reports", 
      icon: <BarChart3 className="h-4 w-4 mr-3" /> 
    },
    { 
      name: "Settings", 
      path: "/admin/settings", 
      icon: <Settings className="h-4 w-4 mr-3" /> 
    }
  ];

  const dataAdminNavItems = [
    { 
      name: "Data Management", 
      path: "/admin/data-management", 
      icon: <Database className="h-4 w-4 mr-3" /> 
    },
    { 
      name: "Download Reports", 
      path: "/admin/data-management", 
      icon: <Download className="h-4 w-4 mr-3" /> 
    },
    { 
      name: "Reservoirs", 
      path: "/admin/reservoirs", 
      icon: <Droplet className="h-4 w-4 mr-3" /> 
    }
  ];

  const farmerNavItems = [
    { 
      name: "Dashboard", 
      path: "/farmer/dashboard", 
      icon: <Home className="h-4 w-4 mr-3" /> 
    },
    { 
      name: "Water Requests", 
      path: "/farmer/requests", 
      icon: <Droplet className="h-4 w-4 mr-3" /> 
    },
    { 
      name: "Reports", 
      path: "/farmer/reports", 
      icon: <BarChart3 className="h-4 w-4 mr-3" /> 
    },
    { 
      name: "Profile", 
      path: "/farmer/profile", 
      icon: <User className="h-4 w-4 mr-3" /> 
    }
  ];

  // Select navigation items based on user role
  let navItems;
  if (user?.role === "admin") {
    navItems = adminNavItems;
  } else if (user?.role === "data_admin") {
    navItems = dataAdminNavItems;
  } else {
    navItems = farmerNavItems;
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <h2 className="text-lg font-medium text-blue-800">Water Reservoir Management</h2>
      </div>
      
      <nav className="mt-4 flex-1">
        <ul>
          {navItems.map((item) => (
            <li className="mb-1" key={item.path}>
              <Link href={item.path}>
                <div className={cn(
                  "flex items-center px-4 py-3 text-sm hover:bg-blue-50 hover:text-blue-800 rounded-lg mx-2 cursor-pointer",
                  location === item.path ? "bg-blue-50 text-blue-800 font-medium" : "text-gray-600"
                )}>
                  {item.icon}
                  {item.name}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="border-t p-4">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
            {user && user.firstName && user.lastName 
              ? `${user.firstName[0]}${user.lastName[0]}`
              : "U"
            }
          </div>
          <div className="ml-2">
            <p className="text-sm font-medium text-gray-800">
              {user ? `${user.firstName} ${user.lastName}` : "User"}
            </p>
            <p className="text-xs text-gray-500 capitalize">
              {user?.role || "User"}
            </p>
          </div>
          <Button 
            variant="ghost" 
            size="icon"
            className="ml-auto text-gray-500 hover:text-red-500"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
