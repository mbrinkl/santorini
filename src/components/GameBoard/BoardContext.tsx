import { ChatMessage, Ctx, FilteredMetadata } from 'boardgame.io';
import { useContext, createContext } from 'react';

import { GameState } from '../../types/GameTypes';

interface IBoardContext {
  playerID: string;
  matchID: string;
  credentials: string | undefined;
  moves: Record<string, (...args: any[]) => void>;
  State: GameState;
  isActive: boolean;
  ctx: Ctx;
  undo: () => void;
  sendChatMessage: (message: string) => void;
  chatMessages: ChatMessage[];
  matchData: FilteredMetadata | undefined;
}

export const BoardContext = createContext({} as IBoardContext);

export const useBoardContext = () => useContext(BoardContext);
