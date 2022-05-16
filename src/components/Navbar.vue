<script>
    import Logo from './Logo.vue'

    export default {
        components: { Logo },
        data() {
            return {
                isMobileNavOpen: false,
                navList: ["home", "chess", "2048"]
            }
        },
        methods: {
            toogleNav() {
                this.isMobileNavOpen = !this.isMobileNavOpen;
            }
        }
    }
</script>

<template>
    <div class="header">
        
        <Logo />

        <div class="mobile-nav-toggle nav-icon" @click="toogleNav" :aria-expanded="isMobileNavOpen">
            <div></div>
        </div>

        <nav>
            <ul class="nav-ul" :aria-expanded="isMobileNavOpen">
                <li v-for="(item, index) in navList" :key="index" class="nav-li">
                    <a href="/">
                        {{ item }}
                    </a>
                </li>
            </ul>
        </nav>
    </div>
</template>

<style scoped>

    .header
    {
        background: hsl(0, 0%, 0%);

        width: 100vw;

        border-bottom: 2px dotted white;

        display: flex;
        gap: var(--gap, 3rem);
        align-items: center;
        justify-content: space-between;

        position: absolute;
        top: 0;
        left: 0;
        z-index: 1000;
    }

    .nav-ul
    {
        list-style: none;

        padding: 0;
        margin: 0;
        padding-inline: 2rem;

        display: flex;
        gap: var(--gap, 3rem);
    }

    .nav-li
    {
        text-transform: uppercase;
    }

    .nav-li:hover
    {
        border-bottom: 3px solid white;
    }

    .nav-li > a
    {
        color: white;
        text-decoration: none;
    }

    .mobile-nav-toggle
    {
        cursor: pointer;
        display: none;
    }

    @media (min-width: 35em)
    {
        .nav-li
        {
            align-self: center;
        }
    }

    @media (max-width: 35em)
    {
        .nav-ul
        {
            background: hsla(0, 0%, 25%, 0.5);
            backdrop-filter: blur(1rem);

            --gap: 1.5rem;
            flex-direction: column;
            padding-block: 2rem;

            position: fixed;
            inset: 0 -70% 0 100%;

            transform: translateX(0%);
            transition: transform 350ms ease-in;
        }

        .nav-ul[aria-expanded="true"]
        {
            transform: translateX(-100%);
        }

        .mobile-nav-toggle
        {
            display: block;

            position: absolute;
            top: 0.35rem;
            right: 0.75rem;
            z-index: 9999;
        }
    }

    /* Nav icon */

    .nav-icon
    {
        width: 30px;
    }

    .nav-icon:before, .nav-icon:after, .nav-icon > div
    {
        content: '';

        background-color: #fff;

        height: 3px;
        margin: 7px 0;

        border-radius: 5px;

        display: block;

        transition: all .2s ease-in-out;
    }

    .nav-icon[aria-expanded="true"]:before
    {
        transform: translateY(10px) rotate(135deg);
    }
    
    .nav-icon[aria-expanded="true"]:after
    {
        transform: translateY(-10px) rotate(-135deg);
    }
    
    .nav-icon[aria-expanded="true"] > div
    {
        transform: scale(0);
    }

</style>
