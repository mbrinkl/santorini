import classNames from 'classnames';
import { GameType, useBoardContext } from '../../hooks/useBoardContext';
import './ConnectedIndicator.scss';

export const ConnectedIndicator = ({
  playerID,
}: {
  playerID: string;
}): JSX.Element | null => {
  const { matchData, gameType } = useBoardContext();

  if (gameType === GameType.Online && matchData) {
    const { isConnected } = matchData[Number(playerID)];
    const status = isConnected ? 'Connected' : 'Disconnected';
    return (
      <div
        title={status}
        className={classNames('connected-ind', `connected-ind--${status}`)}
      />
    );
  }

  return null;
};
