import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LobbyPage } from '../LobbyPage';
import { Logo } from '../Logo';
import { Button } from '../Button';
import { ButtonChangeNickname } from '../ButtonChangeNickname';
import { ButtonBack } from '../ButtonBack';
import { useStoreActions, useStoreState } from '../../store';
import style from './style.module.scss';

export function Welcome() {
  const [redirect, setRedirect] = useState(false);
  const createGameRoom = useStoreActions((s) => s.createGameRoom);
  const matchID = useStoreState((s) => s.matchID);
  const navigate = useNavigate();
  const [showHostOptions, setShowHostOptions] = useState(false);
  const activeRoomPlayer = useStoreState((s) => s.activeRoomPlayer);
  const leaveRoom = useStoreActions((s) => s.leaveRoom);

  function onHostClicked() {
    setShowHostOptions(true);
  }

  async function onJoinClicked() {
    navigate('/rooms');
  }

  function onRulesClicked() {
    window.open('http://files.roxley.com/Santorini-Rulebook-Web-2016.08.14.pdf', '_blank');
  }

  function onPublicClicked() {
    createGame(false);
  }

  function onPrivateClicked() {
    createGame(true);
  }

  function onCancelClicked() {
    setShowHostOptions(false);
  }

  async function createGame(unlisted: boolean) {
    if (matchID && activeRoomPlayer) {
      await leaveRoom({
        matchID,
        playerID: activeRoomPlayer.playerID,
        credential: activeRoomPlayer.credential,
      });
    }

    await createGameRoom({ numPlayers: 2, unlisted });

    setRedirect(true);
  }

  useEffect(() => {
    if (redirect && matchID) {
      navigate(`/rooms/${matchID}`);
    }
  }, [matchID, redirect, navigate]);

  const initialButtons = (
    <>
      <Button
        theme="green"
        className={style.buttons}
        onClick={onHostClicked}
      >
        Host
      </Button>

      <Button
        theme="blue"
        className={style.buttons}
        onClick={onJoinClicked}
      >
        Join
      </Button>

      <Button
        theme="yellow"
        className={style.buttons}
        onClick={onRulesClicked}
      >
        Rules
      </Button>
    </>
  );

  const hostOptionsButtons = (
    <>
      <Button
        theme="green"
        className={style.buttons}
        onClick={onPublicClicked}
      >
        Public
      </Button>

      <Button
        theme="blue"
        className={style.buttons}
        onClick={onPrivateClicked}
      >
        Private
      </Button>

      <Button
        theme="red"
        className={style.buttons}
        onClick={onCancelClicked}
      >
        Cancel
      </Button>
    </>
  );

  return (
    <LobbyPage>
      <ButtonChangeNickname />
      { matchID && <ButtonBack to={`/rooms/${matchID}`} />}
      <Logo className={style.logo} size="large" />

      <div className={style.buttonsDiv}>
        {showHostOptions ? hostOptionsButtons : initialButtons}
      </div>

    </LobbyPage>
  );
}
