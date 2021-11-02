import { Ctx } from "boardgame.io";
import { getAdjacentPositions } from '../utility'
import { Character, CharacterState } from ".";
import { Mortal } from "./Mortal";
import { GameState, Player } from '../../types/GameTypes';
import { Board } from '../space'

interface PrometheusAttrs {
  specialActive: boolean,
  specialUsed: boolean,
  originalPos: number
}

const initialAttrs: PrometheusAttrs = {
  specialActive: false,
  specialUsed: false,
  originalPos: -1
}

export const Prometheus: Character = {
  ...Mortal,
  name: 'Prometheus',
  desc: `Your Turn: If your Worker does not move up, it may build both before and after moving.`,
  buttonText: 'Bulid Before Move',
  attrs: initialAttrs,

  onTurnBegin: (
    G: GameState,
    ctx: Ctx,
    player: Player,
    char: CharacterState
  ) => {
    char.buttonActive = true;
  },

  select: (
    G: GameState,
    ctx: Ctx,
    player: Player,
    char: CharacterState,
    pos: number
  ) => {
    const attrs: PrometheusAttrs = char.attrs as PrometheusAttrs;

    char.selectedWorker = G.spaces[pos].inhabitant.workerNum;
    if (attrs.specialActive)
      return 'build';
    else
      return 'move';
  },

  validMove: (
    G: GameState,
    ctx: Ctx,
    player: Player,
    char: CharacterState,
    originalPos: number
  ) => {
    const attrs: PrometheusAttrs = char.attrs as PrometheusAttrs;

    let height = (attrs.specialUsed ? 0 : char.moveUpHeight)
    if (attrs.specialUsed) {
      originalPos = attrs.originalPos;
    }

    let adjacents: number[] = getAdjacentPositions(originalPos);
    let valids: number[] = []

    adjacents.forEach(pos => {
      if (!G.spaces[pos].inhabited &&
        !G.spaces[pos].is_domed &&
        G.spaces[pos].height - G.spaces[originalPos].height <= height
      ) {
        valids.push(pos);
      }
    })

    return valids;
  },

  move: (
    G: GameState,
    ctx: Ctx,
    player: Player,
    char: CharacterState,
    pos: number
  ) => {
    char.buttonActive = false;
    return Mortal.move(G, ctx, player, char, pos);
  },

  build: (
    G: GameState,
    ctx: Ctx,
    player: Player,
    char: CharacterState,
    pos: number
  ) => {
    const attrs: PrometheusAttrs = char.attrs as PrometheusAttrs;

    Board.build(G, pos);

    if (attrs.specialActive) {
      attrs.specialUsed = true;
      attrs.originalPos = char.workers[char.selectedWorker].pos;

      char.buttonActive = false;
      attrs.specialActive = false;
      char.buttonText = 'Build Before Move';

      return 'move';
    }
    else {
      attrs.specialUsed = false;
      attrs.originalPos = -1;
      return 'end';
    }
  },

  buttonPressed: (
    G: GameState,
    ctx: Ctx,
    player: Player,
    char: CharacterState
  ) => {
    const attrs: PrometheusAttrs = char.attrs as PrometheusAttrs;

    attrs.specialActive = !attrs.specialActive;

    const stage = ctx.activePlayers![ctx.currentPlayer];

    if (attrs.specialActive) {
      char.buttonText = 'Cancel';
      if (stage === 'move')
        return 'build';
    }
    else {
      char.buttonText = 'Build Before Move';
      if (stage === 'build')
        return 'move';
    }

    return Mortal.buttonPressed(G, ctx, player, char);
  },
}