"use client";

import { useTasks } from "@/hooks/useTasks";
import { getNextWeekStart } from "@/lib/temporal";
import { useEffect, useState } from "react";

export function WeeklyProgress() {
  const { tasks } = useTasks();
  const [nextReset, setNextReset] = useState<string>("");

  useEffect(() => {
    setNextReset(getNextWeekStart());
  }, []);

  const totalElapsed = tasks.reduce((acc, t) => acc + t.elapsedTime, 0);
  const totalTarget = tasks.reduce((acc, t) => acc + t.targetTime, 0);
  const totalProgress =
    totalTarget > 0 ? (totalElapsed / totalTarget) * 100 : 0;

  if (tasks.length === 0) return null;

  return (
    <div className="text-right">
      <div className="text-sm text-muted-foreground font-medium uppercase tracking-wider mb-1">
        Weekly Progress
      </div>
      <div className="text-2xl font-bold mb-1">
        {Math.round(totalProgress)}%
      </div>
      <div className="text-xs text-muted-foreground/70">Resets {nextReset}</div>
    </div>
  );
}
