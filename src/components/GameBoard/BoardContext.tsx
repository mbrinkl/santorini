import { useContext } from "react";
import { createContext } from "react";
import { GameState } from "../../game";

interface IBoardContext {
  playerID: string;
  moves: any;
  State: GameState;
  isActive: boolean;
  ctx: any;
  undo(): void;
  playersInfo: { id: string; name: string }[];
}

export const BoardContext = createContext({} as IBoardContext);

export const useBoardContext = () => {
  return useContext(BoardContext);
};