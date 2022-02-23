import { tryEndGame } from '../gameUtil';
import { GameContext } from '../../types/gameTypesTemp';
import { Character } from '../../types/characterTypesTemp';
import { Mortal } from './Mortal';
import { posIsPerimeter } from '../posUtil';

function checkWinCondition(context: GameContext, heliosPlayerID: string) {
  const middleSpace = context.G.spaces[12];

  if (middleSpace.isDomed) {
    tryEndGame(context, heliosPlayerID);
  }
}

export const Helios: Character = {
  ...Mortal,

  data: {
    ...Mortal.data,
    desc: [
      `Win Restriction: Opponents Workers cannot win by moving when they move
        into one of the 9 central spaces.`,
      `Win Condition: You also win if there is a dome in the center space at 
        the end of your turn.`,
    ],
    pack: 'custom',
  },

  onTurnEnd: (context, charState) => {
    checkWinCondition(context, context.playerID);
  },

  restrictOpponentWin: ({ G }, charState, fromPos, pos) => !posIsPerimeter(pos),
};
