import { useState, useEffect } from 'react';
import { Timer, TimerHistory } from '../types';

export const useTimers = () => {
  const [timers, setTimers] = useState<Timer[]>([]);
  const [history, setHistory] = useState<TimerHistory[]>([]);
  const [categories, setCategories] = useState<Set<string>>(new Set());

  useEffect(() => {
    const loadTimers = () => {
      const savedTimers = localStorage.getItem('timers');
      const savedHistory = localStorage.getItem('timerHistory');
      
      if (savedTimers) {
        const parsedTimers = JSON.parse(savedTimers);
        setTimers(parsedTimers);
        setCategories(new Set(parsedTimers.map((t: Timer) => t.category)));
      }
      
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
    };

    loadTimers();
  }, []);

  useEffect(() => {
    localStorage.setItem('timers', JSON.stringify(timers));
  }, [timers]);

  useEffect(() => {
    localStorage.setItem('timerHistory', JSON.stringify(history));
  }, [history]);

  const addTimer = (timer: Omit<Timer, 'id' | 'status' | 'remainingTime' | 'createdAt' | 'halfwayAlertTriggered'>) => {
    const newTimer: Timer = {
      ...timer,
      id: crypto.randomUUID(),
      status: 'idle',
      remainingTime: timer.duration,
      createdAt: Date.now(),
      halfwayAlertTriggered: false,
    };

    setTimers(prev => [...prev, newTimer]);
    setCategories(prev => new Set([...prev, timer.category]));
  };

  const updateTimer = (id: string, updates: Partial<Timer>) => {
    setTimers(prev => prev.map(timer => 
      timer.id === id ? { ...timer, ...updates } : timer
    ));
  };

  const completeTimer = (id: string) => {
    const timer = timers.find(t => t.id === id);
    if (!timer) return;

    const historyEntry: TimerHistory = {
      id: timer.id,
      name: timer.name,
      category: timer.category,
      duration: timer.duration,
      completedAt: Date.now(),
    };

    setHistory(prev => [...prev, historyEntry]);
    updateTimer(id, { status: 'completed', remainingTime: 0, completedAt: Date.now() });
  };

  const deleteTimer = (id: string) => {
    setTimers(prev => prev.filter(timer => timer.id !== id));
  };

  const startTimer = (id: string) => {
    updateTimer(id, { status: 'running' });
  };

  const pauseTimer = (id: string) => {
    updateTimer(id, { status: 'paused' });
  };

  const resetTimer = (id: string) => {
    const timer = timers.find(t => t.id === id);
    if (timer) {
      updateTimer(id, {
        status: 'idle',
        remainingTime: timer.duration,
        halfwayAlertTriggered: false,
      });
    }
  };

  const startCategoryTimers = (category: string) => {
    setTimers(prev => prev.map(timer => 
      timer.category === category && timer.status !== 'completed'
        ? { ...timer, status: 'running' }
        : timer
    ));
  };

  const pauseCategoryTimers = (category: string) => {
    setTimers(prev => prev.map(timer => 
      timer.category === category && timer.status === 'running'
        ? { ...timer, status: 'paused' }
        : timer
    ));
  };

  const resetCategoryTimers = (category: string) => {
    setTimers(prev => prev.map(timer => 
      timer.category === category
        ? { ...timer, status: 'idle', remainingTime: timer.duration, halfwayAlertTriggered: false }
        : timer
    ));
  };

  const exportData = () => {
    const data = {
      timers,
      history,
      exportDate: new Date().toISOString(),
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `timer-data-${new Date().toISOString()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return {
    timers,
    history,
    categories: Array.from(categories),
    addTimer,
    updateTimer,
    deleteTimer,
    startTimer,
    pauseTimer,
    resetTimer,
    completeTimer,
    startCategoryTimers,
    pauseCategoryTimers,
    resetCategoryTimers,
    exportData,
  };
};