import { GameContext } from '../types/GameTypes';
import { getCharacter } from './characters';

/**
 * Check if a player wins after moving
 */
export function checkWinByMove(context: GameContext, posBefore: number, posAfter: number) {
  const { G, playerID, events } = context;
  const { charState, opponentID } = G.players[playerID];

  const character = getCharacter(charState);
  const opponentCharacter = getCharacter(G.players[opponentID].charState);

  const winRestricted = opponentCharacter.restrictOpponentWin(
    context,
    G.players[opponentID].charState,
    posBefore,
    posAfter,
  );

  if (!winRestricted && character.checkWinByMove(context, charState, posBefore, posAfter)) {
    events.endGame({
      winner: playerID,
    });
  }
}

/**
 * Immediately end the turn if possible
 */
export function tryEndTurn(context: GameContext) {
  const { G, events } = context;
  if (!G.isClone) {
    events.endTurn();
  }
}

/**
 * Immediately end the game if possible
 */
export function tryEndGame(context: GameContext, winner: string) {
  const { G, events } = context;
  if (!G.isClone) {
    events.endGame({
      winner,
    });
  }
}
