import React, { useState, useEffect } from "react";
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

const TaskList: React.FC = () => {
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskType | null>(null);
  const [editedTitle, setEditedTitle] = useState<string>("");
  const [editedDescription, setEditedDescription] = useState<string>("");
  const [editedCompleted, setEditedCompleted] = useState<boolean>(false);

  useEffect(() => {
    const savedTasks = localStorage.getItem("tasks");
    if (savedTasks) {
      try {
        const parsedTasks = JSON.parse(savedTasks);
        if (Array.isArray(parsedTasks)) {
          setTasks(parsedTasks);
        }
      } catch (error) {
        console.error("Ошибка при чтении данных из localStorage:", error);
      }
    }
  }, []);

  useEffect(() => {
    if (tasks.length === 0) {
      localStorage.removeItem("tasks");
    } else {
      localStorage.setItem("tasks", JSON.stringify(tasks));
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
    setIsModalOpen(true);
  };

  const handleSaveTask = () => {
    if (!editedTitle.trim()) return; // Валидация заголовка

    if (editingTask) {
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === editingTask.id
            ? {
                ...task,
                title: editedTitle,
                description: editedDescription,
                completed: editedCompleted,
              }
            : task
        )
      );
    } else {
      setTasks([
        ...tasks,
        {
          id: Date.now(),
          title: editedTitle,
          description: editedDescription,
          completed: editedCompleted,
          date: format(new Date(), "yyyy-MM-dd"),
        },
      ]);
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
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setEditingTask(null);
    setEditedTitle("");
    setEditedDescription("");
    setEditedCompleted(false);
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
        onTitleChange={(e) => setEditedTitle(e.target.value)}
        onDescriptionChange={(e) => setEditedDescription(e.target.value)}
        onCompletedChange={() => setEditedCompleted(!editedCompleted)}
        onClose={closeModal}
        onSave={handleSaveTask}
      />
    </div>
  );
};

export default TaskList;
