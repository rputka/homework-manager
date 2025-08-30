'use client';

import { useState, useEffect } from 'react';
import { getStoredData, resetCompletedAssignments } from '@/utils/storage';
import { AppData, Class } from '@/types';
import ClassStickyNote from '@/components/ClassStickyNote';
import AddClassModal from '@/components/AddClassModal';
import TodoStickyNote from '@/components/TodoStickyNote';
import { Plus, RotateCcw, BookOpen, Calendar } from 'lucide-react';

export default function HomePage() {
  const [data, setData] = useState<AppData>({ classes: [], lastReset: new Date().toISOString() });
  const [showAddClassModal, setShowAddClassModal] = useState(false);
  const [editingClass, setEditingClass] = useState<Class | null>(null);

  const loadData = () => {
    setData(getStoredData());
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleReset = () => {
    if (confirm('This will reset all completed assignments. Non-recurring completed assignments will be removed. Continue?')) {
      resetCompletedAssignments();
      loadData();
    }
  };

  const handleEditClass = (classData: Class) => {
    setEditingClass(classData);
  };

  const handleCloseClassModal = () => {
    setShowAddClassModal(false);
    setEditingClass(null);
  };

  // Only count non-future assignments in header totals
  const totalAssignments = data.classes.reduce((sum, classItem) => 
    sum + classItem.assignments.filter(a => !a.isFutureAssignment).length, 0
  );
  const completedAssignments = data.classes.reduce(
    (sum, classItem) => sum + classItem.assignments.filter(a => !a.isFutureAssignment && a.isCompleted).length,
    0
  );

  const formatLastReset = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Left side - Title */}
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex-shrink-0 p-2 bg-blue-100 rounded-lg">
                <BookOpen size={24} className="text-blue-600" />
              </div>
              <div className="min-w-0">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-800 truncate">Homework Manager</h1>
              </div>
            </div>

            {/* Right side - Stats and Actions */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 min-w-0">
              {/* Stats */}
              <div className="text-left sm:text-right text-sm text-gray-600 min-w-0">
                <div className="flex items-center gap-1">
                  <Calendar size={14} className="flex-shrink-0" />
                  <span className="truncate">{completedAssignments}/{totalAssignments} completed</span>
                </div>
                {data.lastReset && (
                  <div className="text-xs text-gray-500 truncate">
                    Last reset: {formatLastReset(data.lastReset)}
                  </div>
                )}
              </div>

              {/* Buttons */}
              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  onClick={handleReset}
                  className="btn-secondary flex items-center gap-2 flex-1 sm:flex-none"
                  title="Reset completed assignments"
                >
                  <RotateCcw size={16} />
                  <span className="hidden sm:inline">Reset</span>
                </button>

                <button
                  onClick={() => setShowAddClassModal(true)}
                  className="btn-primary flex items-center gap-2 flex-1 sm:flex-none"
                >
                  <Plus size={16} />
                  <span className="hidden sm:inline">Add Class</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {data.classes.length === 0 ? (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="p-4 bg-sticky-yellow rounded-lg shadow-sticky mb-6">
                <BookOpen size={48} className="text-yellow-600 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-800 mb-2">Welcome to Homework Manager!</h2>
                <p className="text-gray-600 mb-4">
                  Get started by creating your first class. Each class gets its own colorful sticky note where you can organize all your assignments.
                </p>
                <button
                  onClick={() => setShowAddClassModal(true)}
                  className="btn-primary flex items-center gap-2 mx-auto"
                >
                  <Plus size={16} />
                  Create Your First Class
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.classes.map((classItem) => (
              <div key={classItem.id} className="h-84">
                <ClassStickyNote
                  classData={classItem}
                  onUpdate={loadData}
                  onEditClass={handleEditClass}
                />
              </div>
            ))}
            
            {/* Todo List Sticky Note */}
            <div className="h-84">
              <TodoStickyNote classes={data.classes} onUpdate={loadData} />
            </div>
          </div>
        )}
      </main>

      <AddClassModal
        isOpen={showAddClassModal || editingClass !== null}
        onClose={handleCloseClassModal}
        onUpdate={loadData}
        isEdit={editingClass !== null}
        classToEdit={editingClass || undefined}
      />
    </div>
  );
}
