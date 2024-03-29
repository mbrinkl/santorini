import classNames from 'classnames';
import { useMemo, useState } from 'react';
import { InspectorControls } from './Inspector';
import { OverrideState, GameType } from '../../types/gameTypes';
import { BoardContext, BoardPropsExt } from '../../hooks/useBoardContext';
import { PlayerBoard } from './PlayerBoard';
import { PlayerControls } from './PlayerControls';
import { CharacterSelect } from './CharacterSelect';
import { PlayerInfo } from './PlayerInfo';
import { PlayerInfoMobile } from './PlayerInfoMobile';
import { Chat } from './Chat';
import { MoveLog } from './MoveLog';
import { isMobile } from '../../util';
import './GameBoard.scss';

export const GameBoard = (boardProps: BoardPropsExt): JSX.Element => {
  const [overrideState, setOverrideState] = useState<OverrideState>();
  const { ctx: unmodifiedCtx, log: unmodifiedLog } = boardProps;

  const modifiedBoardProps: BoardPropsExt = useMemo(() => {
    if (overrideState) {
      return {
        ...boardProps,
        ...overrideState,
        isActive: false,
      };
    }
    return boardProps;
  }, [overrideState, boardProps]);

  const { ctx, playerID, matchID, gameType } = modifiedBoardProps;

  return (
    <BoardContext.Provider value={modifiedBoardProps}>
      <div
        className={classNames(
          'board-container',
          ctx.phase === 'selectCharacters' && 'board-container--pre-game',
        )}
      >
        <div className="board-container__log-chat">
          {playerID && gameType === GameType.Online && (
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
              {unmodifiedCtx.gameover && gameType === GameType.Online && (
                <InspectorControls
                  unfilteredLog={unmodifiedLog}
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
