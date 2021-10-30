import React, { useState } from "react";
import classNames from "classnames";
import { BoardProps } from "boardgame.io/react";
import { GameState } from "../../game";
import { BoardContext } from "./BoardContext";
import { PlayerBoard } from "./PlayerBoard";
import { PlayerControls } from "./PlayerControls";
import { CharacterSelect } from "../CharacterSelect";
import { PlayerInfo } from "./PlayerInfo";
import { PlayerInfoMobile } from "./PlayerInfoMobile";
import { Chat } from "./Chat";
import "./style.scss";
import { isMobile } from "utility";

export const GameBoard: React.FC<BoardProps<GameState>> = ({
  G: State,
  moves,
  isActive,
  ctx,
  playerID,
  undo,
  matchData,
  sendChatMessage,
  chatMessages
}) => {

  const [showChat, setShowChat] = useState(!isMobile());

  return(
    <BoardContext.Provider
      value={{
        playerID,
        moves,
        State,
        isActive,
        ctx,
        undo,
        sendChatMessage,
        chatMessages,
        playersInfo: matchData,
      }}
    >    
      {ctx.phase === 'selectCharacters' ? 
        <CharacterSelect />
        :
        <div className={classNames("GameBoard")}>
          {isMobile() ? (
            <>
              <PlayerInfoMobile/>
              <PlayerBoard />
              <PlayerControls onOpenMessages={() => setShowChat(true)}/>
            </>
            ) : (
            <>
              <PlayerInfo /> 
              <div>
                <PlayerBoard />
                <PlayerControls />
              </div>
            </>
          )}
          {showChat && <Chat onCloseMessages={() => setShowChat(false)} />}
        </div>
      }
    </BoardContext.Provider>
  );
}
