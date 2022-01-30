import { ActivePlayers } from 'boardgame.io/core';
import { Ctx, Game } from 'boardgame.io';
import { GAME_ID } from '../config';
import { characterList, getCharacter } from './characters';
import { Character, CharacterState } from '../types/CharacterTypes';
import { checkWinByTrap } from './winConditions';
import {
  GameState, Player, PlayerIDs, Space,
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

export function updateValids(G: GameState, ctx: Ctx, player: Player, stage: string) {
  const currChar = player.char;
  const char: Character = getCharacter(currChar.name);
  let valids: number[] = [];

  // apply opp restrictions
  switch (stage) {
    case 'place':
      valids = char.validPlace(G, ctx, player, currChar);
      break;
    case 'select':
      valids = char.validSelect(G, ctx, player, currChar);
      break;
    case 'move':
      valids = char.validMove(
        G,
        ctx,
        player,
        currChar,
        currChar.workers[currChar.selectedWorkerNum].pos,
      );
      break;
    case 'build':
      valids = char.validBuild(
        G,
        ctx,
        player,
        currChar,
        currChar.workers[currChar.selectedWorkerNum].pos,
      );
      break;
    default:
      valids = [];
      break;
  }

  G.valids = [...new Set(valids)];
}

export const SantoriniGame: Game<GameState> = {
  name: GAME_ID,
  minPlayers: 2,
  maxPlayers: 2,

  setup: ({ ctx }) => {
    const players: Record<PlayerIDs, Player> = {} as Record<PlayerIDs, Player>;
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
      onBegin: ({ G, ctx }) => {
        Object.values(G.players).forEach((player) => {
          const char = getCharacter(player.char.name);
          char.initialize?.(G, ctx, player, player.char);
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
        onBegin: ({ G, ctx }) => {
          updateValids(G, ctx, G.players[ctx.currentPlayer], 'place');
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
        onBegin: ({ G, ctx }) => {
          const currPlayer = G.players[ctx.currentPlayer];
          const char: any = getCharacter(currPlayer.char.name);
          updateValids(G, ctx, currPlayer, 'select');
          char.onTurnBegin?.(G, ctx, currPlayer, currPlayer.char);
        },
        onEnd: ({ G, ctx, events }) => {
          const currPlayer = G.players[ctx.currentPlayer];
          const char: any = getCharacter(currPlayer.char.name);
          char.onTurnEnd?.(G, ctx, currPlayer, currPlayer.char);

          G.players[ctx.currentPlayer].char.selectedWorkerNum = -1;

          checkWinByTrap(G, ctx, events);
        },
      },
    },
  },
};
