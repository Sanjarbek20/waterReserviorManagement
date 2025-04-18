import React from "react";
import { useTranslation } from "react-i18next";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Globe } from "lucide-react";

interface Language {
  code: string;
  name: string;
  nativeName: string;
}

const languages: Language[] = [
  { code: "en", name: "English", nativeName: "English" },
  { code: "uz", name: "Uzbek", nativeName: "O'zbek" },
  { code: "ru", name: "Russian", nativeName: "Русский" },
  { code: "fr", name: "French", nativeName: "Français" },
  { code: "es", name: "Spanish", nativeName: "Español" },
  { code: "de", name: "German", nativeName: "Deutsch" },
];

export function LanguageSelector() {
  const { i18n } = useTranslation();

  const handleLanguageChange = (value: string) => {
    // Ensure language change is properly applied and update all components
    console.log(`Changing language to ${value}`);
    
    // Force clear cache and reload resources
    i18n.reloadResources().then(() => {
      i18n.changeLanguage(value).then(() => {
        console.log(`Language changed to ${value}`);
        
        // Force re-render of components by dispatching a custom event
        window.dispatchEvent(new Event('languageChanged'));
        
        // Force refresh if needed (in case event does not work)
        setTimeout(() => {
          window.dispatchEvent(new Event('languageChangeComplete'));
        }, 100);
      });
    });
  };

  return (
    <div className="flex items-center gap-2">
      <Globe className="h-4 w-4 text-muted-foreground" />
      <Select value={i18n.language} onValueChange={handleLanguageChange}>
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Select language" />
        </SelectTrigger>
        <SelectContent>
          {languages.map((language) => (
            <SelectItem key={language.code} value={language.code}>
              {language.nativeName}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export default LanguageSelector;