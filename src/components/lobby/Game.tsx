import { SocketIO } from 'boardgame.io/multiplayer';
import { Client } from 'boardgame.io/react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Tippy from '@tippyjs/react';
import { LobbyAPI } from 'boardgame.io';
import classNames from 'classnames';
import { NotFound } from './NotFound';
import { isProduction } from '../../config';
import { SERVER_URL } from '../../config/client';
import { SantoriniGame } from '../../game';
import { useStoreActions, useStoreState } from '../../store';
import { GameBoard } from '../board/GameBoard';
import { ButtonBack } from '../common/ButtonBack';
import { LobbyPage } from './Wrapper';
import { Button } from '../common/Button';
import { getMatch } from '../../api';
import { isMobile, supportsCopying, copyToClipboard } from '../../util';
import { LoadingPage } from './LoadingPage';
import 'tippy.js/dist/tippy.css';
import './Game.scss';

const GameClient = Client({
  game: SantoriniGame,
  board: GameBoard,
  multiplayer: SocketIO({ server: SERVER_URL }),
  loading: LoadingPage,
  debug: !isProduction && !isMobile(),
});

export const GameLobbySetup = ({
  startGame,
}: {
  startGame(): void;
}): JSX.Element => {
  const { matchID } = useParams<{ matchID: string }>();
  const [matchMetadata, setMatchMetadata] = useState<LobbyAPI.Match>();
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const nickname = useStoreState((s) => s.nickname);
  const activeRoomPlayer = useStoreState((s) => s.activeRoomPlayer);
  const joinRoom = useStoreActions((s) => s.joinRoom);

  const gameRoomFull =
    matchMetadata?.players.filter((p) => !p.name).length === 0;

  // poll api to load match data
  useEffect(() => {
    function pollMatch() {
      if (matchID) {
        getMatch(matchID).then((match) => {
          if (match) {
            setMatchMetadata(match);
          }
        });
      }
    }

    pollMatch();
    const intervalID = setInterval(() => {
      pollMatch();
    }, 500);

    return () => clearInterval(intervalID);
  }, [matchID]);

  // if game room is full, start the game
  useEffect(() => {
    if (gameRoomFull) {
      setTimeout(() => startGame(), 2000);
    }
  }, [gameRoomFull, startGame]);

  useEffect(() => {
    const alreadyJoined = activeRoomPlayer?.matchID === matchID;
    if (!alreadyJoined && nickname && matchID) {
      joinRoom({ playerName: nickname, matchID });
    }
  }, [nickname, matchID, activeRoomPlayer, joinRoom]);

  return (
    <LobbyPage>
      <ButtonBack to="/" />

      <div className="lobby__title">
        {matchMetadata?.unlisted ? 'Private Game' : 'Public Game'}
      </div>
      <div className="lobby__subtitle">
        Send a link to someone to invite them to your game.
        <br />
        Copy in another browser to play locally. (ie Chrome and Edge)
      </div>
      <div className="lobby__link">
        <div className="lobby__link-box">{window.location.href}</div>

        {supportsCopying && (
          <Tippy
            visible={tooltipVisible}
            offset={[0, 12]}
            content={<p>Copied!</p>}
          >
            <div className="lobby__link-buttons">
              <Button
                theme="blue"
                onClick={() => {
                  copyToClipboard(window.location.href);
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
                  activeRoomPlayer &&
                  activeRoomPlayer.matchID === matchID &&
                  activeRoomPlayer.playerID === player.id.toString()
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
  const activeRoomPlayer = useStoreState((s) => s.activeRoomPlayer);

  // Join as a player if the active room player data is set for this match id
  if (matchID && activeRoomPlayer?.matchID === matchID) {
    return (
      <GameClient
        matchID={matchID}
        playerID={String(activeRoomPlayer.playerID)}
        credentials={activeRoomPlayer.credentials}
      />
    );
  }

  // Join as a spectator
  return <GameClient matchID={matchID} />;
};

export const GameLobby = (): JSX.Element => {
  const { matchID } = useParams<{ matchID: string }>();
  const [lobbyState, setLobbyState] = useState({
    loading: true,
    matchExists: false,
    gameRunning: false,
  });

  useEffect(() => {
    if (matchID) {
      getMatch(matchID).then((match) => {
        setLobbyState({
          loading: false,
          matchExists: match !== undefined,
          gameRunning: match?.players.filter((p) => !p.name).length === 0,
        });
      });
    }
  }, [matchID]);

  if (lobbyState.loading) {
    return <LoadingPage />;
  }

  if (!lobbyState.matchExists) {
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
