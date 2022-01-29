import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LobbyPage } from '../LobbyPage';
import { Logo } from '../Logo';
import { Button } from '../Button';
import { ButtonChangeNickname } from '../ButtonChangeNickname';
import { ButtonBack } from '../ButtonBack';
import { useStoreActions, useStoreState } from '../../store';
import { createMatch, getMatch } from '../../api';
import style from './style.module.scss';

export function Home() {
  const navigate = useNavigate();
  const [showHostOptions, setShowHostOptions] = useState(false);
  const activeRoomPlayer = useStoreState((s) => s.activeRoomPlayer);
  const leaveRoom = useStoreActions((s) => s.leaveRoom);
  const [prevGameActive, setPrevGameActive] = useState(false);

  async function createGame(unlisted: boolean) {
    if (activeRoomPlayer) {
      await leaveRoom({
        matchID: activeRoomPlayer.matchID,
        playerID: activeRoomPlayer.playerID.toString(),
        credentials: activeRoomPlayer.credential,
      });
    }

    const matchID = await createMatch(2, unlisted);
    navigate(`/rooms/${matchID}`);
  }

  const initialButtons = (
    <>
      <Button theme="green" onClick={() => setShowHostOptions(true)}>
        Host
      </Button>

      <Button theme="blue" onClick={() => navigate('/rooms')}>
        Join
      </Button>

      <Button
        theme="yellow"
        onClick={() => window.open('http://files.roxley.com/Santorini-Rulebook-Web-2016.08.14.pdf', '_blank')}
      >
        Rules
      </Button>
    </>
  );

  const hostOptionsButtons = (
    <>
      <Button theme="green" onClick={() => createGame(false)}>
        Public
      </Button>

      <Button theme="blue" onClick={() => createGame(true)}>
        Private
      </Button>

      <Button theme="red" onClick={() => setShowHostOptions(false)}>
        Cancel
      </Button>
    </>
  );

  useEffect(() => {
    async function isPrevGameActive() : Promise<void> {
      if (activeRoomPlayer?.matchID) {
        const matchData = await getMatch(activeRoomPlayer?.matchID);
        if (matchData && !matchData.gameover) {
          setPrevGameActive(true);
        }
      }
    }

    isPrevGameActive();
  }, [activeRoomPlayer]);

  return (
    <LobbyPage>
      <ButtonChangeNickname />
      { prevGameActive && <ButtonBack to={`/rooms/${activeRoomPlayer?.matchID}`} text="Return to Game" />}
      <Logo className={style.logo} size="large" />

      <div className={style.buttonsDiv}>
        {showHostOptions ? hostOptionsButtons : initialButtons}
      </div>

    </LobbyPage>
  );
}
