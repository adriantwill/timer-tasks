import { Temporal } from "@js-temporal/polyfill";
import { getCurrentWeekId, isNewWeek } from "@/lib/temporal";
import type { AppState, Task } from "@/types";

const STORAGE_KEY = "timer-tasks-state";

// Default initial state
const initialState: AppState = {
	currentTasks: [],
	lifetimeStats: [],
	lastUpdated: Temporal.Now.instant().toString(),
};

// Stable snapshot for server rendering (prevents hydration mismatch loop)
const defaultSnapshot = {
	...initialState,
	activeTaskId: null as string | null,
};

class TaskStore {
	private state: AppState;
	private activeTaskId: string | null = null;
	private listeners: Set<() => void> = new Set();
	private timer: NodeJS.Timeout | null = null;
	private lastTickTime: number = 0;

	// Cache the snapshot to ensure referential stability
	private snapshot = defaultSnapshot;

	constructor() {
		this.state = initialState;

		// Attempt to load immediately if on client
		if (typeof window !== "undefined") {
			this.load();
		}
	}

	private updateSnapshot() {
		this.snapshot = {
			...this.state,
			activeTaskId: this.activeTaskId,
		};
	}

	private load() {
		try {
			const saved = localStorage.getItem(STORAGE_KEY);
			if (saved) {
				const parsed = JSON.parse(saved) as AppState;

				if (isNewWeek(parsed.lastUpdated)) {
					this.handleWeeklyReset(parsed);
				} else {
					this.state = parsed;
					this.updateSnapshot();
				}
			}
		} catch (e) {
			console.error("Failed to load state", e);
		}
	}

	private handleWeeklyReset(oldState: AppState) {
		// Update lifetime stats for each task (grouped by color)
		const updatedStats = [...(oldState.lifetimeStats || [])];
		for (const task of oldState.currentTasks) {
			if (task.elapsedTime === 0) continue; // skip tasks with no time
			const taskColor = task.color || "#3873fc";
			const existing = updatedStats.find((s) => s.color === taskColor);

			if (existing) {
				// Add to breakdown
				const breakdown = existing.breakdown || [];
				const existingEntry = breakdown.find((b) => b.title === task.title);
				if (existingEntry) {
					existingEntry.time += task.elapsedTime;
				} else {
					breakdown.push({ title: task.title, time: task.elapsedTime });
				}
				existing.breakdown = breakdown;
				// Compute total from breakdown
				existing.totalTimeSpent = breakdown.reduce((sum, b) => sum + b.time, 0);
			} else {
				updatedStats.push({
					color: taskColor,
					title: task.title,
					totalTimeSpent: task.elapsedTime,
					breakdown: [{ title: task.title, time: task.elapsedTime }],
				});
			}
		}

		this.state = {
			currentTasks: oldState.currentTasks.map((t) => ({
				...t,
				elapsedTime: 0,
				isManualComplete: false,
			})),
			lifetimeStats: updatedStats,
			lastUpdated: Temporal.Now.instant().toString(),
		};
		this.save();
	}

	private save() {
		if (typeof window !== "undefined") {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
		}
		this.updateSnapshot();
		this.emitChange();
	}

	private emitChange() {
		this.listeners.forEach((listener) => {
			listener();
		});
	}

	// --- Subscription for React ---
	public subscribe = (listener: () => void) => {
		this.listeners.add(listener);
		return () => {
			this.listeners.delete(listener);
		};
	};

	public getSnapshot = () => {
		return this.snapshot;
	};

	public getServerSnapshot = () => {
		return defaultSnapshot;
	};

	// --- Actions ---

	public addTask(title: string, hours: number | null) {
		const newTask: Task = {
			id: crypto.randomUUID(),
			title,
			targetTime: hours !== null ? hours * 3600 : null,
			elapsedTime: 0,
			createdAt: Temporal.Now.instant().toString(),
			color: "#3873fc",
			isManualComplete: false,
		};
		this.state = {
			...this.state,
			currentTasks: [...this.state.currentTasks, newTask],
		};
		this.save();
	}

	public deleteTask(id: string) {
		if (this.activeTaskId === id) {
			this.toggleTimer(id); // Will handle snapshot update internally via emitChange/toggle logic?
			// toggleTimer updates snapshot, but let's be safe.
			// Actually toggleTimer might NOT save to localstorage if it just pauses,
			// but here we are deleting.
		}
		this.state = {
			...this.state,
			currentTasks: this.state.currentTasks.filter((t) => t.id !== id),
		};
		this.save();
	}

	public updateTaskColor(id: string, color: string) {
		this.state = {
			...this.state,
			currentTasks: this.state.currentTasks.map((t) =>
				t.id === id ? { ...t, color } : t,
			),
		};
		this.save();
	}

	public toggleManualComplete(id: string) {
		this.state = {
			...this.state,
			currentTasks: this.state.currentTasks.map((t) =>
				t.id === id ? { ...t, isManualComplete: !t.isManualComplete } : t,
			),
		};
		this.save();
	}

	public renameLifetimeStat(color: string, newTitle: string) {
		this.state = {
			...this.state,
			lifetimeStats: this.state.lifetimeStats.map((s) =>
				s.color === color ? { ...s, title: newTitle } : s,
			),
		};
		this.save();
	}

	public toggleTimer(id: string) {
		if (this.activeTaskId === id) {
			// Pause
			this.activeTaskId = null;
			if (this.timer) clearInterval(this.timer);
			this.timer = null;
			this.lastTickTime = 0;
		} else {
			// Start
			if (this.timer) clearInterval(this.timer);
			this.activeTaskId = id;
			this.lastTickTime = Date.now();
			this.timer = setInterval(() => this.tick(), 1000);
		}
		this.updateSnapshot();
		this.emitChange();
	}

	private tick() {
		if (!this.activeTaskId) return;

		const now = Date.now();
		const elapsed = now - this.lastTickTime;

		// If > 3 minutes elapsed, system was likely asleep - pause timer
		if (elapsed > 180000) {
			this.toggleTimer(this.activeTaskId);
			return;
		}

		this.lastTickTime = now;

		this.state = {
			...this.state,
			currentTasks: this.state.currentTasks.map((t) =>
				t.id === this.activeTaskId
					? { ...t, elapsedTime: t.elapsedTime + 1 }
					: t,
			),
			lastUpdated: Temporal.Now.instant().toString(),
		};
		this.save();
	}

	public exportData() {
		const data = {
			exportedAt: Temporal.Now.instant().toString(),
			...this.state,
		};
		const blob = new Blob([JSON.stringify(data, null, 2)], {
			type: "application/json",
		});
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `timer-tasks-${getCurrentWeekId()}.json`;
		a.click();
		URL.revokeObjectURL(url);
	}
}

export const taskStore = new TaskStore();
