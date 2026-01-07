export interface Task {
  id: string;
  title: string;
  targetTime: number; // in seconds
  elapsedTime: number; // in seconds
  createdAt: string; // ISO string
}

export interface WeeklyHistory {
  weekId: string; // e.g., "2024-W52"
  tasks: Task[];
}

export interface TaskStats {
  taskId: string;
  title: string;
  totalTimeSpent: number; // lifetime seconds
  weeksCompleted: number; // weeks where elapsed >= target
}

export interface AppState {
  currentTasks: Task[];
  history: WeeklyHistory[];
  lifetimeStats: TaskStats[];
  lastUpdated: string; // ISO string
}
