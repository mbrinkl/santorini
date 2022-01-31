import { GameContext, GameStage, GameState } from './GameTypes';

export interface Worker {
  pos: number;
  height: number;
}

export interface CharacterState<AttrsType = any> {
  name: string;
  desc: string;
  firstTurnRequired: boolean;
  workers: Worker[];
  numWorkersToPlace: number;
  selectedWorkerNum: number;
  moveUpHeight: number;
  buttonText: string;
  buttonActive: boolean;
  attrs: AttrsType;
}

export interface CharacterFunctions {
  initialize?: (context: GameContext, charState: CharacterState) => void,
  onTurnBegin?: (context: GameContext, charState: CharacterState) => void,
  onTurnEnd?: (context: GameContext, charState: CharacterState) => void,
  validPlace: (context: GameContext, charState: CharacterState) => number[],
  validSelect: (context: GameContext, charState: CharacterState) => number[],
  select: (context: GameContext, charState: CharacterState, pos: number) => GameStage,
  validMove: (context: GameContext, charState: CharacterState, originalPos: number) => number[],
  hasValidMoves: (context: GameContext, charState: CharacterState) => boolean,
  move: (context: GameContext, charState: CharacterState, pos: number) => GameStage,
  opponentPostMove: (context: GameContext, charState: CharacterState, pos: number) => void,
  validBuild: (context: GameContext, charState: CharacterState, originalPos: number) => number[],
  hasValidBuild: (context: GameContext, charState: CharacterState) => boolean,
  build: (context: GameContext, charState: CharacterState, pos: number) => GameStage,
  buttonPressed: (context: GameContext, charState: CharacterState) => GameStage,
  checkWinByMove: (
    G: GameState,
    charState: CharacterState,
    heightBefore: number,
    heightAfter: number
  ) => boolean,
}

export type Character<AttrsType = any> = Omit<CharacterState<AttrsType>, 'name'> & CharacterFunctions;
