import { getAdjacentPositions } from '../utility';
import { Character, CharacterState } from '../../types/CharacterTypes';
import { Mortal } from './Mortal';
import { GameStage } from '../../types/GameTypes';
import { Board } from '../space';

interface HermesAttrs {
  movedUpOrDown: boolean,
  isMoving: boolean,
  canMoveUp: boolean
}

export const Hermes: Character<HermesAttrs> = {
  ...Mortal,
  desc: `Your Turn: If your Workers do not move up or down, they may 
    each move any number of times (even zero), and then either builds`,
  buttonText: 'End Move',

  attrs: {
    movedUpOrDown: false,
    isMoving: false,
    canMoveUp: true,
  },

  onTurnBegin: (context, char: CharacterState<HermesAttrs>) => {
    char.buttonActive = true;
  },

  validMove: ({ G }, char: CharacterState<HermesAttrs>, originalPos) => {
    const adjacents: number[] = getAdjacentPositions(originalPos);
    const valids: number[] = [];

    if (char.attrs.canMoveUp) {
      adjacents.forEach((pos) => {
        if (!G.spaces[pos].inhabitant && !G.spaces[pos].isDomed
          && G.spaces[pos].height - G.spaces[originalPos].height <= char.moveUpHeight
        ) {
          valids.push(pos);
        }
      });
    } else {
      adjacents.forEach((pos) => {
        if (!G.spaces[pos].inhabitant && !G.spaces[pos].isDomed
          && G.spaces[pos].height === G.spaces[originalPos].height
        ) {
          valids.push(pos);
        }
      });
    }

    return valids;
  },

  move: ({ G, playerID }, char: CharacterState<HermesAttrs>, pos) => {
    let returnStage: GameStage = 'build';

    if (G.spaces[pos].height === char.workers[char.selectedWorkerNum].height) {
      char.attrs.canMoveUp = false;
      char.attrs.isMoving = true;
      char.buttonText = 'Switch Workers';
      returnStage = 'move';
    } else {
      char.attrs.movedUpOrDown = true;
      char.buttonActive = false;
    }

    // free the space that is being moved from
    Board.free(G, char.workers[char.selectedWorkerNum].pos);

    // place the worker on the selected space
    Board.place(G, pos, playerID, char.selectedWorkerNum);

    return returnStage;
  },

  validBuild: ({ G }, char: CharacterState<HermesAttrs>, originalPos) => {
    const valids: number[] = [];
    let adjacents: number[] = [];

    // normal build
    if (char.attrs.movedUpOrDown) {
      adjacents = getAdjacentPositions(originalPos);
    } else {
      // special build, within range of either worker
      for (let i = 0; i < char.workers.length; i++) {
        // add on the adjacent positions of each worker
        adjacents = adjacents.concat(getAdjacentPositions(char.workers[i].pos));
      }
    }

    adjacents.forEach((pos) => {
      if (!G.spaces[pos].inhabitant && !G.spaces[pos].isDomed) {
        valids.push(pos);
      }
    });

    return valids;
  },

  build: ({ G }, char: CharacterState<HermesAttrs>, pos) => {
    char.attrs.isMoving = false;
    char.attrs.canMoveUp = true;
    char.attrs.movedUpOrDown = false;

    Board.build(G, pos);
    return 'end';
  },

  buttonPressed: (context, char: CharacterState<HermesAttrs>) => {
    if (char.attrs.isMoving) {
      char.attrs.isMoving = false;
      char.buttonText = 'End Move';
      // change the selected worker
      if (char.workers.length > 1) char.selectedWorkerNum = (char.selectedWorkerNum + 1) % 2;
    } else {
      char.buttonActive = false;
      if (char.selectedWorkerNum === -1) {
        char.selectedWorkerNum = 0;
      }
      return 'build';
    }

    return Mortal.buttonPressed(context, char);
  },
};
