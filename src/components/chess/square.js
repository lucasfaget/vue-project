export const WHITE = 0;
export const BLACK = 1;

export const MIN = 0;
export const MAX = 7;

export const INDEXES = [0,1,2,3,4,5,6,7];

export const COLS = ['a','b','c','d','e','f','g','h'];
export const LINES = ['1','2','3','4','5','6','7','8'];

export default class Square
{
    constructor(y, x)
    {
        this.y = y;
        this.x = x;
    }
    getSquare()
    {
        return COLS[this.y] + LINES[this.x];
    }

    static getColIndex(square)
    {
        return COLS.indexOf(square[0]);
    }

    static getLineIndex(square)
    {
        return LINES.indexOf(square[1]);
    }
}