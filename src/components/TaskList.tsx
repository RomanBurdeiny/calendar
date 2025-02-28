import { useState, useEffect, useRef, useCallback } from "react";
import { useForm, FormProvider } from "react-hook-form";
import Task from "./Task";
import TaskModal from "./TaskModal";
import { format, addDays, subDays } from "date-fns";
import Button from "./Button";

type TaskType = {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  date: string;
};

const TaskList = () => {
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [dates, setDates] = useState(
    Array.from({ length: 14 }, (_, i) => format(addDays(subDays(new Date(), 7), i), "yyyy-MM-dd"))
  );
  const [editingTask, setEditingTask] = useState<TaskType | null>(null);

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
    console.log("Текущие задачи", tasks);
  }, [tasks]);

  const handleScroll = useCallback(() => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      if (scrollLeft + clientWidth >= scrollWidth - 10) {
        const newDates = Array.from({ length: 7 }, (_, i) => format(addDays(new Date(dates[dates.length - 1]), i + 1), "yyyy-MM-dd"));
        setDates((prev) => [...prev, ...newDates]);
      }
    }
  }, [dates]);

  useEffect(() => {
    if (selectedDateRef.current) {
      selectedDateRef.current.scrollIntoView({ behavior: "smooth", inline: "center" });
    }
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
      date: selectedDate,
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

  const filteredTasks = tasks.filter((task) => task.date === selectedDate);

  return (
    <div className="p-6 bg-gray-100 min-h-screen flex flex-col items-center">
      <h1 className="text-2xl font-bold text-black mb-4">Список задач</h1>

      <div ref={scrollRef} className="w-full max-w-2xl overflow-x-auto whitespace-nowrap flex gap-2 p-2 border-b border-gray-300 scrollbar-hide">
        {dates.map((date) => {
          const hasTasks = tasks.some((task) => task.date === date);
          return (
            <button
              key={date}
              ref={date === selectedDate ? selectedDateRef : null}
              onClick={() => setSelectedDate(date)}
              className={`relative px-4 py-2 rounded text-sm transition flex items-center gap-2 ${
                selectedDate === date ? "bg-gray-400 text-black font-bold border border-gray-700 shadow-lg" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {date}
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
