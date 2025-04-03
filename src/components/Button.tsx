import { ButtonProps } from "./types";

const Button: React.FC<ButtonProps> = ({ onClick, children, className = "", isDarkMode }) => {
  const baseClass = isDarkMode
    ? "bg-gray-700 text-white"
    : "bg-blue-200 hover:bg-blue-300 text-black";

  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded transition ${baseClass} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
