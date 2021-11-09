import { Ctx } from 'boardgame.io';
import { Mortal } from './Mortal';
import { GameState, Player } from '../../types/GameTypes';
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
  G: GameState,
  ctx: Ctx,
  player: Player,
  char: CharacterState,
  numDomes: number,
) : void {
  const attrs: ChaosAttrs = char.attrs as ChaosAttrs;

  if (attrs.currentCharacter === 'Athena') {
    const athenaAttrs = char.attrs as AthenaAttrs;
    G.players[player.opponentId].char.moveUpHeight = athenaAttrs.opponentMoveUpHeight;
  }

  if (attrs.nextCharacterList.length === 0) {
    char.attrs.nextCharacterList = ctx.random?.Shuffle([
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

  const newCharacterName: PossibleCharacters = attrs.nextCharacterList.shift() || 'Apollo'; // fallback;
  const newCharacter: Character<any> = getCharacter(newCharacterName);

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

  initialize: (
    G: GameState,
    ctx: Ctx,
    player: Player,
    char: CharacterState,
  ) => {
    changeEmulatingCharacter(G, ctx, player, char, 0);
  },

  onTurnBegin: (
    G: GameState,
    ctx: Ctx,
    player: Player,
    char: CharacterState,
  ) => {
    const numDomes: number = G.spaces.filter((space) => space.isDomed === true).length;

    if (char.attrs.numDomes < numDomes) {
      changeEmulatingCharacter(G, ctx, player, char, numDomes);
      char.attrs = char.attrs as ChaosAttrs;
    }

    const character = getCharacter(char.attrs.currentCharacter);
    character.onTurnBegin?.(G, ctx, player, char);
  },

  onTurnEnd: (
    G: GameState,
    ctx: Ctx,
    player: Player,
    char: CharacterState,
  ) => {
    const character = getCharacter(char.attrs.currentCharacter);
    character.onTurnEnd?.(G, ctx, player, char);

    const numDomes = G.spaces.filter((space) => space.isDomed === true).length;

    if (char.attrs.numDomes < numDomes) {
      changeEmulatingCharacter(G, ctx, player, char, numDomes);
    }
  },

  validSelect: (G, ctx, player, char: CharacterState<ChaosAttrs>) => (
    getCharacter(char.attrs.currentCharacter).validSelect(G, ctx, player, char)
  ),
  select: (G, ctx, player, char: CharacterState<ChaosAttrs>, pos) => (
    getCharacter(char.attrs.currentCharacter).select(G, ctx, player, char, pos)
  ),
  validMove: (G, ctx, player, char: CharacterState<ChaosAttrs>, originalPos) => (
    getCharacter(char.attrs.currentCharacter)
      .validMove(G, ctx, player, char, originalPos)
  ),
  hasValidMoves: (G, ctx, player, char: CharacterState<ChaosAttrs>) => (
    getCharacter(char.attrs.currentCharacter)
      .hasValidMoves(G, ctx, player, char)
  ),
  move: (G, ctx, player, char: CharacterState<ChaosAttrs>, pos) => (
    getCharacter(char.attrs.currentCharacter).move(G, ctx, player, char, pos)
  ),
  validBuild: (G, ctx, player, char: CharacterState<ChaosAttrs>, originalPos) => (
    getCharacter(char.attrs.currentCharacter)
      .validBuild(G, ctx, player, char, originalPos)
  ),
  hasValidBuild: (G, ctx, player, char: CharacterState<ChaosAttrs>) => (
    getCharacter(char.attrs.currentCharacter).hasValidBuild(G, ctx, player, char)
  ),
  build: (G, ctx, player, char: CharacterState<ChaosAttrs>, pos) => (
    getCharacter(char.attrs.currentCharacter).build(G, ctx, player, char, pos)
  ),
  buttonPressed: (G, ctx, player, char: CharacterState<ChaosAttrs>) => (
    getCharacter(char.attrs.currentCharacter).buttonPressed(G, ctx, player, char)
  ),
  checkWinByMove: (G, char: CharacterState<ChaosAttrs>, heightBefore, heightAfter) => (
    getCharacter(char.attrs.currentCharacter)
      .checkWinByMove(G, char, heightBefore, heightAfter)
  ),
};
