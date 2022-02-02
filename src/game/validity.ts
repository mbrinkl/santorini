import { updateValids } from '.';
import { GameContext, GameStage } from '../types/GameTypes';
import { getCharacter } from './characters';

interface PossibleMove {
  type: GameStage // todo: check for button press move
  pos: number,
  prevs: {
    type: GameStage,
    pos: number
  }[]
}

function initStack(
  context: GameContext,
) : PossibleMove[] {
  const { G, ctx } = context;
  const { valids } = G;
  const stage = (ctx.activePlayers && ctx.activePlayers[ctx.currentPlayer]) as GameStage;
  const possibleMoves: PossibleMove[] = [];

  valids.forEach((pos) => {
    possibleMoves.push({ type: stage, pos, prevs: [] });
  });

  return possibleMoves;
}

function getSpawnedMoves(
  context: GameContext,
  fromPossibleMove: PossibleMove,
): PossibleMove[] {
  const cloneContext = JSON.parse(JSON.stringify(context)) as GameContext;
  const { G, playerID } = cloneContext;
  G.isClone = true;
  const { charState } = G.players[playerID];
  const character = getCharacter(charState);

  const possibleMoves: PossibleMove[] = [];
  const { type, pos, prevs } = fromPossibleMove;
  prevs.push({ type, pos });

  let stage: GameStage | undefined;

  prevs.forEach((prevMove) => {
    switch (prevMove.type) {
      case 'select':
        character.select(cloneContext, charState, prevMove.pos);
        stage = character.getStageAfterSelect(cloneContext, charState);
        updateValids(cloneContext, charState, stage);
        break;
      case 'move':
        character.move(cloneContext, charState, prevMove.pos);
        stage = character.getStageAfterMove(cloneContext, charState);
        updateValids(cloneContext, charState, stage);
        break;
      case 'build':
        character.build(cloneContext, charState, prevMove.pos);
        stage = character.getStageAfterBuild(cloneContext, charState);
        updateValids(cloneContext, charState, stage);
        break;
      case 'special':
        character.special(cloneContext, charState, prevMove.pos);
        stage = character.getStageAfterSpecial(cloneContext, charState);
        updateValids(cloneContext, charState, stage);
        break;
      default:
        break;
    }
  });

  const { valids } = G;
  valids.forEach((valid) => {
    possibleMoves.push({ type: stage as GameStage, pos: valid, prevs });
  });

  if (stage === 'end') {
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
  fromPos: number,
) : boolean {
  const possibleMoveStack = initStack(context);
  const checkedMoves: PossibleMove[] = [];

  while (possibleMoveStack.length > 0) {
    const possibleMove = possibleMoveStack.pop();
    if (possibleMove) {
      // Reaching the end stage is possible, return true
      if (possibleMove.type === 'end') {
        return true;
      }

      // If we have not checked this type and position
      if (!checkedMoves.find((c) => c.type === possibleMove.type && c.pos === possibleMove.pos)) {
        // Add it to the checked list
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
