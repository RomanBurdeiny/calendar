import TaskList from "./components/TaskList";
import { useTheme } from "./hooks/UseTheme";
import "./index.css";

function App() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="w-screen text-center m-auto transition-colors duration-500 min-h-screen">
      <TaskList theme={theme} toggleTheme={toggleTheme} />
    </div>
  );
}

export default App;
