import classNames from 'classnames';
import { BoardProps } from 'boardgame.io/react';
import { useMemo, useState } from 'react';
import { Inspector } from '../Inspector';
import { GameState } from '../../types/GameTypes';
import { BoardContext } from '../../context/boardContext';
import { PlayerBoard } from './PlayerBoard';
import { PlayerControls } from './PlayerControls';
import { CharacterSelect } from '../CharacterSelect';
import { PlayerInfo } from './PlayerInfo';
import { PlayerInfoMobile } from './PlayerInfoMobile';
import { Chat } from '../Chat';
import { MoveLog } from '../MoveLog';
import { isMobile } from '../../util';
import './style.scss';

export const GameBoard = (boardProps: BoardProps<GameState>) : JSX.Element => {
  const [overrideState, setOverrideState] = useState<BoardProps<GameState> | null>(null);
  const {
    ctx, playerID, matchData, chatMessages, sendChatMessage, log, matchID,
  } = boardProps;

  const modifiedOverrideState: BoardProps<GameState> = useMemo(() => {
    if (overrideState) {
      return {
        ...overrideState, playerID, matchData, chatMessages, sendChatMessage,
      };
    }
    return boardProps;
  }, [overrideState, playerID, matchData, chatMessages, sendChatMessage, boardProps]);

  return (
    <BoardContext.Provider value={ctx.gameover ? modifiedOverrideState : boardProps}>
      {ctx.phase === 'selectCharacters'
        ? <CharacterSelect />
        : (
          <div className="board-container">
            <div className="board-container__log-chat">
              {playerID && (
                <div className="board-container__chat">
                  <Chat />
                </div>
              )}
              <div className={classNames(
                'board-container__log',
                !playerID && 'board-container__log--spectator',
              )}
              >
                <MoveLog />
              </div>
            </div>

            <div className="board-container__player-board">
              <PlayerBoard />
              <PlayerControls />
              {ctx.gameover && (
              <Inspector
                logs={log}
                matchID={matchID}
                setOverrideState={setOverrideState}
              />
              )}
            </div>

            {isMobile() ? <PlayerInfoMobile /> : (
              <div className="board-container__player-info">
                <PlayerInfo />
              </div>
            )}
          </div>
        )}
    </BoardContext.Provider>
  );
};
