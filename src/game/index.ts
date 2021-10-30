import { ActivePlayers } from "boardgame.io/core";
import { Ctx } from "boardgame.io";
import { GAME_ID } from "../config";
import { Space } from "./space";
import { EndTurn, CharButtonPressed, Move, Select, Build, Place } from "./moves";
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
  ready: boolean;
  stage: string;
  canEndTurn: boolean;
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

export const SantoriniGame = {
  name: GAME_ID,

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
      canEndTurn: false,
      stage: "place",
      ready: false,
      valids: allSpaces(),
    };

    return initialState;
  },

  phases: {
    // Select character screen
    selectCharacters: {
      start: true,
      next: 'placePhase',
      endIf: (G: GameState) => G.ready,
      turn: {
        activePlayers: ActivePlayers.ALL,
      },
      moves: {
        SetChar,
        Ready,
        CancelReady,
      },
    },

    placePhase: {
      onBegin: (G: GameState, ctx: Ctx) => {
        // If a player selected "Random" as their character, pick that random character now
        setRandomCharacters(G, ctx);
      },
      next: 'main',
      turn: {
        activePlayers: { currentPlayer: 'place' },
        order: {
          first: (G: GameState, ctx: Ctx) => {
            let startingPlayer = 0;
            if (G.players["1"].char.name === "Bia") {
              startingPlayer = 1;
            }
            return startingPlayer;
          },
          next: (G: GameState, ctx: Ctx) =>
            (ctx.playOrderPos + 1) % ctx.numPlayers,
        },
        stages: {
          place: {moves: {Place, EndTurn}},
          end: {moves: {EndTurn}}
        },
      },
    },

    // Playing the game
    main: {
      turn: {
        activePlayers: { currentPlayer: 'select' },
        order: {
          first: (G: GameState, ctx: Ctx) => {
            let startingPlayer = 0;
            if (G.players["1"].char.name === "Bia") {
              startingPlayer = 1;
            }
            return startingPlayer;
          },
          next: (G: GameState, ctx: Ctx) =>
            (ctx.playOrderPos + 1) % ctx.numPlayers,
        },
        stages: {
          select: { moves: { Select, CharButtonPressed } },
          move: { moves: { Move, CharButtonPressed } },
          build: { moves: { Build, CharButtonPressed } },
          end: { moves: { EndTurn } },
        },
      },
    },
  },
};
