import { useState, useRef, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { format, addDays, isToday } from "date-fns";
import Task from "./Task";
import TaskModal from "./TaskModal";
import Button from "./Button";
import Header from "./Header";
import { TaskType, TaskListProps } from "./types";
import { useInfiniteScroll } from "../hooks/UseInfiniteScroll";

const TaskList: React.FC<TaskListProps> = ({ theme, toggleTheme }) => {
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [dates, setDates] = useState<Date[]>(Array.from({ length: 25 }, (_, i) => addDays(new Date(), i - 12)));
  const [editingTask, setEditingTask] = useState<TaskType | null>(null);

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const selectedDateRef = useRef<HTMLButtonElement | null>(null);

  const { loaderRef } = useInfiniteScroll(dates, setDates);

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

  const handleSaveTask = (taskData: Omit<TaskType, "id">) => {
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
  const isDark = theme === "dark";

  return (
    <div className={`min-h-screen w-full flex flex-col items-center transition-colors duration-500 ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
      <Header theme={theme} toggleTheme={toggleTheme} />
      <div className="max-w-screen-xl mx-auto px-4">
        <h1 className={`text-2xl font-bold mb-4 transition-colors duration-500 ${isDark ? 'text-white' : 'text-black'}`}>Список задач</h1>
        <div ref={scrollRef} className={`scrollbar-custom overflow-x-auto whitespace-nowrap flex gap-2 p-2 border-b scrollbar-hide transition-colors duration-500 ${isDark ? 'border-gray-600' : 'border-gray-300'}`}>
          {dates.map((date) => {
            const formattedDate = format(date, "E dd");
            const dateKey = format(date, "yyyy-MM-dd");
            const tasksForDate = tasks.filter((task) => task.date === dateKey);
            const hasUncompleted = tasksForDate.some((task) => !task.completed);
            const hasCompleted = tasksForDate.some((task) => task.completed);
            const isTodayDate = isToday(date);
            const isSelected = format(selectedDate, "E dd") === formattedDate;

            const base = "relative px-4 py-2 rounded text-sm transition-colors duration-500 flex items-center gap-2";
            const selected = `font-bold border border-gray-700 shadow-lg ${isDark ? 'bg-orange-500 text-white' : 'bg-orange-400 text-black'}`;
            const today = `${isDark ? 'bg-gray-700 text-white' : 'bg-gray-400 text-gray-700'}`;
            const normal = `hover:bg-orange-400 ${isDark ? 'bg-orange-600 text-white' : 'bg-orange-200 text-gray-700'}`;

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
          <div ref={loaderRef} className="w-1 h-1" />
        </div>

        {filteredTasks.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-lg mt-4">На этот день задач нет</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 justify-items-center mt-4">
            {filteredTasks.map((task) => (
              <Task
                key={task.id}
                {...task}
                onEdit={() => handleEditTask(task)}
                onDelete={() => setTasks((prev) => prev.filter((t) => t.id !== task.id))}
                onToggleComplete={() => setTasks((prev) => prev.map((t) => (t.id === task.id ? { ...t, completed: !t.completed } : t)))}
                isDarkMode={isDark}
              />
            ))}
          </div>
        )}

        <Button
          onClick={handleAddTask}
          children={'Добавить задачу'}
          isDarkMode={isDark}
          className={`mt-6 px-6 py-3 rounded shadow transition-colors ${isDark ? 'bg-purple-600 hover:bg-purple-700' : 'bg-purple-200 hover:bg-purple-300'}`}
        />

        <FormProvider {...formMethods}>
          <TaskModal isOpen={isModalOpen} onClose={closeModal} onSave={handleSaveTask} isDarkMode={isDark} />
        </FormProvider>
      </div>
    </div>
  );
};

export default TaskList;
