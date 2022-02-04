import { useState, useEffect, useRef } from 'react';
import { playAgain } from '../../api';
import { useBoardContext } from './BoardContext';
import { Button } from '../Button';
import undoLogo from '../../assets/png/undo.png';
import messagesLogo from '../../assets/png/messages.png';
import { isMobile } from '../../utility';

export const PlayerControls = ({ messagesOpen, onOpenMessages } : {
  messagesOpen? : boolean,
  onOpenMessages? : () => void
}) : JSX.Element | null => {
  const {
    playerID, G, isActive, moves, ctx, undo, chatMessages, sendChatMessage, credentials,
    matchID,
  } = useBoardContext();

  const [msgBlack, setMsgBlack] = useState(false);
  const [counter, setCounter] = useState(3);
  const intervalID: any = useRef(null);
  const intervalMsgID: any = useRef(null);

  useEffect(() => {
    clearInterval(intervalMsgID.current);
    setMsgBlack(false);
  }, [messagesOpen]);

  useEffect(() => {
    if (chatMessages.length > 0) {
      intervalMsgID.current = setInterval(() => {
        setMsgBlack((prev) => !prev);
      }, 1000);
    }
    return () => clearInterval(intervalMsgID.current);
  }, [chatMessages]);

  useEffect(() => {
    intervalID.current = setInterval(() => {
      if ((ctx.activePlayers && ctx.activePlayers[ctx.currentPlayer] === 'end') && isActive) {
        if (counter > 0) setCounter(counter - 1);
        else {
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

  function showMessages() {
    clearInterval(intervalMsgID.current);
    setMsgBlack(false);
    if (onOpenMessages) {
      onOpenMessages();
    }
  }

  // No controls for spectators
  if (!playerID) {
    return null;
  }

  return (
    <div className="PlayerControls">

      {isMobile()
        && (
        <Button
          theme="yellow"
          size="small"
          className="PlayerControls__button"
          onClick={() => showMessages()}
        >
          <img className={`imgMsg ${msgBlack ? 'blackmsg' : ''}`} src={messagesLogo} alt="msgLogo" />
        </Button>
        )}

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
            <Button
              theme="red"
              size="small"
              className="PlayerControls__button"
              disabled={!ctx.numMoves || !isActive}
              onClick={() => undoMove()}
            >
              <img src={undoLogo} style={{ position: 'absolute', width: 25, height: 25 }} alt="undoLogo" />
            </Button>

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
