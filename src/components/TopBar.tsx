import { Moon, Sun, Shield, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useStore } from "@/store/useStore";
import { Role } from "@/lib/types";
import { useEffect } from "react";

export function TopBar() {
  const { role, setRole, darkMode, setDarkMode } = useStore();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  return (
    <header className="h-14 flex items-center justify-between border-b px-4 bg-card">
      <div className="flex items-center gap-2">
        <SidebarTrigger />
        <h1 className="text-lg font-semibold hidden sm:block capitalize">Artha | {role}</h1>
      </div>
      <div className="flex items-center gap-3">
        <Select value={role} onValueChange={(v) => setRole(v as Role)}>
          <SelectTrigger className="w-[140px]">
            <div className="flex items-center gap-2">
              {role === "admin" ? (
                <Shield className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
              <SelectValue />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="viewer">Viewer</SelectItem>
          </SelectContent>
        </Select>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setDarkMode(!darkMode)}
        >
          {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
      </div>
    </header>
  );
}
