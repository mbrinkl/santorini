import classNames from 'classnames';
import { banList } from '../../game/util/characterUtil';
import { useBoardContext } from '../../hooks/useBoardContext';
import CheckImg from '../../assets/png/check.png';
import './CharacterCard.scss';

const getCharacterImageUrl = (name: string): string => {
  name = name.replace(/\s/g, '');
  return `url(/characterImages/${name}.png)`;
};

export const CharacterCard = ({
  playerID,
  name,
}: {
  playerID: string | null;
  name: string;
}): JSX.Element => {
  const { G, moves } = useBoardContext();
  const takenCharacters: string[] = [];

  Object.values(G.players).forEach((player) => {
    takenCharacters.push(player.charState.name);
  });

  function isBanned(): boolean {
    if (!playerID) {
      return false;
    }

    const { opponentID } = G.players[playerID];
    const opponentCharName = G.players[opponentID].charState.name;
    if (
      banList.filter(
        (ban) => ban.includes(name) && ban.includes(opponentCharName),
      ).length > 0
    ) {
      return true;
    }

    return false;
  }

  function isUnselectable(): boolean {
    if (['Random', 'Mortal'].includes(name)) {
      return false;
    }

    return takenCharacters.includes(name) || isBanned();
  }

  function select(): void {
    if (!isUnselectable()) {
      moves.setChar(name);
    }
  }

  return (
    <div
      className={classNames(
        'character-card',
        isUnselectable()
          ? 'character-card--grayscale'
          : 'character-card--selectable',
      )}
      style={{
        backgroundImage: getCharacterImageUrl(name),
      }}
      onClick={select}
      onKeyDown={(e) => e.key === 'Enter' && select()}
      role="button"
      tabIndex={0}
    >
      <span>{name}</span>
    </div>
  );
};

export const SelectedCharacterCard = ({
  name,
  playerID,
}: {
  name: string;
  playerID: string;
}): JSX.Element => {
  const { G } = useBoardContext();

  return (
    <div
      className="character-card"
      style={{
        backgroundImage: getCharacterImageUrl(name),
      }}
    >
      {G.players[playerID].ready && (
        <img className="character-card--ready" alt="ready" src={CheckImg} />
      )}
      <span>{name}</span>
    </div>
  );
};
