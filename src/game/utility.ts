export function coordToPos(x: number, y: number): number {
  return y * 5 + x;
}

export function posToCoord(pos: number): number[] {
  const x = pos % 5;
  const y = (pos - x) / 5;
  return [x, y];
}

export function getNextPosition(fromPos: number, toPos: number): number {
  let nextPos = -1;

  const [fromX, fromY]: number[] = posToCoord(fromPos);
  const [toX, toY]: number[] = posToCoord(toPos);

  const dirX = fromX - toX;
  const dirY = fromY - toY;

  const nextPosX = toX - dirX;
  const nextPosY = toY - dirY;

  if (nextPosX >= 0 && nextPosX <= 4 && nextPosY >= 0 && nextPosY <= 4) {
    nextPos = coordToPos(nextPosX, nextPosY);
  }

  return nextPos;
}

export function getAdjacentPositions(pos: number): number[] {
  let valid_range: number[] = [];
  const [x, y]: number[] = posToCoord(pos);

  if (x !== 0) {
    valid_range.push(coordToPos(x - 1, y));
    if (y !== 0) valid_range.push(coordToPos(x - 1, y - 1));
    if (y !== 4) valid_range.push(coordToPos(x - 1, y + 1));
  }
  if (x !== 4) {
    valid_range.push(coordToPos(x + 1, y));
    if (y !== 0) valid_range.push(coordToPos(x + 1, y - 1));
    if (y !== 4) valid_range.push(coordToPos(x + 1, y + 1));
  }
  if (y !== 0) valid_range.push(coordToPos(x, y - 1));
  if (y !== 4) valid_range.push(coordToPos(x, y + 1));

  return valid_range;
}

export function getPerimeterPositions(): number[] {
  return [0, 1, 2, 3, 4, 5, 9, 10, 14, 15, 19, 20, 21, 22, 23, 24];
}

export function posIsPerimeter(pos: number): boolean {
  return getPerimeterPositions().includes(pos);
}

export function getOppositePerimterPositions(pos: number): number[] {
  let oppositePerimeter : number[] = []

  // pos can be in two perimeter cases if it is a corner, so update the list twice
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
