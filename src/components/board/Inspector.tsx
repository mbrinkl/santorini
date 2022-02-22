import { useEffect, useState } from 'react';
import { Client } from 'boardgame.io/client';
import { BoardProps } from 'boardgame.io/react';
import { _ClientImpl as ClientImpl } from 'boardgame.io/dist/types/src/client/client';
import { LogEntry } from 'boardgame.io';
import { GameState } from '../../types/GameTypes';
import { initBoard, initPlayers, SantoriniGame } from '../../game';
import { ImageButton } from '../common/Button';
import { ButtonGroup } from '../common/ButtonGroup';
import { getMatch } from '../../api';
import RewindImg from '../../assets/png/rewind.png';
import BackImg from '../../assets/png/back.png';
import ForwardImg from '../../assets/png/forward.png';
import FastForwardImg from '../../assets/png/fastforward.png';
import './Inspector.scss';

const getFilteredLogs = (logs: LogEntry[]): LogEntry[] => {
  const filteredLogs = logs.filter(
    (l) => l.action.type === 'MAKE_MOVE' || l.action.type === 'UNDO',
  );

  let numUndo = 0;
  for (let i = filteredLogs.length - 1; i >= 0; i--) {
    if (filteredLogs[i].action.type === 'UNDO') {
      numUndo += 1;
      filteredLogs.splice(i, 1);
    } else if (numUndo > 0) {
      numUndo -= 1;
      filteredLogs.splice(i, 1);
    }
  }

  return filteredLogs;
};

interface SetupData {
  seed: string;
  player0char: string;
  player1char: string;
}

export const Inspector = ({
  matchID,
  logs,
  setOverrideState,
}: {
  matchID: string;
  logs: LogEntry[];
  setOverrideState(value: BoardProps<GameState>): void;
}): JSX.Element => {
  const [client, setClient] = useState<any>(null);
  const [clientState, setClientState] = useState<any>(null);
  const [filteredLogs] = useState(getFilteredLogs(logs));
  const [setupData, setSetupData] = useState<SetupData>();

  // Load match metadata which is set at gameover
  // Call in setinterval in case the metadata is not set by the time
  // this component loads
  useEffect(() => {
    const intervalID = setInterval(() => {
      if (matchID) {
        getMatch(matchID).then((match) => {
          if (
            match &&
            match.setupData != null &&
            match.players[0].data?.character != null &&
            match.players[1].data?.character != null
          ) {
            setSetupData({
              seed: match.setupData,
              player0char: match.players[0].data.character,
              player1char: match.players[1].data.character,
            });
            clearInterval(intervalID);
          }
        });
      }
    }, 500);

    return () => clearInterval(intervalID);
  }, [matchID]);

  // Override the client board props whenever the clientState is set
  useEffect(() => {
    if (client && clientState) {
      setOverrideState({ ...client, ...clientState, isMultiplayer: false });
    }
  }, [clientState, client, setOverrideState]);

  useEffect(() => {
    const initializeClient = async () => {
      if (setupData) {
        const cli = Client({
          game: {
            ...SantoriniGame,
            seed: setupData.seed,
            setup: ({ ctx }) => ({
              isClone: true,
              players: initPlayers(ctx),
              spaces: initBoard(),
              valids: [],
              offBoardTokens: [],
            }),
          },
        });
        executeInitialSetup(cli, setupData.player0char, setupData.player1char);
        executeLog(cli, filteredLogs);
        setClient(cli);
      }
    };

    initializeClient();
  }, [setupData, filteredLogs]);

  if (setupData && client) {
    return (
      <Ctrls
        client={client}
        setClientState={setClientState}
        log={filteredLogs}
        setupData={setupData}
      />
    );
  }

  return <div />;
};

/**
 * Execute every move in the log, or to a given index
 * (not select character moves)
 */
export const executeLog = (
  client: ClientImpl,
  log: LogEntry[],
  from?: number,
  to?: number,
) => {
  if (from === undefined) {
    from = 0;
  }
  if (to === undefined) {
    to = log.length;
  }
  for (let i = from; i < to; i++) {
    executeMove(client, log[i]);
  }
};

