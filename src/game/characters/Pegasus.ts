import { Mortal } from './Mortal';
import { GameState } from '../index'
import { Character } from '.';

export const Pegasus: Character = {
  ...Mortal,
  name: 'Pegasus',
  desc: `Your Move: Your Worker may move up more than one level, but cannot win the game by doing so.`,
  moveUpHeight: 3,

  checkWinByMove: (G: GameState, heightBefore: number, heightAfter: number) => {
    return (heightBefore === 2 && heightAfter === 3)
  },
}