import { Mortal } from "./Mortal";
import { Apollo } from "./Apollo";
import { Artemis } from "./Artemis";
import { Athena } from "./Athena";
import { Atlas } from "./Atlas";
import { Demeter } from "./Demeter";
import { Hephaestus } from "./Hephaestus";
import { Hermes } from "./Hermes";
import { Minotaur } from "./Minotaur";
import { Pan } from "./Pan";
import { Prometheus } from "./Prometheus";
import { Bia } from "./Bia";
import { Triton } from "./Triton";
import { Zeus } from "./Zeus";
import { Graeae } from "./Graeae";
import { Heracles } from "./Heracles";
import { Odysseus } from "./Odysseus";
import { Iris } from "./Iris";
import { Pegasus } from "./Pegasus";
import { GameState, Player } from '../../types/GameTypes';
import { Ctx } from "boardgame.io";
import { Eros } from "./Eros";
import { Chaos } from "./Chaos";

export const characterList: string[] = [
  "Random",
  "Mortal",

  // Simple Gods
  "Apollo",
  "Artemis",
  "Athena",
  "Atlas",
  "Demeter",
  "Hephaestus",
  "Hermes",
  "Minotaur",
  "Pan",
  "Prometheus",

  // Advanced Gods
  // "Aphrodite",
  // "Ares",
  "Bia",
  "Chaos",
  // "Charon",
  // "Chronus",
  // "Circe",
  // "Dionysus",
  "Eros",
  // "Hera",
  // "Hestia",
  // "Hypnus",
  // "Limus",
  // "Medusa",
  // "Morpheus",
  // "Persephone",
  // "Poseidon",
  // "Selene",
  "Triton",
  "Zeus",

  // Golden Fleece Gods
  // "Aeuolus",
  // "Charybdis",
  // "Clio",
  // "Europa & Talus",
  // "Gaea",
  "Graeae",
  // "Hades",
  // "Harpies",
  // "Hecate",
  // "Moerae",
  // "Nemesis",
  // "Siren",
  // "Tartarus",
  // "Terpsichore",
  // "Urania",

  // Heroes
  // "Achilles",
  // "Adonis",
  // "Atlanta",
  // "Bellerophon",
  "Heracles",
  // "Jason",
  // "Medea",
  "Odysseus",
  // "Polyphemus",
  // "Theseus",

  // Underworld https://roxley.com/santorini-underworld-promo-cards/
  // "Tyche",
  // "Scylla",
  // "Proteus",
  // "Castor & Pollox",
  // "Eris",
  // "Maenads",
  // "Asteria",
  // "Hippolyta",
  // "Hydra",
  "Iris",
  // "Nyx",
  "Pegasus",
];

export interface Worker {
  pos: number;
  height: number;
}

export interface CharacterState {
  name: string;
  desc: string;
  workers: Worker[];
  numWorkers: number;
  numWorkersToPlace: number;
  selectedWorker: number;
  moveUpHeight: number;
  buttonText: string;
  buttonActive: boolean;
  attrs: any;
}

export interface Character extends CharacterState {
  initialize: (G: GameState, ctx: Ctx, player: Player, char: CharacterState) => void,
  onTurnBegin: (G: GameState, ctx: Ctx, player: Player, char: CharacterState) => void,
  onTurnEnd: (G: GameState, ctx: Ctx, player: Player, char: CharacterState) => void,
  validPlace: (G: GameState, ctx: Ctx, player: Player, char: CharacterState) => number[],
  validSelect: (G: GameState, ctx: Ctx, player: Player, char: CharacterState) => number[],
  select: (G: GameState, ctx: Ctx, player: Player, char: CharacterState, pos: number) => string,
  validMove: (G: GameState, ctx: Ctx, player: Player, char: CharacterState, originalPos: number) => number[],
  hasValidMoves: (G: GameState, ctx: Ctx, player: Player, char: CharacterState) => boolean,
  move: (G: GameState, ctx: Ctx, player: Player, char: CharacterState, pos: number) => string,
  validBuild: (G: GameState, ctx: Ctx, player: Player, char: CharacterState, originalPos: number) => number[],
  hasValidBuild: (G: GameState, ctx: Ctx, player: Player, char: CharacterState) => boolean,
  build: (G: GameState, ctx: Ctx, player: Player, char: CharacterState, pos: number) => string,
  buttonPressed: (G: GameState, ctx: Ctx, player: Player, char: CharacterState) => string,
  checkWinByMove: (G: GameState, char: CharacterState, heightBefore: number, heightAfter: number) => boolean,
};

export function getCharacter(name: string): Character {
  let char: any;

  switch (name) {
    case "Mortal": char = Mortal; break;
    case "Apollo": char = Apollo; break;
    case "Artemis": char = Artemis; break;
    case "Athena": char = Athena; break;
    case "Atlas": char = Atlas; break;
    case "Demeter": char = Demeter; break;
    case "Hephaestus": char = Hephaestus; break;
    case "Hermes": char = Hermes; break;
    case "Minotaur": char = Minotaur; break;
    case "Pan": char = Pan; break;
    case "Prometheus": char = Prometheus; break;
    case "Bia": char = Bia; break;
    case "Triton": char = Triton; break;
    case "Zeus": char = Zeus; break;
    case "Graeae": char = Graeae; break;
    case "Heracles": char = Heracles; break;
    case "Odysseus": char = Odysseus; break;
    case "Iris": char = Iris; break;
    case "Pegasus": char = Pegasus; break;
    case "Eros": char = Eros; break;
    case "Chaos": char = Chaos; break;
    default: char = Mortal; break;
  }

  return char;
}
