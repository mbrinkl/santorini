import { useEffect, useState } from 'react';
import { LobbyPage } from './Wrapper';
import { Logo } from '../common/Logo';
import { ButtonLink } from '../common/Button';
import { ButtonChangeNickname } from '../common/ButtonChangeNickname';
import { ButtonBack } from '../common/ButtonBack';
import { useStoreActions, useStoreState } from '../../store';
import { getMatch } from '../../api';
import { ButtonGroup } from '../common/ButtonGroup';

export const Home = (): JSX.Element => {
  const [prevGameActive, setPrevGameActive] = useState(false);
  const activeRoomPlayer = useStoreState((s) => s.activeRoomPlayer);
  const setActiveRoomPlayer = useStoreActions((s) => s.setActiveRoomPlayer);

  useEffect(() => {
    async function isPrevGameActive(): Promise<void> {
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
      {prevGameActive && (
        <ButtonBack
          to={`/${activeRoomPlayer?.matchID}`}
          text="Return to Game"
        />
      )}
      <Logo />

      <ButtonGroup>
        <ButtonLink theme="green" to="/create">
          Create
        </ButtonLink>

        <ButtonLink theme="blue" to="/join">
          Join
        </ButtonLink>

        <ButtonLink theme="yellow" to="/watch">
          Watch
        </ButtonLink>
      </ButtonGroup>
    </LobbyPage>
  );
};
