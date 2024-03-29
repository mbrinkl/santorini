import { Ctx, DefaultPluginAPIs } from 'boardgame.io';

export enum GameType {
  Online,
  Local,
  AI,
}

export type GameStage =
  | 'setup'
  | 'place'
  | 'select'
  | 'move'
  | 'build'
  | 'special'
  | 'end';

export type GameContext = DefaultPluginAPIs & {
  G: GameState;
  ctx: Ctx;
  playerID: string;
};

export type OverrideState = {
  G: GameState;
  ctx: Ctx;
};

export interface GameState {
  spaces: Space[];
  players: Record<string, Player>;
  valids: number[];
  offBoardTokens: OffBoardToken[];
  isDummy: boolean;
}

export interface Player {
  ID: string;
  opponentID: string;
  ready: boolean;
  charState: CharacterState;
}

export interface Space {
  pos: number;
  height: number;
  inhabitant?: {
    playerID: string;
    workerNum: number;
  };
  isDomed: boolean;
  tokens: TokenState[];
}

/**
 * Tokens
 */

export interface TokenState {
  tokenName: string;
  playerID: string;
  obstructing: 'none' | 'all' | 'opponent';
  isSecret: boolean;
  isRemovable: boolean;
  color: string; // just distinguish by color for now
}

export interface Token {
  create: (playerID: string) => TokenState;
  effects?: (context: GameContext, tokenState: TokenState, pos: number) => void;
}

export interface OffBoardToken {
  playerID: string;
  direction: number;
}

/**
 * Characters
 */

export interface Worker {
  pos: number;
  height: number;
}

export type Pack =
  | 'none'
  | 'simple'
  | 'advanced'
  | 'gf'
  | 'heroes'
  | 'promo'
  | 'custom';

export interface CharacterState<T = Record<string, unknown>> {
  name: string;
  desc: string[];
  pack: Pack;
  turnOrder?: 0 | 1;
  workers: Worker[];
  selectedWorkerNum: number;
  numWorkersToPlace: number;
  hasBeforeBoardSetup: boolean;
  hasAfterBoardSetup: boolean;
  hasSecretWorkers: boolean;
  hasSecretSetup: boolean;
  hasSecretSpecial: boolean;
  moveUpHeight: number;
  specialText: string;
  buttonText: string;
  buttonActive: boolean;
  powerBlocked: boolean;
  attrs: T;
}

interface CharacterFns<T> {
  initialize: (context: GameContext, charState: CharacterState<T>) => void;
  onTurnBegin: (context: GameContext, charState: CharacterState<T>) => void;
  onTurnEnd: (context: GameContext, charState: CharacterState<T>) => void;

  validSetup: (
    context: GameContext,
    charState: CharacterState<T>,
  ) => Set<number>;
  setup: (
    context: GameContext,
    charState: CharacterState<T>,
    pos: number,
  ) => GameStage;

  validPlace: (
    context: GameContext,
    charState: CharacterState<T>,
  ) => Set<number>;
  place: (
    context: GameContext,
    charState: CharacterState<T>,
    pos: number,
  ) => GameStage;

  validSelect: (
    context: GameContext,
    charState: CharacterState<T>,
  ) => Set<number>;
  select: (
    context: GameContext,
    charState: CharacterState<T>,
    pos: number,
  ) => void;
  getStageAfterSelect: (
    context: GameContext,
    charState: CharacterState<T>,
  ) => GameStage;

  validMove: (
    context: GameContext,
    charState: CharacterState<T>,
    fromPos: number,
  ) => Set<number>;
  restrictOpponentMove: (
    context: GameContext,
    charState: CharacterState<T>,
    oppCharState: CharacterState,
    fromPos: number,
  ) => Set<number>;
  move: (
    context: GameContext,
    charState: CharacterState<T>,
    pos: number,
  ) => void;
  afterOpponentMove: (
    context: GameContext,
    charState: CharacterState<T>,
    oppCharState: CharacterState,
    movedFromPos: number,
  ) => void;
  getStageAfterMove: (
    context: GameContext,
    charState: CharacterState<T>,
  ) => GameStage;

  validBuild: (
    context: GameContext,
    charState: CharacterState<T>,
    fromPos: number,
  ) => Set<number>;
  restrictOpponentBuild: (
    context: GameContext,
    charState: CharacterState<T>,
    oppCharState: CharacterState,
    fromPos: number,
  ) => Set<number>;
  build: (
    context: GameContext,
    charState: CharacterState<T>,
    pos: number,
  ) => void;
  afterOpponentBuild: (
    context: GameContext,
    charState: CharacterState<T>,
    oppCharState: CharacterState,
    builtPos: number,
  ) => void;
  getStageAfterBuild: (
    context: GameContext,
    charState: CharacterState<T>,
  ) => GameStage;

  validSpecial: (
    context: GameContext,
    charState: CharacterState<T>,
    fromPos: number,
  ) => Set<number>;
  restrictOpponentSpecial: (
    context: GameContext,
    charState: CharacterState<T>,
    oppCharState: CharacterState,
    fromPos: number,
  ) => Set<number>;
  special: (
    context: GameContext,
    charState: CharacterState<T>,
    pos: number,
  ) => void;
  afterOpponentSpecial: (
    context: GameContext,
    charState: CharacterState<T>,
    oppCharState: CharacterState,
  ) => void;
  getStageAfterSpecial: (
    context: GameContext,
    charState: CharacterState<T>,
  ) => GameStage;

  buttonPressed: (
    context: GameContext,
    charState: CharacterState<T>,
  ) => GameStage;

  tokenEffects: (
    context: GameContext,
    charState: CharacterState<T>,
    pos: number,
  ) => void;

  restrictOpponentWin: (
    context: GameContext,
    charState: CharacterState<T>,
    posBefore: number,
    posAfter: number,
  ) => boolean;

  checkWinByMove: (
    context: GameContext,
    charState: CharacterState<T>,
    posBefore: number,
    posAfter: number,
  ) => boolean;
}

export type Character<T = Record<string, unknown>> = CharacterFns<T> & {
  data: Omit<CharacterState<T>, 'name'>;
};
