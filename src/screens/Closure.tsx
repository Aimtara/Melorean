import React, { useState } from 'react';

interface Props {
  futureMessage: string;
  onDone: () => void;
}

const Closure: React.FC<Props> = ({ futureMessage, onDone }) => {
  const [revealed, setRevealed] = useState(false);

  return (
    <div className="screen">
      <div className="screen-inner">
        <h1 className="screen-title">Message From Later Today</h1>
        {!revealed ? (
          <>
            <p className="screen-subtitle">
              A signal is waiting from 6 hours ahead.
            </p>
            <div className="message-envelope" aria-hidden="true">◈</div>
            <button className="btn btn-primary" onClick={() => setRevealed(true)}>
              Receive Future Message
            </button>
          </>
        ) : (
          <>
            <div className="future-message-card" aria-live="polite">
              <p className="future-message-text">"{futureMessage}"</p>
            </div>
            <p className="closure-overlay">
              You initiated a timeline jump. That's the skill we're building.
            </p>
            <button className="btn btn-primary" onClick={onDone}>
              Return to Dashboard →
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Closure;
