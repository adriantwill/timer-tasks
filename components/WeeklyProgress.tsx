"use client";

import { useTasks } from "@/hooks/useTasks";

export function WeeklyProgress() {
	const { tasks } = useTasks();
	const timedTasks = tasks.filter((t) => t.targetTime !== null);
	const totalElapsed = timedTasks.reduce((acc, t) => acc + t.elapsedTime, 0);
	const totalTarget = timedTasks.reduce((acc, t) => acc + t.targetTime!, 0);
	const totalProgress =
		totalTarget > 0 ? (totalElapsed / totalTarget) * 100 : 0;

	if (timedTasks.length === 0) return null;

	return (
		<div className="text-2xl font-bold mb-1">{Math.round(totalProgress)}%</div>
	);
}
