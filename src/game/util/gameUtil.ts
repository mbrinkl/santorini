import { GameContext } from '../../types/gameTypes';

/**
 * Immediately end the turn if possible
 */
export function tryEndTurn(context: GameContext) {
  const { G, events } = context;
  if (!G.isDummy) {
    events.endTurn();
  }
}

/**
 * Immediately end the game if possible
 */
export function tryEndGame(context: GameContext, winner: string) {
  const { G, events } = context;
  if (!G.isDummy) {
    events.endGame({
      winner,
    });
  }
}
