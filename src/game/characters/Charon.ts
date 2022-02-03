import { getAdjacentPositions, getNextPosition } from '../utility';
import { Board } from '../space';
import { Mortal } from './Mortal';
import { Character, CharacterState } from '../../types/CharacterTypes';

export const Charon: Character = {
  ...Mortal,
  desc: `Your Move: Before your Worker moves, you may force a neighboring opponent Worker
    to the space directly on the other side of your Worker, if that space is unoccupied.`,
  buttonText: 'Move Opponent',

  buttonPressed: (context, charState: CharacterState) => {
    charState.buttonActive = false;
    return 'special';
  },

  select: (context, charState: CharacterState, pos) => {
    Mortal.select(context, charState, pos);
    if (Charon.validSpecial(
      context,
      charState,
      charState.workers[charState.selectedWorkerNum].pos,
    ).size > 0) {
      charState.buttonActive = true;
    }
  },

  move: (context, charState: CharacterState, pos) => {
    charState.buttonActive = false;
    Mortal.move(context, charState, pos);
  },

  validSpecial: ({ G, playerID }, charState: CharacterState, fromPos) => {
    const valids = new Set<number>();
    const { opponentID } = G.players[playerID];

    getAdjacentPositions(fromPos).forEach((pos) => {
      const oppositeAdjacentPos = getNextPosition(pos, fromPos);
      if (
        G.spaces[pos].inhabitant?.playerID === opponentID
        && oppositeAdjacentPos !== -1
        && !G.spaces[oppositeAdjacentPos].isDomed
        && !G.spaces[oppositeAdjacentPos].inhabitant
      ) {
        valids.add(pos);
      }
    });

    return valids;
  },

  special: ({ G }, charState, pos) => {
    const workerPos = charState.workers[charState.selectedWorkerNum].pos;
    const { inhabitant } = G.spaces[pos];
    const oppositeAdjacentPos = getNextPosition(pos, workerPos);
    if (inhabitant) {
      Board.free(G, pos);
      Board.place(G, oppositeAdjacentPos, inhabitant.playerID, inhabitant.workerNum);
    }
  },

  getStageAfterSpecial: (context, charState) => 'move',
};
