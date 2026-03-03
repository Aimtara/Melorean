export type Screen =
  | 'dashboard'
  | 'mission'
  | 'estimate'
  | 'future-self'
  | 'jump'
  | 'checkpoint'
  | 'feedback'
  | 'closure'
  | 'recap';

export type ProgressLevel =
  | 'barely-started'
  | 'strong-progress'
  | 'mission-complete';

export interface Session {
  id: string;
  date: string; // ISO date string YYYY-MM-DD
  mission: string;
  estimatedMinutes: number;
  futureMessage: string;
  actualSeconds: number;
  progressLevel: ProgressLevel;
  initiatedAt: number; // timestamp ms
}

export interface DailyStats {
  date: string;
  sessions: Session[];
  totalInitiations: number;
  totalFocusedSeconds: number;
  averageTimeDilation: number;
}
