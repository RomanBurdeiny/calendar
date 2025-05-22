import { Controller, useFormContext } from "react-hook-form";
import Button from "./Button";
import { AuthFormProps } from "./types";
import { Link } from "react-router-dom";


const AuthForm: React.FC<AuthFormProps> = ({ onSubmit, authLink, authTitle, isDarkMode }) => {
  const { handleSubmit, control, reset, watch } = useFormContext();



  const inputClass = "w-full border px-4 py-2 rounded-md mt-4";

  return (
    <div 
      className={`fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 
        ${isDarkMode ? 'text-white' : 'text-black'}`}
    >
      <div 
        className={`p-6 w-96 rounded-lg shadow-xl flex-col
          ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}
      >
        <h2 
          className={`text-xl font-bold text-center 
            ${isDarkMode ? 'text-white' : 'text-black'}`}
        >
          {authTitle}
        </h2>

        <Controller
          name="Email"
          control={control}
          rules={{ required: "Title is required" }}
          render={({ field, fieldState }) => (
            <div>
              <input {...field} className={inputClass} placeholder="Email" />
              {fieldState.error && <p className="text-red-500 text-sm">{fieldState.error.message}</p>}
            </div>
          )}
        />

        <Controller
          name="Password"
          control={control}
          render={({ field }) => (
            <textarea {...field} className={inputClass} placeholder="Password" />
          )}
        />

       

        <div className="flex justify-between space-x-4">
          <Button 
          onClick={onSubmit} 
          isDarkMode={isDarkMode} 
          className={`${isDarkMode? 'bg-blue-900 hover:bg-blue-700' : 'bg-blue-600 hover:bg-blue-400'}`} 
          children={'Cancel'}/>
          <Button
            isDarkMode={isDarkMode} 
            className={`hover:bg-green-500 ${isDarkMode ? 'bg-green-800' : 'bg-green-600'}`}>
                <Link to={authLink}>
                {authLink}
                </Link>
            </Button>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;