import React from 'react';
import Slider from 'react-slick';
import classNames from 'classnames';
import { Button } from '../Button';
import { useStoreState } from '../../store';
import { getSortedCharacters } from '../../game/characters';
import { useBoardContext } from '../GameBoard/BoardContext';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './style.scss';
import { Player } from '../../types/GameTypes';

export const CharacterBox: React.FC<{ name: string }> = ({ name }) => {
  const { State, moves } = useBoardContext();

  const activeRoomPlayer = useStoreState((s) => s.activeRoomPlayer);
  const playerID = String(activeRoomPlayer?.playerID);

  const player: Player = State.players[playerID];
  const opponentCharacterName = State.players[player.opponentId].char.name;

  // Return true if opponent has taken this character
  // false if Random, Mortal, or not taken
  function isCharacterTaken(): boolean {
    return opponentCharacterName === name && !['Random', 'Mortal'].includes(name);
  }

  function select(): void {
    if (!isCharacterTaken()) {
      moves.SetChar(playerID, name);
    }
  }

  return (
    <div
      style={{
        backgroundImage: `url('${
          `${process.env.PUBLIC_URL}/CharacterImages/${name}.png`
        }')`,
      }}
      className={classNames('characterBoxSelectable', isCharacterTaken() && 'grayscale')}
      onClick={select}
      onKeyDown={(e) => e.key === 'Enter' && select()}
      role="button"
      tabIndex={0}
    >
      <span>{name}</span>
    </div>
  );
};

export const SelectedCharacterBox: React.FC<{
  name: string;
  playerID: string;
}> = ({ name, playerID }) => {
  const { State } = useBoardContext();

  return (
    <div
      style={{
        backgroundImage: `url('${
          `${process.env.PUBLIC_URL}/CharacterImages/${name}.png`
        }')`,
      }}
      className="characterBox"
    >
      {State.players[playerID].ready
        && (
        <img
          className="characterBoxCheck"
          alt="ready"
          src={`${process.env.PUBLIC_URL}/CharacterImages/check.png`}
        />
        )}
      <span>{name}</span>
    </div>
  );
};

export const CharacterSelect = () => {
  const { State, moves } = useBoardContext();

  const roomMetadata = useStoreState((s) => s.roomMetadata);
  const activeRoomPlayer = useStoreState((s) => s.activeRoomPlayer);
  const playerID = String(activeRoomPlayer?.playerID);

  return (
    <div className="charSelect">
      <h1>Select a Character</h1>

      <Slider
        dots={false}
        infinite
        speed={500}
        slidesToShow={3}
        swipeToSlide
        className="charSelect__carousel"
      >
        {getSortedCharacters().map((character) => (
          <div key={character}>
            <CharacterBox name={character} />
          </div>
        ))}
      </Slider>

      <div className="charSelect__characters">
        {getSortedCharacters().map((character) => (
          <CharacterBox key={character} name={character} />
        ))}
      </div>

      <div className="charSelect__selectedCharDiv">
        <div className="charSelect__selectedChar">
          <span className="charSelect__playerName">
            {roomMetadata?.players[0].name}
          </span>
          <SelectedCharacterBox
            name={State.players['0'].char.name}
            playerID="0"
          />
          <span>
            {State.players['0'].char.name === 'Random'
              ? 'Random'
              : State.players['0'].char.desc}
          </span>
        </div>
        <div className="charSelect__selectedChar">
          <span className="charSelect__playerName">
            {roomMetadata?.players[1].name}
          </span>
          <SelectedCharacterBox
            name={State.players['1'].char.name}
            playerID="1"
          />
          <span>
            {State.players['1'].char.name === 'Random'
              ? 'Random'
              : State.players['1'].char.desc}
          </span>
        </div>
      </div>

      {State.players[playerID].ready ? (
        <Button
          theme="red"
          className="button"
          onClick={() => {
            moves.CancelReady(playerID);
          }}
        >
          Cancel
        </Button>
      ) : (
        <Button
          theme="green"
          className="button"
          onClick={() => {
            moves.Ready(playerID);
          }}
        >
          Ready
        </Button>
      )}
    </div>
  );
};
