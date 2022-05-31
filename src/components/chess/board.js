import Square, { MIN, MAX } from './square.js';

export const EMPTY = null;

export const WHITE = 0;
export const BLACK = 1;

export const PAWN = 'pawn';
export const KNIGHT = 'knight';
export const BISHOP = 'bishop';
export const ROOK = 'rook';
export const QUEEN = 'queen';
export const KING ='king';

export const NAMES = [ROOK, KNIGHT, BISHOP, QUEEN, KING, BISHOP, KNIGHT, ROOK];
export const INDEXES = [0,1,2,3,4,5,6,7];

export const UP = { y: 0 , x: 1 };
export const UP_RIGHT = { y: 1 , x: 1 };
export const RIGHT = { y: 1 , x: 0 };
export const DOWN_RIGHT = { y: 1 , x: -1 };
export const DOWN = { y: 0 , x: -1 };
export const DOWN_LEFT = { y: -1 , x: -1 };
export const LEFT = { y: -1 , x: 0 };
export const UP_LEFT = { y: -1 , x: 1 };

export const UP_DIAGONAL_SPACES = [ UP_LEFT , UP_RIGHT ];
export const DOWN_DIAGONAL_SPACES = [ DOWN_LEFT , DOWN_RIGHT ];
export const KNIGHT_SPACES = [ { y: -1 , x: -2 } , { y: -2 , x: -1 } , { y: -2 , x: 1 } , { y: -1 , x: 2 } , { y: 1 , x: 2 } , { y: 2 , x: 1 } , { y: 2 , x: -1 } , { y: 1 , x: -2 } ];
export const BISHOP_SPACES = [ UP_LEFT, UP_RIGHT, DOWN_LEFT , DOWN_RIGHT ];
export const ROOK_SPACES = [ UP, RIGHT, DOWN, LEFT ];
export const ROYALTY_SPACES = [ ...BISHOP_SPACES, ...ROOK_SPACES ];

/* Move types */
export const DEFAULT = 'default';
export const MOVE_TWO_SPACES = 'moveTwoSpaces';
export const EN_PASSANT_CAPTURE = 'enPassantCapture';
export const PROMOTION = 'promotion';
export const CASTLING_SHORT = 'castlingShort';
export const CASTLING_LONG = 'castlingLong';

export default class Board
{
    constructor()
    {
        this.squares = [];
        this.setup();
        this.moves = [];
    }
    setup()
    {
        for (let col = MIN ; col <= MAX ; col++)
        {
            for (let line = MIN ; line <= MAX ; line++)
            {
                this.squares.push(
                    line < MIN + 2 || line > MAX - 2 ?
                    {
                        player: line < MIN + 2 ? WHITE : BLACK,
                        name: line === MIN || line === MAX ? NAMES[col] : PAWN,
                        moveCount: 0,
                        legalMoves: {}
                    }
                    : EMPTY
                );
            }
        }
    }

    isEmpty(index)
    {
        return this.squares[index] === EMPTY;
    }
    isCapturable(index, currentPlayer)
    {
        return !this.isEmpty(index) && this.squares[index].player !== currentPlayer && this.squares[index].name !== KING;
    }
    isMovable(index)
    {
        return !this.isEmpty(index) && Object.keys(this.squares[index].legalMoves).length !== 0;
    }
    isLegalMove(from, to)
    {
        return this.squares[from].legalMoves[to] !== undefined;
    }

    isOccupiedBy(index, player, name)
    {
        return !this.isEmpty(index) && this.squares[index].name === name && this.squares[index].player === player;
    }

    findPieceIndex(player, name)
    {
        for (const index in this.squares)
        {
            if (!this.isEmpty(index) && this.squares[index].name === name && this.squares[index].player === player)
            {
                return index;
            }
        }

        return undefined;
    }
    getMoveType(from, to)
    {
        return this.squares[from].legalMoves[to];
    }

    recordLegalMove(from, to, moveType = DEFAULT)
    {
        this.squares[from].legalMoves[to] = moveType;
    }
    move(from, to, moveType = DEFAULT)
    {
        /* Save move data */
        let move = {
            from: from,
            to: to,
            moveType: moveType,
            capturedPiece: this.squares[to]
        }

        /* Update chessboard */
        this.squares[to] = this.squares[from];
        this.squares[to].moveCount++;
        this.squares[from] = EMPTY;
        this.moves.push(move);
    }
    cancelLastMove()
    {
        let lastMove = this.moves.pop();
        if (lastMove !== undefined)
        {
            /* Update chessboard */
            this.squares[lastMove.from] = this.squares[lastMove.to];
            this.squares[lastMove.from].moveCount--;
            this.squares[lastMove.to] = lastMove.capturedPiece;
        }
    }
    resetMovesIndexes()
    {
        this.squares.forEach(piece =>
        {
            if (piece !== EMPTY)
            {
                piece.legalMoves = {};
            }
        });
    }
    isCheckedIfMoving(player, from, to, moveType = DEFAULT)
    {
        this.move(from, to, moveType);
        let isChecked = this.isChecked(player);
        this.cancelLastMove();

        return isChecked;
    }

