import { GameStage, GameState } from '../../types/GameTypes';
import { Character, CharacterState } from '../../types/CharacterTypes';
import { getAdjacentPositions } from '../utility';
import { Board } from '../space';

export const Mortal: Character = {

  workers: [],
  desc: 'No ability',
  buttonText: 'No ability',
  buttonActive: false,
  numWorkersToPlace: 2,
  selectedWorkerNum: -1,
  moveUpHeight: 1,
  attrs: null,

  validPlace: ({ G }, char) => {
    const valids: number[] = [];
    G.spaces.forEach((space) => {
      if (!space.inhabitant && char.numWorkersToPlace > 0) {
        valids.push(space.pos);
      }
    });
    return valids;
  },

  validSelect: (context, char) => {
    const valids: number[] = [];

    char.workers.forEach((worker) => {
      if (Mortal.validMove(context, char, worker.pos).length > 0) {
        valids.push(worker.pos);
      }
    });

    return valids;
  },

  select: ({ G }, char, pos) => {
    const { inhabitant } = G.spaces[pos];

    if (!inhabitant) {
      return 'select';
    }

    char.selectedWorkerNum = inhabitant.workerNum;
    return 'move';
  },

  validMove: ({ G }, char, originalPos) => {
    const valids: number[] = [];

    getAdjacentPositions(originalPos).forEach((pos) => {
      if (
        !G.spaces[pos].inhabitant
        && !G.spaces[pos].isDomed
        && G.spaces[pos].height - G.spaces[originalPos].height <= char.moveUpHeight
      ) {
        valids.push(pos);
      }
    });

    return valids;
  },

  hasValidMoves: (context, char) => {
    let hasMove = false;
    char.workers.forEach((worker) => {
      if (Mortal.validMove(context, char, worker.pos).length > 0) {
        hasMove = true;
      }
    });

    return hasMove;
  },

  move: ({ G, playerID }, char, pos) => {
    // free the space that is being moved from
    Board.free(G, char.workers[char.selectedWorkerNum].pos);

    // place the worker on the selected space
    Board.place(G, pos, playerID, char.selectedWorkerNum);

    return 'build';
  },

  opponentPostMove: (context, char, pos) => {

  },

  validBuild: ({ G }, char, originalPos) => {
    const adjacents: number[] = getAdjacentPositions(originalPos);
    const valids: number[] = [];

    adjacents.forEach((pos) => {
      if (!G.spaces[pos].inhabitant && !G.spaces[pos].isDomed) {
        valids.push(pos);
      }
    });

    return valids;
  },

  hasValidBuild: (context, char) => {
    let hasBuild = false;

    char.workers.forEach((worker) => {
      if (Mortal.validBuild(context, char, worker.pos).length > 0) {
        hasBuild = true;
      }
    });

    return hasBuild;
  },

  build: ({ G }, char, pos) => {
    Board.build(G, pos);
    return 'end';
  },

  buttonPressed: ({ ctx }, char: CharacterState) => (
    (ctx.activePlayers && ctx.activePlayers[ctx.currentPlayer]) as GameStage
  ),

  checkWinByMove: (
    G: GameState,
    char: CharacterState,
    heightBefore: number,
    heightAfter: number,
  ) => heightBefore < 3 && heightAfter === 3,
};
