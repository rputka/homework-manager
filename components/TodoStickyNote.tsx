'use client';

import { useState, useEffect } from 'react';
import { Assignment, Class, StickyColor } from '@/types';
import { Calendar, Clock, CalendarDays, Settings } from 'lucide-react';
import TodoColorModal from './TodoColorModal';

interface TodoStickyNoteProps {
  classes: Class[];
}

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const TODO_COLOR_KEY = 'todo-sticky-note-color';

export default function TodoStickyNote({ classes }: TodoStickyNoteProps) {
  const [todoColor, setTodoColor] = useState<StickyColor>('yellow');
  const [showColorModal, setShowColorModal] = useState(false);

  // Load saved color from localStorage
  useEffect(() => {
    const savedColor = localStorage.getItem(TODO_COLOR_KEY) as StickyColor;
    if (savedColor) {
      setTodoColor(savedColor);
    }
  }, []);

  // Save color to localStorage
  const handleColorChange = (color: StickyColor) => {
    setTodoColor(color);
    localStorage.setItem(TODO_COLOR_KEY, color);
  };

  // Get all active assignments (non-future) from all classes
  const allActiveAssignments = classes.flatMap(classItem => 
    classItem.assignments
      .filter(assignment => !assignment.isFutureAssignment)
      .map(assignment => ({
        ...assignment,
        className: classItem.name,
        classColor: classItem.color
      }))
  );

  // Sort by due date and time
  const sortedAssignments = allActiveAssignments.sort((a, b) => {
    const aDateTime = new Date(`${a.dueDate}T${a.dueTime || '23:59'}`);
    const bDateTime = new Date(`${b.dueDate}T${b.dueTime || '23:59'}`);
    return aDateTime.getTime() - bDateTime.getTime();
  });

  const formatDueDate = (dateString: string) => {
    // Handle date string in local timezone to avoid timezone issues
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day); // month is 0-indexed
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString();
    }
  };

  const formatTime = (timeString: string | undefined) => {
    if (!timeString) return '11:59 PM'; // Default fallback for existing assignments
    
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const isOverdue = (assignment: Assignment) => {
    const now = new Date();
    const dueTime = assignment.dueTime || '23:59'; // Default fallback
    
    // Parse date in local timezone to avoid timezone issues
    const [year, month, day] = assignment.dueDate.split('-').map(Number);
    const [hours, minutes] = dueTime.split(':').map(Number);
    const dueDateTime = new Date(year, month - 1, day, hours, minutes);
    
    return dueDateTime < now && !assignment.isCompleted;
  };

  const getRecurringText = (assignment: Assignment) => {
    if (!assignment.recurringSchedule) return '';
    
    const days = assignment.recurringSchedule.daysOfWeek
      .map(day => DAYS_OF_WEEK[day])
      .join(', ');
    
    const frequencyText = assignment.recurringSchedule.frequency === 'weekly' 
      ? 'weekly' 
      : assignment.recurringSchedule.frequency === 'biweekly' 
        ? 'biweekly' 
        : 'monthly';
    
    return `${frequencyText} ${days}`;
  };

  const completedCount = sortedAssignments.filter(a => a.isCompleted).length;
  const totalCount = sortedAssignments.length;

  if (totalCount === 0) {
    return null; // Don't show the todo sticky note if there are no assignments
  }

  return (
    <div className={`sticky-note ${todoColor} animate-bounce-in flex flex-col h-full max-h-full`}>
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <h2 className="text-lg font-bold text-gray-800">📋 All Assignments</h2>
        <button
          onClick={() => setShowColorModal(true)}
          className="text-gray-400 hover:text-gray-600 transition-colors p-1"
          title="Change color"
        >
          <Settings size={16} />
        </button>
      </div>
      
      <div className="mb-4 flex-shrink-0">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-600 mt-1">
          {completedCount} of {totalCount} completed
        </p>
      </div>

      <div className="flex-1 space-y-2 mb-4 overflow-y-auto min-h-0 max-h-48">
        {sortedAssignments.map((assignment) => {
          const overdue = isOverdue(assignment);
          
          return (
            <div
              key={`${assignment.id}-${assignment.className}`}
              className={`p-3 bg-white/70 rounded-lg border-l-4 ${
                assignment.isCompleted ? 'opacity-60' : ''
              }`}
              style={{ borderLeftColor: `var(--sticky-${assignment.classColor})` }}
            >
              <div className="flex items-start gap-3">
                <div className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                  assignment.isCompleted
                    ? 'bg-green-500 border-green-500'
                    : 'border-gray-300'
                }`}>
                  {assignment.isCompleted && (
                    <div className="w-2 h-2 bg-white rounded-sm"></div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className={`font-medium truncate text-sm ${
                      assignment.isCompleted 
                        ? 'line-through text-gray-500' 
                        : overdue 
                        ? 'text-red-600' 
                        : 'text-gray-800'
                    }`}>
                      {assignment.title}
                    </h3>
                    <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
                      {assignment.className}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-xs text-gray-600 flex-wrap">
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <Calendar size={12} />
                      <span className={overdue ? 'text-red-600 font-medium' : ''}>
                        {formatDueDate(assignment.dueDate)} at {formatTime(assignment.dueTime)}
                      </span>
                    </div>
                    
                    {assignment.recurringSchedule && (
                      <div className="flex items-center gap-1 text-gray-500 flex-shrink-0">
                        <Clock size={12} />
                        <span>{getRecurringText(assignment)}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        }        )}
      </div>

      <TodoColorModal
        isOpen={showColorModal}
        onClose={() => setShowColorModal(false)}
        currentColor={todoColor}
        onColorChange={handleColorChange}
      />
    </div>
  );
}
