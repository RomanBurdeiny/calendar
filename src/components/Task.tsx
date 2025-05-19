import ToggleSwitch from "./ToggleSwitch";
import Button from "./Button";
import {TaskProps} from "./types"

const Task: React.FC<TaskProps> = ({ id, title, description, completed, onEdit, onDelete, onToggleComplete, isDarkMode }) => {
  return (
    <div className={`p-4 shadow rounded-lg 
    w-full sm:w-1/2 lg:w-5/6 min-w-m
    flex flex-col justify-between  
    transition-colors duration-500 
    ${isDarkMode 
    ? "bg-gray-900 " 
    : "bg-white "}`} 
    data-task-id={id}>
      <h2 className={`text-xl font-bold break-words
      ${completed 
        ? `line-through ${isDarkMode ? 'text-gray-400' : 'text-gray-400'}` 
        : `${isDarkMode ? 'text-gray-300' : 'text-black'}`}`}>
        {title}
      </h2>
      <p className={`mt-2 break-words ${!description && "italic"}
        ${completed 
          ? `line-through ${isDarkMode ? 'text-gray-400' : 'text-gray-400'}` 
          : `${isDarkMode ? 'text-gray-300' : 'text-black'}`} 
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