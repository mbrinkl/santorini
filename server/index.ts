import 'dotenv/config';
import path from 'path';
import serve from 'koa-static';
import sslify, { xForwardedProtoResolver as resolver } from 'koa-sslify';
import { historyApiFallback } from 'koa2-connect-history-api-fallback';
import * as Sentry from '@sentry/node';
import { Server, Origins } from 'boardgame.io/server';
import { PostgresStore } from 'bgio-postgres';
import { DEFAULT_PORT, isProduction } from '../src/config';
import { SantoriniGame } from '../src/game';
import { ExtendedStorageCache } from './storage';

const root = path.join(__dirname, '../build');
const PORT = Number(process.env.PORT || DEFAULT_PORT);
const serverURL = isProduction ? 'https://santorini.herokuapp.com/' : 'http://192.168.0.140:3000';

const server = Server({
  games: [SantoriniGame],
  db: new ExtendedStorageCache(new PostgresStore({
    database: process.env.DB,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    host: process.env.DB_HOST,
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
  })),
  origins: [
    serverURL,
    Origins.LOCALHOST_IN_DEVELOPMENT,
  ],
});

Sentry.init({ dsn: process.env.SENTRY_DSN });

server.app.on('error', (err, ctx) => {
  Sentry.withScope((scope) => {
    scope.addEventProcessor((event) => Sentry.Handlers.parseRequest(event, ctx.request));
    Sentry.captureException(err);
  });
});

if (isProduction) {
  server.app.use(sslify({ resolver }));
}
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
