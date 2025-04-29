import { useEffect, useState } from "react";
import TaskList from "./components/TaskList";
import "./App.css";

function App() {
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme === "light" || storedTheme === "dark") {
      return storedTheme;
    }
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    return prefersDark ? "dark" : "light";
  });

  // ✅ Подписка на системную смену темы
  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = () => {
      const stored = localStorage.getItem("theme");
      if (!stored) {
        setTheme(media.matches ? "dark" : "light");
      }
    };

    media.addEventListener("change", handleChange);
    return () => media.removeEventListener("change", handleChange);
  }, []);

  // ✅ Применение темы
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      console.log(theme)
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      console.log(theme)
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [theme]);

  // ✅ Тогглер вручную
  const toggleTheme = () => {
    localStorage.setItem("theme", theme === "dark" ? "light" : "dark");
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <div className="transition-colors duration-500 min-h-screen">
      <TaskList theme={theme} toggleTheme={toggleTheme} />
    </div>
  );
}

export default App;
