import { Ctx } from 'boardgame.io';
import { EventsAPI } from 'boardgame.io/dist/types/src/plugins/plugin-events';
import { GameContext, GameState } from '../types/GameTypes';
import { getCharacter } from './characters';

export function checkWinByTrap(context: GameContext) {
  const { G, playerID, events } = context;
  const nextPlayer = G.players[G.players[playerID].opponentID];
  const { charState } = nextPlayer;

  const character = getCharacter(charState.name);

  if (!character.hasValidMoves({ ...context, playerID: nextPlayer.ID }, charState)) {
    events.endGame({
      winner: nextPlayer.opponentID,
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
  const { charState } = G.players[ctx.currentPlayer];

  const character = getCharacter(charState.name);

  if (character.checkWinByMove(G, charState, heightBefore, heightAfter)) {
    events.endGame({
      winner: ctx.currentPlayer,
    });
  }
}
