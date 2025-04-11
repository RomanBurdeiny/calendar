import { ToggleSwitchProps } from "./types";

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ checked, onChange, children, isDarkMode}) => {
  return (
    <label className="inline-flex items-center cursor-pointer space-x-2">
      <input type="checkbox" checked={checked} onChange={onChange} className="sr-only peer" />
      <div className={`relative w-11 h-6 peer-focus:outline-none peer-focus:ring-4 rounded-full peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all 
        ${isDarkMode 
        ? 'peer-focus:ring-blue-800 bg-gray-700 border-gray-600 peer-checked:bg-blue-600' 
        : 'bg-gray-200 peer-focus:ring-blue-300 peer-checked:bg-green-600'}  `}></div>
      <span className={`text-sm font-medium ${isDarkMode 
        ? 'bg-gray-900 text-white' 
        : 'text-black'}`}>
        {children}
      </span>
    </label>
  );
};


export default ToggleSwitch;
