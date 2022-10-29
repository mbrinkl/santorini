import React, { useState } from 'react';
import Tippy from '@tippyjs/react';
import { useAppSelector, useAppDispatch } from '../../store';
import { useUpdatePlayerMutation } from '../../api';
import { ButtonBack } from '../common/ButtonBack';
import { Button } from '../common/Button';
import { LobbyPage } from './Wrapper';
import { Input } from '../common/Input';
import { userSlice } from '../../store/user';
import 'tippy.js/dist/tippy.css';
import './SetupNickname.scss';

export const SetupNickname = ({
  onSubmit,
}: {
  onSubmit?: () => void;
}): JSX.Element => {
  const initialNickname = useAppSelector((s) => s.user.nickname);
  const [nickname, setNickname] = useState(initialNickname || '');
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const activeRoomPlayer = useAppSelector((s) => s.user.activeRoomPlayer);
  const dispatch = useAppDispatch();
  const [updatePlayer] = useUpdatePlayerMutation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (nickname.length > 0) {
      dispatch(userSlice.actions.setNickname(nickname));
      onSubmit?.();

      // update player name if they are in a game
      if (activeRoomPlayer) {
        updatePlayer({
          matchID: activeRoomPlayer.matchID,
          playerID: activeRoomPlayer.playerID,
          credentials: activeRoomPlayer.credentials,
          newName: nickname,
        });
      }
    } else {
      setTooltipVisible(true);
      setTimeout(() => setTooltipVisible(false), 1500);
    }
  };

  return (
    <LobbyPage>
      <ButtonBack to="/" />

      <h3 className="setup-nickname__title">Set your nickname</h3>

      <form onSubmit={handleSubmit} className="setup-nickname__form">
        <Input
          placeholder="Enter a nickname..."
          className="setup-nickname__input"
          onChange={(e) => setNickname(e.target.value)}
          value={nickname}
          maxLength={8}
          autoFocus
        />

        <Tippy
          visible={tooltipVisible}
          offset={[0, 12]}
          content={<p>Nickname cannot be empty.</p>}
        >
          <Button theme="blue" type="submit">
            Save
          </Button>
        </Tippy>
      </form>
    </LobbyPage>
  );
};
