import React from "react";
import Button from "./Button";

type TaskProps = {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  date: string;
  onEdit: () => void;
  onDelete: () => void;
  onToggleComplete: () => void;
};

const Task: React.FC<TaskProps> = ({ id, title, description, completed, date, onEdit, onDelete, onToggleComplete }) => {
  return (
    <div className="mb-4 p-4 bg-white shadow rounded-md">
      <h2 className={`text-xl font-bold ${completed ? "line-through text-gray-500" : "text-black"}`}>
        {title}
      </h2>
      <p className={`mt-2 ${completed ? "line-through text-gray-500" : "text-black"}`}>
        {description}
      </p>
      <p className="text-sm text-gray-500 mt-1">Дата: {date}</p>

      {/* Контейнер кнопок + toggle switch */}
      <div className="flex items-center gap-4 mt-4">
        <Button onClick={onEdit} className="bg-blue-200 text-black hover:bg-blue-300">
          Редактировать
        </Button>
        <Button onClick={onDelete} className="bg-red-200 text-black hover:bg-red-300">
          Удалить
        </Button>

        {/* Toggle Switch вместо чекбокса */}
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={completed}
            onChange={onToggleComplete}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-300 peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-5 peer-checked:bg-green-500 transition-all duration-300 after:content-[''] after:absolute after:top-0.5 after:left-1 after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
        </label>
      </div>
    </div>
  );
};

export default Task;
