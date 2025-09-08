"use client";
import * as React from "react";
import { useTheme } from "next-themes";
import { Sun, Moon, Laptop } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export function ThemeSwitcher() {
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  const icon =
    theme === "dark" ? <Moon className="size-5" /> : theme === "light" ? <Sun className="size-5" /> : <Laptop className="size-5" />;
  return (
    <button
      type="button"
      aria-label="Change theme"
      onClick={() => {
        if (theme === "light") setTheme("dark");
        else if (theme === "dark") setTheme("system");
        else setTheme("light");
      }}
      className={cn(buttonVariants({ variant: "ghost", size: "default" }), "w-full flex items-center gap-2 justify-start")}
    >
      {icon}
      <span>Change theme</span>
    </button>
  );
} 