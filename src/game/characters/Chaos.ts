import { Mortal } from './Mortal';
import { GameState, Player } from '../../types/GameTypes';
import { Character, CharacterState, getCharacter } from '.';
import { Ctx } from 'boardgame.io';
import { AthenaAttrs } from './Athena';

type PossibleCharacters = "Apollo" | "Artemis" | "Athena" | "Atlas" | "Demeter" |"Hephaestus" |
"Hermes" | "Minotaur" | "Pan" | "Prometheus";

interface ChaosAttrs {
  numDomes: number,
  nextCharacterList: PossibleCharacters[],
  currentCharacter: PossibleCharacters
}

const initialAttrs: ChaosAttrs = {
  numDomes: 0,
  nextCharacterList: [],
  currentCharacter: "Apollo"
}

function changeEmulatingCharacter(G: GameState, ctx: Ctx, player: Player, char: CharacterState, numDomes: number): void {

  const attrs: ChaosAttrs = char.attrs as ChaosAttrs;

  if (attrs.currentCharacter === 'Athena') {
    const athenaAttrs: AthenaAttrs = char.attrs as AthenaAttrs;
    G.players[player.opponentId].char.moveUpHeight = athenaAttrs.opponentMoveUpHeight;
  }

  if (attrs.nextCharacterList.length === 0) {
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
  
  const newCharacterName: PossibleCharacters = attrs.nextCharacterList.shift() || 'Apollo' //fallback;
  const newCharacter: Character = getCharacter(newCharacterName);

  char.desc = `${newCharacterName} - ${newCharacter.desc} ${Chaos.desc}`;
  char.buttonActive = newCharacter.buttonActive;
  char.buttonText = newCharacter.buttonText;
  char.moveUpHeight = newCharacter.moveUpHeight;

  const updatedAttrs: ChaosAttrs = {
    numDomes: numDomes,
    nextCharacterList: attrs.nextCharacterList,
    currentCharacter: newCharacterName
  }

  char.attrs = {
    ...updatedAttrs,
    ...newCharacter.attrs
  };
}

export const Chaos: Character = {
  ...Mortal,

  name: 'Chaos',
  desc: `(Changes between Simple God Powers after any turn in which at least one dome is built)`,
  attrs: initialAttrs,

  initialize : (
    G: GameState,
    ctx: Ctx,
    player: Player,
    char: CharacterState
  ) => {
    changeEmulatingCharacter(G, ctx, player, char, 0);
  },

  onTurnBegin : (
    G: GameState,
    ctx: Ctx,
    player: Player,
    char: CharacterState
  ) => {
    const attrs: ChaosAttrs = char.attrs as ChaosAttrs;

    const numDomes: number = G.spaces.filter((space) => space.is_domed === true).length;

    if (attrs.numDomes < numDomes) {
      changeEmulatingCharacter(G, ctx, player, char, numDomes);
    }

    const character = getCharacter(attrs.currentCharacter);
    character.onTurnBegin(G, ctx, player, char);
  },

  onTurnEnd : (
    G: GameState,
    ctx: Ctx,
    player: Player,
    char: CharacterState
  ) => {
    const attrs: ChaosAttrs = char.attrs as ChaosAttrs;

    const character = getCharacter(attrs.currentCharacter);
    character.onTurnBegin(G, ctx, player, char);

    const numDomes = G.spaces.filter((space) => space.is_domed === true).length;

    if (attrs.numDomes < numDomes) {
      changeEmulatingCharacter(G, ctx, player, char, numDomes);
    }
  },

  validSelect: (G: GameState, ctx: Ctx, player: Player, char: CharacterState) => {
    return getCharacter((char.attrs as ChaosAttrs).currentCharacter).validSelect(G, ctx, player, char);
  },
  select: (G: GameState, ctx: Ctx, player: Player, char: CharacterState, pos: number) => {
    return getCharacter((char.attrs as ChaosAttrs).currentCharacter).select(G, ctx, player, char, pos);
  },
  validMove: (G: GameState, ctx: Ctx, player: Player, char: CharacterState, originalPos: number) => {
    return getCharacter((char.attrs as ChaosAttrs).currentCharacter).validMove(G, ctx, player, char, originalPos);
  },
  hasValidMoves: (G: GameState, ctx: Ctx, player: Player, char: CharacterState) => {
    return getCharacter((char.attrs as ChaosAttrs).currentCharacter).hasValidMoves(G, ctx, player, char);
  },
  move: (G: GameState, ctx: Ctx, player: Player, char: CharacterState, pos: number) => {
    return getCharacter((char.attrs as ChaosAttrs).currentCharacter).move(G, ctx, player, char, pos);
  },
  validBuild: (G: GameState, ctx: Ctx, player: Player, char: CharacterState, originalPos: number) => {
    return getCharacter((char.attrs as ChaosAttrs).currentCharacter).validBuild(G, ctx, player, char, originalPos);
  },
  hasValidBuild: (G: GameState, ctx: Ctx, player: Player, char: CharacterState) => {
    return getCharacter((char.attrs as ChaosAttrs).currentCharacter).hasValidBuild(G, ctx, player, char);
  },
  build: (G: GameState, ctx: Ctx, player: Player, char: CharacterState, pos: number) => {
    return getCharacter((char.attrs as ChaosAttrs).currentCharacter).build(G, ctx, player, char, pos);
  },
  buttonPressed: (G: GameState, ctx: Ctx, player: Player, char: CharacterState) => {
    return getCharacter((char.attrs as ChaosAttrs).currentCharacter).buttonPressed(G, ctx, player, char);
  },
  checkWinByMove: (G: GameState, char: CharacterState, heightBefore: number, heightAfter: number) => {
    return getCharacter((char.attrs as ChaosAttrs).currentCharacter).checkWinByMove(G, char, heightBefore, heightAfter);
  },
}