import { Mortal } from './Mortal';
import { Character, CharacterState } from '../../types/CharacterTypes';

interface AsteriaAttrs {
  movedDown: boolean
}

export const Asteria: Character<AsteriaAttrs> = {
  ...Mortal,
  desc: `End of Your Turn: If one of your Workers moved down this turn, 
    you may build a dome on any unoccupied space.`,
  attrs: {
    movedDown: false,
  },
  buttonText: 'Skip Dome',

  onTurnBegin: (context, charState: CharacterState<AsteriaAttrs>) => {
    charState.attrs.movedDown = false;
  },

  buttonPressed: (context, charState: CharacterState<AsteriaAttrs>) => {
    charState.buttonActive = false;
    return 'end';
  },

  move: (context, charState: CharacterState<AsteriaAttrs>, pos) => {
    const { G } = context;
    const movedFromPos = charState.workers[charState.selectedWorkerNum].pos;
    Mortal.move(context, charState, pos);
    if (G.spaces[movedFromPos].height > G.spaces[pos].height) {
      charState.attrs.movedDown = true;
    }
  },

  getStageAfterBuild: (context, charState: CharacterState<AsteriaAttrs>) => {
    if (charState.attrs.movedDown) {
      charState.buttonActive = true;
      return 'special';
    }

    return 'end';
  },

  validSpecial: ({ G }, charState: CharacterState<AsteriaAttrs>, fromPos) => {
    const valids = new Set<number>();
    G.spaces.forEach((space) => {
      if (!space.inhabitant && !space.isDomed) {
        valids.add(space.pos);
      }
    });
    return valids;
  },

  special: ({ G }, charState, pos) => {
    G.spaces[pos].isDomed = true;
    charState.buttonActive = false;
  },
};
