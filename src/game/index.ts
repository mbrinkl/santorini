import { ActivePlayers } from 'boardgame.io/core';
import { Game } from 'boardgame.io';
import { GAME_ID } from '../config';
import { characterList, getCharacter } from './characters';
import { Character, CharacterState } from '../types/CharacterTypes';
import { checkWinByTrap } from './winConditions';
import {
  GameContext, GameState, Player, Space,
} from '../types/GameTypes';
import {
  setChar, ready, cancelReady, place, move, select, build, characterAbility, endTurn,
} from './moves';

export function initCharacter(characterName: string): CharacterState {
  const character: Character = getCharacter(characterName);

  const {
    desc, buttonActive, buttonText, moveUpHeight, workers,
    numWorkersToPlace, selectedWorkerNum, attrs,
  } = character;

  return {
    name: characterName,
    desc,
    buttonActive,
    buttonText,
    moveUpHeight,
    workers,
    numWorkersToPlace,
    selectedWorkerNum,
    attrs,
  };
}

function setRandomCharacters(G: GameState) {
  const listOnlyCharacters = characterList.slice(1);
  Object.values(G.players).forEach((player) => {
    if (player.char.name === 'Random') {
      const nonDuplicateCharacterList = listOnlyCharacters.filter((name) => (
        name !== (G.players[player.opponentId].char.name)
      ));
      const randomCharName = (
        nonDuplicateCharacterList[Math.floor(Math.random() * (nonDuplicateCharacterList.length))]
      );
      player.char = initCharacter(randomCharName);
    }
  });
}

function getFirstPlayer(G: GameState): number {
  let startingPlayer = 0;
  if (G.players['1'].char.name === 'Bia') {
    startingPlayer = 1;
  }
  return startingPlayer;
}

export function updateValids(context: GameContext, charState: CharacterState, stage: string) {
  const { G } = context;
  const char = getCharacter(charState.name);
  let valids: number[] = [];

  // apply opp restrictions
  switch (stage) {
    case 'place':
      valids = char.validPlace(context, charState);
      break;
    case 'select':
      valids = char.validSelect(context, charState);
      break;
    case 'move':
      valids = char.validMove(
        context,
        charState,
        charState.workers[charState.selectedWorkerNum].pos,
      );
      break;
    case 'build':
      valids = char.validBuild(
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

// Uses ctx.currentPlayer as
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
        id: i.toString(),
        opponentId: ((i + 1) % ctx.numPlayers).toString(),
        ready: false,
        char: initCharacter('Random'),
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
        setRandomCharacters(G);
      },
    },

    placeWorkers: {
      next: 'main',
      onBegin: (context) => {
        const contextWithPlayerID = getContextWithPlayerID(context);
        const { G } = contextWithPlayerID;

        Object.values(G.players).forEach((player) => {
          const char = getCharacter(player.char.name);
          char.initialize?.(contextWithPlayerID, player.char);
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
          const charState = G.players[playerID].char;

          updateValids(contextWithPlayerID, charState, 'place');
        },
        onEnd: ({ G, ctx, events }) => {
          if (
            G.players['0'].char.numWorkersToPlace === 0
            && G.players['1'].char.numWorkersToPlace === 0
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
          const charState = G.players[playerID].char;

          const char = getCharacter(charState.name);
          updateValids(contextWithPlayerID, charState, 'select');
          char.onTurnBegin?.(contextWithPlayerID, charState);
        },
        onEnd: (context) => {
          const contextWithPlayerID = getContextWithPlayerID(context);
          const { G, ctx, playerID } = contextWithPlayerID;
          const charState = G.players[playerID].char;

          const char = getCharacter(charState.name);
          char.onTurnEnd?.(contextWithPlayerID, charState);

          G.players[ctx.currentPlayer].char.selectedWorkerNum = -1;

          checkWinByTrap(contextWithPlayerID);
        },
      },
    },
  },
};
