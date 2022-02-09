import { useBoardContext } from '../../context/boardContext';
import './style.scss';

export const ConnectedIndicator = ({ playerID } : { playerID: string }) : JSX.Element | null => {
  const { matchData } = useBoardContext();

  if (matchData) {
    const { isConnected } = matchData[playerID];
    const status = isConnected ? 'Connected' : 'Disconnected';
    return (
      <div title={status} className={`connected-ind connected-ind--${status}`} />
    );
  }

  return null;
};
