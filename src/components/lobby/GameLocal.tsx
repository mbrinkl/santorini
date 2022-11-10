import { Local } from 'boardgame.io/multiplayer';
import { BoardProps, Client } from 'boardgame.io/react';
import { SantoriniGame } from '../../game';
import { BoardPropsExt } from '../../hooks/useBoardContext';
import { GameBoard } from '../board/GameBoard';
import { LoadingPage } from './LoadingPage';
import './Game.scss';
import { GameType } from '../../types/gameTypes';

const localBoardWrapper = (
  gameType: GameType,
  RawBoard: (props: BoardPropsExt) => JSX.Element,
) => {
  const Board: React.FC<BoardProps> = (boardProps) => {
    const { G, ctx, playerID } = boardProps;

    let shouldHideBoard = false;

    if (ctx.phase === 'selectCharacters') {
      shouldHideBoard =
        (playerID === '0' && G.players['0'].ready) ||
        (playerID === '1' && !G.players['0'].ready);
    } else {
      shouldHideBoard = ctx.currentPlayer !== playerID;
    }

    const props = {
      ...boardProps,
      gameType,
    };

    return (
      <div
        className={
          shouldHideBoard
            ? 'lobby__local-wrapper--hidden'
            : 'lobby__local-wrapper'
        }
      >
        <RawBoard {...props} />
      </div>
    );
  };

  return Board;
};

const LocalClient = Client({
  game: SantoriniGame,
  board: localBoardWrapper(GameType.Local, GameBoard),
  multiplayer: Local(),
  loading: LoadingPage,
});

export const GameLocal = (): JSX.Element => (
  <div className="lobby__local">
    <LocalClient playerID="0" />
    <LocalClient playerID="1" />
  </div>
);
