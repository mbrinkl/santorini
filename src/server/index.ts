import path from "path";
import serve from "koa-static";
import { historyApiFallback } from "koa2-connect-history-api-fallback";
import { Server, Origins } from "boardgame.io/server";
import { DEFAULT_PORT } from "../config";
import { SantoriniGame } from "../game";

const root = path.join(__dirname, "../../build");
const PORT = Number(process.env.PORT || DEFAULT_PORT);

const server = Server({
  games: [SantoriniGame],
  origins: [
    "http://santorini.herokuapp.com/",
    Origins.LOCALHOST_IN_DEVELOPMENT,
  ],
});

server.app.use(
  historyApiFallback({
    index: "index.html",
    whiteList: ["/api", "/games", "/.well-known"],
  })
);
server.app.use(serve(root));

server.run(PORT, () => {
  console.log(`Serving at: http://localhost:${PORT}/`);
});
