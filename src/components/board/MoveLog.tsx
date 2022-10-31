import classNames from 'classnames';
import { useEffect, useRef } from 'react';
import { posToReadableCoord } from '../../game/util/posUtil';
import { useBoardContext } from '../../context/boardContext';
import './MoveLog.scss';

export const MoveLog = (): JSX.Element => {
  const { matchData, log } = useBoardContext();
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [log]);

  const filteredLog = log.filter(
    (logEntry) =>
      logEntry.action.type === 'MAKE_MOVE' || logEntry.action.type === 'UNDO',
  );

  let numUndo = 0;
  for (let i = filteredLog.length - 1; i >= 0; i--) {
    if (filteredLog[i].action.type === 'UNDO') {
      numUndo += 1;
      filteredLog.splice(i, 1);
    } else if (numUndo > 0) {
      numUndo -= 1;
      filteredLog.splice(i, 1);
    }
  }

  const doubleFilteredLog = filteredLog.filter(
    (logEntry) =>
      logEntry.phase !== 'selectCharacters' &&
      logEntry.action.payload.type !== 'endTurn',
  );

  let currTurn = 0;
  let lastTurn = 0;

  return (
    <div className="move-log" ref={logRef}>
      <p className="move-log__item move-log__item--title">Move Log</p>
      {doubleFilteredLog.map((logEntry) => {
        const { type, args, playerID } = logEntry.action.payload;
        const { turn, _stateID: id } = logEntry;
        if (turn !== lastTurn) {
          currTurn += 1;
          lastTurn = turn;
        }
        const name = matchData?.[Number(playerID)].name || `Player ${playerID}`;
        const move =
          type === 'onButtonPressed'
            ? 'button pressed'
            : `${type} ${posToReadableCoord(args?.[0])}`;

        return (
          <p
            key={id}
            className={classNames(
              'move-log__item',
              `move-log__item--${playerID}`,
            )}
          >
            {`${currTurn}. ${move} (${name})`}
          </p>
        );
      })}
    </div>
  );
};
