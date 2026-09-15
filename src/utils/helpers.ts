import { Task, EffectiveStatus, Program, Meeting } from '../types';

export function uid(prefix = 't'): string {
  return prefix + '_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 7);
}

export function todayStr(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function isOverdue(dueOrTask?: Task | string, status?: string): boolean {
  if (typeof dueOrTask === 'object' && dueOrTask !== null) {
    return dueOrTask.status !== 'done' && Boolean(dueOrTask.due) && (dueOrTask.due as string) < todayStr();
  }
  return status !== 'done' && Boolean(dueOrTask) && (dueOrTask as string) < todayStr();
}

export function getEffectiveStatus(t: Task): EffectiveStatus {
  if (isOverdue(t)) return 'overdue';
  return t.status;
}

export function daysUntilNextBirthday(dateStr: string): number {
  if (!dateStr || !dateStr.includes('-')) return 999;
  const parts = dateStr.split('-');
  if (parts.length < 3) return 999;
  const mm = parseInt(parts[1], 10);
  const dd = parseInt(parts[2], 10);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let next = new Date(today.getFullYear(), mm - 1, dd);
  next.setHours(0, 0, 0, 0);

  if (next < today) {
    next = new Date(today.getFullYear() + 1, mm - 1, dd);
    next.setHours(0, 0, 0, 0);
  }

  const diffTime = next.getTime() - today.getTime();
  return Math.round(diffTime / (1000 * 60 * 60 * 24));
}

export function formatBdayDisplay(dateStr: string): string {
  if (!dateStr || !dateStr.includes('-')) return dateStr;
  const parts = dateStr.split('-');
  if (parts.length < 3) return dateStr;
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthIdx = parseInt(parts[1], 10) - 1;
  const monthName = months[monthIdx] || parts[1];
  return `${parseInt(parts[2], 10)} ${monthName}`;
}

export function formatDatePretty(dateStr?: string): string {
  if (!dateStr) return '';
  try {
    const [year, month, day] = dateStr.split('-').map(Number);
    if (!year || !month || !day) return dateStr;
    const d = new Date(year, month - 1, day);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return dateStr;
  }
}

export function statusLabel(s: 'all' | EffectiveStatus): string {
  switch (s) {
    case 'all': return 'All';
    case 'pending': return 'Pending';
    case 'progress': return 'In Progress';
    case 'done': return 'Done';
    case 'overdue': return 'Overdue';
    default: return s;
  }
}

export function daysFromToday(dateStr: string): number {
  if (!dateStr) return 999;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [y, m, d] = dateStr.split('-').map(Number);
  const target = new Date(y, m - 1, d);
  target.setHours(0, 0, 0, 0);
  return Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}
