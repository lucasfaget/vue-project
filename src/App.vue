<script>
    import Navbar from './components/Navbar.vue'
    import C2048 from './components/C2048.vue'
    export default {
        components: { Navbar, C2048 },
    }

</script>

<template>
    <header>
        <Navbar />
    </header>
    <div>
        <C2048 />
    </div>
</template>

<style>
    @import './assets/base.css';

</style>