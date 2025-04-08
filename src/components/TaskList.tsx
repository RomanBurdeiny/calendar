import { useState, useEffect, useRef, useCallback } from "react";
import { useForm, FormProvider } from "react-hook-form";
import Task from "./Task";
import TaskModal from "./TaskModal";
import { format, addDays, subDays, isToday } from "date-fns";
import Button from "./Button";
import { TaskType } from "./types";
import Header from "./Header";

const TaskList = () => {
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [dates, setDates] = useState<Date[]>(Array.from({ length: 15 }, (_, i) => addDays(new Date(), i - 7)));
  const [editingTask, setEditingTask] = useState<TaskType | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const stored = localStorage.getItem("theme");
    return stored === "dark"
  })

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const selectedDateRef = useRef<HTMLButtonElement | null>(null);

  const formMethods = useForm({
    defaultValues: {
      title: "",
      description: "",
      completed: false,
      date: format(new Date(), "yyyy-MM-dd"),
    },
  });

  useEffect(() => {
    const savedTasks = localStorage.getItem("tasks");
    if (savedTasks) {
      try {
        const parsedTasks = JSON.parse(savedTasks);
        if (Array.isArray(parsedTasks)) {
          setTasks(parsedTasks);
        } else {
          localStorage.removeItem("tasks");
        }
      } catch (error) {
        console.error("Ошибка загрузки данных из localStorage:", error);
        localStorage.removeItem("tasks");
      }
    }
  }, []);

  useEffect(() => {
    if (tasks.length > 0) {
      localStorage.setItem("tasks", JSON.stringify(tasks));
    } else {
      localStorage.removeItem("tasks");
    }
  }, [tasks]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  const handleScroll = useCallback(() => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;

      if (scrollLeft + clientWidth >= scrollWidth - 10) {
        const lastDate = dates[dates.length - 1];
        const newDates = Array.from({ length: 7 }, (_, i) => addDays(lastDate, i + 1));
        setDates((prev) => [...prev, ...newDates]);
      }

      if (scrollLeft <= 10) {
        const firstDate = dates[0];
        const newDates = Array.from({ length: 7 }, (_, i) => subDays(firstDate, i + 1)).reverse();
        setDates((prev) => [...newDates, ...prev]);

        const prevScrollLeft = scrollRef.current.scrollLeft;
        const prevScrollWidth = scrollRef.current.scrollWidth;

        setTimeout(() => {
          if (scrollRef.current) {
            const newScrollWidth = scrollRef.current.scrollWidth;
            scrollRef.current.scrollLeft = prevScrollLeft + (newScrollWidth - prevScrollWidth);
          }
        }, 0);
      }
    }
  }, [dates]);

  useEffect(() => {
    setTimeout(() => {
      if (selectedDateRef.current) {
        selectedDateRef.current.scrollIntoView({ inline: "center", block: "nearest", behavior: "auto" });
      }
    }, 0);
  }, []);

  useEffect(() => {
    const currentRef = scrollRef.current;
    if (currentRef) {
      currentRef.addEventListener("scroll", handleScroll);
      currentRef.addEventListener("wheel", (e) => {
        e.preventDefault();
        currentRef.scrollLeft += e.deltaY;
      });
    }
    return () => {
      if (currentRef) {
        currentRef.removeEventListener("scroll", handleScroll);
        currentRef.removeEventListener("wheel", (e) => {
          e.preventDefault();
          currentRef.scrollLeft += e.deltaY;
        });
      }
    };
  }, [handleScroll]);

  const handleAddTask = () => {
    setEditingTask(null);
    formMethods.reset({
      title: "",
      description: "",
      completed: false,
      date: format(selectedDate, "yyyy-MM-dd"),
    });
    setIsModalOpen(true);
  };

  const handleEditTask = (task: TaskType) => {
    setEditingTask(task);
    formMethods.reset({
      title: task.title,
      description: task.description,
      completed: task.completed,
      date: task.date,
    });
    setIsModalOpen(true);
  };

  const handleSaveTask = (taskData: { title: string; description: string; completed: boolean; date: string }) => {
    if (editingTask) {
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task.id === editingTask.id ? { ...task, ...taskData } : task))
      );
    } else {
      const newTask: TaskType = {
        id: Date.now(),
        ...taskData,
      };
      setTasks((prevTasks) => [...prevTasks, newTask]);
    }
    setIsModalOpen(false);
    setEditingTask(null);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };

  const filteredTasks = tasks.filter((task) => task.date === format(selectedDate, "yyyy-MM-dd"));
  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);

  return (
    <div className={isDarkMode 
    ? 'min-h-screen flex flex-col items-center bg-black' 
    : 'min-h-screen flex flex-col items-center bg-gray-100'}>
      <Header isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
      <h1 className={isDarkMode 
      ? 'dark text-2xl font-bold mb-4 text-white' 
      : 'text-2xl font-bold mb-4 text-black'}>Список задач
      </h1>

      <div ref={scrollRef} className="scrollbar-custom w-full max-w-2xl overflow-x-auto whitespace-nowrap flex gap-2 p-2 border-b border-gray-300 dark:border-gray-600 scrollbar-hide">
        {dates.map((date) => {
          const formattedDate = format(date, "E dd");
          const dateKey = format(date, "yyyy-MM-dd");
          const tasksForDate = tasks.filter((task) => task.date === dateKey);
          const hasUncompleted = tasksForDate.some((task) => !task.completed);
          const hasCompleted = tasksForDate.some((task) => task.completed);
          const isTodayDate = isToday(date);

          return (
            <button
              key={formattedDate}
              ref={format(selectedDate, "E dd") === formattedDate ? selectedDateRef : null}
              onClick={() => setSelectedDate(date)}
              className={`relative px-4 py-2 rounded text-sm transition flex items-center gap-2 
                ${format(selectedDate, "E dd") === formattedDate
                ? `font-bold border border-gray-700 shadow-lg 
                ${isDarkMode 
                ? 'bg-orange-500 text-white' 
                : ' bg-orange-400 text-black'}`
                : isTodayDate
                ? `${isDarkMode 
                  ? 'bg-gray-700 text-white' 
                  : 'bg-gray-400 text-gray-700'}`
                : `hover:bg-orange-400 
                ${isDarkMode 
                ? 'bg-orange-600 text-white' 
                : 'bg-orange-200 text-gray-700'}`}`}
            >
              {formattedDate}
              <div className="absolute bottom-1 right-1 flex gap-1">
                {hasUncompleted && <span className="w-2 h-2 bg-red-600 rounded-full"></span>}
                {hasCompleted && <span className="w-2 h-2 bg-green-600 rounded-full"></span>}
              </div>
            </button>
          );
        })}
      </div>

      {filteredTasks.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 text-lg mt-4">На этот день задач нет</p>
      ) : (
        <div className="w-full max-w-2xl mt-4">
          {filteredTasks.map((task) => (
            <Task
              key={task.id}
              {...task}
              onEdit={() => handleEditTask(task)}
              onDelete={() => setTasks((prev) => prev.filter((t) => t.id !== task.id))}
              onToggleComplete={() =>
                setTasks((prev) =>
                  prev.map((t) => (t.id === task.id ? { ...t, completed: !t.completed } : t))
                )
              }
              isDarkMode={isDarkMode}
            />
          ))}
        </div>
      )}

      <Button onClick={handleAddTask} 
      children={'Добавить задачу'} 
      isDarkMode={isDarkMode} 
      className={`mt-6 px-6 py-3 rounded shadow transition 
        ${isDarkMode 
        ? 'bg-purple-600 hover:bg-purple-700'
        : 'bg-purple-200 hover:bg-purple-300'}`} 
       />

      <FormProvider {...formMethods}>
        <TaskModal 
        isOpen={isModalOpen} 
        onClose={closeModal} 
        onSave={handleSaveTask} 
        isDarkMode={isDarkMode} />
      </FormProvider>
    </div>
  );
};

export default TaskList;