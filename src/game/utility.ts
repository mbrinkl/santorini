export function coordToPos(x: number, y: number) : number {
    return y * 5 + x;
}

export function posToCoord(pos: number) : number[] {
    const x = pos % 5;
    const y = (pos - x) / 5;
    return [x, y];
}

export function getNextPosition(fromPos: number, toPos: number) : number {

   let nextPos = -1

   const [fromX, fromY] : number[] = posToCoord(fromPos);
   const [toX, toY] : number[] = posToCoord(toPos);

   const dirX = fromX - toX;
   const dirY = fromY - toY;

   const nextPosX = toX - dirX;
   const nextPosY = toY - dirY;

   if (nextPosX >= 0 && nextPosX <= 4 && nextPosY >= 0 && nextPosY <= 4) {
        nextPos = coordToPos(nextPosX, nextPosY);
   }

   return nextPos;
}

export function posIsPerimeter(pos: number) : boolean {
    const perimeters = [0, 1, 2, 3, 4, 5, 9, 10, 14, 15, 19, 20, 21, 22, 23, 24];
    return perimeters.includes(pos);
}

export function getAdjacentPositions(pos: number) : number[] {
    let valid_range : number[] = [];
    const [x, y] : number[] = posToCoord(pos);

    if (x !== 0)
    {
        valid_range.push(coordToPos(x - 1, y))
        if (y !== 0)
            valid_range.push(coordToPos(x - 1, y - 1))
        if (y !== 4)
            valid_range.push(coordToPos(x - 1, y + 1))
    }
    if (x !== 4)
    {
        valid_range.push(coordToPos(x + 1, y))
        if (y !== 0)
            valid_range.push(coordToPos(x + 1, y - 1))
        if (y !== 4)
            valid_range.push(coordToPos(x + 1, y + 1))
    }
    if (y !== 0)
        valid_range.push(coordToPos(x, y - 1))
    if (y !== 4)
        valid_range.push(coordToPos(x, y + 1))

    return valid_range
}