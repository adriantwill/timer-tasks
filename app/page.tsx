import { TaskForm } from "@/components/TaskForm";
import { HistoryStats } from "@/components/HistoryStats";
import { WeeklyProgress } from "@/components/WeeklyProgress";
import { TaskList } from "@/components/TaskList";
import { Clock } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between gap-6 mb-12 items-center">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary rounded-2xl">
              <Clock className="w-8 h-8 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground tracking-tight">
                Weekly Focus
              </h1>
              <p className="text-muted-foreground">Track your time.</p>
            </div>
          </div>
          <WeeklyProgress />
        </div>
        <section className="mb-12">
          <TaskForm />
        </section>
        <section className="space-y-6">
          <TaskList />
        </section>
        <HistoryStats />
      </div>
    </main>
  );
}
