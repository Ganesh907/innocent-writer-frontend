import { Button } from "@/components/ui/button";
import { useTheme } from "@/theme/useTheme";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const nextTheme = theme === "light" ? "dark" : "light";

  return (
    <Button
      type="button"
      variant="outline"
      onClick={toggleTheme}
      className="
        fixed bottom-4 right-4 z-50
        !h-11 !w-11 rounded-full p-0
        border border-slate-200
        bg-white text-slate-800
        shadow-lg shadow-slate-900/10
        transition-all duration-200
        hover:scale-105 hover:bg-slate-100 hover:text-slate-900
        dark:border-slate-700
        dark:bg-slate-900 dark:text-amber-300
        dark:shadow-black/30
        dark:hover:bg-slate-800 dark:hover:text-amber-200
        sm:bottom-8 sm:right-8
        sm:!h-20 sm:!w-20
      "
      aria-label={`Switch to ${nextTheme} mode`}
      aria-pressed={theme === "dark"}
      title={`Switch to ${nextTheme} mode`}
    >
      {theme === "light" ? (
        <Moon className="!h-5 !w-5 sm:!h-9 sm:!w-9" />
      ) : (
        <Sun className="!h-5 !w-5 sm:!h-9 sm:!w-9" />
      )}
    </Button>
  );
}