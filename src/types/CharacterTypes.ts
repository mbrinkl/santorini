import { GameContext, GameStage } from './GameTypes';

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
  powerBlocked: boolean;
  attrs: AttrsType;
}

export interface CharacterFunctions {
  initialize: (context: GameContext, charState: CharacterState) => void,
  onTurnBegin: (context: GameContext, charState: CharacterState) => void,
  onTurnEnd: (context: GameContext, charState: CharacterState) => void,

  validPlace: (context: GameContext, charState: CharacterState) => Set<number>,

  validSelect: (context: GameContext, charState: CharacterState) => Set<number>,
  select: (context: GameContext, charState: CharacterState, pos: number) => void,
  getStageAfterSelect: (context: GameContext, charState: CharacterState) => GameStage,

  validMove: (context: GameContext, charState: CharacterState, fromPos: number) => Set<number>,
  restrictOpponentMove: (
    context: GameContext,
    charState: CharacterState,
    oppCharState: CharacterState,
    fromPos: number,
  ) => Set<number>
  hasValidMoves: (context: GameContext, charState: CharacterState) => boolean,
  move: (context: GameContext, charState: CharacterState, pos: number) => void,
  afterOpponentMove: (
    context: GameContext,
    charState: CharacterState,
    oppCharState: CharacterState,
    movedFromPos: number
  ) => void,
  getStageAfterMove: (context: GameContext, charState: CharacterState) => GameStage,

  validBuild: (context: GameContext, charState: CharacterState, fromPos: number) => Set<number>,
  restrictOpponentBuild: (
    context: GameContext,
    charState: CharacterState,
    oppCharState: CharacterState,
    fromPos: number,
  ) => Set<number>,
  hasValidBuild: (context: GameContext, charState: CharacterState) => boolean,
  build: (context: GameContext, charState: CharacterState, pos: number) => void,
  afterOpponentBuild: (
    context: GameContext,
    charState: CharacterState,
    oppCharState: CharacterState,
    builtPos: number,
  ) => void,
  getStageAfterBuild: (context: GameContext, charState: CharacterState) => GameStage,

  validSpecial: (context: GameContext, charState: CharacterState, fromPos: number) => Set<number>,
  special: (context: GameContext, charState: CharacterState, pos: number) => void,
  getStageAfterSpecial: (context: GameContext, charState: CharacterState) => GameStage,

  buttonPressed: (context: GameContext, charState: CharacterState) => GameStage,

  restrictOpponentWin: (
    context: GameContext,
    charState: CharacterState,
    posBefore: number,
    posAfter: number
  ) => boolean;

  checkWinByMove: (
    context: GameContext,
    charState: CharacterState,
    posBefore: number,
    posAfter: number
  ) => boolean,
}

export type Character<AttrsType = any> = Omit<CharacterState<AttrsType>, 'name'> & CharacterFunctions;
