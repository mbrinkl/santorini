import { Mortal } from './Mortal';
import { GameContext } from '../../types/GameTypes';
import { Character, CharacterState } from '../../types/CharacterTypes';
import { getCharacterByName } from '.';

type PossibleCharacters = 'Apollo' | 'Artemis' | 'Athena' | 'Atlas' | 'Demeter' | 'Hephaestus' |
'Hermes' | 'Minotaur' | 'Pan' | 'Prometheus';

interface ChaosAttrs {
  numDomes: number,
  nextCharacterList: PossibleCharacters[],
  currentCharacter: PossibleCharacters,
}

function changeEmulatingCharacter(
  { G, playerID, random }: GameContext,
  charState: CharacterState<ChaosAttrs>,
  numDomes: number,
) : void {
  if (charState.attrs.nextCharacterList.length === 0) {
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

  const newCharacterName = charState.attrs.nextCharacterList.shift() || 'Apollo'; // fallback;
  const newCharacter = getCharacterByName(newCharacterName);

  charState.desc = `${newCharacterName} - ${newCharacter.desc} ${Chaos.desc}`;
  charState.buttonActive = newCharacter.buttonActive;
  charState.buttonText = newCharacter.buttonText;
  charState.moveUpHeight = newCharacter.moveUpHeight;

  const updatedAttrs: ChaosAttrs = {
    numDomes,
    nextCharacterList: charState.attrs.nextCharacterList,
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

    const character = getCharacterByName(charState.attrs.currentCharacter);
    character.onTurnBegin(context, charState);
  },

  onTurnEnd: (context, charState: CharacterState<ChaosAttrs>) => {
    const { G } = context;
    const character = getCharacterByName(charState.attrs.currentCharacter);
    character.onTurnEnd(context, charState);

    const numDomes = G.spaces.filter((space) => space.isDomed === true).length;

    if (charState.attrs.numDomes < numDomes) {
      changeEmulatingCharacter(context, charState, numDomes);
    }
  },
  validSelect: (context, charState: CharacterState<ChaosAttrs>) => (
    getCharacterByName(charState.attrs.currentCharacter).validSelect(context, charState)
  ),
  select: (context, charState: CharacterState<ChaosAttrs>, pos) => (
    getCharacterByName(charState.attrs.currentCharacter).select(context, charState, pos)
  ),
  getStageAfterSelect: (context, charState: CharacterState<ChaosAttrs>) => (
    getCharacterByName(charState.attrs.currentCharacter).getStageAfterSelect(context, charState)
  ),
  validMove: (context, charState: CharacterState<ChaosAttrs>, originalPos) => (
    getCharacterByName(charState.attrs.currentCharacter).validMove(context, charState, originalPos)
  ),
  move: (context, charState: CharacterState<ChaosAttrs>, pos) => (
    getCharacterByName(charState.attrs.currentCharacter).move(context, charState, pos)
  ),
  restrictOpponentMove: (context, charState: CharacterState<ChaosAttrs>, oppCharState, fromPos) => (
    getCharacterByName(charState.attrs.currentCharacter)
      .restrictOpponentMove(context, charState, oppCharState, fromPos)
  ),

  afterOpponentMove: (context, charState: CharacterState<ChaosAttrs>, oppCharState, pos) => (
    getCharacterByName(charState.attrs.currentCharacter)
      .afterOpponentMove(context, charState, oppCharState, pos)
  ),

  getStageAfterMove: (context, charState: CharacterState<ChaosAttrs>) => (
    getCharacterByName(charState.attrs.currentCharacter).getStageAfterMove(context, charState)
  ),

  validBuild: (context, charState: CharacterState<ChaosAttrs>, originalPos) => (
    getCharacterByName(charState.attrs.currentCharacter).validBuild(context, charState, originalPos)
  ),
  build: (context, charState: CharacterState<ChaosAttrs>, pos) => (
    getCharacterByName(charState.attrs.currentCharacter).build(context, charState, pos)
  ),

  restrictOpponentBuild: (
    context,
    charState: CharacterState<ChaosAttrs>,
    oppCharState,
    fromPos,
  ) => (
    getCharacterByName(charState.attrs.currentCharacter)
      .restrictOpponentBuild(context, charState, oppCharState, fromPos)
  ),

  afterOpponentBuild: (context, charState: CharacterState<ChaosAttrs>, oppCharState, builtPos) => (
    getCharacterByName(charState.attrs.currentCharacter)
      .afterOpponentBuild(context, charState, oppCharState, builtPos)
  ),

  getStageAfterBuild: (context, charState: CharacterState<ChaosAttrs>) => (
    getCharacterByName(charState.attrs.currentCharacter).getStageAfterBuild(context, charState)
  ),

  validSpecial: (context, charState: CharacterState<ChaosAttrs>, fromPos) => (
    getCharacterByName(charState.attrs.currentCharacter).validSpecial(context, charState, fromPos)
  ),
  special: (context, charState: CharacterState<ChaosAttrs>, pos) => (
    getCharacterByName(charState.attrs.currentCharacter).special(context, charState, pos)
  ),
  getStageAfterSpecial: (context, charState: CharacterState<ChaosAttrs>) => (
    getCharacterByName(charState.attrs.currentCharacter).getStageAfterSpecial(context, charState)
  ),
  buttonPressed: (context, charState: CharacterState<ChaosAttrs>) => (
    getCharacterByName(charState.attrs.currentCharacter).buttonPressed(context, charState)
  ),
  checkWinByMove: (G, charState: CharacterState<ChaosAttrs>, posBefore, posAfter) => (
    getCharacterByName(charState.attrs.currentCharacter)
      .checkWinByMove(G, charState, posBefore, posAfter)
  ),
};
