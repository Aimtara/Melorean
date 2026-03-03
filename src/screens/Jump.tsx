import React, { useEffect, useRef, useState } from 'react';
import { formatTime } from '../storage';

interface Props {
  mission: string;
  jumpMinutes: number;
  onCheckpoint: (elapsedSeconds: number) => void;
}

const Jump: React.FC<Props> = ({ mission, jumpMinutes, onCheckpoint }) => {
  const JUMP_SECONDS = jumpMinutes * 60;
  const [secondsLeft, setSecondsLeft] = useState(JUMP_SECONDS);
  const [phase, setPhase] = useState<'countdown' | 'counting-up'>('countdown');
  const [countUpSeconds, setCountUpSeconds] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Countdown phase
  useEffect(() => {
    if (phase !== 'countdown') return;
    intervalRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          setPhase('counting-up');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current!);
  }, [phase]);

  // Count-up phase
  useEffect(() => {
    if (phase !== 'counting-up') return;
    intervalRef.current = setInterval(() => {
      setCountUpSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(intervalRef.current!);
  }, [phase]);

  const totalElapsed =
    phase === 'countdown'
      ? JUMP_SECONDS - secondsLeft
      : JUMP_SECONDS + countUpSeconds;

  const handleEnd = () => {
    clearInterval(intervalRef.current!);
    onCheckpoint(totalElapsed);
  };

  return (
    <div className="screen jump-screen">
      <div className="screen-inner">
        <h1 className="screen-title">Initiating {jumpMinutes}-Minute Jump.</h1>
        <p className="mission-badge">{mission}</p>

        <div className="timer-display" aria-live="polite" aria-atomic="true">
          {phase === 'countdown' ? (
            <>
              <span className="timer-value">{formatTime(secondsLeft)}</span>
              <span className="timer-label">remaining</span>
            </>
          ) : (
            <>
              <span className="timer-value timer-countup">
                {formatTime(JUMP_SECONDS + countUpSeconds)}
              </span>
              <span className="timer-label">elapsed · continuing</span>
            </>
          )}
        </div>

        {phase === 'countdown' && (
          <div className="progress-bar-wrap" role="progressbar"
            aria-valuenow={JUMP_SECONDS - secondsLeft}
            aria-valuemin={0}
            aria-valuemax={JUMP_SECONDS}>
            <div
              className="progress-bar"
              style={{ width: `${((JUMP_SECONDS - secondsLeft) / JUMP_SECONDS) * 100}%` }}
            />
          </div>
        )}

        {phase === 'counting-up' && (
          <p className="checkpoint-prompt">
            Temporal Checkpoint Reached. Continue trajectory?
          </p>
        )}

        <button className="btn btn-danger" onClick={handleEnd}>
          End Session
        </button>
      </div>
    </div>
  );
};

export default Jump;
