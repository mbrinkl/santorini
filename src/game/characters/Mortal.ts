import { GameStage } from '../../types/GameTypes';
import { Character } from '../../types/CharacterTypes';
import { getAdjacentPositions } from '../utility';
import { Board } from '../space';

export const Mortal: Character = {

  workers: [],
  desc: 'No ability',
  firstTurnRequired: false,
  buttonText: 'No ability',
  buttonActive: false,
  numWorkersToPlace: 2,
  selectedWorkerNum: -1,
  moveUpHeight: 1,
  powerBlocked: false,
  attrs: null,

  initialize: (context, charState) => {},

  onTurnBegin: (context, charState) => {},

  onTurnEnd: (context, charState) => {},

  validPlace: ({ G }, charState) => {
    const valids = new Set<number>();

    G.spaces.forEach((space) => {
      if (!space.inhabitant && charState.numWorkersToPlace > 0) {
        valids.add(space.pos);
      }
    });

    return valids;
  },

  validSelect: (context, charState) => {
    const valids = new Set<number>();

    charState.workers.forEach((worker) => {
      if (Mortal.validMove(context, charState, worker.pos).size > 0) {
        valids.add(worker.pos);
      }
    });

    return valids;
  },

  select: ({ G }, charState, pos) => {
    const { inhabitant } = G.spaces[pos];

    if (inhabitant) {
      charState.selectedWorkerNum = inhabitant.workerNum;
    }
  },

  getStageAfterSelect: (context, charState) => {
    if (charState.selectedWorkerNum === -1) {
      return 'select';
    }

    return 'move';
  },

  validMove: ({ G }, charState, fromPos) => {
    const valids = new Set<number>();

    getAdjacentPositions(fromPos).forEach((pos) => {
      if (
        !G.spaces[pos].inhabitant
        && !G.spaces[pos].isDomed
        && G.spaces[pos].height - G.spaces[fromPos].height <= charState.moveUpHeight
      ) {
        valids.add(pos);
      }
    });

    return valids;
  },

  restrictOpponentMove: ({ G }, charState, oppCharState, fromPos) => new Set(G.valids),

  hasValidMoves: (context, charState) => {
    let hasMove = false;
    charState.workers.forEach((worker) => {
      if (Mortal.validMove(context, charState, worker.pos).size > 0) {
        hasMove = true;
      }
    });

    return hasMove;
  },

  move: ({ G, playerID }, charState, pos) => {
    Board.free(G, charState.workers[charState.selectedWorkerNum].pos);
    Board.place(G, pos, playerID, charState.selectedWorkerNum);
  },

  afterOpponentMove: (context, charState, oppCharState, pos) => {},

  getStageAfterMove: (context, charState) => 'build',

  validBuild: ({ G }, charState, fromPos) => {
    const valids = new Set<number>();

    getAdjacentPositions(fromPos).forEach((pos) => {
      if (!G.spaces[pos].inhabitant && !G.spaces[pos].isDomed) {
        valids.add(pos);
      }
    });

    return valids;
  },

  restrictOpponentBuild: ({ G }, charState, oppCharState, fromPos) => new Set(G.valids),

  hasValidBuild: (context, charState) => {
    let hasBuild = false;

    charState.workers.forEach((worker) => {
      if (Mortal.validBuild(context, charState, worker.pos).size > 0) {
        hasBuild = true;
      }
    });

    return hasBuild;
  },

  build: ({ G }, charState, pos) => {
    Board.build(G, pos);
  },

  afterOpponentBuild: (context, charState, oppCharState, builtPos) => {},

  getStageAfterBuild: (context, charState) => 'end',

  validSpecial: (context, charState, fromPos) => new Set<number>(),
  special: (context, charState, pos) => {},
  getStageAfterSpecial: (context, charStates) => 'end',

  buttonPressed: ({ ctx }, charState) => (
    (ctx.activePlayers && ctx.activePlayers[ctx.currentPlayer]) as GameStage
  ),

  restrictOpponentWin: (context, charState, posBefore, posAfter) => false,

  checkWinByMove: ({ G }, charState, posBefore, posAfter) => (
    G.spaces[posBefore].height < 3 && G.spaces[posAfter].height === 3
  ),
};
