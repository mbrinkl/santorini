import chalk from 'chalk';
import { StorageCache } from '@boardgame.io/storage-cache';
import { PostgresStore } from 'bgio-postgres';
import { isProduction } from '../src/config';

export class ExtendedStorageCache extends StorageCache {
  /**
   * setMetadata modification: if the game is not over, strip all setupData
   *  (was facing issues with random seed staying attached in a new game
   *   after playAgain)
   */
  async setMetadata(...args: Parameters<StorageCache['setMetadata']>) {
    const [matchID, matchData] = args;

    if (matchData.gameover == null && matchData.setupData != null) {
      await super.setMetadata(matchID, { ...matchData, setupData: null });
    } else {
      await super.setMetadata(...args);
    }
  }

  /**
   * setState modification: if the game is over, attach the game's random seed
   *  and the characters' names to the game metadata
   */
  async setState(...args: Parameters<StorageCache['setState']>) {
    const [matchID, state] = args;

    await super.setState(...args);

    if (state.ctx.gameover != null) {
      const { metadata } = await this.fetch(matchID, {
        metadata: true,
      });
      const seed = state.plugins.random.data.seed as string;
      await super.setMetadata(matchID, {
        ...metadata,
        setupData: seed,
        players: {
          ...metadata.players,
          0: {
            ...metadata.players[0],
            data: { character: state.G.players[0].charState.name },
          },
          1: {
            ...metadata.players[1],
            data: { character: state.G.players[1].charState.name },
          },
        },
      });
    }
  }

  /**
   * fetch modification: if the game is over, remove all redactions so
   *  secret state is removed and game playback works properly
   */
  async fetch(...args: Parameters<StorageCache['fetch']>) {
    const gameData = await super.fetch(...args);

    if (gameData.metadata?.gameover != null && gameData.log) {
      gameData.log = gameData.log.map((logEntry) => ({
        ...logEntry,
        redact: false,
      }));
    }

    return gameData;
  }
}

export const getDb = () => {
  const connectionString = process.env.CONNECTION_STRING;

  if (!connectionString) {
    if (isProduction) {
      throw new Error('CONNECTION_STRING missing from environment variables');
    }

    // eslint-disable-next-line no-console
    console.log(chalk.yellow('Starting server with in-memory database'));
    return undefined;
  }

  return new ExtendedStorageCache(
    new PostgresStore(connectionString, {
      logging: false,
      ...(isProduction && {
        dialect: 'postgres',
        dialectOptions: {
          ssl: {
            require: true,
            rejectUnauthorized: false,
          },
        },
      }),
    }),
  );
};
