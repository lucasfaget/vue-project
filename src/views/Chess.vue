<script>
    import Chessboard from '../components/chess/Chessboard.vue';

    export default {
        components: { Chessboard },
    }
</script>

<template>
    <div class="chess">
        <div clas="main">
            <Chessboard />
        </div>
    </div>
</template>

<style scoped>
    .chess
    {
        background-color: hsl(0,0%,10%);

        min-height: 100vh;

        display: flex;
        justify-content: center;
        align-items: center;
    }
</style>