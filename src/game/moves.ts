import { Move } from 'boardgame.io';
import { initCharacter, updateValids } from '.';
import { GameState } from '../types/GameTypes';
import { getCharacter } from './characters';
import { Worker } from '../types/CharacterTypes';
import { Board } from './space';
import { checkWinByMove } from './winConditions';

export const setChar: Move<GameState> = ({ G }, id: string, name: string) => {
  G.players[id].ready = false;
  G.players[id].char = initCharacter(name);
};

export const ready: Move<GameState> = ({ G }, id: string) => {
  G.players[id].ready = true;
};

export const cancelReady: Move<GameState> = ({ G }, id: string) => {
  G.players[id].ready = false;
};

export const characterAbility: Move<GameState> = (context) => {
  const { G, playerID, events } = context;

  const charState = G.players[playerID].char;

  const char = getCharacter(charState.name);

  const stage = char.buttonPressed(context, charState);
  events.setStage(stage);

  updateValids(context, charState, stage);
};

export const place: Move<GameState> = (context, pos: number) => {
  const { G, playerID, events } = context;
  const charState = G.players[playerID].char;

  const worker: Worker = {
    pos,
    height: G.spaces[pos].height,
  };

  charState.workers.push(worker);
  Board.place(G, pos, playerID, charState.workers.length - 1);

  charState.numWorkersToPlace -= 1;

  if (charState.numWorkersToPlace === 0) {
    events.setStage('end');
  }

  updateValids(context, charState, 'place');
};

export const select: Move<GameState> = (context, pos: number) => {
  const { G, playerID, events } = context;
  const charState = G.players[playerID].char;

  const char = getCharacter(charState.name);

  const stage = char.select(context, charState, pos);
  events.setStage(stage);

  updateValids(context, charState, stage);
};

export const move: Move<GameState> = (context, pos: number) => {
  const {
    G, events, playerID, ctx,
  } = context;

  const charState = G.players[playerID].char;
  const { opponentId } = G.players[playerID];

  const beforeHeight = charState.workers[charState.selectedWorkerNum].height;

  const char = getCharacter(charState.name);

  const ogPos = charState.workers[charState.selectedWorkerNum].pos;
  const stage = char.move(context, charState, pos);
  events.setStage(stage);

  // opp move effect
  const opponentCharState = G.players[opponentId].char;
  getCharacter(opponentCharState.name).opponentPostMove(context, charState, ogPos);

  updateValids(context, charState, stage);

  const afterHeight = charState.workers[charState.selectedWorkerNum].height;
  checkWinByMove(G, ctx, events, beforeHeight, afterHeight);

  // ctx.events?.setStage(char.stageAfterMove());
};

export const build: Move<GameState> = (context, pos: number) => {
  const { G, playerID, events } = context;

  const charState = G.players[playerID].char;

  const char = getCharacter(charState.name);

  const stage = char.build(context, charState, pos);
  events.setStage(stage);

  updateValids(context, charState, stage);
};

export const endTurn: Move<GameState> = ({ events }) => {
  events.endTurn();
};
