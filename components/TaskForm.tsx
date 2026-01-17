"use client";
import { Plus } from "lucide-react";
import { useState } from "react";
import { taskStore } from "@/lib/store";

export function TaskForm() {
	const [title, setTitle] = useState("");
	const [hours, setHours] = useState("");

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!title) return;
		const hoursValue = hours ? parseFloat(hours) : null;
		taskStore.addTask(title, hoursValue);
		setTitle("");
		setHours("");
	};

	return (
		<form
			onSubmit={handleSubmit}
			className="flex flex-col md:flex-row gap-4 mb-8"
		>
			<input
				type="text"
				placeholder="Task name (e.g., Learning Piano)"
				value={title}
				onChange={(e) => setTitle(e.target.value)}
				className="flex-1 px-4 py-3 rounded-xl border border-input bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all placeholder:text-muted-foreground"
				required
			/>
			<input
				type="number"
				placeholder="Hours (optional)"
				value={hours}
				onChange={(e) => setHours(e.target.value)}
				className="w-full md:w-32 px-4 py-3 rounded-xl border border-input bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all placeholder:text-muted-foreground"
				min="0.1"
				step="0.1"
			/>
			<button
				type="submit"
				className="bg-primary text-primary-foreground px-6 py-3 rounded-xl font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-all"
			>
				<Plus className="w-5 h-5" /> Add Task
			</button>
		</form>
	);
}
