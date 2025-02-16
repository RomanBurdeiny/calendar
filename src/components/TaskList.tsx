import { useState, useEffect } from "react";
import Task from "./Task";
import TaskModal from "./TaskModal";
import { format } from "date-fns";
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
  const [editingTask, setEditingTask] = useState<TaskType | null>(null);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedDescription, setEditedDescription] = useState("");
  const [editedCompleted, setEditedCompleted] = useState(false);
  const [editedDate, setEditedDate] = useState(format(new Date(), "yyyy-MM-dd"));

  // ✅ Загружаем задачи при старте
  useEffect(() => {
    const savedTasks = localStorage.getItem("tasks");
    if (savedTasks) {
      try {
        const parsedTasks = JSON.parse(savedTasks);
        if (Array.isArray(parsedTasks)) {
          setTasks(parsedTasks);
        } else {
          console.warn("Ошибка: данные в localStorage не массив, сбрасываем...");
          localStorage.removeItem("tasks");
        }
      } catch (error) {
        console.error("Ошибка загрузки данных из localStorage:", error);
        localStorage.removeItem("tasks");
      }
    }
  }, []);

  // ✅ Сохраняем задачи при каждом изменении
  useEffect(() => {
    if (tasks.length > 0) {
      localStorage.setItem("tasks", JSON.stringify(tasks));
    } else {
      localStorage.removeItem("tasks"); // Удаляем, если задач нет
    }
  }, [tasks]);

  const handleToggleComplete = (id: number) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleEditTask = (task: TaskType) => {
    setEditingTask(task);
    setEditedTitle(task.title);
    setEditedDescription(task.description);
    setEditedCompleted(task.completed);
    setEditedDate(task.date);
    setIsModalOpen(true);
  };

  const handleSaveTask = () => {
    if (!editedTitle.trim()) return;

    if (editingTask) {
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === editingTask.id
            ? { ...task, title: editedTitle, description: editedDescription, completed: editedCompleted, date: editedDate }
            : task
        )
      );
    } else {
      const newTask: TaskType = {
        id: Date.now(),
        title: editedTitle,
        description: editedDescription,
        completed: editedCompleted,
        date: editedDate,
      };
      setTasks([...tasks, newTask]);
    }
    closeModal();
  };

  const handleDeleteTask = (id: number) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
  };

  const handleAddTask = () => {
    setEditingTask(null);
    setEditedTitle("");
    setEditedDescription("");
    setEditedCompleted(false);
    setEditedDate(format(new Date(), "yyyy-MM-dd"));
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setEditingTask(null);
    setEditedTitle("");
    setEditedDescription("");
    setEditedCompleted(false);
    setEditedDate(format(new Date(), "yyyy-MM-dd"));
    setIsModalOpen(false);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen flex flex-col items-center">
      <h1 className="text-2xl font-bold text-black mb-6">Список задач</h1>

      {tasks.length === 0 ? (
        <p className="text-gray-500 text-lg mt-4">Список задач пуст</p>
      ) : (
        <div className="w-full max-w-2xl">
          {tasks.map((task) => (
            <Task
              key={task.id}
              {...task}
              onEdit={() => handleEditTask(task)}
              onDelete={() => handleDeleteTask(task.id)}
              onToggleComplete={() => handleToggleComplete(task.id)}
            />
          ))}
        </div>
      )}

      <Button onClick={handleAddTask} className="mt-6 bg-purple-200 text-black px-6 py-3 rounded shadow hover:bg-purple-300 transition">
        Добавить задачу
      </Button>

      <TaskModal
        isOpen={isModalOpen}
        title={editedTitle}
        description={editedDescription}
        completed={editedCompleted}
        date={editedDate}
        onTitleChange={(e) => setEditedTitle(e.target.value)}
        onDescriptionChange={(e) => setEditedDescription(e.target.value)}
        onCompletedChange={() => setEditedCompleted(!editedCompleted)}
        onDateChange={setEditedDate}
        onClose={closeModal}
        onSave={handleSaveTask}
      />
    </div>
  );
};

export default TaskList;
