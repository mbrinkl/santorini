import { INVALID_MOVE } from "boardgame.io/core";
import { Ctx } from "boardgame.io";
import { GameState, Player } from "../index";
import { Worker, getCharacter } from "../characters";
import { Board } from "../space";

function updateValids(G: GameState, ctx: Ctx, player: Player) {
  const currChar = player.char;

  const char: any = getCharacter(currChar.name);

  switch (G.stage) {
    case "place":
      let valids: number[] = [];
      for (var i = 0; i < 25; i++) {
        if (!G.spaces[i].inhabited && currChar.numWorkersToPlace > 0) {
          valids.push(i);
        }
      }
      G.valids = valids;
      break;
    case "select":
      G.valids = char.validSelect(G, ctx, player, currChar);
      break;
    case "move":
      G.valids = char.validMove(
        G,
        ctx,
        player,
        currChar,
        currChar.workers[currChar.selectedWorker].pos
      );
      break;
    case "build":
      G.valids = char.validBuild(
        G,
        ctx,
        player,
        currChar,
        currChar.workers[currChar.selectedWorker].pos
      );
      break;
    default:
      G.valids = [];
      break;
  }
}

export const CharButtonPressed = (G: GameState, ctx: Ctx) => {
  const currPlayer = G.players[ctx.currentPlayer];
  const currChar = currPlayer.char;

  const char: any = getCharacter(currChar.name);

  char.buttonPressed(G, ctx, currPlayer, currChar);
  updateValids(G, ctx, currPlayer);
};

export const EndTurn = (G: GameState, ctx: Ctx) => {
  // ctx.currentPlayer not updated after endturn immediately
  const currPlayer = G.players[ctx.currentPlayer];
  const nextPlayer = G.players[G.players[ctx.currentPlayer].opponentId];

  const charCurr: any = getCharacter(currPlayer.char.name);
  const charNext: any = getCharacter(nextPlayer.char.name);

  charCurr.onTurnEnd(G, ctx, currPlayer, currPlayer.char);

  // end the turn
  ctx.events!.endTurn!();
  G.canEndTurn = false;

  // to avoid changing to select stage during the place stage at beginning of game
  if (G.stage === "end") {
    G.stage = "select";
    updateValids(G, ctx, nextPlayer);

    G.players["0"].char.selectedWorker = -1;
    G.players["1"].char.selectedWorker = -1;

    CheckWinByTrap(G, ctx);

    charNext.onTurnBegin(G, ctx, nextPlayer, nextPlayer.char);
  }

  // just update the valids if in the place stage
  else if (G.stage === "place") {
    updateValids(G, ctx, nextPlayer);
  }
};

function CheckWinByTrap(G: GameState, ctx: Ctx) {
  const nextPlayer = G.players[G.players[ctx.currentPlayer].opponentId];
  const currChar = nextPlayer.char;

  const char: any = getCharacter(currChar.name);

  if (!char.hasValidMoves(G, ctx, nextPlayer, currChar)) {
    ctx.events!.endGame!({
      winner: nextPlayer.opponentId
    })
  }
}

function CheckWinByMove(
  G: GameState,
  ctx: Ctx,
  heightBefore: number,
  heightAfter: number
) {
  const currPlayer = G.players[ctx.currentPlayer];
  const currChar = currPlayer.char;

  const char: any = getCharacter(currChar.name);

  if (char.checkWinByMove(G, heightBefore, heightAfter)) {
    ctx.events!.endGame!({
      winner: ctx.currentPlayer
    })
  }
}

export const SelectSpace = {
  move: (G: GameState, ctx: Ctx, pos: number) => {
    if (G.valids.includes(pos)) {
      switch (G.stage) {
        case "place":
          Place(G, ctx, pos);
          break;
        case "select":
          Select(G, ctx, pos);
          break;
        case "move":
          Move(G, ctx, pos);
          break;
        case "build":
          Build(G, ctx, pos);
          break;
      }
    } else {
      return INVALID_MOVE;
    }
  },
};

function Place(G: GameState, ctx: Ctx, pos: number) {
  const currentChar = G.players[ctx.currentPlayer].char;

  const worker: Worker = {
    pos: pos,
    height: G.spaces[pos].height,
  };

  currentChar.workers.push(worker);
  Board.place(G, pos, ctx.currentPlayer, currentChar.workers.length - 1);

  if (--currentChar.numWorkersToPlace === 0) {
    G.canEndTurn = true;

    if (
      G.players["0"].char.numWorkersToPlace === 0 &&
      G.players["1"].char.numWorkersToPlace === 0
    ) {
      G.stage = "end";
    }
  }

  updateValids(G, ctx, G.players[ctx.currentPlayer]);
}

function Select(G: GameState, ctx: Ctx, pos: number) {
  const currPlayer = G.players[ctx.currentPlayer];
  const currChar = currPlayer.char;
  const char: any = getCharacter(currChar.name);

  G.stage = char.select(G, ctx, currPlayer, currChar, pos);
  updateValids(G, ctx, currPlayer);
}

function Move(G: GameState, ctx: Ctx, pos: number) {
  const currPlayer = G.players[ctx.currentPlayer];
  const currChar = currPlayer.char;

  const before_height = currChar.workers[currChar.selectedWorker].height;

  const char: any = getCharacter(currChar.name);

  G.stage = char.move(G, ctx, currPlayer, currChar, pos);
  updateValids(G, ctx, currPlayer);

  const after_height = currChar.workers[currChar.selectedWorker].height;
  CheckWinByMove(G, ctx, before_height, after_height);
}

function Build(G: GameState, ctx: Ctx, pos: number) {
  const currPlayer = G.players[ctx.currentPlayer];
  const currChar = currPlayer.char;

  const char: any = getCharacter(currChar.name);

  G.stage = char.build(G, ctx, currPlayer, currChar, pos);
  updateValids(G, ctx, currPlayer);

  if (G.stage === "end") {
    G.canEndTurn = true;
  }
}
