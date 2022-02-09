import { useState, useEffect, useRef } from 'react';
import { playAgain } from '../../api';
import { useBoardContext } from '../../context/boardContext';
import { Button, ImageButton } from '../Button';
import undoLogo from '../../assets/png/undo.png';

export const PlayerControls = () : JSX.Element | null => {
  const {
    playerID, G, isActive, moves, ctx, undo, sendChatMessage, credentials,
    matchID,
  } = useBoardContext();

  const [counter, setCounter] = useState(3);
  const intervalID: any = useRef(null);

  useEffect(() => {
    intervalID.current = setInterval(() => {
      if ((ctx.activePlayers && ctx.activePlayers[ctx.currentPlayer] === 'end') && isActive) {
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
      window.open(`/rooms/${nextMatchID}`, '_self');
    }
  }

  function exit() {
    window.open('/', '_self');
  }

  // No controls for spectators
  if (!playerID) {
    return null;
  }

  return (
    <div className="PlayerControls">

      {ctx.gameover ? (
        <>
          <Button
            theme="red"
            onClick={() => exit()}
            className="PlayerControls__button"
            size="small"
          >
            Exit
          </Button>

          <Button
            theme="green"
            className="PlayerControls__button"
            size="small"
            onClick={() => rematch()}
          >
            Rematch
          </Button>
        </>
      )
        : (
          <>
            <ImageButton
              src={undoLogo}
              alt="undoLogo"
              theme="red"
              size="small"
              className="PlayerControls__button"
              disabled={!ctx.numMoves || !isActive}
              onClick={() => undoMove()}
            />

            <Button
              theme="blue"
              size="small"
              className="PlayerControls__button"
              disabled={!G.players[playerID].charState.buttonActive}
              onClick={() => moves.onButtonPressed()}
            >
              {G.players[playerID].charState.buttonText}
            </Button>

            <Button
              theme="green"
              onClick={() => endTurn()}
              className="PlayerControls__button"
              size="small"
              disabled={(ctx.activePlayers && ctx.activePlayers[ctx.currentPlayer] !== 'end') || !isActive}
            >
              (
              {counter}
              ) End Turn
            </Button>
          </>
        )}
    </div>
  );
};
