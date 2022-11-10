import { _ClientImpl } from 'boardgame.io/dist/types/src/client/client';
import { GameState } from '../../types/gameTypes';
import { initializeTestPlayers } from '../../util/testHelpers';

let p0: _ClientImpl<GameState>;
let p1: _ClientImpl<GameState>;

describe('Pan', () => {
  beforeEach(() => {
    [p0, p1] = initializeTestPlayers('Pan', 'Mortal', {
      6: { height: 1 },
      7: { height: 2 },
      11: { height: 3 },
      12: { height: 3, isDomed: true },
    });
  });

  it.each([
    [7, 2],
    [11, 6],
    [11, 10],
  ])('should win when moving down 2 or greater height', (from, to) => {
    p0.moves.place(from);
    p0.moves.place(22);
    p0.moves.endTurn();

    p1.moves.place(23);
    p1.moves.place(24);
    p1.moves.endTurn();

    p0.moves.select(from);
    p0.moves.move(to);

    const state = p0.getState();

    expect(state?.ctx?.gameover?.winner).toBe('0');
  });

  it.each([
    [0, 1],
    [6, 5],
    [7, 6],
    [11, 7],
  ])('should not win when moving down 1 or no height', (from, to) => {
    p0.moves.place(from);
    p0.moves.place(22);
    p0.moves.endTurn();

    p1.moves.place(23);
    p1.moves.place(24);
    p1.moves.endTurn();

    p0.moves.select(from);
    p0.moves.move(to);

    const state = p0.getState();

    expect(state?.ctx?.gameover).toBeUndefined();
  });
});
