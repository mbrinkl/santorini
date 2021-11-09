import { CharacterState } from './CharacterTypes';

export type PlayerIDs = '0' | '1';
export type GameStage = 'place' | 'select' | 'move' | 'build' | 'end';

export interface Player {
  id: string;
  opponentId: string;
  ready: boolean;
  char: CharacterState;
}

export interface GameState {
  spaces: Space[];
  players: Record<PlayerIDs, Player>
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
