<script>
    
</script>

<template>
    <div class="div-logo">
        <router-link to="/" class="router-link">
            <div class="logo">
                <div>
                    LF
                </div>
            </div>
        </router-link>
    </div>
</template>

<style scoped>

    .router-link
    {
        text-decoration: none;
    }

    .router-link:hover .logo
    {
        background-color: hsl(0,0%,95%);
        color: hsl(0,0%,10%)
    }
    
    .div-logo
    {
        height: 30px;
        width: 30px;

        margin: 8px;
        
        border: 3px solid hsl(0,0%,95%);
    }

    .logo
    {
        color: hsl(0,0%,95%);

        height: 100%;
        width: 100%;

        font-size: 25px;
        /* font-weight: bold; */

        display: flex;
        justify-content: center;
        align-items: center;
    }

</style>
