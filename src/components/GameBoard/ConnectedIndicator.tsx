import { useBoardContext } from './BoardContext';

export const ConnectedIndicator = ({ playerID } : { playerID: number }) : JSX.Element => {
  const { matchData } = useBoardContext();
  const connected = matchData?.[playerID].isConnected;

  const status = connected ? 'Connected' : 'Disconnected';

  return <div title={status} className={`connStatus ${status}`} />;
};
