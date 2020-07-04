import { Ctx } from 'boardgame.io';
import { GameState, Player } from '../index'
import { Board } from '../space'
import { getAdjacentPositions } from '../utility'

export const characterList : string[] = [
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
  // "Chaos",
  // "Charon",
  // "Chronus",
  // "Circe",
  // "Dionysus",
  // "Eros",
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

  // Keeping this last for now to avoid changing commas when commenting out characters
  "Random"
]

export interface Worker {
    pos: number;
    height: number;
}

export interface Character {
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

export class Mortal {

  public static desc = 'No ability';
  public static buttonText = 'No ability';
  public static buttonActive = false;
  public static numWorkers = 2;
  public static moveUpHeight = 1;
  public static attrs: any = undefined;

  public static onTurnBegin(
    G: GameState, 
    ctx: Ctx,
    player: Player, 
    char: Character
  ) : void {}

  public static onTurnEnd(
    G: GameState, 
    ctx: Ctx,
    player: Player, 
    char: Character
  ) : void {}

  public static validSelect(
    G: GameState, 
    ctx: Ctx,
    player: Player, 
    char: Character
  ) : number[] {
    let valids: number[] = [];

    char.workers.forEach(worker => {
      if (this.validMove(G, ctx, player, char, worker.pos).length > 0) {
        valids.push(worker.pos);
      }
    })

    return valids;
  }

  public static select(
    G: GameState, 
    ctx: Ctx,
    player: Player, 
    char: Character,
    pos: number
  ) : string {
    char.selectedWorker = G.spaces[pos].inhabitant.workerNum;
    return 'move';
  }
  
  public static validMove(
    G: GameState, 
    ctx: Ctx,
    player: Player, 
    char: Character,
    originalPos: number
  ) : number[] {
    let adjacents : number[] = getAdjacentPositions(originalPos);
    let valids : number[] = []
        
    adjacents.forEach( pos => {
      if (!G.spaces[pos].inhabited &&
        !G.spaces[pos].is_domed &&
        G.spaces[pos].height - G.spaces[originalPos].height <= char.moveUpHeight
        )
      {
        valids.push(pos);
      }
    })
  
    return valids;
  }

  public static hasValidMoves(
    G: GameState, 
    ctx: Ctx,
    player: Player, 
    char: Character,
  ) : boolean {
    let hasMove: boolean = false;
    char.workers.forEach(worker => {
      if (this.validMove(G, ctx, player, char, worker.pos).length > 0) {
        hasMove = true;
      }
    })

    return hasMove;
  }

  public static move (
    G: GameState, 
    ctx: Ctx,
    player: Player, 
    char: Character, 
    pos: number
  ) : string {
      // free the space that is being moved from
      Board.free(G, char.workers[char.selectedWorker].pos);

      // place the worker on the selected space
      Board.place(G, pos, player.id, char.selectedWorker);

      return "build"
  }

  public static validBuild(
    G: GameState, 
    ctx: Ctx,
    player: Player, 
    char: Character,
    originalPos: number
  ) : number[] {
    let adjacents : number[] = getAdjacentPositions(originalPos);
    let valids : number[] = []
  
    adjacents.forEach( pos => {
      if (!G.spaces[pos].inhabited &&
        !G.spaces[pos].is_domed
        )
      {
        valids.push(pos);
      }
    })
  
    return valids;
  }

  public static hasValidBuild(
    G: GameState,
    ctx: Ctx,
    player: Player, 
    char: Character,
  ) : boolean {
    let hasBuild = false;

    char.workers.forEach(worker => {
      if (this.validBuild(G, ctx, player, char, worker.pos).length > 0) {
        hasBuild = true;
      }
    })

    return hasBuild
  }

  public static build (
    G: GameState,
    ctx: Ctx,
    player: Player, 
    char: Character,
    pos: number
  ) : string {
    Board.build(G, pos);
    return 'end'
  }

  public static buttonPressed(
    G: GameState, 
    ctx: Ctx,
    player: Player,
    char: Character
  ) : void {}

  public static checkWinByMove(
    G: GameState, 
    heightBefore: number, 
    heightAfter: number
  ) : boolean {
    return heightBefore < 3 && heightAfter === 3;
  }
}
