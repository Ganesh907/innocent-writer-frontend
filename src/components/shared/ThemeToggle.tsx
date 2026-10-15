import { Button } from "@/components/ui/button";
import { useTheme } from "@/theme/useTheme";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const nextTheme = theme === "light" ? "dark" : "light";

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      className="fixed right-4 top-4 z-50 rounded-full shadow-md"
      aria-label={`Switch to ${nextTheme} mode`}
      aria-pressed={theme === "dark"}
      title={`Switch to ${nextTheme} mode`}
    >
      <span aria-hidden="true">{theme === "light" ? "🌙" : "☀️"}</span>
    </Button>
  );
}
