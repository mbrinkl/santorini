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

describe('moves', () => {
  beforeEach(() => {
    p0 = Client({ ...game, playerID: '0' });
    p1 = Client({ ...game, playerID: '1' });

    p0.start();
    p1.start();
  });

  describe('ready', () => {
    it('should set player ready status', () => {
      p0.moves.ready(true);

      const state = p0.getState();

      expect(state?.G.players['0'].ready).toBeTruthy();
    });
  });

  describe('setChar', () => {
    it('should update the charState name for each player', () => {
      p0.moves.setChar('Apollo');
      p1.moves.setChar('Hermes');

      const state = p0.getState();

      expect(state?.G.players['0'].charState.name).toBe('Apollo');
      expect(state?.G.players['1'].charState.name).toBe('Hermes');
    });

    it('should unready a ready player', () => {
      p0.moves.ready(true);
      p0.moves.setChar('Hermes');

      const state = p0.getState();

      expect(state?.G.players['0'].ready).toBeFalsy();
    });
  });
});
