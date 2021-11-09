import { Ctx } from 'boardgame.io';
import { Character, CharacterState } from '../../types/CharacterTypes';
import { Mortal } from './Mortal';
import { Board } from '../space';
import { posIsPerimeter } from '../utility';
import { GameStage, GameState, Player } from '../../types/GameTypes';

export const Triton: Character = {
  ...Mortal,
  desc: 'Your Move: Each time your Worker moves into a perimeter space, it may immediately move again.',
  buttonText: 'End Move',

  move: (
    G: GameState,
    ctx: Ctx,
    player: Player,
    char: CharacterState,
    pos: number,
  ) => {
    let returnStage: GameStage = 'build';

    if (posIsPerimeter(pos)) {
      char.buttonActive = true;
      returnStage = 'move';
    } else {
      char.buttonActive = false;
    }

    // free the space that is being moved from
    Board.free(G, char.workers[char.selectedWorkerNum].pos);

    // place the worker on the selected space
    Board.place(G, pos, player.id, char.selectedWorkerNum);

    return returnStage;
  },

  buttonPressed: (
    G: GameState,
    ctx: Ctx,
    player: Player,
    char: CharacterState,
  ) => {
    char.buttonActive = false;
    return 'build';
  },
};
