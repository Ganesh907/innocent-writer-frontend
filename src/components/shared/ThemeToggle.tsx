import { Button } from "@/components/ui/button";
import { useTheme } from "@/theme/useTheme";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      type="button"
      variant="outline"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
      aria-pressed={theme === "dark"}
    >
      {theme === "light" ? "🌙 Dark mode" : "☀️ Light mode"}
    </Button>
  );
}