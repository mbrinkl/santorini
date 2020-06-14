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
  endTurnTime: number,
  valids: number[]
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
    default: char = Mortal; break;
  }

  return char;
}

function initCharacter(name: string) : Character
{
  let char: any = getCharacter(name);

  const character : Character = {
    name: name,
    desc: char.desc,
    buttonActive: false,
    buttonText: char.buttonText,
    moveUpHeight: char.moveUpHeight,
    workers: [],
    numWorkers: char.numWorkers,
    numWorkersToPlace: char.numWorkers,
    selectedWorker: -1,
    attributes: char.attributes
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
      endTurnTime: 3,
      ready: false,
      valids: []
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
      }
    },

    main: {
      onBegin: (G: GameState, ctx) => {
        setRandomCharacters(G, ctx);
      },
      moves: { 
        SelectSpace,
        CharButtonPressed,
        EndTurn,
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

function CancelReady(G: GameState, ctx, id) {
  G.players[id].ready = false;
}

function Rematch(G: GameState, ctx) {
  //ctx.playAgain();
}

function Place(G: GameState, ctx, pos) {

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

  if (currChar.workers[0].pos === pos)
    currChar.selectedWorker = 0;
  else if (currChar.workers[1].pos === pos)
    currChar.selectedWorker = 1;

  if (currChar.selectedWorker !== -1)
  {
    let char: any = getCharacter(currChar.name);

    G.valids = char.valid_move(G, ctx, currPlayer, currChar, currChar.workers[currChar.selectedWorker].pos);

    G.stage = 'move';
  }
}

function Move(G: GameState, ctx: Ctx, pos: number) {
  if (G.valids.includes(pos)) {
    let currPlayer = G.players[ctx.currentPlayer];
    let currChar = currPlayer.char;

    let before_height = currChar.workers[currChar.selectedWorker].height;

    let char: any = getCharacter(currChar.name);

    G.stage = char.move(G, ctx, currPlayer, currChar, pos);
    G.valids = G.stage === 'move' ? 
      char.valid_move(G, ctx, currPlayer, currChar, currChar.workers[currChar.selectedWorker].pos) : 
      char.valid_build(G, ctx, currPlayer, currChar, currChar.workers[currChar.selectedWorker].pos);

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
    G.valids = G.stage === 'move' ? 
      char.valid_move(G, ctx, currPlayer, currChar, currChar.workers[currChar.selectedWorker].pos) : G.stage === 'build' ? 
      char.valid_build(G, ctx, currPlayer, currChar, currChar.workers[currChar.selectedWorker].pos) :
      [];
  
    if (G.stage === 'end')
    {
        G.canEndTurn = true;
    }
  }
}

function EndTurn(G: GameState, ctx: Ctx) {

  let nextPlayer = G.players[G.players[ctx.currentPlayer].opponentId];

  ctx.events!.endTurn!(); //not null assertion
  G.canEndTurn = false;

  // to avoid changing to select stage during the place stage at beginning of game
  if (G.stage === 'end') {
    let currChar = nextPlayer.char;

    let char: any = getCharacter(currChar.name);

    G.stage = 'select';
    G.valids = char.valid_select(G, ctx, nextPlayer, currChar);

    G.players['0'].char.selectedWorker = -1;
    G.players['1'].char.selectedWorker = -1;

    CheckWinByTrap(G, ctx);
  }
}

function CheckWinByTrap(G: GameState, ctx:Ctx) {

  let nextPlayer = G.players[G.players[ctx.currentPlayer].opponentId];
  let currChar = nextPlayer.char;

  let char: any = getCharacter(currChar.name);

  if (!char.hasValidMoves(G, ctx, nextPlayer, currChar)) {
    ctx.events!.endGame!({ // not null assertion
      winner: nextPlayer.opponentId
    })
  }
}

function CheckWinByMove(G: GameState, ctx:Ctx, before_height: number, after_height: number) {
  if (before_height < 3 && after_height === 3)
  {
    ctx.events!.endGame!({ // not null assertion
      winner: ctx.currentPlayer
    })
  }
}
