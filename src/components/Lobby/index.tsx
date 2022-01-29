import { SocketIO } from 'boardgame.io/multiplayer';
import { Client } from 'boardgame.io/react';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Tippy from '@tippyjs/react';
import { LobbyAPI } from 'boardgame.io';
import { isProduction } from '../../config';
import { SERVER_URL } from '../../config/client';
import { SantoriniGame } from '../../game';
import { useStoreActions, useStoreState } from '../../store';
import { GameBoard } from '../GameBoard';
import { ButtonBack } from '../ButtonBack';
import { LobbyPage } from '../LobbyPage';
import { Button } from '../Button';
import { getMatch } from '../../api';
import {
  isMobile, getMobileOS, supportsCopying, copyToClipboard,
} from '../../utility';
import 'tippy.js/dist/tippy.css';
import './style.scss';

const GameClient = Client({
  game: SantoriniGame,
  board: GameBoard,
  multiplayer: SocketIO({ server: SERVER_URL }),
  debug: !isProduction && !isMobile(),
});

export const GameLobbySetup: React.FC<{ startGame(): void }> = ({
  startGame,
}) => {
  const { id } = useParams<{ id: string }>();
  const nickname = useStoreState((s) => s.nickname);
  const [matchMetadata, setMatchMetadata] = useState<LobbyAPI.Match | null>(null);
  const joinRoom = useStoreActions((s) => s.joinRoom);
  const activeRoomPlayer = useStoreState((s) => s.activeRoomPlayer);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const os = getMobileOS();

  const gameRoomFull = matchMetadata?.players.filter((p) => !p.name).length === 0;

  // poll api to load match data
  useEffect(() => {
    const intervalID = setInterval(() => {
      if (id) {
        getMatch(id).then((data) => {
          if (data) setMatchMetadata(data);
        });
      }
    }, 500);

    return () => clearInterval(intervalID);
  }, [id]);

  // if game room is full, start the game
  useEffect(() => {
    if (gameRoomFull) {
      setTimeout(() => startGame(), 2000);
    }
  }, [gameRoomFull, startGame]);

  useEffect(() => {
    // find first empty seat ID
    const emptySeatID = matchMetadata?.players.find((p) => !p.name)?.id;
    const alreadyJoined = matchMetadata?.players.find((p) => (
      p.id.toString() === activeRoomPlayer?.playerID && p.name === nickname
    ));

    if (!alreadyJoined && emptySeatID !== undefined && nickname && id) {
      joinRoom({ playerID: emptySeatID.toString(), playerName: nickname, matchID: id });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matchMetadata]);

  return (
    <LobbyPage>
      <ButtonBack to="/" />

      <div className="Lobby__title">{matchMetadata?.unlisted ? 'Private Game' : 'Public Game'}</div>
      <div className="Lobby__subtitle">
        Send a link to someone to invite them to your game
      </div>
      <div className="Lobby__link">
        <div className="Lobby__link-box">{window.location.href}</div>

        {supportsCopying && (
          <Tippy
            visible={tooltipVisible}
            offset={[0, 12]}
            content={<p>Copied!</p>}
          >
            <div className="Lobby__link-buttons">
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

        {os in ['iOS', 'Android'] && (
          <Button
            theme="blue"
            onClick={() => {
              window.open(os === 'iOS' ? `sms:&body=${window.location.href}` : `sms:?body=${window.location.href}`);
            }}
          >
            Share
          </Button>
        )}

      </div>

      <div className="Lobby__players">
        {matchMetadata ? (
          matchMetadata.players?.map((player) => (player.name ? (
            <div
              key={player.id}
              className="Lobby__player Lobby__player--active"
            >
              {`${player.name} ${player.name === nickname ? '(You)' : ''}`}
            </div>
          ) : (
            <div
              key={player.id}
              className="Lobby__player Lobby__player--inactive"
            >
              Waiting for player...
            </div>
          )))
        ) : (
          <p>Loading...</p>
        )}
      </div>

      <div className="Lobby__status-message">
        {gameRoomFull ? (
          <p>Starting Game...</p>
        ) : (
          <p>Game will start when both players join</p>
        )}
      </div>
    </LobbyPage>
  );
};

export const GameLobbyPlay: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const activeRoomPlayer = useStoreState((s) => s.activeRoomPlayer);

  // Join as a player if the active room player data is set for this match id
  if (id && activeRoomPlayer?.matchID === id) {
    return (
      <GameClient
        matchID={id}
        playerID={String(activeRoomPlayer?.playerID)}
        credentials={activeRoomPlayer?.credential}
        debug={!isProduction}
      />
    );
  }

  // Join as a spectator
  return (
    <GameClient matchID={id} />
  );
};

export const GameLobby = () => {
  const [isGameRunning, setGameRunning] = useState(false);

  return isGameRunning ? (
    <GameLobbyPlay />
  ) : (
    <GameLobbySetup startGame={() => setGameRunning(true)} />
  );
};
