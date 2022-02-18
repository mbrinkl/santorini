import { useEffect, useState } from 'react';
import { LobbyPage } from './Wrapper';
import { Logo } from '../Logo';
import { ButtonLink } from '../Button';
import { ButtonChangeNickname } from '../ButtonChangeNickname';
import { ButtonBack } from '../ButtonBack';
import { useStoreActions, useStoreState } from '../../store';
import { getMatch } from '../../api';
import { ButtonGroup } from '../ButtonGroup';

export const Home = () : JSX.Element => {
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
      <Logo />

      <ButtonGroup>
        <ButtonLink theme="green" to="/create">
          Create
        </ButtonLink>

        <ButtonLink theme="blue" to="/rooms">
          Join
        </ButtonLink>

        <ButtonLink theme="yellow" to="/watch">
          Watch
        </ButtonLink>
      </ButtonGroup>
    </LobbyPage>
  );
};
