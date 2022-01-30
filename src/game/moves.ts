import { Move } from 'boardgame.io';
import { initCharacter, updateValids } from '.';
import { GameState } from '../types/GameTypes';
import { getCharacter } from './characters';
import { Character, Worker } from '../types/CharacterTypes';
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

export const characterAbility: Move<GameState> = ({ G, ctx, events }) => {
  const currPlayer = G.players[ctx.currentPlayer];
  const currChar = currPlayer.char;

  const char: Character = getCharacter(currChar.name);

  const stage = char.buttonPressed(G, ctx, currPlayer, currChar);
  events.setStage(stage);

  updateValids(G, ctx, currPlayer, stage);
};

export const place: Move<GameState> = ({ G, ctx, events }, pos: number) => {
  const currentChar = G.players[ctx.currentPlayer].char;

  const worker: Worker = {
    pos,
    height: G.spaces[pos].height,
  };

  currentChar.workers.push(worker);
  Board.place(G, pos, ctx.currentPlayer, currentChar.workers.length - 1);

  currentChar.numWorkersToPlace -= 1;

  if (currentChar.numWorkersToPlace === 0) {
    events.setStage('end');
  }

  updateValids(G, ctx, G.players[ctx.currentPlayer], 'place');
};

export const select: Move<GameState> = ({ G, ctx, events }, pos: number) => {
  const currPlayer = G.players[ctx.currentPlayer];
  const currChar = currPlayer.char;
  const char: Character = getCharacter(currChar.name);

  const stage = char.select(G, ctx, currPlayer, currChar, pos);
  events.setStage(stage);

  updateValids(G, ctx, currPlayer, stage);
};

export const move: Move<GameState> = ({ G, ctx, events }, pos: number) => {
  const currPlayer = G.players[ctx.currentPlayer];
  const currChar = currPlayer.char;

  const beforeHeight = currChar.workers[currChar.selectedWorkerNum].height;

  const char: Character = getCharacter(currChar.name);

  const ogPos = currChar.workers[currChar.selectedWorkerNum].pos;
  const stage = char.move(G, ctx, currPlayer, currChar, pos);
  events.setStage(stage);

  // opp move effect
  const oppPlayer = G.players[currPlayer.opponentId];
  getCharacter(oppPlayer.char.name).opponentPostMove(G, ctx, currPlayer, currChar, ogPos);

  updateValids(G, ctx, currPlayer, stage);

  const afterHeight = currChar.workers[currChar.selectedWorkerNum].height;
  checkWinByMove(G, ctx, events, beforeHeight, afterHeight);

  // ctx.events?.setStage(char.stageAfterMove());
};

export const build: Move<GameState> = ({ G, ctx, events }, pos: number) => {
  const currPlayer = G.players[ctx.currentPlayer];
  const currChar = currPlayer.char;

  const char: Character = getCharacter(currChar.name);

  const stage = char.build(G, ctx, currPlayer, currChar, pos);
  events.setStage(stage);

  updateValids(G, ctx, currPlayer, stage);
};

export const endTurn: Move<GameState> = ({ events }) => {
  events.endTurn();
};
