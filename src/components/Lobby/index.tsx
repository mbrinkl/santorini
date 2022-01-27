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
import { isMobile, getMobileOS } from '../../utility';
import 'tippy.js/dist/tippy.css'; // optional
import './style.scss';
import { LobbyService } from '../../api/lobbyService';

const GameClient = Client({
  game: SantoriniGame,
  board: GameBoard,
  multiplayer: SocketIO({ server: SERVER_URL }),
  debug: !isProduction && !isMobile(),
});

export const GameLobby = () => {
  const [isGameRunning, setGameRunning] = useState(false);
  const [isSpectating, setSpectating] = useState(false);

  return isGameRunning ? (
    <GameLobbyPlay spectating={isSpectating} />
  ) : (
    <GameLobbySetup startGame={() => setGameRunning(true)} spectating={() => setSpectating(true)} />
  );
};

export const GameLobbySetup: React.FC<{ startGame(): void, spectating(): void }> = ({
  startGame, spectating,
}) => {
  const { id } = useParams<{ id: string }>();
  const nickname = useStoreState((s) => s.nickname);
  const [matchMetadata, setMatchMetadata] = useState<LobbyAPI.Match | null>(null);
  const joinRoom = useStoreActions((s) => s.joinRoom);
  const activeRoomPlayer = useStoreState((s) => s.activeRoomPlayer);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const os = getMobileOS();

  const supportsCopying = !!document.queryCommandSupported('copy');
  function copyToClipboard(value: string) {
    const textField = document.createElement('textarea');
    textField.innerText = value;
    textField.style.opacity = '0';
    document.body.appendChild(textField);
    textField.select();
    document.execCommand('copy');
    textField.remove();
  }

  const gameRoomFull = matchMetadata?.players.filter((p) => !p.name).length === 0;

  // poll api to load match data
  useEffect(() => {
    const intervalID = setInterval(() => {
      if (id) {
        new LobbyService().getMatch(id).then((data) => {
          setMatchMetadata(data);
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
      p.id === activeRoomPlayer?.playerID && p.name === nickname
    ));

    if (!alreadyJoined && emptySeatID !== undefined && nickname && id) {
      joinRoom({ playerID: emptySeatID, playerName: nickname, matchID: id });
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

              {os === 'iOS' || os === 'Android' ? (
                <Button
                  theme="blue"
                  onClick={() => {
                    window.open(os === 'iOS' ? `sms:&body=${window.location.href}` : `sms:?body=${window.location.href}`);
                  }}
                >
                  Share
                </Button>
              ) : (
                <></>
              )}
            </div>
          </Tippy>
        )}
      </div>

      <div className="Lobby__players">
        {matchMetadata ? (
          matchMetadata.players?.map((player) => (player.name ? (
            <div
              key={player.id}
              className="Lobby__player Lobby__player--active"
            >
              {player.name}
              {' '}
              {player.name === nickname && '(You)'}
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

export const GameLobbyPlay: React.FC<{ spectating: boolean }> = ({
  spectating,
}) => {
  const { id } = useParams<{ id: string }>();
  const activeRoomPlayer = useStoreState((s) => s.activeRoomPlayer);

  if (id && activeRoomPlayer?.matchID === id) {
    console.log('joining as main squeeze');
    return (
      <GameClient
        matchID={id}
        playerID={String(activeRoomPlayer?.playerID)}
        credentials={activeRoomPlayer?.credential}
        debug={!isProduction}
      />
    );
  }

  console.log('joining as spectator');
  return (
    <GameClient matchID={id} />
  );
};
