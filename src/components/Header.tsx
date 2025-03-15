import ToggleSwitch from "./ToggleSwitch";
import Button from "./Button";
import { HeaderProps } from "./types";

const Header: React.FC<HeaderProps> = ({ isDarkMode, toggleDarkMode }) => {
  return (
    <header className="w-full flex justify-between items-center p-4 bg-gray-400 dark:bg-gray-900 shadow-md">
      <div className="flex space-x-4">
        <Button children="Sign in" onClick={() => console.log("Sign in clicked")} className="bg-blue-500 dark:bg-blue-700 text-white" />
        <ToggleSwitch checked={isDarkMode} onChange={toggleDarkMode} children='Theme'/>
      </div>
    </header>
  );
};

export default Header;
