import { Ctx } from "boardgame.io";
import { Mortal, Character } from "."
import { GameState, Player } from "../index"
import { Board } from '../space'

interface attrsType {
    setOpponentHeight: boolean,
    opponentMoveUpHeight: number,
}

export class Athena extends Mortal {

    public static desc = `Opponent's Turn: If one of your workers moved up on your last turn, 
        opponent workers cannot move up this turn.`;

    public static attrs : attrsType = {
        setOpponentHeight: false,
        opponentMoveUpHeight: -1
    }

    public static move (
        G: GameState, 
        ctx: Ctx,
        player: Player, 
        char: Character,
        pos: number, 
    ) : string {
    
        // if the opponent move up height has not been set yet
        if (!char.attrs.setOpponentHeight)
            // set it now
            char.attrs.opponentMoveUpHeight = G.players[player.opponentId].char.moveUpHeight;
            char.attrs.setOpponentHeight = true;

        // reset the move up height for the opponent at the beginning of the turn
        G.players[player.opponentId].char.moveUpHeight = char.attrs.opponentMoveUpHeight

        // note the height before moving
        let heightBefore = char.workers[char.selectedWorker].height

        // move to the selected space
        Board.free(G, char.workers[char.selectedWorker].pos);
        Board.place(G, pos, player.id, char.selectedWorker);

        // if the worker's previous height is less than the worker's current height
        if (heightBefore < char.workers[char.selectedWorker].height)
            // do not allow the opponent to move up the next turn
            G.players[player.opponentId].char.moveUpHeight = 0

        return 'build'
    }
}