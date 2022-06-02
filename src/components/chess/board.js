import Square, { WHITE, BLACK, MIN, MAX, INDEXES, COLS, LINES } from './square.js';
import Move, { DEFAULT, EN_PASSANT, TWO_SQUARE_ADVANCE } from './move.js';

export const EMPTY = null;

export const PAWN = 'P';
export const KNIGHT = 'N';
export const BISHOP = 'B';
export const ROOK = 'R';
export const QUEEN = 'Q';
export const KING ='K';

export const NAMES = [ROOK, KNIGHT, BISHOP, QUEEN, KING, BISHOP, KNIGHT, ROOK];

export const UP = { y: 0 , x: 1 };
export const UP_RIGHT = { y: 1 , x: 1 };
export const RIGHT = { y: 1 , x: 0 };
export const DOWN_RIGHT = { y: 1 , x: -1 };
export const DOWN = { y: 0 , x: -1 };
export const DOWN_LEFT = { y: -1 , x: -1 };
export const LEFT = { y: -1 , x: 0 };
export const UP_LEFT = { y: -1 , x: 1 };

export const KNIGHT_SPACES = [ { y: -1 , x: -2 } , { y: -2 , x: -1 } , { y: -2 , x: 1 } , { y: -1 , x: 2 } , { y: 1 , x: 2 } , { y: 2 , x: 1 } , { y: 2 , x: -1 } , { y: 1 , x: -2 } ];
export const BISHOP_SPACES = [ UP_LEFT, UP_RIGHT, DOWN_LEFT , DOWN_RIGHT ];
export const ROOK_SPACES = [ UP, RIGHT, DOWN, LEFT ];
export const ROYALTY_SPACES = [ ...BISHOP_SPACES, ...ROOK_SPACES ];

export const WHITE_EN_PASSANT_LINE = MIN + 4;
export const BLACK_EN_PASSANT_LINE = MAX - 4;

export default class Board
{
    constructor()
    {
        this.pieces = {};
        this.setup();
        this.moves = [];
    }
    setup()
    {
        for (const lineIndex of INDEXES) {
            for (const colIndex of INDEXES) {
                this.pieces[COLS[colIndex] + LINES[lineIndex]] =
                    lineIndex < MIN + 2 || lineIndex > MAX - 2 ?
                    {
                        player: lineIndex < MIN + 2 ? WHITE : BLACK,
                        name: lineIndex === MIN || lineIndex === MAX ? NAMES[colIndex] : PAWN,
                        moveCount: 0,
                        legalMoves: {}
                    }
                    : EMPTY
            }
        }
    }

    isEmpty(square)
    {
        return this.pieces[square] === EMPTY;
    }
    isCapturable(square, currentPlayer)
    {
        return !this.isEmpty(square) && this.pieces[square].player === 1 - currentPlayer && this.pieces[square].name !== KING;
    }
    isMovable(square)
    {
        return !this.isEmpty(square) && Object.keys(this.pieces[square].legalMoves).length !== 0;
    }
    isLegal(from, to)
    {
        return this.pieces[from].legalMoves[to] !== undefined;
    }

    isOccupiedBy(square, player, name)
    {
        return !this.isEmpty(square) && this.pieces[square].name === name && this.pieces[square].player === player;
    }

    findPieceSquare(player, name)
    {
        for (const square in this.pieces)
        {
            if (!this.isEmpty(square) && this.pieces[square].name === name && this.pieces[square].player === player)
            {
                return square;
            }
        }

        return undefined;
    }
    // getMoveType(from, to)
    // {
    //     return this.moves[from].legalMoves[to];
    // }

