import React, { useState } from 'react';

interface Props {
  onNext: (minutes: number) => void;
  onBack: () => void;
}

const Estimate: React.FC<Props> = ({ onNext, onBack }) => {
  const [value, setValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const n = parseFloat(value);
    if (n > 0) onNext(n);
  };

  return (
    <div className="screen">
      <div className="screen-inner">
        <div className="step-label">Step 2 of 3</div>
        <h1 className="screen-title">Predict the Duration</h1>
        <p className="screen-subtitle">
          How long do you think this will take?
        </p>
        <form onSubmit={handleSubmit} className="form">
          <div className="input-row">
            <input
              className="input-number"
              type="number"
              min="1"
              max="999"
              step="1"
              placeholder="10"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              autoFocus
              aria-label="Estimated duration in minutes"
            />
            <span className="input-unit">minutes</span>
          </div>
          <button
            className="btn btn-primary"
            type="submit"
            disabled={!value || parseFloat(value) <= 0}
          >
            Log Estimate →
          </button>
        </form>
        <button className="btn btn-ghost" onClick={onBack}>
          ← Back
        </button>
      </div>
    </div>
  );
};

export default Estimate;
