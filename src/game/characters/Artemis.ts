import { Ctx } from "boardgame.io";
import { getAdjacentPositions } from '../utility';
import { Character, CharacterState } from '.';
import { Mortal } from "./Mortal";
import { GameState, Player } from '../../types/GameTypes';
import { Board } from '../space';

// interface attrsType {
//   numMoves: number,
//   prevTile: number,
// }

export const Artemis: Character = {
  ...Mortal,
  name: 'Artemis',
  desc: `Your Move: Your worker may move one additional time, but not back to
      its initial space.`,
  buttonText: 'End Move',
  attrs: {
    numMoves: 0,
    prevTile: -1,
  },

  validMove: (
    G: GameState,
    ctx: Ctx,
    player: Player,
    char: CharacterState,
    originalPos: number
  ) => {

    let adjacents: number[] = getAdjacentPositions(originalPos);
    let valids: number[] = [];

    if (char.selectedWorker !== -1 && char.attrs.numMoves === 0)
      char.attrs.prevTile = char.workers[char.selectedWorker].pos;

    adjacents.forEach(pos => {
      if (!G.spaces[pos].inhabited && !G.spaces[pos].is_domed &&
        G.spaces[pos].height - G.spaces[originalPos].height <= char.moveUpHeight
      ) {
        if (char.attrs.prevTile !== pos)
          valids.push(pos);
      }
    });

    return valids;
  },

  move: (
    G: GameState,
    ctx: Ctx,
    player: Player,
    char: CharacterState,
    pos: number
  ) => {

    char.attrs.numMoves++;

    // free the space that is being moved from
    Board.free(G, char.workers[char.selectedWorker].pos);

    // place the worker on the selected space
    Board.place(G, pos, player.id, char.selectedWorker);

    if (char.attrs.numMoves === 2) {
      char.attrs.numMoves = 0;
      char.attrs.prevTile = -1;
      char.buttonActive = false;
      return 'build';
    }
    else {
      char.buttonActive = true;
      return 'move'
    }
  },

  buttonPressed: (
    G: GameState,
    ctx: Ctx,
    player: Player,
    char: CharacterState
  ) => {
    char.buttonActive = false;
    return 'build';
  },
}