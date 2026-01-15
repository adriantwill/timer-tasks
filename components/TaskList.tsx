"use client";

import { TaskItem } from "@/components/TaskItem";
import { useTasks } from "@/hooks/useTasks";

export function TaskList() {
	const { tasks, activeTaskId } = useTasks();

	if (tasks.length === 0) {
		return (
			<div className="text-center py-20 bg-card rounded-3xl border border-dashed border-border">
				<p className="text-muted-foreground">
					No tasks for this week yet. Start by adding one above!
				</p>
			</div>
		);
	}

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
			{tasks.map((task) => (
				<TaskItem
					key={task.id}
					task={task}
					isActive={activeTaskId === task.id}
				/>
			))}
		</div>
	);
}
