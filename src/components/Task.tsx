import ToggleSwitch from "./ToggleSwitch";

type TaskProps = {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onToggleComplete: () => void;
};

const Task: React.FC<TaskProps> = ({ id, title, description, completed, onEdit, onDelete, onToggleComplete }) => {
  return (
    <div className="mb-4 p-4 bg-white shadow rounded-md" data-task-id={id}>
      <h2 className={`text-xl font-bold ${completed ? "line-through text-gray-500" : "text-black"}`}>
        {title}
      </h2>
      <p className={`mt-2 ${completed ? "line-through text-gray-500" : "text-black"}`}>
        {description}
      </p>
      <div className="flex gap-4 mt-4 items-center">
        <button onClick={onEdit} className="bg-blue-200 text-black px-4 py-2 rounded hover:bg-blue-300 transition">
          Редактировать
        </button>
        <button onClick={onDelete} className="bg-red-200 text-black px-4 py-2 rounded hover:bg-red-300 transition">
          Удалить
        </button>
        {/* ✅ Вернул `ToggleSwitch` */}
        <ToggleSwitch checked={completed} onChange={onToggleComplete} />
      </div>
    </div>
  );
};

export default Task;
