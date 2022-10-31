import { Board } from '../boardUtil';
import { Mortal } from './Mortal';
import { Character } from '../../types/characterTypes';

type AsteriaAttrs = {
  movedDown: boolean;
};

export const Asteria: Character<AsteriaAttrs> = {
  ...Mortal,

  data: {
    ...Mortal.data,
    desc: [
      `End of Your Turn: If one of your Workers moved down this turn, 
    you may build a dome on any unoccupied space.`,
    ],
    pack: 'promo',
    attrs: {
      movedDown: false,
    },
    buttonText: 'Skip Dome',
  },

  onTurnBegin: (context, charState) => {
    charState.attrs.movedDown = false;
  },

  buttonPressed: (context, charState) => {
    charState.buttonActive = false;
    return 'end';
  },

  move: (context, charState, pos) => {
    const { G } = context;
    const movedFromPos = charState.workers[charState.selectedWorkerNum].pos;
    Mortal.move(context, charState, pos);
    if (G.spaces[movedFromPos].height > G.spaces[pos].height) {
      charState.attrs.movedDown = true;
    }
  },

  getStageAfterBuild: (context, charState) => {
    if (charState.attrs.movedDown) {
      charState.buttonActive = true;
      return 'special';
    }

    return 'end';
  },

  validSpecial: ({ G, playerID }, charState, fromPos) => {
    const valids = new Set<number>();
    G.spaces.forEach((space) => {
      if (!Board.isObstructed(G, playerID, space.pos)) {
        valids.add(space.pos);
      }
    });
    return valids;
  },

  special: ({ G }, charState, pos) => {
    G.spaces[pos].isDomed = true;
    charState.buttonActive = false;
  },
};
