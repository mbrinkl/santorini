import { get_adjacent_positions } from '../utility';
import { Mortal, Character } from '../character'
import { GameState, Player } from '../index'
import { Board } from '../space'
import { Ctx } from 'boardgame.io';

export class Odysseus extends Mortal {

  public static desc = `Start of Your Turn: Once, force to unoccupied corner spaces any 
    number of opponent Workers that neighbor your Workers.`;
  public static buttonText = 'Move Opponent';
  public static attributes = {
    specialActive: false,
    specialUsed: false,
    movingOpponent: false,
    workerToMovePos: -1
  };

  public static onTurnBegin(
    G: GameState, 
    ctx: Ctx,
    player: Player, 
    char: Character
  ) : void {
    if (!char.attributes.specialUsed) {
      char.buttonActive = this.checkForValidSpecial(G, ctx, player, char);
    }
  }

  private static checkForValidSpecial(
    G: GameState, 
    ctx: Ctx,
    player: Player, 
    char: Character
  ) : boolean {
    char.attributes.specialActive = true;
    let returnValue = false;

    if (char.selectedWorker !== -1) {
      const worker = char.workers[char.selectedWorker];
      if (this.valid_move(G, ctx, player, char, worker.pos).length > 0) {
        returnValue = true;
      }
    }
    else {
      char.workers.forEach(worker => {
        if (this.valid_move(G, ctx, player, char, worker.pos).length > 0) {
          returnValue = true;
        }
      })
    }

    char.attributes.specialActive = false
    return returnValue;
  }

  public static buttonPressed(
    G: GameState,
    ctx: Ctx,
    player: Player,
    char: Character
  ) : void {
    char.attributes.specialActive = !char.attributes.specialActive;

    if (char.attributes.specialUsed) {
      char.buttonActive = false;
      char.attributes.specialActive = false;
      char.buttonText = 'Move Opponent'
    }
    else if (char.attributes.specialActive) {
      char.buttonText = 'Cancel';
    }
    else {
      char.buttonText = 'Move Opponent';
    }
  }

    
  public static valid_move(
    G: GameState, 
    ctx: Ctx,
    player: Player, 
    char: Character,
    originalPos: number
  ) : number[] {

    let valids : number[] = []

    if (char.attributes.specialActive) {
      let adjacents : number[] = get_adjacent_positions(originalPos);
      if (!char.attributes.movingOpponent) {
        G.players[player.opponentId].char.workers.forEach( worker => {
          if (adjacents.includes(worker.pos)) {
            valids.push(worker.pos);
          }
        });
      }
      else {
        [0, 4, 20, 24].forEach( pos => { // corner positions
          if (!G.spaces[pos].is_domed && !G.spaces[pos].inhabited) {
            valids.push(pos);
          }
        })
      }

      return valids;
    }
    else {
      return super.valid_move(G, ctx, player, char, originalPos);
    }
  }

  public static move (
    G: GameState, 
    ctx: Ctx,
    player: Player, 
    char: Character, 
    pos: number
  ) : string {

    if (char.attributes.specialActive) {
      char.attributes.specialUsed = true;
      char.buttonText = 'End Ability';

      if (!char.attributes.movingOpponent) {
        char.attributes.movingOpponent = true;
        char.attributes.workerToMovePos = pos;
        return 'move';
      }
      else {
        char.attributes.movingOpponent = false;
        const oppWorkerNum = G.spaces[char.attributes.workerToMovePos].inhabitant.workerNum;
        Board.free(G, char.attributes.workerToMovePos);
        Board.place(G, pos, player.opponentId, oppWorkerNum);

        if (!this.checkForValidSpecial(G, ctx, player, char)) {
          char.attributes.specialActive = false;
          char.buttonText = 'Move Opponent';
          char.buttonActive = false;
        }
        else {
          char.attributes.specialActive = true;
        }

        return 'move';
      }
    }
    else {
      char.buttonActive = false;
      char.attributes.specialActive = false;
      return super.move(G, ctx, player, char, pos);
    }
  }
}