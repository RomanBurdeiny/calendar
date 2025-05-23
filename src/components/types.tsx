export interface TaskType {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  date: string;
}

export interface TaskModalProps {
  isDarkMode: boolean;
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: {
    title: string;
    description: string;
    completed: boolean;
    date: string;
  }) => void;
}

export interface ToggleSwitchProps {
  checked: boolean;
  onChange: () => void;
  children: React.ReactNode;
  isDarkMode: boolean;
}

export interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
  isDarkMode: boolean;
}

export interface HeaderProps {
  theme: "light" | "dark";
  toggleTheme: () => void;
}

export interface TaskListProps {
  theme: "light" | "dark";
  toggleTheme: () => void;
}