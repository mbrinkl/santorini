import { Mortal } from './Mortal';
import { Character, CharacterState } from '../../types/CharacterTypes';
import { Board } from '../boardUtil';
import { Token } from '../../types/GameTypes';

interface ClioAttrs {
  numTokens: number
}

export const Clio: Character<ClioAttrs> = {
  ...Mortal,
  desc: `Your Build: Place a Coin Token on each of the first 3 blocks your Workers build.
    Opponent’s Turn: Opponents treat spaces containing your Coin Tokens as if they contain
    only a dome`,
  attrs: {
    numTokens: 3,
  },

  build: (context, charState: CharacterState<ClioAttrs>, pos) => {
    const { G, playerID } = context;
    Mortal.build(context, charState, pos);

    // Remove coin
    G.spaces[pos].tokens = G.spaces[pos].tokens.filter((token) => token.playerID !== playerID);

    if (charState.attrs.numTokens > 0) {
      const token: Token = {
        playerID, obstructing: 'opponent', removable: false, secret: false,
      };
      Board.placeToken(G, pos, token);
      charState.attrs.numTokens -= 1;
    }
  },
};
