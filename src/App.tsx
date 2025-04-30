import { useEffect, useState } from "react";
import TaskList from "./components/TaskList";
import "./App.css";

function App() {
  const getSystemTheme = () =>
    window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

  const [systemTheme, setSystemTheme] = useState<"light" | "dark">(getSystemTheme);
  const [userSelectedTheme, setUserSelectedTheme] = useState<"light" | "dark" | null>(() => {
    const stored = localStorage.getItem("theme");
    return stored === "light" || stored === "dark" ? stored : null;
  });

  const currentTheme = userSelectedTheme || systemTheme;

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => setSystemTheme(media.matches ? "dark" : "light");
    media.addEventListener("change", handler);
    return () => media.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (currentTheme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [currentTheme]);

  const toggleTheme = () => {
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    setUserSelectedTheme(newTheme);
    if (newTheme === systemTheme) {
      localStorage.removeItem("theme");
      setUserSelectedTheme(null);
    } else {
      localStorage.setItem("theme", newTheme);
    }
  };

  return (
    <div className="transition-colors duration-500 min-h-screen">
      <TaskList theme={currentTheme} toggleTheme={toggleTheme} />
    </div>
  );
}

export default App;
