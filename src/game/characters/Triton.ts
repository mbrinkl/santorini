import { Character } from '../../types/CharacterTypes';
import { Mortal } from './Mortal';
import { Board } from '../space';
import { posIsPerimeter } from '../utility';
import { GameStage } from '../../types/GameTypes';

export const Triton: Character = {
  ...Mortal,
  desc: 'Your Move: Each time your Worker moves into a perimeter space, it may immediately move again.',
  buttonText: 'End Move',

  move: ({ G, playerID }, charState, pos) => {
    let returnStage: GameStage = 'build';

    if (posIsPerimeter(pos)) {
      charState.buttonActive = true;
      returnStage = 'move';
    } else {
      charState.buttonActive = false;
    }

    // free the space that is being moved from
    Board.free(G, charState.workers[charState.selectedWorkerNum].pos);

    // place the worker on the selected space
    Board.place(G, pos, playerID, charState.selectedWorkerNum);

    return returnStage;
  },

  buttonPressed: (context, charState) => {
    charState.buttonActive = false;
    return 'build';
  },
};
