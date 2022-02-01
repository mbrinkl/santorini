import { GameContext } from '../types/GameTypes';
import { getCharacter } from './characters';

export function checkWinByTrap(context: GameContext) {
  const { G, playerID, events } = context;
  const nextPlayer = G.players[G.players[playerID].opponentID];
  const { charState } = nextPlayer;

  const character = getCharacter(charState);

  if (!character.hasValidMoves({ ...context, playerID: nextPlayer.ID }, charState)) {
    events.endGame({
      winner: nextPlayer.opponentID,
    });
  }
}

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
