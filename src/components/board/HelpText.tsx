import { useBoardContext } from '../../hooks/useBoardContext';

export const HelpText = (): JSX.Element => {
  const { G, isActive, ctx, matchData, playerID } = useBoardContext();

  const stage: string | null =
    (ctx.activePlayers && ctx.activePlayers[ctx.currentPlayer]) || null;
  const currentPlayerName: string | undefined = matchData?.find(
    (p) => String(p.id) === ctx.currentPlayer,
  )?.name;

  let hint = '';

  if (!ctx.gameover && isActive) {
    if (stage === 'setup') {
      hint = 'Setup';
    } else if (stage === 'place') {
      hint = `Place ${
        G.players[ctx.currentPlayer].charState.numWorkersToPlace
      } workers`;
    } else if (stage === 'select') {
      hint = 'Select a worker';
    } else if (stage === 'move') {
      hint = 'Move';
    } else if (stage === 'build') {
      hint = 'Build';
    } else if (stage === 'special') {
      hint = G.players[ctx.currentPlayer].charState.specialText;
    } else if (stage === 'end') {
      hint = 'End Turn or Undo';
    }
  } else if (!ctx.gameover && !isActive) {
    hint = `${currentPlayerName}'s Turn`;
  } else if (playerID) {
    hint = ctx.gameover.winner === playerID ? 'You Win!' : 'You Lose';
  } else {
    const { winner } = ctx.gameover;
    hint = `${matchData?.[winner].name || `Player ${winner}`} Wins`;
  }

  return <span className="player-board__hint">{hint}</span>;
};
