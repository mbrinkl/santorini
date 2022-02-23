import { GameContext, GameStage } from '../types/gameTypesTemp';
import { getCharacter } from './characters';

interface PossibleMove {
  type: GameStage | 'buttonPress';
  pos: number;
  prevs: {
    type: GameStage | 'buttonPress';
    pos: number;
  }[];
}

function getSpawnedMoves(
  context: GameContext,
  fromPossibleMove: PossibleMove,
): PossibleMove[] {
  const cloneContext = JSON.parse(JSON.stringify(context)) as GameContext;
  const { G, playerID } = cloneContext;
  G.isDummy = true;
  const { charState, opponentID } = G.players[playerID];
  const opponentCharState = G.players[opponentID].charState;
  const character = getCharacter(charState);
  const opponentCharacter = getCharacter(opponentCharState);

  const possibleMoves: PossibleMove[] = [];
  const { type, pos, prevs } = fromPossibleMove;
  prevs.push({ type, pos });

  let stage: GameStage | undefined;
  let movedFromPos = -1;
  let win = false; // Not checking for a definite winning possibility,
  // just an alternative to reaching the 'end' stage

  prevs.forEach((prevMove) => {
    switch (prevMove.type) {
      case 'select':
        character.select(cloneContext, charState, prevMove.pos);
        stage = character.getStageAfterSelect(cloneContext, charState);
        updateValids(cloneContext, stage);
        break;
      case 'move':
        movedFromPos = charState.workers[charState.selectedWorkerNum].pos;
        character.move(cloneContext, charState, prevMove.pos);
        opponentCharacter.afterOpponentMove(
          cloneContext,
          opponentCharState,
          charState,
          prevMove.pos,
        );
        stage = character.getStageAfterMove(cloneContext, charState);
        if (
          charState.workers[charState.selectedWorkerNum].pos === prevMove.pos
        ) {
          win ||= character.checkWinByMove(
            cloneContext,
            charState,
            movedFromPos,
            prevMove.pos,
          );
        }
        updateValids(cloneContext, stage);
        break;
      case 'build':
        character.build(cloneContext, charState, prevMove.pos);
        opponentCharacter.afterOpponentBuild(
          cloneContext,
          opponentCharState,
          charState,
          prevMove.pos,
        );
        stage = character.getStageAfterBuild(cloneContext, charState);
        updateValids(cloneContext, stage);
        break;
      case 'special':
        character.special(cloneContext, charState, prevMove.pos);
        opponentCharacter.afterOpponentSpecial(
          cloneContext,
          opponentCharState,
          charState,
        );
        stage = character.getStageAfterSpecial(cloneContext, charState);
        updateValids(cloneContext, stage);
        break;
      case 'buttonPress':
        stage = character.buttonPressed(cloneContext, charState);
        updateValids(cloneContext, stage);
        break;
      default:
        break;
    }
  });

  // Push to possibleMoves in this specific order so that 'end' will be popped
  // first if available, then buttonPress, then normal valids
  // Assumes no endless loop of button presses
  G.valids.forEach((valid) => {
    possibleMoves.push({ type: stage as GameStage, pos: valid, prevs });
  });

  if (charState.buttonActive) {
    possibleMoves.push({ type: 'buttonPress', pos: -1, prevs });
  }

  if (stage === 'end' || win) {
    possibleMoves.push({ type: 'end', pos: -1, prevs: [] });
  }

  return possibleMoves;
}

/**
 * Return true if the 'end' GameStage can be reached from a given position.
 * Traverses possible moves as a DFS, exit immediately if 'end' is reached
 */
export function canReachEndStage(
  context: GameContext,
  stage: GameStage | 'buttonPress',
  fromPos: number,
): boolean {
  const possibleMoveStack: PossibleMove[] = [
    { type: stage, pos: fromPos, prevs: [] },
  ];
  const checkedMoves: PossibleMove[] = [];

  while (possibleMoveStack.length > 0) {
    const possibleMove = possibleMoveStack.pop();
    if (possibleMove) {
      // Reaching the end stage is possible, return true
      if (possibleMove.type === 'end') {
        return true;
      }

      if (possibleMove.type === 'buttonPress') {
        getSpawnedMoves(context, possibleMove).forEach((newMove) => {
          possibleMoveStack.push(newMove);
        });
      } else if (
        !checkedMoves.find(
          (c) => c.type === possibleMove.type && c.pos === possibleMove.pos,
        )
      ) {
        // If we have not checked this type and position,
        // add it to the checked list
        checkedMoves.push(possibleMove);

        // Get the moves spawned from this possible move
        getSpawnedMoves(context, possibleMove).forEach((newMove) => {
          possibleMoveStack.push(newMove);
        });
      }
    }
  }

  // End stage was never reached, return false
  return false;
}

export function updateValids(context: GameContext, stage: GameStage) {
  const { G, ctx, playerID } = context;
  const { opponentID, charState } = G.players[playerID];
  const character = getCharacter(charState);
  const opponentCharState = G.players[opponentID].charState;
  const opponentCharacter = getCharacter(opponentCharState);
  const selecedWorkerPos =
    charState.selectedWorkerNum === -1
      ? -1
      : charState.workers[charState.selectedWorkerNum].pos;

  switch (stage) {
    case 'setup':
      G.valids = [...character.validSetup(context, charState)];
      break;
    case 'place':
      G.valids = [...character.validPlace(context, charState)];
      break;
    case 'select':
      G.valids = [...character.validSelect(context, charState)];
      break;
    case 'move':
      G.valids = [...character.validMove(context, charState, selecedWorkerPos)];
      G.valids = [
        ...opponentCharacter.restrictOpponentMove(
          context,
          opponentCharState,
          charState,
          selecedWorkerPos,
        ),
      ];
      break;
    case 'build':
      G.valids = [
        ...character.validBuild(context, charState, selecedWorkerPos),
      ];
      G.valids = [
        ...opponentCharacter.restrictOpponentBuild(
          context,
          opponentCharState,
          charState,
          selecedWorkerPos,
        ),
      ];
      break;
    case 'special':
      G.valids = [
        ...character.validSpecial(context, charState, selecedWorkerPos),
      ];
      G.valids = [
        ...opponentCharacter.restrictOpponentSpecial(
          context,
          opponentCharState,
          charState,
          selecedWorkerPos,
        ),
      ];
      break;
    default:
      G.valids = [];
      break;
  }

  if (!G.isDummy && ctx.phase === 'main' && stage !== 'end') {
    G.valids = G.valids.filter((pos) => canReachEndStage(context, stage, pos));
  }
}
