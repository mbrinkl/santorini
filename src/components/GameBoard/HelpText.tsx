import { useBoardContext } from './BoardContext';

export const HelpText = () => {
  const {
    G, isActive, ctx, matchData, playerID,
  } = useBoardContext();

  const stage: string | null = (ctx.activePlayers && ctx.activePlayers[ctx.currentPlayer]) || null;
  const currentPlayerName: string | undefined = matchData?.find(
    (p) => String(p.id) === ctx.currentPlayer,
  )?.name;

  let hint = '';

  if (!ctx.gameover && isActive) {
    if (stage === 'place') {
      hint = `Place ${G.players[ctx.currentPlayer].charState.numWorkersToPlace} workers`;
    } else if (stage === 'select') {
      hint = 'Select a worker';
    } else if (stage === 'move') {
      hint = 'Move';
    } else if (stage === 'build') {
      hint = 'Build';
    } else if (stage === 'end') {
      hint = 'End Turn or Undo';
    }
  } else if (!ctx.gameover && !isActive) {
    hint = `${currentPlayerName}'s Turn`;
  } else {
    hint = ctx.gameover.winner === playerID ? 'You Win!' : 'You Lose';
  }

  return (
    <span className="PlayerBoard__hint">
      {hint}
    </span>
  );
};
