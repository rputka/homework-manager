export interface Assignment {
  id: string;
  title: string;
  dueDate: string;
  dueTime: string; // HH:MM format
  notes: string;
  isRecurring: boolean;
  recurringSchedule?: {
    daysOfWeek: number[]; // 0 = Sunday, 1 = Monday, etc.
    endDate: string;
    nextDueDate: string;
  };
  isCompleted: boolean;
  createdAt: string;
}

export interface Class {
  id: string;
  name: string;
  color: StickyColor;
  assignments: Assignment[];
  createdAt: string;
}

export type StickyColor = 'yellow' | 'pink' | 'blue' | 'green' | 'purple' | 'orange';

export interface AppData {
  classes: Class[];
  lastReset: string;
}
