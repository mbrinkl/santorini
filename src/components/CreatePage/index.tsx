import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ButtonBack } from '../ButtonBack';
import { SetupNickname } from '../SetupNickname';
import { Logo } from '../Logo';
import { LobbyPage } from '../LobbyPage';
import { Button } from '../Button';
import { ButtonChangeNickname } from '../ButtonChangeNickname';
import { useStoreActions, useStoreState } from '../../store';
import { createMatch } from '../../api';
import style from './style.module.scss';

export const CreatePage = () : JSX.Element => {
  const navigate = useNavigate();
  const [needNicknameGameType, setNeedNicknameGameType] = useState<boolean | null>(null);
  const [matchID, setMatchID] = useState<string | null>(null);
  const nickname = useStoreState((s) => s.nickname);
  const activeRoomPlayer = useStoreState((s) => s.activeRoomPlayer);
  const joinRoom = useStoreActions((s) => s.joinRoom);
  const leaveRoom = useStoreActions((s) => s.leaveRoom);

  useEffect(() => {
    if (nickname && matchID) {
      joinRoom({ matchID, playerID: '0', playerName: nickname });
      navigate(`/rooms/${matchID}`);
    }
  }, [nickname, matchID, joinRoom, navigate]);

  async function createRoom(unlisted: boolean) {
    const createdMatchID = await createMatch(2, unlisted);
    setMatchID(createdMatchID);
  }

  async function host(unlisted: boolean) {
    if (activeRoomPlayer) {
      await leaveRoom({
        matchID: activeRoomPlayer.matchID,
        playerID: activeRoomPlayer.playerID,
        credentials: activeRoomPlayer.credential,
      });
    }

    if (!nickname) {
      setNeedNicknameGameType(unlisted);
    } else {
      createRoom(unlisted);
    }
  }

  return (
    needNicknameGameType !== null
      ? <SetupNickname onSubmit={() => createRoom(needNicknameGameType)} />
      : (
        <LobbyPage>
          <ButtonBack to="/" />
          <Logo className={style.logo} size="large" />
          <ButtonChangeNickname />
          <div className={style.buttonsDiv}>
            <Button theme="green" onClick={() => host(false)}>
              Public
            </Button>

            <Button theme="blue" onClick={() => host(true)}>
              Private
            </Button>
          </div>
        </LobbyPage>
      )
  );
};
