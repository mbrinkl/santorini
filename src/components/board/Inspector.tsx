import { useCallback, useEffect, useMemo, useState } from 'react';
import { Client } from 'boardgame.io/client';
import {
  ClientState,
  _ClientImpl as ClientImpl,
} from 'boardgame.io/dist/types/src/client/client';
import { LogEntry } from 'boardgame.io';
import { GameState, OverrideState } from '../../types/gameTypes';
import { SantoriniGame } from '../../game';
import { Button } from '../common/Button';
import { ButtonGroup } from '../common/ButtonGroup';
import { useGetMatchQuery } from '../../api';
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
const executeLog = (
  client: ClientImpl<GameState>,
  log: LogEntry[],
  from = 0,
  to = log.length,
) => {
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
  setOverrideState(value: OverrideState): void;
}): JSX.Element => {
  const [client, setClient] = useState<ClientImpl<GameState>>();
  const [clientState, setClientState] = useState<ClientState<GameState>>();
  const [setupData, setSetupData] = useState<SetupData>();
  const log = useMemo(() => getFilteredLog(unfilteredLog), [unfilteredLog]);
  const firstMoveInd = useMemo(
    () =>
      log.findIndex(
        (logEntry) =>
          logEntry.action.payload.type === 'setup' ||
          logEntry.action.payload.type === 'place',
      ),
    [log],
  );
  const [moveNumber, setMoveNumber] = useState(log.length - 1);

  // Load match metadata which is set at gameover
  // Poll in case the metadata is not set by the time this component loads
  const { data: matchMetadata } = useGetMatchQuery(matchID, {
    pollingInterval: 500,
    skip: setupData != null,
  });

  const rewind = () => {
    if (!client || !setupData) return;
    setMoveNumber(firstMoveInd - 1);
    client.reset();
    executeInitialSetup(client, setupData.player0char, setupData.player1char);
    setClientState(client.getState());
  };

  const fastForward = () => {
    if (!client || !setupData) return;
    setMoveNumber(log.length - 1);
    client.reset();
    executeInitialSetup(client, setupData.player0char, setupData.player1char);
    executeLog(client, log, firstMoveInd);
    setClientState(client.getState());
  };

  const back = useCallback(() => {
    if (!client || !setupData || moveNumber <= firstMoveInd - 1) return;

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
  }, [client, setupData, firstMoveInd, log, moveNumber]);

  const forward = useCallback(() => {
    if (!client || !setupData || moveNumber >= log.length - 1) return;

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
  }, [client, setupData, log, moveNumber]);

  const keyPressHandler = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        back();
      } else if (event.key === 'ArrowRight') {
        forward();
      }
    },
    [back, forward],
  );

  useEffect(() => {
    document.addEventListener('keydown', keyPressHandler, false);

    return () => {
      document.removeEventListener('keydown', keyPressHandler, false);
    };
  }, [keyPressHandler]);

  useEffect(() => {
    if (
      matchMetadata &&
      matchMetadata.setupData != null &&
      matchMetadata.players[0].data?.character != null &&
      matchMetadata.players[1].data?.character != null
    ) {
      setSetupData({
        seed: matchMetadata.setupData,
        player0char: matchMetadata.players[0].data.character,
        player1char: matchMetadata.players[1].data.character,
      });
    }
  }, [matchMetadata]);

  // Override the client board props whenever the clientState is set
  useEffect(() => {
    if (clientState) {
      setOverrideState({ ...clientState });
    }
  }, [clientState, setOverrideState]);

  useEffect(() => {
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
  }, [setupData, log]);

  if (!(setupData && client)) {
    return <div />;
  }

  return (
    <ButtonGroup>
      <Button
        onClick={rewind}
        disabled={moveNumber <= firstMoveInd - 1}
        theme="red"
        size="small"
      >
        {'<<'}
      </Button>
      <Button
        onClick={back}
        disabled={moveNumber <= firstMoveInd - 1}
        theme="red"
        size="small"
      >
        {'<'}
      </Button>

      <Button
        onClick={forward}
        disabled={moveNumber >= log.length - 1}
        theme="green"
        size="small"
      >
        {'>'}
      </Button>

      <Button
        onClick={fastForward}
        disabled={moveNumber >= log.length - 1}
        theme="green"
        size="small"
      >
        {'>>'}
      </Button>
    </ButtonGroup>
  );
};
