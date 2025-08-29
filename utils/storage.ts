import { AppData, Class, Assignment } from '@/types';

const STORAGE_KEY = 'homework-manager-data';

// Helper function to get next occurrence of a day of the week based on original due date
const getNextOccurrence = (daysOfWeek: number[], originalDueDate: string, frequency: 'weekly' | 'biweekly' | 'monthly' = 'weekly'): Date => {
  const originalDate = new Date(originalDueDate);
  const today = new Date();
  
  // Find the next occurrence after today
  let nextDate = new Date(originalDate);
  
  // Keep advancing the date until we find the next occurrence after today
  while (nextDate <= today) {
    if (frequency === 'weekly') {
      nextDate.setDate(nextDate.getDate() + 7);
    } else if (frequency === 'biweekly') {
      nextDate.setDate(nextDate.getDate() + 14);
    } else if (frequency === 'monthly') {
      nextDate.setMonth(nextDate.getMonth() + 1);
    }
  }
  
  return nextDate;
};

// Helper function to format date as YYYY-MM-DD
const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

export const getStoredData = (): AppData => {
  if (typeof window === 'undefined') {
    return { classes: [], lastReset: new Date().toISOString() };
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return { classes: [], lastReset: new Date().toISOString() };
    }
    
    const data = JSON.parse(stored);
    return {
      classes: data.classes || [],
      lastReset: data.lastReset || new Date().toISOString()
    };
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return { classes: [], lastReset: new Date().toISOString() };
  }
};

export const saveData = (data: AppData): void => {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

export const addClass = (newClass: Class): void => {
  const data = getStoredData();
  data.classes.push(newClass);
  saveData(data);
};

export const updateClass = (classId: string, updatedClass: Partial<Class>): void => {
  const data = getStoredData();
  const classIndex = data.classes.findIndex(c => c.id === classId);
  if (classIndex !== -1) {
    data.classes[classIndex] = { ...data.classes[classIndex], ...updatedClass };
    saveData(data);
  }
};

export const deleteClass = (classId: string): void => {
  const data = getStoredData();
  data.classes = data.classes.filter(c => c.id !== classId);
  saveData(data);
};

export const addAssignment = (classId: string, assignment: Assignment): void => {
  const data = getStoredData();
  const classIndex = data.classes.findIndex(c => c.id === classId);
  if (classIndex !== -1) {
    data.classes[classIndex].assignments.push(assignment);
    saveData(data);
  }
};

export const updateAssignment = (classId: string, assignmentId: string, updates: Partial<Assignment>): void => {
  const data = getStoredData();
  const classIndex = data.classes.findIndex(c => c.id === classId);
  if (classIndex !== -1) {
    const assignmentIndex = data.classes[classIndex].assignments.findIndex(a => a.id === assignmentId);
    if (assignmentIndex !== -1) {
      data.classes[classIndex].assignments[assignmentIndex] = {
        ...data.classes[classIndex].assignments[assignmentIndex],
        ...updates
      };
      saveData(data);
    }
  }
};

export const deleteAssignment = (classId: string, assignmentId: string): void => {
  const data = getStoredData();
  const classIndex = data.classes.findIndex(c => c.id === classId);
  if (classIndex !== -1) {
    data.classes[classIndex].assignments = data.classes[classIndex].assignments.filter(
      a => a.id !== assignmentId
    );
    saveData(data);
  }
};

export const resetCompletedAssignments = (): void => {
  const data = getStoredData();
  
  data.classes.forEach(classItem => {
    classItem.assignments = classItem.assignments.filter(assignment => {
      if (assignment.isCompleted) {
        // Remove non-recurring completed assignments
        if (!assignment.isRecurring) {
          return false;
        }
        
        // For recurring assignments, check if they should continue
        if (assignment.recurringSchedule) {
          const endDate = new Date(assignment.recurringSchedule.endDate);
          const today = new Date();
          
          // If past end date, remove the assignment
          if (endDate < today) {
            return false;
          }
          
          // Calculate next due date based on original due date and frequency
          const nextDueDate = getNextOccurrence(
            assignment.recurringSchedule.daysOfWeek,
            assignment.dueDate, // Use the current due date as the base
            assignment.recurringSchedule.frequency
          );
          
          // Update the assignment with new due date
          assignment.dueDate = formatDate(nextDueDate);
          assignment.recurringSchedule.nextDueDate = formatDate(nextDueDate);
          assignment.isCompleted = false;
        } else {
          // Simple recurring assignment - just reset to not completed
          assignment.isCompleted = false;
        }
      }
      return true;
    });
  });
  
  data.lastReset = new Date().toISOString();
  saveData(data);
};
