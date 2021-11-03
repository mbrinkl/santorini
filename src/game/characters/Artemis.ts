import { Ctx } from "boardgame.io";
import { getAdjacentPositions } from '../utility';
import { Character, CharacterState } from '../../types/CharacterTypes';
import { Mortal } from "./Mortal";
import { GameState, Player } from '../../types/GameTypes';
import { Board } from '../space';

interface ArtemisAttrs {
  numMoves: number,
  prevTile: number,
}

const initialAttrs: ArtemisAttrs = {
  numMoves: 0,
  prevTile: -1,
}

export const Artemis: Character = {
  ...Mortal,
  desc: `Your Move: Your worker may move one additional time, but not back to
      its initial space.`,
  buttonText: 'End Move',
  attrs: initialAttrs,

  validMove: (
    G: GameState,
    ctx: Ctx,
    player: Player,
    char: CharacterState,
    originalPos: number
  ) => {
    const attrs: ArtemisAttrs = char.attrs as ArtemisAttrs;

    let adjacents: number[] = getAdjacentPositions(originalPos);
    let valids: number[] = [];

    if (char.selectedWorker !== -1 && attrs.numMoves === 0)
      attrs.prevTile = char.workers[char.selectedWorker].pos;

    adjacents.forEach(pos => {
      if (!G.spaces[pos].inhabited && !G.spaces[pos].is_domed &&
        G.spaces[pos].height - G.spaces[originalPos].height <= char.moveUpHeight
      ) {
        if (attrs.prevTile !== pos)
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
    const attrs: ArtemisAttrs = char.attrs as ArtemisAttrs;

    attrs.numMoves++;

    // free the space that is being moved from
    Board.free(G, char.workers[char.selectedWorker].pos);

    // place the worker on the selected space
    Board.place(G, pos, player.id, char.selectedWorker);

    if (attrs.numMoves === 2) {
      attrs.numMoves = 0;
      attrs.prevTile = -1;
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