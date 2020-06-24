import { times } from "lodash";
import { ActivePlayers } from 'boardgame.io/core';
import { Ctx } from "boardgame.io";
import { GAME_ID } from "../config";
import {Space, Board} from "./space";
import {characterList, Worker, Character, Mortal} from "./character"
import { Apollo } from "./characters/Apollo"
import { Artemis } from "./characters/Artemis"
import { Athena } from "./characters/Athena"
import { Atlas } from "./characters/Atlas"
import { Demeter } from "./characters/Demeter"
import { Hephaestus } from "./characters/Hephaestus"
import { Hermes } from "./characters/Hermes"
import { Minotaur } from "./characters/Minotaur"
import { Pan } from "./characters/Pan"
import { Prometheus } from "./characters/Prometheus"
import { Bia } from "./characters/Bia"
import { Heracles } from "./characters/Heracles"
import { Odysseus } from "./characters/Odysseus"

export interface Player {
  id: string;
  opponentId: string;
  ready: boolean;
  char: Character;
}

export interface GameState {
  ready: boolean,
  stage: string,
  canEndTurn: boolean,
  spaces: Space[],
  players: { [key: string]: Player },
  valids: number[],
  winner: string
}

function getCharacter(name: string) : any {
  let char: any;

  switch(name)
  {
    case "Mortal": char = Mortal; break;
    case "Apollo": char = Apollo; break;
    case "Artemis": char = Artemis; break;
    case "Athena": char = Athena; break;
    case "Atlas": char = Atlas; break;
    case "Demeter": char = Demeter; break;
    case "Hephaestus": char = Hephaestus; break;
    case "Hermes": char = Hermes; break;
    case "Minotaur": char = Minotaur; break;
    case "Pan": char = Pan; break;
    case "Prometheus": char = Prometheus; break;
    case "Bia": char = Bia; break;
    case "Heracles": char = Heracles; break;
    case "Odysseus": char = Odysseus; break;
    default: char = Mortal; break;
  }

  return char;
}


function updateValids(G: GameState, ctx: Ctx, player: Player) {

  let currChar = player.char;

  let char: any = getCharacter(currChar.name);

  switch (G.stage) {
    case 'select':
      G.valids = char.valid_select(G, ctx, player, currChar);
      break;
    case 'move':
      G.valids = char.valid_move(G, ctx, player, currChar, currChar.workers[currChar.selectedWorker].pos);
      break;
    case 'build':
      G.valids = char.valid_build(G, ctx, player, currChar, currChar.workers[currChar.selectedWorker].pos);
      break;
    default:
      G.valids = [];
      break;
  }
}

function initCharacter(name: string) : Character
{
  let char: any = getCharacter(name);

  const character : Character = {
    name: name,
    desc: char.desc,
    buttonActive: char.buttonActive,
    buttonText: char.buttonText,
    moveUpHeight: char.moveUpHeight,
    workers: [],
    numWorkers: char.numWorkers,
    numWorkersToPlace: char.numWorkers,
    selectedWorker: -1,
    attrs: char.attrs
  }

  return character;
}


export const SantoriniGame = {
  name: GAME_ID,

  setup: (ctx) => {

    const players = {
      '0': {
        id: '0',
        opponentId: '1',
        ready: false,
        char: initCharacter("Random")
      },
      '1': {
        id: '1',
        opponentId: '0',
        ready: false,
        char: initCharacter("Random")
      }
    };

    const spaces : Space[] = [];
    for (let i = 0; i < 25; i++)
    {
      spaces.push({
        pos: i,
        height: 0,
        inhabited: false,
        inhabitant: {
          playerId: '',
          workerNum: -1,
        },
        is_domed: false
      });
    }

    const initialState: GameState = {
      players,
      spaces,
      canEndTurn: false,
      stage: 'place',
      ready: false,
      valids: [],
      winner: ''
    };

    return initialState;
  },

  phases: {
    selectCharacters: {
      start: true,
      next: 'main',
      endIf: (G: GameState) => G.ready,
      turn: {
        activePlayers: ActivePlayers.ALL
      },
      moves: {
        SetChar,
        Ready,
        CancelReady
      },
    },

    main: {
      onBegin: (G: GameState, ctx: Ctx) => {
        setRandomCharacters(G, ctx);
      },
      turn: {
        activePlayers: undefined,
        order: {
          first: (G: GameState, ctx: Ctx) => {  
              let startingPlayer = 0;
              if (G.players['1'].char.name === 'Bia') {
                startingPlayer = 1;
              }
              return startingPlayer;
            },
          next: (G: GameState, ctx: Ctx) => (ctx.playOrderPos + 1) % ctx.numPlayers,
        }
      },
      next: 'gameOver',
      moves: { 
        SelectSpace,
        CharButtonPressed,
        EndTurn,
      },
    },

    // can potentially remove this phase when boardgame.io updates to allow rematches
    gameOver: {
      turn: {
        activePlayers: ActivePlayers.ALL
      },
      moves: { 
        Rematch
      },
    }
  }
};

function SelectSpace(G: GameState, ctx: Ctx, pos) {
  switch(G.stage)
  {
    case 'place':
      Place(G, ctx, pos);
      break;
    case 'select':
      Select(G, ctx, pos);
      break;
    case 'move':
      Move(G, ctx, pos);
      break;
    case 'build':
      Build(G, ctx, pos);
      break;
  }
}

function CharButtonPressed(G: GameState, ctx: Ctx) {
  let currPlayer = G.players[ctx.currentPlayer];
  let currChar = currPlayer.char;

  let char: any = getCharacter(currChar.name);

  char.buttonPressed(G, ctx, currPlayer, currChar);
  updateValids(G, ctx, currPlayer);
}

