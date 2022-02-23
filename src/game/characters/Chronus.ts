import { tryEndGame } from '../gameUtil';
import { GameContext } from '../../types/gameTypesTemp';
import { Character } from '../../types/characterTypesTemp';
import { Mortal } from './Mortal';

function checkWinCondition(context: GameContext, chronusPlayerID: string) {
  const numCompleteTowers = context.G.spaces.filter(
    (space) => space.isDomed === true && space.height >= 3,
  ).length;

  if (numCompleteTowers >= 5) {
    tryEndGame(context, chronusPlayerID);
  }
}

export const Chronus: Character = {
  ...Mortal,

  data: {
    ...Mortal.data,
    desc: [
      `Win Condition: You also win when there are at least five Complete 
      Towers on the board.`,
    ],
    pack: 'advanced',
  },

  onTurnBegin: (context, charState) => {
    checkWinCondition(context, context.playerID);
  },

  onTurnEnd: (context, charState) => {
    checkWinCondition(context, context.playerID);
  },

  build: (context, charState, pos) => {
    Mortal.build(context, charState, pos);
    checkWinCondition(context, context.playerID);
  },

  afterOpponentBuild: (context, charState, opponentCharacter, builtPos) => {
    const { G, playerID } = context;
    const chronusPlayerID = G.players[playerID].opponentID;
    checkWinCondition(context, chronusPlayerID);
  },

  afterOpponentSpecial: (context, charState, opponentCharacter) => {
    const { G, playerID } = context;
    const chronusPlayerID = G.players[playerID].opponentID;
    checkWinCondition(context, chronusPlayerID);
  },
};
