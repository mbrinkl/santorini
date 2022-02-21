import { Character } from '../../types/CharacterTypes';
import { Mortal } from './Mortal';
import { Board } from '../boardUtil';
import { getNextPosition, getPerimeterPositions } from '../utility';

export const Bia: Character = {
  ...Mortal,

  data: {
    ...Mortal.data,
    desc: [
      'Setup: Place your Workers first. Your Workers must be placed in perimeter spaces.',
      `Your Move: If your Worker moves into a space and the next space in the same direction is 
    occupied by an opponent Worker, the opponent’s Worker is removed from the game.`,
    ],
    pack: 'advanced',
    turnOrder: 0,
  },

  validPlace: ({ G }, charState) => {
    const valids = new Set<number>();

    getPerimeterPositions().forEach((pos) => {
      if (!G.spaces[pos].inhabitant) {
        valids.add(pos);
      }
    });

    return valids;
  },

  move: (context, charState, pos) => {
    const { G, playerID } = context;
    const { opponentID } = G.players[playerID];
    const opponentCharState = G.players[opponentID].charState;
    const posToKill = getNextPosition(
      charState.workers[charState.selectedWorkerNum].pos,
      pos,
    );

    if (
      posToKill !== -1 &&
      G.spaces[posToKill].inhabitant &&
      G.spaces[posToKill].inhabitant?.playerID === opponentID
    ) {
      // Find the opponent worker to remove from their worker array
      const worker = opponentCharState.workers.find((w) => w.pos === posToKill);

      if (worker) {
        Board.killWorkerAtPos(context, posToKill);
      }
    }

    Mortal.move(context, charState, pos);
  },
};
