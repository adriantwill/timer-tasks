"use client";
import { useTasks } from "@/hooks/useTasks";
import { formatDuration } from "@/lib/utils";
import { Download } from "lucide-react";

export function HistoryStats() {
  const { history, lifetimeStats, exportData } = useTasks();

  const hasHistory = history && history.length > 0;
  const hasStats = lifetimeStats && lifetimeStats.length > 0;

  if (!hasHistory && !hasStats) return null;

  const lastWeek = hasHistory ? history[0] : null;
  const displayDate = lastWeek?.weekId.split("T")[0];

  return (
    <div className="mt-16 pt-8 border-t border-border">
      {/* Lifetime Stats */}
      {hasStats && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
              Lifetime Stats
            </h4>
            <button
              onClick={exportData}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <Download className="w-3 h-3" />
              Export
            </button>
          </div>
          <div className="space-y-3">
            {lifetimeStats.map((stat) => (
              <div
                key={stat.color}
                className="flex items-center justify-between text-xs text-muted-foreground"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: stat.color }}
                  />
                  <span className="font-medium truncate max-w-50">
                    {stat.title}
                  </span>
                </div>
                <div className="flex gap-4">
                  <span>{stat.weeksCompleted} weeks completed</span>
                  <span>{formatDuration(stat.totalTimeSpent)} total</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Previous Week Summary */}
      {lastWeek && (
        <>
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
              Previous Week ({displayDate})
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
        </>
      )}
    </div>
  );
}
