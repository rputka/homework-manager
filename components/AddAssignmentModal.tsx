'use client';

import { useState, useEffect } from 'react';
import { Assignment, StickyColor } from '@/types';
import { addAssignment, updateAssignment } from '@/utils/storage';
import { X, Calendar, FileText, RotateCcw, Clock, CalendarDays } from 'lucide-react';

interface AddAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  classId: string;
  classColor: StickyColor;
  onUpdate: () => void;
  isEdit?: boolean;
  assignmentToEdit?: Assignment;
}

const DAYS_OF_WEEK = [
  { value: 0, label: 'Sunday', short: 'Sun' },
  { value: 1, label: 'Monday', short: 'Mon' },
  { value: 2, label: 'Tuesday', short: 'Tue' },
  { value: 3, label: 'Wednesday', short: 'Wed' },
  { value: 4, label: 'Thursday', short: 'Thu' },
  { value: 5, label: 'Friday', short: 'Fri' },
  { value: 6, label: 'Saturday', short: 'Sat' },
];

const FREQUENCY_OPTIONS = [
  { value: 'weekly', label: 'Weekly' },
  { value: 'biweekly', label: 'Biweekly' },
  { value: 'monthly', label: 'Monthly' },
];

export default function AddAssignmentModal({
  isOpen,
  onClose,
  classId,
  classColor,
  onUpdate,
  isEdit = false,
  assignmentToEdit
}: AddAssignmentModalProps) {
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('23:59');
  const [notes, setNotes] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);
  const [isFutureAssignment, setIsFutureAssignment] = useState(false);
  const [selectedDays, setSelectedDays] = useState<number[]>([]);
  const [frequency, setFrequency] = useState<'weekly' | 'biweekly' | 'monthly'>('weekly');
  const [endDate, setEndDate] = useState('');

  // Pre-fill form when editing
  useEffect(() => {
    if (isEdit && assignmentToEdit) {
      setTitle(assignmentToEdit.title);
      setDueDate(assignmentToEdit.dueDate);
      setDueTime(assignmentToEdit.dueTime || '23:59');
      setNotes(assignmentToEdit.notes);
      setIsRecurring(assignmentToEdit.isRecurring);
      setIsFutureAssignment(assignmentToEdit.isFutureAssignment);
      setSelectedDays(assignmentToEdit.recurringSchedule?.daysOfWeek || []);
      setFrequency(assignmentToEdit.recurringSchedule?.frequency || 'weekly');
      setEndDate(assignmentToEdit.recurringSchedule?.endDate || '');
    } else {
      // Reset form for new assignment
      setTitle('');
      setDueDate('');
      setDueTime('23:59');
      setNotes('');
      setIsRecurring(false);
      setIsFutureAssignment(false);
      setSelectedDays([]);
      setFrequency('weekly');
      setEndDate('');
    }
  }, [isEdit, assignmentToEdit, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !dueDate) return;
    if (isRecurring && selectedDays.length === 0) return;
    if (isRecurring && !endDate) return;

    if (isEdit && assignmentToEdit) {
      // Update existing assignment
      const updatedAssignment: Partial<Assignment> = {
        title: title.trim(),
        dueDate,
        dueTime,
        notes: notes.trim(),
        isRecurring,
        isFutureAssignment,
        recurringSchedule: isRecurring ? {
          daysOfWeek: selectedDays,
          frequency,
          endDate,
          nextDueDate: dueDate
        } : undefined,
      };

      updateAssignment(classId, assignmentToEdit.id, updatedAssignment);
    } else {
      // Create new assignment
      const newAssignment: Assignment = {
        id: Date.now().toString(),
        title: title.trim(),
        dueDate,
        dueTime,
        notes: notes.trim(),
        isRecurring,
        isFutureAssignment,
        recurringSchedule: isRecurring ? {
          daysOfWeek: selectedDays,
          frequency,
          endDate,
          nextDueDate: dueDate
        } : undefined,
        isCompleted: false,
        createdAt: new Date().toISOString()
      };

      addAssignment(classId, newAssignment);
    }

    onUpdate();
    onClose();
  };

  const toggleDay = (dayValue: number) => {
    setSelectedDays(prev => 
      prev.includes(dayValue) 
        ? prev.filter(d => d !== dayValue)
        : [...prev, dayValue].sort()
    );
  };

  const getSelectedDaysText = () => {
    if (selectedDays.length === 0) return 'Select days';
    return selectedDays.map(day => DAYS_OF_WEEK[day].short).join(', ');
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            {isEdit ? 'Edit Assignment' : 'Add Assignment'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Assignment Title *
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input-field"
              placeholder="Enter assignment title"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">
                Due Date *
              </label>
              <div className="relative">
                <Calendar size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  id="dueDate"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="input-field pl-10"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="dueTime" className="block text-sm font-medium text-gray-700 mb-1">
                Due Time
              </label>
              <div className="relative">
                <Clock size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  id="dueTime"
                  type="time"
                  value={dueTime}
                  onChange={(e) => setDueTime(e.target.value)}
                  className="input-field pl-10"
                />
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <div className="relative">
              <FileText size={16} className="absolute left-3 top-3 text-gray-400" />
              <textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="input-field pl-10 resize-none"
                rows={3}
                placeholder="Add any additional notes..."
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <input
                id="futureAssignment"
                type="checkbox"
                checked={isFutureAssignment}
                onChange={(e) => {
                  setIsFutureAssignment(e.target.checked);
                  if (e.target.checked) {
                    setIsRecurring(false);
                    setSelectedDays([]);
                    setEndDate('');
                  }
                }}
                disabled={isRecurring}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <label htmlFor="futureAssignment" className={`flex items-center gap-2 text-sm ${isRecurring ? 'text-gray-400' : 'text-gray-700'}`}>
                <CalendarDays size={16} className="text-purple-600" />
                Future Assignment (won't count toward totals)
              </label>
            </div>

            <div className="flex items-center gap-2">
              <input
                id="recurring"
                type="checkbox"
                checked={isRecurring}
                onChange={(e) => {
                  setIsRecurring(e.target.checked);
                  if (e.target.checked) {
                    setIsFutureAssignment(false);
                  }
                }}
                disabled={isFutureAssignment}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <label htmlFor="recurring" className={`flex items-center gap-2 text-sm ${isFutureAssignment ? 'text-gray-400' : 'text-gray-700'}`}>
                <RotateCcw size={16} className="text-blue-600" />
                Recurring Assignment
              </label>
            </div>

            {isRecurring && (
              <div className="space-y-3 pl-6 border-l-2 border-blue-200">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Frequency *
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {FREQUENCY_OPTIONS.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setFrequency(option.value as 'weekly' | 'biweekly' | 'monthly')}
                        className={`p-3 rounded-lg border-2 transition-all text-center ${
                          frequency === option.value
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-300 bg-white text-gray-700 hover:border-blue-300 hover:bg-blue-50'
                        }`}
                      >
                        <div className="font-medium text-sm">{option.label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Recurring Days *
                  </label>
                  <div className="grid grid-cols-7 gap-1">
                    {DAYS_OF_WEEK.map((day) => (
                      <button
                        key={day.value}
                        type="button"
                        onClick={() => toggleDay(day.value)}
                        className={`p-2 text-xs rounded-lg border transition-colors ${
                          selectedDays.includes(day.value)
                            ? 'bg-blue-500 text-white border-blue-500'
                            : 'bg-white text-gray-700 border-gray-300 hover:border-blue-300'
                        }`}
                      >
                        {day.short}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Selected: {getSelectedDaysText()}
                  </p>
                </div>

                <div>
                  <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                    End Date *
                  </label>
                  <div className="relative">
                    <Calendar size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      id="endDate"
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="input-field pl-10"
                      min={dueDate}
                      required={isRecurring}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Assignment will repeat until this date
                  </p>
                </div>
              </div>
            )}
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
              disabled={!title.trim() || !dueDate || (isRecurring && (selectedDays.length === 0 || !endDate))}
            >
              {isEdit ? 'Update Assignment' : 'Add Assignment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
