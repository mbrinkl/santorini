import { Token } from '../../types/gameTypes';
import * as Tokens from '../tokens';

export function getTokenByName(name: string): Token | undefined {
  switch (name) {
    case 'Abyss':
      return Tokens.Abyss;
    case 'Coin':
      return Tokens.Coin;
    default:
      return undefined;
  }
}
