import { AppState, Task, WeeklyHistory } from '@/types';
import { getCurrentWeekId, isNewWeek } from '@/lib/temporal';
import { Temporal } from '@js-temporal/polyfill';

const STORAGE_KEY = 'timer-tasks-state';

// Default initial state
const initialState: AppState = {
  currentTasks: [],
  history: [],
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
  
  // Cache the snapshot to ensure referential stability
  private snapshot = defaultSnapshot;

  constructor() {
    this.state = initialState;
    
    // Attempt to load immediately if on client
    if (typeof window !== 'undefined') {
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
    const newHistory: WeeklyHistory = {
      weekId: oldState.lastUpdated,
      tasks: oldState.currentTasks,
    };
    
    this.state = {
      currentTasks: oldState.currentTasks.map(t => ({ ...t, elapsedTime: 0 })),
      history: [newHistory, ...oldState.history].slice(0, 5),
      lastUpdated: Temporal.Now.instant().toString(),
    };
    this.save();
  }

  private save() {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    }
    this.updateSnapshot();
    this.emitChange();
  }

  private emitChange() {
    this.listeners.forEach(listener => listener());
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
  }

  // --- Actions ---

  public addTask(title: string, hours: number) {
    const newTask: Task = {
      id: crypto.randomUUID(),
      title,
      targetTime: hours * 3600,
      elapsedTime: 0,
      createdAt: Temporal.Now.instant().toString(),
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
      currentTasks: this.state.currentTasks.filter(t => t.id !== id),
    };
    this.save();
  }

  public toggleTimer(id: string) {
    if (this.activeTaskId === id) {
      // Pause
      this.activeTaskId = null;
      if (this.timer) clearInterval(this.timer);
      this.timer = null;
    } else {
      // Start
      if (this.timer) clearInterval(this.timer);
      this.activeTaskId = id;
      this.timer = setInterval(() => this.tick(), 1000);
    }
    this.updateSnapshot();
    this.emitChange();
  }

  private tick() {
    if (!this.activeTaskId) return;

    this.state = {
      ...this.state,
      currentTasks: this.state.currentTasks.map(t => 
        t.id === this.activeTaskId ? { ...t, elapsedTime: t.elapsedTime + 1 } : t
      ),
      lastUpdated: Temporal.Now.instant().toString(),
    };
    this.save();
  }
}

export const taskStore = new TaskStore();
