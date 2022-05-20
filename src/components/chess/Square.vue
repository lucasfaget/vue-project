<script>
    export const EMPTY = null;

    export default
    {
        props: ['line', 'col', 'square', 'is-legal'],
        computed: {
            empty() {
                return this.square === EMPTY
            },
            squareColor() {
                return this.line % 2 === 0 ? this.col % 2 === 0 ? 'dark-brown' : 'light-brown' : this.col % 2 === 0 ? 'light-brown' : 'dark-brown';
            },
            playerColor() {
                return this.empty ? '' : this.square.player === 0 ? 'white' : 'black';
            },
            image()
            {
                return this.empty ? '' : { 
                    backgroundImage: 'url(src/assets/chess/' + this.playerColor + '/' + this.square.name + '.svg)',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: 'contain',
                };
            }
        }
    }
</script>

<template>
    <div class="square" :class="[{ 'is-legal': isLegal }, squareColor]">
        <div class="image" :style="image" draggable="true">
            {{ 8*col + line }}
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
