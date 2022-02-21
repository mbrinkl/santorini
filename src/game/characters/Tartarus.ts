import { tryEndGame } from '../winConditions';
import { Mortal } from './Mortal';
import { Character } from '../../types/CharacterTypes';
import { Board } from '../boardUtil';

export const Tartarus: Character = {
  ...Mortal,

  data: {
    ...Mortal.data,
    desc: [
      `Setup: Place your Workers first. After all players' Workers are placed, 
        secretly place your Abyss Token on an unoccupied space. 
        This space is the Abyss.`,
      `Lose Condition: If any player's Worker enters the Abyss, 
        they immediately lose. Workers cannot win by entering the Abyss.`,
    ],
    pack: 'gf',
    hasAfterBoardSetup: true,
    turnOrder: 0,
  },

  validSetup: (context, charState) => Mortal.validPlace(context, charState),

  setup: ({ G, playerID }, charState, pos) => {
    Board.placeToken(G, pos, {
      playerID,
      obstructing: 'none',
      secret: true,
      removable: false,
      color: 'black',
    });
    return 'end';
  },

  tokenEffects: (context, charState, pos) => {
    const { G } = context;
    const { inhabitant } = G.spaces[pos];
    if (inhabitant) {
      tryEndGame(context, G.players[inhabitant.playerID].opponentID);
    }
  },
};
