import { tryEndGame } from '../winConditions';
import { Mortal } from './Mortal';
import { Character, CharacterState } from '../../types/CharacterTypes';
import { Token } from '../../types/GameTypes';
import { Board } from '../boardUtil';

interface TartarusAttrs {
  placedToken: boolean;
}

export const Tartarus: Character<TartarusAttrs> = {
  ...Mortal,
  desc: `Setup: Place your Workers first. After all players' Workers are placed, secretly place your Abyss Token
    on an unoccupied space. This space is the Abyss. Lose Condition: If any player's Worker enters the
    Abyss, they immediately lose. Workers cannot win by entering the Abyss.
  Banned VS: Bia, Hecate, Moerae`,
  turnOrder: 1,
  attrs: {
    placedToken: false,
  },

  validPlace: (context, charState: CharacterState<TartarusAttrs>) => {
    const { G } = context;
    const valids = Mortal.validPlace(context, charState);

    valids.forEach((pos) => {
      if (G.spaces[pos].tokens.length > 0) {
        valids.delete(pos);
      }
    });

    return valids;
  },

  place: (context, charState: CharacterState<TartarusAttrs>, pos) => {
    if (!charState.attrs.placedToken) {
      const { G, playerID } = context;
      const token: Token = {
        playerID, obstructing: 'none', secret: true, removable: false, color: 'black',
      };
      Board.placeToken(G, pos, token);
      charState.attrs.placedToken = true;
    } else {
      Mortal.place(context, charState, pos);
    }
  },

  tokenEffects: (context, charState, pos) => {
    const { G } = context;
    const { inhabitant } = G.spaces[pos];
    if (inhabitant) {
      tryEndGame(context, G.players[inhabitant.playerID].opponentID);
    }
  },
};
