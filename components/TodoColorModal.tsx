'use client';

import { useState, useEffect } from 'react';
import { StickyColor } from '@/types';
import { X } from 'lucide-react';

interface TodoColorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentColor: StickyColor;
  onColorChange: (color: StickyColor) => void;
}

export default function TodoColorModal({ isOpen, onClose, currentColor, onColorChange }: TodoColorModalProps) {
  const [selectedColor, setSelectedColor] = useState<StickyColor>(currentColor);

  useEffect(() => {
    setSelectedColor(currentColor);
  }, [currentColor, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onColorChange(selectedColor);
    onClose();
  };

  const colorOptions: { value: StickyColor; label: string; bgClass: string }[] = [
    { value: 'yellow', label: 'Yellow', bgClass: 'bg-sticky-yellow' },
    { value: 'pink', label: 'Pink', bgClass: 'bg-sticky-pink' },
    { value: 'blue', label: 'Blue', bgClass: 'bg-sticky-blue' },
    { value: 'green', label: 'Green', bgClass: 'bg-sticky-green' },
    { value: 'purple', label: 'Purple', bgClass: 'bg-sticky-purple' },
    { value: 'orange', label: 'Orange', bgClass: 'bg-sticky-orange' },
  ];

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800">Choose Todo List Color</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Sticky Note Color
            </label>
            <div className="grid grid-cols-3 gap-3">
              {colorOptions.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => setSelectedColor(color.value)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedColor === color.value
                      ? 'border-gray-400 ring-2 ring-blue-500'
                      : 'border-gray-200 hover:border-gray-300'
                  } ${color.bgClass}`}
                >
                  <div className="text-center">
                    <div className="text-sm font-medium text-gray-800">
                      {color.label}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
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
            >
              Save Color
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
