export interface Task {
	id: string;
	title: string;
	targetTime: number | null; // in seconds, null for no-limit tasks
	elapsedTime: number; // in seconds
	createdAt: string; // ISO string
	color?: string; // hex color, defaults to primary blue
	isManualComplete?: boolean; // for no-limit tasks
}

export interface TaskStats {
	color: string; // hex color - primary key for linking tasks
	title: string; // most recent task title with this color
	totalTimeSpent: number; // lifetime seconds
}

export interface AppState {
	currentTasks: Task[];
	lifetimeStats: TaskStats[];
	lastUpdated: string; // ISO string
}
