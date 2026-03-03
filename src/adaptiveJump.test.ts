import { describe, it, expect, beforeEach } from 'vitest';
import { evaluateAdaptiveJump } from './adaptiveJump';
import { saveSession, buildSession } from './storage';

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

describe('evaluateAdaptiveJump', () => {
  it('returns 5 when there are no sessions', () => {
    expect(evaluateAdaptiveJump()).toBe(5);
  });

  it('returns 5 when there are fewer than 10 completed sessions', () => {
    for (let i = 0; i < 9; i++) {
      saveSession(buildSession('Mission', 5, 'msg', 400, 'strong-progress'));
    }
    expect(evaluateAdaptiveJump()).toBe(5);
  });

  it('returns 5 when continuation rate is below 70%', () => {
    // 6 sessions with >300s (above 5 min), 4 sessions with <=300s — 60% rate
    for (let i = 0; i < 6; i++) {
      saveSession(buildSession('Mission', 5, 'msg', 400, 'strong-progress'));
    }
    for (let i = 0; i < 4; i++) {
      saveSession(buildSession('Mission', 5, 'msg', 200, 'barely-started'));
    }
    expect(evaluateAdaptiveJump()).toBe(5);
  });

  it('returns 8 when continuation rate is exactly 70%', () => {
    // 7 sessions with >300s, 3 sessions with <=300s — exactly 70%
    for (let i = 0; i < 7; i++) {
      saveSession(buildSession('Mission', 5, 'msg', 400, 'strong-progress'));
    }
    for (let i = 0; i < 3; i++) {
      saveSession(buildSession('Mission', 5, 'msg', 200, 'barely-started'));
    }
    expect(evaluateAdaptiveJump()).toBe(8);
  });

  it('returns 8 when continuation rate is above 70%', () => {
    // All 10 sessions have >300s — 100% rate
    for (let i = 0; i < 10; i++) {
      saveSession(buildSession('Mission', 5, 'msg', 600, 'mission-complete'));
    }
    expect(evaluateAdaptiveJump()).toBe(8);
  });

  it('only looks at the most recent 10 sessions', () => {
    // First 5 old sessions with short time (below threshold)
    for (let i = 0; i < 5; i++) {
      saveSession(buildSession('Old', 5, 'msg', 100, 'barely-started'));
    }
    // Then 10 recent sessions all with >300s — 100% recent rate
    for (let i = 0; i < 10; i++) {
      saveSession(buildSession('Recent', 5, 'msg', 600, 'mission-complete'));
    }
    expect(evaluateAdaptiveJump()).toBe(8);
  });

  it('sessions with exactly 300s (5 minutes) do not count as continued', () => {
    // 10 sessions with exactly 300s — none exceeded the threshold
    for (let i = 0; i < 10; i++) {
      saveSession(buildSession('Mission', 5, 'msg', 300, 'strong-progress'));
    }
    expect(evaluateAdaptiveJump()).toBe(5);
  });
});