    calculateAllMoves(player)
    {
        this.resetMovesIndexes();

        this.squares.forEach((piece, index) =>
        {
            if (piece !== EMPTY)
            {
                if (piece.player === player)
                {
                    let square = new Square(Math.trunc(index / 8), Math.trunc(index % 8));
                    let move;

                    if (piece.name === PAWN)
                    {
                        /* Testing move forward */
                        let space = player === WHITE ? UP : DOWN;
                        /* Once */
                        if (square.moveOneSpace(space) && this.isEmpty(square.getIndex()))
                        {
                            if (!this.isCheckedIfMoving(player, index, square.getIndex()))
                            {
                                this.recordLegalMove(index, square.getIndex())
                            }

                            /* Twice */
                            if (this.squares[index].moveCount === 0)
                            {
                                if (square.moveOneSpace(space) && this.isEmpty(square.getIndex()))
                                {

                                    if (!this.isCheckedIfMoving(player, index, square.getIndex(), MOVE_TWO_SPACES))
                                    {
                                        this.recordLegalMove(index, square.getIndex(), MOVE_TWO_SPACES)
                                    }
                                }
                            }
                        }
                        /* Testing diagonal capture */
                        let spaces = player === WHITE ? UP_DIAGONAL_SPACES : DOWN_DIAGONAL_SPACES;
                        spaces.forEach((space) => {
                            square.goBackOrigin();
                            if (square.moveOneSpace(space) && this.isCapturable(square.getIndex(), player))
                            {
                                if (!this.isCheckedIfMoving(player, index, square.getIndex()))
                                {
                                    this.recordLegalMove(index, square.getIndex())
                                }
                            }
                        });
                    }
                    else if (piece.name === KNIGHT)
                    {
                        KNIGHT_SPACES.forEach((space => {
                            square.goBackOrigin();
                            if (square.moveOneSpace(space))
                            {
                                if (this.isEmpty(square.getIndex()) || this.isCapturable(square.getIndex(), player))
                                {
                                    if (!this.isCheckedIfMoving(player, index, square.getIndex()))
                                    {
                                        this.recordLegalMove(index, square.getIndex())
                                    }
                                }
                            }
                        })); 
                    }
                    else if (piece.name === KING)
                    {
                        ROYALTY_SPACES.forEach((space => {
                            square.goBackOrigin();
                            if (square.moveOneSpace(space))
                            {
                                if (this.isEmpty(square.getIndex()) || this.isCapturable(square.getIndex(), player))
                                {
                                    if (!this.isCheckedIfMoving(player, index, square.getIndex()))
                                    {
                                        this.recordLegalMove(index, square.getIndex())
                                    }
                                }
                            }
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
                            square.goBackOrigin();
                            while (square.moveOneSpace(space))
                            {
                                if (this.isEmpty(square.getIndex()))
                                {
                                    if (!this.isCheckedIfMoving(player, index, square.getIndex()))
                                    {
                                        this.recordLegalMove(index, square.getIndex())
                                    }
                                }
                                else
                                {
                                    if (this.isCapturable(square.getIndex(), player))
                                    {
                                        if (!this.isCheckedIfMoving(player, index, square.getIndex()))
                                        {
                                            this.recordLegalMove(index, square.getIndex())
                                        }
                                    }
                                    break;
                                }
                            }
                        }));
                    }
                }            
            }
        });
    }

    isChecked(player)
    {
        /* Locate the king */
        let kingIndex = this.findPieceIndex(player, KING);

        let square = new Square(Math.trunc(kingIndex / 8), Math.trunc(kingIndex % 8));

        /* Test if the player is checked by a pawn or a pawn */
        let spaces = player === WHITE ? UP_DIAGONAL_SPACES : DOWN_DIAGONAL_SPACES;
        for (const space of spaces)
        {
            if (square.moveOneSpace(space) && this.isOccupiedBy(square.getIndex(), 1-player, PAWN))
            {
                // console.log('check by pawn');
                return true;
            }
            square.goBackOrigin();
        }

        /* Test if the player is checked by a knight */
        for (const space of KNIGHT_SPACES)
        {
            if (square.moveOneSpace(space) && this.isOccupiedBy(square.getIndex(), 1-player, KNIGHT))
            {
                // console.log('check by knight');
                return true;
            }
            square.goBackOrigin();
        }

        /* Test if the player is checked by a bishop or a rook or a queen or a king */
        for (const space of ROYALTY_SPACES)
        {
            let spaceNumber = 1;
            while(square.moveOneSpace(space))
            {
                if (!this.isEmpty(square.getIndex()))
                {
                    if (this.squares[square.getIndex()].player === 1 - player)
                    {
                        if (this.squares[square.getIndex()].name === QUEEN)
                        {
                            // console.log('check by queen');
                            return true;
                        }
                        else if (spaceNumber === 1 && this.squares[square.getIndex()].name === KING)
                        {
                            // console.log('check by king');
                            return true;
                        }
                        else
                        {
                            if (space.y === 0 || space.x === 0)
                            {
                                if (this.squares[square.getIndex()].name === ROOK)
                                {
                                    // console.log('check by rook');
                                    return true;
                                }
                            }
                            else
                            {
                                if (this.squares[square.getIndex()].name === BISHOP)
                                {
                                    // console.log('check by bishop');
                                    return true;
                                }
                            }
                        }
                    }
                    break;
                }
                spaceNumber++;
            }
            square.goBackOrigin();
        }

        return false;
    }
}