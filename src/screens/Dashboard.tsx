import React from 'react';

interface Props {
  onStart: () => void;
  onViewRecap: () => void;
}

const Dashboard: React.FC<Props> = ({ onStart, onViewRecap }) => (
  <div className="screen dashboard">
    <div className="screen-inner">
      <div className="brand-mark">◈ ME-LOREAN</div>
      <h1 className="screen-title">Temporal Dashboard</h1>
      <p className="screen-subtitle">
        Temporal Agency Protocol — V0.1
      </p>
      <div className="spacer" />
      <div className="dashboard-visual">
        <div className="clock-ring" aria-hidden="true">
          <div className="clock-ring-inner" />
        </div>
      </div>
      <div className="spacer" />
      <button className="btn btn-primary" onClick={onStart}>
        Initiate Timeline Jump
      </button>
      <button className="btn btn-ghost" onClick={onViewRecap}>
        View Daily Recap
      </button>
    </div>
  </div>
);

export default Dashboard;
