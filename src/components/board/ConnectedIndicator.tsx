import classNames from 'classnames';
import { useBoardContext } from '../../context/boardContext';
import './ConnectedIndicator.scss';

export const ConnectedIndicator = ({
  playerID,
}: {
  playerID: string;
}): JSX.Element | null => {
  const { matchData } = useBoardContext();

  if (matchData) {
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
