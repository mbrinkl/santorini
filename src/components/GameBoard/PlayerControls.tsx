import React, { useState, useEffect, useRef } from "react";
import { useBoardContext } from "./BoardContext";
import { Button } from "components/Button";

export const PlayerControls = () => {
  const { playerID, State, isActive, moves, ctx, undo } = useBoardContext();

  const [counter, setCounter] = useState(3);
  let intervalID: any = useRef(null); 

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

  function undoAll(numMoves) {
    clearInterval(intervalID.current);
    setCounter(3);
    while (numMoves > 0)
    {
      numMoves--;
      undo();
    }
  }

  function endTurn() {
    clearInterval(intervalID.current);
    setCounter(3);
    moves.EndTurn();
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
      >
        Rematch
      </Button>
    </div>
    
    :

    <div className="PlayerControls">

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
        theme="red"
        size="small"
        className="PlayerControls__button"
        disabled={!ctx.numMoves || !isActive}
        onClick={() => undoAll(ctx.numMoves)}
      >
        Undo
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
