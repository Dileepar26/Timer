import React from 'react';
import { TimerHistory as TimerHistoryType } from '../types';
import { useTheme } from '../context/ThemeContext';
import { History } from 'lucide-react';

interface TimerHistoryProps {
  history: TimerHistoryType[];
}

export const TimerHistory: React.FC<TimerHistoryProps> = ({ history }) => {
  const { theme } = useTheme();

  return (
    <div className={`p-6 rounded-lg shadow-md ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
      <div className="flex items-center mb-6">
        <History className="w-6 h-6 mr-2" />
        <h2 className={`text-xl font-bold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
          Timer History
        </h2>
      </div>

      {history.length === 0 ? (
        <p className={`text-center py-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
          No completed timers yet
        </p>
      ) : (
        <div className="space-y-4">
          {history.map((entry) => (
            <div
              key={`${entry.id}-${entry.completedAt}`}
              className={`p-4 rounded-lg ${
                theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className={`font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
                    {entry.name}
                  </h3>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    Category: {entry.category}
                  </p>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    Duration: {Math.floor(entry.duration / 60)} minutes
                  </p>
                </div>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  {new Date(entry.completedAt).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};