    recordLegalMove(move)
    {
        this.pieces[move.from.getSquare()].legalMoves[move.to.getSquare()] = move.moveType;
    }
    move(move, moveType = DEFAULT)
    {
        move.moveType = moveType;
        move.capturedPiece = this.pieces[move.to.getSquare()]
        /* Update chessboard */
        this.pieces[move.to.getSquare()] = this.pieces[move.from.getSquare()];
        this.pieces[move.to.getSquare()].moveCount++;
        this.pieces[move.from.getSquare()] = EMPTY;
        /* Save move date */
        this.moves.push(move);
    }
    cancelLastMove()
    {
        let move = this.moves.pop();
        if (move !== undefined)
        {
            /* Update chessboard */
            this.pieces[move.from.getSquare()] = this.pieces[move.to.getSquare()];
            this.pieces[move.from.getSquare()].moveCount--;
            this.pieces[move.to.getSquare()] = move.capturedPiece;
        }
    }
    resetLegalMoves()
    {
        for (const piece of Object.values(this.pieces))
        {
            if (piece !== EMPTY)
            {
                piece.legalMoves = {};
            }
        }
    }
    isCheckedIfMoving(player, move, moveType = DEFAULT)
    {
        this.move(move, moveType);
        let isChecked = this.isChecked(player);
        this.cancelLastMove();

        return isChecked;
    }

    calculateAllMoves(player)
    {
        this.resetLegalMoves();

        for (const [square, piece] of Object.entries(this.pieces))
        {
            if (piece !== EMPTY)
            {
                if (piece.player === player)
                {
                    let move = new Move(Square.getColIndex(square), Square.getLineIndex(square));

                    if (piece.name === PAWN)
                    {
                        /* Testing move forward */
                        let space = player === WHITE ? UP : DOWN;
                        /* Once */
                        if (move.moveOneSpace(space) && this.isEmpty(move.to.getSquare()))
                        {
                            if (!this.isCheckedIfMoving(player, move))
                            {
                                this.recordLegalMove(move)
                            }

                            /* Twice */
                            if (this.pieces[move.from.getSquare()].moveCount === 0)
                            {
                                if (move.moveOneSpace(space) && this.isEmpty(move.to.getSquare()))
                                {
                                    if (!this.isCheckedIfMoving(player, move, TWO_SQUARE_ADVANCE))
                                    {
                                        this.recordLegalMove(move, TWO_SQUARE_ADVANCE)
                                    }
                                }
                            }
                        }
                        move.goToOrigin();

                        /* Testing diagonal capture */
                        let spaces = player === WHITE ? [UP_LEFT, UP_RIGHT] : [DOWN_LEFT, DOWN_RIGHT];
                        spaces.forEach((space) => {
                            if (move.moveOneSpace(space) && this.isCapturable(move.to.getSquare(), player))
                            {
                                if (!this.isCheckedIfMoving(player, move))
                                {
                                    this.recordLegalMove(move);
                                }
                            }
                            move.goToOrigin();
                        });

                        /* Testing en passant capture */
                        let enPassantLine = player === WHITE ? WHITE_EN_PASSANT_LINE : BLACK_EN_PASSANT_LINE;
                        if (move.x === enPassantLine)
                        {
                            for (const space of [LEFT, RIGHT])
                            {
                                if (move.moveOneSpace(space) && 
                                    this.moves[this.moves.length-1].moveType === TWO_SQUARE_ADVANCE && 
                                    this.moves[this.moves.length-1].to.getSquare() === move.to.getSquare() && 
                                    this.isOccupiedBy(move.to.getSquare(), 1-player, PAWN))
                                {
                                    move.moveOneSpace(UP);
                                    if (this.isEmpty(move.to.getSquare()))
                                    {
                                        if (!this.isCheckedIfMoving(player, move, EN_PASSANT))
                                        {
                                            this.recordLegalMove(move, EN_PASSANT);
                                        }
                                    } 
                                }
                                move.goToOrigin();
                            }
                        }        
                    }
                    else if (piece.name === KNIGHT)
                    {
                        KNIGHT_SPACES.forEach((space => {
                            if (move.moveOneSpace(space))
                            {
                                if (this.isEmpty(move.to.getSquare()) || this.isCapturable(move.to.getSquare(), player))
                                {
                                    if (!this.isCheckedIfMoving(player, move))
                                    {
                                        this.recordLegalMove(move)
                                    }
                                }
                            }
                            move.goToOrigin();
                        })); 
                    }
                    else if (piece.name === KING)
                    {
                        ROYALTY_SPACES.forEach((space => {
                            if (move.moveOneSpace(space))
                            {
                                if (this.isEmpty(move.to.getSquare()) || this.isCapturable(move.to.getSquare(), player))
                                {
                                    if (!this.isCheckedIfMoving(player, move))
                                    {
                                        this.recordLegalMove(move)
                                    }
                                }
                            }
                            move.goToOrigin();
                        }));
                    }
                    else
                    {
                        let spaces;
                        switch (piece.name)
                        {
                            case BISHOP:
                                spaces = BISHOP_SPACES;
                                break;
                            case ROOK:
                                spaces = ROOK_SPACES;
                                break;
                            case QUEEN:
                                spaces = ROYALTY_SPACES;
                                break;
                        }
                        spaces.forEach((space => {
                            while (move.moveOneSpace(space))
                            {
                                if (this.isEmpty(move.to.getSquare()))
                                {
                                    if (!this.isCheckedIfMoving(player, move))
                                    {
                                        this.recordLegalMove(move)
                                    }
                                }
                                else
                                {
                                    if (this.isCapturable(move.to.getSquare(), player))
                                    {
                                        if (!this.isCheckedIfMoving(player, move))
                                        {
                                            this.recordLegalMove(move)
                                        }
                                    }
                                    break;
                                }
                            }
                            move.goToOrigin();
                        }));
                    }
                }            
            }
        }
    }

