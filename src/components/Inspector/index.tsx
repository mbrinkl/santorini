import { useEffect, useMemo, useState } from 'react';
import classNames from 'classnames';
import { Client } from 'boardgame.io/client';
import { BoardProps } from 'boardgame.io/react';
import { ClientState, _ClientImpl as ClientImpl } from 'boardgame.io/dist/types/src/client/client';
import { GameState } from '../../types/GameTypes';
import { BoardContext } from '../../context/boardContext';
import { SantoriniGame } from '../../game';
import { PlayerBoard } from '../GameBoard/PlayerBoard';
import { Button } from '../Button';
import { ButtonGroup } from '../ButtonGroup';
import './style.scss';

export const Inspector = () : JSX.Element => {
  const [log, setLog] = useState<GameLog | null>(null);

  if (log) {
    const client = Client({ game: { ...SantoriniGame, seed: log.seed } });
    return <InspectorBoard client={client} log={log} />;
  }

  return <LogForm setLog={setLog} />;
};

const LogForm = ({ setLog }) : JSX.Element => {
  const [title, setTitle] = useState('Enter Game Json');
  const [titleClass, setTitleClass] = useState('log-form__title');
  const [data, setData] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const log = JSON.parse(data.replace(/\s/g, '')) as GameLog;
      setLog(log);
    } catch {
      setTitle('Invalid');
      setTitleClass(classNames('log-form__title', 'log-form__title--error'));
      setTimeout(() => {
        setTitle('Enter Game Json');
        setTitleClass('log-form__title');
      }, 2000);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="log-form">
      <h2 className={titleClass}>{title}</h2>
      <textarea
        className="log-form__input"
        value={data}
        onChange={(e) => setData(e.target.value)}
      />
      <Button type="submit">Submit</Button>
    </form>
  );
};

interface GameLogPlayer {
  number: number,
  name: string,
  character: string,
}

interface GameLogMove {
  player: number,
  type: string,
  arg?: number
}

interface GameLog {
  players: [GameLogPlayer, GameLogPlayer],
  seed: string,
  moves: GameLogMove[],
}

export const executeLog = (client: ClientImpl, log: GameLog, to?: number) => {
  if (to === undefined) {
    to = log.moves.length;
  }
  for (let i = 0; i < to; i++) {
    executeMove(client, log.moves[i]);
  }
};

const executeMove = (client: ClientImpl, move: GameLogMove) => {
  const { player, type, arg } = move;
  client.updatePlayerID(player.toString());
  switch (type) {
    case 'setup':
      client.moves.setup(arg);
      break;
    case 'place':
      client.moves.place(arg);
      break;
    case 'select':
      client.moves.select(arg);
      break;
    case 'move':
      client.moves.move(arg);
      break;
    case 'build':
      client.moves.build(arg);
      break;
    case 'special':
      client.moves.special(arg);
      break;
    case 'onButtonPress':
      client.moves.onButtonPress();
      break;
    case 'endTurn':
      client.moves.endTurn();
      break;
    default:
      break;
  }
};

const executeInitialSetup = (client, log) => {
  client.updatePlayerID('0');
  client.moves.setChar(log.players.find((p) => p.number === 0)?.character);
  client.moves.ready(true);
  client.updatePlayerID('1');
  client.moves.setChar(log.players.find((p) => p.number === 1)?.character);
  client.moves.ready(true);
};

const Ctrls = ({ client, setClientState, log } :
{
  client: ClientImpl,
  setClientState: any,
  log: GameLog
}) : JSX.Element => {
  const [moveNumber, setMoveNumber] = useState<number>(-1);

  const bb = () => {
    setMoveNumber(-1);
    client.reset();
    executeInitialSetup(client, log);
    client.updatePlayerID('-1');
    setClientState(client.getState());
  };

  const ff = () => {
    setMoveNumber(log.moves.length - 1);
    client.reset();
    executeInitialSetup(client, log);
    executeLog(client, log);
    client.updatePlayerID('-1');
    setClientState(client.getState());
  };

  const b = () => {
    let prev = moveNumber - 1;
    if (prev !== -1 && (log.moves[prev].type === 'endTurn' || log.moves[moveNumber].type === 'endTurn')) {
      prev -= 1;
    }
    setMoveNumber(prev);
    client.reset();
    executeInitialSetup(client, log);
    executeLog(client, log, prev + 1);
    client.updatePlayerID('-1');
    setClientState(client.getState());
  };

  const f = () => {
    const movePlus = moveNumber + 1;
    setMoveNumber(movePlus);
    if (movePlus !== -1 && movePlus < log.moves.length) {
      exNextMove(movePlus);
      const movePlusPlus = movePlus + 1;
      if (movePlusPlus < log.moves.length && log.moves[movePlusPlus].type === 'endTurn') {
        exNextMove(movePlusPlus);
        setMoveNumber(movePlusPlus);
      }
      client.updatePlayerID('-1');
      setClientState(client.getState());
    }
  };

  const exNextMove = (moveNum: number) => {
    const logAction = log.moves[moveNum];
    executeMove(client, logAction);
  };

  return (
    <ButtonGroup>
      <Button onClick={bb} disabled={moveNumber === -1} theme="red">BB</Button>
      <Button onClick={b} disabled={moveNumber === -1} theme="red">B</Button>
      <Button
        onClick={f}
        disabled={moveNumber === log.moves.length - 1}
        theme="green"
      >
        F
      </Button>
      <Button
        onClick={ff}
        disabled={moveNumber === log.moves.length - 1}
        theme="green"
      >
        FF
      </Button>
    </ButtonGroup>
  );
};

const InspectorBoard = ({ client, log }) : JSX.Element => {
  const [clientState, setClientState] = useState<ClientState<GameState>>(client.getState());

  useEffect(() => {
    executeInitialSetup(client, log);
    setClientState(client.getState());
  }, [log, client]);

  const boardProps: BoardProps<GameState> = useMemo(() => ({
    ...client,
    ...clientState,
    playerID: undefined,
    matchData: [
      { id: 0, name: log.players.find((p) => p.number === 0)?.name },
      { id: 1, name: log.players.find((p) => p.number === 1)?.name },
    ],
    isMultiplayer: false,
  }), [client, clientState, log.players]);

  return (
    <div className="inspector">
      <BoardContext.Provider value={boardProps}>
        <PlayerBoard />
      </BoardContext.Provider>
      <Ctrls client={client} setClientState={setClientState} log={log} />
    </div>
  );
};
