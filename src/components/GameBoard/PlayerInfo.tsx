import { useBoardContext } from '../../context/boardContext';
import { ConnectedIndicator } from '../ConnectedIndicator';
import './style.scss';

export const PlayerInfo = () : JSX.Element => {
  const { playerID, G, matchData } = useBoardContext();

  return (
    <div className="PlayerInfo">
      <div className="PlayerInfo__P1Info">
        <div className="PlayerInfo__Name">
          <ConnectedIndicator playerID="0" />
          <h2>{(matchData?.[0].name || 'Player 0') + (playerID === '0' ? ' (you)' : '')}</h2>
        </div>
        <h4>{G.players[0].charState.name}</h4>
        <p>{G.players[0].charState.desc}</p>
      </div>
      <div className="PlayerInfo__P2Info">
        <p>{G.players[1].charState.desc}</p>
        <h4>{G.players[1].charState.name}</h4>
        <div className="PlayerInfo__Name">
          <ConnectedIndicator playerID="1" />
          <h2>{(matchData?.[1].name || 'Player 1') + (playerID === '1' ? ' (you)' : '')}</h2>
        </div>
      </div>
    </div>
  );
};
