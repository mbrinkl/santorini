import { useEffect, useState } from 'react';
import { skipToken } from '@reduxjs/toolkit/dist/query';
import LobbyPage from './Wrapper';
import Logo from '../common/Logo';
import { ButtonLink } from '../common/Button';
import ButtonChangeNickname from '../common/ButtonChangeNickname';
import ButtonBack from '../common/ButtonBack';
import { useAppDispatch, useAppSelector } from '../../store';
import { useGetMatchQuery } from '../../api';
import ButtonGroup from '../common/ButtonGroup';
import userSlice from '../../store/user';

const Home = (): JSX.Element => {
  const [prevGameActive, setPrevGameActive] = useState(false);
  const userRoomData = useAppSelector((s) => s.user.roomData);
  const dispatch = useAppDispatch();
  const { data: currentMatch } = useGetMatchQuery(
    userRoomData?.matchID ?? skipToken,
  );

  useEffect(() => {
    if (currentMatch && !currentMatch.gameover) {
      setPrevGameActive(true);
    } else {
      dispatch(userSlice.actions.setRoomData(null));
    }
  }, [currentMatch, dispatch]);

  return (
    <LobbyPage>
      <ButtonChangeNickname />
      {prevGameActive && (
        <ButtonBack to={`/${userRoomData?.matchID}`} text="Return to Game" />
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

export default Home;
