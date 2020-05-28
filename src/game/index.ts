import { GAME_ID } from "../config";

type PlayerID = string;

export interface Player {
  id: PlayerID;
}

export interface Worker {
  pos: number;
  height: number;
}

export interface Character {
  workers: Worker[];
  num_workers: number;
  num_workers_to_place: number;
  selected_worker: number;
}

export interface Space {
  pos: number;
  height: number;
  inhabited: boolean;
  inhabitant: Worker | null;
  is_domed: boolean;
}

//   build() {
//     if (this.height < 4)
//       this.height++;
//     else
//       this.is_domed = true;
//   }

//   place(worker: Worker) {
//     this.inhabited = true;
//     this.inhabitant = worker;
//     worker.space = this;
//   }
// }

export interface GameState {
  char1: Character,
  char2: Character,

  stage: string,
  canEndTurn: boolean,

  spaces: Space[],

  players: { [key: string]: Player },

  shouldEndGame: boolean
}


export const SantoriniGame = {
  name: GAME_ID,

  setup: (ctx) => {

    const players = {};

    const char1 : Character = {
      workers: [],
      num_workers: 2,
      num_workers_to_place: 2,
      selected_worker: -1
    };

    const char2 : Character = {
      workers: [],
      num_workers: 2,
      num_workers_to_place: 2,
      selected_worker: -1
    }

    const spaces : Space[] = [];
    for (let i = 0; i < 25; i++)
    {
      spaces.push({
        pos: i,
        height: 0,
        inhabited: false,
        inhabitant: null,
        is_domed: false
      });
    }

    const initialState: GameState = {
      players,
      char1,
      char2,
      spaces,
      canEndTurn: false,
      stage: 'place',
      shouldEndGame: false,
    };

    return initialState;
  },

  moves: { SelectSpace, EndTurn },

  endIf: (G: GameState, ctx) => {
    if (WinCondition(G, ctx)) 
    {
      return { winner: ctx.currentPlayer };
    }
  }
};

function SelectSpace(G: GameState, ctx, pos) {
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

function Place(G: GameState, ctx, pos) {

  if (!G.spaces[pos].inhabited) {

    let worker : Worker = {
      pos: pos,
      height: G.spaces[pos].height
    };

    G.spaces[pos].inhabited = true;
    //G.spaces[pos].inhabitant = worker;

    if (ctx.currentPlayer==='0')
    {
      G.char1.workers.push(worker);

      if (--G.char1.num_workers_to_place === 0)
      {
        G.canEndTurn = true;
      }
    }
    else
    {
      G.char2.workers.push(worker)

      if (--G.char2.num_workers_to_place === 0)
      {
        G.stage = 'end';
        G.canEndTurn = true;
      }
    }
  }
}

function Select(G: GameState, ctx, pos) {
  
  if (ctx.currentPlayer==='0')
  {
    if (G.char1.workers[0].pos === pos)
      G.char1.selected_worker = 0;
    else if (G.char1.workers[1].pos === pos)
      G.char1.selected_worker = 1;

    if (G.char1.selected_worker !== null)
      G.stage = 'move';
  }
  else
  {
    if (G.char2.workers[0].pos === pos)
      G.char2.selected_worker = 0;
    else if (G.char2.workers[1].pos === pos)
      G.char2.selected_worker = 1;

    if (G.char2.selected_worker !== null)
      G.stage = 'move';
  }
}

function valid_move(G: GameState, originalPos: number, pos: number) {
  let adjacents : number[] = get_adjacent_positions(originalPos);

  originalPos = +originalPos;
  pos = +pos; // make sure pos is number

  return adjacents.includes(+pos) &&
    !G.spaces[pos].inhabited &&
    !G.spaces[pos].is_domed &&
    G.spaces[pos].height - G.spaces[originalPos].height < 2
}

function valid_build(G: GameState, originalPos: number, pos: number) {
  let adjacents : number[] = get_adjacent_positions(originalPos);

  pos = +pos; // make sure pos is number

  return adjacents.includes(pos) && 
    !G.spaces[pos].inhabited &&
    !G.spaces[pos].is_domed;
}

function coord_to_pos(x, y) : number {
  return(y * 5 + x);
}

function pos_to_coord(pos) : number[] {
  let x = pos % 5;
  let y = (pos - x) / 5;
  return [x, y]
}

function get_adjacent_positions(pos) : number[] {
  let valid_range : number[] = [];
  let coords : number[] = pos_to_coord(pos);
  let x : number = coords[0];
  let y : number = coords[1];

  if (x !== 0)
      valid_range.push(coord_to_pos(x - 1, y))
      if (y !== 0)
          valid_range.push(coord_to_pos(x - 1, y - 1))
      if (y !== 4)
          valid_range.push(coord_to_pos(x - 1, y + 1))
  if (x !== 4)
      valid_range.push(coord_to_pos(x + 1, y))
      if (y !== 0)
          valid_range.push(coord_to_pos(x + 1, y - 1))
      if (y !== 4)
          valid_range.push(coord_to_pos(x + 1, y + 1))
  if (y !== 0)
      valid_range.push(coord_to_pos(x, y - 1))
  if (y !== 4)
      valid_range.push(coord_to_pos(x, y + 1))

  return valid_range
}

function Move(G: GameState, ctx, pos) {

  if (ctx.currentPlayer==='0')
  {
    let originalPos = G.char1.workers[G.char1.selected_worker].pos;

    if (valid_move(G, originalPos, pos))
    {
      G.char1.workers[G.char1.selected_worker].pos = pos;
      let before_height = G.char1.workers[G.char1.selected_worker].height;
      G.char1.workers[G.char1.selected_worker].height = G.spaces[pos].height;
      let after_height = G.char1.workers[G.char1.selected_worker].height;

      G.spaces[originalPos].inhabited = false;
      G.spaces[pos].inhabited = true;

      CheckWinByMove(G, ctx, before_height, after_height)
      G.stage = 'build';
    }
  }
  else
  {
    let originalPos = G.char2.workers[G.char2.selected_worker].pos;

    if (valid_move(G, originalPos, pos))
    {
      G.char2.workers[G.char2.selected_worker].pos = pos;
      let before_height = G.char2.workers[G.char2.selected_worker].height;
      G.char2.workers[G.char2.selected_worker].height = G.spaces[pos].height;
      let after_height = G.char2.workers[G.char2.selected_worker].height;

      G.spaces[originalPos].inhabited = false;
      G.spaces[pos].inhabited = true;

      CheckWinByMove(G, ctx, before_height, after_height)
      G.stage = 'build';
    }
  }
}

function Build(G: GameState, ctx, pos) {

  if (ctx.currentPlayer==='0')
  {
    if (valid_build(G, G.char1.workers[G.char1.selected_worker].pos, pos))
    {
      G.spaces[pos].height++;
      G.stage = 'end';
      G.canEndTurn = true;
    }
  }
  else
  {
    if (valid_build(G, G.char2.workers[G.char2.selected_worker].pos, pos))
    {
      G.spaces[pos].height++;
      G.stage = 'end';
      G.canEndTurn = true;
    }
  }
}

function EndTurn(G: GameState, ctx) {
  if (G.stage === 'end')
    G.stage = 'select';

  G.char1.selected_worker = -1;
  G.char2.selected_worker = -1;

  ctx.events.endTurn();
  G.canEndTurn = false;
}

function WinCondition(G: GameState, ctx) {

  return false;
}

function CheckWinByMove(G: GameState, ctx, before_height, after_height) {
  if (before_height < 3 && after_height === 3)
  {
    ctx.events.endGame({
      winner: ctx.currentPlayer
    })
  }
}
