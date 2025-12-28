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

export interface AppState {
  currentTasks: Task[];
  history: WeeklyHistory[];
  lastUpdated: string; // ISO string
}
