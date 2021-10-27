import { ActivePlayers } from "boardgame.io/core";
import { Ctx } from "boardgame.io";
import { GAME_ID } from "../config";
import { Space } from "./space";
import { SelectSpace, EndTurn, CharButtonPressed } from "./moves";
import { allSpaces } from "./utility";
import { characterList, Character, Mortal } from "./characters";
import { Apollo } from "./characters/Apollo";
import { Artemis } from "./characters/Artemis";
import { Athena } from "./characters/Athena";
import { Atlas } from "./characters/Atlas";
import { Demeter } from "./characters/Demeter";
import { Hephaestus } from "./characters/Hephaestus";
import { Hermes } from "./characters/Hermes";
import { Minotaur } from "./characters/Minotaur";
import { Pan } from "./characters/Pan";
import { Prometheus } from "./characters/Prometheus";
import { Bia } from "./characters/Bia";
import { Triton } from "./characters/Triton";
import { Zeus } from "./characters/Zeus";
import { Graeae } from "./characters/Graeae";
import { Heracles } from "./characters/Heracles";
import { Odysseus } from "./characters/Odysseus";
import { Iris } from "./characters/Iris";
import { Pegasus } from "./characters/Pegasus";

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
  winner: string;
}

export function getCharacter(name: string): any {
  let char: any;

  switch (name) {
    case "Mortal":
      char = Mortal;
      break;
    case "Apollo":
      char = Apollo;
      break;
    case "Artemis":
      char = Artemis;
      break;
    case "Athena":
      char = Athena;
      break;
    case "Atlas":
      char = Atlas;
      break;
    case "Demeter":
      char = Demeter;
      break;
    case "Hephaestus":
      char = Hephaestus;
      break;
    case "Hermes":
      char = Hermes;
      break;
    case "Minotaur":
      char = Minotaur;
      break;
    case "Pan":
      char = Pan;
      break;
    case "Prometheus":
      char = Prometheus;
      break;
    case "Bia":
      char = Bia;
      break;
    case "Triton":
      char = Triton;
      break;
    case "Zeus":
      char = Zeus;
      break;
    case "Graeae":
      char = Graeae;
      break;
    case "Heracles":
      char = Heracles;
      break;
    case "Odysseus":
      char = Odysseus;
      break;
    case "Iris":
      char = Iris;
      break;
    case "Pegasus":
      char = Pegasus;
      break;
    default:
      char = Mortal;
      break;
  }

  return char;
}

function initCharacter(name: string): Character {
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
      winner: "",
    };

    return initialState;
  },

  phases: {
    // Select character screen
    selectCharacters: {
      start: true,
      next: "main",
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

    // Playing the game
    main: {
      onBegin: (G: GameState, ctx: Ctx) => {
        // If a player selected "Random" as their character, pick that random character now
        setRandomCharacters(G, ctx);
      },
      turn: {
        activePlayers: undefined,
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
      },
      moves: {
        SelectSpace,
        CharButtonPressed,
        EndTurn,
      },
    },
  },
};

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

function SetChar(G: GameState, ctx: Ctx, id: string, name: string) {
  G.players[id].ready = false;
  G.players[id].char = initCharacter(name);
}

function Ready(G: GameState, ctx: Ctx, id: string) {
  G.players[id].ready = true;

  if (G.players["0"].ready && G.players["1"].ready) G.ready = true;
}

function CancelReady(G: GameState, ctx: Ctx, id: number) {
  G.players[id].ready = false;
}

