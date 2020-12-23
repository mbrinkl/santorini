import React from "react";
import classNames from "classnames";
import { BoardProps } from "boardgame.io/react";
import { GameState } from "../../game";
import { BoardContext } from "./BoardContext";
import { PlayerBoard } from "./PlayerBoard";
import { PlayerControls } from "./PlayerControls";
import { CharacterSelect } from "../CharacterSelect";
import { PlayerInfo } from "./PlayerInfo";
import { PlayerInfoMobile } from "./PlayerInfoMobile";
import { getMobileOS } from "../Lobby";
import "./style.scss";

export const GameBoard: React.FC<BoardProps<GameState>> = ({
  G: State,
  moves,
  isActive,
  ctx,
  playerID,
  undo,
  matchData,
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
        playersInfo: matchData,
      }}
    >    
    {ctx.phase === 'selectCharacters' ? 
      <CharacterSelect />
      :
      <div className={classNames("GameBoard")}>
        {getMobileOS() === 'unknown' ? <PlayerInfo /> : <PlayerInfoMobile/>}
        <PlayerBoard />
        <PlayerControls />
      </div>
    }

    </BoardContext.Provider>
  );
}
