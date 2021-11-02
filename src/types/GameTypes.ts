import { CharacterState } from "./CharacterTypes"

type playerIDs = '0' | '1';

export interface Player {
  id: string;
  opponentId: string;
  ready: boolean;
  char: CharacterState;
}

export interface GameState {
  spaces: Space[];
  players: Record<playerIDs, Player>
  valids: number[];
}

export interface Space {
  pos: number;
  height: number;
  inhabited: boolean;
  inhabitant: {
    playerId: string;
    workerNum: number;
  };
  is_domed: boolean;
}