<script>
    import Square, { MIN, MAX } from './square.js';
    import Board, { INDEXES, WHITE, BLACK } from './board.js';
    import ChessSquare from './ChessSquare.vue';

    export default
    {
        components: { ChessSquare },
        data() {
            return {
                cols: [...INDEXES],
                lines: [...INDEXES].reverse(),
                chessboard: new Board(),
                from: null
            }
        },
        computed: {
            moveNumber() {
                return this.chessboard.moves.length;
            },
            currentPlayer() {
                return this.moveNumber % 2 === 0 ? WHITE : BLACK;
            }
        },
        mounted() {
            this.chessboard.calculateAllMoves(this.currentPlayer);
            console.log(this.chessboard)
        },
        methods: {
            getIndex(col, line)
            {
                return 8*col + line;
            },
            isLegalSquare(index)
            {
                return this.from !== null && this.chessboard.isLegalMove(this.from, index);
            },

            cancelLastMove()
            {
                this.chessboard.cancelLastMove();
                this.chessboard.calculateAllMoves(this.currentPlayer);
            },

            clickSquare(index)
            {
                if (this.chessboard.isMovable(index))
                {
                    if (this.from === index)
                    {
                        this.from = null;
                    }
                    else
                    {
                        this.from = index;
                    }
                }
                else
                {
                    if (this.isLegalSquare(index))
                    {
                        this.chessboard.move(this.from, index, this.chessboard.getMoveType(this.from, index));
                        this.chessboard.calculateAllMoves(this.currentPlayer);

                        console.log(this.chessboard)
                    }
                    this.from = null;
                }
            }
        }
    }
</script>

<template>
    <div class="chessboard">
        <template v-for="line in lines">
            <template v-for="col in cols" :key="getIndex(col, line)">
                <ChessSquare :col="col" :line="line" :piece="chessboard.squares[getIndex(col, line)]" :is-legal="isLegalSquare(getIndex(col, line))" @click="clickSquare(getIndex(col, line))"/>
            </template>
        </template>
        <button @click="cancelLastMove">Cancel move</button>
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
