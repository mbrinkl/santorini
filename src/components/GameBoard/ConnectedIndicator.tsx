import React from 'react';
import { useBoardContext } from './BoardContext';

export const ConnectedIndicator: React.FC<{ playerID: number }> = ({ playerID }) => {
  const { matchData } = useBoardContext();
  const connected = matchData?.[playerID].isConnected;

  return <h2 className="connStatus">{connected ? '' : 'Disconnected'}</h2>;
};
