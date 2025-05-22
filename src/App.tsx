import TaskList from "./components/TaskList";
import LogIn from "./components/LogIn";
import SignUp from "./components/SignUp";
import { useTheme } from "./hooks/UseTheme";
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import "./index.css";

function App() {
  const { theme, toggleTheme } = useTheme();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<TaskList theme={theme} toggleTheme={toggleTheme} />}/>
        <Route path="/login" element={<LogIn/>}/>
        <Route path="/signup" element={<SignUp/>}/>
      </Routes>
    </BrowserRouter>
    // <div className="w-screen text-center m-auto transition-colors duration-500 min-h-screen">
    //   <TaskList theme={theme} toggleTheme={toggleTheme} />
    // </div>
  );
}

export default App;
