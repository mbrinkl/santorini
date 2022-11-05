import { ChangeEventHandler, useState } from 'react';
import { ConnectedIndicator } from './ConnectedIndicator';
import { Button, ButtonLink } from '../common/Button';
import {
  getCharacterByName,
  getSortedCharacters,
} from '../../game/util/characterUtil';
import { useBoardContext } from '../../hooks/useBoardContext';
import { CharacterCard, SelectedCharacterCard } from './CharacterCard';
import { ButtonGroup } from '../common/ButtonGroup';
import './CharacterSelect.scss';

export const CharacterSelect = (): JSX.Element => {
  const { G, moves, matchData, playerID } = useBoardContext();
  const [characterList, setCharacterList] = useState(getSortedCharacters());

  const ready = playerID && G.players[playerID].ready;

  const filterCharacters: ChangeEventHandler<HTMLSelectElement> = (e) => {
    const { options } = e.target;
    const pack = options[options.selectedIndex].value;
    if (pack === 'all') {
      setCharacterList(getSortedCharacters());
    } else {
      const filteredList = getSortedCharacters().filter(
        (char) => getCharacterByName(char).data.pack === pack,
      );
      setCharacterList(filteredList);
    }
  };

  return (
    <div className="char-select">
      <div className="char-select__main">
        {playerID && <h1 className="char-select__title">Select a Character</h1>}

        {Object.values(G.players).map((player) => (
          <div
            key={`selectedChar${player.ID}`}
            className="char-select__player-char"
          >
            <div className="char-select__player-data">
              <div className="char-select__playerNameDiv">
                <ConnectedIndicator playerID={player.ID} />
                <span className="char-select__playerName">
                  {`${matchData?.[Number(player.ID)].name}${
                    player.ID === playerID ? ' (You)' : ''
                  }`}
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
                    <p key={`char${line.length}`}>{line}</p>
                  ))}
            </div>
          </div>
        ))}

        <ButtonGroup>
          {playerID && (
            <Button
              theme={ready ? 'yellow' : 'green'}
              onClick={() => {
                moves.ready(!ready);
              }}
            >
              {ready ? 'Cancel' : 'Ready'}
            </Button>
          )}
          <ButtonLink theme="red" to="/">
            Leave
          </ButtonLink>
        </ButtonGroup>
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
