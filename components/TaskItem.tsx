import { Task } from "@/types";
import { formatDuration, cn } from "@/lib/utils";
import { Play, Pause, Trash2, CheckCircle2 } from "lucide-react";
import { ProgressBar } from "./ProgressBar";
import { taskStore } from "@/lib/store";

interface TaskItemProps {
  task: Task;
  isActive: boolean;
}

export function TaskItem({ task, isActive }: TaskItemProps) {
  const progress = (task.elapsedTime / task.targetTime) * 100;
  const isCompleted = task.elapsedTime >= task.targetTime;

  return (
    <div
      className={cn(
        "p-6 rounded-2xl border border-border bg-card transition-all duration-300",
        isActive && "ring-2 ring-primary ring-offset-",
        isCompleted && "bg-secondary/50",
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {isCompleted ? (
            <CheckCircle2 className="w-5 h-5 text-primary" />
          ) : (
            <div
              className={cn(
                "w-2 h-2 rounded-full",
                isActive
                  ? "bg-primary animate-pulse"
                  : "bg-muted-foreground/30",
              )}
            />
          )}
          <h3
            className={cn(
              "text-lg font-medium",
              isCompleted && "text-muted-foreground line-through",
            )}
          >
            {task.title}
          </h3>
        </div>
        <button
          onClick={() => taskStore.deleteTask(task.id)}
          className="cursor-pointer p-2 text-muted-foreground hover:text-red-500 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>{formatDuration(task.elapsedTime)}</span>
          <span>Goal: {formatDuration(task.targetTime)}</span>
        </div>

        <ProgressBar progress={progress} />

        <div className="flex justify-center pt-2">
          <button
            onClick={() => taskStore.toggleTimer(task.id)}
            disabled={isCompleted}
            className={cn(
              "flex items-center gap-2 px-6 py-2 rounded-full font-medium transition-all",
              isActive
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80",
              isCompleted && "opacity-50 cursor-not-allowed",
            )}
          >
            {isActive ? (
              <>
                <Pause className="w-4 h-4 fill-current" /> Pause
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" /> Start
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
