import { Ctx } from "boardgame.io";
import { GameStage, GameState, Player } from "./GameTypes";

export interface Worker {
  pos: number;
  height: number;
}

export interface CharacterState {
  name: string;
  desc: string;
  workers: Worker[];
  numWorkers: number;
  numWorkersToPlace: number;
  selectedWorker: number;
  moveUpHeight: number;
  buttonText: string;
  buttonActive: boolean;
  attrs: any;
}

export interface Character extends Omit<CharacterState, "name"> {
  initialize: (G: GameState, ctx: Ctx, player: Player, char: CharacterState) => void,
  onTurnBegin: (G: GameState, ctx: Ctx, player: Player, char: CharacterState) => void,
  onTurnEnd: (G: GameState, ctx: Ctx, player: Player, char: CharacterState) => void,
  validPlace: (G: GameState, ctx: Ctx, player: Player, char: CharacterState) => number[],
  validSelect: (G: GameState, ctx: Ctx, player: Player, char: CharacterState) => number[],
  select: (G: GameState, ctx: Ctx, player: Player, char: CharacterState, pos: number) => GameStage,
  validMove: (G: GameState, ctx: Ctx, player: Player, char: CharacterState, originalPos: number) => number[],
  hasValidMoves: (G: GameState, ctx: Ctx, player: Player, char: CharacterState) => boolean,
  move: (G: GameState, ctx: Ctx, player: Player, char: CharacterState, pos: number) => GameStage,
  validBuild: (G: GameState, ctx: Ctx, player: Player, char: CharacterState, originalPos: number) => number[],
  hasValidBuild: (G: GameState, ctx: Ctx, player: Player, char: CharacterState) => boolean,
  build: (G: GameState, ctx: Ctx, player: Player, char: CharacterState, pos: number) => GameStage,
  buttonPressed: (G: GameState, ctx: Ctx, player: Player, char: CharacterState) => GameStage,
  checkWinByMove: (G: GameState, char: CharacterState, heightBefore: number, heightAfter: number) => boolean,
}