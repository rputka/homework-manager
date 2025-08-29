'use client';

import { useState } from 'react';
import { Class } from '@/types';
import { deleteClass } from '@/utils/storage';
import AssignmentItem from './AssignmentItem';
import AddAssignmentModal from './AddAssignmentModal';
import { Plus, Trash2, BookOpen } from 'lucide-react';

interface ClassStickyNoteProps {
  classData: Class;
  onUpdate: () => void;
}

export default function ClassStickyNote({ classData, onUpdate }: ClassStickyNoteProps) {
  const [showAddModal, setShowAddModal] = useState(false);

  const handleDeleteClass = () => {
    if (confirm(`Are you sure you want to delete "${classData.name}" and all its assignments?`)) {
      deleteClass(classData.id);
      onUpdate();
    }
  };

  const completedCount = classData.assignments.filter(a => a.isCompleted).length;
  const totalCount = classData.assignments.length;

  return (
    <>
      <div className={`sticky-note ${classData.color} animate-bounce-in flex flex-col h-full max-h-full`}>
        <div className="flex items-center justify-between mb-4 flex-shrink-0">
          <div className="flex items-center gap-2">
            <BookOpen size={20} className="text-gray-700" />
            <h2 className="text-xl font-bold text-gray-800">{classData.name}</h2>
          </div>
          <button
            onClick={handleDeleteClass}
            className="text-gray-400 hover:text-red-500 transition-colors p-1"
            title="Delete class"
          >
            <Trash2 size={16} />
          </button>
        </div>

        <div className="mb-4 flex-shrink-0">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
            <span>Assignments ({completedCount}/{totalCount} completed)</span>
            {totalCount > 0 && (
              <div className="w-16 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%` }}
                />
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 space-y-2 mb-4 overflow-y-auto min-h-0 max-h-48">
          {classData.assignments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <BookOpen size={32} className="mx-auto mb-2 opacity-50" />
              <p className="text-sm">No assignments yet</p>
              <p className="text-xs">Click the + button to add your first assignment</p>
            </div>
          ) : (
            classData.assignments
              .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
              .map((assignment) => (
                <AssignmentItem
                  key={assignment.id}
                  assignment={assignment}
                  classId={classData.id}
                  onUpdate={onUpdate}
                />
              ))
          )}
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="w-full btn-primary flex items-center justify-center gap-2 mt-auto flex-shrink-0"
        >
          <Plus size={16} />
          Add Assignment
        </button>
      </div>

      <AddAssignmentModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        classId={classData.id}
        classColor={classData.color}
        onUpdate={onUpdate}
      />
    </>
  );
}
