import { getAdjacentPositions } from '../utility';
import { Character } from '../../types/CharacterTypes';
import { Mortal } from './Mortal';
import { Board } from '../boardUtil';

type HermesAttrs = {
  movedUpOrDown: boolean,
  isMoving: boolean,
  canMoveUpOrDown: boolean
};

export const Hermes: Character<HermesAttrs> = {
  ...Mortal,

  data: {
    ...Mortal.data,

    desc: [`Your Turn: If your Workers do not move up or down, they may 
    each move any number of times (even zero), and then either builds`],
    pack: 'simple',
    buttonText: 'End Move',
    attrs: {
      movedUpOrDown: false,
      isMoving: false,
      canMoveUpOrDown: true,
    },
  },

  onTurnBegin: (context, charState) => {
    charState.buttonActive = true;
  },

  onTurnEnd: (context, charState) => {
    charState.attrs.isMoving = false;
    charState.attrs.movedUpOrDown = false;
    charState.attrs.canMoveUpOrDown = true;
  },

  validMove: (context, charState, fromPos) => {
    const { G } = context;
    const valids = Mortal.validMove(context, charState, fromPos);

    if (!charState.attrs.canMoveUpOrDown) {
      valids.forEach((pos) => {
        if (G.spaces[pos].height !== G.spaces[fromPos].height) {
          valids.delete(pos);
        }
      });
    }

    return valids;
  },

  move: (context, charState, pos) => {
    const { G } = context;
    if (G.spaces[pos].height === charState.workers[charState.selectedWorkerNum].height) {
      charState.attrs.canMoveUpOrDown = false;
      charState.attrs.isMoving = true;
      if (charState.workers.length === 2) {
        charState.buttonText = 'Switch Workers';
      }
    } else {
      charState.attrs.movedUpOrDown = true;
      charState.buttonActive = false;
    }

    Mortal.move(context, charState, pos);
  },

  getStageAfterMove: (context, charState) => (charState.attrs.isMoving ? 'move' : 'build'),

  validBuild: ({ G, playerID }, charState, originalPos) => {
    const valids = new Set<number>();
    let adjacents: number[] = [];

    // normal build
    if (charState.attrs.movedUpOrDown) {
      adjacents = getAdjacentPositions(originalPos);
    } else {
      // special build, within range of either worker
      for (let i = 0; i < charState.workers.length; i++) {
        // add on the adjacent positions of each worker
        adjacents = adjacents.concat(getAdjacentPositions(charState.workers[i].pos));
      }
    }

    adjacents.forEach((pos) => {
      if (!Board.isObstructed(G, playerID, pos)) {
        valids.add(pos);
      }
    });

    return valids;
  },

  buttonPressed: (context, charState) => {
    if (charState.attrs.isMoving && charState.workers.length > 1) {
      charState.attrs.isMoving = false;
      charState.buttonText = 'End Move';
      charState.selectedWorkerNum = (charState.selectedWorkerNum + 1) % 2;
      return 'move';
    }

    charState.buttonActive = false;
    return 'build';
  },
};
