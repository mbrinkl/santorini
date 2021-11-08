import { Ctx } from 'boardgame.io';
import { Character, CharacterState } from '../../types/CharacterTypes';
import { Mortal } from "./Mortal";
import { GameState, Player } from '../../types/GameTypes';

export const Zeus: Character = {
  ...Mortal,
  desc: `Your Build: Your Worker may build a block under itself.`,

  validBuild: (
    G: GameState, 
    ctx: Ctx,
    player: Player, 
    char: CharacterState,
    originalPos: number
  ) => {

    const valids: number[] = Mortal.validBuild(G, ctx, player, char, originalPos);

    if (char.workers[char.selectedWorker].height < 3)
      valids.push(char.workers[char.selectedWorker].pos);
  
    return valids;
  },

  build: (
    G: GameState,
    ctx: Ctx,
    player: Player, 
    char: CharacterState,
    pos: number
  ) => {
    
    if (pos === char.workers[char.selectedWorker].pos)
      char.workers[char.selectedWorker].height++;
    return Mortal.build(G, ctx, player, char, pos);
  },

}