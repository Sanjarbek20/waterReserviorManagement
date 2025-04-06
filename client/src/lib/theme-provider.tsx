import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type ThemeMode = "light" | "dark" | "system";
type DarkVariant = "standard" | "deep" | "twilight";
type Theme = ThemeMode | `dark-${DarkVariant}`;

type ThemeProviderProps = {
  children: ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isDarkMode: boolean;
  darkVariant: DarkVariant;
};

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
  isDarkMode: false,
  darkVariant: "standard"
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "vite-ui-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => {
      try {
        return (localStorage.getItem(storageKey) as Theme) || defaultTheme;
      } catch (error) {
        // Handle localStorage not being available (e.g., during SSR)
        return defaultTheme;
      }
    }
  );

  // Determine if the current theme is a dark mode
  const isDarkMode = theme === "dark" || 
                    theme.startsWith("dark-") || 
                    (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);

  // Extract the dark variant (if applicable)
  const darkVariant: DarkVariant = theme.startsWith("dark-") 
                                ? theme.split("-")[1] as DarkVariant 
                                : "standard";

  useEffect(() => {
    // Skip effect on server side
    if (typeof window === 'undefined') return;

    const root = window.document.documentElement;
    
    // Remove all theme classes
    root.classList.remove("light", "dark", "dark-standard", "dark-deep", "dark-twilight");
    
    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";
      
      root.classList.add(systemTheme);
      return;
    }
    
    // Add the theme class
    root.classList.add(theme);
  }, [theme]);

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      try {
        localStorage.setItem(storageKey, theme);
      } catch (error) {
        // Ignore localStorage errors
      }
      setTheme(theme);
    },
    isDarkMode,
    darkVariant
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);
  
  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");
  
  return context;
};