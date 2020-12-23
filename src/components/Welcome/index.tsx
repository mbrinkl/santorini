import React, {useState, useEffect} from "react";
import { LobbyPage } from "components/LobbyPage";
import { Logo } from "components/Logo";
import { Button, ButtonProps } from "components/Button";
import style from "./style.module.scss";
import { ButtonChangeNickname } from "../ButtonChangeNickname";
import { useStoreActions, useStoreState } from "../../store";
import { useHistory } from "react-router-dom";

interface Props {
  playerCount: number;
  onClick(playerCount: number): void;
}

const CreateGameButton: React.FC<ButtonProps & Props> = ({
  playerCount,
  onClick,
  ...props
}) => {
  return (
    <Button
      className={style.buttons}
      onClick={() => onClick(playerCount)}
      {...props}
    >
      Play!
    </Button>
  );
};

export const Welcome = () => {

  const [redirect, setRedirect] = useState(false);
  const createGameRoom = useStoreActions((s) => s.createGameRoom);
  const matchID = useStoreState((s) => s.matchID);
  const history = useHistory();

  function OnCreate(numPlayers: number) {
    if (!matchID) {
      createGameRoom(numPlayers);
    }

    setRedirect(true);
  }

  function onHowToPlay() {
    window.open("http://files.roxley.com/Santorini-Rulebook-Web-2016.08.14.pdf", "_blank");
  }

  useEffect(() => {
    if (redirect && matchID) {
      history.push({
        pathname: `/rooms/${matchID}`,
      });
    }
  }, [matchID, redirect, history]);

  return (
    <LobbyPage>
      <ButtonChangeNickname />

      <Logo className={style.logo} size="large" />

      <div className={style.buttonsDiv}>
        <Button theme="yellow" 
          className={style.buttons}
          onClick={onHowToPlay}
          >
            Rules
        </Button>

        <CreateGameButton theme="green" 
          playerCount={2}
          onClick={OnCreate}
        >
          Play!
        </CreateGameButton>
      </div>

    </LobbyPage>
  );
};
