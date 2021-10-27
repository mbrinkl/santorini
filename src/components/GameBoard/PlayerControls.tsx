import { useState, useEffect, useRef} from "react";
import { useParams } from "react-router";
import { useBoardContext } from "./BoardContext";
import { Button } from "components/Button";
import { useStoreActions, useStoreState } from "../../store";

export const PlayerControls = () => {
  const { playerID, State, isActive, moves, ctx, undo } = useBoardContext();

  const [counter, setCounter] = useState(3);
  
  let intervalID: any = useRef(null); 

  const { id } = useParams<{ id: string }>();
  const playAgain = useStoreActions((s) => s.playAgain);
  const activeRoomPlayer = useStoreState((s) => s.activeRoomPlayer);
  const [redirect, setRedirect] = useState(false);
  const matchID = useStoreState((s) => s.matchID);

  useEffect(() => {
    if (redirect && matchID && matchID !== id) {
      window.open(`/rooms/${matchID}`, '_self');
    }
  }, [matchID, redirect, id]);

  useEffect(() => {
    intervalID.current = setInterval(() => {
      if (State.canEndTurn && isActive) {

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
  }, [counter, intervalID, State, moves, isActive]);

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

  return (
    !!ctx.gameover ? 
    
      <div className="PlayerControls">

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
    </div>
    
    :

    <div className="PlayerControls">

      <Button
        theme="red"
        size="small"
        className="PlayerControls__button"
        disabled={!ctx.numMoves || !isActive}
        onClick={() => undoMove()}
      >
        Undo
      </Button>

      <Button
        theme="blue"
        size="small"
        className="PlayerControls__button"
        disabled={!State.players[playerID].char.buttonActive}
        onClick={() => moves.CharButtonPressed()}
      >
        {State.players[playerID].char.buttonText}
      </Button>

      <Button
        theme="green"
        onClick={() => endTurn()}
        className="PlayerControls__button"
        size="small"
        disabled={!(State.canEndTurn && isActive) || !isActive}
      >
        ({counter}) End Turn
      </Button>
    </div>

  );
};
