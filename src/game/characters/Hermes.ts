import { getAdjacentPositions } from '../utility';
import { Character } from '../../types/CharacterTypes';
import { Mortal } from './Mortal';
import { Board } from '../boardUtil';

type HermesAttrs = {
  movedUpOrDown: boolean,
  isMoving: boolean,
  canMoveUp: boolean
};

export const Hermes: Character<HermesAttrs> = {
  ...Mortal,
  desc: [`Your Turn: If your Workers do not move up or down, they may 
    each move any number of times (even zero), and then either builds`],
  pack: 'simple',
  buttonText: 'End Move',

  attrs: {
    movedUpOrDown: false,
    isMoving: false,
    canMoveUp: true,
  },

  onTurnBegin: (context, charState) => {
    charState.buttonActive = true;
  },

  validMove: ({ G, playerID }, charState, originalPos) => {
    const adjacents: number[] = getAdjacentPositions(originalPos);
    const valids = new Set<number>();

    if (charState.attrs.canMoveUp) {
      adjacents.forEach((pos) => {
        if (!Board.isObstructed(G, playerID, pos)
          && G.spaces[pos].height - G.spaces[originalPos].height <= charState.moveUpHeight
        ) {
          valids.add(pos);
        }
      });
    } else {
      adjacents.forEach((pos) => {
        if (!Board.isObstructed(G, playerID, pos)
          && G.spaces[pos].height === G.spaces[originalPos].height
        ) {
          valids.add(pos);
        }
      });
    }

    return valids;
  },

  move: (context, charState, pos) => {
    const { G, playerID } = context;
    if (G.spaces[pos].height === charState.workers[charState.selectedWorkerNum].height) {
      charState.attrs.canMoveUp = false;
      charState.attrs.isMoving = true;
      charState.buttonText = 'Switch Workers';
    } else {
      charState.attrs.movedUpOrDown = true;
      charState.buttonActive = false;
    }

    // free the space that is being moved from
    Board.free(context, charState.workers[charState.selectedWorkerNum].pos);

    // place the worker on the selected space
    Board.place(context, pos, playerID, charState.selectedWorkerNum);
  },

  getStageAfterMove: (context, charState) => {
    if (charState.attrs.isMoving && !charState.attrs.movedUpOrDown) {
      return 'move';
    }

    return 'build';
  },

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

  build: ({ G }, charState, pos) => {
    charState.attrs.isMoving = false;
    charState.attrs.canMoveUp = true;
    charState.attrs.movedUpOrDown = false;

    Board.build(G, pos);
    return 'end';
  },

  buttonPressed: (context, charState) => {
    if (charState.attrs.isMoving) {
      charState.attrs.isMoving = false;
      charState.buttonText = 'End Move';
      // change the selected worker
      if (charState.workers.length > 1) {
        charState.selectedWorkerNum = (charState.selectedWorkerNum + 1) % 2;
      }
    } else {
      charState.buttonActive = false;
      if (charState.selectedWorkerNum === -1) {
        charState.selectedWorkerNum = 0;
      }
      return 'build';
    }

    return Mortal.buttonPressed(context, charState);
  },
};
