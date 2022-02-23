import classNames from 'classnames';
import { BoardProps } from 'boardgame.io/react';
import { useMemo, useState } from 'react';
import { InspectorControls } from './Inspector';
import { GameState } from '../../types/gameTypes';
import { BoardContext } from '../../context/boardContext';
import { PlayerBoard } from './PlayerBoard';
import { PlayerControls } from './PlayerControls';
import { CharacterSelect } from './CharacterSelect';
import { PlayerInfo } from './PlayerInfo';
import { PlayerInfoMobile } from './PlayerInfoMobile';
import { Chat } from './Chat';
import { MoveLog } from './MoveLog';
import { isMobile } from '../../util';
import './GameBoard.scss';

export const GameBoard = (boardProps: BoardProps<GameState>): JSX.Element => {
  const [overrideState, setOverrideState] =
    useState<BoardProps<GameState> | null>(null);
  const { ctx, playerID, log, matchID } = boardProps;

  const modifiedOverrideState: BoardProps<GameState> = useMemo(() => {
    if (overrideState) {
      const {
        chatMessages,
        sendChatMessage,
        credentials,
        matchData,
        isConnected,
      } = boardProps;
      return {
        ...overrideState,
        playerID,
        matchID,
        matchData,
        chatMessages,
        sendChatMessage,
        credentials,
        isConnected,
        isActive: false,
      };
    }
    return boardProps;
  }, [overrideState, playerID, matchID, boardProps]);

  return (
    <BoardContext.Provider
      value={ctx.gameover ? modifiedOverrideState : boardProps}
    >
      <div
        className={classNames(
          'board-container',
          ctx.phase === 'selectCharacters' && 'board-container--pre-game',
        )}
      >
        <div className="board-container__log-chat">
          {playerID && (
            <div className="board-container__chat">
              <Chat />
            </div>
          )}
          {ctx.phase !== 'selectCharacters' && (
            <div className="board-container__log">
              <MoveLog />
            </div>
          )}
        </div>

        {ctx.phase === 'selectCharacters' ? (
          <div className="board-container__character-select">
            <CharacterSelect />
          </div>
        ) : (
          <>
            <div className="board-container__player-board">
              <PlayerBoard />
              {ctx.gameover && (
                <InspectorControls
                  unfilteredLog={log}
                  matchID={matchID}
                  setOverrideState={setOverrideState}
                />
              )}
              <PlayerControls />
            </div>

            {isMobile() ? (
              <PlayerInfoMobile />
            ) : (
              <div className="board-container__player-info">
                <PlayerInfo />
              </div>
            )}
          </>
        )}
      </div>
    </BoardContext.Provider>
  );
};
