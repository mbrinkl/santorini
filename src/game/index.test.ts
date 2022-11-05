import { Client } from 'boardgame.io/client';
import { _ClientImpl } from 'boardgame.io/dist/types/src/client/client';
import { Local } from 'boardgame.io/multiplayer';
import { SantoriniGame } from '.';
import { GameState } from '../types/gameTypes';

const game = {
  game: SantoriniGame,
  multiplayer: Local(),
};

let p0: _ClientImpl<GameState>;
let p1: _ClientImpl<GameState>;

describe('game', () => {
  beforeEach(() => {
    p0 = Client({ ...game, playerID: '0' });
    p1 = Client({ ...game, playerID: '1' });

    p0.start();
    p1.start();
  });

  describe('phases', () => {
    it('should begin with selectCharacters', () => {
      const state = p0.getState();

      expect(state?.ctx.phase).toBe('selectCharacters');
    });

    it('should go to boardSetup when all players are ready', () => {
      p0.moves.ready(true);
      p1.moves.ready(true);

      const state = p0.getState();

      expect(state?.ctx.phase).toBe('boardSetup');
    });
  });
});
