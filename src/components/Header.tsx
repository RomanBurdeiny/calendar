import ToggleSwitch from "./ToggleSwitch";
import Button from "./Button";
import { HeaderProps } from "./types";

const Header: React.FC<HeaderProps> = ({ isDarkMode, toggleDarkMode }) => {
  return (
    <header className={`w-full flex justify-between items-center p-4 
    ${isDarkMode 
    ? 'bg-gray-800 text-white' 
    : 'bg-gray-300 text-black'}`}>
      <Button className={`text-sm px-3 py-1 hover:bg-purple-400 transition ${isDarkMode 
          ? 'bg-purple-800'
          : 'bg-purple-500'}`} 
          onClick={() => {}} 
          isDarkMode={isDarkMode} 
          children={'Sign In'}/>
      <div className="flex items-center gap-2">
        <ToggleSwitch 
        checked={isDarkMode} 
        onChange={toggleDarkMode} 
        children={'Theme'} 
        isDarkMode={isDarkMode}/>
      </div>
    </header>
  );
};

export default Header;