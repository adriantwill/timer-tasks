import * as clsx from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: clsx.ClassValue[]) {
	return twMerge(clsx.clsx(inputs));
}

export function formatDuration(seconds: number): string {
	const h = Math.floor(seconds / 3600);
	const m = Math.floor((seconds % 3600) / 60);
	const s = seconds % 60;
	return `${h}h ${m}m ${s}s`;
}

export function formatTimeInput(seconds: number): string {
	const h = Math.floor(seconds / 3600);
	return `${h}`;
}
