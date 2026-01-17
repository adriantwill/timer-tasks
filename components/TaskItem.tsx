import { CheckCircle2, Pause, Play, Trash2 } from "lucide-react";
import { useRef } from "react";
import { taskStore } from "@/lib/store";
import { cn, formatDuration } from "@/lib/utils";
import type { Task } from "@/types";
import { ProgressBar } from "./ProgressBar";

interface TaskItemProps {
	task: Task;
	isActive: boolean;
}

export function TaskItem({ task, isActive }: TaskItemProps) {
	const isNoLimit = task.targetTime === null;
	const progress = isNoLimit ? 0 : (task.elapsedTime / task.targetTime) * 100;
	const isCompleted = isNoLimit
		? task.isManualComplete === true
		: task.elapsedTime >= task.targetTime;
	const colorPickerRef = useRef<HTMLInputElement>(null);

	const taskColor = task.color || "#3873fc";

	const handleColorClick = () => {
		if (!isCompleted) {
			colorPickerRef.current?.click();
		}
	};

	const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		taskStore.updateTaskColor(task.id, e.target.value);
	};

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
						<div className="relative">
							<button
								type="button"
								onClick={handleColorClick}
								className={cn(
									"w-3 h-3 rounded-full cursor-pointer hover:ring-2 hover:ring-offset-1 transition-all",
									isActive && "animate-pulse",
								)}
								style={{ backgroundColor: taskColor }}
							/>
							<input
								ref={colorPickerRef}
								type="color"
								value={taskColor}
								onChange={handleColorChange}
								className="absolute opacity-0 pointer-events-none"
							/>
						</div>
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
					type="button"
					onClick={() => taskStore.deleteTask(task.id)}
					className="cursor-pointer p-2 text-muted-foreground hover:text-red-500 transition-colors"
				>
					<Trash2 className="w-4 h-4" />
				</button>
			</div>

			<div className="space-y-4">
				{isNoLimit ? (
					<div className="flex justify-between items-center text-sm">
						<span className="text-muted-foreground">
							{formatDuration(task.elapsedTime)}
						</span>
						<label className="flex items-center gap-2 cursor-pointer">
							<input
								type="checkbox"
								checked={isCompleted}
								onChange={() => taskStore.toggleManualComplete(task.id)}
								className="w-4 h-4 rounded border-input cursor-pointer"
							/>
							<span className="text-muted-foreground text-xs">Done</span>
						</label>
					</div>
				) : (
					<>
						<div className="flex justify-between text-sm text-muted-foreground">
							<span>{formatDuration(task.elapsedTime)}</span>
							<span>Goal: {formatDuration(task.targetTime!)}</span>
						</div>
						<ProgressBar progress={progress} />
					</>
				)}

				<div className="flex justify-center pt-2">
					<button
						type="button"
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
