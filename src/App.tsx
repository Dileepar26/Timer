import React, { useState, useEffect } from 'react';
import { Timer } from './types';
import { useTimers } from './hooks/useTimers';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { TimerForm } from './components/TimerForm';
import { TimerList } from './components/TimerList';
import { TimerHistory } from './components/TimerHistory';
import { CompletionModal } from './components/CompletionModal';
import { TooltipWrapper } from './components/TooltipWrapper';
import { Sun, Moon, Download } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';

const AppContent: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<'timers' | 'history'>('timers');
  const [completedTimer, setCompletedTimer] = useState<Timer | null>(null);
  const {
    timers,
    history,
    categories,
    addTimer,
    startTimer,
    pauseTimer,
    resetTimer,
    completeTimer,
    updateTimer,
    startCategoryTimers,
    pauseCategoryTimers,
    resetCategoryTimers,
    exportData,
  } = useTimers();

  useEffect(() => {
    const timerInterval = setInterval(() => {
      timers.forEach((timer) => {
        if (timer.status === 'running' && timer.remainingTime > 0) {
          updateTimer(timer.id, {
            remainingTime: timer.remainingTime - 1,
            halfwayAlertTriggered: 
              timer.halfwayAlert && 
              !timer.halfwayAlertTriggered && 
              timer.remainingTime <= timer.duration / 2
          });

          // Check for halfway alert
          if (
            timer.halfwayAlert &&
            !timer.halfwayAlertTriggered &&
            timer.remainingTime <= timer.duration / 2
          ) {
            toast.success(`${timer.name} is halfway complete!`);
            new Notification('Halfway Alert', {
              body: `${timer.name} is halfway complete!`,
            });
          }

          // Check for completion
          if (timer.remainingTime <= 1) {
            completeTimer(timer.id);
            setCompletedTimer(timer);
            toast.success(`${timer.name} has finished!`);
            new Notification('Timer Complete', {
              body: `${timer.name} has finished!`,
            });
          }
        }
      });
    }, 1000);

    return () => clearInterval(timerInterval);
  }, [timers, updateTimer, completeTimer]);

  useEffect(() => {
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <Toaster
        position="top-right"
        toastOptions={{
          className: theme === 'dark' ? '!bg-gray-800 !text-white' : '',
          duration: 3000,
        }}
      />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Timer
          </h1>
          <div className="flex items-center space-x-4">
            <TooltipWrapper content="Export timer data">
              <button
                onClick={exportData}
                className={`p-2 rounded-full ${
                  theme === 'dark' ? 'bg-gray-700 text-gray-200' : 'bg-white text-gray-800'
                } hover:bg-opacity-80`}
              >
                <Download className="w-5 h-5" />
              </button>
            </TooltipWrapper>
            <TooltipWrapper content={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}>
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-full ${
                  theme === 'dark' ? 'bg-gray-700 text-gray-200' : 'bg-white text-gray-800'
                } hover:bg-opacity-80`}
              >
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            </TooltipWrapper>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <TimerForm onSubmit={addTimer} categories={categories} />
          </div>

          <div className="md:col-span-2">
            <div className="mb-6">
              <div className="flex space-x-4">
                <button
                  onClick={() => setActiveTab('timers')}
                  className={`px-4 py-2 rounded-md ${
                    activeTab === 'timers'
                      ? 'bg-blue-500 text-white'
                      : theme === 'dark'
                      ? 'bg-gray-700 text-gray-200'
                      : 'bg-white text-gray-800'
                  }`}
                >
                  Timers
                </button>
                <button
                  onClick={() => setActiveTab('history')}
                  className={`px-4 py-2 rounded-md ${
                    activeTab === 'history'
                      ? 'bg-blue-500 text-white'
                      : theme === 'dark'
                      ? 'bg-gray-700 text-gray-200'
                      : 'bg-white text-gray-800'
                  }`}
                >
                  History
                </button>
              </div>
            </div>

            {activeTab === 'timers' ? (
              <TimerList
                timers={timers}
                categories={categories}
                onStart={startTimer}
                onPause={pauseTimer}
                onReset={resetTimer}
                onStartCategory={startCategoryTimers}
                onPauseCategory={pauseCategoryTimers}
                onResetCategory={resetCategoryTimers}
              />
            ) : (
              <TimerHistory history={history} />
            )}
          </div>
        </div>

        {completedTimer && (
          <CompletionModal
            timerName={completedTimer.name}
            onClose={() => setCompletedTimer(null)}
          />
        )}
      </div>
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;