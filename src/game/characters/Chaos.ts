import { Mortal } from './Mortal';
import { GameState, Player } from '../../types/GameTypes';
import { Character, CharacterState, getCharacter } from '.';
import { Ctx } from 'boardgame.io';

function changeEmulatingCharacter(ctx: Ctx, char: CharacterState, numDomes: number): void {

  if (char.attrs.nextCharacterList.length === 0) {
    char.attrs.nextCharacterList = ctx.random?.Shuffle([
      "Apollo",
      "Artemis",
      "Athena",
      "Atlas",
      "Demeter",
      "Hephaestus",
      "Hermes",
      "Minotaur",
      "Pan",
      "Prometheus"
    ]);
  }
  
  const newCharacterName: string = char.attrs.nextCharacterList.shift();
  const newCharacter: Character = getCharacter(newCharacterName);

  char.desc = `${newCharacterName} - ${newCharacter.desc} ${Chaos.desc}`;
  char.buttonActive = newCharacter.buttonActive;
  char.buttonText = newCharacter.buttonText;
  char.moveUpHeight = newCharacter.moveUpHeight;

  char.attrs = {
    numDomes: numDomes,
    nextCharacterList: char.attrs.nextCharacterList,
    currentCharacter: newCharacterName,
   ...newCharacter.attrs
  };
}

export const Chaos: Character = {
  ...Mortal,

  name: 'Chaos',
  desc: `(Changes between Simple God Powers after any turn in which at least one dome is built)`,
  attrs: {
    numDomes: 0,
    nextCharacterList: [],
    currentCharacter: '', 
  },

  initialize : (
    G: GameState,
    ctx: Ctx,
    player: Player,
    char: CharacterState
  ) => {
    changeEmulatingCharacter(ctx, char, 0);
  },

  onTurnBegin : (
    G: GameState,
    ctx: Ctx,
    player: Player,
    char: CharacterState
  ) => {
    const numDomes: number = G.spaces.filter((space) => space.is_domed === true).length;

    if (char.attrs.numDomes < numDomes) {
      changeEmulatingCharacter(ctx, char, numDomes);
    }

    const character = getCharacter(char.attrs.currentCharacter);
    character.onTurnBegin(G, ctx, player, char);
  },

  onTurnEnd : (
    G: GameState,
    ctx: Ctx,
    player: Player,
    char: CharacterState
  ) => {
    const character = getCharacter(char.attrs.currentCharacter);
    character.onTurnBegin(G, ctx, player, char);

    const numDomes = G.spaces.filter((space) => space.is_domed === true).length;

    if (char.attrs.numDomes < numDomes) {
      changeEmulatingCharacter(ctx, char, numDomes);
    }
  },

  validSelect: (G: GameState, ctx: Ctx, player: Player, char: CharacterState) => {
    return getCharacter(char.attrs.currentCharacter).validSelect(G, ctx, player, char);
  },
  select: (G: GameState, ctx: Ctx, player: Player, char: CharacterState, pos: number) => {
    return getCharacter(char.attrs.currentCharacter).select(G, ctx, player, char, pos);
  },
  validMove: (G: GameState, ctx: Ctx, player: Player, char: CharacterState, originalPos: number) => {
    return getCharacter(char.attrs.currentCharacter).validMove(G, ctx, player, char, originalPos);
  },
  hasValidMoves: (G: GameState, ctx: Ctx, player: Player, char: CharacterState) => {
    return getCharacter(char.attrs.currentCharacter).hasValidMoves(G, ctx, player, char);
  },
  move: (G: GameState, ctx: Ctx, player: Player, char: CharacterState, pos: number) => {
    return getCharacter(char.attrs.currentCharacter).move(G, ctx, player, char, pos);
  },
  validBuild: (G: GameState, ctx: Ctx, player: Player, char: CharacterState, originalPos: number) => {
    return getCharacter(char.attrs.currentCharacter).validBuild(G, ctx, player, char, originalPos);
  },
  hasValidBuild: (G: GameState, ctx: Ctx, player: Player, char: CharacterState) => {
    return getCharacter(char.attrs.currentCharacter).hasValidBuild(G, ctx, player, char);
  },
  build: (G: GameState, ctx: Ctx, player: Player, char: CharacterState, pos: number) => {
    return getCharacter(char.attrs.currentCharacter).build(G, ctx, player, char, pos);
  },
  buttonPressed: (G: GameState, ctx: Ctx, player: Player, char: CharacterState) => {
    return getCharacter(char.attrs.currentCharacter).buttonPressed(G, ctx, player, char);
  },
  checkWinByMove: (G: GameState, char: CharacterState, heightBefore: number, heightAfter: number) => {
    return getCharacter(char.attrs.currentCharacter).checkWinByMove(G, char, heightBefore, heightAfter);
  },
}