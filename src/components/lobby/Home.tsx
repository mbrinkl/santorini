import { useEffect, useState } from 'react';
import { LobbyPage } from './Wrapper';
import { Logo } from '../common/Logo';
import { ButtonLink } from '../common/Button';
import { ButtonChangeNickname } from '../common/ButtonChangeNickname';
import { ButtonBack } from '../common/ButtonBack';
import { useAppDispatch, useAppSelector } from '../../store';
import { getMatch } from '../../api';
import { ButtonGroup } from '../common/ButtonGroup';
import { userSlice } from '../../store/user';

export const Home = (): JSX.Element => {
  const [prevGameActive, setPrevGameActive] = useState(false);
  const activeRoomPlayer = useAppSelector((s) => s.user.activeRoomPlayer);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const isPrevGameActive = async () => {
      if (activeRoomPlayer) {
        const matchData = await getMatch(activeRoomPlayer.matchID);
        if (matchData && !matchData.gameover) {
          setPrevGameActive(true);
        } else {
          dispatch(userSlice.actions.setActiveRoomPlayer(null));
        }
      }
    };
    isPrevGameActive();
  }, [activeRoomPlayer, dispatch]);

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
