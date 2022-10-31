/**
 * Adding a new character:
 *  1. Create the character file in the 'characters' directory
 *  2. In this file:
 *    a. Add the character name to the characterList
 *    b. In getCharacterByName, add a switch case using the same name
 *        as step (b.)
 *    c. Add any banned matchups in the banList
 *  3. Add a character image to src/assets/png/characterImages
 *  4. In src/components/board/CharacterCard.scss, add a class linked
 *        to the image added in step (3.). Use the name of the
 *        character from (2b.) without spaces as the class name.
 */

import { Character, CharacterState } from '../../types/characterTypes';
import * as Characters from '../characters';

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
      return Characters.Apollo;
    case 'Artemis':
      return Characters.Artemis;
    case 'Athena':
      return Characters.Athena;
    case 'Atlas':
      return Characters.Atlas;
    case 'Demeter':
      return Characters.Demeter;
    case 'Hephaestus':
      return Characters.Hephaestus;
    case 'Hermes':
      return Characters.Hermes;
    case 'Minotaur':
      return Characters.Minotaur;
    case 'Pan':
      return Characters.Pan;
    case 'Prometheus':
      return Characters.Prometheus;
    case 'Bia':
      return Characters.Bia;
    case 'Triton':
      return Characters.Triton;
    case 'Zeus':
      return Characters.Zeus;
    case 'Graeae':
      return Characters.Graeae;
    case 'Heracles':
      return Characters.Heracles;
    case 'Odysseus':
      return Characters.Odysseus;
    case 'Iris':
      return Characters.Iris;
    case 'Pegasus':
      return Characters.Pegasus;
    case 'Eros':
      return Characters.Eros;
    case 'Chaos':
      return Characters.Chaos;
    case 'Chronus':
      return Characters.Chronus;
    case 'Harpies':
      return Characters.Harpies;
    case 'Urania':
      return Characters.Urania;
    case 'Charon':
      return Characters.Charon;
    case 'Ares':
      return Characters.Ares;
    case 'Asteria':
      return Characters.Asteria;
    case 'Maenads':
      return Characters.Maenads;
    case 'Hades':
      return Characters.Hades;
    case 'Clio':
      return Characters.Clio;
    case 'Tartarus':
      return Characters.Tartarus;
    case 'Hecate':
      return Characters.Hecate;
    case 'Siren':
      return Characters.Siren;
    case 'Hestia':
      return Characters.Hestia;
    case 'Poseidon':
      return Characters.Poseidon;
    case 'Lernaean Hydra':
      return Characters.LernaeanHydra;
    case 'Helios':
      return Characters.Helios;
    case 'Mortal':
    default:
      return Characters.Mortal;
  }
}

/**
 * Get a character by character state
 */
export function getCharacter(charState: CharacterState): Character {
  if (charState.powerBlocked) {
    return Characters.Mortal;
  }

  return getCharacterByName(charState.name);
}
