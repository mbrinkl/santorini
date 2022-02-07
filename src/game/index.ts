import { ActivePlayers } from 'boardgame.io/core';
import { Game } from 'boardgame.io';
import { GAME_ID } from '../config';
import { CharacterState } from '../types/CharacterTypes';
import {
  banList, characterList, getCharacter, getCharacterByName,
} from './characters';
import {
  GameContext, GameState, Player, Space,
} from '../types/GameTypes';
import {
  setChar, ready, cancelReady, place, move, select, build, special, onButtonPressed, endTurn,
} from './moves';
import { canReachEndStage, updateValids } from './validity';

export function initCharacter(characterName: string): CharacterState {
  // Get state properties without character functions
  const {
    desc, firstTurnRequired, buttonActive, buttonText, moveUpHeight, workers,
    numWorkersToPlace, selectedWorkerNum, powerBlocked, attrs,
  } = getCharacterByName(characterName);

  return {
    name: characterName,
    desc,
    firstTurnRequired,
    buttonActive,
    buttonText,
    moveUpHeight,
    workers,
    numWorkersToPlace,
    selectedWorkerNum,
    powerBlocked,
    attrs,
  };
}

function initRandomCharacters({ G, random }: GameContext) {
  // Remove 'Random'
  const listOnlyCharacters = characterList.slice(1);

  Object.values(G.players).forEach((player) => {
    if (player.charState.name === 'Random') {
      const opponentCharName = G.players[player.opponentID].charState.name;
      const bannedPairs = banList.filter((ban) => ban.includes(opponentCharName));
      const bannedChars = bannedPairs.flat().filter((charName) => charName !== opponentCharName);
      const possibleChars = listOnlyCharacters.filter((name) => (
        name !== opponentCharName && !bannedChars.includes(name)
      ));
      const randomCharName = random.Shuffle(possibleChars)[0];
      player.charState = initCharacter(randomCharName);
    }
  });
}

function getFirstPlayer(G: GameState): number {
  return (G.players['1'].charState.firstTurnRequired ? 1 : 0);
}

// Uses ctx.currentPlayer as the game context's playerID
function getContextWithPlayerID(context: Omit<GameContext, 'playerID'>): GameContext {
  const { ctx } = context;
  const playerID = ctx.currentPlayer;
  return { ...context, playerID };
}

export const SantoriniGame: Game<GameState> = {
  name: GAME_ID,
  minPlayers: 2,
  maxPlayers: 2,

  setup: ({ ctx }) => {
    const players: Record<string, Player> = {} as Record<string, Player>;
    for (let i = 0; i < ctx.numPlayers; i++) {
      players[i] = ({
        ID: i.toString(),
        opponentID: ((i + 1) % ctx.numPlayers).toString(),
        ready: false,
        charState: initCharacter('Random'),
      });
    }

    const spaces: Space[] = [];
    for (let i = 0; i < 25; i++) {
      spaces.push({
        pos: i,
        height: 0,
        inhabitant: undefined,
        isDomed: false,
      });
    }

    const initialState: GameState = {
      isClone: false,
      players,
      spaces,
      valids: [],
    };

    return initialState;
  },

  phases: {
    selectCharacters: {
      start: true,
      next: 'placeWorkers',
      endIf: ({ G }) => G.players['0'].ready && G.players['1'].ready,
      turn: {
        activePlayers: ActivePlayers.ALL,
      },
      moves: {
        setChar,
        ready,
        cancelReady,
      },
      onEnd: (context) => {
        const contextWithPlayerID = getContextWithPlayerID(context);
        initRandomCharacters(contextWithPlayerID);
      },
    },

    placeWorkers: {
      next: 'main',
      onBegin: (context) => {
        const contextWithPlayerID = getContextWithPlayerID(context);
        const { G } = contextWithPlayerID;

        Object.values(G.players).forEach((player) => {
          const character = getCharacter(player.charState);
          character.initialize(contextWithPlayerID, player.charState);
        });
      },
      turn: {
        activePlayers: { currentPlayer: 'place' },
        order: {
          first: ({ G }) => getFirstPlayer(G),
          next: ({ ctx }) => (ctx.playOrderPos + 1) % ctx.numPlayers,
        },
        stages: {
          place: { moves: { place } },
          end: { moves: { endTurn } },
        },
        onBegin: (context) => {
          const contextWithPlayerID = getContextWithPlayerID(context);
          updateValids(contextWithPlayerID, 'place');
        },
        onEnd: ({ G, ctx, events }) => {
          if (
            G.players['0'].charState.numWorkersToPlace === 0
            && G.players['1'].charState.numWorkersToPlace === 0
          ) {
            events.endPhase();
          }
        },
      },
    },

    main: {
      turn: {
        activePlayers: { currentPlayer: 'select' },
        order: {
          first: ({ G }) => getFirstPlayer(G),
          next: ({ ctx }) => (ctx.playOrderPos + 1) % ctx.numPlayers,
        },
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
            // First check if there is a possible route to the end stage through the
            // buttonPressed move event
            if (!(charState.buttonActive && canReachEndStage(contextWithPlayerID, 'buttonPress', -1))) {
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
