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
    <div className={`mb-4 mr-10 ml-10 p-4 shadow rounded-md max-w-full break-words ${isDarkMode ? "bg-gray-900 " : "bg-white "}`} data-task-id={id}>
      <h2 className={`text-xl font-bold 
      ${isDarkMode 
        ? "text-white " 
        : "text-black "} 
      ${completed 
        ? "line-through text-gray-500" 
        : "text-black"} break-words`}>
        {title}
      </h2>
      <p className={`mt-2 ${isDarkMode ? "text-white " : "text-black "} ${completed ? "line-through text-gray-500" : "text-black dark:text-gray-300"} break-words`}>
        {description}
      </p>
      <div className="flex gap-4 mt-4 items-center flex-wrap">
        <Button onClick={onEdit} 
        children={'Редактировать'}
        isDarkMode={isDarkMode}/>
        <Button className={`hover:bg-red-500 ${isDarkMode 
          ? 'bg-red-800'
          : 'bg-red-600'}`} onClick={onDelete} children={'Удалить'} isDarkMode={isDarkMode} />
        <ToggleSwitch checked={completed} onChange={onToggleComplete} children isDarkMode/>
      </div>
    </div>
  );
};

export default Task;
