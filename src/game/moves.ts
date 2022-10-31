import { Move } from 'boardgame.io';
import { initCharState } from '.';
import { GameState } from '../types/gameTypes';
import { getCharacter } from './util/characterUtil';
import { checkWinByMove } from './util/gameUtil';
import { updateValids } from './validity';

export const setChar: Move<GameState> = ({ G, playerID }, name: string) => {
  G.players[playerID].ready = false;
  G.players[playerID].charState = initCharState(name);
};

export const ready: Move<GameState> = ({ G, playerID }, status: boolean) => {
  G.players[playerID].ready = status;
};

export const onButtonPressed: Move<GameState> = (context) => {
  const { G, playerID, events } = context;

  const { charState } = G.players[playerID];

  const character = getCharacter(charState);

  const stage = character.buttonPressed(context, charState);
  events.setStage(stage);

  updateValids(context, stage);
};

export const setup: Move<GameState> = (context, pos: number) => {
  const { G, playerID, events } = context;
  const { charState } = G.players[playerID];
  const character = getCharacter(charState);

  const stage = character.setup(context, charState, pos);
  events.setStage(stage);

  updateValids(context, stage);
};

export const place: Move<GameState> = (context, pos: number) => {
  const { G, playerID, events } = context;
  const { charState } = G.players[playerID];
  const character = getCharacter(charState);

  const stage = character.place(context, charState, pos);
  events.setStage(stage);

  updateValids(context, stage);
};

export const select: Move<GameState> = (context, pos: number) => {
  const { G, playerID, events } = context;
  const { charState } = G.players[playerID];

  const character = getCharacter(charState);

  character.select(context, charState, pos);
  const stage = character.getStageAfterSelect(context, charState);
  events.setStage(stage);

  updateValids(context, stage);
};

export const move: Move<GameState> = (context, pos: number) => {
  const { G, events, playerID } = context;

  const { charState, opponentID } = G.players[playerID];
  const opponentCharState = G.players[opponentID].charState;
  const character = getCharacter(charState);
  const opponentCharacter = getCharacter(opponentCharState);

  const movedFromPos = charState.workers[charState.selectedWorkerNum].pos;

  character.move(context, charState, pos);
  opponentCharacter.afterOpponentMove(
    context,
    opponentCharState,
    charState,
    movedFromPos,
  );

  // Check to see if the player was forced off of the intended pos
  if (charState.workers[charState.selectedWorkerNum].pos === pos) {
    checkWinByMove(context, movedFromPos, pos);
  }

  const stage = character.getStageAfterMove(context, charState);
  events.setStage(stage);

  updateValids(context, stage);
};

export const build: Move<GameState> = (context, pos: number) => {
  const { G, playerID, events } = context;

  const { charState, opponentID } = G.players[playerID];
  const opponentCharState = G.players[opponentID].charState;
  const character = getCharacter(charState);
  const opponentCharacter = getCharacter(opponentCharState);

  character.build(context, charState, pos);
  opponentCharacter.afterOpponentBuild(
    context,
    opponentCharState,
    charState,
    pos,
  );
  const stage = character.getStageAfterBuild(context, charState);
  events.setStage(stage);

  updateValids(context, stage);
};

export const special: Move<GameState> = (context, pos: number) => {
  const { G, playerID, events } = context;

  const { charState, opponentID } = G.players[playerID];
  const opponentCharState = G.players[opponentID].charState;
  const character = getCharacter(charState);
  const opponentCharacter = getCharacter(opponentCharState);

  character.special(context, charState, pos);
  opponentCharacter.afterOpponentSpecial(context, opponentCharState, charState);
  const stage = character.getStageAfterSpecial(context, charState);
  events.setStage(stage);

  updateValids(context, stage);
};

export const endTurn: Move<GameState> = ({ events }) => {
  events.endTurn();
};
