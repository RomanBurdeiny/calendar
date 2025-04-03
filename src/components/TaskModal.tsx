import { Controller, useFormContext } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Button from "./Button";
import ToggleSwitch from "./ToggleSwitch";
import { TaskModalProps } from "./types";

const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose, onSave, isDarkMode }) => {
  const { handleSubmit, control, reset, watch } = useFormContext();

  if (!isOpen) return null;

  const handleSave = () => {
    const taskData = {
      title: watch("title"),
      description: watch("description"),
      completed: watch("completed"),
      date: watch("date"),
    };
    if (!taskData.title.trim()) {
      alert("Заголовок не может быть пустым!");
      return;
    }

    onSave(taskData);
    reset();
    onClose();
  };

  return (
    <div 
    className={`fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 
    ${isDarkMode 
    ? 'text-white' 
    :'text-black'}`}>
      <div 
      className={`p-6 w-96 rounded-lg shadow-xl  
      ${isDarkMode 
      ? ' bg-gray-900 text-white' 
      :'bg-white text-black'}`}>
        <h2 
        className={`text-xl font-bold mb-4 text-center  
        ${isDarkMode ? 'text-white' 
        :'text-black'}`}>Добавить задачу
        </h2>

        <Controller
          name="title"
          control={control}
          render={({ field }) => (
            <input {...field} className="w-full border px-4 py-2 mb-4" placeholder="Введите заголовок" />
          )}
        />

        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <textarea {...field} className="w-full border px-4 py-2 mb-4" placeholder="Введите описание" />
          )}
        />

        <Controller
          name="date"
          control={control}
          render={({ field }) => (
            <DatePicker
              selected={new Date(field.value)}
              onChange={(date) => field.onChange(date?.toISOString().split("T")[0])}
              dateFormat="yyyy-MM-dd"
              className="w-full border px-4 py-2 mb-4"
            />
          )}
        />
        <Controller
          name="completed"
          control={control}
          render={({ field }) => (
            <div className="mb-4 flex items-center gap-2">
              <ToggleSwitch checked={field.value} onChange={field.onChange} children isDarkMode/>
              <span className="text-gray-700">Задача выполнена</span>
            </div>
          )}
        />

        <div className="flex justify-end space-x-4">
          <Button onClick={onClose} isDarkMode={isDarkMode} className="bg-gray-200">Отмена</Button>
          <Button onClick={handleSubmit(handleSave)} isDarkMode={isDarkMode} className={`hover:bg-green-500 ${isDarkMode 
          ? 'bg-green-800'
          : 'bg-green-600'}`}>Сохранить</Button>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;
