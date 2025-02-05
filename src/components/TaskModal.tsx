import { useState } from "react";
import Button from "./Button";
import ToggleSwitch from "./ToggleSwitch";

type TaskModalProps = {
  isOpen: boolean;
  title: string;
  description: string;
  completed: boolean;
  onTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDescriptionChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onCompletedChange: () => void;
  onClose: () => void;
  onSave: () => void;
};

const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  title,
  description,
  completed,
  onTitleChange,
  onDescriptionChange,
  onCompletedChange,
  onClose,
  onSave,
}) => {
  const [error, setError] = useState("");

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
    <div className="fixed inset-0 flex justify-center items-center bg-black/50 backdrop-blur-lg">
      <div className="bg-white rounded-lg shadow-lg p-6 w-96">
        <h2 className="text-xl font-bold mb-4">Редактирование задачи</h2>

        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        {/* Поле ввода заголовка */}
        <label className="block text-sm font-bold text-gray-700 mb-1">Заголовок</label>
        <input
          type="text"
          value={title}
          onChange={onTitleChange}
          placeholder="Введите заголовок"
          className="w-full border border-gray-300 rounded px-4 py-2 mb-4"
        />

        {/* Поле ввода описания */}
        <label className="block text-sm font-bold text-gray-700 mb-1">Описание</label>
        <textarea
          value={description}
          onChange={onDescriptionChange}
          placeholder="Введите описание"
          className="w-full border border-gray-300 rounded px-4 py-2 mb-4"
        ></textarea>

        {/* Toggle Switch */}
        <div className="flex items-center gap-2 mb-4">
          <ToggleSwitch checked={completed} onChange={onCompletedChange} />
          <span className="text-gray-700 font-medium">Задача выполнена</span>
        </div>

        <div className="flex justify-end space-x-4">
          <Button onClick={onClose} className="bg-gray-200 text-black hover:bg-gray-300">Отмена</Button>
          <Button onClick={handleSave} className="bg-green-200 text-black hover:bg-green-300">Сохранить</Button>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;
