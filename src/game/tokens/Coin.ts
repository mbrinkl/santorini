import { Token } from '../../types/gameTypes';

export const Coin: Token = {
  create: (playerID) => ({
    tokenName: 'Coin',
    playerID,
    obstructing: 'opponent',
    isRemovable: false,
    isSecret: false,
    color: 'yellow',
  }),
};
