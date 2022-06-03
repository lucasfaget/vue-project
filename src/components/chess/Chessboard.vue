<script>
    import { WHITE, BLACK, COLS, LINES } from './square.js';
    import Board from './board.js';
    import ChessSquare from './ChessSquare.vue';

    export const REVERSE_COLS = [...COLS].reverse();
    export const REVERSE_LINES = [...LINES].reverse();

    export default
    {
        components: { ChessSquare },
        data() {
            return {
                board: new Board(),
                isSpun: false,
                currentMove: {
                    from: null,
                    to: null,
                }
            }
        },
        computed: {
            cols() {
                return !this.isSpun ? COLS : REVERSE_COLS; 
            },
            lines()
            {
                return !this.isSpun ? REVERSE_LINES : LINES;
            },
            squaresArray() {
                let squaresArray = [];
                for (const line of this.lines) {
                    for (const col of this.cols) {
                        squaresArray.push(col + line);
                    }
                }
                return squaresArray;
            },
            moveCount() {
                return this.board.moves.length;
            },
            currentPlayer() {
                return this.moveCount % 2 === 0 ? WHITE : BLACK;
            }
        },
        mounted() {
            this.board.calculateAllMoves(this.currentPlayer);
            console.log(this.board)
        },
        methods: {
            spin()
            {
                this.isSpun = !this.isSpun;
            },
            goToAnotherMove()
            {

            },

            move()
            {
                this.board.move(this.currentMove.from, this.currentMove.to, this.board.getMoveName(this.currentMove.from, this.currentMove.to));
                this.currentMove.to = null;
                this.board.calculateAllMoves(this.currentPlayer);
            },
            cancelLastMove()
            {
                if (this.moveCount > 0)
                {
                    this.board.cancelLastMove();
                    this.board.calculateAllMoves(this.currentPlayer);
                }
            },

            isLegalSquare(square)
            {
                return this.currentMove.from !== null && this.board.isLegal(this.currentMove.from, square);
            },
            clickSquare(square)
            {
                if (this.board.isMovable(square))
                {
                    if (this.currentMove.from === square)
                    {
                        this.currentMove.from = null;
                    }
                    else
                    {
                        this.currentMove.from = square;
                    }
                }
                else
                {
                    if (this.currentMove.from !== null && this.board.isLegal(this.currentMove.from, square))
                    {
                        this.currentMove.to = square;
                        this.move();
                    }
                    this.currentMove.from = null;
                }
            }
        }
    }
</script>

<template>
    <div class="chessboard">
        <template v-for="square in squaresArray" :key="square">
            <ChessSquare :square="square" :piece="board.pieces[square]" :is-legal="isLegalSquare(square)" @click="clickSquare(square)" />
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
