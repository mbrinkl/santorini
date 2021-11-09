import { Ctx } from 'boardgame.io';
import { getAdjacentPositions } from '../utility';
import { Character, CharacterState } from '../../types/CharacterTypes';
import { Mortal } from './Mortal';
import { GameState, Player } from '../../types/GameTypes';
import { Board } from '../space';

interface PrometheusAttrs {
  specialActive: boolean,
  specialUsed: boolean,
  originalPos: number
}

export const Prometheus: Character<PrometheusAttrs> = {
  ...Mortal,
  desc: 'Your Turn: If your Worker does not move up, it may build both before and after moving.',
  buttonText: 'Bulid Before Move',
  attrs: {
    specialActive: false,
    specialUsed: false,
    originalPos: -1,
  },

  onTurnBegin: (
    G: GameState,
    ctx: Ctx,
    player: Player,
    char: CharacterState<PrometheusAttrs>,
  ) => {
    char.buttonActive = true;
  },

  select: (
    G: GameState,
    ctx: Ctx,
    player: Player,
    char: CharacterState<PrometheusAttrs>,
    pos: number,
  ) => {
    char.selectedWorker = G.spaces[pos].inhabitant?.workerNum || -1;
    if (char.attrs.specialActive) return 'build';
    return 'move';
  },

  validMove: (
    G: GameState,
    ctx: Ctx,
    player: Player,
    char: CharacterState<PrometheusAttrs>,
    originalPos: number,
  ) => {
    const height = (char.attrs.specialUsed ? 0 : char.moveUpHeight);
    if (char.attrs.specialUsed) {
      originalPos = char.attrs.originalPos;
    }

    const adjacents: number[] = getAdjacentPositions(originalPos);
    const valids: number[] = [];

    adjacents.forEach((pos) => {
      if (!G.spaces[pos].inhabitant
        && !G.spaces[pos].isDomed
        && G.spaces[pos].height - G.spaces[originalPos].height <= height
      ) {
        valids.push(pos);
      }
    });

    return valids;
  },

  move: (
    G: GameState,
    ctx: Ctx,
    player: Player,
    char: CharacterState,
    pos: number,
  ) => {
    char.buttonActive = false;
    return Mortal.move(G, ctx, player, char, pos);
  },

  build: (
    G: GameState,
    ctx: Ctx,
    player: Player,
    char: CharacterState<PrometheusAttrs>,
    pos: number,
  ) => {
    Board.build(G, pos);

    if (char.attrs.specialActive) {
      char.attrs.specialUsed = true;
      char.attrs.originalPos = char.workers[char.selectedWorker].pos;

      char.buttonActive = false;
      char.attrs.specialActive = false;
      char.buttonText = 'Build Before Move';

      return 'move';
    }

    char.attrs.specialUsed = false;
    char.attrs.originalPos = -1;
    return 'end';
  },

  buttonPressed: (
    G: GameState,
    ctx: Ctx,
    player: Player,
    char: CharacterState<PrometheusAttrs>,
  ) => {
    char.attrs.specialActive = !char.attrs.specialActive;

    const stage = ctx.activePlayers && ctx.activePlayers[ctx.currentPlayer];

    if (char.attrs.specialActive) {
      char.buttonText = 'Cancel';
      if (stage === 'move') return 'build';
    } else {
      char.buttonText = 'Build Before Move';
      if (stage === 'build') return 'move';
    }

    return Mortal.buttonPressed(G, ctx, player, char);
  },
};
