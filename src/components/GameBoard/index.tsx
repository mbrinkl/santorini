import React, { useState } from "react";
import classNames from "classnames";
import { BoardProps } from "boardgame.io/react";
import { GameState } from "../../types/GameTypes";
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
        playerID: playerID || '-1',
        moves,
        State,
        isActive,
        ctx,
        undo,
        sendChatMessage,
        chatMessages,
        matchData,
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
              <PlayerControls messagesOpen={showChat} onOpenMessages={() => setShowChat(true)}/>
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
