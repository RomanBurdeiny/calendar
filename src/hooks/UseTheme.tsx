import { useEffect, useState } from "react";

export const useTheme = () => {
  const getSystemTheme = () =>
    window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

  const [systemTheme, setSystemTheme] = useState<"light" | "dark">(getSystemTheme);
  const [userSelectedTheme, setUserSelectedTheme] = useState<"light" | "dark" | null>(() => {
    const stored = localStorage.getItem("theme");
    return stored === "light" || stored === "dark" ? stored : null;
  });

  const currentTheme: "light" | "dark" = userSelectedTheme || systemTheme;

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => setSystemTheme(media.matches ? "dark" : "light");
    media.addEventListener("change", handler);
    return () => media.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", currentTheme === "dark");
  }, [currentTheme]);

  const toggleTheme = () => {
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    if (newTheme === systemTheme) {
      localStorage.removeItem("theme");
      setUserSelectedTheme(null);
    } else {
      localStorage.setItem("theme", newTheme);
      setUserSelectedTheme(newTheme);
    }
  };

  return { theme: currentTheme, toggleTheme };
};
