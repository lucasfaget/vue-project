import Square, { WHITE, BLACK, MIN, MAX, INDEXES, COLS, LINES } from './square.js';

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

/* Move types */
export const DEFAULT = 'D';
export const EN_PASSANT = 'E.P';
export const PROMOTION = 'P(Q)';
export const CASTLING_KINGSIDE = 'O-O';
export const CASTLING_QUEENSIDE = 'O-O-O';

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

    isEmpty(squareName)
    {
        return this.pieces[squareName] === EMPTY;
    }
    isCapturable(squareName, currentPlayer)
    {
        return !this.isEmpty(squareName) && this.pieces[squareName].player === 1 - currentPlayer && this.pieces[squareName].name !== KING;
    }
    isMovable(squareName)
    {
        return !this.isEmpty(squareName) && Object.keys(this.pieces[squareName].legalMoves).length !== 0;
    }
    isLegal(from, to)
    {
        return this.pieces[from].legalMoves[to] !== undefined;
    }

    isOccupiedBy(squareName, player, name)
    {
        return !this.isEmpty(squareName) && this.pieces[squareName].name === name && this.pieces[squareName].player === player;
    }

    findPieceSquareName(player, name)
    {
        for (const squareName in this.pieces)
        {
            if (!this.isEmpty(squareName) && this.pieces[squareName].name === name && this.pieces[squareName].player === player)
            {
                return squareName;
            }
        }

        return undefined;
    }
    getMoveName(from, to)
    {
        return this.pieces[from].legalMoves[to];
    }

    recordLegalMove(from, to, moveName = DEFAULT)
    {
        this.pieces[from].legalMoves[to] = moveName;
    }
    move(from, to, moveName = DEFAULT)
    { 
        /* Save move data */
        let move = {
            from: from,
            to: to,
            moveName: moveName,
            capturedPiece: this.pieces[to]
        }

        /* Update chessboard */
        this.pieces[move.to] = this.pieces[move.from];
        this.pieces[move.to].moveCount++;
        this.pieces[move.from] = EMPTY;

        this.moves.push(move);
    }
    cancelLastMove()
    {
        let move = this.moves.pop();

        /* Update chessboard */
        this.pieces[move.from] = this.pieces[move.to];
        this.pieces[move.from].moveCount--;
        this.pieces[move.to] = move.capturedPiece;
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
    isCheckedIfMoving(player, square, moveName = DEFAULT)
    {
        this.move(square, moveName);
        let isChecked = this.isChecked(player);
        this.cancelLastMove();

        return isChecked;
    }

    calculateAllMoves(player)
    {
        this.resetLegalMoves();

        for (const [squareName, piece] of Object.entries(this.pieces))
        {
            if (piece !== EMPTY)
            {
                if (piece.player === player)
                {
                    let square = new Square(Square.getColIndex(squareName), Square.getLineIndex(squareName));

                    if (piece.name === PAWN)
                    {
                        /* Testing move forward */
                        let space = player === WHITE ? UP : DOWN;
                        /* Once */
                        if (square.moveOneSpace(space) && this.isEmpty(square.getName()))
                        {
                            if (!this.isCheckedIfMoving(player, squareName, square.getName()))
                            {
                                this.recordLegalMove(squareName, square.getName());
                            }

                            /* Twice */
                            if (this.pieces[squareName].moveCount === 0)
                            {
                                if (square.moveOneSpace(space) && this.isEmpty(square.getName()))
                                {
                                    if (!this.isCheckedIfMoving(player, squareName, square.getName()))
                                    {
                                        this.recordLegalMove(squareName, square.getName());
                                    }
                                }
                            }
                        }
                        square.goToOrigin();

                        /* Testing diagonal capture */
                        let spaces = player === WHITE ? [UP_LEFT, UP_RIGHT] : [DOWN_LEFT, DOWN_RIGHT];
                        spaces.forEach((space) => {
                            if (square.moveOneSpace(space) && this.isCapturable(square.getName(), player))
                            {
                                if (!this.isCheckedIfMoving(player, squareName, square.getName()))
                                {
                                    this.recordLegalMove(squareName, square.getName());
                                }
                            }
                            square.goToOrigin();
                        });

                        /* Testing en passant capture */
                        let enPassantLine = player === WHITE ? WHITE_EN_PASSANT_LINE : BLACK_EN_PASSANT_LINE;
                        if (square.x0 === enPassantLine)
                        {
                            for (const space of [LEFT, RIGHT])
                            {
                                if (square.moveOneSpace(space) &&
                                    this.isOccupiedBy(square.getName(), 1-player, PAWN) &&
                                    this.pieces[square.getName()].moveCount === 1 &&
                                    this.moves[this.moves.length-1].to === square.getName())
                                {
                                    square.moveOneSpace(UP);
                                    if (this.isEmpty(square.getName()))
                                    {
                                        if (!this.isCheckedIfMoving(player, squareName, square.getName(), EN_PASSANT))
                                        {
                                            this.recordLegalMove(squareName, square.getName(), EN_PASSANT);
                                        }
                                    } 
                                }
                                square.goToOrigin();
                            }
                        }        
                    }
                    else if (piece.name === KNIGHT)
                    {
                        KNIGHT_SPACES.forEach((space => {
                            if (square.moveOneSpace(space))
                            {
                                if (this.isEmpty(square.getName()) || this.isCapturable(square.getName(), player))
                                {
                                    if (!this.isCheckedIfMoving(player, squareName, square.getName()))
                                    {
                                        this.recordLegalMove(squareName, square.getName());
                                    }
                                }
                            }
                            square.goToOrigin();
                        })); 
                    }
                    else if (piece.name === KING)
                    {
                        ROYALTY_SPACES.forEach((space => {
                            if (square.moveOneSpace(space))
                            {
                                if (this.isEmpty(square.getName()) || this.isCapturable(square.getName(), player))
                                {
                                    if (!this.isCheckedIfMoving(player, squareName, square.getName()))
                                    {
                                        this.recordLegalMove(squareName, square.getName());
                                    }
                                }
                            }
                            square.goToOrigin();
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
                            while (square.moveOneSpace(space))
                            {
                                if (this.isEmpty(square.getName()))
                                {
                                    if (!this.isCheckedIfMoving(player, squareName, square.getName()))
                                    {
                                        this.recordLegalMove(squareName, square.getName())
                                    }
                                }
                                else
                                {
                                    if (this.isCapturable(square.getName(), player))
                                    {
                                        if (!this.isCheckedIfMoving(player, squareName, square.getName()))
                                        {
                                            this.recordLegalMove(squareName, square.getName())
                                        }
                                    }
                                    break;
                                }
                            }
                            square.goToOrigin();
                        }));
                    }
                }            
            }
        }
    }

    isChecked(player)
    {
        /* Locate the king */
        let kingSquare = this.findPieceSquareName(player, KING);

        let square = new Square(Square.getColIndex(kingSquare), Square.getLineIndex(kingSquare));

        /* Test if the player is checked by a pawn or a pawn */
        let spaces = player === WHITE ? [UP_LEFT, UP_RIGHT] : [DOWN_LEFT, DOWN_RIGHT];
        for (const space of spaces)
        {
            if (square.moveOneSpace(space) && this.isOccupiedBy(square.getName(), 1-player, PAWN))
            {
                return true;
            }
            square.goToOrigin();
        }

        /* Test if the player is checked by a knight */
        for (const space of KNIGHT_SPACES)
        {
            if (square.moveOneSpace(space) && this.isOccupiedBy(square.getName(), 1-player, KNIGHT))
            {
                return true;
            }
            square.goToOrigin();
        }

        /* Test if the player is checked by a bishop or a rook or a queen or a king */
        for (const space of ROYALTY_SPACES)
        {
            let spaceNumber = 1;
            while(square.moveOneSpace(space))
            {
                if (!this.isEmpty(square.getName()))
                {
                    if (this.pieces[square.getName()].player === 1 - player)
                    {
                        if (this.pieces[square.getName()].name === QUEEN)
                        {
                            return true;
                        }
                        else if (spaceNumber === 1 && this.pieces[square.getName()].name === KING)
                        {
                            return true;
                        }
                        else
                        {
                            if (space.y === 0 || space.x === 0)
                            {
                                if (this.pieces[square.getName()].name === ROOK)
                                {
                                    return true;
                                }
                            }
                            else
                            {
                                if (this.pieces[square.getName()].name === BISHOP)
                                {
                                    return true;
                                }
                            }
                        }
                    }
                    break;
                }
                spaceNumber++;
            }
            square.goToOrigin();
        }

        return false;
    }
}