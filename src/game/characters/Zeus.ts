import { Character } from '../../types/CharacterTypes';
import { Mortal } from './Mortal';

export const Zeus: Character = {
  ...Mortal,
  desc: 'Your Build: Your Worker may build a block under itself.',

  validBuild: (context, charState, originalPos) => {
    const valids: number[] = Mortal.validBuild(context, charState, originalPos);

    if (charState.workers[charState.selectedWorkerNum].height < 3) {
      valids.push(charState.workers[charState.selectedWorkerNum].pos);
    }

    return valids;
  },

  build: (context, charState, pos) => {
    if (pos === charState.workers[charState.selectedWorkerNum].pos) {
      charState.workers[charState.selectedWorkerNum].height += 1;
    }
    return Mortal.build(context, charState, pos);
  },

};
