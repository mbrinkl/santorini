import { useState } from 'react';
import { useBoardContext } from '../../context/boardContext';
import { ConnectedIndicator } from '../ConnectedIndicator';
import './style.scss';

export const PlayerInfoMobile = () : JSX.Element => {
  const { playerID, G, matchData } = useBoardContext();
  const [showOverlay, setShowOverlay] = useState(false);

  function toggleOverlay() {
    setShowOverlay(!showOverlay);
  }

  if (showOverlay) {
    return (
      <div className="MobileOverlay" onClick={toggleOverlay} role="none">
        <div className="MobileOverlay__p1">
          <span>
            <h3>{(matchData?.[0].name || 'Player 0') + (playerID === '0' ? ' (you) - ' : ' - ') + G.players[0].charState.name}</h3>
            {G.players[0].charState.desc}
          </span>
        </div>
        <div className="MobileOverlay__mid">
          <span>(tap anywhere to close)</span>
        </div>
        <div className="MobileOverlay__p2">
          <span>
            <h3>{(matchData?.[1].name || 'Player 1') + (playerID === '1' ? ' (you) - ' : ' - ') + G.players[1].charState.name}</h3>
            {G.players[1].charState.desc}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="PlayerInfoMobile">
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events */}
      <div className="PlayerInfoMobile__P1QuestionMark" onClick={toggleOverlay} role="button" tabIndex={0}>
        <span>&nbsp;?&nbsp;</span>
      </div>
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events */}
      <div className="PlayerInfoMobile__P1Name" onClick={toggleOverlay} role="button" tabIndex={0}>
        <div className="PlayerInfoMobile__Name">
          <ConnectedIndicator playerID="0" />
          <h2>{(matchData?.[0].name || 'Player 0') + (playerID === '0' ? ' (you)' : '')}</h2>
        </div>
        <span>{G.players[0].charState.name}</span>
      </div>
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events */}
      <div className="PlayerInfoMobile__P2QuestionMark" onClick={toggleOverlay} role="button" tabIndex={0}>
        <span>&nbsp;?&nbsp;</span>
      </div>
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events */}
      <div className="PlayerInfoMobile__P2Name" onClick={toggleOverlay} role="button" tabIndex={0}>
        <div className="PlayerInfoMobile__Name">
          <ConnectedIndicator playerID="1" />
          <h2>{(matchData?.[1].name || 'Player 1') + (playerID === '1' ? ' (you)' : '')}</h2>
        </div>
        <span>{G.players[1].charState.name}</span>
      </div>
    </div>
  );
};
