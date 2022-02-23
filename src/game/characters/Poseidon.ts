import { Mortal } from './Mortal';
import { Character } from '../../types/characterTypesTemp';

type PoseidonAttrs = {
  unmovedIsBuilding: boolean;
  numUnmovedBuilds: number;
};

export const Poseidon: Character<PoseidonAttrs> = {
  ...Mortal,

  data: {
    ...Mortal.data,
    desc: [
      `End of Your Turn: If your unmoved Worker is on the ground level, 
        it may build up to three times.`,
    ],
    pack: 'advanced',
    buttonText: 'Stop Building',
    attrs: {
      unmovedIsBuilding: false,
      numUnmovedBuilds: 0,
    },
  },

  buttonPressed: (context, charState) => {
    charState.buttonActive = false;
    return 'end';
  },

  validBuild: (context, charState, fromPos) => {
    if (charState.attrs.unmovedIsBuilding) {
      fromPos = charState.workers[(charState.selectedWorkerNum + 1) % 2].pos;
    }
    return Mortal.validBuild(context, charState, fromPos);
  },

  getStageAfterBuild: (context, charState) => {
    if (!charState.attrs.unmovedIsBuilding) {
      if (
        charState.workers.length === 2 &&
        charState.workers[(charState.selectedWorkerNum + 1) % 2].height === 0
      ) {
        charState.attrs.unmovedIsBuilding = true;

        if (
          Poseidon.validBuild(
            context,
            charState,
            charState.workers[charState.selectedWorkerNum].pos,
          ).size > 0
        ) {
          charState.buttonActive = true;
          return 'build';
        }
      }
    } else {
      charState.attrs.numUnmovedBuilds += 1;
      if (
        charState.attrs.numUnmovedBuilds < 3 &&
        Poseidon.validBuild(
          context,
          charState,
          charState.workers[charState.selectedWorkerNum].pos,
        ).size > 0
      ) {
        return 'build';
      }
    }

    charState.buttonActive = false;
    return 'end';
  },

  onTurnEnd: (context, charState) => {
    charState.attrs.unmovedIsBuilding = false;
    charState.attrs.numUnmovedBuilds = 0;
  },
};
