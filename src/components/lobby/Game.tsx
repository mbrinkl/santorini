import { Local, SocketIO } from 'boardgame.io/multiplayer';
import { BoardProps, Client } from 'boardgame.io/react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Tippy from '@tippyjs/react';
import classNames from 'classnames';
import { skipToken } from '@reduxjs/toolkit/dist/query';
import { NotFound } from './NotFound';
import { SERVER_URL } from '../../config/client';
import { SantoriniGame } from '../../game';
import { useAppSelector } from '../../store';
import { GameBoard } from '../board/GameBoard';
import { ButtonBack } from '../common/ButtonBack';
import { LobbyPage } from './Wrapper';
import { Button } from '../common/Button';
import { useGetMatchQuery, useJoinMatchQuery } from '../../api';
import { LoadingPage } from './LoadingPage';
import { JoinMatchParams } from '../../types/apiTypes';
import 'tippy.js/dist/tippy.css';
import './Game.scss';
import { BoardPropsExt, GameType } from '../../hooks/useBoardContext';

interface GameLobbyState {
  loading: boolean;
  currentMatchID?: string;
  gameRunning: boolean;
}

const LocalClient = Client({
  game: SantoriniGame,
  board: localBoardWrapper(GameType.Local, GameBoard),
  multiplayer: Local(),
  loading: LoadingPage,
});

export const GameLobbyLocal = (): JSX.Element => (
  <div className="lobby__local">
    <LocalClient playerID="0" />
    <LocalClient playerID="1" />
  </div>
);

function localBoardWrapper(
  gameType: GameType,
  RawBoard: (props: BoardPropsExt) => JSX.Element,
) {
  const Board: React.FC<BoardProps> = (boardProps) => {
    const { G, ctx, playerID } = boardProps;

    let shouldHideBoard = false;

    if (ctx.phase === 'selectCharacters') {
      shouldHideBoard =
        (playerID === '0' && G.players['0'].ready) ||
        (playerID === '1' && !G.players['0'].ready);
    } else {
      shouldHideBoard = ctx.currentPlayer !== playerID;
    }

    const props = {
      ...boardProps,
      gameType,
    };

    return (
      <div
        className={
          shouldHideBoard
            ? 'lobby__local-wrapper--hidden'
            : 'lobby__local-wrapper'
        }
      >
        <RawBoard {...props} />
      </div>
    );
  };

  return Board;
}

// const BotClient = Client({
//   game: SantoriniGame,
//   board: GameBoard,
//   multiplayer: Local({
//     bots: {
//       1: MCTSBot,
//     },
//   }),
//   loading: LoadingPage,
// });

const OnlineClient = Client({
  game: SantoriniGame,
  board: GameBoard,
  multiplayer: SocketIO({ server: SERVER_URL }),
  loading: LoadingPage,
});

export const GameLobbySetup = ({
  startGame,
}: {
  startGame(): void;
}): JSX.Element => {
  const { matchID } = useParams<{ matchID: string }>();
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const nickname = useAppSelector((s) => s.user.nickname);
  const userRoomData = useAppSelector((s) => s.user.roomData);

  const joinMatchParams: JoinMatchParams | typeof skipToken =
    nickname && matchID && userRoomData?.matchID !== matchID
      ? { matchID, playerName: nickname }
      : skipToken;

  // join match on entering the lobby
  useJoinMatchQuery(joinMatchParams);

  // poll for match data to see if more players have joined
  const { data: matchMetadata } = useGetMatchQuery(matchID ?? skipToken, {
    pollingInterval: 500,
  });

  const gameRoomFull =
    matchMetadata?.players.filter((p) => !p.name).length === 0;

  // if game room is full, start the game
  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (gameRoomFull) {
      timeout = setTimeout(() => startGame(), 2000);
    }

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [gameRoomFull, startGame]);

  return (
    <LobbyPage>
      <ButtonBack to="/" />

      <div className="lobby__title">
        {matchMetadata?.unlisted ? 'Private Game' : 'Public Game'}
      </div>
      <div className="lobby__subtitle">
        Send a link to someone to invite them to your game.
      </div>
      <div className="lobby__link">
        <div className="lobby__link-box">{window.location.href}</div>

        {navigator.clipboard && (
          <Tippy
            visible={tooltipVisible}
            offset={[0, 12]}
            content={<p>Copied!</p>}
          >
            <div className="lobby__link-buttons">
              <Button
                theme="blue"
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  setTooltipVisible(true);
                  setTimeout(() => setTooltipVisible(false), 1500);
                }}
              >
                Copy
              </Button>
            </div>
          </Tippy>
        )}
      </div>

      <div className="lobby__players">
        {matchMetadata ? (
          matchMetadata.players?.map((player) =>
            player.name ? (
              <div
                key={player.id}
                className={classNames('lobby__player', 'lobby__player--active')}
              >
                {`${player.name} ${
                  userRoomData &&
                  userRoomData.matchID === matchID &&
                  userRoomData.playerID === player.id.toString()
                    ? '(You)'
                    : ''
                }`}
              </div>
            ) : (
              <div
                key={player.id}
                className={classNames(
                  'lobby__player',
                  ' lobby__player--inactive',
                )}
              >
                Waiting for player...
              </div>
            ),
          )
        ) : (
          <p>Loading...</p>
        )}
      </div>

      <div className="lobby__status-message">
        {gameRoomFull ? (
          <p>Starting Game...</p>
        ) : (
          <p>Game will start when both players join</p>
        )}
      </div>
    </LobbyPage>
  );
};

export const GameLobbyPlay = (): JSX.Element => {
  const { matchID } = useParams<{ matchID: string }>();
  const userRoomData = useAppSelector((s) => s.user.roomData);

  // Join as a player if the active room player data is set for this match id
  if (matchID && userRoomData?.matchID === matchID) {
    return (
      <OnlineClient
        matchID={matchID}
        playerID={userRoomData.playerID}
        credentials={userRoomData.credentials}
        gameType={GameType.Online}
      />
    );
  }

  // Join as a spectator
  return <OnlineClient matchID={matchID} gameType={GameType.Online} />;
};

export const GameLobby = (): JSX.Element => {
  const { matchID } = useParams<{ matchID: string }>();
  const [lobbyState, setLobbyState] = useState<GameLobbyState>({
    loading: true,
    gameRunning: false,
  });

  const { data: matchMetadata, isSuccess } = useGetMatchQuery(
    matchID ?? skipToken,
    {
      skip: lobbyState.currentMatchID === matchID,
    },
  );

  useEffect(() => {
    if (isSuccess) {
      setLobbyState({
        loading: false,
        currentMatchID: matchMetadata?.matchID,
        gameRunning: matchMetadata?.players.filter((p) => !p.name).length === 0,
      });
    }
  }, [matchMetadata, isSuccess]);

  if (lobbyState.loading) {
    return <LoadingPage />;
  }

  if (!lobbyState.currentMatchID) {
    return <NotFound />;
  }

  if (!lobbyState.gameRunning) {
    return (
      <GameLobbySetup
        startGame={() => setLobbyState({ ...lobbyState, gameRunning: true })}
      />
    );
  }

  return <GameLobbyPlay />;
};
