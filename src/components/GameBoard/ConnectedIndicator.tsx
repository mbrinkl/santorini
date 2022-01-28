import React from 'react';
import { useBoardContext } from './BoardContext';

export const ConnectedIndicator: React.FC<{ playerID: number }> = ({ playerID }) => {
  const { matchData } = useBoardContext();
  const connected = matchData?.[playerID].isConnected;

  const status = connected ? 'Connected' : 'Disconnected';

  return <div title={status} className={`connStatus ${status}`} />;
};
