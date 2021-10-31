import { ChatMessage, Ctx, FilteredMetadata } from "boardgame.io";
import { useContext } from "react";
import { createContext } from "react";
import { GameState } from "../../game";

interface IBoardContext {
  playerID: string;
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

export const useBoardContext = () => {
  return useContext(BoardContext);
};