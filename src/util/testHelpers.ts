import { Local } from 'boardgame.io/multiplayer';
import { Client } from 'boardgame.io/client';
import {
  ClientOpts,
  _ClientImpl,
} from 'boardgame.io/dist/types/src/client/client';
import { initBoard, SantoriniGame } from '../game';
import { GameState } from '../types/gameTypes';

interface SpacesSetup {
  height: number;
  isDomed?: boolean;
}

export const initializeTestPlayers = (
  p0char: string,
  p1char: string,
  spacesSetup?: Record<number, SpacesSetup>,
): [_ClientImpl<GameState>, _ClientImpl<GameState>] => {
  const spaces = initBoard();

  if (spacesSetup) {
    Object.keys(spacesSetup).forEach((keyString) => {
      const key = Number(keyString);
      spaces[Number(key)].height = spacesSetup[key].height;
      spaces[Number(key)].isDomed = spacesSetup[key].isDomed ?? false;
    });
  }

  const spec: ClientOpts<GameState> = {
    game: {
      ...SantoriniGame,
      setup: (context) => ({
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        ...SantoriniGame.setup!(context),
        spaces,
      }),
    },
    multiplayer: Local(),
  };

  const p00 = Client({ ...spec, playerID: '0' });
  const p11 = Client({ ...spec, playerID: '1' });

  p00.start();
  p11.start();

  p00.moves.setChar(p0char);
  p11.moves.setChar(p1char);
  p00.moves.ready(true);
  p11.moves.ready(true);

  return [p00, p11];
};
