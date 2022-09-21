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
  ? process.env.RENDER_EXTERNAL_URL
  : 'http://192.168.0.140:3000';

const server = Server({
  games: [SantoriniGame],
  db: new ExtendedStorageCache(
    new PostgresStore(String(process.env.CONNECTION_STRING), {
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
