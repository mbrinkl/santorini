import React, { useState } from 'react';
import { BoardProps } from 'boardgame.io/react';
import { GameState } from '../../types/GameTypes';
import { BoardContext } from './BoardContext';
import { PlayerBoard } from './PlayerBoard';
import { PlayerControls } from './PlayerControls';
import { CharacterSelect } from '../CharacterSelect';
import { PlayerInfo } from './PlayerInfo';
import { PlayerInfoMobile } from './PlayerInfoMobile';
import { Chat } from '../Chat';
import { isMobile } from '../../utility';
import './style.scss';

export const GameBoard: React.FC<BoardProps<GameState>> = (boardProps) => {
  const [showChat, setShowChat] = useState(!isMobile());
  const { ctx } = boardProps;

  return (
    <BoardContext.Provider value={boardProps}>
      {ctx.phase === 'selectCharacters'
        ? <CharacterSelect />
        : (
          <div className="container">
            <div className="chatContainer">
              {showChat && <Chat onCloseMessages={() => setShowChat(false)} />}
            </div>

            {isMobile() ? (
              <>
                <div className="boardContainer">
                  <PlayerBoard />
                  <PlayerControls
                    messagesOpen={showChat}
                    onOpenMessages={() => setShowChat(true)}
                  />
                </div>
                <PlayerInfoMobile />
              </>
            ) : (
              <>
                <div className="boardContainer">
                  <PlayerBoard />
                  <PlayerControls />
                </div>
                <div className="playerInfoContainer">
                  <PlayerInfo />
                </div>
              </>
            )}
          </div>
        )}
    </BoardContext.Provider>
  );
};
