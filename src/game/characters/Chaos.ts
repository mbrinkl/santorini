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
  charState: CharacterState,
  numDomes: number,
) : void {
  const { opponentID } = G.players[playerID];
  const attrs: ChaosAttrs = charState.attrs as ChaosAttrs;

  if (attrs.currentCharacter === 'Athena') {
    const athenaAttrs = charState.attrs as AthenaAttrs;
    G.players[opponentID].charState.moveUpHeight = athenaAttrs.opponentMoveUpHeight;
  }

  if (attrs.nextCharacterList.length === 0) {
    charState.attrs.nextCharacterList = random.Shuffle([
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

  charState.desc = `${newCharacterName} - ${newCharacter.desc} ${Chaos.desc}`;
  charState.buttonActive = newCharacter.buttonActive;
  charState.buttonText = newCharacter.buttonText;
  charState.moveUpHeight = newCharacter.moveUpHeight;

  const updatedAttrs: ChaosAttrs = {
    numDomes,
    nextCharacterList: attrs.nextCharacterList,
    currentCharacter: newCharacterName,
  };

  charState.attrs = {
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

  initialize: (context, charState: CharacterState<ChaosAttrs>) => {
    changeEmulatingCharacter(context, charState, 0);
  },

  onTurnBegin: (context, charState: CharacterState<ChaosAttrs>) => {
    const { G } = context;
    const numDomes: number = G.spaces.filter((space) => space.isDomed === true).length;

    if (charState.attrs.numDomes < numDomes) {
      changeEmulatingCharacter(context, charState, numDomes);
      charState.attrs = charState.attrs as ChaosAttrs;
    }

    const character = getCharacter(charState.attrs.currentCharacter);
    character.onTurnBegin?.(context, charState);
  },

  onTurnEnd: (context, charState: CharacterState<ChaosAttrs>) => {
    const { G } = context;
    const character = getCharacter(charState.attrs.currentCharacter);
    character.onTurnEnd?.(context, charState);

    const numDomes = G.spaces.filter((space) => space.isDomed === true).length;

    if (charState.attrs.numDomes < numDomes) {
      changeEmulatingCharacter(context, charState, numDomes);
    }
  },

  validSelect: (context, charState: CharacterState<ChaosAttrs>) => (
    getCharacter(charState.attrs.currentCharacter).validSelect(context, charState)
  ),
  select: (context, charState: CharacterState<ChaosAttrs>, pos) => (
    getCharacter(charState.attrs.currentCharacter).select(context, charState, pos)
  ),
  validMove: (context, charState: CharacterState<ChaosAttrs>, originalPos) => (
    getCharacter(charState.attrs.currentCharacter).validMove(context, charState, originalPos)
  ),
  hasValidMoves: (context, charState: CharacterState<ChaosAttrs>) => (
    getCharacter(charState.attrs.currentCharacter).hasValidMoves(context, charState)
  ),
  move: (context, charState: CharacterState<ChaosAttrs>, pos) => (
    getCharacter(charState.attrs.currentCharacter).move(context, charState, pos)
  ),
  validBuild: (context, charState: CharacterState<ChaosAttrs>, originalPos) => (
    getCharacter(charState.attrs.currentCharacter).validBuild(context, charState, originalPos)
  ),
  hasValidBuild: (context, charState: CharacterState<ChaosAttrs>) => (
    getCharacter(charState.attrs.currentCharacter).hasValidBuild(context, charState)
  ),
  build: (context, charState: CharacterState<ChaosAttrs>, pos) => (
    getCharacter(charState.attrs.currentCharacter).build(context, charState, pos)
  ),
  buttonPressed: (context, charState: CharacterState<ChaosAttrs>) => (
    getCharacter(charState.attrs.currentCharacter).buttonPressed(context, charState)
  ),
  checkWinByMove: (G, charState: CharacterState<ChaosAttrs>, heightBefore, heightAfter) => (
    getCharacter(charState.attrs.currentCharacter)
      .checkWinByMove(G, charState, heightBefore, heightAfter)
  ),
};
