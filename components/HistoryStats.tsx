"use client";
import { useTasks } from "@/hooks/useTasks";
import { formatDuration } from "@/lib/utils";

export function HistoryStats() {
  const { history } = useTasks();

  if (!history || history.length === 0) return null;

  const lastWeek = history[0];
  // Parse the week ID or last updated string if possible
  const displayDate = lastWeek.weekId.split("T")[0];

  return (
    <div className="mt-16 pt-8 border-t border-border">
      <div className="flex items-center justify-between mb-6">
        <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
          Previous Week Summary ({displayDate})
        </h4>
      </div>
      <div className="space-y-3">
        {lastWeek.tasks.map((task) => {
          const progress = Math.round(
            (task.elapsedTime / task.targetTime) * 100,
          );
          return (
            <div
              key={task.id}
              className="flex items-center justify-between text-xs text-muted-foreground"
            >
              <span className="font-medium truncate max-w-50">
                {task.title}
              </span>
              <div className="flex gap-4">
                <span>{progress}% complete</span>
                <span>{formatDuration(task.elapsedTime)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
