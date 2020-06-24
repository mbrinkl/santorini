function coord_to_pos(x: number, y: number) : number {
    return y * 5 + x;
}

function pos_to_coord(pos: number) : number[] {
    let x = pos % 5;
    let y = (pos - x) / 5;
    return [x, y]
}

export function get_adjacent_positions(pos: number) : number[] {
    let valid_range : number[] = [];
    let coords : number[] = pos_to_coord(pos);
    let x : number = coords[0];
    let y : number = coords[1];

    if (x !== 0)
    {
        valid_range.push(coord_to_pos(x - 1, y))
        if (y !== 0)
            valid_range.push(coord_to_pos(x - 1, y - 1))
        if (y !== 4)
            valid_range.push(coord_to_pos(x - 1, y + 1))
    }
    if (x !== 4)
    {
        valid_range.push(coord_to_pos(x + 1, y))
        if (y !== 0)
            valid_range.push(coord_to_pos(x + 1, y - 1))
        if (y !== 4)
            valid_range.push(coord_to_pos(x + 1, y + 1))
    }
    if (y !== 0)
        valid_range.push(coord_to_pos(x, y - 1))
    if (y !== 4)
        valid_range.push(coord_to_pos(x, y + 1))

    return valid_range
}