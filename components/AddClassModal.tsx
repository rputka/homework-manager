'use client';

import { useState } from 'react';
import { Class, StickyColor } from '@/types';
import { addClass } from '@/utils/storage';
import { X, BookOpen } from 'lucide-react';

interface AddClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

const colorOptions: { color: StickyColor; name: string; bgClass: string }[] = [
  { color: 'yellow', name: 'Yellow', bgClass: 'bg-sticky-yellow' },
  { color: 'pink', name: 'Pink', bgClass: 'bg-sticky-pink' },
  { color: 'blue', name: 'Blue', bgClass: 'bg-sticky-blue' },
  { color: 'green', name: 'Green', bgClass: 'bg-sticky-green' },
  { color: 'purple', name: 'Purple', bgClass: 'bg-sticky-purple' },
  { color: 'orange', name: 'Orange', bgClass: 'bg-sticky-orange' },
];

export default function AddClassModal({ isOpen, onClose, onUpdate }: AddClassModalProps) {
  const [className, setClassName] = useState('');
  const [selectedColor, setSelectedColor] = useState<StickyColor>('yellow');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!className.trim()) return;

    const newClass: Class = {
      id: Date.now().toString(),
      name: className.trim(),
      color: selectedColor,
      assignments: [],
      createdAt: new Date().toISOString()
    };

    addClass(newClass);
    onUpdate();
    
    // Reset form
    setClassName('');
    setSelectedColor('yellow');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Add New Class</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="className" className="block text-sm font-medium text-gray-700 mb-1">
              Class Name *
            </label>
            <div className="relative">
              <BookOpen size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                id="className"
                type="text"
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                className="input-field pl-10"
                placeholder="Enter class name"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Choose Color Theme
            </label>
            <div className="grid grid-cols-3 gap-2">
              {colorOptions.map((option) => (
                <button
                  key={option.color}
                  type="button"
                  onClick={() => setSelectedColor(option.color)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    selectedColor === option.color
                      ? 'border-gray-800 scale-105'
                      : 'border-gray-300 hover:border-gray-400'
                  } ${option.bgClass}`}
                  title={option.name}
                >
                  <div className="w-4 h-4 bg-gray-800 rounded-sm mx-auto"></div>
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary flex-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary flex-1"
              disabled={!className.trim()}
            >
              Add Class
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
