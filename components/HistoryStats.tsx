"use client";
import { Download } from "lucide-react";
import { useTasks } from "@/hooks/useTasks";
import { formatDuration } from "@/lib/utils";

export function HistoryStats() {
	const { lifetimeStats, exportData } = useTasks();

	const hasStats = lifetimeStats && lifetimeStats.length > 0;

	const copyColorToClipboard = async (color: string) => {
		await navigator.clipboard.writeText(color);
	};

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
							type="button"
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
									<button
										type="button"
										className="w-3 h-3 rounded-full shrink-0 cursor-pointer hover:ring-2 hover:ring-offset-1 hover:ring-foreground/20 transition-all"
										style={{ backgroundColor: stat.color }}
										onClick={() => copyColorToClipboard(stat.color)}
										title={`Click to copy ${stat.color}`}
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
