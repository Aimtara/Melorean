import React from 'react';
import { calcTimeDilation, formatTime } from '../storage';

interface Props {
  estimatedMinutes: number;
  actualSeconds: number;
  onNext: () => void;
}

const Feedback: React.FC<Props> = ({ estimatedMinutes, actualSeconds, onNext }) => {
  const dilation = calcTimeDilation(estimatedMinutes, actualSeconds);
  const dilationLabel =
    dilation < 0.8
      ? 'Task compressed — you moved faster than predicted.'
      : dilation > 1.2
      ? 'Task expanded — time felt different in the field.'
      : 'Near-perfect temporal alignment.';

  const estimatedStr = `${estimatedMinutes}m 00s`;
  const actualStr = formatTime(actualSeconds).replace(':', 'm ') + 's';

  return (
    <div className="screen">
      <div className="screen-inner">
        <h1 className="screen-title">Clock Synchronization</h1>
        <p className="screen-subtitle">Time variance analysis</p>

        <div className="sync-table">
          <div className="sync-row">
            <span className="sync-key">Estimated</span>
            <span className="sync-val">{estimatedStr}</span>
          </div>
          <div className="sync-row">
            <span className="sync-key">Actual</span>
            <span className="sync-val">{actualStr}</span>
          </div>
          <div className="sync-row dilation-row">
            <span className="sync-key">Time Dilation Factor</span>
            <span className="sync-val dilation-val">{dilation}×</span>
          </div>
        </div>

        <p className="dilation-note">{dilationLabel}</p>

        <button className="btn btn-primary" onClick={onNext}>
          Receive Future Message →
        </button>
      </div>
    </div>
  );
};

export default Feedback;
