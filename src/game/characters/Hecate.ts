import { GameContext, GameState, Space } from '../../types/GameTypes';
import { Mortal } from './Mortal';
import { Character, CharacterState, Worker } from '../../types/CharacterTypes';
import { getCharacter } from '.';
import { tryEndTurn } from '../gameUtil';

type HecateAttrs = {
  workers: Worker[];
  oppWorkers: Worker[];
  oppAttrs: Record<string, unknown>;
  spaces: Space[];
};

const restore = (G: GameState, playerID: string, restoreState: HecateAttrs) => {
  const { opponentID } = G.players[playerID];
  G.players[playerID].charState.workers = restoreState.oppWorkers;
  G.players[playerID].charState.attrs = restoreState.oppAttrs;
  G.players[opponentID].charState.workers = restoreState.workers;
  G.spaces = restoreState.spaces;
};

const illegalState = (
  { G }: GameContext,
  charState: CharacterState,
  oppCharState: CharacterState,
): boolean => {
  const workerPositions = charState.workers.map(({ pos }) => pos);
  const oppWorkerPositions = oppCharState.workers.map(({ pos }) => pos);

  return (
    // An opponent worker is in the same position as Hecate's worker
    workerPositions.filter((positions) =>
      oppWorkerPositions.includes(positions),
    ).length > 0 ||
    // Two of Hecate's workers are on the same space
    new Set(workerPositions).size !== workerPositions.length ||
    // Illegal build was made on one of Hecate's workers
    !charState.workers.every(
      (worker) =>
        !G.spaces[worker.pos].isDomed &&
        G.spaces[worker.pos].height === worker.height,
    )
  );
};

export const Hecate: Character<HecateAttrs> = {
  ...Mortal,

  data: {
    ...Mortal.data,
    desc: [
      `Setup: Secretly place your Worker Tokens on the Map to represent the 
        location of your Workers on the game board. Place your Workers last.`,
      `Your Turn: Move a Worker Token on the Map as if it were on the game 
        board. Build on the game board, as normal.`,
      `Any Time: If an opponent attempts an action that would not be legal 
        due to the presence of your secret Workers, their action is cancelled
        and they lose the rest of their turn. When possible, use their power 
        on their behalf to make their turns legal without informing them`,
    ],
    pack: 'gf',
    turnOrder: 1,
    secretWorkers: true,
    attrs: {
      workers: [],
      oppWorkers: [],
      oppAttrs: {},
      spaces: [],
    },
  },

  restrictOpponentMove: (context, charState, oppCharState, fromPos) => {
    // strip inhabitant data, then put it back after calc
    const { G, playerID } = context;
    const { opponentID } = G.players[playerID]; // refers to Hecate...

    charState.attrs = {
      workers: charState.workers,
      oppWorkers: oppCharState.workers,
      oppAttrs: oppCharState.attrs,
      spaces: G.spaces,
    };

    charState.workers.forEach((worker) => {
      G.spaces[worker.pos].inhabitant = undefined;
    });
    const oppCharacter = getCharacter(oppCharState);
    const valids = oppCharacter.validMove(context, oppCharState, fromPos);
    charState.workers.forEach((worker, index) => {
      G.spaces[worker.pos].inhabitant = {
        playerID: opponentID,
        workerNum: index,
      };
    });

    return valids;
  },

  restrictOpponentBuild: (context, charState, oppCharState, fromPos) => {
    // strip inhabitant data, then put it back after calc
    const { G, playerID } = context;
    const { opponentID } = G.players[playerID]; // refers to Hecate...

    charState.attrs = {
      workers: charState.workers,
      oppWorkers: oppCharState.workers,
      oppAttrs: oppCharState.attrs,
      spaces: G.spaces,
    };

    charState.workers.forEach((worker) => {
      G.spaces[worker.pos].inhabitant = undefined;
    });
    const oppCharacter = getCharacter(oppCharState);
    const valids = oppCharacter.validBuild(context, oppCharState, fromPos);
    charState.workers.forEach((worker, index) => {
      G.spaces[worker.pos].inhabitant = {
        playerID: opponentID,
        workerNum: index,
      };
    });

    return valids;
  },

  restrictOpponentSpecial: (context, charState, oppCharState, fromPos) => {
    // strip inhabitant data, then put it back after calc
    const { G, playerID } = context;
    const { opponentID } = G.players[playerID]; // refers to Hecate...

    charState.attrs = {
      workers: charState.workers,
      oppWorkers: oppCharState.workers,
      oppAttrs: oppCharState.attrs,
      spaces: G.spaces,
    };

    charState.workers.forEach((worker) => {
      G.spaces[worker.pos].inhabitant = undefined;
    });
    const oppCharacter = getCharacter(oppCharState);
    const valids = oppCharacter.validSpecial(context, oppCharState, fromPos);
    charState.workers.forEach((worker, index) => {
      G.spaces[worker.pos].inhabitant = {
        playerID: opponentID,
        workerNum: index,
      };
    });

    return valids;
  },

  afterOpponentMove: (context, charState, oppCharState, movedFromPos) => {
    if (illegalState(context, charState, oppCharState)) {
      if (!context.G.isDummy) {
        restore(context.G, context.playerID, charState.attrs);
        oppCharState.buttonActive = false;
        tryEndTurn(context);
      }
    }
  },

  afterOpponentBuild: (context, charState, oppCharState, builtPos) => {
    if (illegalState(context, charState, oppCharState)) {
      if (!context.G.isDummy) {
        restore(context.G, context.playerID, charState.attrs);
        oppCharState.buttonActive = false;
        tryEndTurn(context);
      }
    }
  },

  afterOpponentSpecial: (context, charState, oppCharState) => {
    if (illegalState(context, charState, oppCharState)) {
      if (!context.G.isDummy) {
        restore(context.G, context.playerID, charState.attrs);
        oppCharState.buttonActive = false;
        tryEndTurn(context);
      }
    }
  },
};
