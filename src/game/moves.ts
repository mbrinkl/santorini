import { Move, LongFormMove } from 'boardgame.io';
import { GameState } from '../types/gameTypes';
import { getCharacter, initCharState } from './util/characterUtil';
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

export const setup: LongFormMove<GameState> = {
  move: (context, pos: number) => {
    const { G, playerID, events } = context;
    const { charState } = G.players[playerID];
    const character = getCharacter(charState);

    const stage = character.setup(context, charState, pos);
    events.setStage(stage);

    updateValids(context, stage);
  },
  redact: ({ G, ctx }) => G.players[ctx.currentPlayer].charState.hasSecretSetup,
};

export const place: LongFormMove<GameState> = {
  move: (context, pos: number) => {
    const { G, playerID, events } = context;
    const { charState } = G.players[playerID];
    const character = getCharacter(charState);

    const stage = character.place(context, charState, pos);
    events.setStage(stage);

    updateValids(context, stage);
  },
  redact: ({ G, ctx }) =>
    G.players[ctx.currentPlayer].charState.hasSecretWorkers,
};

export const select: LongFormMove<GameState> = {
  move: (context, pos: number) => {
    const { G, playerID, events } = context;
    const { charState } = G.players[playerID];

    const character = getCharacter(charState);

    character.select(context, charState, pos);
    const stage = character.getStageAfterSelect(context, charState);
    events.setStage(stage);

    updateValids(context, stage);
  },
  redact: ({ G, ctx }) =>
    G.players[ctx.currentPlayer].charState.hasSecretWorkers,
};

export const move: LongFormMove<GameState> = {
  move: (context, pos: number) => {
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
      const winRestricted = opponentCharacter.restrictOpponentWin(
        context,
        opponentCharState,
        movedFromPos,
        pos,
      );

      if (
        !winRestricted &&
        character.checkWinByMove(context, charState, movedFromPos, pos)
      ) {
        events.endGame({
          winner: playerID,
        });
      }
    }

    const stage = character.getStageAfterMove(context, charState);
    events.setStage(stage);

    updateValids(context, stage);
  },
  redact: ({ G, ctx }) =>
    G.players[ctx.currentPlayer].charState.hasSecretWorkers,
};

export const build: LongFormMove<GameState> = {
  move: (context, pos: number) => {
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
  },
  redact: ({ G, ctx }) =>
    G.players[ctx.currentPlayer].charState.hasSecretWorkers,
};

export const special: LongFormMove<GameState> = {
  move: (context, pos: number) => {
    const { G, playerID, events } = context;

    const { charState, opponentID } = G.players[playerID];
    const opponentCharState = G.players[opponentID].charState;
    const character = getCharacter(charState);
    const opponentCharacter = getCharacter(opponentCharState);

    character.special(context, charState, pos);
    opponentCharacter.afterOpponentSpecial(
      context,
      opponentCharState,
      charState,
    );
    const stage = character.getStageAfterSpecial(context, charState);
    events.setStage(stage);

    updateValids(context, stage);
  },
  redact: ({ G, ctx }) =>
    G.players[ctx.currentPlayer].charState.hasSecretSpecial,
};

export const endTurn: Move<GameState> = ({ events }) => {
  events.endTurn();
};