    isChecked(player)
    {
        /* Locate the king */
        let kingSquare = this.findPieceSquare(player, KING);

        let move = new Move(Square.getColIndex(kingSquare), Square.getLineIndex(kingSquare));

        /* Test if the player is checked by a pawn or a pawn */
        let spaces = player === WHITE ? [UP_LEFT, UP_RIGHT] : [DOWN_LEFT, DOWN_RIGHT];
        for (const space of spaces)
        {
            if (move.moveOneSpace(space) && this.isOccupiedBy(move.to.getSquare(), 1-player, PAWN))
            {
                console.log('check by pawn');
                return true;
            }
            move.goToOrigin();
        }

        /* Test if the player is checked by a knight */
        for (const space of KNIGHT_SPACES)
        {
            if (move.moveOneSpace(space) && this.isOccupiedBy(move.to.getSquare(), 1-player, KNIGHT))
            {
                console.log('check by knight');
                return true;
            }
            move.goToOrigin();
        }

        /* Test if the player is checked by a bishop or a rook or a queen or a king */
        for (const space of ROYALTY_SPACES)
        {
            let spaceNumber = 1;
            while(move.moveOneSpace(space))
            {
                if (!this.isEmpty(move.to.getSquare()))
                {
                    if (this.pieces[move.to.getSquare()].player === 1 - player)
                    {
                        if (this.pieces[move.to.getSquare()].name === QUEEN)
                        {
                            console.log('check by queen');
                            return true;
                        }
                        else if (spaceNumber === 1 && this.pieces[move.to.getSquare()].name === KING)
                        {
                            console.log('check by king');
                            return true;
                        }
                        else
                        {
                            if (space.y === 0 || space.x === 0)
                            {
                                if (this.pieces[move.to.getSquare()].name === ROOK)
                                {
                                    console.log('check by rook');
                                    return true;
                                }
                            }
                            else
                            {
                                if (this.pieces[move.to.getSquare()].name === BISHOP)
                                {
                                    console.log('check by bishop');
                                    return true;
                                }
                            }
                        }
                    }
                    break;
                }
                spaceNumber++;
            }
            move.goToOrigin();
        }

        return false;
    }
}