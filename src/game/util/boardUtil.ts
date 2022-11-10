import { GameContext, GameState, TokenState } from '../../types/gameTypes';
import { tryEndGame } from './gameUtil';
import { getTokenByName } from './tokenUtil';

export const Board = {
  place: (
    context: GameContext,
    pos: number,
    placedPlayerID: string,
    workerNum: number,
  ) => {
    const { G } = context;
    const { charState } = G.players[placedPlayerID];
    charState.workers[workerNum].pos = pos;
    charState.workers[workerNum].height = G.spaces[pos].height;
    G.spaces[pos].inhabitant = {
      playerID: placedPlayerID,
      workerNum,
    };

    // Resolve token effects
    G.spaces[pos].tokens.forEach((tokenState) => {
      const token = getTokenByName(tokenState.tokenName);
      token?.effects?.(context, tokenState, pos);
    });
  },

  free: ({ G }: GameContext, pos: number) => {
    G.spaces[pos].inhabitant = undefined;
  },

  killWorkerAtPos: (context: GameContext, pos: number) => {
    const { G } = context;
    const { inhabitant } = G.spaces[pos];

    if (inhabitant) {
      const { playerID } = inhabitant;
      const { charState } = G.players[playerID];

      charState.workers.splice(inhabitant.workerNum, 1);

      // Check if no workers left and end game if none
      if (charState.workers.length === 0) {
        tryEndGame(context, G.players[playerID].opponentID);
      } else {
        // Otherwise, iterate opponent workers and update worker numbers
        let workerNum = 0;
        G.players[playerID].charState.workers.forEach((worker) => {
          G.spaces[worker.pos].inhabitant = {
            playerID,
            workerNum,
          };
          workerNum += 1;
        });
      }
    }

    Board.free(context, pos);
  },

  isObstructed: (G: GameState, playerID: string, pos: number) => {
    const space = G.spaces[pos];
    const { opponentID } = G.players[playerID];
    const isOpponentSecretlyInhabiting =
      G.players[opponentID].charState.hasSecretWorkers;
    return (
      space.isDomed ||
      (space.inhabitant &&
        (space.inhabitant.playerID === playerID ||
          (space.inhabitant?.playerID === opponentID &&
            !isOpponentSecretlyInhabiting))) ||
      Board.tokenObstructing(G, playerID, pos)
    );
  },

  tokenObstructing: (G: GameState, playerID: string, pos: number) =>
    G.spaces[pos].tokens.some(
      (token) =>
        token.obstructing === 'all' ||
        (token.obstructing === 'opponent' && token.playerID !== playerID),
    ),

  build: ({ spaces }: GameState, pos: number) => {
    const space = spaces[pos];
    if (space.height < 3) {
      space.height += 1;
    } else if (space.height === 3) {
      space.isDomed = true;
    }
  },

  placeToken: (G: GameState, pos: number, token: TokenState) => {
    G.spaces[pos].tokens.push(token);
  },

  removeTokens: (G: GameState, pos: number) => {
    G.spaces[pos].tokens = G.spaces[pos].tokens.filter(
      (token) => !token.isRemovable,
    );
  },
};
