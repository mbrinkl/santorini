import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ButtonGroup } from '../common/ButtonGroup';
import { ButtonBack } from '../common/ButtonBack';
import { SetupNickname } from './SetupNickname';
import { Logo } from '../common/Logo';
import { LobbyPage } from './Wrapper';
import { Button } from '../common/Button';
import { ButtonChangeNickname } from '../common/ButtonChangeNickname';
import { useAppSelector } from '../../store';
import { useCreateMatchMutation, useLeaveMatchMutation } from '../../api';

export const CreatePage = (): JSX.Element => {
  const navigate = useNavigate();
  const [needNicknameGameType, setNeedNicknameGameType] = useState<
    boolean | null
  >(null);
  const nickname = useAppSelector((s) => s.user.nickname);
  const activeRoomPlayer = useAppSelector((s) => s.user.activeRoomPlayer);

  const [createMatch] = useCreateMatchMutation();
  const [leaveMatch] = useLeaveMatchMutation();

  async function createRoom(unlisted: boolean) {
    createMatch({ numPlayers: 2, unlisted })
      .unwrap()
      .then((createdMatchID) => navigate(`/${createdMatchID}`));
  }

  async function host(unlisted: boolean) {
    if (activeRoomPlayer) {
      leaveMatch({
        matchID: activeRoomPlayer.matchID,
        playerID: activeRoomPlayer.playerID,
        credentials: activeRoomPlayer.credentials,
      });
    }

    if (!nickname) {
      setNeedNicknameGameType(unlisted);
    } else {
      createRoom(unlisted);
    }
  }

  return needNicknameGameType !== null ? (
    <SetupNickname onSubmit={() => createRoom(needNicknameGameType)} />
  ) : (
    <LobbyPage>
      <ButtonBack to="/" />
      <Logo />
      <ButtonChangeNickname />
      <ButtonGroup>
        <Button theme="green" onClick={() => host(false)}>
          Public
        </Button>

        <Button theme="blue" onClick={() => host(true)}>
          Private
        </Button>
      </ButtonGroup>
    </LobbyPage>
  );
};
