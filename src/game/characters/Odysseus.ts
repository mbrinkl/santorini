import { Board } from '../space';
import { getCornerPositions, positionsAreAdjacent } from '../utility';
import { Character, CharacterState } from '../../types/CharacterTypes';
import { Mortal } from './Mortal';
import { GameContext } from '../../types/GameTypes';

interface OdysseusAttrs {
  specialUsed: boolean,
  workerToMovePos: number
}

function getOpenCorners({ G }: GameContext, charState: CharacterState<OdysseusAttrs>): Set<number> {
  const openCorners = new Set<number>();

  getCornerPositions().forEach((corner) => {
    if (!G.spaces[corner].isDomed && !G.spaces[corner].inhabitant) {
      openCorners.add(corner);
    }
  });

  return openCorners;
}

export const Odysseus: Character<OdysseusAttrs> = {
  ...Mortal,
  desc: `Start of Your Turn: Once, force to unoccupied corner spaces any 
    number of opponent Workers that neighbor your Workers.`,
  buttonText: 'Move Opponent',
  attrs: {
    specialUsed: false,
    workerToMovePos: -1,
  },

  onTurnBegin: (context, charState: CharacterState<OdysseusAttrs>) => {
    if (!charState.attrs.specialUsed) {
      charState.buttonActive = (Odysseus.validSpecial(context, charState, -1).size > 0);
    }
  },

  buttonPressed: (context, charState: CharacterState<OdysseusAttrs>) => {
    if (!charState.attrs.specialUsed) {
      charState.attrs.specialUsed = true;
      charState.buttonText = 'End';
      return 'special';
    }

    charState.buttonText = 'Move Workers';
    charState.buttonActive = false;
    return 'select';
  },

  select: (context, charState: CharacterState<OdysseusAttrs>, pos) => {
    charState.buttonActive = false;
    Mortal.select(context, charState, pos);
  },

  validSpecial: (context, charState: CharacterState<OdysseusAttrs>, fromPos) => {
    const { G, playerID } = context;
    const { opponentID } = G.players[playerID];

    const valids = new Set<number>();
    const openCorners = getOpenCorners(context, charState);

    // valid if there are opponent workers adjacent to any of Odysseus's workers
    // and at least one corner space is free
    if (openCorners.size === 0) {
      return valids;
    }

    if (charState.attrs.workerToMovePos === -1) {
      charState.workers.forEach((worker) => {
        G.players[opponentID].charState.workers.forEach((opponentWorker) => {
          if (positionsAreAdjacent(worker.pos, opponentWorker.pos)) {
            valids.add(opponentWorker.pos);
          }
        });
      });
    } else {
      return openCorners;
    }

    return valids;
  },

  special: ({ G, playerID }, charState: CharacterState<OdysseusAttrs>, pos) => {
    if (charState.attrs.workerToMovePos === -1) {
      charState.attrs.workerToMovePos = pos;
      charState.buttonActive = false;
    } else {
      const { inhabitant } = G.spaces[charState.attrs.workerToMovePos];
      if (inhabitant) {
        Board.free(G, charState.attrs.workerToMovePos);
        Board.place(G, pos, G.players[playerID].opponentID, inhabitant.workerNum);
      }
      charState.attrs.workerToMovePos = -1;
      charState.buttonActive = true;
    }
  },

  getStageAfterSpecial: (context, charState: CharacterState<OdysseusAttrs>) => {
    if (Odysseus.validSpecial(context, charState, -1).size > 0) {
      return 'special';
    }

    charState.buttonText = 'Move Workers';
    charState.buttonActive = false;
    return 'select';
  },
};
