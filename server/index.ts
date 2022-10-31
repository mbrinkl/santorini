import 'dotenv/config';
import path from 'path';
import chalk from 'chalk';
import serve from 'koa-static';
import { historyApiFallback } from 'koa2-connect-history-api-fallback';
import { Server, Origins } from 'boardgame.io/server';
import { PostgresStore } from 'bgio-postgres';
import { DEFAULT_PORT, isProduction } from '../src/config';
import { SantoriniGame } from '../src/game';
import { ExtendedStorageCache } from './storage';
import { setupServerJobs } from './jobs';

const connectionString = process.env.CONNECTION_STRING;
let db: ExtendedStorageCache | undefined;
if (connectionString) {
  db = new ExtendedStorageCache(
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
} else if (isProduction) {
  throw new Error('CONNECTION_STRING missing from environment variables');
} else {
  // eslint-disable-next-line no-console
  console.log(chalk.yellow('Starting server with in-memory database'));
}

const server = Server({
  games: [SantoriniGame],
  db,
  origins: [
    process.env.RENDER_EXTERNAL_URL || Origins.LOCALHOST_IN_DEVELOPMENT,
  ],
});

server.app.use(
  historyApiFallback({
    index: 'index.html',
    whiteList: ['/games', '/.well-known'],
  }),
);
server.app.use(serve(path.join(__dirname, '../dist')));

server.run(Number(process.env.PORT || DEFAULT_PORT));

setupServerJobs(server.db);
