<script>
    import Square from './square.js';
    import ChessSquare from './ChessSquare.vue';

    export const MIN = 0;
    export const MAX = 7;

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

    export const EMPTY = null;

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


    export default
    {
        components: { ChessSquare },
        data() {
            return {
                cols: [...INDEXES],
                lines: [...INDEXES].reverse(),
                chessboard: [],
                moves : [],
                currentIndex: null
            }
        },
        created() {
            /* Setup chessboard */
            for (let col = MIN ; col <= MAX ; col++)
            {
                for (let line = MIN ; line <= MAX ; line++)
                {
                    this.chessboard.push(
                        line < MIN + 2 || line > MAX - 2 ?
                        {
                            player: line < MIN + 2 ? WHITE : BLACK,
                            name: line === MIN || line === MAX ? NAMES[col] : PAWN,
                            wasMoved: false,
                            moveIndexes: []
                        }
                        : EMPTY
                    );
                }
            }
        },
        mounted() {
            this.calculateLegalMoves(WHITE);
        },
        methods: {
            isEmptySquare(index)
            {
                return this.chessboard[index] === EMPTY;
            },
            isCapturableSquare(index, player)
            {
                return !this.isEmptySquare(index) && this.chessboard[index].player !== player && this.chessboard[index].name !== KING;
            },
            isMovableSquare(index)
            {
                return !this.isEmptySquare(index) && this.chessboard[index].moveIndexes.length !== 0;
            },
            isLegalSquare(index)
            {
                return this.currentIndex !== null && this.chessboard[this.currentIndex].moveIndexes.includes(index);
            },
            isOccupiedBySquare(index, player, name)
            {
                return !this.isEmptySquare(index) && this.chessboard[index].name === name && this.chessboard[index].player === player;
            },

            findPlayerPieceIndex(player, name)
            {
                for (const index in this.chessboard)
                {
                    if (!this.isEmptySquare(index) && this.chessboard[index].name === name && this.chessboard[index].player === player)
                    {
                        return index;
                    }
                }

                return undefined;
            },

            move(chessboard, fromIndex, toIndex)
            {
                chessboard[toIndex] = chessboard[fromIndex];
                chessboard[toIndex].wasMoved = true;
                chessboard[fromIndex] = EMPTY;
            },
            resetMovesIndexes()
            {
                this.chessboard.forEach(piece => {
                    if (piece !== EMPTY)
                    {
                        piece.moveIndexes = [];
                    }
                })
            },

            calculateLegalMoves(player)
            {
                this.chessboard.forEach((piece, index) =>
                {
                    if (piece !== EMPTY)
                    {
                        if (piece.player === player)
                        {
                            let square = new Square(Math.trunc(index / 8), Math.trunc(index % 8));
                            if (piece.name === PAWN)
                            {
                                /* Testing move forward */
                                let space = player === WHITE ? UP : DOWN;
                                /* Once */
                                if (square.moveOneSpace(space) && this.isEmptySquare(square.getIndex()))
                                {
                                    this.chessboard[index].moveIndexes.push(square.getIndex());

                                    /* Twice */
                                    if (!this.chessboard[index].wasMoved)
                                    {
                                        if (square.moveOneSpace(space) && this.isEmptySquare(square.getIndex()))
                                        {
                                            this.chessboard[index].moveIndexes.push(square.getIndex());
                                        }
                                    }
                                }
                                /* Testing diagonal capture */
                                let spaces = player === WHITE ? UP_DIAGONAL_SPACES : DOWN_DIAGONAL_SPACES;
                                spaces.forEach((space) => {
                                    square.goBackOrigin();
                                    if (square.moveOneSpace(space) && this.isCapturableSquare(square.getIndex(), player))
                                    {
                                        this.chessboard[index].moveIndexes.push(square.getIndex());
                                    }
                                });
                            }
                            else if (piece.name === KNIGHT)
                            {
                                KNIGHT_SPACES.forEach((space => {
                                    square.goBackOrigin();
                                    if (square.moveOneSpace(space))
                                    {
                                        if (this.isEmptySquare(square.getIndex()) || this.isCapturableSquare(square.getIndex(), player))
                                        {
                                            this.chessboard[index].moveIndexes.push(square.getIndex());
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
                                        if (this.isEmptySquare(square.getIndex()) || this.isCapturableSquare(square.getIndex(), player))
                                        {
                                            this.chessboard[index].moveIndexes.push(square.getIndex());
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
                                        if (this.isEmptySquare(square.getIndex()))
                                        {
                                            this.chessboard[index].moveIndexes.push(square.getIndex());
                                        }
                                        else
                                        {
                                            if (this.isCapturableSquare(square.getIndex(), player))
                                            {
                                                this.chessboard[index].moveIndexes.push(square.getIndex());
                                            }
                                            break;
                                        }
                                    }
                                }));
                            }
                        }            
                    }
                });
            },

            isChecked(player)
            {
                /* Locate the king */
                let kingIndex = this.findPlayerPieceIndex(player, KING);

                let square = new Square(Math.trunc(kingIndex / 8), Math.trunc(kingIndex % 8));

                /* Test if the player is checked by a pawn or a pawn */
                let spaces = player === WHITE ? UP_DIAGONAL_SPACES : DOWN_DIAGONAL_SPACES;
                for (const space of spaces)
                {
                    if (square.moveOneSpace(space) && this.isOccupiedBySquare(square.getIndex(), 1-player, PAWN))
                    {
                        console.log('check by pawn');
                        return true;
                    }
                    square.goBackOrigin();
                }

                /* Test if the player is checked by a knight */
                for (const space of KNIGHT_SPACES)
                {
                    if (square.moveOneSpace(space) && this.isOccupiedBySquare(square.getIndex(), 1-player, KNIGHT))
                    {
                        console.log('check by knight');
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
                        if (!this.isEmptySquare(square.getIndex()))
                        {
                            if (this.chessboard[square.getIndex()].player === 1 - player)
                            {
                                if (this.chessboard[square.getIndex()].name === QUEEN)
                                {
                                    console.log('check by queen');
                                    return true;
                                }
                                else if (spaceNumber === 1 && this.chessboard[square.getIndex()].name === KING)
                                {
                                    console.log('check by king');
                                    return true;
                                }
                                else
                                {
                                    if (space.y === 0 || space.x === 0)
                                    {
                                        if (this.chessboard[square.getIndex()].name === ROOK)
                                        {
                                            console.log('check by rook');
                                            return true;
                                        }
                                    }
                                    else
                                    {
                                        if (this.chessboard[square.getIndex()].name === BISHOP)
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
                    square.goBackOrigin();
                }

                return false;
            },

            clickSquare(index)
            {
                if (this.isMovableSquare(index))
                {
                    if (this.currentIndex === index)
                    {
                        this.currentIndex = null;
                    }
                    else
                    {
                        this.currentIndex = index;
                    }
                }
                else
                {
                    if (this.isLegalSquare(index))
                    {
                        this.move(this.chessboard, this.currentIndex, index);
                        this.resetMovesIndexes();
                        this.calculateLegalMoves(WHITE);

                        console.log(this.isChecked(WHITE));
                    }
                    this.currentIndex = null;
                }
            }
        }
    }
</script>

<template>
    <div class="chessboard">
        <template v-for="line in lines">
            <template v-for="col in cols" :key="8*col+line">
                <ChessSquare :col="col" :line="line" :piece="chessboard[8*col+line]" :is-legal="isLegalSquare(8*col+line)" @click="clickSquare(8*col+line)"/>
            </template>
        </template>
    </div>
</template>

<style scoped>
    .chessboard
    {
        background-color: #fff;

        display : grid;
        grid-template-columns: repeat(8, 4.5rem);
        grid-template-rows: repeat(8, 4.5rem);
    }
</style>
