import { _ClientImpl } from 'boardgame.io/dist/types/src/client/client';
import { Local } from 'boardgame.io/multiplayer';
import { Client as Client2 } from 'boardgame.io/client';
import { useEffect, useState } from 'react';
import { SantoriniGame } from '../../game';
import { BoardPropsExt } from '../../hooks/useBoardContext';
import { GameBoard } from '../board/GameBoard';
import { GameState, GameType } from '../../types/gameTypes';
import './Game.scss';

const LocalGameWrapper = ({
  p0,
  p1,
}: {
  p0: _ClientImpl<GameState>;
  p1: _ClientImpl<GameState>;
}): JSX.Element => {
  const state = p0.getState();

  const [props, setProps] = useState<BoardPropsExt | null>(
    state
      ? {
          ...p0,
          ...state,
          gameType: GameType.Local,
          isMultiplayer: true,
        }
      : null,
  );

  useEffect(() => {
    const unsubscribeP0 = p0.subscribe((newState) => {
      if (newState && newState.ctx.currentPlayer === '0') {
        if (
          newState.ctx.phase === 'selectCharacters' &&
          newState.G.players['0'].ready
        ) {
          setProps({
            ...p1,
            ...newState,
            gameType: GameType.Local,
            isMultiplayer: true,
          });
        } else {
          setProps({
            ...p0,
            ...newState,
            gameType: GameType.Local,
            isMultiplayer: true,
          });
        }
      }
    });

    const unsubscribeP1 = p1.subscribe((newState) => {
      if (newState && newState.ctx.currentPlayer === '1') {
        setProps({
          ...p1,
          ...newState,
          gameType: GameType.Local,
          isMultiplayer: true,
        });
      }
    });

    return () => {
      unsubscribeP0();
      unsubscribeP1();
    };
  }, [p0, p1, setProps]);

  if (!props) return <div />;

  return <GameBoard {...props} />;
};

export const GameLocal = (): JSX.Element => {
  const game = { ...SantoriniGame };
  const p0 = Client2({ game, multiplayer: Local(), playerID: '0' });
  const p1 = Client2({ game, multiplayer: Local(), playerID: '1' });

  p0.start();
  p1.start();

  return <LocalGameWrapper p0={p0} p1={p1} />;
};
