import { BoardProps } from 'boardgame.io/react';
import { GameState } from '../../types/GameTypes';
import { BoardContext } from '../../context/boardContext';
import { PlayerBoard } from './PlayerBoard';
import { PlayerControls } from './PlayerControls';
import { CharacterSelect } from '../CharacterSelect';
import { PlayerInfo } from './PlayerInfo';
import { PlayerInfoMobile } from './PlayerInfoMobile';
import { Chat } from '../Chat';
import { isMobile } from '../../util';
import './style.scss';

export const GameBoard = (boardProps: BoardProps<GameState>) : JSX.Element => {
  const { ctx } = boardProps;

  return (
    <BoardContext.Provider value={boardProps}>
      {ctx.phase === 'selectCharacters'
        ? <CharacterSelect />
        : (
          <div className="board-container">
            <div className="board-container__chat">
              <Chat />
            </div>

            <div className="board-container__player-board">
              <PlayerBoard />
              <PlayerControls />
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
