import React, { useState } from 'react';
import type { ProgressLevel } from '../types';

interface Props {
  elapsedSeconds: number;
  onEnd: (progressLevel: ProgressLevel) => void;
}

const PROGRESS_OPTIONS: { value: ProgressLevel; label: string }[] = [
  { value: 'barely-started', label: 'Barely started' },
  { value: 'strong-progress', label: 'Strong progress' },
  { value: 'mission-complete', label: 'Mission complete' },
];

const Checkpoint: React.FC<Props> = ({ elapsedSeconds, onEnd }) => {
  const [selected, setSelected] = useState<ProgressLevel | null>(null);

  const minutes = Math.floor(elapsedSeconds / 60);
  const seconds = elapsedSeconds % 60;
  const timeStr = minutes > 0
    ? `${minutes}m ${seconds}s`
    : `${seconds}s`;

  return (
    <div className="screen">
      <div className="screen-inner">
        <div className="chime-icon" aria-hidden="true">✦</div>
        <h1 className="screen-title">Temporal Checkpoint Reached.</h1>
        <p className="screen-subtitle">
          Session time: <strong>{timeStr}</strong>
        </p>
        <p className="screen-hint">Select your progress level:</p>
        <div className="progress-options" role="group" aria-label="Progress level">
          {PROGRESS_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              className={`btn btn-option ${selected === opt.value ? 'selected' : ''}`}
              onClick={() => setSelected(opt.value)}
              aria-pressed={selected === opt.value}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <button
          className="btn btn-primary"
          disabled={!selected}
          onClick={() => selected && onEnd(selected)}
        >
          End Session →
        </button>
        <p className="calibration-note">
          Calibration improves with awareness.
        </p>
      </div>
    </div>
  );
};

export default Checkpoint;
