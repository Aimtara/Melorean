import React from 'react';
import type { DailyStats } from '../types';
import { formatTime } from '../storage';

interface Props {
  stats: DailyStats;
  onBack: () => void;
}

const PROGRESS_LABELS: Record<string, string> = {
  'barely-started': 'Barely started',
  'strong-progress': 'Strong progress',
  'mission-complete': 'Mission complete',
};

const Recap: React.FC<Props> = ({ stats, onBack }) => (
  <div className="screen">
    <div className="screen-inner">
      <h1 className="screen-title">End-of-Day Recap</h1>
      <p className="screen-subtitle">
        {new Date(stats.date + 'T00:00:00').toLocaleDateString(undefined, {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
        })}
      </p>

      <div className="recap-stats">
        <div className="stat-card">
          <span className="stat-value">{stats.totalInitiations}</span>
          <span className="stat-label">Missions Initiated</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{formatTime(stats.totalFocusedSeconds)}</span>
          <span className="stat-label">Total Focused Time</span>
        </div>
        {stats.averageTimeDilation > 0 && (
          <div className="stat-card">
            <span className="stat-value">{stats.averageTimeDilation.toFixed(2)}×</span>
            <span className="stat-label">Avg Time Dilation</span>
          </div>
        )}
      </div>

      {stats.sessions.length > 0 ? (
        <ul className="session-list" aria-label="Today's sessions">
          {stats.sessions.map((s) => (
            <li key={s.id} className="session-item">
              <span className="session-mission">{s.mission}</span>
              <span className="session-meta">
                {PROGRESS_LABELS[s.progressLevel] ?? s.progressLevel} ·{' '}
                {formatTime(s.actualSeconds)}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="no-sessions">No sessions logged today yet.</p>
      )}

      <p className="recap-reinforcement">
        Momentum builds through initiation.
      </p>

      <button className="btn btn-primary" onClick={onBack}>
        Return to Dashboard
      </button>
    </div>
  </div>
);

export default Recap;
