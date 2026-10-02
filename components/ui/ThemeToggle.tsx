"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-9 w-9 rounded-full border border-black/10 bg-black/5 dark:border-white/10 dark:bg-white/5" />
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={() =>
        setTheme(isDark ? "light" : "dark")
      }
      aria-label="Toggle theme"
      className="
        flex h-9 w-9 shrink-0 items-center justify-center
        rounded-full
        border border-black/10
        bg-black/5
        text-gray-700
        transition
        hover:border-cyan-400/50
        hover:text-cyan-500

        dark:border-white/10
        dark:bg-white/5
        dark:text-gray-300
        dark:hover:text-cyan-400
      "
    >
      {isDark ? (
        <Sun size={18} />
      ) : (
        <Moon size={18} />
      )}
    </button>
  );
}