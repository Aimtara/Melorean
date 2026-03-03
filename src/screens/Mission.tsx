import React, { useState } from 'react';

interface Props {
  onNext: (mission: string) => void;
  onBack: () => void;
}

const Mission: React.FC<Props> = ({ onNext, onBack }) => {
  const [mission, setMission] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mission.trim()) onNext(mission.trim());
  };

  return (
    <div className="screen">
      <div className="screen-inner">
        <div className="step-label">Step 1 of 3</div>
        <h1 className="screen-title">Choose Your Mission</h1>
        <p className="screen-subtitle">
          What timeline are we stabilizing right now?
        </p>
        <form onSubmit={handleSubmit} className="form">
          <textarea
            className="input-text"
            placeholder="e.g. Work on proposal draft"
            value={mission}
            onChange={(e) => setMission(e.target.value)}
            rows={3}
            autoFocus
            aria-label="Mission description"
          />
          <button
            className="btn btn-primary"
            type="submit"
            disabled={!mission.trim()}
          >
            Lock In Mission →
          </button>
        </form>
        <button className="btn btn-ghost" onClick={onBack}>
          ← Back
        </button>
      </div>
    </div>
  );
};

export default Mission;
