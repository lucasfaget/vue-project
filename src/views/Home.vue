<template>
    <body class="home">
        <div class="title">
            HOME.
        </div>
        <div class="buttons">
            <router-link to="/chess" class="router-link">
                <div class="border-button">
                    <div class="button">
                        PLAY CHESS
                    </div>
                </div>
            </router-link>
            <router-link to="/2048" class="router-link">
                <div class="border-button">
                    <div class="button">
                        PLAY 2048
                    </div>
                </div>
            </router-link>
        </div>
    </body>
</template>

<style scoped>

    .home
    {
        background-color: hsl(0,0%,10%);

        min-height: 100vh;

        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    .title
    {
        color: hsl(0,0%,95%);
        font-size: 130px;
        font-family: cursive;
    }

    .buttons
    {
        display: flex;
        flex-direction: column;
        gap: 35px;
    }

    .router-link
    {
        text-decoration: none;
    }

    .border-button
    {
        height: 120px;
        width: 500px;

        padding: 5px;

        border: 5px solid hsl(0,0%,95%);
        border-radius: 100px;
    }

    .button
    {
        /* color: #000;
        background: hsl(0,0%,95%); */
        color: hsl(0,0%,95%);
        background: hsl(0,0%,10%);

        font-size: 30px;

        height: 100%;
        width: 100%;

        border-radius: 100px;

        display: flex;
        justify-content: center;
        align-items: center;
    }

    .router-link:hover .button
    {
        color: #000;
        background: hsl(0,0%,95%);
    }

</style>

