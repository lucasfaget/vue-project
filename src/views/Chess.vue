<script>
    import Chessboard, { SPIN, FIRST, PREVIOUS, NEXT, LAST, BACK } from '../components/chess/Chessboard.vue';
    import ChessButton from '../components/chess/ChessButton.vue';

    export default {
        components: { Chessboard, ChessButton },
        data() {
            return {
                buttons: [
                    { buttonType: SPIN, tooltipText: "Spin chessboard" },
                    { buttonType: FIRST, tooltipText: "First move" },
                    { buttonType: PREVIOUS, tooltipText: "Previous move" },
                    { buttonType: NEXT, tooltipText: "Next move" },
                    { buttonType: LAST, tooltipText: "Last move" },
                    { buttonType: BACK, tooltipText: "Cancel move" }
                ]
            }
        },
        methods: {
            clickButton(buttonType) {
                switch (buttonType)
                {
                    case SPIN:
                        this.$refs.chessboard.spin();
                        break;  
                    case BACK:
                        this.$refs.chessboard.cancelLastMove();
                        break;
                    default:
                        this.$refs.chessboard.goToMove(buttonType);
                }
            }
        }
    }
</script>

<template>
    <div class="chess">
        <div class="buttons">
            <ChessButton v-for="button in buttons" :key="button.buttonType" :buttonType="button.buttonType" :tooltipText="button.tooltipText" @click="clickButton(button.buttonType)"/>
        </div>
        <div>
            <Chessboard ref="chessboard"/>
        </div>
    </div>
</template>

<style scoped>
    .chess
    {
        background-color: hsl(0,0%,10%);

        min-height: 100vh;

        padding-top: 30px;

        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    .buttons
    {
        background-color: hsl(0,0%,95%);

        width: 36rem;

        display: flex;
        justify-content: center;
    }
</style>