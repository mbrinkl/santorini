import { Character, CharacterState } from '../../types/CharacterTypes';
import { Mortal } from './Mortal';
import { Board } from '../space';

export interface AthenaAttrs {
  setOpponentHeight: boolean,
  opponentMoveUpHeight: number,
}

export const Athena: Character<AthenaAttrs> = {
  ...Mortal,
  desc: `Opponent's Turn: If one of your workers moved up on your last turn, 
        opponent workers cannot move up this turn.`,
  attrs: {
    setOpponentHeight: false,
    opponentMoveUpHeight: -1,
  },

  move: ({ G, playerID }, charState: CharacterState<AthenaAttrs>, pos) => {
    const { opponentID } = G.players[playerID];

    // if the opponent move up height has not been set yet
    if (!charState.attrs.setOpponentHeight) {
      // set it now
      charState.attrs.opponentMoveUpHeight = G.players[opponentID].charState.moveUpHeight;
    }
    charState.attrs.setOpponentHeight = true;

    // reset the move up height for the opponent at the beginning of the turn
    G.players[opponentID].charState.moveUpHeight = charState.attrs.opponentMoveUpHeight;

    // note the height before moving
    const heightBefore = charState.workers[charState.selectedWorkerNum].height;

    // move to the selected space
    Board.free(G, charState.workers[charState.selectedWorkerNum].pos);
    Board.place(G, pos, playerID, charState.selectedWorkerNum);

    // if the worker's previous height is less than the worker's current height
    if (heightBefore < charState.workers[charState.selectedWorkerNum].height) {
      // do not allow the opponent to move up the next turn
      G.players[opponentID].charState.moveUpHeight = 0;
    }

    return 'build';
  },
};
