import { SocketIO } from "boardgame.io/multiplayer";
import { Client } from "boardgame.io/react";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { isProduction } from "../../config";
import { SERVER_URL } from "../../config/client";
import { SantoriniGame } from "../../game";
import { useStoreActions, useStoreState } from "../../store";
import { GameBoard } from "../GameBoard";
import { ButtonBack } from "../ButtonBack";
import "./style.scss";
import { LobbyPage } from "components/LobbyPage";
import { Button } from "components/Button";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css"; // optional

const GameClient = Client({
  game: SantoriniGame,
  board: GameBoard,
  multiplayer: SocketIO({ server: SERVER_URL }),
  debug: false // TODO: debug false only on mobile
});

export const GameLobby = () => {
  const [isGameRunning, setGameRunning] = useState(false);

  return (
    isGameRunning ? 
    <GameLobbyPlay /> : 
    <GameLobbySetup startGame={() => setGameRunning(true)} />
  );
};

//https://stackoverflow.com/questions/21741841/detecting-ios-android-operating-system
export function getMobileOS() {
  var userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;

  // Windows Phone must come first because its UA also contains "Android"
  if (/windows phone/i.test(userAgent)) {
    return "Windows Phone";
  }
  
  if (/android/i.test(userAgent)) {
    return "Android";
  }
  
  // iOS detection from: http://stackoverflow.com/a/9039885/177710
  if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
    return "iOS";
  }
  
  return "unknown";
}

export const GameLobbySetup: React.FC<{ startGame(): void }> = ({
  startGame,
}) => {
  const { id } = useParams();
  const nickname = useStoreState((s) => s.nickname);
  const roomMetadata = useStoreState((s) => s.roomMetadata);
  const loadRoomMetadata = useStoreActions((s) => s.loadRoomMetadata);
  const joinRoom = useStoreActions((s) => s.joinRoom);
  const activeRoomPlayer = useStoreState((s) => s.activeRoomPlayer);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const os = getMobileOS();

  const supportsCopying = !!document.queryCommandSupported("copy");
  function copyToClipboard(value: string) {
    var textField = document.createElement("textarea");
    textField.innerText = value;
    textField.style.opacity = "0";
    document.body.appendChild(textField);
    textField.select();
    document.execCommand("copy");
    textField.remove();
  }

  const gameRoomFull =
    roomMetadata?.players.filter((p) => !p.name).length === 0;

  useEffect(() => {
    const intervalID = setInterval(() => {
      if (id) loadRoomMetadata(id);
    }, 500);

    return () => clearInterval(intervalID);
  }, [loadRoomMetadata, id]);

  useEffect(() => {
    if (gameRoomFull) {
      setTimeout(() => startGame(), 2000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameRoomFull]);

  useEffect(() => {
    // find first empty seat ID
    const emptySeatID = roomMetadata?.players.find((p) => !p.name)?.id;
    const alreadyJoined = roomMetadata?.players.find((p) => {
      return p.id === activeRoomPlayer?.playerID && p.name === nickname;
    });

    if (!alreadyJoined && emptySeatID !== undefined && nickname && id) {
      joinRoom({ playerID: emptySeatID, playerName: nickname, matchID: id });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomMetadata]);

  return (
    <LobbyPage>
      <ButtonBack to="/" />

      <div className="Lobby__title">
        Invite
      </div>
      <div className="Lobby__subtitle">
        Send a link to a friend to invite them to your game
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

              {os === 'iOS' || os === 'Android' ? 
                os === 'iOS' ?
                  <Button
                    theme="blue"
                    onClick={() => {
                      window.open(`sms:&body=${window.location.href}`)
                    }}
                  >
                    Share
                  </Button>
                :
                  <Button
                    theme="blue"
                    onClick={() => {
                      window.open(`sms:?body=${window.location.href}`)
                    }}
                  >
                    Share
                  </Button> 
                :
                <></>
              }
            </div>
          </Tippy>
        )}
      </div>

      <div className="Lobby__players">
        {roomMetadata ? (
          roomMetadata.players?.map((player) => {
            return player.name ? (
              <div
                key={player.id}
                className="Lobby__player Lobby__player--active"
              >
                {player.name} {player.name === nickname && "(You)"}
              </div>
            ) : (
              <div
                key={player.id}
                className="Lobby__player Lobby__player--inactive"
              >
                Waiting for player...
              </div>
            );
          })
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

export const GameLobbyPlay = () => {
  const { id } = useParams();
  const activeRoomPlayer = useStoreState((s) => s.activeRoomPlayer);

  return (
    <GameClient 
      matchID={id}
      playerID={String(activeRoomPlayer?.playerID)}
      credentials={activeRoomPlayer?.credential}
      debug={!isProduction}
    />
  );
};
