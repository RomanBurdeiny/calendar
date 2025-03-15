import { useState, useEffect, useRef, useCallback } from "react";
import { useForm, FormProvider } from "react-hook-form";
import Task from "./Task";
import TaskModal from "./TaskModal";
import { format, addDays, subDays } from "date-fns";
import Button from "./Button";
import {TaskType} from "./types"
import Header from "./Header";

// type TaskType = {
//   id: number;
//   title: string;
//   description: string;
//   completed: boolean;
//   date: string; // Дата хранится в формате "yyyy-MM-dd" в задачах
// };

const TaskList = () => {
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [dates, setDates] = useState<Date[]>(Array.from({ length: 14 }, (_, i) => addDays(subDays(new Date(), 7), i)));
  const [editingTask, setEditingTask] = useState<TaskType | null>(null);

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const selectedDateRef = useRef<HTMLButtonElement | null>(null);

  const formMethods = useForm({
    defaultValues: {
      title: "",
      description: "",
      completed: false,
      date: format(new Date(), "yyyy-MM-dd"), // Дата хранится в "yyyy-MM-dd"
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
    console.log("Текущие задачи", tasks);
  }, [tasks]);

  const handleScroll = useCallback(() => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      if (scrollLeft + clientWidth >= scrollWidth - 10) {
        const lastDate = dates[dates.length - 1]; // Берем последнюю дату
        const newDates = Array.from({ length: 7 }, (_, i) => addDays(lastDate, i + 1));
        setDates((prev) => [...prev, ...newDates]);
      }
    }
  }, [dates]);

  useEffect(() => {
    if (selectedDateRef.current) {
      selectedDateRef.current.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
    }
  }, [selectedDate]);

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
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => setIsDarkMode((prev) => !prev);
  
  return (
    <div className="dark:bg-black bg-gray-100 min-h-screen flex flex-col items-center">
     <Header isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode}/>
      <h1 className="text-2xl font-bold text-black mb-4">Список задач</h1>

      <div ref={scrollRef} className="w-full max-w-2xl overflow-x-auto whitespace-nowrap flex gap-2 p-2 border-b border-gray-300 scrollbar-hide">
        {dates.map((date) => {
          const formattedDate = format(date, "E dd"); // Форматируем дату перед рендерингом
          const hasTasks = tasks.some((task) => task.date === format(date, "yyyy-MM-dd"));
          return (
            <button
              key={formattedDate}
              ref={format(selectedDate, "E dd") === formattedDate ? selectedDateRef : null}
              onClick={() => setSelectedDate(date)}
              className={`relative px-4 py-2 rounded text-sm transition flex items-center gap-2 ${
                format(selectedDate, "E dd") === formattedDate ? "bg-gray-400 text-black font-bold border border-gray-700 shadow-lg" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {formattedDate}
              {hasTasks && <span className="absolute right-1 top-1 w-2.5 h-2.5 bg-orange-500 rounded-full"></span>}
            </button>
          );
        })}
      </div>

      {filteredTasks.length === 0 ? (
        <p className="text-gray-500 text-lg mt-4">На этот день задач нет</p>
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
            />
          ))}
        </div>
      )}

      <Button onClick={handleAddTask} className="mt-6 bg-purple-200 text-black px-6 py-3 rounded shadow hover:bg-purple-300 transition">
        Добавить задачу
      </Button>

      <FormProvider {...formMethods}>
        <TaskModal isOpen={isModalOpen} onClose={closeModal} onSave={handleSaveTask} />
      </FormProvider>
    </div>
  );
};

export default TaskList;
