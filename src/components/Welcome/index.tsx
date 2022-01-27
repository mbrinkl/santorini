import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LobbyService } from '../../api/lobbyService';
import { LobbyPage } from '../LobbyPage';
import { Logo } from '../Logo';
import { Button } from '../Button';
import { ButtonChangeNickname } from '../ButtonChangeNickname';
import { ButtonBack } from '../ButtonBack';
import { useStoreState } from '../../store';
import style from './style.module.scss';

export function Welcome() {
  const navigate = useNavigate();
  const [showHostOptions, setShowHostOptions] = useState(false);
  const activeRoomPlayer = useStoreState((s) => s.activeRoomPlayer);
  // const leaveRoom = useStoreActions((s) => s.leaveRoom);

  async function createGame(unlisted: boolean) {
    // if (activeRoomPlayer) {
    //   await leaveRoom({
    //     matchID: activeRoomPlayer.matchID,
    //     playerID: activeRoomPlayer.playerID,
    //     credential: activeRoomPlayer.credential,
    //   });
    // }

    const matchID = await new LobbyService().createRoom({ numPlayers: 2, unlisted });
    navigate(`/rooms/${matchID}`);
  }

  const initialButtons = (
    <>
      <Button
        theme="green"
        className={style.buttons}
        onClick={() => setShowHostOptions(true)}
      >
        Host
      </Button>

      <Button
        theme="blue"
        className={style.buttons}
        onClick={() => navigate('/rooms')}
      >
        Join
      </Button>

      <Button
        theme="yellow"
        className={style.buttons}
        onClick={() => window.open('http://files.roxley.com/Santorini-Rulebook-Web-2016.08.14.pdf', '_blank')}
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
        onClick={() => createGame(false)}
      >
        Public
      </Button>

      <Button
        theme="blue"
        className={style.buttons}
        onClick={() => createGame(true)}
      >
        Private
      </Button>

      <Button
        theme="red"
        className={style.buttons}
        onClick={() => setShowHostOptions(false)}
      >
        Cancel
      </Button>
    </>
  );

  return (
    <LobbyPage>
      <ButtonChangeNickname />
      { activeRoomPlayer?.matchID && <ButtonBack to={`/rooms/${activeRoomPlayer.matchID}`} />}
      <Logo className={style.logo} size="large" />

      <div className={style.buttonsDiv}>
        {showHostOptions ? hostOptionsButtons : initialButtons}
      </div>

    </LobbyPage>
  );
}
