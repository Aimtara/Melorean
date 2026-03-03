import { describe, it, expect, beforeEach } from 'vitest';
import {
  calcTimeDilation,
  formatTime,
  buildSession,
  getTodayDate,
  loadSessions,
  saveSession,
} from './storage';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => { store[key] = value; },
    clear: () => { store = {}; },
  };
})();

Object.defineProperty(globalThis, 'localStorage', { value: localStorageMock });

beforeEach(() => {
  localStorageMock.clear();
});

describe('formatTime', () => {
  it('formats zero as 00:00', () => {
    expect(formatTime(0)).toBe('00:00');
  });

  it('formats 5 minutes as 05:00', () => {
    expect(formatTime(300)).toBe('05:00');
  });

  it('formats 1 hour 5 seconds as 60:05', () => {
    expect(formatTime(3605)).toBe('60:05');
  });
});

describe('calcTimeDilation', () => {
  it('returns 0 when estimate is 0', () => {
    expect(calcTimeDilation(0, 300)).toBe(0);
  });

  it('calculates correct dilation factor', () => {
    // 15 minutes actual vs 10 minutes estimated = 1.5x
    expect(calcTimeDilation(10, 900)).toBe(1.5);
  });

  it('calculates < 1 when finished faster than estimated', () => {
    // 5 minutes actual vs 10 minutes estimated = 0.5x
    expect(calcTimeDilation(10, 300)).toBe(0.5);
  });
});

describe('buildSession', () => {
  it('creates a session with correct fields', () => {
    const session = buildSession('Test mission', 10, 'Thanks for starting', 600, 'mission-complete');
    expect(session.mission).toBe('Test mission');
    expect(session.estimatedMinutes).toBe(10);
    expect(session.futureMessage).toBe('Thanks for starting');
    expect(session.actualSeconds).toBe(600);
    expect(session.progressLevel).toBe('mission-complete');
    expect(session.date).toBe(getTodayDate());
    expect(session.id).toBeTruthy();
  });
});

describe('session storage', () => {
  it('loads empty array when no sessions exist', () => {
    expect(loadSessions()).toEqual([]);
  });

  it('saves and loads a session', () => {
    const session = buildSession('Mission A', 5, 'Good job', 300, 'strong-progress');
    saveSession(session);
    const loaded = loadSessions();
    expect(loaded).toHaveLength(1);
    expect(loaded[0].mission).toBe('Mission A');
  });

  it('accumulates multiple sessions', () => {
    saveSession(buildSession('Session 1', 5, 'msg1', 300, 'barely-started'));
    saveSession(buildSession('Session 2', 10, 'msg2', 600, 'mission-complete'));
    expect(loadSessions()).toHaveLength(2);
  });
});

describe('getTodayDate', () => {
  it('returns a string in YYYY-MM-DD format', () => {
    const today = getTodayDate();
    expect(today).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});
