import { _ClientImpl } from 'boardgame.io/dist/types/src/client/client';
import { GameState } from '../../types/gameTypes';
import { initializeTestPlayers } from '../../util/testHelpers';

let p0: _ClientImpl<GameState>;
let p1: _ClientImpl<GameState>;

describe('Helios', () => {
  it('should restrict opponent from winning on a central space', () => {
    [p0, p1] = initializeTestPlayers('Mortal', 'Helios', {
      5: { height: 2 },
      6: { height: 3 },
    });

    p0.moves.place(5);
    p0.moves.place(22);
    p0.moves.endTurn();

    p1.moves.place(23);
    p1.moves.place(24);
    p1.moves.endTurn();

    p0.moves.select(5);
    p0.moves.move(6);

    const state = p0.getState();

    expect(state?.ctx?.gameover).toBeUndefined();
  });

  describe('center dome win condition', () => {
    beforeEach(() => {
      [p0, p1] = initializeTestPlayers('Helios', 'Mortal', {
        12: { height: 3 },
      });
      p0.moves.place(6);
      p0.moves.place(23);
      p0.moves.endTurn();

      p1.moves.place(7);
      p1.moves.place(24);
      p1.moves.endTurn();
    });

    it('should win if there is a dome in center at end of his turn', () => {
      p0.moves.select(6);
      p0.moves.move(11);
      p0.moves.build(12);
      p0.moves.endTurn();

      const state = p0.getState();

      expect(state?.G.spaces[12].isDomed).toBeTruthy();
      expect(state?.ctx?.gameover?.winner).toBe('0');
    });

    it('should not win if there is a dome in center at end of opponent turn', () => {
      p0.moves.select(6);
      p0.moves.move(0);
      p0.moves.build(1);
      p0.moves.endTurn();

      p1.moves.select(7);
      p1.moves.move(8);
      p1.moves.build(12);
      p1.moves.endTurn();

      const state = p0.getState();

      expect(state?.G.spaces[12].isDomed).toBeTruthy();
      expect(state?.ctx?.gameover).toBeUndefined();
    });
  });
});
