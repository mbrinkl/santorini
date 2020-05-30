import React from "react";
import { useBoardContext } from "./BoardContext";
import { Button } from "components/Button";

export const PlayerControls = () => {
  const { State, isActive, moves, ctx, undo } = useBoardContext();

  function undoAll(numMoves)
  {
    while (numMoves > 0)
    {
      numMoves--;
      undo();
    }
  }

  function exit()
  {
    window.open("/", "_self");
  }

  return (
    !!ctx.gameover ? 

      <div className="PlayerControls">

      <Button
        theme="blue"
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
        disabled={!ctx.numMoves || !isActive}
        onClick={() => undoAll(ctx.numMoves)}
      >
        Undo
      </Button>

      <Button
        theme="green"
        onClick={() => moves.EndTurn()}
        className="PlayerControls__button"
        size="small"
        disabled={!(State.canEndTurn && isActive) || !isActive}
      >
        End Turn
      </Button>
    </div>

  );
};
