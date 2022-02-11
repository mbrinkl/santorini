import { ChangeEventHandler, useState } from 'react';
import { ConnectedIndicator } from '../ConnectedIndicator';
import { Button } from '../Button';
import { getCharacterByName, getSortedCharacters } from '../../game/characters';
import { useBoardContext } from '../../context/boardContext';
import { Chat } from '../Chat';
import './style.scss';
import { CharacterCard, SelectedCharacterCard } from './CharacterCard';

export const CharacterSelect = () : JSX.Element => {
  const {
    G, moves, matchData, playerID,
  } = useBoardContext();
  const [characterList, setCharacterList] = useState(getSortedCharacters());

  const ready = playerID && G.players[playerID].ready;

  const filterCharacters: ChangeEventHandler<HTMLSelectElement> = (e) => {
    const { options } = e.target;
    const pack = options[options.selectedIndex].value;
    if (pack === 'all') {
      setCharacterList(getSortedCharacters());
    } else {
      const filteredList = getSortedCharacters().filter((char) => (
        getCharacterByName(char).pack === pack
      ));
      setCharacterList(filteredList);
    }
  };

  return (
    <div className="char-select">

      <div className="char-select__chat">
        <Chat />
      </div>

      <div className="char-select__main">
        <h1>Select a Character</h1>

        {Object.values(G.players).map((player) => (
          <div key={`selectedChar${player.ID}`} className="char-select__player-char">
            <div className="char-select__player-data">
              <div className="char-select__playerNameDiv">
                <ConnectedIndicator playerID={player.ID} />
                <span className="char-select__playerName">
                  {`${matchData?.[player.ID].name}${player.ID === playerID ? ' (You)' : ''}`}
                </span>
              </div>
              <SelectedCharacterCard
                name={player.charState.name}
                playerID={player.ID}
              />
            </div>
            <div className="char-select__characterDescription">
              {player.charState.name === 'Random'
                ? 'Random'
                : G.players[player.ID].charState.desc.map((line) => (
                  <p key={`char${line.length}`}>
                    {line}
                  </p>
                ))}
            </div>
          </div>
        ))}

        {playerID && (
        <Button
          className="char-select__ready-button"
          theme={ready ? 'red' : 'green'}
          onClick={() => { moves.ready(!ready); }}
        >
          {ready ? 'Cancel' : 'Ready'}
        </Button>
        )}

      </div>

      <div className="char-select__characters">
        <select className="char-select__dropdown" onChange={filterCharacters}>
          <option value="all">All</option>
          <option value="simple">Simple</option>
          <option value="advanced">Advanced</option>
          <option value="gf">Golden Fleece</option>
          <option value="heroes">Heroes</option>
          <option value="promo">Promo</option>
          <option value="custom">Custom</option>
        </select>

        {characterList.map((character) => (
          <CharacterCard key={character} playerID={playerID} name={character} />
        ))}
      </div>
    </div>
  );
};
