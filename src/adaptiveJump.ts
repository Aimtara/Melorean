import { loadSessions } from './storage';

const EVALUATION_WINDOW = 10; // Look at the last 10 sessions
const ADAPTATION_THRESHOLD = 0.7; // 70% continuation rate required
const BASELINE_JUMP_MINUTES = 5;
const UPGRADED_JUMP_MINUTES = 8;

export function evaluateAdaptiveJump(): number {
  const allSessions = loadSessions();

  // Only evaluate sessions that have reached the checkpoint/feedback stage
  // (progressLevel is set when the user ends a session and picks a progress level)
  const completedSessions = allSessions.filter((s) => s.progressLevel !== undefined);

  // If we don't have enough data, stick to the 5-minute baseline
  if (completedSessions.length < EVALUATION_WINDOW) {
    return BASELINE_JUMP_MINUTES;
  }

  // Get the most recent sessions
  const recentSessions = completedSessions.slice(-EVALUATION_WINDOW);

  // Count how many times the user worked longer than the default 5 minutes
  const continuedSessionsCount = recentSessions.filter(
    (session) => session.actualSeconds > BASELINE_JUMP_MINUTES * 60,
  ).length;

  const continuationRate = continuedSessionsCount / EVALUATION_WINDOW;

  // If user continues past 5 minutes 70%+ of the time, suggest an 8-minute default
  if (continuationRate >= ADAPTATION_THRESHOLD) {
    return UPGRADED_JUMP_MINUTES;
  }

  return BASELINE_JUMP_MINUTES;
}
