import 'dotenv/config';
import path from 'path';
import serve from 'koa-static';
import { historyApiFallback } from 'koa2-connect-history-api-fallback';
import { Server, Origins } from 'boardgame.io/server';
import { PostgresStore } from 'bgio-postgres';
import { DEFAULT_PORT, isProduction } from '../src/config';
import { SantoriniGame } from '../src/game';
import { ExtendedStorageCache } from './storage';

const root = path.join(__dirname, '../build');
const PORT = Number(process.env.PORT || DEFAULT_PORT);
const serverURL = isProduction
  ? 'https://santorini.onrender.com/'
  : 'http://192.168.0.140:3000';

const server = Server({
  games: [SantoriniGame],
  db: new ExtendedStorageCache(
    new PostgresStore({
      database: process.env.DB,
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      host: process.env.DB_HOST,
      logging: false,
    }),
  ),
  origins: [serverURL, Origins.LOCALHOST_IN_DEVELOPMENT],
});

server.app.use(
  historyApiFallback({
    index: 'index.html',
    whiteList: ['/games', '/.well-known'],
  }),
);
server.app.use(serve(root));

server.run(PORT);

const hour = 60 * 60 * 1000;
const day = 24 * hour;
// Delete games that have not been updated for 1 day and are not complete
async function deleteStaleGames() {
  const dayAgo = Date.now() - day;
  const staleMatchIDs = await server.db.listMatches({
    where: {
      updatedBefore: dayAgo,
      isGameover: false,
    },
  });
  staleMatchIDs.forEach((matchID) => {
    server.db.wipe(matchID);
  });
}
setInterval(deleteStaleGames, hour);
