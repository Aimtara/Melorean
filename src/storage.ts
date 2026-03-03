import type { Session, DailyStats, ProgressLevel } from './types';

const SESSIONS_KEY = 'melorean_sessions';

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function getTodayDate(): string {
  return new Date().toISOString().slice(0, 10);
}

export function loadSessions(): Session[] {
  try {
    const raw = localStorage.getItem(SESSIONS_KEY);
    return raw ? (JSON.parse(raw) as Session[]) : [];
  } catch {
    return [];
  }
}

export function saveSession(session: Session): void {
  const sessions = loadSessions();
  sessions.push(session);
  localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
}

export function buildSession(
  mission: string,
  estimatedMinutes: number,
  futureMessage: string,
  actualSeconds: number,
  progressLevel: ProgressLevel,
): Session {
  return {
    id: generateId(),
    date: getTodayDate(),
    mission,
    estimatedMinutes,
    futureMessage,
    actualSeconds,
    progressLevel,
    initiatedAt: Date.now(),
  };
}

export function getDailyStats(date: string): DailyStats {
  const sessions = loadSessions().filter((s) => s.date === date);
  const totalFocusedSeconds = sessions.reduce((sum, s) => sum + s.actualSeconds, 0);
  const dilations = sessions
    .filter((s) => s.estimatedMinutes > 0)
    .map((s) => s.actualSeconds / 60 / s.estimatedMinutes);
  const averageTimeDilation =
    dilations.length > 0
      ? dilations.reduce((a, b) => a + b, 0) / dilations.length
      : 0;
  return {
    date,
    sessions,
    totalInitiations: sessions.length,
    totalFocusedSeconds,
    averageTimeDilation,
  };
}

export function formatTime(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export function calcTimeDilation(
  estimatedMinutes: number,
  actualSeconds: number,
): number {
  if (estimatedMinutes <= 0) return 0;
  return parseFloat((actualSeconds / 60 / estimatedMinutes).toFixed(2));
}
