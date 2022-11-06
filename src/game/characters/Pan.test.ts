import { Client } from 'boardgame.io/client';
import {
  ClientOpts,
  _ClientImpl,
} from 'boardgame.io/dist/types/src/client/client';
import { Local } from 'boardgame.io/multiplayer';
import { initBoard, SantoriniGame } from '..';
import { GameState } from '../../types/gameTypes';

let p0: _ClientImpl<GameState>;
let p1: _ClientImpl<GameState>;

const Scenarios = {
  /**
   *  0  0  0  0  0
   *  0  1  2  0  0
   *  0  3  4  0  0
   *  0  0  0  0  0
   *  0  0  0  0  0
   */
  oneOfEveryHeight: () => {
    const spaces = initBoard();
    spaces[6].height = 1;
    spaces[7].height = 2;
    spaces[11].height = 3;
    spaces[12].height = 4;
    spaces[12].isDomed = true;
    return spaces;
  },
};

describe('Pan', () => {
  beforeEach(() => {
    const spec: ClientOpts<GameState> = {
      game: {
        ...SantoriniGame,
        setup: (context) => ({
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          ...SantoriniGame.setup!(context),
          spaces: Scenarios.oneOfEveryHeight(),
        }),
      },
      multiplayer: Local(),
    };

    p0 = Client({ ...spec, playerID: '0' });
    p1 = Client({ ...spec, playerID: '1' });

    p0.start();
    p1.start();

    p0.moves.setChar('Pan');
    p1.moves.setChar('Mortal');
    p0.moves.ready(true);
    p1.moves.ready(true);
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
