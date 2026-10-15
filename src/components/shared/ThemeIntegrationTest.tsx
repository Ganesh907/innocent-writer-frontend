import { Button } from "@/components/ui/button";
import { useTheme } from "@/theme/useTheme";

export function ThemeIntegrationTest() {
  const { theme, toggleTheme } = useTheme();

  return (
    <section className="space-y-4 rounded-xl border border-border bg-background p-6 text-foreground">
      <h2 className="text-lg font-semibold">Theme Integration Test</h2>

      {/* Tailwind CSS test */}
      <div className="rounded-lg border border-border bg-card p-4 text-card-foreground">
        <p className="font-medium">Tailwind CSS</p>
        <p className="text-sm text-muted-foreground">
          Testing shared theme tokens with Tailwind utilities.
        </p>
      </div>

      {/* shadcn/ui test */}
      <div className="space-y-2">
        <p className="text-sm font-medium">shadcn/ui</p>
        <Button onClick={toggleTheme}>
          Switch to {theme === "light" ? "Dark" : "Light"} Mode
        </Button>
      </div>

      <p className="text-sm text-muted-foreground">Current theme: {theme}</p>
    </section>
  );
}
