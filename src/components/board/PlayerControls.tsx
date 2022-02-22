import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { playAgain } from '../../api';
import { useBoardContext } from '../../context/boardContext';
import { Button, ButtonLink, ImageButton } from '../common/Button';
import undoLogo from '../../assets/png/undo.png';
import './PlayerControls.scss';

export const PlayerControls = (): JSX.Element | null => {
  const {
    playerID,
    G,
    isActive,
    moves,
    ctx,
    undo,
    sendChatMessage,
    credentials,
    matchID,
  } = useBoardContext();

  const navigate = useNavigate();
  const [counter, setCounter] = useState(3);
  const intervalID: any = useRef(null);

  useEffect(() => {
    intervalID.current = setInterval(() => {
      if (
        ctx.activePlayers &&
        ctx.activePlayers[ctx.currentPlayer] === 'end' &&
        isActive
      ) {
        if (counter > 0) {
          setCounter(counter - 1);
        } else {
          clearInterval(intervalID.current);
          setCounter(3);
          moves.endTurn();
        }
      }
    }, 1000);

    return () => clearInterval(intervalID.current);
  }, [counter, intervalID, moves, isActive, ctx]);

  function undoMove() {
    clearInterval(intervalID.current);
    setCounter(3);
    undo();
  }

  function endTurn() {
    clearInterval(intervalID.current);
    setCounter(3);
    moves.endTurn();
  }

  async function rematch() {
    if (playerID && credentials) {
      sendChatMessage('wants to rematch...');
      const nextMatchID = await playAgain(matchID, playerID, credentials);
      navigate(`/${nextMatchID}`);
    }
  }

  // No controls for spectators
  if (!playerID) {
    return (
      <div className="player-controls">
        <ButtonLink
          theme="red"
          to="/"
          className="player-controls__button"
          size="small"
        >
          Leave
        </ButtonLink>
      </div>
    );
  }

  return (
    <div className="player-controls">
      {ctx.gameover || G.isDummy ? (
        <>
          <ButtonLink
            theme="red"
            to="/"
            className="player-controls__button"
            size="small"
          >
            Leave
          </ButtonLink>

          <Button
            theme="green"
            className="player-controls__button"
            size="small"
            onClick={() => rematch()}
          >
            Rematch
          </Button>
        </>
      ) : (
        <>
          <ImageButton
            src={undoLogo}
            alt="undoLogo"
            theme="red"
            size="small"
            className="player-controls__button"
            disabled={!ctx.numMoves || !isActive}
            onClick={() => undoMove()}
          />

          <Button
            theme="blue"
            size="small"
            className="player-controls__button"
            disabled={!G.players[playerID].charState.buttonActive}
            onClick={() => moves.onButtonPressed()}
          >
            {G.players[playerID].charState.buttonText}
          </Button>

          <Button
            theme="green"
            onClick={() => endTurn()}
            className="player-controls__button"
            size="small"
            disabled={
              (ctx.activePlayers &&
                ctx.activePlayers[ctx.currentPlayer] !== 'end') ||
              !isActive
            }
          >
            ({counter}) End Turn
          </Button>
        </>
      )}
    </div>
  );
};
