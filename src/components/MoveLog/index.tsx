import classNames from 'classnames';
import { useEffect, useRef } from 'react';
import { posToReadableCoord } from '../../game/utility';
import { useBoardContext } from '../../context/boardContext';
import './style.scss';

export const MoveLog = () : JSX.Element => {
  const { matchData, log } = useBoardContext();
  const logEndRef: any = useRef(null);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
  }, [log]);

  const filteredLog = log.filter((l) => (
    (l.action.type === 'MAKE_MOVE' || l.action.type === 'UNDO')
  ));

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

  const doubleFilteredLog = filteredLog.filter((l) => (
    (l.phase !== 'selectCharacters' && l.action.payload.type !== 'endTurn')
  ));

  return (
    <div className="move-log">
      <p className="move-log__item move-log__item--title">Move Log</p>
      {doubleFilteredLog.map((l) => {
        const { type, args, playerID } = l.action.payload;
        const name = matchData?.[playerID].name || `Player ${playerID}`;
        const move = (type === 'onButtonPressed'
          ? 'button pressed'
          : `${type} ${posToReadableCoord(args?.[0])}`
        );

        return (
          <p
            key={`log${l.turn}`}
            className={classNames('move-log__item', `move-log__item--${playerID}`)}
          >
            {`${name}: ${move}`}
          </p>
        );
      })}
      <div ref={logEndRef} />
    </div>
  );
};
