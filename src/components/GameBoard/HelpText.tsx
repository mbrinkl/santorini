import { useBoardContext } from "./BoardContext";

export const HelpText = () => {
  const { State, isActive, ctx, playersInfo, playerID } = useBoardContext();

  const currentPlayerName = playersInfo.find(
    (p) => String(p.id) === ctx.currentPlayer
  )!.name;

  return (
    <span className="PlayerBoard__hint">
      {
      !!ctx.gameover ?
      (ctx.gameover.winner === playerID ? <span>You Win!</span> :
        <span>You Lose</span>) :
      isActive ? 
        State.stage === 'place' ? <span>Place {State.players[playerID].char.numWorkers} workers</span>
        : State.stage === 'select' ? <span>Select a worker</span>
        : State.stage === 'move' ? <span>Move</span>
        : State.stage === 'build' ? <span>Build</span>
        : <span>End Turn or Undo</span>
      : 
        <span className="PlayerBoard__hint-accent">
          { currentPlayerName } is making a move...
        </span>
      }
    </span>
  );
};
