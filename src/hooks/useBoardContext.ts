import { useContext, createContext } from 'react';
import { BoardProps } from 'boardgame.io/react';
import { GameState } from '../types/gameTypes';

export enum GameType {
  Online,
  Local,
  AI,
}

export interface BoardPropsExt extends BoardProps<GameState> {
  gameType: GameType;
}

export const BoardContext = createContext({} as BoardPropsExt);

export const useBoardContext = () => useContext(BoardContext);
