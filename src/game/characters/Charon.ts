import { getAdjacentPositions, getNextPosition } from '../posUtil';
import { Board } from '../boardUtil';
import { Mortal } from './Mortal';
import { Character, CharacterState } from '../../types/characterTypes';

export const Charon: Character = {
  ...Mortal,

  data: {
    ...Mortal.data,
    desc: [
      `Your Move: Before your Worker moves, you may force a neighboring 
      opponent Worker to the space directly on the other side of your
      Worker, if that space is unoccupied.`,
    ],
    pack: 'advanced',
    buttonText: 'Move Opponent',
  },

  buttonPressed: (context, charState: CharacterState) => {
    charState.buttonActive = false;
    return 'special';
  },

  select: (context, charState: CharacterState, pos) => {
    Mortal.select(context, charState, pos);
    if (
      Charon.validSpecial(
        context,
        charState,
        charState.workers[charState.selectedWorkerNum].pos,
      ).size > 0
    ) {
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
        G.spaces[pos].inhabitant?.playerID === opponentID &&
        oppositeAdjacentPos !== -1 &&
        !Board.isObstructed(G, opponentID, oppositeAdjacentPos)
      ) {
        valids.add(pos);
      }
    });

    return valids;
  },

  special: (context, charState, pos) => {
    const { G } = context;
    const workerPos = charState.workers[charState.selectedWorkerNum].pos;
    const { inhabitant } = G.spaces[pos];
    const oppositeAdjacentPos = getNextPosition(pos, workerPos);
    if (inhabitant) {
      Board.free(context, pos);
      Board.place(
        context,
        oppositeAdjacentPos,
        inhabitant.playerID,
        inhabitant.workerNum,
      );
    }
  },

  getStageAfterSpecial: (context, charState) => 'move',
};
