export interface Task {
	id: string;
	title: string;
	targetTime: number; // in seconds
	elapsedTime: number; // in seconds
	createdAt: string; // ISO string
	color?: string; // hex color, defaults to primary blue
}

export interface TaskStats {
	color: string; // hex color - primary key for linking tasks
	title: string; // most recent task title with this color
	totalTimeSpent: number; // lifetime seconds
	weeksCompleted: number; // weeks where elapsed >= target
}

export interface AppState {
	currentTasks: Task[];
	lifetimeStats: TaskStats[];
	lastUpdated: string; // ISO string
}
