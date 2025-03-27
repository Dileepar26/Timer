import React, { useState } from 'react';
import { Timer } from '../types';
import { useTheme } from '../context/ThemeContext';
import { Play, Pause, RotateCcw, ChevronDown, ChevronUp } from 'lucide-react';
import { TooltipWrapper } from './TooltipWrapper';

interface TimerListProps {
  timers: Timer[];
  categories: string[];
  onStart: (id: string) => void;
  onPause: (id: string) => void;
  onReset: (id: string) => void;
  onStartCategory: (category: string) => void;
  onPauseCategory: (category: string) => void;
  onResetCategory: (category: string) => void;
}

export const TimerList: React.FC<TimerListProps> = ({
  timers,
  categories,
  onStart,
  onPause,
  onReset,
  onStartCategory,
  onPauseCategory,
  onResetCategory,
}) => {
  const { theme } = useTheme();
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(categories));
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const filteredTimers = selectedCategory === 'all'
    ? timers
    : timers.filter(timer => timer.category === selectedCategory);

  const groupedTimers = categories.reduce((acc, category) => {
    acc[category] = filteredTimers.filter(timer => timer.category === category);
    return acc;
  }, {} as Record<string, Timer[]>);

  return (
    <div className={`space-y-6 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
      <div className="mb-4">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className={`w-full p-2 rounded-md border ${
            theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
          }`}
        >
          <option value="all">All Categories</option>
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>

      {categories.map(category => {
        const categoryTimers = groupedTimers[category] || [];
        if (categoryTimers.length === 0) return null;

        const completedTimers = categoryTimers.filter(timer => timer.status === 'completed').length;
        const totalTimers = categoryTimers.length;
        const progress = (completedTimers / totalTimers) * 100;

        return (
          <div
            key={category}
            className={`rounded-lg shadow-md overflow-hidden ${
              theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            }`}
          >
            <div
              className={`p-4 ${
                theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
              }`}
            >
              <div className="flex items-center justify-between cursor-pointer" onClick={() => toggleCategory(category)}>
                <div>
                  <h3 className="text-lg font-semibold">{category}</h3>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    {completedTimers} of {totalTimers} completed
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <TooltipWrapper content="Start all timers">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onStartCategory(category);
                      }}
                      className="p-2 rounded-full hover:bg-green-100 text-green-600"
                    >
                      <Play className="w-5 h-5" />
                    </button>
                  </TooltipWrapper>
                  <TooltipWrapper content="Pause all timers">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onPauseCategory(category);
                      }}
                      className="p-2 rounded-full hover:bg-yellow-100 text-yellow-600"
                    >
                      <Pause className="w-5 h-5" />
                    </button>
                  </TooltipWrapper>
                  <TooltipWrapper content="Reset all timers">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onResetCategory(category);
                      }}
                      className="p-2 rounded-full hover:bg-red-100 text-red-600"
                    >
                      <RotateCcw className="w-5 h-5" />
                    </button>
                  </TooltipWrapper>
                  {expandedCategories.has(category) ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </div>
              </div>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="h-2.5 rounded-full bg-blue-500"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>

            {expandedCategories.has(category) && (
              <div className="divide-y">
                {categoryTimers.map(timer => (
                  <div
                    key={timer.id}
                    className={`p-4 ${
                      timer.status === 'completed'
                        ? theme === 'dark'
                          ? 'bg-gray-700/50'
                          : 'bg-gray-50/50'
                        : theme === 'dark'
                        ? 'hover:bg-gray-700'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className={`font-medium ${
                          timer.status === 'completed' ? 'line-through opacity-70' : ''
                        }`}>{timer.name}</h4>
                        <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                          {formatTime(timer.remainingTime)}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        {timer.status !== 'completed' && (
                          <>
                            {timer.status !== 'running' && (
                              <TooltipWrapper content="Start timer">
                                <button
                                  onClick={() => onStart(timer.id)}
                                  className="p-2 rounded-full hover:bg-green-100 text-green-600"
                                >
                                  <Play className="w-5 h-5" />
                                </button>
                              </TooltipWrapper>
                            )}
                            {timer.status === 'running' && (
                              <TooltipWrapper content="Pause timer">
                                <button
                                  onClick={() => onPause(timer.id)}
                                  className="p-2 rounded-full hover:bg-yellow-100 text-yellow-600"
                                >
                                  <Pause className="w-5 h-5" />
                                </button>
                              </TooltipWrapper>
                            )}
                            <TooltipWrapper content="Reset timer">
                              <button
                                onClick={() => onReset(timer.id)}
                                className="p-2 rounded-full hover:bg-red-100 text-red-600"
                              >
                                <RotateCcw className="w-5 h-5" />
                              </button>
                            </TooltipWrapper>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div
                        className={`h-2.5 rounded-full ${
                          timer.status === 'completed'
                            ? 'bg-green-500'
                            : 'bg-blue-500'
                        }`}
                        style={{
                          width: `${(timer.remainingTime / timer.duration) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};