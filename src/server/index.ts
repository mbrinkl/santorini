import path from 'path';
import serve from 'koa-static';
import { historyApiFallback } from 'koa2-connect-history-api-fallback';
import { Server, Origins } from 'boardgame.io/server';
import { DEFAULT_PORT, isProduction } from '../config';
import { SantoriniGame } from '../game';

const root = path.join(__dirname, '../../build');
const PORT = Number(process.env.PORT || DEFAULT_PORT);
const serverURL = isProduction ? 'http://santorini.herokuapp.com/' : 'http://192.168.0.140:3000';

const server = Server({
  games: [SantoriniGame],
  origins: [
    serverURL,
    Origins.LOCALHOST_IN_DEVELOPMENT,
  ],
});

server.app.use(
  historyApiFallback({
    index: 'index.html',
    whiteList: ['/api', '/games', '/.well-known'],
  }),
);
server.app.use(serve(root));

server.run(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Serving at: http://localhost:${PORT}/`);
});

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
