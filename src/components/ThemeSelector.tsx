"use client";

import { useEffect } from "react";
import { Sparkles } from "lucide-react";

interface Theme {
  name: string;
  icon: React.ReactNode;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  className: string;
}

const themes: Theme[] = [
  {
    name: "Poop Fun",
    icon: <Sparkles className="w-4 h-4" />,
    colors: {
      primary: "rgb(245, 158, 11)", // amber-500
      secondary: "rgb(251, 191, 36)", // amber-400
      accent: "rgb(139, 69, 19)", // brown-600
      background: "rgb(255, 251, 235)", // amber-50
      text: "rgb(87, 54, 21)", // yellow-900
    },
    className: "theme-poop",
  },
];

export default function ThemeSelector() {
  useEffect(() => {
    // Always use Poop Fun theme
    const theme = themes[0];
    const root = document.documentElement;

    // Set CSS custom properties
    root.style.setProperty("--theme-primary", theme.colors.primary);
    root.style.setProperty("--theme-secondary", theme.colors.secondary);
    root.style.setProperty("--theme-accent", theme.colors.accent);
    root.style.setProperty("--theme-background", theme.colors.background);
    root.style.setProperty("--theme-text", theme.colors.text);

    // Update body classes for poop theme specific styles
    document.body.className = document.body.className.replace(/theme-\w+/g, '');
    document.body.classList.add(theme.className);

    // Save to localStorage
    localStorage.setItem("poolabs-theme", theme.name);

    // Dispatch custom event for other components
    window.dispatchEvent(new CustomEvent("themeChange", { detail: theme.name }));
  }, []);

  return null; // Theme selector removed - only Poop Fun theme available
}