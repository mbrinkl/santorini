import { GameStage } from '../../types/GameTypes';
import { Character, Worker } from '../../types/CharacterTypes';
import { getAdjacentPositions } from '../utility';
import { Board } from '../boardUtil';

export const Mortal: Character = {

  workers: [],
  desc: ['No ability'],
  pack: 'none',
  buttonText: 'No ability',
  buttonActive: false,
  numWorkersToPlace: 2,
  hasBeforeBoardSetup: false,
  hasAfterBoardSetup: false,
  selectedWorkerNum: -1,
  secretWorkers: false,
  moveUpHeight: 1,
  powerBlocked: false,
  attrs: null,

  initialize: (context, charState) => {},

  onTurnBegin: (context, charState) => {},

  onTurnEnd: (context, charState) => {},

  validSetup: (context, charState) => new Set<number>(),
  setup: (context, charState, pos) => 'end',

  validPlace: ({ G, playerID }, charState) => {
    const valids = new Set<number>();

    G.spaces.forEach((space) => {
      if (!Board.isObstructed(G, playerID, space.pos)) {
        valids.add(space.pos);
      }
    });

    return valids;
  },

  place: (context, charState, pos) => {
    const { G, playerID } = context;

    const worker: Worker = {
      pos,
      height: G.spaces[pos].height,
    };

    charState.workers.push(worker);
    Board.place(context, pos, playerID, charState.workers.length - 1);

    charState.numWorkersToPlace -= 1;

    return charState.numWorkersToPlace === 0 ? 'end' : 'place';
  },

  validSelect: (context, charState) => {
    const valids = new Set<number>();

    charState.workers.forEach((worker) => {
      valids.add(worker.pos);
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

  validMove: ({ G, playerID }, charState, fromPos) => {
    const valids = new Set<number>();

    getAdjacentPositions(fromPos).forEach((pos) => {
      if (
        !Board.isObstructed(G, playerID, pos)
        && G.spaces[pos].height - G.spaces[fromPos].height <= charState.moveUpHeight
      ) {
        valids.add(pos);
      }
    });

    return valids;
  },

  restrictOpponentMove: ({ G }, charState, oppCharState, fromPos) => new Set(G.valids),

  move: (context, charState, pos) => {
    Board.free(context, charState.workers[charState.selectedWorkerNum].pos);
    Board.place(context, pos, context.playerID, charState.selectedWorkerNum);
  },

  afterOpponentMove: (context, charState, oppCharState, pos) => {},

  getStageAfterMove: (context, charState) => 'build',

  validBuild: ({ G, playerID }, charState, fromPos) => {
    const valids = new Set<number>();

    getAdjacentPositions(fromPos).forEach((pos) => {
      if (!Board.isObstructed(G, playerID, pos)) {
        valids.add(pos);
      }
    });

    return valids;
  },

  restrictOpponentBuild: ({ G }, charState, oppCharState, fromPos) => new Set(G.valids),

  build: ({ G }, charState, pos) => {
    Board.build(G, pos);
  },

  afterOpponentBuild: (context, charState, oppCharState, builtPos) => {},

  getStageAfterBuild: (context, charState) => 'end',

  validSpecial: (context, charState, fromPos) => new Set<number>(),
  restrictOpponentSpecial: ({ G }, charState, oppCharState, fromPos) => new Set(G.valids),
  special: (context, charState, pos) => {},
  afterOpponentSpecial: () => {},
  getStageAfterSpecial: (context, charStates) => 'end',

  buttonPressed: ({ ctx }, charState) => (
    (ctx.activePlayers && ctx.activePlayers[ctx.currentPlayer]) as GameStage
  ),

  tokenEffects: (context, charState, pos) => {},

  restrictOpponentWin: (context, charState, posBefore, posAfter) => false,

  checkWinByMove: ({ G }, charState, posBefore, posAfter) => (
    G.spaces[posBefore].height < 3 && G.spaces[posAfter].height === 3
  ),
};
