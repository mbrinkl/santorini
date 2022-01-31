import { getAdjacentPositions } from '../utility';
import { Character, CharacterState } from '../../types/CharacterTypes';
import { Mortal } from './Mortal';
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

  onTurnBegin: ({ G }, char: CharacterState<PrometheusAttrs>) => {
    char.buttonActive = true;
  },

  select: (context, char: CharacterState<PrometheusAttrs>, pos) => {
    const returnValue = Mortal.select(context, char, pos);
    if (char.attrs.specialActive) return 'build';
    return returnValue;
  },

  validMove: ({ G }, char: CharacterState<PrometheusAttrs>, originalPos) => {
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

  move: (context, char: CharacterState, pos) => {
    char.buttonActive = false;
    return Mortal.move(context, char, pos);
  },

  build: ({ G }, char: CharacterState<PrometheusAttrs>, pos) => {
    Board.build(G, pos);

    if (char.attrs.specialActive) {
      char.attrs.specialUsed = true;
      char.attrs.originalPos = char.workers[char.selectedWorkerNum].pos;

      char.buttonActive = false;
      char.attrs.specialActive = false;
      char.buttonText = 'Build Before Move';

      return 'move';
    }

    char.attrs.specialUsed = false;
    char.attrs.originalPos = -1;
    return 'end';
  },

  buttonPressed: (context, char: CharacterState<PrometheusAttrs>) => {
    const { ctx } = context;
    char.attrs.specialActive = !char.attrs.specialActive;

    const stage = ctx.activePlayers && ctx.activePlayers[ctx.currentPlayer];

    if (char.attrs.specialActive) {
      char.buttonText = 'Cancel';
      if (stage === 'move') return 'build';
    } else {
      char.buttonText = 'Build Before Move';
      if (stage === 'build') return 'move';
    }

    return Mortal.buttonPressed(context, char);
  },
};
