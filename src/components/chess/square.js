export const MIN = 0;
export const MAX = 7;

export default class Square
{
    constructor(y, x)
    {
        this.y0 = y;
        this.x0 = x;
        this.y = y;
        this.x = x;
    }
    getIndex()
    {
        return 8*this.y + this.x;
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
    goBackOrigin()
    {
        this.x = this.x0;
        this.y = this.y0;
    }
}