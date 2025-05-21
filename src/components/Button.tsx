import { ButtonProps } from "./types";

const Button: React.FC<ButtonProps> = ({ onClick, children, className = "", isDarkMode }) => {
  const baseClass = isDarkMode
    ? "text-white"
    : "text-black";

  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded transition duration-1000 ${baseClass} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
