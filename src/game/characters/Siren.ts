import { Board } from '../boardUtil';
import { getAdjacentPositions, getNextPositionInDirection } from '../posUtil';
import { Mortal } from './Mortal';
import { Character } from '../../types/characterTypesTemp';

type SirenAttrs = {
  altTurn: boolean;
  movedWorkers: number[];
};

export const Siren: Character<SirenAttrs> = {
  ...Mortal,

  data: {
    ...Mortal.data,
    desc: [
      `Setup: Place the Arrow Token beside the board and orient it in 
        any of the 8 directions to indicate the direction of the Siren's Song.`,
      `Alternative Turn: Force one or more opponent Workers one space in the
        direction of the Siren's Song to unoccupied spaces at any level; 
        then build with any of your Workers.`,
    ],
    pack: 'gf',
    buttonText: 'Move Opponent',
    hasBeforeBoardSetup: true,
    attrs: {
      altTurn: false,
      movedWorkers: [],
    },
  },

  validSetup: () => new Set([6, 7, 8, 11, 13, 16, 17, 18]),

  setup: ({ G, playerID }, charState, pos) => {
    G.offBoardTokens.push({ playerID, direction: pos });
    return 'end';
  },

  onTurnBegin: (context, charState) => {
    if (Siren.validSpecial(context, charState, -1).size > 0) {
      charState.buttonActive = true;
    }
  },

  onTurnEnd: (context, charState) => {
    charState.buttonActive = false;
    charState.buttonText = 'Move Opponent';
    charState.attrs.altTurn = false;
    charState.attrs.movedWorkers = [];
  },

  buttonPressed: (context, charState) => {
    charState.buttonActive = false;
    if (!charState.attrs.altTurn) {
      charState.attrs.altTurn = true;
      return 'special';
    }

    return 'build';
  },

  select: (context, charState, pos) => {
    charState.buttonActive = false;
    Mortal.select(context, charState, pos);
  },

  validBuild: (context, charState, fromPos) => {
    if (charState.attrs.altTurn) {
      const valids = new Set<number>();

      charState.workers.forEach((worker) => {
        getAdjacentPositions(worker.pos).forEach((pos) => {
          if (!Board.isObstructed(context.G, context.playerID, pos)) {
            valids.add(pos);
          }
        });
      });

      return valids;
    }

    return Mortal.validBuild(context, charState, fromPos);
  },

  validSpecial: ({ G, playerID }, charState, fromPos) => {
    const valids = new Set<number>();
    const { opponentID } = G.players[playerID];
    const token = G.offBoardTokens.find((t) => t.playerID === playerID);

    if (token) {
      G.players[opponentID].charState.workers.forEach((worker) => {
        const nextPos = getNextPositionInDirection(worker.pos, token.direction);
        const { inhabitant } = G.spaces[worker.pos];
        if (
          nextPos !== -1 &&
          !Board.isObstructed(G, playerID, nextPos) &&
          inhabitant &&
          !charState.attrs.movedWorkers.includes(inhabitant.workerNum)
        ) {
          valids.add(worker.pos);
        }
      });
    }

    return valids;
  },

  special: (context, charState, pos) => {
    const { G, playerID } = context;
    const token = G.offBoardTokens.find((t) => t.playerID === playerID);

    const { inhabitant } = G.spaces[pos];
    if (inhabitant && token) {
      Board.free(context, pos);
      Board.place(
        context,
        getNextPositionInDirection(pos, token.direction),
        inhabitant.playerID,
        inhabitant.workerNum,
      );

      charState.attrs.movedWorkers.push(inhabitant.workerNum);
    }
  },

  getStageAfterSpecial: (context, charState) => {
    if (Siren.validSpecial(context, charState, -1).size > 0) {
      charState.buttonActive = true;
      charState.buttonText = 'Stop Ability';
      return 'special';
    }

    charState.buttonActive = false;
    charState.buttonText = 'Move Opponent';
    return 'build';
  },
};
