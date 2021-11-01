import { useState, useEffect, useRef} from "react";
import { useParams } from "react-router";
import { useBoardContext } from "./BoardContext";
import { Button } from "components/Button";
import { useStoreActions, useStoreState } from "../../store";
import undoLogo from'../../assets/png/undo.png';
import messagesLogo from'../../assets/png/messages.png';
import { isMobile } from "utility";
import classNames from "classnames";

export const PlayerControls: React.FC<{ messagesOpen? : boolean, onOpenMessages? : () => void}> = ({messagesOpen, onOpenMessages}) => {
  const { playerID, State, isActive, moves, ctx, undo, chatMessages } = useBoardContext();

  const { id } = useParams<{ id: string }>();
  const activeRoomPlayer = useStoreState((s) => s.activeRoomPlayer);
  const matchID = useStoreState((s) => s.matchID);
  const playAgain = useStoreActions((s) => s.playAgain);
  const [redirect, setRedirect] = useState(false);
  const [msgBlack, setMsgBlack] = useState(false);
  const [counter, setCounter] = useState(3);
  let intervalID: any = useRef(null); 
  let intervalMsgID: any = useRef(null); 

  useEffect(() => {
    clearInterval(intervalMsgID.current);
    setMsgBlack(false);
  }, [messagesOpen]);

  useEffect(() => {
    if (chatMessages.length > 0) {
      intervalMsgID.current = setInterval(() => { 
        setMsgBlack(prev => !prev);
      }, 1000);
    }
    return () => clearInterval(intervalMsgID.current);
  }, [chatMessages]);

  useEffect(() => {
    if (redirect && matchID && matchID !== id) {
      window.open(`/rooms/${matchID}`, '_self');
    }
  }, [matchID, redirect, id]);

  useEffect(() => {
    intervalID.current = setInterval(() => {
      if ((ctx.activePlayers && ctx.activePlayers[ctx.currentPlayer] === 'end') && isActive) {

        if (counter > 0)
          setCounter(counter - 1)
        else
        {
          clearInterval(intervalID.current);
          setCounter(3);
          moves.EndTurn();
        }
      }
    }, 1000);

    return () => clearInterval(intervalID.current);
  }, [counter, intervalID, State, moves, isActive, ctx]);

  function undoMove() {
    clearInterval(intervalID.current);
    setCounter(3);
    undo();
  }

  function endTurn() {
    clearInterval(intervalID.current);
    setCounter(3);
    moves.EndTurn();
  }

  const rematch = () => {
    playAgain({ matchID: id, playerID: activeRoomPlayer!.playerID, credential: activeRoomPlayer!.credential});
    setRedirect(true);
  }

  function exit() {
    window.open("/", "_self");
  }

  function showMessages() {
    clearInterval(intervalMsgID.current);
    setMsgBlack(false);
    if (onOpenMessages) {
      onOpenMessages();
    }
  }

  return (    
    <div className="PlayerControls">

      {isMobile() && 
        <Button
          theme="yellow"
          size="small"
          className="PlayerControls__button"
          onClick={showMessages}
        >
          <img className={classNames('imgMsg', msgBlack ? 'blackmsg' : '')} src={messagesLogo} alt="msgLogo"/>
        </Button>
      }

      {!!ctx.gameover ? (<>
        <Button
          theme="red"
          onClick={exit}
          className="PlayerControls__button"
          size="small"
        >
          Exit
        </Button>

        <Button
          theme="green"
          className="PlayerControls__button"
          size="small"
          onClick={rematch}
        >
          Rematch
      </Button>
      </>
    )
    :
    ( <>
      <Button
        theme="red"
        size="small"
        className="PlayerControls__button"
        disabled={!ctx.numMoves || !isActive}
        onClick={() => undoMove()}
      >
        <img src={undoLogo} style={{position:"absolute", width: 25, height: 25}} alt="undoLogo"/>
      </Button>

      <Button
        theme="blue"
        size="small"
        className="PlayerControls__button"
        disabled={!State.players[playerID].char.buttonActive}
        onClick={() => moves.CharacterAbility()}
      >
        {State.players[playerID].char.buttonText}
      </Button>

      <Button
        theme="green"
        onClick={() => endTurn()}
        className="PlayerControls__button"
        size="small"
        disabled={(ctx.activePlayers && ctx.activePlayers[ctx.currentPlayer] !== 'end')  || !isActive}
      >
        ({counter}) End Turn
      </Button>
      </>
    )}
  </div>
  );
};
