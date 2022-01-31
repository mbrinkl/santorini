import { Mortal } from './Mortal';
import { GameContext } from '../../types/GameTypes';
import { Character, CharacterState } from '../../types/CharacterTypes';
import { getCharacter } from '.';
import { AthenaAttrs } from './Athena';

type PossibleCharacters = 'Apollo' | 'Artemis' | 'Athena' | 'Atlas' | 'Demeter' | 'Hephaestus' |
'Hermes' | 'Minotaur' | 'Pan' | 'Prometheus';

interface ChaosAttrs {
  numDomes: number,
  nextCharacterList: PossibleCharacters[],
  currentCharacter: PossibleCharacters,
}

function changeEmulatingCharacter(
  { G, playerID, random }: GameContext,
  char: CharacterState,
  numDomes: number,
) : void {
  const opponentID = G.players[playerID].opponentId;
  const attrs: ChaosAttrs = char.attrs as ChaosAttrs;

  if (attrs.currentCharacter === 'Athena') {
    const athenaAttrs = char.attrs as AthenaAttrs;
    G.players[opponentID].char.moveUpHeight = athenaAttrs.opponentMoveUpHeight;
  }

  if (attrs.nextCharacterList.length === 0) {
    char.attrs.nextCharacterList = random.Shuffle([
      'Apollo',
      'Artemis',
      'Athena',
      'Atlas',
      'Demeter',
      'Hephaestus',
      'Hermes',
      'Minotaur',
      'Pan',
      'Prometheus',
    ]);
  }

  const newCharacterName = attrs.nextCharacterList.shift() || 'Apollo'; // fallback;
  const newCharacter = getCharacter(newCharacterName);

  char.desc = `${newCharacterName} - ${newCharacter.desc} ${Chaos.desc}`;
  char.buttonActive = newCharacter.buttonActive;
  char.buttonText = newCharacter.buttonText;
  char.moveUpHeight = newCharacter.moveUpHeight;

  const updatedAttrs: ChaosAttrs = {
    numDomes,
    nextCharacterList: attrs.nextCharacterList,
    currentCharacter: newCharacterName,
  };

  char.attrs = {
    ...updatedAttrs,
    ...newCharacter.attrs,
  };
}

export const Chaos: Character<ChaosAttrs> = {
  ...Mortal,

  desc: '(Changes between Simple God Powers after any turn in which at least one dome is built)',
  attrs: {
    numDomes: 0,
    nextCharacterList: [],
    currentCharacter: 'Apollo',
  },

  initialize: (context, char: CharacterState<ChaosAttrs>) => {
    changeEmulatingCharacter(context, char, 0);
  },

  onTurnBegin: (context, char: CharacterState<ChaosAttrs>) => {
    const { G } = context;
    const numDomes: number = G.spaces.filter((space) => space.isDomed === true).length;

    if (char.attrs.numDomes < numDomes) {
      changeEmulatingCharacter(context, char, numDomes);
      char.attrs = char.attrs as ChaosAttrs;
    }

    const character = getCharacter(char.attrs.currentCharacter);
    character.onTurnBegin?.(context, char);
  },

  onTurnEnd: (context, char: CharacterState<ChaosAttrs>) => {
    const { G } = context;
    const character = getCharacter(char.attrs.currentCharacter);
    character.onTurnEnd?.(context, char);

    const numDomes = G.spaces.filter((space) => space.isDomed === true).length;

    if (char.attrs.numDomes < numDomes) {
      changeEmulatingCharacter(context, char, numDomes);
    }
  },

  validSelect: (context, char: CharacterState<ChaosAttrs>) => (
    getCharacter(char.attrs.currentCharacter).validSelect(context, char)
  ),
  select: (context, char: CharacterState<ChaosAttrs>, pos) => (
    getCharacter(char.attrs.currentCharacter).select(context, char, pos)
  ),
  validMove: (context, char: CharacterState<ChaosAttrs>, originalPos) => (
    getCharacter(char.attrs.currentCharacter)
      .validMove(context, char, originalPos)
  ),
  hasValidMoves: (context, char: CharacterState<ChaosAttrs>) => (
    getCharacter(char.attrs.currentCharacter)
      .hasValidMoves(context, char)
  ),
  move: (context, char: CharacterState<ChaosAttrs>, pos) => (
    getCharacter(char.attrs.currentCharacter).move(context, char, pos)
  ),
  validBuild: (context, char: CharacterState<ChaosAttrs>, originalPos) => (
    getCharacter(char.attrs.currentCharacter)
      .validBuild(context, char, originalPos)
  ),
  hasValidBuild: (context, char: CharacterState<ChaosAttrs>) => (
    getCharacter(char.attrs.currentCharacter).hasValidBuild(context, char)
  ),
  build: (context, char: CharacterState<ChaosAttrs>, pos) => (
    getCharacter(char.attrs.currentCharacter).build(context, char, pos)
  ),
  buttonPressed: (context, char: CharacterState<ChaosAttrs>) => (
    getCharacter(char.attrs.currentCharacter).buttonPressed(context, char)
  ),
  checkWinByMove: (G, char: CharacterState<ChaosAttrs>, heightBefore, heightAfter) => (
    getCharacter(char.attrs.currentCharacter)
      .checkWinByMove(G, char, heightBefore, heightAfter)
  ),
};
