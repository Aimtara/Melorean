import React, { useState } from 'react';
import type { Screen, ProgressLevel } from './types';
import { buildSession, getDailyStats, getTodayDate, saveSession } from './storage';
import Dashboard from './screens/Dashboard';
import Mission from './screens/Mission';
import Estimate from './screens/Estimate';
import FutureSelf from './screens/FutureSelf';
import Jump from './screens/Jump';
import Checkpoint from './screens/Checkpoint';
import Feedback from './screens/Feedback';
import Closure from './screens/Closure';
import Recap from './screens/Recap';

const App: React.FC = () => {
  const [screen, setScreen] = useState<Screen>('dashboard');

  // Session state
  const [mission, setMission] = useState('');
  const [estimatedMinutes, setEstimatedMinutes] = useState(0);
  const [futureMessage, setFutureMessage] = useState('');
  const [actualSeconds, setActualSeconds] = useState(0);

  const goTo = (s: Screen) => setScreen(s);

  const handleMissionNext = (m: string) => {
    setMission(m);
    goTo('estimate');
  };

  const handleEstimateNext = (mins: number) => {
    setEstimatedMinutes(mins);
    goTo('future-self');
  };

  const handleFutureSelfNext = (msg: string) => {
    setFutureMessage(msg);
    goTo('jump');
  };

  const handleCheckpoint = (elapsed: number) => {
    setActualSeconds(elapsed);
    goTo('checkpoint');
  };

  const handleSessionEnd = (progressLevel: ProgressLevel) => {
    const session = buildSession(
      mission,
      estimatedMinutes,
      futureMessage,
      actualSeconds,
      progressLevel,
    );
    saveSession(session);
    goTo('feedback');
  };

  const handleFeedbackNext = () => {
    goTo('closure');
  };

  const handleClosureDone = () => {
    // Reset session state
    setMission('');
    setEstimatedMinutes(0);
    setFutureMessage('');
    setActualSeconds(0);
    goTo('dashboard');
  };

  const todayStats = getDailyStats(getTodayDate());

  return (
    <div className="app">
      {screen === 'dashboard' && (
        <Dashboard
          onStart={() => goTo('mission')}
          onViewRecap={() => goTo('recap')}
        />
      )}
      {screen === 'mission' && (
        <Mission onNext={handleMissionNext} onBack={() => goTo('dashboard')} />
      )}
      {screen === 'estimate' && (
        <Estimate onNext={handleEstimateNext} onBack={() => goTo('mission')} />
      )}
      {screen === 'future-self' && (
        <FutureSelf onNext={handleFutureSelfNext} onBack={() => goTo('estimate')} />
      )}
      {screen === 'jump' && (
        <Jump mission={mission} onCheckpoint={handleCheckpoint} />
      )}
      {screen === 'checkpoint' && (
        <Checkpoint elapsedSeconds={actualSeconds} onEnd={handleSessionEnd} />
      )}
      {screen === 'feedback' && (
        <Feedback
          estimatedMinutes={estimatedMinutes}
          actualSeconds={actualSeconds}
          onNext={handleFeedbackNext}
        />
      )}
      {screen === 'closure' && (
        <Closure futureMessage={futureMessage} onDone={handleClosureDone} />
      )}
      {screen === 'recap' && (
        <Recap stats={todayStats} onBack={() => goTo('dashboard')} />
      )}
    </div>
  );
};

export default App;
