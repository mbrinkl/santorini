import 'dotenv/config';
import path from 'path';
import serve from 'koa-static';
import sslify, { xForwardedProtoResolver as resolver } from 'koa-sslify';
import { historyApiFallback } from 'koa2-connect-history-api-fallback';
import * as Sentry from '@sentry/node';
import { Server, Origins } from 'boardgame.io/server';
import { DEFAULT_PORT, isProduction } from '../src/config';
import { SantoriniGame } from '../src/game';

const root = path.join(__dirname, '../build');
const PORT = Number(process.env.PORT || DEFAULT_PORT);
const serverURL = isProduction ? 'https://santorini.herokuapp.com/' : 'http://192.168.0.140:3000';

const server = Server({
  games: [SantoriniGame],
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

const day = 24 * 60 * 60 * 1000;
async function deleteStaleGames() {
  const weekAgo = Date.now() - 7 * day;
  // Retrieve matchIDs for matches unchanged for > 1 week.
  const staleMatchIDs = await server.db.listMatches({
    where: {
      updatedBefore: weekAgo,
    },
  });
  // Delete matches
  for (let i = 0; i < staleMatchIDs.length; i++) {
    server.db.wipe(staleMatchIDs[i]);
  }
}
setInterval(deleteStaleGames, day);
