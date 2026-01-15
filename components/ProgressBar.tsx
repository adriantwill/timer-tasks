import { cn } from "@/lib/utils";

interface ProgressBarProps {
	progress: number;
	className?: string;
}

export function ProgressBar({ progress, className }: ProgressBarProps) {
	const percentage = Math.min(Math.max(progress, 0), 100);

	return (
		<div
			className={cn(
				"h-2 w-full bg-secondary rounded-full overflow-hidden",
				className,
			)}
		>
			<div
				className="h-full bg-primary transition-all duration-500 ease-out"
				style={{ width: `${percentage}%` }}
			/>
		</div>
	);
}
