import { Client } from 'boardgame.io/client';
import { _ClientImpl } from 'boardgame.io/dist/types/src/client/client';
import { Local } from 'boardgame.io/multiplayer';
import { SantoriniGame } from '..';
import { GameState } from '../../types/gameTypes';
import { banList, characterList } from '../util/characterUtil';

let p0: _ClientImpl<GameState>;
let p1: _ClientImpl<GameState>;

const getOpponentList = (charName: string) => {
  const opponentList = characterList.filter(
    (name) => name !== charName && name !== 'Random',
  );

  const bans = banList
    .filter((ban) => ban[0] === charName || ban[1] === charName)
    .flat()
    .filter((name) => name !== charName);

  return opponentList.filter((name) => !bans.includes(name));
};

const opponentList = getOpponentList('Bia');

describe('Bia', () => {
  beforeEach(() => {
    const spec = {
      game: { ...SantoriniGame },
      multiplayer: Local(),
    };

    p0 = Client({ ...spec, playerID: '0' });
    p1 = Client({ ...spec, playerID: '1' });

    p0.start();
    p1.start();
  });

  it.each(opponentList)(
    'should have the first turn when first player (%s)',
    (opponent) => {
      p0.moves.setChar('Bia');
      p1.moves.setChar(opponent);
      p0.moves.ready(true);
      p1.moves.ready(true);

      let state = p0.getState();

      if (state?.ctx.phase !== 'boardSetup') {
        p1.moves.setup(24);
        p1.moves.endTurn();
        state = p1.getState();
      }

      expect(state?.ctx.currentPlayer).toBe('0');
    },
  );

  it.each(opponentList)(
    'should always have the first turn when second player (%s)',
    (opponent) => {
      p0.moves.setChar(opponent);
      p1.moves.setChar('Bia');
      p0.moves.ready(true);
      p1.moves.ready(true);

      let state = p0.getState();

      if (state?.ctx.phase !== 'boardSetup') {
        p0.moves.setup(24);
        p0.moves.endTurn();
        state = p0.getState();
      }

      expect(state?.ctx.currentPlayer).toBe('1');
    },
  );
});
