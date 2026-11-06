// Matches business.hours in content.ts — keep these in sync if hours change.
export const STORE_OPEN = "08:00";
export const STORE_CLOSE_SUNDAY = "17:00";
export const STORE_CLOSE_OTHER_DAYS = "18:00";

export function formatLocalDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function minLeadDate(leadDays: number): string {
  const d = new Date();
  d.setDate(d.getDate() + leadDays);
  return formatLocalDate(d);
}

export function getWeekday(dateStr: string): number {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d).getDay();
}

export function storeCloseTime(dateStr: string): string {
  return dateStr && getWeekday(dateStr) === 0 ? STORE_CLOSE_SUNDAY : STORE_CLOSE_OTHER_DAYS;
}

export function formatTimeLabel(time: string): string {
  const [h, m] = time.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${String(m).padStart(2, "0")} ${period}`;
}
