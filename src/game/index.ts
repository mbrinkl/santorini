import { ActivePlayers } from 'boardgame.io/core';
import { Ctx } from 'boardgame.io';
import { GAME_ID } from '../config';
import {
  EndTurn, CharacterAbility, Move, Select, Build, Place, updateValids, CheckWinByTrap,
} from './moves';
import { characterList, getCharacter } from './characters';
import { SetChar, Ready, CancelReady } from './moves/charSelectMoves';
import {
  GameState, Player, PlayerIDs, Space,
} from '../types/GameTypes';
import { Character, CharacterState } from '../types/CharacterTypes';

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

function setRandomCharacters(G: GameState, ctx: Ctx) {
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

export const SantoriniGame = {
  name: GAME_ID,
  minPlayers: 2,
  maxPlayers: 2,

  setup: (ctx: Ctx) => {
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
      endIf: (G: GameState) => G.players['0'].ready && G.players['1'].ready,
      turn: {
        activePlayers: ActivePlayers.ALL,
      },
      moves: {
        SetChar,
        Ready,
        CancelReady,
      },
      onEnd: (G: GameState, ctx: Ctx) => {
        setRandomCharacters(G, ctx);
      },
    },

    placeWorkers: {
      next: 'main',
      onBegin: (G: GameState, ctx: Ctx) => {
        Object.values(G.players).forEach((player) => {
          const char = getCharacter(player.char.name);
          char.initialize?.(G, ctx, player, player.char);
        });
      },
      turn: {
        activePlayers: { currentPlayer: 'place' },
        order: {
          first: (G: GameState, ctx: Ctx) => getFirstPlayer(G),
          next: (G: GameState, ctx: Ctx) => (ctx.playOrderPos + 1) % ctx.numPlayers,
        },
        stages: {
          place: { moves: { Place } },
          end: { moves: { EndTurn } },
        },
        onBegin: (G: GameState, ctx: Ctx) => {
          updateValids(G, ctx, G.players[ctx.currentPlayer], 'place');
        },
        onEnd: (G: GameState, ctx: Ctx) => {
          if (
            G.players['0'].char.numWorkersToPlace === 0
            && G.players['1'].char.numWorkersToPlace === 0
          ) {
            ctx.events?.endPhase();
          }
        },
      },
    },

    main: {
      turn: {
        activePlayers: { currentPlayer: 'select' },
        order: {
          first: (G: GameState, ctx: Ctx) => getFirstPlayer(G),
          next: (G: GameState, ctx: Ctx) => (ctx.playOrderPos + 1) % ctx.numPlayers,
        },
        stages: {
          select: { moves: { Select, CharacterAbility } },
          move: { moves: { Move, CharacterAbility } },
          build: { moves: { Build, CharacterAbility } },
          end: { moves: { EndTurn } },
        },
        onBegin: (G: GameState, ctx: Ctx) => {
          const currPlayer = G.players[ctx.currentPlayer];
          const char: any = getCharacter(currPlayer.char.name);
          updateValids(G, ctx, currPlayer, 'select');
          char.onTurnBegin?.(G, ctx, currPlayer, currPlayer.char);
        },
        onEnd: (G: GameState, ctx: Ctx) => {
          const currPlayer = G.players[ctx.currentPlayer];
          const char: any = getCharacter(currPlayer.char.name);
          char.onTurnEnd?.(G, ctx, currPlayer, currPlayer.char);

          G.players[ctx.currentPlayer].char.selectedWorkerNum = -1;

          CheckWinByTrap(G, ctx);
        },
      },
    },
  },
};
