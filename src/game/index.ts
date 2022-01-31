import { ActivePlayers } from 'boardgame.io/core';
import { Game } from 'boardgame.io';
import { GAME_ID } from '../config';
import { characterList, getCharacter } from './characters';
import { CharacterState } from '../types/CharacterTypes';
import { checkWinByTrap } from './winConditions';
import {
  GameContext, GameState, Player, Space,
} from '../types/GameTypes';
import {
  setChar, ready, cancelReady, place, move, select, build, characterAbility, endTurn,
} from './moves';

export function initCharacter(characterName: string): CharacterState {
  // Get state properties without character functions
  const {
    desc, firstTurnRequired, buttonActive, buttonText, moveUpHeight, workers,
    numWorkersToPlace, selectedWorkerNum, attrs,
  } = getCharacter(characterName);

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
    attrs,
  };
}

function initRandomCharacters(G: GameState) {
  const listOnlyCharacters = characterList.slice(1);
  Object.values(G.players).forEach((player) => {
    if (player.charState.name === 'Random') {
      const nonDuplicateCharacterList = listOnlyCharacters.filter((name) => (
        name !== (G.players[player.opponentID].charState.name)
      ));
      const randomCharName = (
        nonDuplicateCharacterList[Math.floor(Math.random() * (nonDuplicateCharacterList.length))]
      );
      player.charState = initCharacter(randomCharName);
    }
  });
}

function getFirstPlayer(G: GameState): number {
  return (G.players['1'].charState.firstTurnRequired ? 1 : 0);
}

export function updateValids(context: GameContext, charState: CharacterState, stage: string) {
  const { G } = context;
  const character = getCharacter(charState.name);
  let valids: number[] = [];

  // apply opp restrictions
  switch (stage) {
    case 'place':
      valids = character.validPlace(context, charState);
      break;
    case 'select':
      valids = character.validSelect(context, charState);
      break;
    case 'move':
      valids = character.validMove(
        context,
        charState,
        charState.workers[charState.selectedWorkerNum].pos,
      );
      break;
    case 'build':
      valids = character.validBuild(
        context,
        charState,
        charState.workers[charState.selectedWorkerNum].pos,
      );
      break;
    default:
      valids = [];
      break;
  }

  G.valids = [...new Set(valids)];
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
      onEnd: ({ G }) => {
        initRandomCharacters(G);
      },
    },

    placeWorkers: {
      next: 'main',
      onBegin: (context) => {
        const contextWithPlayerID = getContextWithPlayerID(context);
        const { G } = contextWithPlayerID;

        Object.values(G.players).forEach((player) => {
          const character = getCharacter(player.charState.name);
          character.initialize?.(contextWithPlayerID, player.charState);
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
          const { G, playerID } = contextWithPlayerID;
          const { charState } = G.players[playerID];

          updateValids(contextWithPlayerID, charState, 'place');
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
          select: { moves: { select, characterAbility } },
          move: { moves: { move, characterAbility } },
          build: { moves: { build, characterAbility } },
          end: { moves: { endTurn } },
        },
        onBegin: (context) => {
          const contextWithPlayerID = getContextWithPlayerID(context);
          const { G, playerID } = contextWithPlayerID;
          const { charState } = G.players[playerID];

          const character = getCharacter(charState.name);
          updateValids(contextWithPlayerID, charState, 'select');
          character.onTurnBegin?.(contextWithPlayerID, charState);
        },
        onEnd: (context) => {
          const contextWithPlayerID = getContextWithPlayerID(context);
          const { G, playerID } = contextWithPlayerID;
          const { charState } = G.players[playerID];

          const character = getCharacter(charState.name);
          character.onTurnEnd?.(contextWithPlayerID, charState);

          charState.selectedWorkerNum = -1;

          checkWinByTrap(contextWithPlayerID);
        },
      },
    },
  },
};
