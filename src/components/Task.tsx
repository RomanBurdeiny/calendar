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
      <h2 className={`text-xl text-start font-bold break-words transition duration-300
      ${completed 
        ? `line-through ${isDarkMode ? 'text-gray-400' : 'text-gray-400'}` 
        : `${isDarkMode ? 'text-gray-300' : 'text-black'}`}`}>
        {title}
      </h2>
      <p className={`mt-2 text-start break-words transition duration-300 ${!description && "italic"}
        ${completed 
          ? `line-through ${isDarkMode ? 'text-gray-400' : 'text-gray-400'}` 
          : `${isDarkMode ? 'text-gray-300' : 'text-black'}`} 
        `}>
        {description || '"no description"'}
      </p>
      <div className="flex justify-around gap-4 mt-4 flex-col">
        <div className="flex justify-start gap-4">
          <Button 
          className={`${isDarkMode? 'bg-blue-900 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-300'}`}
          onClick={onEdit} 
          children={'Edit'}
          isDarkMode={isDarkMode}/>
          <Button className={`hover:bg-red-500 ${isDarkMode 
            ? 'bg-red-800'
            : 'bg-red-600'}`} 
            onClick={onDelete} 
            children={'Delete'} 
            isDarkMode={isDarkMode} />
        </div>
        <ToggleSwitch 
          textClassName={`${completed 
          ? `line-through ${isDarkMode ? 'text-gray-400' : 'text-gray-400'}` 
          : `${isDarkMode ? 'text-gray-300' : 'text-black'}`} 
        `}
          checked={completed} 
          onChange={onToggleComplete} 
          isDarkMode={isDarkMode}
          children={'Active'}
          />
      </div>
    </div>
  );
};

export default Task;