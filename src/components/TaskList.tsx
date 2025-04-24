import { useState, useEffect, useRef } from "react";
import { useForm, FormProvider } from "react-hook-form";
import Task from "./Task";
import TaskModal from "./TaskModal";
import { format, addDays, subDays, isToday } from "date-fns";
import Button from "./Button";
import { TaskType } from "./types";
import Header from "./Header";
import { useInView } from "react-intersection-observer";

const TaskList = () => {
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [dates, setDates] = useState<Date[]>(Array.from({ length: 21 }, (_, i) => addDays(new Date(), i - 10)));
  const [editingTask, setEditingTask] = useState<TaskType | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const stored = localStorage.getItem("theme");
    return stored === "dark";
  });
  const [hasInitialized, setHasInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const selectedDateRef = useRef<HTMLButtonElement | null>(null);

  const { ref: startRef, inView: startInView } = useInView({ threshold: 1 });
  const { ref: endRef, inView: endInView } = useInView({ threshold: 1 });

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
        if (Array.isArray(parsedTasks)) setTasks(parsedTasks);
        else localStorage.removeItem("tasks");
      } catch {
        localStorage.removeItem("tasks");
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("tasks", tasks.length ? JSON.stringify(tasks) : "");
  }, [tasks]);

  useEffect(() => {
    const classList = document.documentElement.classList;
    if (isDarkMode) {
      classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  useEffect(() => {
    if (!hasInitialized) {
      const timeout = setTimeout(() => setHasInitialized(true), 100);
      return () => clearTimeout(timeout);
    }
    if (isLoading) return;

    if (startInView) {
      setIsLoading(true);
      const firstDate = dates[0];
      const newDates = Array.from({ length: 2 }, (_, i) => subDays(firstDate, i + 1)).reverse();
      setDates((prev) => [...newDates, ...prev]);
      console.log(newDates)

      const prevScrollLeft = scrollRef.current?.scrollLeft  || 0;
      const prevScrollWidth = scrollRef.current?.scrollWidth || 0;

      setTimeout(() => {
        if (scrollRef.current) {
          const newScrollWidth = scrollRef.current.scrollWidth;
          scrollRef.current.scrollLeft = prevScrollLeft + (newScrollWidth - prevScrollWidth);
        }
        setIsLoading(false);
      }, 0);
    } else if (endInView) {
      setIsLoading(true);
      const lastDate = dates[dates.length - 1];
      const newDates = Array.from({ length: 7 }, (_, i) => addDays(lastDate, i + 1));
      setDates((prev) => [...prev, ...newDates]);
      console.log(newDates)
      setTimeout(() => setIsLoading(false), 100);
    }
  }, [startInView, endInView, hasInitialized, isLoading, dates]);

  useEffect(() => {
    setTimeout(() => {
      selectedDateRef.current?.scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" });
    }, 0);
  }, []);

  useEffect(() => {
    const currentRef = scrollRef.current;
    if (!currentRef) return;
    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY !== 0) {
        e.preventDefault();
        currentRef.scrollLeft += e.deltaY;
      }
    };
    currentRef.addEventListener("wheel", handleWheel, { passive: false });
    return () => currentRef.removeEventListener("wheel", handleWheel);
  }, []);

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
      setTasks((prevTasks) => prevTasks.map((task) => (task.id === editingTask.id ? { ...task, ...taskData } : task)));
    } else {
      const newTask: TaskType = { id: Date.now(), ...taskData };
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
    <div className={`min-h-screen w-full flex flex-col items-center transition-colors duration-500 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
      <Header isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
      <div className="max-w-screen-xl mx-auto px-4">
        <h1 className={`text-2xl font-bold mb-4 transition-colors duration-500 ${isDarkMode ? 'text-white' : 'text-black'}`}>Список задач</h1>
        <div ref={scrollRef} className={`scrollbar-custom overflow-x-auto whitespace-nowrap flex gap-2 p-2 border-b scrollbar-hide transition-colors duration-500 
          ${isDarkMode ? 'border-gray-600' : 'border-gray-300'}`}>
          <div ref={startRef} className="w-1 h-1" />
          {dates.map((date) => {
            const formattedDate = format(date, "E dd");
            const dateKey = format(date, "yyyy-MM-dd");
            const tasksForDate = tasks.filter((task) => task.date === dateKey);
            const hasUncompleted = tasksForDate.some((task) => !task.completed);
            const hasCompleted = tasksForDate.some((task) => task.completed);
            const isTodayDate = isToday(date);
            const isSelected = format(selectedDate, "E dd") === formattedDate;

            const base = "relative px-4 py-2 rounded text-sm transition-colors duration-500 flex items-center gap-2";
            const selected = `font-bold border border-gray-700 shadow-lg ${isDarkMode ? 'bg-orange-500 text-white' : 'bg-orange-400 text-black'}`;
            const today = `${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-400 text-gray-700'}`;
            const normal = `hover:bg-orange-400 ${isDarkMode ? 'bg-orange-600 text-white' : 'bg-orange-200 text-gray-700'}`;

            return (
              <button
                key={formattedDate}
                ref={isSelected ? selectedDateRef : null}
                onClick={() => setSelectedDate(date)}
                className={`${base} ${isSelected ? selected : isTodayDate ? today : normal}`}
              >
                {formattedDate}
                <div className="absolute bottom-1 right-1 flex gap-1">
                  {hasUncompleted && <span className="w-2 h-2 bg-red-700 rounded-full"></span>}
                  {hasCompleted && <span className="w-2 h-2 bg-green-600 rounded-full"></span>}
                </div>
              </button>
            );
          })}
          <div ref={endRef} className="w-1 h-1" />
        </div>
        {filteredTasks.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-lg mt-4">На этот день задач нет</p>
        ) : (
          <div className="flex flex-wrap gap-4 justify-center mt-4">
            {filteredTasks.map((task) => (
              <Task
                key={task.id}
                {...task}
                onEdit={() => handleEditTask(task)}
                onDelete={() => setTasks((prev) => prev.filter((t) => t.id !== task.id))}
                onToggleComplete={() => setTasks((prev) => prev.map((t) => (t.id === task.id ? { ...t, completed: !t.completed } : t)))}
                isDarkMode={isDarkMode}
              />
            ))}
          </div>
        )}

        <Button
          onClick={handleAddTask}
          children={'Добавить задачу'}
          isDarkMode={isDarkMode}
          className={`mt-6 px-6 py-3 rounded shadow transition ${isDarkMode ? 'bg-purple-600 hover:bg-purple-700' : 'bg-purple-200 hover:bg-purple-300'}`}
        />

        <FormProvider {...formMethods}>
          <TaskModal isOpen={isModalOpen} onClose={closeModal} onSave={handleSaveTask} isDarkMode={isDarkMode} />
        </FormProvider>
      </div>
    </div>
  );
};

export default TaskList