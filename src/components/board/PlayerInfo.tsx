import { useBoardContext } from '../../hooks/useBoardContext';
import { ConnectedIndicator } from './ConnectedIndicator';
import './PlayerInfo.scss';

export const PlayerInfo = (): JSX.Element => {
  const { playerID, G, matchData } = useBoardContext();

  return (
    <div className="player-info">
      <div className="player-info__p0-info">
        <div className="player-info__identifiers">
          <ConnectedIndicator playerID="0" />
          <h2 className="player-info__name">
            {(matchData?.[0].name || 'Player 0') +
              (playerID === '0' ? ' (you)' : '')}
          </h2>
        </div>
        <h4 className="player-info__character-name">
          {G.players[0].charState.name}
        </h4>
        <div className="player-info__description">
          {G.players[0].charState.desc.map((line) => (
            <p key={`char0${line.length}`}>{line}</p>
          ))}
        </div>
      </div>

      <div className="player-info__p1-info">
        <div className="player-info__description">
          {G.players[1].charState.desc.map((line) => (
            <p key={`char1${line.length}`}>{line}</p>
          ))}
        </div>
        <h4 className="player-info__character-name">
          {G.players[1].charState.name}
        </h4>
        <div className="player-info__identifiers">
          <ConnectedIndicator playerID="1" />
          <h2>
            {(matchData?.[1].name || 'Player 1') +
              (playerID === '1' ? ' (you)' : '')}
          </h2>
        </div>
      </div>
    </div>
  );
};
