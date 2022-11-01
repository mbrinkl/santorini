import { Board } from '../util/boardUtil';
import { getCornerPositions, positionsAreAdjacent } from '../util/posUtil';
import { Character, GameContext } from '../../types/gameTypes';
import { Mortal } from './Mortal';

type OdysseusAttrs = {
  specialUsed: boolean;
  workerToMovePos: number;
};

function getOpenCorners({ G, playerID }: GameContext): Set<number> {
  const { opponentID } = G.players[playerID];
  const openCorners = new Set<number>();

  getCornerPositions().forEach((corner) => {
    if (!Board.isObstructed(G, opponentID, corner)) {
      openCorners.add(corner);
    }
  });

  return openCorners;
}

export const Odysseus: Character<OdysseusAttrs> = {
  ...Mortal,

  data: {
    ...Mortal.data,
    desc: [
      `Start of Your Turn: Once, force to unoccupied corner spaces any 
    number of opponent Workers that neighbor your Workers.`,
    ],
    pack: 'heroes',
    buttonText: 'Move Opponent',
    attrs: {
      specialUsed: false,
      workerToMovePos: -1,
    },
  },

  onTurnBegin: (context, charState) => {
    if (!charState.attrs.specialUsed) {
      charState.buttonActive =
        Odysseus.validSpecial(context, charState, -1).size > 0;
    }
  },

  buttonPressed: (context, charState) => {
    if (!charState.attrs.specialUsed) {
      charState.attrs.specialUsed = true;
      charState.buttonText = 'End';
      return 'special';
    }

    charState.buttonText = 'Move Workers';
    charState.buttonActive = false;
    return 'select';
  },

  select: (context, charState, pos) => {
    charState.buttonActive = false;
    Mortal.select(context, charState, pos);
  },

  validSpecial: (context, charState, fromPos) => {
    const { G, playerID } = context;
    const { opponentID } = G.players[playerID];

    const valids = new Set<number>();
    const openCorners = getOpenCorners(context);

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

  special: (context, charState, pos) => {
    const { G, playerID } = context;
    if (charState.attrs.workerToMovePos === -1) {
      charState.attrs.workerToMovePos = pos;
      charState.buttonActive = false;
    } else {
      const { inhabitant } = G.spaces[charState.attrs.workerToMovePos];
      if (inhabitant) {
        Board.free(context, charState.attrs.workerToMovePos);
        Board.place(
          context,
          pos,
          G.players[playerID].opponentID,
          inhabitant.workerNum,
        );
      }
      charState.attrs.workerToMovePos = -1;
      charState.buttonActive = true;
    }
  },

  getStageAfterSpecial: (context, charState) => {
    if (Odysseus.validSpecial(context, charState, -1).size > 0) {
      return 'special';
    }

    charState.buttonText = 'Move Workers';
    charState.buttonActive = false;
    return 'select';
  },
};
