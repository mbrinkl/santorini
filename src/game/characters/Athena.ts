import { Character } from '../../types/characterTypesTemp';
import { Mortal } from './Mortal';
import { Board } from '../boardUtil';

type AthenaAttrs = {
  movedUp: boolean;
};

export const Athena: Character<AthenaAttrs> = {
  ...Mortal,

  data: {
    ...Mortal.data,
    desc: [
      `Opponent's Turn: If one of your workers moved up on your last turn, 
        opponent workers cannot move up this turn.`,
    ],
    pack: 'simple',
    attrs: {
      movedUp: false,
    },
  },

  onTurnBegin: (context, charState) => {
    charState.attrs.movedUp = false;
  },

  move: (context, charState, pos) => {
    const { playerID } = context;
    const heightBefore = charState.workers[charState.selectedWorkerNum].height;

    Board.free(context, charState.workers[charState.selectedWorkerNum].pos);
    Board.place(context, pos, playerID, charState.selectedWorkerNum);

    if (heightBefore < charState.workers[charState.selectedWorkerNum].height) {
      charState.attrs.movedUp = true;
    }
  },

  restrictOpponentMove: ({ G }, charState, oppCharState, fromPos) => {
    const validSet = new Set(G.valids);

    // Return no restrictions if Athena did not move up last turn
    if (!charState.attrs.movedUp) {
      return validSet;
    }

    // Remove higher spaces from valid set
    G.valids.forEach((pos) => {
      if (G.spaces[fromPos].height < G.spaces[pos].height) {
        validSet.delete(pos);
      }
    });

    return validSet;
  },
};
