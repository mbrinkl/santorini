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
import { Character, CharacterState } from '../../types/characterTypes';
import { Chronus } from './Chronus';
import { Harpies } from './Harpies';
import { Urania } from './Urania';
import { Charon } from './Charon';
import { Ares } from './Ares';
import { Hades } from './Hades';
import { Maenads } from './Maenads';
import { Asteria } from './Asteria';
import { Tartarus } from './Tartarus';
import { Clio } from './Clio';
import { Hecate } from './Hecate';
import { Siren } from './Siren';
import { Hestia } from './Hestia';
import { Poseidon } from './Poseidon';
import { LernaeanHydra } from './LernaeanHydra';
import { Helios } from './Helios';

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
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getCharacterByName(name: string): Character<any> {
  switch (name) {
    case 'Apollo':
      return Apollo;
    case 'Artemis':
      return Artemis;
    case 'Athena':
      return Athena;
    case 'Atlas':
      return Atlas;
    case 'Demeter':
      return Demeter;
    case 'Hephaestus':
      return Hephaestus;
    case 'Hermes':
      return Hermes;
    case 'Minotaur':
      return Minotaur;
    case 'Pan':
      return Pan;
    case 'Prometheus':
      return Prometheus;
    case 'Bia':
      return Bia;
    case 'Triton':
      return Triton;
    case 'Zeus':
      return Zeus;
    case 'Graeae':
      return Graeae;
    case 'Heracles':
      return Heracles;
    case 'Odysseus':
      return Odysseus;
    case 'Iris':
      return Iris;
    case 'Pegasus':
      return Pegasus;
    case 'Eros':
      return Eros;
    case 'Chaos':
      return Chaos;
    case 'Chronus':
      return Chronus;
    case 'Harpies':
      return Harpies;
    case 'Urania':
      return Urania;
    case 'Charon':
      return Charon;
    case 'Ares':
      return Ares;
    case 'Asteria':
      return Asteria;
    case 'Maenads':
      return Maenads;
    case 'Hades':
      return Hades;
    case 'Clio':
      return Clio;
    case 'Tartarus':
      return Tartarus;
    case 'Hecate':
      return Hecate;
    case 'Siren':
      return Siren;
    case 'Hestia':
      return Hestia;
    case 'Poseidon':
      return Poseidon;
    case 'Lernaean Hydra':
      return LernaeanHydra;
    case 'Helios':
      return Helios;
    case 'Mortal':
    default:
      return Mortal;
  }
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
