import { ActivePlayers } from 'boardgame.io/core';
import { Ctx, Game } from 'boardgame.io';
import { GAME_ID } from '../config';
import {
  chooseRandomCharacters,
  getCharacter,
  initCharState,
} from './util/characterUtil';
import { GameContext, GameState, Player, Space } from '../types/gameTypes';
import { canReachEndStage, updateValids } from './validity';
import { deepClone } from '../util';
import { getContextWithPlayerID } from './util/gameUtil';
import {
  setChar,
  ready,
  place,
  move,
  select,
  build,
  special,
  setup,
  onButtonPressed,
  endTurn,
} from './moves';

const getFirstPlayer = (G: GameState): number => {
  if (
    G.players['0'].charState.turnOrder === 1 ||
    G.players['1'].charState.turnOrder === 0
  ) {
    return 1;
  }

  return 0;
};

const TURN_ORDER_ONCE = {
  first: ({ G }: Omit<GameContext, 'playerID'>) => getFirstPlayer(G),
  next: ({ G, ctx }: Omit<GameContext, 'playerID'>) => {
    if (getFirstPlayer(G) === ctx.playOrderPos) {
      return (ctx.playOrderPos + 1) % ctx.numPlayers;
    }
    return undefined;
  },
};

const TURN_ORDER_DEFAULT = {
  first: ({ G }: Omit<GameContext, 'playerID'>) => getFirstPlayer(G),
  next: ({ ctx }: Omit<GameContext, 'playerID'>) =>
    (ctx.playOrderPos + 1) % ctx.numPlayers,
};

const stripSecrets = (
  G: GameState,
  ctx: Ctx,
  playerID: string | null,
): GameState => {
  if (ctx.gameover) {
    return G;
  }

  const strippedState = deepClone(G);

  Object.values(strippedState.players).forEach((player) => {
    if (player.charState.hasSecretWorkers && player.ID !== playerID) {
      player.charState.workers.forEach((worker) => {
        strippedState.spaces[worker.pos].inhabitant = undefined;
      });
      player.charState.workers = [];
      player.charState.attrs = {};
    }
  });

  strippedState.spaces.forEach((space) => {
    const { tokens } = space;
    for (let i = tokens.length - 1; i >= 0; i--) {
      if (tokens[i].isSecret && tokens[i].playerID !== playerID) {
        tokens.splice(i, 1);
      }
    }
  });

  return strippedState;
};

const initPlayers = (ctx: Ctx): Record<string, Player> => {
  const players: Record<string, Player> = {} as Record<string, Player>;
  for (let i = 0; i < ctx.numPlayers; i++) {
    players[i] = {
      ID: i.toString(),
      opponentID: ((i + 1) % ctx.numPlayers).toString(),
      ready: false,
      charState: initCharState('Random'),
    };
  }
  return players;
};

const initBoard = (): Space[] => {
  const spaces: Space[] = [];
  for (let i = 0; i < 25; i++) {
    spaces.push({
      pos: i,
      height: 0,
      inhabitant: undefined,
      isDomed: false,
      tokens: [],
    });
  }
  return spaces;
};

export const SantoriniGame: Game<GameState> = {
  name: GAME_ID,
  minPlayers: 2,
  maxPlayers: 2,

  setup: ({ ctx }) => ({
    players: initPlayers(ctx),
    spaces: initBoard(),
    valids: [],
    offBoardTokens: [],
    isDummy: false,
  }),

  playerView: ({ G, ctx, playerID }) => stripSecrets(G, ctx, playerID),

  phases: {
    selectCharacters: {
      start: true,
      next: 'beforeBoardSetup',
      turn: {
        activePlayers: ActivePlayers.ALL,
      },
      moves: {
        setChar,
        ready,
      },
      endIf: ({ G }) =>
        Object.values(G.players).every((player) => player.ready),
      onEnd: (context) => {
        const { G, random } = context;
        chooseRandomCharacters(G, random);
        Object.values(G.players).forEach((player) => {
          const character = getCharacter(player.charState);
          character.initialize(
            { ...context, playerID: player.ID },
            player.charState,
          );
        });
      },
    },

    beforeBoardSetup: {
      next: 'boardSetup',
      turn: {
        activePlayers: { currentPlayer: 'setup' },
        order: TURN_ORDER_ONCE,
        stages: {
          setup: { moves: { setup } },
          end: { moves: { endTurn } },
        },
        onBegin: (context) => {
          const { G, ctx, events } = context;
          if (!G.players[ctx.playOrderPos].charState.hasBeforeBoardSetup) {
            events.endTurn();
          } else {
            const contextWithPlayerID = getContextWithPlayerID(context);
            updateValids(contextWithPlayerID, 'setup');
          }
        },
      },
    },

    boardSetup: {
      next: 'afterBoardSetup',
      turn: {
        activePlayers: { currentPlayer: 'place' },
        order: TURN_ORDER_ONCE,
        stages: {
          place: { moves: { place } },
          end: { moves: { endTurn } },
        },
        onBegin: (context) => {
          const contextWithPlayerID = getContextWithPlayerID(context);
          updateValids(contextWithPlayerID, 'place');
        },
      },
    },

    afterBoardSetup: {
      next: 'main',
      turn: {
        activePlayers: { currentPlayer: 'setup' },
        order: TURN_ORDER_ONCE,
        stages: {
          setup: { moves: { setup } },
          end: { moves: { endTurn } },
        },
        onBegin: (context) => {
          const { G, ctx, events } = context;
          if (!G.players[ctx.playOrderPos].charState.hasAfterBoardSetup) {
            events.endTurn();
          } else {
            const contextWithPlayerID = getContextWithPlayerID(context);
            updateValids(contextWithPlayerID, 'setup');
          }
        },
      },
    },

    main: {
      turn: {
        activePlayers: { currentPlayer: 'select' },
        order: TURN_ORDER_DEFAULT,
        stages: {
          select: { moves: { select, onButtonPressed } },
          move: { moves: { move, onButtonPressed } },
          build: { moves: { build, onButtonPressed } },
          special: { moves: { special, onButtonPressed } },
          end: { moves: { endTurn } },
        },
        onBegin: (context) => {
          const contextWithPlayerID = getContextWithPlayerID(context);
          const { G, playerID, events } = contextWithPlayerID;
          const { charState } = G.players[playerID];
          const character = getCharacter(charState);

          character.onTurnBegin(contextWithPlayerID, charState);

          updateValids(contextWithPlayerID, 'select');

          // If there are no valid moves for the current player
          if (G.valids.length === 0) {
            // First check if there is a possible route to the end
            // stage through the buttonPressed move event
            if (
              !(
                charState.buttonActive &&
                canReachEndStage(contextWithPlayerID, 'buttonPress', -1)
              )
            ) {
              // If not, that player loses
              events.endGame({
                winner: G.players[playerID].opponentID,
              });
            }
          }
        },
        onEnd: (context) => {
          const contextWithPlayerID = getContextWithPlayerID(context);
          const { G, playerID } = contextWithPlayerID;
          const { charState } = G.players[playerID];

          const character = getCharacter(charState);
          character.onTurnEnd(contextWithPlayerID, charState);

          charState.selectedWorkerNum = -1;
        },
      },
    },
  },
};
