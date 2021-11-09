import { Ctx } from 'boardgame.io';
import { Character, CharacterState } from '../../types/CharacterTypes';
import { Mortal } from './Mortal';
import { GameState, Player } from '../../types/GameTypes';
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

  move: (
    G: GameState,
    ctx: Ctx,
    player: Player,
    char: CharacterState<AthenaAttrs>,
    pos: number,
  ) => {
    // if the opponent move up height has not been set yet
    if (!char.attrs.setOpponentHeight) {
      // set it now
      char.attrs.opponentMoveUpHeight = G.players[player.opponentId].char.moveUpHeight;
    }
    char.attrs.setOpponentHeight = true;

    // reset the move up height for the opponent at the beginning of the turn
    G.players[player.opponentId].char.moveUpHeight = char.attrs.opponentMoveUpHeight;

    // note the height before moving
    const heightBefore = char.workers[char.selectedWorkerNum].height;

    // move to the selected space
    Board.free(G, char.workers[char.selectedWorkerNum].pos);
    Board.place(G, pos, player.id, char.selectedWorkerNum);

    // if the worker's previous height is less than the worker's current height
    if (heightBefore < char.workers[char.selectedWorkerNum].height) {
      // do not allow the opponent to move up the next turn
      G.players[player.opponentId].char.moveUpHeight = 0;
    }

    return 'build';
  },
};
