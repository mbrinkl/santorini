import { Mortal } from './Mortal';
import { GameContext } from '../../types/gameTypes';
import { Character, CharacterState } from '../../types/characterTypes';
import { getCharacterByName } from '.';

type PossibleCharacters =
  | 'Apollo'
  | 'Artemis'
  | 'Athena'
  | 'Atlas'
  | 'Demeter'
  | 'Hephaestus'
  | 'Hermes'
  | 'Minotaur'
  | 'Pan'
  | 'Prometheus';

type ChaosAttrs = {
  numDomes: number;
  nextCharacterList: PossibleCharacters[];
  currentCharacter: PossibleCharacters;
};

function changeEmulatingCharacter(
  { random }: GameContext,
  charState: CharacterState<ChaosAttrs>,
  numDomes: number,
): void {
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

  const newCharacterName =
    charState.attrs.nextCharacterList.shift() || 'Apollo'; // fallback;
  const newCharacter = getCharacterByName(newCharacterName);

  const newDesc = `${newCharacterName} - ${newCharacter.data.desc}`;
  charState.desc.splice(1, 1, newDesc);

  charState.buttonActive = newCharacter.data.buttonActive;
  charState.buttonText = newCharacter.data.buttonText;
  charState.moveUpHeight = newCharacter.data.moveUpHeight;

  const updatedAttrs: ChaosAttrs = {
    numDomes,
    nextCharacterList: charState.attrs.nextCharacterList,
    currentCharacter: newCharacterName,
  };

  charState.attrs = {
    ...updatedAttrs,
    ...newCharacter.data.attrs,
  };
}

export const Chaos: Character<ChaosAttrs> = {
  ...Mortal,

  data: {
    ...Mortal.data,
    desc: [
      `(Any Time: Changes between Simple God Powers after any turn
       in which at least one dome is built)`,
    ],
    pack: 'advanced',
    attrs: {
      numDomes: 0,
      nextCharacterList: [],
      currentCharacter: 'Apollo',
    },
  },

  initialize: (context, charState) => {
    changeEmulatingCharacter(context, charState, 0);
  },

  onTurnBegin: (context, charState) => {
    const { G } = context;
    const numDomes: number = G.spaces.filter(
      (space) => space.isDomed === true,
    ).length;

    if (charState.attrs.numDomes < numDomes) {
      changeEmulatingCharacter(context, charState, numDomes);
    }

    const character = getCharacterByName(charState.attrs.currentCharacter);
    character.onTurnBegin(context, charState);
  },

  onTurnEnd: (context, charState) => {
    const { G } = context;
    const character = getCharacterByName(charState.attrs.currentCharacter);
    character.onTurnEnd(context, charState);

    const numDomes = G.spaces.filter((space) => space.isDomed === true).length;

    if (charState.attrs.numDomes < numDomes) {
      changeEmulatingCharacter(context, charState, numDomes);
    }
  },

  validSelect: (context, charState) =>
    getCharacterByName(charState.attrs.currentCharacter).validSelect(
      context,
      charState,
    ),
  select: (context, charState, pos) =>
    getCharacterByName(charState.attrs.currentCharacter).select(
      context,
      charState,
      pos,
    ),
  getStageAfterSelect: (context, charState) =>
    getCharacterByName(charState.attrs.currentCharacter).getStageAfterSelect(
      context,
      charState,
    ),
  validMove: (context, charState, originalPos) =>
    getCharacterByName(charState.attrs.currentCharacter).validMove(
      context,
      charState,
      originalPos,
    ),
  move: (context, charState, pos) =>
    getCharacterByName(charState.attrs.currentCharacter).move(
      context,
      charState,
      pos,
    ),
  restrictOpponentMove: (context, charState, oppCharState, fromPos) =>
    getCharacterByName(charState.attrs.currentCharacter).restrictOpponentMove(
      context,
      charState,
      oppCharState,
      fromPos,
    ),
  afterOpponentMove: (context, charState, oppCharState, pos) =>
    getCharacterByName(charState.attrs.currentCharacter).afterOpponentMove(
      context,
      charState,
      oppCharState,
      pos,
    ),
  getStageAfterMove: (context, charState) =>
    getCharacterByName(charState.attrs.currentCharacter).getStageAfterMove(
      context,
      charState,
    ),
  validBuild: (context, charState, originalPos) =>
    getCharacterByName(charState.attrs.currentCharacter).validBuild(
      context,
      charState,
      originalPos,
    ),
  build: (context, charState, pos) =>
    getCharacterByName(charState.attrs.currentCharacter).build(
      context,
      charState,
      pos,
    ),

  restrictOpponentBuild: (context, charState, oppCharState, fromPos) =>
    getCharacterByName(charState.attrs.currentCharacter).restrictOpponentBuild(
      context,
      charState,
      oppCharState,
      fromPos,
    ),

  afterOpponentBuild: (context, charState, oppCharState, builtPos) =>
    getCharacterByName(charState.attrs.currentCharacter).afterOpponentBuild(
      context,
      charState,
      oppCharState,
      builtPos,
    ),

  getStageAfterBuild: (context, charState) =>
    getCharacterByName(charState.attrs.currentCharacter).getStageAfterBuild(
      context,
      charState,
    ),

  validSpecial: (context, charState, fromPos) =>
    getCharacterByName(charState.attrs.currentCharacter).validSpecial(
      context,
      charState,
      fromPos,
    ),
  special: (context, charState, pos) =>
    getCharacterByName(charState.attrs.currentCharacter).special(
      context,
      charState,
      pos,
    ),
  getStageAfterSpecial: (context, charState) =>
    getCharacterByName(charState.attrs.currentCharacter).getStageAfterSpecial(
      context,
      charState,
    ),
  buttonPressed: (context, charState) =>
    getCharacterByName(charState.attrs.currentCharacter).buttonPressed(
      context,
      charState,
    ),
  checkWinByMove: (G, charState, posBefore, posAfter) =>
    getCharacterByName(charState.attrs.currentCharacter).checkWinByMove(
      G,
      charState,
      posBefore,
      posAfter,
    ),
};
