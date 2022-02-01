import { Mortal } from './Mortal';
import { Apollo } from './Apollo';
import { Artemis } from './Artemis';
import { Athena } from './Athena';
import { Atlas } from './Atlas';
import { Demeter } from './Demeter';
import { Hephaestus } from './Hephaestus';
import { Hermes } from './Hermes';
import { Minotaur } from './Minotaur';
import { Pan } from './Pan';
import { Prometheus } from './Prometheus';
import { Bia } from './Bia';
import { Triton } from './Triton';
import { Zeus } from './Zeus';
import { Graeae } from './Graeae';
import { Heracles } from './Heracles';
import { Odysseus } from './Odysseus';
import { Iris } from './Iris';
import { Pegasus } from './Pegasus';
import { Eros } from './Eros';
import { Chaos } from './Chaos';
import { Character, CharacterState } from '../../types/CharacterTypes';
import { Chronus } from './Chronus';
import { Harpies } from './Harpies';
import { Urania } from './Urania';

export const characterList: string[] = [
  'Random',
  'Mortal',

  // Simple Gods
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

  // Advanced Gods
  // "Aphrodite",
  // "Ares",
  'Bia',
  'Chaos',
  // "Charon",
  'Chronus',
  // "Circe",
  // "Dionysus",
  'Eros',
  // "Hera",
  // "Hestia",
  // "Hypnus",
  // "Limus",
  // "Medusa",
  // "Morpheus",
  // "Persephone",
  // "Poseidon",
  // "Selene",
  'Triton',
  'Zeus',

  // Golden Fleece Gods
  // "Aeuolus",
  // "Charybdis",
  // "Clio",
  // "Europa & Talus",
  // "Gaea",
  'Graeae',
  // "Hades",
  'Harpies',
  // "Hecate",
  // "Moerae",
  // "Nemesis",
  // "Siren",
  // "Tartarus",
  // "Terpsichore",
  'Urania',

  // Heroes
  // "Achilles",
  // "Adonis",
  // "Atlanta",
  // "Bellerophon",
  'Heracles',
  // "Jason",
  // "Medea",
  'Odysseus',
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
  'Iris',
  // "Nyx",
  'Pegasus',
];

export const banList: [string, string][] = [
  ['Graeae', 'Nemesis'],
  ['Harpies', 'Hermes'],
  ['Harpies', 'Triton'],
  ['Urania', 'Aphrodite'],
];

// Returns the character list sorted alphabetically, with 'random'
// and 'mortal' at the start
export function getSortedCharacters(): string[] {
  return ['Random', 'Mortal'].concat(characterList.slice(2).sort());
}

export function getCharacter(charState: CharacterState): Character {
  if (charState.powerBlocked) {
    return Mortal;
  }

  return getCharacterByName(charState.name);
}

export function getCharacterByName(name: string): Character {
  let character: Character;

  switch (name) {
    case 'Mortal': character = Mortal; break;
    case 'Apollo': character = Apollo; break;
    case 'Artemis': character = Artemis; break;
    case 'Athena': character = Athena; break;
    case 'Atlas': character = Atlas; break;
    case 'Demeter': character = Demeter; break;
    case 'Hephaestus': character = Hephaestus; break;
    case 'Hermes': character = Hermes; break;
    case 'Minotaur': character = Minotaur; break;
    case 'Pan': character = Pan; break;
    case 'Prometheus': character = Prometheus; break;
    case 'Bia': character = Bia; break;
    case 'Triton': character = Triton; break;
    case 'Zeus': character = Zeus; break;
    case 'Graeae': character = Graeae; break;
    case 'Heracles': character = Heracles; break;
    case 'Odysseus': character = Odysseus; break;
    case 'Iris': character = Iris; break;
    case 'Pegasus': character = Pegasus; break;
    case 'Eros': character = Eros; break;
    case 'Chaos': character = Chaos; break;
    case 'Chronus': character = Chronus; break;
    case 'Harpies': character = Harpies; break;
    case 'Urania': character = Urania; break;
    default: character = Mortal; break;
  }

  return character;
}
