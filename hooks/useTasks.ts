"use client";

import { useSyncExternalStore } from "react";
import { taskStore } from "@/lib/store";

export function useTasks() {
  const snapshot = useSyncExternalStore(
    taskStore.subscribe,
    taskStore.getSnapshot,
    taskStore.getServerSnapshot,
  );

  return {
    tasks: snapshot.currentTasks,
    lifetimeStats: snapshot.lifetimeStats,
    activeTaskId: snapshot.activeTaskId,
    addTask: (title: string, hours: number) => taskStore.addTask(title, hours),
    toggleTimer: (id: string) => taskStore.toggleTimer(id),
    deleteTask: (id: string) => taskStore.deleteTask(id),
    exportData: () => taskStore.exportData(),
  };
}
