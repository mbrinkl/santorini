/**
 * Adding a new character:
 *  1. Create the character file in this directory
 *  2. In this file:
 *    a. Import the character
 *    b. Add the character name to the characterList
 *    c. In getCharacterByName, add a switch case using the same name
 *        as step (b.)
 *    d. Add any banned matchups in the banList
 *  3. Add a character image to src/assets/png/characterImages
 *  4. In src/components/board/CharacterCard.scss, add a class linked
 *        to the image added in step (3.). Use the name of the
 *        character from (2b.) without spaces as the class name.
 */

import { Character, CharacterState } from '../../types/characterTypes';
import Mortal from './Mortal';
import Apollo from './Apollo';
import Artemis from './Artemis';
import Athena from './Athena';
import Atlas from './Atlas';
import Demeter from './Demeter';
import Hephaestus from './Hephaestus';
import Hermes from './Hermes';
import Minotaur from './Minotaur';
import Pan from './Pan';
import Prometheus from './Prometheus';
import Bia from './Bia';
import Triton from './Triton';
import Zeus from './Zeus';
import Graeae from './Graeae';
import Heracles from './Heracles';
import Odysseus from './Odysseus';
import Iris from './Iris';
import Pegasus from './Pegasus';
import Eros from './Eros';
import Chaos from './Chaos';
import Chronus from './Chronus';
import Harpies from './Harpies';
import Urania from './Urania';
import Charon from './Charon';
import Ares from './Ares';
import Hades from './Hades';
import Maenads from './Maenads';
import Asteria from './Asteria';
import Tartarus from './Tartarus';
import Clio from './Clio';
import Hecate from './Hecate';
import Siren from './Siren';
import Hestia from './Hestia';
import Poseidon from './Poseidon';
import LernaeanHydra from './LernaeanHydra';
import Helios from './Helios';

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
  'Ares',
  'Bia',
  'Chaos',
  'Charon',
  'Chronus',
  // "Circe",
  // "Dionysus",
  'Eros',
  // "Hera",
  'Hestia',
  // "Hypnus",
  // "Limus",
  // "Medusa",
  // "Morpheus",
  // "Persephone",
  'Poseidon',
  // "Selene",
  'Triton',
  'Zeus',

  // Golden Fleece Gods
  // 'Aeolus',
  // "Charybdis",
  'Clio',
  // "Europa & Talus",
  // "Gaea",
  'Graeae',
  'Hades',
  'Harpies',
  // 'Hecate',
  // "Moerae",
  // "Nemesis",
  'Siren',
  // 'Tartarus',
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

  // Underworld
  // "Tyche",
  // "Scylla",
  // "Proteus",
  // "Castor & Pollox",
  // "Eris",
  'Maenads',
  'Asteria',
  // "Hippolyta",
  // "Hydra",
  'Iris',
  // "Nyx",
  'Pegasus',

  // Custom
  'Lernaean Hydra',
  'Helios',
];

/**
 * Banned matchups
 */
export const banList: [string, string][] = [
  ['Graeae', 'Nemesis'],
  ['Harpies', 'Hermes'],
  ['Harpies', 'Triton'],
  ['Urania', 'Aphrodite'],
  ['Hades', 'Pan'],
  ['Asteria', 'Hades'],
  ['Clio', 'Circe'],
  ['Clio', 'Nemesis'],
  ['Tartarus', 'Bia'],
  ['Tartarus', 'Hecate'],
  ['Tartarus', 'Moerae'],
  ['Hecate', 'Charon'],
  ['Hecate', 'Circe'],
];

/**
 * Returns the character list sorted alphabetically, with 'random'
 * and 'mortal' at the start
 */
export function getSortedCharacters(): string[] {
  return ['Random', 'Mortal'].concat(characterList.slice(2).sort());
}

/**
 * Get a character by character name
 */
export function getCharacterByName(name: string): Character {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let character: Character<any>;

  switch (name) {
    case 'Mortal':
      character = Mortal;
      break;
    case 'Apollo':
      character = Apollo;
      break;
    case 'Artemis':
      character = Artemis;
      break;
    case 'Athena':
      character = Athena;
      break;
    case 'Atlas':
      character = Atlas;
      break;
    case 'Demeter':
      character = Demeter;
      break;
    case 'Hephaestus':
      character = Hephaestus;
      break;
    case 'Hermes':
      character = Hermes;
      break;
    case 'Minotaur':
      character = Minotaur;
      break;
    case 'Pan':
      character = Pan;
      break;
    case 'Prometheus':
      character = Prometheus;
      break;
    case 'Bia':
      character = Bia;
      break;
    case 'Triton':
      character = Triton;
      break;
    case 'Zeus':
      character = Zeus;
      break;
    case 'Graeae':
      character = Graeae;
      break;
    case 'Heracles':
      character = Heracles;
      break;
    case 'Odysseus':
      character = Odysseus;
      break;
    case 'Iris':
      character = Iris;
      break;
    case 'Pegasus':
      character = Pegasus;
      break;
    case 'Eros':
      character = Eros;
      break;
    case 'Chaos':
      character = Chaos;
      break;
    case 'Chronus':
      character = Chronus;
      break;
    case 'Harpies':
      character = Harpies;
      break;
    case 'Urania':
      character = Urania;
      break;
    case 'Charon':
      character = Charon;
      break;
    case 'Ares':
      character = Ares;
      break;
    case 'Asteria':
      character = Asteria;
      break;
    case 'Maenads':
      character = Maenads;
      break;
    case 'Hades':
      character = Hades;
      break;
    case 'Clio':
      character = Clio;
      break;
    case 'Tartarus':
      character = Tartarus;
      break;
    case 'Hecate':
      character = Hecate;
      break;
    case 'Siren':
      character = Siren;
      break;
    case 'Hestia':
      character = Hestia;
      break;
    case 'Poseidon':
      character = Poseidon;
      break;
    case 'Lernaean Hydra':
      character = LernaeanHydra;
      break;
    case 'Helios':
      character = Helios;
      break;
    default:
      character = Mortal;
      break;
  }

  return character;
}

/**
 * Get a character by character state
 */
export function getCharacter(charState: CharacterState): Character {
  if (charState.powerBlocked) {
    return Mortal;
  }

  return getCharacterByName(charState.name);
}
