import React from 'react';
import Slider from 'react-slick';
import classNames from 'classnames';
import { ConnectedIndicator } from '../GameBoard/ConnectedIndicator';
import { Button } from '../Button';
import { getSortedCharacters } from '../../game/characters';
import { useBoardContext } from '../GameBoard/BoardContext';
import CheckImg from '../../assets/png/check.png';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './style.scss';

export const CharacterBox: React.FC<{ name: string }> = ({ name }) => {
  const { G, moves, playerID } = useBoardContext();
  const takenCharacters: string[] = [];

  Object.values(G.players).forEach((player) => {
    takenCharacters.push(player.char.name);
  });

  // Return true if opponent has taken this character
  // false if Random, Mortal, or not taken
  function isCharacterTaken(): boolean {
    return takenCharacters.includes(name) && !['Random', 'Mortal'].includes(name);
  }

  function select(): void {
    if (!isCharacterTaken()) {
      moves.SetChar(playerID, name);
    }
  }

  return (
    <div
      className={classNames(name, 'characterBoxSelectable', isCharacterTaken() && 'grayscale')}
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
  const { G } = useBoardContext();

  return (
    <div className={classNames(name, 'characterBox')}>
      {G.players[playerID].ready
        && (
        <img
          className="characterBoxCheck"
          alt="ready"
          src={CheckImg}
        />
        )}
      <span>{name}</span>
    </div>
  );
};

export const CharacterSelect = () => {
  const {
    G, moves, matchData, playerID,
  } = useBoardContext();

  let readyButton: JSX.Element | null = null;

  // If not a spectator
  if (playerID) {
    if (G.players[playerID].ready) {
      readyButton = (
        <Button
          theme="red"
          onClick={() => {
            moves.CancelReady(playerID);
          }}
        >
          Cancel
        </Button>
      );
    } else {
      readyButton = (
        <Button
          theme="green"
          onClick={() => {
            moves.Ready(playerID);
          }}
        >
          Ready
        </Button>
      );
    }
  }

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

        {Object.values(G.players).map((player) => (
          <div key={`selectedChar${player.id}`} className="charSelect__selectedChar">
            <span className="charSelect__playerName">
              {matchData?.[player.id].name}
            </span>
            <SelectedCharacterBox
              name={player.char.name}
              playerID={player.id}
            />
            <span>
              {player.char.name === 'Random'
                ? 'Random'
                : G.players['0'].char.desc}
            </span>
            <ConnectedIndicator playerID={0} />
          </div>
        ))}

      </div>

      {readyButton}
    </div>
  );
};
