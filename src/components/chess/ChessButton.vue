<script>
    export default {
        props: ['buttonType', 'tooltipText'],
        computed: {
            buttonImageUrl() {
                return "/src/assets/chess/icons/" + this.buttonType + ".png";
            }
        }
    }
</script>

<template>
    <div class="button">
        <img :src="buttonImageUrl" draggable="false">
        <span class="tooltip">{{ tooltipText }}</span>
    </div>
</template>

<style scoped>
    .button
    {
        display: inline-block;
        padding-block: 1rem;
        padding-inline: 1rem;

        position: relative;
    }

    .button:hover
    {
        cursor: pointer;
        background: hsl(240, 20%, 80%);
    }

    .tooltip
    {
        visibility: hidden;

        color: #fff;
        background-color: #000;

        text-align: center;

        width: 90px;

        margin-left: -50px;
        padding: 5px;

        border-radius: 6px;
        
        position: absolute;
        top: 100%;
        left: 50%;
        z-index: 100;
    }
    
    .tooltip::after
    {
        content: "";

        margin-left: -5px;

        border-width: 5px;
        border-style: solid;
        border-color: transparent transparent #000 transparent;

        position: absolute;
        bottom: 100%;
        left: 50%;
    }
    
    .button:hover > .tooltip
    {
        visibility: visible;
    }
</style>