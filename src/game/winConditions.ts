import { Ctx } from 'boardgame.io';
import { EventsAPI } from 'boardgame.io/dist/types/src/plugins/plugin-events';
import { Character } from '../types/CharacterTypes';
import { GameState } from '../types/GameTypes';
import { getCharacter } from './characters';

export function checkWinByTrap(G: GameState, ctx: Ctx, events: EventsAPI) {
  const nextPlayer = G.players[G.players[ctx.currentPlayer].opponentId];
  const currChar = nextPlayer.char;

  const char: Character = getCharacter(currChar.name);

  if (!char.hasValidMoves(G, ctx, nextPlayer, currChar)) {
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

  const char: Character = getCharacter(currChar.name);

  if (char.checkWinByMove(G, currChar, heightBefore, heightAfter)) {
    events.endGame({
      winner: ctx.currentPlayer,
    });
  }
}
