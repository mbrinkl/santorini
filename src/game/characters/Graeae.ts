import { union } from 'lodash'
import { Mortal, Character } from '.'
import { GameState, Player } from '../index'
import { Ctx } from 'boardgame.io';
import { getAdjacentPositions } from '../utility';

export class Graeae extends Mortal {

  public static desc = `Setup: When placing your Workers, place 3 of your color.\n
    Your Build: Build with a Worker that did not Move.\n
    Banned VS: Nemesis`;
  public static numWorkers = 3;

  public static validBuild(
    G: GameState, 
    ctx: Ctx,
    player: Player, 
    char: Character,
    originalPos: number
  ) : number[] {
    let adjacents : number[] = [];
    let valids : number[] = []
  
    for (let i = 0; i < char.numWorkers; i++) {
      if (i !== char.selectedWorker)
        // add on the adjacent positions of each worker
        adjacents = union(adjacents, getAdjacentPositions(char.workers[i].pos));
    }

    adjacents.forEach( pos => {
      if (!G.spaces[pos].inhabited && !G.spaces[pos].is_domed) {
        valids.push(pos);
      }
    })
  
    return valids;
  }
}