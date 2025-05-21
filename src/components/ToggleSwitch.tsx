import { ToggleSwitchProps } from "./types";

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ checked, onChange, children, isDarkMode, textClassName}) => {
  return (
    <label className="inline-flex items-center cursor-pointer space-x-2">
      <input 
        type="checkbox" 
        checked={checked} 
        onChange={onChange} 
        className="sr-only peer" 
      />
      <div 
        className={`w-11 h-6 rounded-full relative transition-colors duration-300
        ${checked 
          ? isDarkMode 
            ? 'bg-green-600' 
            : 'bg-green-700' 
          : isDarkMode 
            ? 'bg-gray-700' 
            : 'bg-gray-500'
        }
        peer-focus:ring-2 peer-focus:ring-offset-2 peer-focus:ring-blue-400
        shadow-inner`}
      >
        <div 
          className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-md 
          transform transition-transform duration-300
          ${checked ? 'translate-x-5' : ''}`}
        />
      </div>
      <span className={textClassName + `text-sm font-medium transition duration-300`}>
        {children}
      </span>
    </label>
  );
};

export default ToggleSwitch;
