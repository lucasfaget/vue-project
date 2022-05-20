<script>
    import Square from './Square.vue';

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

    export const WHITE_PAWN_SPACES = [ { y: 0 , x: 1 } ];
    export const BLACK_PAWN_SPACES = [ { y: 0 , x: -1 } ];
    export const KNIGHT_SPACES = [ { y: -1 , x: -2 } , { y: -2 , x: -1 } , { y: -2 , x: 1 } , { y: -1 , x: 2 } , { y: 1 , x: 2 } , { y: 2 , x: 1 } , { y: 2 , x: -1 } , { y: 1 , x: -2 } ];
    export const BISHOP_SPACES = [ { y: -1 , x: -1 } , { y: -1 , x: 1 } , { y: 1 , x: 1 } , { y: 1 , x: -1 } ];
    export const ROOK_SPACES = [ { y: -1 , x: 0 } , { y: 0 , x: 1 } , { y: 1 , x: 0 } , { y: 0 , x: -1 } ];
    export const ROYALTY_SPACES = [ ...BISHOP_SPACES, ...ROOK_SPACES ];


    export default
    {
        components: { Square },
        data() {
            return {
                cols: [...INDEXES],
                lines: [...INDEXES].reverse(),
                chessboard: [],
                moves : [],
                fromIndex: null
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
                            pawnBoostMoveNumber: null,
                            legalMoves: []
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
            col(index)
            {
                return Math.trunc(index / 8);
            },
            line(index)
            {
                return Math.trunc(index % 8);
            },
            index(col, line)
            {
                return 8*col + line;
            },

            isInChessboard(col, line)
            {
                return (col < MIN || col > MAX || line < MIN || line > MAX) ? false : true;
            },
            isEmptySquare(index)
            {
                return this.chessboard[index] === EMPTY;
            },
            isCapturableSquare(index, player)
            {
                return this.chessboard[index].player !== player && this.chessboard[index].name !== KING;
            },
            hasLegalMove(index)
            {
                return !this.isEmptySquare(index) && this.chessboard[index].legalMoves.length !== 0;
            },
            isLegalMove(index)
            {
                return this.fromIndex !== null && this.chessboard[this.fromIndex].legalMoves.includes(index);
            },

            move(chessboard, fromIndex, toIndex)
            {
                chessboard[toIndex] = chessboard[fromIndex];
                chessboard[toIndex].wasMoved = true;
                chessboard[fromIndex] = EMPTY;
            },
            resetLegalMoves()
            {
                this.chessboard.forEach(square => {
                    if (square !== EMPTY)
                    {
                        square.legalMoves = [];
                    }
                })
            },

            calculateLegalMoves(player)
            {
                this.chessboard.forEach((square, index) =>
                {
                    if (square !== EMPTY)
                    {
                        if (square.player === player)
                        {
                            let col = this.col(index);
                            let line = this.line(index);

                            switch (square.name)
                            {
                                // case PAWN:
                                //     let space = player === WHITE ? WHITE_PAWN_SPACES : BLACK_PAWN_SPACES
                                    
                                //     /* Test one square advance */
                                //     let newIndex = this.index(col + space.y, line + space.x);
                                //     if (this.isInChessboard(newIndex) && this.isEmptySquare(newIndex))
                                //     {
                                //         this.chessboard[index].legalMoves.push(newIndex);

                                //         /* Test two squares advance */
                                //         newIndex = this.index(col + space.y, line + space.x);
                                //         if (this.isInChessboard(newIndex))
                                //         {
                                //             if (!this.chessboard[index].wasMoved && this.isEmptySquare(newIndex))
                                //             {
                                //                 this.chessboard[index].legalMoves.push(newIndex);
                                //             }
                                //         }
                                //     }

                                //     /* Test diagonal capture */
                                //     for (const j of [-1,1])
                                //     {
                                //         newIndex = this.index(col + j, line + space.x)
                                //         if (this.isInChessboard(newIndex) && this.isCapturableSquare(newIndex, player))
                                //         {
                                //             this.chessboard[index].legalMoves.push(newIndex);
                                //         }
                                //     }
                                //     break;
                                // case KNIGHT:
                                //     this.calculateKnightMoves(index, square.player);
                                //     break;
                                // case BISHOP:
                                //     this.calculateBishopMoves(index, piece.player);
                                //     break;
                                // case ROOK:
                                //     this.calculateRookMoves(index, piece.player);
                                //     break;
                                // case QUEEN:
                                //     this.calculateQueenMoves(index, piece.player);
                                //     break;
                                // case KING:
                                //     this.calculateKingMoves(index, piece.player);
                                //     break;
                            }
                        }
                    }
                });
            },

            clickSquare(index)
            {
                if (this.fromIndex === null)
                {
                    if (this.hasLegalMove(index))
                    {
                        this.fromIndex = index;
                    }
                }
                else
                {
                    if (this.isLegalMove(index))
                    {
                        this.move(this.chessboard, this.fromIndex, index);
                        this.resetLegalMoves();
                        this.calculateLegalMoves(WHITE);
                    }
                    this.fromIndex = null;
                }
            }
        }
    }
</script>

<template>
    <div class="chessboard">
        <template v-for="line in lines">
            <template v-for="col in cols" :key="index(col, line)">
                <Square :line="line" :col="col" :square="chessboard[index(col, line)]" :is-legal="isLegalMove(index(col, line))" @click="clickSquare(index(col, line))"/>
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
