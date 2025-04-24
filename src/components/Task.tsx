import ToggleSwitch from "./ToggleSwitch";
import Button from "./Button";

type TaskProps = {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onToggleComplete: () => void;
  isDarkMode: boolean
};

const Task: React.FC<TaskProps> = ({ id, title, description, completed, onEdit, onDelete, onToggleComplete, isDarkMode }) => {
  return (
    <div className={`mb-4 p-4 shadow rounded-md w-full sm:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1rem)] max-w-sm 
    ${isDarkMode 
    ? "bg-gray-900 " 
    : "bg-white "}`} 
    data-task-id={id}>
      <h2 className={`text-xl font-bold 
      ${isDarkMode 
        ? "text-white " 
        : "text-black "} 
      ${completed 
        ? "line-through text-gray-500" 
        : "text-black"} break-words`}>
        {title}
      </h2>
      <p className={`mt-2 break-words
        ${completed 
          ? `line-through ${isDarkMode ? 'text-gray-400' : 'text-gray-800'}` 
          : `${isDarkMode ? 'text-gray-300' : 'text-black'}`}
          ${!description && "italic text-gray-400"}
        `}>
        {description || '"no description"'}
      </p>
      <div className="flex gap-4 mt-4 items-center flex-wrap">
        <Button onClick={onEdit} 
        children={'Редактировать'}
        isDarkMode={isDarkMode}/>
        <Button className={`hover:bg-red-500 ${isDarkMode 
          ? 'bg-red-800'
          : 'bg-red-600'}`} 
          onClick={onDelete} 
          children={'Удалить'} 
          isDarkMode={isDarkMode} />
        <ToggleSwitch 
          checked={completed} 
          onChange={onToggleComplete} 
          children 
          isDarkMode/>
      </div>
    </div>
  );
};

export default Task;