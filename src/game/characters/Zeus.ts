import { Character } from '../../types/CharacterTypes';
import { Mortal } from './Mortal';

export const Zeus: Character = {
  ...Mortal,
  desc: 'Your Build: Your Worker may build a block under itself.',

  validBuild: (context, char, originalPos) => {
    const valids: number[] = Mortal.validBuild(context, char, originalPos);

    if (char.workers[char.selectedWorkerNum].height < 3) {
      valids.push(char.workers[char.selectedWorkerNum].pos);
    }

    return valids;
  },

  build: (context, char, pos) => {
    if (pos === char.workers[char.selectedWorkerNum].pos) {
      char.workers[char.selectedWorkerNum].height += 1;
    }
    return Mortal.build(context, char, pos);
  },

};
