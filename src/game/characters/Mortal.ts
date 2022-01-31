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

  validPlace: ({ G }, charState) => {
    const valids: number[] = [];
    G.spaces.forEach((space) => {
      if (!space.inhabitant && charState.numWorkersToPlace > 0) {
        valids.push(space.pos);
      }
    });
    return valids;
  },

  validSelect: (context, charState) => {
    const valids: number[] = [];

    charState.workers.forEach((worker) => {
      if (Mortal.validMove(context, charState, worker.pos).length > 0) {
        valids.push(worker.pos);
      }
    });

    return valids;
  },

  select: ({ G }, charState, pos) => {
    const { inhabitant } = G.spaces[pos];

    if (!inhabitant) {
      return 'select';
    }

    charState.selectedWorkerNum = inhabitant.workerNum;
    return 'move';
  },

  validMove: ({ G }, charState, originalPos) => {
    const valids: number[] = [];

    getAdjacentPositions(originalPos).forEach((pos) => {
      if (
        !G.spaces[pos].inhabitant
        && !G.spaces[pos].isDomed
        && G.spaces[pos].height - G.spaces[originalPos].height <= charState.moveUpHeight
      ) {
        valids.push(pos);
      }
    });

    return valids;
  },

  hasValidMoves: (context, charState) => {
    let hasMove = false;
    charState.workers.forEach((worker) => {
      if (Mortal.validMove(context, charState, worker.pos).length > 0) {
        hasMove = true;
      }
    });

    return hasMove;
  },

  move: ({ G, playerID }, charState, pos) => {
    // free the space that is being moved from
    Board.free(G, charState.workers[charState.selectedWorkerNum].pos);

    // place the worker on the selected space
    Board.place(G, pos, playerID, charState.selectedWorkerNum);

    return 'build';
  },

  opponentPostMove: (context, charState, pos) => {

  },

  validBuild: ({ G }, charState, originalPos) => {
    const adjacents: number[] = getAdjacentPositions(originalPos);
    const valids: number[] = [];

    adjacents.forEach((pos) => {
      if (!G.spaces[pos].inhabitant && !G.spaces[pos].isDomed) {
        valids.push(pos);
      }
    });

    return valids;
  },

  hasValidBuild: (context, charState) => {
    let hasBuild = false;

    charState.workers.forEach((worker) => {
      if (Mortal.validBuild(context, charState, worker.pos).length > 0) {
        hasBuild = true;
      }
    });

    return hasBuild;
  },

  build: ({ G }, charState, pos) => {
    Board.build(G, pos);
    return 'end';
  },

  buttonPressed: ({ ctx }, charState: CharacterState) => (
    (ctx.activePlayers && ctx.activePlayers[ctx.currentPlayer]) as GameStage
  ),

  checkWinByMove: (
    G: GameState,
    charState: CharacterState,
    heightBefore: number,
    heightAfter: number,
  ) => heightBefore < 3 && heightAfter === 3,
};
