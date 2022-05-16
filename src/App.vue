<script>
    import Navbar from './components/navbar/Navbar.vue'
    export default {
        components: { Navbar },
    }

</script>

<template>
    <header>
        <Navbar />
        <router-view></router-view>
    </header>
</template>

<style>
    @import './assets/base.css';

</style>