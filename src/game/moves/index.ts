import { Ctx } from "boardgame.io";
import { GameState, Player } from "../../types/GameTypes";
import { getCharacter } from "../characters";
import { Character, Worker } from '../../types/CharacterTypes';
import { Board } from "../space";

export function updateValids(G: GameState, ctx: Ctx, player: Player, stage: string) {
  const currChar = player.char;
  const char: Character = getCharacter(currChar.name);

  switch (stage) {
    case "place":
      G.valids = char.validPlace(G, ctx, player, currChar);
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

export const CharacterAbility = (G: GameState, ctx: Ctx) => {
  const currPlayer = G.players[ctx.currentPlayer];
  const currChar = currPlayer.char;

  const char: Character = getCharacter(currChar.name);

  const stage = char.buttonPressed(G, ctx, currPlayer, currChar);
  ctx.events?.setStage(stage);

  updateValids(G, ctx, currPlayer, stage);
};

export const EndTurn = (G: GameState, ctx: Ctx) => {
  ctx.events?.endTurn();
};

export function CheckWinByTrap(G: GameState, ctx: Ctx) {
  const nextPlayer = G.players[G.players[ctx.currentPlayer].opponentId];
  const currChar = nextPlayer.char;

  const char: Character = getCharacter(currChar.name);

  if (!char.hasValidMoves(G, ctx, nextPlayer, currChar)) {
    ctx.events?.endGame!({
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

  const char: Character = getCharacter(currChar.name);

  if (char.checkWinByMove(G, currChar, heightBefore, heightAfter)) {
    ctx.events?.endGame!({
      winner: ctx.currentPlayer
    })
  }
}

export function Place(G: GameState, ctx: Ctx, pos: number) {

  const currentChar = G.players[ctx.currentPlayer].char;

  const worker: Worker = {
    pos: pos,
    height: G.spaces[pos].height,
  };

  currentChar.workers.push(worker);
  Board.place(G, pos, ctx.currentPlayer, currentChar.workers.length - 1);

  if (--currentChar.numWorkersToPlace === 0) {
    ctx.events?.setStage('end');
  }

  updateValids(G, ctx, G.players[ctx.currentPlayer], 'place');
}

export function Select(G: GameState, ctx: Ctx, pos: number) {
  const currPlayer = G.players[ctx.currentPlayer];
  const currChar = currPlayer.char;
  const char: Character = getCharacter(currChar.name);

  const stage = char.select(G, ctx, currPlayer, currChar, pos);
  ctx.events?.setStage(stage);

  updateValids(G, ctx, currPlayer, stage);
}

export function Move(G: GameState, ctx: Ctx, pos: number) {
  const currPlayer = G.players[ctx.currentPlayer];
  const currChar = currPlayer.char;

  const before_height = currChar.workers[currChar.selectedWorker].height;

  const char: Character = getCharacter(currChar.name);

  const stage = char.move(G, ctx, currPlayer, currChar, pos);
  ctx.events?.setStage(stage);

  updateValids(G, ctx, currPlayer, stage);

  const after_height = currChar.workers[currChar.selectedWorker].height;
  CheckWinByMove(G, ctx, before_height, after_height);
}

export function Build(G: GameState, ctx: Ctx, pos: number) {
  const currPlayer = G.players[ctx.currentPlayer];
  const currChar = currPlayer.char;

  const char: Character = getCharacter(currChar.name);

  const stage = char.build(G, ctx, currPlayer, currChar, pos);
  ctx.events?.setStage(stage);

  updateValids(G, ctx, currPlayer, stage);
}
