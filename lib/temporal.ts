import { Temporal } from "@js-temporal/polyfill";

export function getCurrentWeekId(): string {
  const now = Temporal.Now.plainDateISO();
  const year = now.year;
  const week = now.weekOfYear;
  return `${year}-W${week}`;
}

export function isNewWeek(lastUpdated: string): boolean {
  try {
    const last = Temporal.Instant.from(lastUpdated)
      .toZonedDateTimeISO(Temporal.Now.timeZoneId())
      .toPlainDate();
    const now = Temporal.Now.plainDateISO();

    // Get Monday of each week for comparison (ISO weeks start Monday)
    const lastMonday = last.subtract({ days: last.dayOfWeek - 1 });
    const nowMonday = now.subtract({ days: now.dayOfWeek - 1 });

    return !lastMonday.equals(nowMonday);
  } catch (e) {
    console.error(e);
    return false;
  }
}

export function getNextWeekStart(): string {
  const now = Temporal.Now.plainDateISO();
  const daysUntilNextMonday = 8 - now.dayOfWeek; // 1=Mon ... 7=Sun. If Sun(7), need 1 day.
  // Wait, if today is Sunday (7), next Monday is tomorrow (1 day). 8-7=1.
  // If today is Monday (1), next Monday is in 7 days. 8-1=7.
  // If today is Saturday (6), next Monday is in 2 days. 8-6=2.
  const nextMonday = now.add({ days: daysUntilNextMonday });

  // Format as "Mon, Jan 1"
  return nextMonday.toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}