function setRandomCharacters(G: GameState, ctx: Ctx) {

  times(ctx.numPlayers, (index) => {
    const id = index.toString();
    if (G.players[id].char.name === "Random") {
      const randomCharName = characterList[Math.floor(Math.random() * characterList.length - 1)];
      G.players[id].char = initCharacter(randomCharName);
    }
  });
}

function SetChar(G: GameState, ctx: Ctx, id: string, name: string) {
  G.players[id].char = initCharacter(name);
}

function Ready(G: GameState, ctx: Ctx, id: string) {

  G.players[id].ready = true;

  if (G.players['0'].ready && G.players['1'].ready)
    G.ready = true;
}

function CancelReady(G: GameState, ctx: Ctx, id: number) {
  G.players[id].ready = false;
}

function Rematch(G: GameState, ctx: Ctx) {

  const players = {
    '0': {
      id: '0',
      opponentId: '1',
      ready: false,
      char: initCharacter("Random")
    },
    '1': {
      id: '1',
      opponentId: '0',
      ready: false,
      char: initCharacter("Random")
    }
  };

  const spaces : Space[] = [];
  for (let i = 0; i < 25; i++)
  {
    spaces.push({
      pos: i,
      height: 0,
      inhabited: false,
      inhabitant: {
        playerId: '',
        workerNum: -1,
      },
      is_domed: false
    });
  }

  G.players = players;
  G.spaces = spaces;
  G.canEndTurn = false;
  G.stage = 'place';
  G.ready = false;
  G.valids = [];
  G.winner = '';

  ctx.events!.setPhase!('selectCharacters');
}

function Place(G: GameState, ctx: Ctx, pos: number) {

  let currentChar = G.players[ctx.currentPlayer].char;

  if (!G.spaces[pos].inhabited && currentChar.numWorkersToPlace > 0) {

    let worker : Worker = {
      pos: pos,
      height: G.spaces[pos].height
    };

    currentChar.workers.push(worker);
    Board.place(G, pos, ctx.currentPlayer, currentChar.workers.length - 1);

    if (--currentChar.numWorkersToPlace === 0)
    {
      G.canEndTurn = true;

      if (G.players['0'].char.numWorkersToPlace === 0 && G.players['1'].char.numWorkersToPlace === 0)
      {
        G.stage = 'end';
      }
    }
  }
}

function Select(G: GameState, ctx, pos) {
  
  let currPlayer = G.players[ctx.currentPlayer];
  let currChar = currPlayer.char;

  let char: any = getCharacter(currChar.name);

  if (G.valids.includes(pos))
  {
    G.stage = char.select(G, ctx, currPlayer, currChar, pos);
    updateValids(G, ctx, currPlayer);
  }
}

function Move(G: GameState, ctx: Ctx, pos: number) {
  if (G.valids.includes(pos)) {
    let currPlayer = G.players[ctx.currentPlayer];
    let currChar = currPlayer.char;

    let before_height = currChar.workers[currChar.selectedWorker].height;

    let char: any = getCharacter(currChar.name);

    G.stage = char.move(G, ctx, currPlayer, currChar, pos);
    updateValids(G, ctx, currPlayer);

    let after_height = currChar.workers[currChar.selectedWorker].height;
    CheckWinByMove(G, ctx, before_height, after_height)
  }
}

function Build(G: GameState, ctx: Ctx, pos: number) {

  if (G.valids.includes(pos)) {
    let currPlayer = G.players[ctx.currentPlayer];
    let currChar = currPlayer.char;

    let char: any = getCharacter(currChar.name);
  
    G.stage = char.build(G, ctx, currPlayer, currChar, pos);
    updateValids(G, ctx, currPlayer);
  
    if (G.stage === 'end')
    {
        G.canEndTurn = true;
    }
  }
}

function EndTurn(G: GameState, ctx: Ctx) {

  // ctx.currentPlayer not updated after endturn immediately
  let currPlayer = G.players[ctx.currentPlayer];
  let nextPlayer = G.players[G.players[ctx.currentPlayer].opponentId];

  let charCurr: any = getCharacter(currPlayer.char.name);
  let charNext: any = getCharacter(nextPlayer.char.name);

  charCurr.onTurnEnd(G, ctx, currPlayer, currPlayer.char);

  // end the turn
  ctx.events!.endTurn!(); //not null assertion
  G.canEndTurn = false;

  // to avoid changing to select stage during the place stage at beginning of game
  if (G.stage === 'end') {

    G.stage = 'select';
    updateValids(G, ctx, nextPlayer);

    G.players['0'].char.selectedWorker = -1;
    G.players['1'].char.selectedWorker = -1;

    CheckWinByTrap(G, ctx);

    charNext.onTurnBegin(G, ctx, nextPlayer, nextPlayer.char);
  }
}

function CheckWinByTrap(G: GameState, ctx:Ctx) {

  let nextPlayer = G.players[G.players[ctx.currentPlayer].opponentId];
  let currChar = nextPlayer.char;

  let char: any = getCharacter(currChar.name);

  if (!char.hasValidMoves(G, ctx, nextPlayer, currChar)) {

    ctx.events!.endPhase!();
    G.winner = nextPlayer.opponentId;

    // ctx.events!.endGame!({ // not null assertion
    //   winner: nextPlayer.opponentId
    // })
  }
}

function CheckWinByMove(G: GameState, ctx:Ctx, before_height: number, after_height: number) {

  let currPlayer = G.players[ctx.currentPlayer];
  let currChar = currPlayer.char

  let char: any = getCharacter(currChar.name);

  if (char.check_win_by_move(G, before_height, after_height)) {

    ctx.events!.endPhase!();
    G.winner = ctx.currentPlayer;

    // ctx.events!.endGame!({ // not null assertion
    //   winner: ctx.currentPlayer
    // })
  }
}
