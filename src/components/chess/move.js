import Square, { MIN, MAX } from './square.js';

/* Move types */
export const DEFAULT = 'D';
export const TWO_SQUARE_ADVANCE = '2S.A';
export const EN_PASSANT = 'E.P';
export const PROMOTION = 'P(Q)';
export const CASTLING_KINGSIDE = 'O-O';
export const CASTLING_QUEENSIDE = 'O-O-O';

export default class Move
{
    moveType;
    capturedPiece;
    constructor(y, x)
    {
        this.from = new Square(y, x);
        this.to = new Square(y, x);
    }
    setTo(y, x)
    {
        this.to.y = y;
        this.to.x = x;
    }
    /* Move the square of one space */
    /* Return false if the move is impossible */
    moveOneSpace(space)
    {
        if (this.to.y + space.y < MIN || this.to.y + space.y > MAX || this.to.x + space.x < MIN || this.to.x + space.x > MAX)
        {
            return false;
        }
        else
        {
            this.to.y += space.y;
            this.to.x += space.x;
            return true;
        }
    }
    goToOrigin()
    {
        this.to.x = this.from.x;
        this.to.y = this.from.y;
    }
}