'use client';

import { useState } from 'react';
import { Assignment } from '@/types';
import { updateAssignment, deleteAssignment } from '@/utils/storage';
import { Check, X, Calendar, FileText, Clock, CalendarDays, Edit } from 'lucide-react';

interface AssignmentItemProps {
  assignment: Assignment;
  classId: string;
  onUpdate: () => void;
  onEdit: (assignment: Assignment) => void;
}

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function AssignmentItem({ assignment, classId, onUpdate, onEdit }: AssignmentItemProps) {
  const [showNotes, setShowNotes] = useState(false);

  const handleToggleComplete = () => {
    updateAssignment(classId, assignment.id, { isCompleted: !assignment.isCompleted });
    onUpdate();
  };

  const handleDelete = () => {
    deleteAssignment(classId, assignment.id);
    onUpdate();
  };

  const handleEdit = () => {
    onEdit(assignment);
  };

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

  const getRecurringText = () => {
    if (!assignment.recurringSchedule) return '';
    
    const days = assignment.recurringSchedule.daysOfWeek
      .map(day => DAYS_OF_WEEK[day])
      .join(', ');
    
    const frequencyText = assignment.recurringSchedule.frequency === 'weekly' 
      ? 'weekly' 
      : assignment.recurringSchedule.frequency === 'biweekly' 
        ? 'biweekly' 
        : 'monthly';
    
    // Parse end date in local timezone to avoid timezone issues
    const [endYear, endMonth, endDay] = assignment.recurringSchedule.endDate.split('-').map(Number);
    const endDate = new Date(endYear, endMonth - 1, endDay).toLocaleDateString();
    
    return `${frequencyText} ${days} until ${endDate}`;
  };

  const isOverdue = () => {
    const now = new Date();
    const dueTime = assignment.dueTime || '23:59'; // Default fallback
    
    // Parse date in local timezone to avoid timezone issues
    const [year, month, day] = assignment.dueDate.split('-').map(Number);
    const [hours, minutes] = dueTime.split(':').map(Number);
    const dueDateTime = new Date(year, month - 1, day, hours, minutes);
    
    return dueDateTime < now && !assignment.isCompleted;
  };

  const overdue = isOverdue();

  return (
    <div className={`assignment-item ${assignment.isCompleted ? 'completed' : ''} ${assignment.isFutureAssignment ? 'opacity-75' : ''}`}>
      <button
        onClick={handleToggleComplete}
        disabled={assignment.isFutureAssignment}
        className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors flex-shrink-0 self-start mt-3 ${
          assignment.isFutureAssignment
            ? 'border-gray-200 bg-gray-100 cursor-not-allowed'
            : assignment.isCompleted
            ? 'bg-green-500 border-green-500 text-white'
            : 'border-gray-300 hover:border-green-400'
        }`}
      >
        {assignment.isCompleted && <Check size={12} />}
      </button>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <h3 className={`assignment-title font-medium truncate ${
              overdue ? 'text-red-600' : 'text-gray-800'
            }`}>
              {assignment.title}
            </h3>
            {assignment.isFutureAssignment && (
              <CalendarDays size={14} className="text-purple-600 flex-shrink-0" />
            )}
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={handleEdit}
              className="text-gray-400 hover:text-blue-500 transition-colors p-1"
              title="Edit assignment"
            >
              <Edit size={16} />
            </button>
            <button
              onClick={handleDelete}
              className="text-gray-400 hover:text-red-500 transition-colors p-1"
              title="Delete assignment"
            >
              <X size={16} />
            </button>
          </div>
        </div>
        
        <div className="flex items-center gap-3 text-sm text-gray-600 flex-wrap">
          <div className="flex items-center gap-1 flex-shrink-0">
            <Calendar size={14} />
            <span className={overdue ? 'text-red-600 font-medium' : ''}>
              {formatDueDate(assignment.dueDate)} at {formatTime(assignment.dueTime)}
            </span>
          </div>
          
          {assignment.recurringSchedule && (
            <div className="flex items-center gap-1 text-gray-600 flex-shrink-0">
              <Clock size={14} />
              <span className="text-xs">{getRecurringText()}</span>
            </div>
          )}
          
          {assignment.notes && (
            <button
              onClick={() => setShowNotes(!showNotes)}
              className="flex items-center gap-1 hover:text-blue-600 transition-colors flex-shrink-0"
            >
              <FileText size={14} />
              <span>Notes</span>
            </button>
          )}
        </div>

        {showNotes && assignment.notes && (
          <div className="mt-2 p-2 bg-white/70 rounded text-sm text-gray-700">
            {assignment.notes}
          </div>
        )}
      </div>
    </div>
  );
}
