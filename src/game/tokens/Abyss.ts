import { Token } from '../../types/gameTypes';
import { tryEndGame } from '../util/gameUtil';

export const Abyss: Token = {
  create: (playerID) => ({
    tokenName: 'Abyss',
    playerID,
    obstructing: 'none',
    isSecret: true,
    isRemovable: false,
    color: 'black',
  }),

  effects: (context, tokenState, pos) => {
    const { G } = context;
    const { inhabitant } = G.spaces[pos];
    if (inhabitant) {
      tryEndGame(context, G.players[inhabitant.playerID].opponentID);
    }
  },
};
