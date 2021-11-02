import { Ctx } from 'boardgame.io';
import { Character, CharacterState } from ".";
import { Mortal } from "./Mortal";
import { GameState, Player } from '../index'

export const Zeus: Character = {
  ...Mortal,
  name: 'Zeus',
  desc: `Your Build: Your Worker may build a block under itself.`,

  checkWinByMove: (G: GameState, char: CharacterState, heightBefore: number, heightAfter: number) => {
    return (heightBefore < 3 && heightAfter === 3) ||
      (heightBefore - heightAfter > 1)
  },

  validBuild: (
    G: GameState, 
    ctx: Ctx,
    player: Player, 
    char: CharacterState,
    originalPos: number
  ) => {

    let valids: number[] = Mortal.validBuild(G, ctx, player, char, originalPos);

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