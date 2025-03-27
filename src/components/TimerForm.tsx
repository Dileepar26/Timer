import React, { useState } from 'react';
import { Timer } from '../types';
import { useTheme } from '../context/ThemeContext';
import { Plus } from 'lucide-react';

interface TimerFormProps {
  onSubmit: (timer: Omit<Timer, 'id' | 'status' | 'remainingTime' | 'createdAt' | 'halfwayAlertTriggered'>) => void;
  categories: string[];
}

export const TimerForm: React.FC<TimerFormProps> = ({ onSubmit, categories }) => {
  const { theme } = useTheme();
  const [name, setName] = useState('');
  const [duration, setDuration] = useState('');
  const [category, setCategory] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [halfwayAlert, setHalfwayAlert] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalCategory = category === 'new' ? newCategory : category;
    
    onSubmit({
      name,
      duration: parseInt(duration) * 60, // Convert minutes to seconds
      category: finalCategory,
      halfwayAlert,
    });

    setName('');
    setDuration('');
    setCategory('');
    setNewCategory('');
    setHalfwayAlert(false);
  };

  return (
    <form onSubmit={handleSubmit} className={`p-6 rounded-lg shadow-md ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
      <div className="space-y-4">
        <div>
          <label className={`block mb-2 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
            Timer Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter timer name"
          />
        </div>

        <div>
          <label className={`block mb-2 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
            Duration (minutes)
          </label>
          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            required
            min="1"
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter duration in minutes"
          />
        </div>

        <div>
          <label className={`block mb-2 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
            <option value="new">Add new category</option>
          </select>
        </div>

        {category === 'new' && (
          <div>
            <label className={`block mb-2 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
              New Category Name
            </label>
            <input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter new category name"
            />
          </div>
        )}

        <div className="flex items-center">
          <input
            type="checkbox"
            id="halfwayAlert"
            checked={halfwayAlert}
            onChange={(e) => setHalfwayAlert(e.target.checked)}
            className="mr-2"
          />
          <label
            htmlFor="halfwayAlert"
            className={`${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}
          >
            Enable halfway alert
          </label>
        </div>

        <button
          type="submit"
          className="w-full flex items-center justify-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Timer
        </button>
      </div>
    </form>
  );
};