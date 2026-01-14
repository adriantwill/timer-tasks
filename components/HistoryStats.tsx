"use client";
import { useTasks } from "@/hooks/useTasks";
import { formatDuration } from "@/lib/utils";
import { Download } from "lucide-react";

export function HistoryStats() {
  const { lifetimeStats, exportData } = useTasks();

  const hasStats = lifetimeStats && lifetimeStats.length > 0;

  if (!hasStats) return null;

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
    </div>
  );
}
