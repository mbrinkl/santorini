import { Ctx } from 'boardgame.io';
import { Character, CharacterState } from '../../types/CharacterTypes';
import { Mortal } from './Mortal';
import { GameState, Player } from '../../types/GameTypes';
import { Board } from '../space';

export interface AthenaAttrs {
  setOpponentHeight: boolean,
  opponentMoveUpHeight: number,
}

const initialAttrs: AthenaAttrs = {
  setOpponentHeight: false,
  opponentMoveUpHeight: -1,
};

export const Athena: Character = {
  ...Mortal,
  desc: `Opponent's Turn: If one of your workers moved up on your last turn, 
        opponent workers cannot move up this turn.`,

  attrs: initialAttrs,

  move: (
    G: GameState,
    ctx: Ctx,
    player: Player,
    char: CharacterState,
    pos: number,
  ) => {
    const attrs: AthenaAttrs = char.attrs as AthenaAttrs;

    // if the opponent move up height has not been set yet
    if (!attrs.setOpponentHeight) {
      // set it now
      attrs.opponentMoveUpHeight = G.players[player.opponentId].char.moveUpHeight;
    }
    attrs.setOpponentHeight = true;

    // reset the move up height for the opponent at the beginning of the turn
    G.players[player.opponentId].char.moveUpHeight = attrs.opponentMoveUpHeight;

    // note the height before moving
    const heightBefore = char.workers[char.selectedWorker].height;

    // move to the selected space
    Board.free(G, char.workers[char.selectedWorker].pos);
    Board.place(G, pos, player.id, char.selectedWorker);

    // if the worker's previous height is less than the worker's current height
    if (heightBefore < char.workers[char.selectedWorker].height) {
      // do not allow the opponent to move up the next turn
      G.players[player.opponentId].char.moveUpHeight = 0;
    }

    return 'build';
  },
};
