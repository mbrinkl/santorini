import { Character } from '../../types/CharacterTypes';
import { Mortal } from './Mortal';

export const Zeus: Character = {
  ...Mortal,

  data: {
    ...Mortal.data,
    desc: ['Your Build: Your Worker may build a block under itself.'],
    pack: 'advanced',
  },

  validBuild: (context, charState, originalPos) => {
    const valids = Mortal.validBuild(context, charState, originalPos);

    if (charState.workers[charState.selectedWorkerNum].height < 3) {
      valids.add(charState.workers[charState.selectedWorkerNum].pos);
    }

    return valids;
  },

  build: (context, charState, pos) => {
    if (pos === charState.workers[charState.selectedWorkerNum].pos) {
      charState.workers[charState.selectedWorkerNum].height += 1;
    }
    Mortal.build(context, charState, pos);
  },
};
