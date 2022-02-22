import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ButtonGroup } from '../common/ButtonGroup';
import { ButtonBack } from '../common/ButtonBack';
import { SetupNickname } from './SetupNickname';
import { Logo } from '../common/Logo';
import { LobbyPage } from './Wrapper';
import { Button } from '../common/Button';
import { ButtonChangeNickname } from '../common/ButtonChangeNickname';
import { useStoreActions, useStoreState } from '../../store';
import { createMatch } from '../../api';

export const CreatePage = (): JSX.Element => {
  const navigate = useNavigate();
  const [needNicknameGameType, setNeedNicknameGameType] = useState<
    boolean | null
  >(null);
  const nickname = useStoreState((s) => s.nickname);
  const activeRoomPlayer = useStoreState((s) => s.activeRoomPlayer);
  const leaveRoom = useStoreActions((s) => s.leaveRoom);

  async function createRoom(unlisted: boolean) {
    const matchID = await createMatch(2, unlisted);
    navigate(`/${matchID}`);
  }

  async function host(unlisted: boolean) {
    if (activeRoomPlayer) {
      await leaveRoom({
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
