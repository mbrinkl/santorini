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
import { Chat } from "./Chat";
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

  const isMobile = getMobileOS() !== 'unknown';

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
          {!isMobile && <Chat />}
          <div>
            <PlayerBoard />
            <PlayerControls />
          </div>
          {isMobile ? (
            <PlayerInfoMobile/>
            ) : (
            <PlayerInfo /> 
          )}
        </div>
      }
    </BoardContext.Provider>
  );
}
