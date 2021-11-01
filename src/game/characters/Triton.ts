import { Character, CharacterState } from ".";
import { Mortal } from "./Mortal";
import { Ctx } from 'boardgame.io';
import { Board } from '../space'
import { posIsPerimeter } from '../utility';
import { GameState, Player } from '../index'

export const Triton: Character = {
  ...Mortal,
  name: 'Triton',
  desc: `Your Move: Each time your Worker moves into a perimeter space, it may immediately move again.`,
  buttonText: 'End Move',

  move: (
    G: GameState,
    ctx: Ctx,
    player: Player,
    char: CharacterState,
    pos: number
  ) => {

    let returnStage = 'build';

    if (posIsPerimeter(pos)) {
      char.buttonActive = true;
      returnStage = 'move';
    }
    else {
      char.buttonActive = false;
    }

    // free the space that is being moved from
    Board.free(G, char.workers[char.selectedWorker].pos);

    // place the worker on the selected space
    Board.place(G, pos, player.id, char.selectedWorker);

    return returnStage;
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