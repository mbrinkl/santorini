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

  onTurnBegin: (context, charState: CharacterState<PrometheusAttrs>) => {
    charState.buttonActive = true;
  },

  select: (context, charState: CharacterState<PrometheusAttrs>, pos) => {
    const returnValue = Mortal.select(context, charState, pos);
    if (charState.attrs.specialActive) return 'build';
    return returnValue;
  },

  validMove: ({ G }, charState: CharacterState<PrometheusAttrs>, originalPos) => {
    const height = (charState.attrs.specialUsed ? 0 : charState.moveUpHeight);
    if (charState.attrs.specialUsed) {
      originalPos = charState.attrs.originalPos;
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

  move: (context, charState: CharacterState, pos) => {
    charState.buttonActive = false;
    return Mortal.move(context, charState, pos);
  },

  build: ({ G }, charState: CharacterState<PrometheusAttrs>, pos) => {
    Board.build(G, pos);

    if (charState.attrs.specialActive) {
      charState.attrs.specialUsed = true;
      charState.attrs.originalPos = charState.workers[charState.selectedWorkerNum].pos;

      charState.buttonActive = false;
      charState.attrs.specialActive = false;
      charState.buttonText = 'Build Before Move';

      return 'move';
    }

    charState.attrs.specialUsed = false;
    charState.attrs.originalPos = -1;
    return 'end';
  },

  buttonPressed: (context, charState: CharacterState<PrometheusAttrs>) => {
    const { ctx } = context;
    charState.attrs.specialActive = !charState.attrs.specialActive;

    const stage = ctx.activePlayers && ctx.activePlayers[ctx.currentPlayer];

    if (charState.attrs.specialActive) {
      charState.buttonText = 'Cancel';
      if (stage === 'move') return 'build';
    } else {
      charState.buttonText = 'Build Before Move';
      if (stage === 'build') return 'move';
    }

    return Mortal.buttonPressed(context, charState);
  },
};
