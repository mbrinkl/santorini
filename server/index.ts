import 'dotenv/config';
import path from 'path';
import serve from 'koa-static';
import { historyApiFallback } from 'koa2-connect-history-api-fallback';
import { Server, Origins } from 'boardgame.io/server';
import { DEFAULT_PORT } from '../src/config';
import { SantoriniGame } from '../src/game';
import { getDb } from './storage';
import { setupServerJobs } from './jobs';

const server = Server({
  games: [SantoriniGame],
  db: getDb(),
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
