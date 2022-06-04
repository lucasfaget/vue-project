<script>
    import { WHITE, BLACK, COLS, LINES } from './square.js';
    import Board from './board.js';
    import ChessSquare from './ChessSquare.vue';

    export const REVERSE_COLS = [...COLS].reverse();
    export const REVERSE_LINES = [...LINES].reverse();

    export const SPIN = 'spin';
    export const FIRST = 'first';
    export const PREVIOUS = 'previous';
    export const NEXT = 'next';
    export const LAST = 'last';
    export const BACK = 'back';

    export default
    {
        components: { ChessSquare },
        data() {
            return {
                board: new Board(),
                isSpun: false,
                currentMoveNumber: 0,
                currentMove: { from: null, to: null },
            }
        },
        watch: {
            moveCount(moveCount) {
                this.currentMoveNumber = moveCount;
                this.currentMove.from = null;
                this.currentMove.to = null;
                this.board.calculateAllMoves(this.currentPlayer);
            },
            currentMoveNumber(currentMoveNumber)
            {
                if (currentMoveNumber !== this.moveCount)
                {
                    this.currentMove.from = null;
                    this.currentMove.to = null;
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
        },
        methods: {
            spin()
            {
                this.isSpun = !this.isSpun;
            },
            goToMove(buttonType)
            {
                switch (buttonType)
                {
                    case FIRST:
                        while (this.currentMoveNumber !== 0)
                        {
                            this.board.undoMove(this.board.moves[--this.currentMoveNumber]);
                        }
                        break;
                    case PREVIOUS:
                        if (this.currentMoveNumber !== 0)
                        {
                            this.board.undoMove(this.board.moves[--this.currentMoveNumber]);
                        }
                        break;
                    case NEXT:
                        if (this.currentMoveNumber !== this.moveCount)
                        {
                            this.board.move(this.board.moves[this.currentMoveNumber++]);
                        }
                        break;
                    case LAST:
                        while (this.currentMoveNumber !== this.moveCount)
                        {
                            this.board.move(this.board.moves[this.currentMoveNumber++]);
                        }
                        break;
                }
            },

            move()
            {
                let move = this.board.setMove(
                    this.currentMove.from,
                    this.currentMove.to,
                    this.board.getMoveName(this.currentMove.from, this.currentMove.to)
                );
                this.board.move(move);
                this.board.saveMove(move);
            },
            cancelLastMove()
            {
                if (this.currentMoveNumber === this.moveCount && this.moveCount > 0)
                {
                    this.board.cancelLastMove();
                }
            },

            isLegal(square)
            {
                return this.currentMoveNumber === this.moveCount && this.currentMove.from !== null && this.board.isLegal(this.currentMove.from, square);
            },
            clickSquare(square)
            {
                if (this.currentMoveNumber === this.moveCount)
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
                        if (this.isLegal(square))
                        {
                            this.currentMove.to = square;
                            this.move();
                        }
                        else
                        {
                            this.currentMove.from = null;
                        }
                    }
                }
            }
        }
    }
</script>

<template>
    <div class="chessboard">
        <template v-for="square in squaresArray" :key="square">
            <ChessSquare :square="square" :piece="board.pieces[square]" :is-legal="isLegal(square)" @click="clickSquare(square)" />
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
