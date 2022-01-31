import { Ctx, DefaultPluginAPIs } from 'boardgame.io';
import { CharacterState } from './CharacterTypes';

export type GameStage = 'place' | 'select' | 'move' | 'build' | 'end';

export type GameContext = DefaultPluginAPIs & {
  G: GameState,
  ctx: Ctx,
  playerID: string,
};

export interface Player {
  id: string;
  opponentId: string;
  ready: boolean;
  char: CharacterState;
}

export interface GameState {
  spaces: Space[];
  players: Record<string, Player>
  valids: number[];
}

export interface Space {
  pos: number;
  height: number;
  inhabitant?: {
    playerId: string;
    workerNum: number;
  };
  isDomed: boolean;
}
