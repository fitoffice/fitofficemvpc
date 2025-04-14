import React from 'react';
import { Edit3, Save } from 'lucide-react';

interface SectionHeaderProps {
  title: string;
  Icon: React.ComponentType<any>;
  theme: string;
  editMode: boolean;
  onSave: () => void;
  isLoading: boolean;
  iconColor?: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  Icon,
  theme,
  editMode,
  onSave,
  isLoading,
  iconColor = 'purple'
}) => {
  return (
    <div className="flex justify-between items-center p-4 border-b">
      <div className="flex items-center space-x-2">
        <Icon className={`w-6 h-6 text-${iconColor}-500`} />
        <h2 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
          {title}
        </h2>
      </div>
      <button
        onClick={onSave}
        disabled={isLoading}
        className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
      >
        {editMode ? <Save className="w-5 h-5" /> : <Edit3 className="w-5 h-5" />}
      </button>
    </div>
  );
};

export default SectionHeader;