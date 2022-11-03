import { Mortal } from './Mortal';
import { Board } from '../util/boardUtil';
import { Character, Token } from '../../types/gameTypes';

type ClioAttrs = {
  numTokens: number;
};

export const Clio: Character<ClioAttrs> = {
  ...Mortal,

  data: {
    ...Mortal.data,
    desc: [
      `Your Build: Place a Coin Token on each of the first
        3 blocks your Workers build.`,
      `Opponent’s Turn: Opponents treat spaces containing your
        Coin Tokens as if they contain only a dome`,
    ],
    pack: 'gf',
    attrs: {
      numTokens: 3,
    },
  },

  build: (context, charState, pos) => {
    const { G, playerID } = context;
    Mortal.build(context, charState, pos);

    // Remove coin
    G.spaces[pos].tokens = G.spaces[pos].tokens.filter(
      (token) => token.playerID !== playerID,
    );

    if (charState.attrs.numTokens > 0) {
      const token: Token = {
        playerID,
        obstructing: 'opponent',
        isRemovable: false,
        isSecret: false,
        color: 'yellow',
      };
      Board.placeToken(G, pos, token);
      charState.attrs.numTokens -= 1;
    }
  },
};
