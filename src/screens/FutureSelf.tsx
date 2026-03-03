import React, { useState } from 'react';

interface Props {
  onNext: (message: string) => void;
  onBack: () => void;
}

const FutureSelf: React.FC<Props> = ({ onNext, onBack }) => {
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    setSending(true);
    setTimeout(() => {
      onNext(message.trim());
    }, 1600);
  };

  return (
    <div className="screen">
      <div className="screen-inner">
        <div className="step-label">Step 3 of 3</div>
        <h1 className="screen-title">Open a Channel to Later Today</h1>
        <p className="screen-subtitle">
          What does Future You say?
        </p>
        <p className="screen-hint">
          Write a short, grateful message from 6 hours ahead.
        </p>
        <form onSubmit={handleSubmit} className="form">
          <textarea
            className="input-text"
            placeholder="Hey. I'm relieved. Thank you for starting."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            autoFocus
            disabled={sending}
            aria-label="Message from future self"
          />
          <button
            className="btn btn-primary"
            type="submit"
            disabled={!message.trim() || sending}
          >
            {sending ? 'Transmitting signal…' : 'Transmit Signal →'}
          </button>
        </form>
        {sending && (
          <p className="signal-text" aria-live="polite">
            Signal transmitted across time.
          </p>
        )}
        {!sending && (
          <button className="btn btn-ghost" onClick={onBack}>
            ← Back
          </button>
        )}
      </div>
    </div>
  );
};

export default FutureSelf;
