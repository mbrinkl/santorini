import { Ctx, DefaultPluginAPIs } from 'boardgame.io';
import { CharacterState } from './CharacterTypes';

export type GameStage = 'place' | 'select' | 'move' | 'build' | 'special' | 'end';

export type GameContext = DefaultPluginAPIs & {
  G: GameState,
  ctx: Ctx,
  playerID: string,
};

export interface Player {
  ID: string;
  opponentID: string;
  ready: boolean;
  charState: CharacterState;
}

export interface GameState {
  spaces: Space[];
  players: Record<string, Player>;
  valids: number[];
}

export interface Space {
  pos: number;
  height: number;
  inhabitant?: {
    playerID: string;
    workerNum: number;
  };
  isDomed: boolean;
}
