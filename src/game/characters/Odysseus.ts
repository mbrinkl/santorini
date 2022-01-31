import { getAdjacentPositions } from '../utility';
import { Character, CharacterState } from '../../types/CharacterTypes';
import { Mortal } from './Mortal';
import { GameContext } from '../../types/GameTypes';
import { Board } from '../space';

interface OdysseusAttrs {
  specialActive: boolean,
  specialUsed: boolean,
  movingOpponent: boolean,
  workerToMovePos: number
}

const checkForValidSpecial = (
  context: GameContext,
  charState: CharacterState<OdysseusAttrs>,
) => {
  charState.attrs.specialActive = true;
  let returnValue = false;

  if (charState.selectedWorkerNum !== -1) {
    const worker = charState.workers[charState.selectedWorkerNum];
    if (Odysseus.validMove(context, charState, worker.pos).length > 0) {
      returnValue = true;
    }
  } else {
    charState.workers.forEach((worker) => {
      if (Odysseus.validMove(context, charState, worker.pos).length > 0) {
        returnValue = true;
      }
    });
  }

  charState.attrs.specialActive = false;
  return returnValue;
};

export const Odysseus: Character<OdysseusAttrs> = {
  ...Mortal,
  desc: `Start of Your Turn: Once, force to unoccupied corner spaces any 
    number of opponent Workers that neighbor your Workers.`,
  buttonText: 'Move Opponent',
  attrs: {
    specialActive: false,
    specialUsed: false,
    movingOpponent: false,
    workerToMovePos: -1,
  },

  onTurnBegin: (context, charState: CharacterState<OdysseusAttrs>) => {
    if (!charState.attrs.specialUsed) {
      charState.buttonActive = checkForValidSpecial(context, charState);
    }
  },

  buttonPressed: (context, charState: CharacterState<OdysseusAttrs>) => {
    charState.attrs.specialActive = !charState.attrs.specialActive;

    if (charState.attrs.specialUsed) {
      charState.buttonActive = false;
      charState.attrs.specialActive = false;
      charState.buttonText = 'Move Opponent';
    } else if (charState.attrs.specialActive) {
      charState.buttonText = 'Cancel';
    } else {
      charState.buttonText = 'Move Opponent';
    }

    return Mortal.buttonPressed(context, charState);
  },

  validMove(context, charState: CharacterState<OdysseusAttrs>, originalPos): number[] {
    const { G, playerID } = context;
    const { opponentID } = G.players[playerID];
    const valids: number[] = [];

    if (charState.attrs.specialActive) {
      let adjacents: number[] = [];
      charState.workers.forEach((worker) => {
        adjacents = adjacents.concat(getAdjacentPositions(worker.pos));
      });
      if (!charState.attrs.movingOpponent) {
        G.players[opponentID].charState.workers.forEach((worker) => {
          if (adjacents.includes(worker.pos)) {
            valids.push(worker.pos);
          }
        });
      } else {
        [0, 4, 20, 24].forEach((pos) => { // corner positions
          if (!G.spaces[pos].isDomed && !G.spaces[pos].inhabitant) {
            valids.push(pos);
          }
        });
      }

      return valids;
    }

    return Mortal.validMove(context, charState, originalPos);
  },

  move: (context, charState: CharacterState<OdysseusAttrs>, pos) => {
    const { G, playerID } = context;
    const { opponentID } = G.players[playerID];

    if (charState.attrs.specialActive) {
      charState.attrs.specialUsed = true;
      charState.buttonText = 'End Ability';

      if (!charState.attrs.movingOpponent) {
        charState.attrs.movingOpponent = true;
        charState.attrs.workerToMovePos = pos;
        return 'move';
      }

      charState.attrs.movingOpponent = false;
      const { inhabitant } = G.spaces[charState.attrs.workerToMovePos];
      if (inhabitant) {
        const oppWorkerNum = inhabitant.workerNum;
        Board.free(G, charState.attrs.workerToMovePos);
        Board.place(G, pos, opponentID, oppWorkerNum);
      }

      if (!checkForValidSpecial(context, charState)) {
        charState.attrs.specialActive = false;
        charState.buttonText = 'Move Opponent';
        charState.buttonActive = false;
      } else {
        charState.attrs.specialActive = true;
      }

      return 'move';
    }

    charState.buttonActive = false;
    charState.attrs.specialActive = false;
    return Mortal.move(context, charState, pos);
  },
};
