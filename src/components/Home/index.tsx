import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LobbyPage } from '../LobbyPage';
import { Logo } from '../Logo';
import { Button } from '../Button';
import { ButtonChangeNickname } from '../ButtonChangeNickname';
import { ButtonBack } from '../ButtonBack';
import { useStoreActions, useStoreState } from '../../store';
import { getMatch } from '../../api';
import style from './style.module.scss';

export const Home = () : JSX.Element => {
  const navigate = useNavigate();
  const [prevGameActive, setPrevGameActive] = useState(false);
  const activeRoomPlayer = useStoreState((s) => s.activeRoomPlayer);
  const setActiveRoomPlayer = useStoreActions((s) => s.setActiveRoomPlayer);

  useEffect(() => {
    async function isPrevGameActive() : Promise<void> {
      if (activeRoomPlayer) {
        const matchData = await getMatch(activeRoomPlayer.matchID);
        if (matchData && !matchData.gameover) {
          setPrevGameActive(true);
        } else {
          setActiveRoomPlayer(null);
        }
      }
    }
    isPrevGameActive();
  }, [activeRoomPlayer, setActiveRoomPlayer]);

  return (
    <LobbyPage>
      <ButtonChangeNickname />
      { prevGameActive && <ButtonBack to={`/rooms/${activeRoomPlayer?.matchID}`} text="Return to Game" />}
      <Logo className={style.logo} size="large" />

      <div className={style.buttonsDiv}>
        <Button theme="green" onClick={() => navigate('/create')}>
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
      </div>
    </LobbyPage>
  );
};
