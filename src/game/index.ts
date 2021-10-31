import { ActivePlayers } from "boardgame.io/core";
import { Ctx } from "boardgame.io";
import { GAME_ID } from "../config";
import { Space } from "./space";
import { EndTurn, CharacterAbility, Move, Select, Build, Place, updateValids, CheckWinByTrap } from "./moves";
import { allSpaces } from "./utility";
import { characterList, Character, getCharacter } from "./characters";
import { SetChar, Ready, CancelReady } from "./moves/charSelectMoves";

export interface Player {
  id: string;
  opponentId: string;
  ready: boolean;
  char: Character;
}

export interface GameState {
  stage: string;
  spaces: Space[];
  players: { [key: string]: Player };
  valids: number[];
}

export function initCharacter(name: string): Character {
  const char: any = getCharacter(name);

  const character: Character = {
    name: name,
    desc: char.desc,
    buttonActive: char.buttonActive,
    buttonText: char.buttonText,
    moveUpHeight: char.moveUpHeight,
    workers: [],
    numWorkers: char.numWorkers,
    numWorkersToPlace: char.numWorkers,
    selectedWorker: -1,
    attrs: char.attrs,
  };

  return character;
}

function setRandomCharacters(G: GameState, ctx: Ctx) {
  for (let i = 0; i < ctx.numPlayers; i++) {
    const id = i.toString();
    if (G.players[id].char.name === "Random") {
      const randomCharName =
        characterList[Math.floor(Math.random() * (characterList.length - 1))];
      G.players[id].char = initCharacter(randomCharName);
    }
  }
}

function getFirstPlayer(G: GameState) : number {
  let startingPlayer = 0;
  if (G.players["1"].char.name === "Bia") {
    startingPlayer = 1;
  }
  return startingPlayer;
}

export const SantoriniGame = {
  name: GAME_ID,
  minPlayers: 2,
  maxPlayers: 2,
  
  setup: () => {
    const players = {
      "0": {
        id: "0",
        opponentId: "1",
        ready: false,
        char: initCharacter("Random"),
      },
      "1": {
        id: "1",
        opponentId: "0",
        ready: false,
        char: initCharacter("Random"),
      },
    };

    const spaces: Space[] = [];
    for (let i = 0; i < 25; i++) {
      spaces.push({
        pos: i,
        height: 0,
        inhabited: false,
        inhabitant: {
          playerId: "",
          workerNum: -1,
        },
        is_domed: false,
      });
    }

    const initialState: GameState = {
      players,
      spaces,
      stage: "place",
      valids: allSpaces(),
    };

    return initialState;
  },

  phases: {
    selectCharacters: {
      start: true,
      next: 'placeWorkers',
      endIf: (G: GameState) => 
        G.players['0'].ready && G.players['1'].ready,
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
      }
    },

    placeWorkers: {
      next: 'main',
      turn: {
        activePlayers: { currentPlayer: 'place' },
        order: {
          first: (G: GameState, ctx: Ctx) => 
            getFirstPlayer(G),
          next: (G: GameState, ctx: Ctx) =>
            (ctx.playOrderPos + 1) % ctx.numPlayers,
        },
        stages: {
          place: { moves: { Place } },
          end: { moves: { EndTurn } },
        },
        onEnd: (G: GameState, ctx: Ctx) => {
          if (G.players["0"].char.numWorkersToPlace === 0 &&
            G.players["1"].char.numWorkersToPlace === 0) {

            ctx.events?.endPhase();
          }
          else {
            const nextPlayer = G.players[G.players[ctx.currentPlayer].opponentId];
            updateValids(G, ctx, nextPlayer, 'place');
          }
        }
      },
    },

    main: {
      turn: {
        activePlayers: { currentPlayer: 'select' },
        order: {
          first: (G: GameState, ctx: Ctx) => 
            getFirstPlayer(G),
          next: (G: GameState, ctx: Ctx) =>
            (ctx.playOrderPos + 1) % ctx.numPlayers,
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
          char.onTurnBegin(G, ctx, currPlayer, currPlayer.char);
        },
        onEnd: (G: GameState, ctx: Ctx) => {
          const currPlayer = G.players[ctx.currentPlayer];
          const char: any = getCharacter(currPlayer.char.name);          
          char.onTurnEnd(G, ctx, currPlayer, currPlayer.char);

          G.players["0"].char.selectedWorker = -1;
          G.players["1"].char.selectedWorker = -1;

          CheckWinByTrap(G, ctx);
        }
      },
    },
  },
};
