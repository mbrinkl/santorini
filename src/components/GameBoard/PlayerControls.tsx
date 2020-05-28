import React from "react";
import { useBoardContext } from "./BoardContext";
import { Button } from "components/Button";

export const PlayerControls = () => {
  const { State, isActive, moves, ctx, undo } = useBoardContext();

  return (
    <div className="PlayerControls">
      <Button
        theme="blue"
        size="small"
        className="PlayerControls__button"
        disabled={!ctx.numMoves || !isActive}
        onClick={() => undo()}
      >
        Undo
      </Button>

      <Button
        theme="green"
        onClick={() => moves.EndTurn()}
        className="PlayerControls__button"
        size="small"
        disabled={ !(State.canEndTurn && isActive) || !isActive}
      >
        End Turn
      </Button>
    </div>
  );
};
