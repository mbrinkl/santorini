import { GameContext, GameStage, GameState } from './GameTypes';

export interface Worker {
  pos: number;
  height: number;
}

export interface CharacterState<AttrsType = any> {
  name: string;
  desc: string;
  workers: Worker[];
  numWorkersToPlace: number;
  selectedWorkerNum: number;
  moveUpHeight: number;
  buttonText: string;
  buttonActive: boolean;
  attrs: AttrsType;
}

export interface CharacterFunctions {
  initialize?: (context: GameContext, char: CharacterState) => void,
  onTurnBegin?: (context: GameContext, char: CharacterState) => void,
  onTurnEnd?: (context: GameContext, char: CharacterState) => void,
  validPlace: (context: GameContext, char: CharacterState) => number[],
  validSelect: (context: GameContext, char: CharacterState) => number[],
  select: (context: GameContext, char: CharacterState, pos: number) => GameStage,
  validMove: (context: GameContext, char: CharacterState, originalPos: number) => number[],
  hasValidMoves: (context: GameContext, char: CharacterState) => boolean,
  move: (context: GameContext, char: CharacterState, pos: number) => GameStage,
  opponentPostMove: (context: GameContext, char: CharacterState, pos: number) => void,
  validBuild: (context: GameContext, char: CharacterState, originalPos: number) => number[],
  hasValidBuild: (context: GameContext, char: CharacterState) => boolean,
  build: (context: GameContext, char: CharacterState, pos: number) => GameStage,
  buttonPressed: (context: GameContext, char: CharacterState) => GameStage,
  checkWinByMove: (
    G: GameState,
    char: CharacterState,
    heightBefore: number,
    heightAfter: number
  ) => boolean,
}

export type Character<AttrsType = any> = Omit<CharacterState<AttrsType>, 'name'> & CharacterFunctions;
