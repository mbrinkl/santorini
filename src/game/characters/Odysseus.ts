import { get_adjacent_positions } from '../utility';
import { Mortal, Character } from '../character'
import { GameState, Player } from '../index'
import { Board } from '../space'
import { Ctx } from 'boardgame.io';

interface attrsType {
  specialActive: boolean,
  specialUsed: boolean,
  movingOpponent: boolean,
  workerToMovePos: number
}

export class Odysseus extends Mortal {

  public static desc = `Start of Your Turn: Once, force to unoccupied corner spaces any 
    number of opponent Workers that neighbor your Workers.`;
  public static buttonText = 'Move Opponent';
  public static attrs: attrsType = {
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
    if (!char.attrs.specialUsed) {
      char.buttonActive = this.checkForValidSpecial(G, ctx, player, char);
    }
  }

  private static checkForValidSpecial(
    G: GameState, 
    ctx: Ctx,
    player: Player, 
    char: Character
  ) : boolean {
    char.attrs.specialActive = true;
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

    char.attrs.specialActive = false
    return returnValue;
  }

  public static buttonPressed(
    G: GameState,
    ctx: Ctx,
    player: Player,
    char: Character
  ) : void {
    char.attrs.specialActive = !char.attrs.specialActive;

    if (char.attrs.specialUsed) {
      char.buttonActive = false;
      char.attrs.specialActive = false;
      char.buttonText = 'Move Opponent'
    }
    else if (char.attrs.specialActive) {
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

    if (char.attrs.specialActive) {
      let adjacents : number[] = get_adjacent_positions(originalPos);
      if (!char.attrs.movingOpponent) {
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

    if (char.attrs.specialActive) {
      char.attrs.specialUsed = true;
      char.buttonText = 'End Ability';

      if (!char.attrs.movingOpponent) {
        char.attrs.movingOpponent = true;
        char.attrs.workerToMovePos = pos;
        return 'move';
      }
      else {
        char.attrs.movingOpponent = false;
        const oppWorkerNum = G.spaces[char.attrs.workerToMovePos].inhabitant.workerNum;
        Board.free(G, char.attrs.workerToMovePos);
        Board.place(G, pos, player.opponentId, oppWorkerNum);

        if (!this.checkForValidSpecial(G, ctx, player, char)) {
          char.attrs.specialActive = false;
          char.buttonText = 'Move Opponent';
          char.buttonActive = false;
        }
        else {
          char.attrs.specialActive = true;
        }

        return 'move';
      }
    }
    else {
      char.buttonActive = false;
      char.attrs.specialActive = false;
      return super.move(G, ctx, player, char, pos);
    }
  }
}