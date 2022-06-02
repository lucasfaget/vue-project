<script>
    import Square from './square.js';

    export default
    {
        props: ['square', 'piece', 'is-legal'],
        computed: {
            empty() {
                return this.piece === null
            },
            squareColor() {
                return Square.getColIndex(this.square) % 2 === 0 ? Square.getLineIndex(this.square) % 2 === 0 ? 'dark-brown' : 'light-brown' : Square.getLineIndex(this.square) % 2 === 0 ? 'light-brown' : 'dark-brown';
            },
            playerColor() {
                return this.empty ? '' : this.piece.player === 0 ? 'white' : 'black';
            },
            pieceImage()
            {
                return this.empty ? '' : { 
                    backgroundImage: 'url(src/assets/chess/' + this.playerColor + '/' + this.piece.name + '.svg)',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: 'contain',
                };
            }
        }
    }
</script>

<template>
    <div class="square" :class="[{ 'is-legal': isLegal }, squareColor]">
        <div class="image" :style="pieceImage" draggable="true">
            {{ square }}
        </div>
    </div>
</template>

<style scoped>
    .image
    {
        height: 100%;
        width: 100%;
    }

    .light-brown
    {
        background-color: wheat;
    }

    .dark-brown
    {
        background-color: burlywood;
    }

    .is-legal
    {
        opacity: 0.7;
    }
</style>
