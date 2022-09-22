/*
  Board reffered to as a 5x5 grid of positions or x,y coordinates:
  To the player, they are displayed as (A-E),(1-5) coordinates

   0   1   2   3   4 | 0,0  1,0  2,0  3,0  4,0 | A5  B5  C5  D5  E5
   5   6   7   8   9 | 0,1  1,1  2,1  3,1  4,1 | A4  B4  C4  D4  E4
  10  11  12  13  14 | 0,2  1,2  2,2  3,2  4,2 | A3  B3  C3  D3  E3
  15  16  17  18  19 | 0,3  1,3  2,3  3,3  4,3 | A2  B2  C2  D2  E2
  20  21  22  23  24 | 0,4  1,4  2,4  3,4  4,4 | A1  B1  C1  D1  E1
*/

/**
 * Converts an x,y coordinate to a position
 */
export function coordToPos(x: number, y: number): number {
  return y * 5 + x;
}

/**
 * Converts a position to an x,y coordinate
 */
export function posToCoord(pos: number): number[] {
  const x = pos % 5;
  const y = (pos - x) / 5;
  return [x, y];
}

/**
 * Converts a position to a player's view coordinate
 */
export function posToReadableCoord(pos: number): string {
  const [x, y] = posToCoord(pos);

  const xMap = ['A', 'B', 'C', 'D', 'E'];
  const yMap = [5, 4, 3, 2, 1];

  return `${xMap[x]}${yMap[y]}`;
}

/**
 * Converts a position to a direction, mapped as:
 *
 *  NW  N  NE      6   7   8
 *   W      E  => 11      13
 *  SW  S  SE     16  17  18
 */
export function posToDirection(pos: number): number[] {
  let x = 0;
  let y = 0;

  if (pos < 10) {
    y = -1;
  } else if (pos > 15) {
    y = 1;
  }

  if (pos % 5 === 1) {
    x = -1;
  } else if (pos % 5 === 3) {
    x = 1;
  }

  return [x, y];
}

/**
 * Given a position and a direction (described in posToDirection),
 * return the next position in that direction
 * ie. given 0 as pos and 18 as direction, 6 is the next pos
 */
export function getNextPositionInDirection(
  pos: number,
  direction: number,
): number {
  let nextPos = -1;

  const [posX, posY] = posToCoord(pos);
  const [dirX, dirY] = posToDirection(direction);

  const nextPosX = posX + dirX;
  const nextPosY = posY + dirY;

  if (nextPosX >= 0 && nextPosX <= 4 && nextPosY >= 0 && nextPosY <= 4) {
    nextPos = coordToPos(nextPosX, nextPosY);
  }

  return nextPos;
}

/**
 * Given two adjacent positions, get the next position
 * ie. given 0 as fromPos and 6 as toPos, the next position is 12
 */
export function getNextPosition(fromPos: number, toPos: number): number {
  let nextPos = -1;

  if (!getWrappedAdjacents(fromPos).includes(toPos)) {
    return nextPos;
  }

  const [fromX, fromY]: number[] = posToCoord(fromPos);
  const [toX, toY]: number[] = posToCoord(toPos);

  let dirX = fromX - toX;
  let dirY = fromY - toY;

  // Account for board wrapping moves
  if (dirX === 4) dirX = -1;
  else if (dirX === -4) dirX = 1;
  if (dirY === 4) dirY = -1;
  else if (dirY === -4) dirY = 1;

  const nextPosX = toX - dirX;
  const nextPosY = toY - dirY;

  if (nextPosX >= 0 && nextPosX <= 4 && nextPosY >= 0 && nextPosY <= 4) {
    nextPos = coordToPos(nextPosX, nextPosY);
  }

  return nextPos;
}

/**
 * Given a position, get all adjacent positions
 */
export function getAdjacentPositions(pos: number): number[] {
  const adjacents: number[] = [];
  const [x, y] = posToCoord(pos);

  if (x !== 0) {
    adjacents.push(coordToPos(x - 1, y));
    if (y !== 0) adjacents.push(coordToPos(x - 1, y - 1));
    if (y !== 4) adjacents.push(coordToPos(x - 1, y + 1));
  }
  if (x !== 4) {
    adjacents.push(coordToPos(x + 1, y));
    if (y !== 0) adjacents.push(coordToPos(x + 1, y - 1));
    if (y !== 4) adjacents.push(coordToPos(x + 1, y + 1));
  }
  if (y !== 0) adjacents.push(coordToPos(x, y - 1));
  if (y !== 4) adjacents.push(coordToPos(x, y + 1));

  return adjacents;
}

/**
 * Given a position, get all adjacent positions, treating opposite edges
 * and corners as if they are adjacent (Urania)
 */
export function getWrappedAdjacents(pos: number): number[] {
  const adjacents: number[] = [];
  const [x, y] = posToCoord(pos);

  const left = (((x - 1) % 5) + 5) % 5;
  const right = (((x + 1) % 5) + 5) % 5;
  const up = (((y - 1) % 5) + 5) % 5;
  const down = (((y + 1) % 5) + 5) % 5;

  adjacents.push(coordToPos(left, y));
  adjacents.push(coordToPos(left, up));
  adjacents.push(coordToPos(left, down));
  adjacents.push(coordToPos(right, y));
  adjacents.push(coordToPos(right, up));
  adjacents.push(coordToPos(right, down));
  adjacents.push(coordToPos(x, up));
  adjacents.push(coordToPos(x, down));

  return adjacents;
}

/**
 * Given two positions, return true if they are adjacent
 */
export function positionsAreAdjacent(pos1: number, pos2: number): boolean {
  return getAdjacentPositions(pos1).includes(pos2);
}

/**
 * Get a list of perimeter positions
 */
export function getPerimeterPositions(): number[] {
  return [0, 1, 2, 3, 4, 5, 9, 10, 14, 15, 19, 20, 21, 22, 23, 24];
}

/**
 * Check if a position is in the perimeter
 */
export function posIsPerimeter(pos: number): boolean {
  return getPerimeterPositions().includes(pos);
}

/**
 * Get a list of corner positions
 */
export function getCornerPositions(): number[] {
  return [0, 4, 20, 24];
}

/**
 * Given a perimeter position, get a list of perimeter positions on the
 * opposite side of the board
 */
export function getOppositePerimeterPositions(pos: number): number[] {
  let oppositePerimeter: number[] = [];

  // pos can be in two perimeter cases if it is a corner,
  // so update the list twice
  if ([0, 1, 2, 3, 4].includes(pos)) {
    oppositePerimeter = oppositePerimeter.concat([20, 21, 22, 23, 24]);
  }
  if ([0, 5, 10, 15, 20].includes(pos)) {
    oppositePerimeter = oppositePerimeter.concat([4, 9, 14, 19, 24]);
  }
  if ([20, 21, 22, 23, 24].includes(pos)) {
    oppositePerimeter = oppositePerimeter.concat([0, 1, 2, 3, 4]);
  }
  if ([4, 9, 14, 19, 24].includes(pos)) {
    oppositePerimeter = oppositePerimeter.concat([0, 5, 10, 15, 20]);
  }

  return oppositePerimeter;
}
