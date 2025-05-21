import ToggleSwitch from "./ToggleSwitch";
import Button from "./Button";
import { HeaderProps } from "./types";

const Header: React.FC<HeaderProps> = ({ theme, toggleTheme }) => {
  const isDarkMode = theme === "dark";

  return (
    <header className={`w-full ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-300 text-black'}`}>
      <div className="max-w-screen-xl mx-auto flex justify-between items-center p-4">
        
        <Button 
          className={`text-sm px-3 py-1 hover:bg-purple-400 transition 
            ${isDarkMode ? 'bg-purple-800' : 'bg-purple-500'}`} 
          onClick={() => {}} 
          isDarkMode={isDarkMode} 
          children={'Sign In'}
        />

        <div className="flex items-center gap-2">
          <ToggleSwitch 
            checked={isDarkMode} 
            onChange={toggleTheme} 
            children={'Theme'} 
            isDarkMode={isDarkMode}
            textClassName={`${isDarkMode ? 'text-white' : 'text-black'}`}
          />
        </div>

      </div>
    </header>
  );
};

export default Header;
