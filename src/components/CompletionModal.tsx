import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { CheckCircle } from 'lucide-react';

interface CompletionModalProps {
  timerName: string;
  onClose: () => void;
}

export const CompletionModal: React.FC<CompletionModalProps> = ({ timerName, onClose }) => {
  const { theme } = useTheme();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        className={`p-6 rounded-lg shadow-xl max-w-md w-full mx-4 ${
          theme === 'dark' ? 'bg-gray-800' : 'bg-white'
        }`}
      >
        <div className="text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className={`text-2xl font-bold mb-2 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
            Timer Completed!
          </h2>
          <p className={`mb-6 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            Congratulations! You've completed "{timerName}"
          </p>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};