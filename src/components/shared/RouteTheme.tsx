
import { useEffect, type ReactNode } from "react";
import { useTheme } from "@/theme/useTheme";

interface RouteThemeProps {
  children: ReactNode;
  theme?: "light" | "dark";
}

export function RouteTheme({
  children,
  theme = "dark",
}: RouteThemeProps) {
  const { setTheme } = useTheme();

  useEffect(() => {
    setTheme(theme);
  }, [setTheme, theme]);

  return <>{children}</>;
}
