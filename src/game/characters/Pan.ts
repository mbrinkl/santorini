import { Mortal } from './Mortal';
import { GameState } from '../index'
import { Character } from '.';

export const Pan: Character = {
  ...Mortal,
  name: 'Pan',
  desc: `Win Condition: You also win if your Worker moves down two or more levels.`,

  checkWinByMove: (G: GameState, heightBefore: number, heightAfter: number) => {
    return (heightBefore < 3 && heightAfter === 3) ||
      (heightBefore - heightAfter > 1)
  },
}