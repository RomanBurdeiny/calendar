type ToggleSwitchProps = {
  checked: boolean;
  onChange: () => void;
};

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ checked, onChange }) => {
  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <input type="checkbox" checked={checked} onChange={onChange} className="sr-only peer" />
      <div className="w-11 h-6 bg-gray-300 peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-5 peer-checked:bg-green-500 transition-all duration-300 after:content-[''] after:absolute after:top-0.5 after:left-1 after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
    </label>
  );
};

export default ToggleSwitch;