/**
 * Execute a move from the log (not select character moves)
 */
const executeMove = (client: ClientImpl, log: LogEntry) => {
  const { type, playerID, args } = log.action.payload;
  client.updatePlayerID(playerID);
  switch (type) {
    case 'setup':
      client.moves.setup(...args);
      break;
    case 'place':
      client.moves.place(...args);
      break;
    case 'select':
      client.moves.select(...args);
      break;
    case 'move':
      client.moves.move(...args);
      break;
    case 'build':
      client.moves.build(...args);
      break;
    case 'special':
      client.moves.special(...args);
      break;
    case 'onButtonPressed':
      client.moves.onButtonPressed();
      break;
    case 'endTurn':
      client.moves.endTurn();
      break;
    default:
      break;
  }
};

/**
 * Execute all the moves in the 'select characters' phase from the log
 */
const executeInitialSetup = (
  client,
  p0charName: string,
  p1charName: string,
) => {
  client.updatePlayerID('0');
  client.moves.setChar(p0charName);
  client.moves.ready(true);
  client.updatePlayerID('1');
  client.moves.setChar(p1charName);
  client.moves.ready(true);
};

const Ctrls = ({
  client,
  setClientState,
  log,
  setupData,
}: {
  client: ClientImpl;
  setClientState: any;
  log: LogEntry[];
  setupData: SetupData;
}): JSX.Element => {
  const [moveNumber, setMoveNumber] = useState<number>(log.length - 1);

  const firstMoveInd = log.findIndex(
    (l) =>
      l.action.payload.type === 'setup' || l.action.payload.type === 'place',
  );

  const bb = () => {
    setMoveNumber(firstMoveInd - 1);
    client.reset();
    executeInitialSetup(client, setupData.player0char, setupData.player1char);
    setClientState(client.getState());
  };

  const ff = () => {
    setMoveNumber(log.length - 1);
    client.reset();
    executeInitialSetup(client, setupData.player0char, setupData.player1char);
    executeLog(client, log, firstMoveInd);
    setClientState(client.getState());
  };

  const b = () => {
    let prev = moveNumber - 1;
    if (
      prev !== -1 &&
      (log[prev].action.payload.type === 'endTurn' ||
        log[moveNumber].action.payload.type === 'endTurn')
    ) {
      prev -= 1;
    }
    setMoveNumber(prev);
    client.reset();
    executeInitialSetup(client, setupData.player0char, setupData.player1char);
    executeLog(client, log, firstMoveInd, prev + 1);
    setClientState(client.getState());
  };

  const f = () => {
    const movePlus = moveNumber + 1;
    setMoveNumber(movePlus);
    if (movePlus !== -1 && movePlus < log.length) {
      exNextMove(movePlus);
      const movePlusPlus = movePlus + 1;
      if (
        movePlusPlus < log.length &&
        log[movePlusPlus].action.payload.type === 'endTurn'
      ) {
        exNextMove(movePlusPlus);
        setMoveNumber(movePlusPlus);
      }
      setClientState(client.getState());
    }
  };

  const exNextMove = (moveNum: number) => {
    const logAction = log[moveNum];
    executeMove(client, logAction);
  };

  return (
    <ButtonGroup>
      <ImageButton
        onClick={bb}
        disabled={moveNumber === firstMoveInd - 1}
        theme="red"
        size="small"
        src={RewindImg}
      />
      <ImageButton
        onClick={b}
        disabled={moveNumber === firstMoveInd - 1}
        theme="red"
        size="small"
        src={BackImg}
      />

      <ImageButton
        onClick={f}
        disabled={moveNumber === log.length - 1}
        theme="green"
        size="small"
        src={ForwardImg}
      />
      <ImageButton
        onClick={ff}
        disabled={moveNumber === log.length - 1}
        theme="green"
        size="small"
        src={FastForwardImg}
      />
    </ButtonGroup>
  );
};
