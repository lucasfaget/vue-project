<script>
    import Square, { WHITE, BLACK, COLS, LINES } from './square.js';
    import Board from './board.js';
    import ChessSquare from './ChessSquare.vue';

    export default
    {
        components: { ChessSquare },
        data() {
            return {
                cols: [...COLS],
                lines: [...LINES].reverse(),
                chessboard: new Board(),
                currentMove: {
                    from: null,
                    to: null,
                }
            }
        },
        computed: {
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
                return this.chessboard.moves.length;
            },
            currentPlayer() {
                return this.moveCount % 2 === 0 ? WHITE : BLACK;
            }
        },
        mounted() {
            this.chessboard.calculateAllMoves(this.currentPlayer);
            console.log(this.chessboard)
        },
        methods: {
            move()
            {
                this.chessboard.move(this.currentMove.from, this.currentMove.to, this.chessboard.getMoveName(this.currentMove.from, this.currentMove.to));
                this.currentMove.to = null;
                this.chessboard.calculateAllMoves(this.currentPlayer);
            },
            isLegalSquare(square)
            {
                return this.currentMove.from !== null && this.chessboard.isLegal(this.currentMove.from, square);
            },
            clickSquare(square)
            {
                if (this.chessboard.isMovable(square))
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
                    if (this.currentMove.from !== null && this.chessboard.isLegal(this.currentMove.from, square))
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
            <ChessSquare :square="square" :piece="chessboard.pieces[square]" :is-legal="isLegalSquare(square)" @click="clickSquare(square)"/>
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
