import { BoardProps } from "boardgame.io/react";
import React from "react";
import { GameState } from "../../game";
import { BoardContext } from "./BoardContext";
import { PlayerBoard } from "./PlayerBoard";
import { GameOver } from "./GameOver";
import "./style.scss";
import classNames from "classnames";
import { PlayerControls } from "./PlayerControls";

export const GameBoard: React.FC<BoardProps<GameState>> = ({
  G: State,
  moves,
  isActive,
  ctx,
  playerID,
  undo,
  gameMetadata,
}) => {

  return(
    <BoardContext.Provider
      value={{
        playerID,
        moves,
        State,
        isActive,
        ctx,
        undo,

        playersInfo: gameMetadata,
      }}
    >

    
      <div className={classNames("GameBoard")}>
          {!!ctx.gameover && <GameOver />}
          <PlayerBoard />
          <PlayerControls />
      </div>
    </BoardContext.Provider>
  );
}
