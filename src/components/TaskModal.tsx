import { useState, useEffect } from "react";
import Button from "./Button";
import ToggleSwitch from "./ToggleSwitch";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";

type TaskModalProps = {
  isOpen: boolean;
  title: string;
  description: string;
  completed: boolean;
  date: string;
  onTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDescriptionChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onCompletedChange: () => void;
  onDateChange: (newDate: string) => void;
  onClose: () => void;
  onSave: () => void;
};

const TaskModal = ({
  isOpen,
  title,
  description,
  completed,
  date,
  onTitleChange,
  onDescriptionChange,
  onCompletedChange,
  onDateChange,
  onClose,
  onSave,
}: TaskModalProps) => {
  const [error, setError] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "Enter") {
        e.preventDefault(); // Чтобы не срабатывал стандартный submit формы
        handleSave();
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, title, description]);

  const handleSave = () => {
    if (!title.trim()) {
      setError("Заголовок не может быть пустым!");
      return;
    }
    setError("");
    onSave();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
      <div className="bg-white p-6 w-96 rounded-lg shadow-xl relative">
        <h2 className="text-xl font-bold mb-4 text-center">
          {title ? "Редактирование задачи" : "Создание задачи"}
        </h2>

        {/* Ошибка валидации */}
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        {/* Поле заголовка */}
        <div className="mb-4">
          <label className="block text-sm font-bold text-gray-700 mb-1">
            Заголовок
          </label>
          <input
            type="text"
            value={title}
            onChange={onTitleChange}
            placeholder="Введите заголовок"
            className="w-full border border-gray-300 rounded px-4 py-2"
          />
        </div>

        {/* Поле описания */}
        <div className="mb-4">
          <label className="block text-sm font-bold text-gray-700 mb-1">
            Описание
          </label>
          <textarea
            value={description}
            onChange={onDescriptionChange}
            placeholder="Введите описание"
            className="w-full border border-gray-300 rounded px-4 py-2"
          />
        </div>

        {/* Дата выбора */}
        <div className="mb-4">
          <label className="block text-sm font-bold text-gray-700 mb-1">
            Дата выполнения
          </label>
          <DatePicker
            selected={date ? new Date(date) : new Date()}
            onChange={(date) => date && onDateChange(format(date, "yyyy-MM-dd"))}
            dateFormat="yyyy-MM-dd"
            className="w-full border border-gray-300 rounded px-4 py-2"
          />
        </div>

        {/* Переключатель статуса */}
        <div className="flex items-center gap-2 mb-4">
          <ToggleSwitch checked={completed} onChange={onCompletedChange} />
          <span className="text-gray-700 font-medium">Задача выполнена</span>
        </div>

        {/* Кнопки */}
        <div className="flex justify-end space-x-4">
          <Button onClick={onClose} className="bg-gray-200 text-black hover:bg-gray-300">
            Отмена
          </Button>
          <Button onClick={handleSave} className="bg-green-200 text-black hover:bg-green-300">
            Сохранить
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;
