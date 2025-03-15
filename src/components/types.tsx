export interface TaskType {
    id: number;
    title: string;
    description: string;
    completed: boolean;
    date: string;
  }
  
  export interface TaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (taskData: Omit<TaskType, "id">) => void;
    task?: TaskType | null;
    isDarkMode: boolean;
  }
  
  export interface ToggleSwitchProps {
    checked: boolean;
    onChange: () => void;
  }
  
  export interface ButtonProps {
    text: string;
    onClick: () => void;
    className?: string;
  }
  
  export interface HeaderProps {
    isDarkMode: boolean;
    toggleDarkMode: () => void;
  }
  