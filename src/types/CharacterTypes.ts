import { GameContext, GameStage } from './GameTypes';

export type Pack = 'none' | 'simple' | 'advanced' | 'gf' | 'heroes' | 'promo' | 'custom';

export interface Worker {
  pos: number;
  height: number;
}

export interface CharacterState<T = Record<string, unknown>> {
  name: string;
  desc: string[];
  pack: Pack;
  turnOrder?: 0 | 1;
  workers: Worker[];
  numWorkersToPlace: number;
  hasBeforeBoardSetup: boolean;
  hasAfterBoardSetup: boolean;
  selectedWorkerNum: number;
  secretWorkers: boolean;
  moveUpHeight: number;
  buttonText: string;
  buttonActive: boolean;
  powerBlocked: boolean;
  attrs: T;
}

export interface CharacterFunctions<T> {
  initialize: (context: GameContext, charState: CharacterState<T>) => void,
  onTurnBegin: (context: GameContext, charState: CharacterState<T>) => void,
  onTurnEnd: (context: GameContext, charState: CharacterState<T>) => void,

  validSetup: (context: GameContext, charState: CharacterState<T>) => Set<number>,
  setup: (context: GameContext, charState: CharacterState<T>, pos: number) => GameStage,

  validPlace: (context: GameContext, charState: CharacterState<T>) => Set<number>,
  place: (context: GameContext, charState: CharacterState<T>, pos: number) => GameStage,

  validSelect: (context: GameContext, charState: CharacterState<T>) => Set<number>,
  select: (context: GameContext, charState: CharacterState<T>, pos: number) => void,
  getStageAfterSelect: (context: GameContext, charState: CharacterState<T>) => GameStage,

  validMove: (context: GameContext, charState: CharacterState<T>, fromPos: number) => Set<number>,
  restrictOpponentMove: (
    context: GameContext,
    charState: CharacterState<T>,
    oppCharState: CharacterState,
    fromPos: number,
  ) => Set<number>
  move: (context: GameContext, charState: CharacterState<T>, pos: number) => void,
  afterOpponentMove: (
    context: GameContext,
    charState: CharacterState<T>,
    oppCharState: CharacterState,
    movedFromPos: number
  ) => void,
  getStageAfterMove: (context: GameContext, charState: CharacterState<T>) => GameStage,

  validBuild: (context: GameContext, charState: CharacterState<T>, fromPos: number) => Set<number>,
  restrictOpponentBuild: (
    context: GameContext,
    charState: CharacterState<T>,
    oppCharState: CharacterState,
    fromPos: number,
  ) => Set<number>,
  build: (context: GameContext, charState: CharacterState<T>, pos: number) => void,
  afterOpponentBuild: (
    context: GameContext,
    charState: CharacterState<T>,
    oppCharState: CharacterState,
    builtPos: number,
  ) => void,
  getStageAfterBuild: (context: GameContext, charState: CharacterState<T>) => GameStage,

  validSpecial: (
    context: GameContext,
    charState: CharacterState<T>,
    fromPos: number
  ) => Set<number>,
  restrictOpponentSpecial: (
    context: GameContext,
    charState: CharacterState<T>,
    oppCharState: CharacterState,
    fromPos: number,
  ) => Set<number>,
  special: (context: GameContext, charState: CharacterState<T>, pos: number) => void,
  afterOpponentSpecial: (
    context: GameContext,
    charState: CharacterState<T>,
    oppCharState: CharacterState,
  ) => void,
  getStageAfterSpecial: (context: GameContext, charState: CharacterState<T>) => GameStage,

  buttonPressed: (context: GameContext, charState: CharacterState<T>) => GameStage,

  tokenEffects: (context: GameContext, charState: CharacterState<T>, pos: number) => void;

  restrictOpponentWin: (
    context: GameContext,
    charState: CharacterState<T>,
    posBefore: number,
    posAfter: number
  ) => boolean;

  checkWinByMove: (
    context: GameContext,
    charState: CharacterState<T>,
    posBefore: number,
    posAfter: number
  ) => boolean,
}

export type Character<T = Record<string, unknown>> = CharacterFunctions<T> &
{
  data: Omit<CharacterState<T>, 'name'>
};
