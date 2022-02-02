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
        updateValids(cloneContext, stage);
        break;
      case 'move':
        character.move(cloneContext, charState, prevMove.pos);
        stage = character.getStageAfterMove(cloneContext, charState);
        updateValids(cloneContext, stage);
        break;
      case 'build':
        character.build(cloneContext, charState, prevMove.pos);
        stage = character.getStageAfterBuild(cloneContext, charState);
        updateValids(cloneContext, stage);
        break;
      case 'special':
        character.special(cloneContext, charState, prevMove.pos);
        stage = character.getStageAfterSpecial(cloneContext, charState);
        updateValids(cloneContext, stage);
        break;
      default:
        break;
    }
  });

  G.valids.forEach((valid) => {
    possibleMoves.push({ type: stage as GameStage, pos: valid, prevs });
  });

  // Push the 'end' possibility at the end, so it will be the next popped
  if (stage === 'end') {
    possibleMoves.push({ type: 'end', pos: -1, prevs: [] });
  }

  return possibleMoves;
}

/**
 * Return true if the 'end' GameStage can be reached from a given position.
 * Traverses possible moves as a DFS, exit immediately if 'end' is reached
 */
function canReachEndStage(
  context: GameContext,
  stage: GameStage,
  fromPos: number,
) : boolean {
  const possibleMoveStack: PossibleMove[] = [{ type: stage, pos: fromPos, prevs: [] }];
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

export function updateValids(context: GameContext, stage: string) {
  const { G, playerID } = context;
  const { opponentID, charState } = G.players[playerID];
  const character = getCharacter(charState);
  const opponentCharState = G.players[opponentID].charState;
  const opponentCharacter = getCharacter(opponentCharState);
  const selecedWorkerPos = charState.selectedWorkerNum === -1 ? -1
    : charState.workers[charState.selectedWorkerNum].pos;

  switch (stage) {
    case 'place':
      G.valids = [...character.validPlace(context, charState)];
      break;
    case 'select':
      G.valids = [...character.validSelect(context, charState)];
      break;
    case 'move':
      G.valids = [...character.validMove(context, charState, selecedWorkerPos)];
      G.valids = [...opponentCharacter.restrictOpponentMove(
        context,
        opponentCharState,
        charState,
        selecedWorkerPos,
      )];
      break;
    case 'build':
      G.valids = [...character.validBuild(context, charState, selecedWorkerPos)];
      G.valids = [...opponentCharacter.restrictOpponentBuild(
        context,
        opponentCharState,
        charState,
        selecedWorkerPos,
      )];
      break;
    case 'special':
      G.valids = [...character.validSpecial(context, charState, selecedWorkerPos)];
      break;
    default:
      G.valids = [];
      break;
  }

  if (!G.isClone && stage !== 'place') {
    G.valids = G.valids.filter((pos) => canReachEndStage(context, stage as GameStage, pos));
  }
}
