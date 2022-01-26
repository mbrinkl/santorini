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
import { Character } from '../../types/CharacterTypes';
import { Chronus } from './Chronus';
import { Harpies } from './Harpies';

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
  // "Urania",

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

// Returns the character list sorted alphabetically, with 'random'
// and 'mortal' at the start
export function getSortedCharacters(): string[] {
  return ['Random', 'Mortal'].concat(characterList.slice(2).sort());
}

export function getCharacter(name: string): Character {
  let char: any;

  switch (name) {
    case 'Mortal': char = Mortal; break;
    case 'Apollo': char = Apollo; break;
    case 'Artemis': char = Artemis; break;
    case 'Athena': char = Athena; break;
    case 'Atlas': char = Atlas; break;
    case 'Demeter': char = Demeter; break;
    case 'Hephaestus': char = Hephaestus; break;
    case 'Hermes': char = Hermes; break;
    case 'Minotaur': char = Minotaur; break;
    case 'Pan': char = Pan; break;
    case 'Prometheus': char = Prometheus; break;
    case 'Bia': char = Bia; break;
    case 'Triton': char = Triton; break;
    case 'Zeus': char = Zeus; break;
    case 'Graeae': char = Graeae; break;
    case 'Heracles': char = Heracles; break;
    case 'Odysseus': char = Odysseus; break;
    case 'Iris': char = Iris; break;
    case 'Pegasus': char = Pegasus; break;
    case 'Eros': char = Eros; break;
    case 'Chaos': char = Chaos; break;
    case 'Chronus': char = Chronus; break;
    case 'Harpies': char = Harpies; break;
    default: char = Mortal; break;
  }

  return char;
}
