import { Mortal } from './Mortal';
import { GameState, Player } from '../index'
import { Character, CharacterState, getCharacter } from '.';
import { Ctx } from 'boardgame.io';
import { Artemis } from './Artemis';

const possibleCharacters: 'Apollo' | 'Artemis' = 'Apollo';

export const Chaos: Character = {
  ...Mortal,

  name: 'Chaos',
  desc: `Any Time: You have the power of one of the ten Simple Gods (listed below). After any turn in
    which at least one dome is built, a new random Simple God Power will be chosen. If you run out of 
    God Powers, shuffle them to create a new deck and draw the top one.`,
  attrs: {
    numDomes: 0,
    possibleCharacters: ["Apollo",
      "Artemis",
      "Athena",
      "Atlas",
      "Demeter",
      "Hephaestus",
      "Hermes",
      "Minotaur",
      "Pan",
      "Prometheus"],
    currentCharacter: '', 
  },

  initialize : (
    G: GameState,
    ctx: Ctx,
    player: Player,
    char: CharacterState
  ) => {
    ctx.random?.Shuffle(char.attrs.possibleCharacters);
    char.attrs.currentCharacter = char.attrs.possibleCharacters.shift();
  },

  // also on turn end probably
  onTurnBegin : (
    G: GameState,
    ctx: Ctx,
    player: Player,
    char: CharacterState
  ) => {
    const numDomes = G.spaces.filter((space) => space.is_domed === true).length;

    if (char.attrs.numDomes < numDomes) {
      const newCharacterName: string = char.attrs.possibleCharacters.shift();
      const newCharacter: Character = getCharacter(newCharacterName);
      let characterList: string[] = char.attrs.possibleCharacters;

      char.desc = Chaos.desc + `\n${newCharacter.name} - ${newCharacter.desc}`;
      char.buttonActive = newCharacter.buttonActive;
      char.buttonText = newCharacter.buttonText;
      char.moveUpHeight = newCharacter.moveUpHeight;


      if (char.attrs.possibleCharacters.length === 0) {
        characterList = ["Apollo",
          "Artemis",
          "Athena",
          "Atlas",
          "Demeter",
          "Hephaestus",
          "Hermes",
          "Minotaur",
          "Pan",
          "Prometheus"];
      }

      char.attrs = {
        numDomes: numDomes,
        possibleCharacters: characterList,
        currentCharacter: newCharacterName,
       ...newCharacter.attrs
      };
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
      const newCharacterName: string = char.attrs.possibleCharacters.shift();
      const newCharacter: Character = getCharacter(newCharacterName);
      let characterList: string[] = char.attrs.possibleCharacters;

      char.desc = Chaos.desc + `\n${newCharacter.name} - ${newCharacter.desc}`;
      char.buttonActive = newCharacter.buttonActive;
      char.buttonText = newCharacter.buttonText;
      char.moveUpHeight = newCharacter.moveUpHeight;


      if (char.attrs.possibleCharacters.length === 0) {
        characterList = ["Apollo",
          "Artemis",
          "Athena",
          "Atlas",
          "Demeter",
          "Hephaestus",
          "Hermes",
          "Minotaur",
          "Pan",
          "Prometheus"];
      }

      char.attrs = {
        numDomes: numDomes,
        possibleCharacters: characterList,
        currentCharacter: newCharacterName,
       ...newCharacter.attrs
      };
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