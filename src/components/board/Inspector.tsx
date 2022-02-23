import { useEffect, useState } from 'react';
import { Client } from 'boardgame.io/client';
import { BoardProps } from 'boardgame.io/react';
import {
  ClientState,
  _ClientImpl as ClientImpl,
} from 'boardgame.io/dist/types/src/client/client';
import { LogEntry } from 'boardgame.io';
import { GameState } from '../../types/gameTypes';
import { SantoriniGame } from '../../game';
import { ImageButton } from '../common/Button';
import { ButtonGroup } from '../common/ButtonGroup';
import { getMatch } from '../../api';
import RewindImg from '../../assets/png/rewind.png';
import BackImg from '../../assets/png/back.png';
import ForwardImg from '../../assets/png/forward.png';
import FastForwardImg from '../../assets/png/fastforward.png';
import './Inspector.scss';

interface SetupData {
  seed: string;
  player0char: string;
  player1char: string;
}

const getFilteredLog = (log: LogEntry[]): LogEntry[] => {
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

  return filteredLog;
};

/**
 * Execute every move in the log, or to a given index
 * (not select character moves)
 */
export const executeLog = (
  client: ClientImpl<GameState>,
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
const executeMove = (client: ClientImpl<GameState>, logEntry: LogEntry) => {
  const { type, playerID, args } = logEntry.action.payload;
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
 * Select the given characters and ready
 */
const executeInitialSetup = (
  client: ClientImpl<GameState>,
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

export const InspectorControls = ({
  matchID,
  unfilteredLog,
  setOverrideState,
}: {
  matchID: string;
  unfilteredLog: LogEntry[];
  setOverrideState(value: BoardProps<GameState>): void;
}): JSX.Element => {
  const [client, setClient] = useState<ClientImpl<GameState>>();
  const [clientState, setClientState] = useState<ClientState<GameState>>();
  const [log] = useState(getFilteredLog(unfilteredLog));
  const [setupData, setSetupData] = useState<SetupData>();
  const [moveNumber, setMoveNumber] = useState(log.length - 1);
  const [firstMoveInd] = useState(
    log.findIndex(
      (logEntry) =>
        logEntry.action.payload.type === 'setup' ||
        logEntry.action.payload.type === 'place',
    ),
  );

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
            setup: (context) => ({
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              ...SantoriniGame.setup!(context),
              isDummy: true,
            }),
          },
        });
        executeInitialSetup(cli, setupData.player0char, setupData.player1char);
        executeLog(cli, log);
        setClient(cli);
      }
    };

    initializeClient();
  }, [setupData, log]);

  if (!(setupData && client)) {
    return <div />;
  }

  const rewind = () => {
    setMoveNumber(firstMoveInd - 1);
    client.reset();
    executeInitialSetup(client, setupData.player0char, setupData.player1char);
    setClientState(client.getState());
  };

  const fastForward = () => {
    setMoveNumber(log.length - 1);
    client.reset();
    executeInitialSetup(client, setupData.player0char, setupData.player1char);
    executeLog(client, log, firstMoveInd);
    setClientState(client.getState());
  };

  const back = () => {
    let prevMoveNumber = moveNumber - 1;
    if (
      log[prevMoveNumber].action.payload.type === 'endTurn' ||
      log[moveNumber].action.payload.type === 'endTurn'
    ) {
      prevMoveNumber -= 1;
    }
    setMoveNumber(prevMoveNumber);
    client.reset();
    executeInitialSetup(client, setupData.player0char, setupData.player1char);
    executeLog(client, log, firstMoveInd, prevMoveNumber + 1);
    setClientState(client.getState());
  };

  const forward = () => {
    let nextMoveNumber = moveNumber + 1;
    executeMove(client, log[nextMoveNumber]);
    if (
      log[nextMoveNumber].action.payload.type === 'endTurn' ||
      (nextMoveNumber + 1 < log.length &&
        log[nextMoveNumber + 1].action.payload.type === 'endTurn')
    ) {
      nextMoveNumber += 1;
      executeMove(client, log[nextMoveNumber]);
    }
    setMoveNumber(nextMoveNumber);
    setClientState(client.getState());
  };

  return (
    <ButtonGroup>
      <ImageButton
        onClick={rewind}
        disabled={moveNumber === firstMoveInd - 1}
        theme="red"
        size="small"
        src={RewindImg}
      />
      <ImageButton
        onClick={back}
        disabled={moveNumber === firstMoveInd - 1}
        theme="red"
        size="small"
        src={BackImg}
      />
      <ImageButton
        onClick={forward}
        disabled={moveNumber === log.length - 1}
        theme="green"
        size="small"
        src={ForwardImg}
      />
      <ImageButton
        onClick={fastForward}
        disabled={moveNumber === log.length - 1}
        theme="green"
        size="small"
        src={FastForwardImg}
      />
    </ButtonGroup>
  );
};
