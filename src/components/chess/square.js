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
        this.y0 = y;
        this.x0 = x;
        this.y = y;
        this.x = x;
    }
    getName()
    {
        return COLS[this.y] + LINES[this.x];
    }

    /* Move the square of one space */
    /* Return false if the move is impossible */
    moveOneSpace(space)
    {
        if (this.y + space.y < MIN || this.y + space.y > MAX || this.x + space.x < MIN || this.x + space.x > MAX)
        {
            return false;
        }
        else
        {
            this.y += space.y;
            this.x += space.x;
            return true;
        }
    }
    goToOrigin()
    {
        this.x = this.x0;
        this.y = this.y0;
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