import { Ctx } from 'boardgame.io';
import { EventsAPI } from 'boardgame.io/dist/types/src/plugins/plugin-events';
import { GameContext, GameState } from '../types/GameTypes';
import { getCharacter } from './characters';

export function checkWinByTrap(context: GameContext) {
  const { G, playerID, events } = context;
  const nextPlayer = G.players[G.players[playerID].opponentId];
  const currChar = nextPlayer.char;

  const char = getCharacter(currChar.name);

  if (!char.hasValidMoves({ ...context, playerID: nextPlayer.id }, currChar)) {
    events.endGame({
      winner: nextPlayer.opponentId,
    });
  }
}

export function checkWinByMove(
  G: GameState,
  ctx: Ctx,
  events: EventsAPI,
  heightBefore: number,
  heightAfter: number,
) {
  const currPlayer = G.players[ctx.currentPlayer];
  const currChar = currPlayer.char;

  const char = getCharacter(currChar.name);

  if (char.checkWinByMove(G, currChar, heightBefore, heightAfter)) {
    events.endGame({
      winner: ctx.currentPlayer,
    });
  }
}
