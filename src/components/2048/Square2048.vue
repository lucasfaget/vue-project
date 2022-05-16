<script>
    export const ARTHAUD = 'arthaud';
    export const POUTOU = 'poutou';
    export const HIDALGO = 'hidalgo';
    export const DUPONT_AIGNAN = 'dupont-aignan';
    export const ROUSSEL = 'roussel';
    export const LASSALLE = 'lassalle';
    export const JADOT = 'jadot';
    export const PECRESSE = 'pecresse';
    export const ZEMMOUR = 'zemmour';
    export const MELENCHON = 'melenchon';
    export const LE_PEN = 'le-pen';
    export const MACRON = 'macron';


    export default {
        props: {
            value: Number
        },
        computed: {
            empty() {
                return this.value === 0
            },
            name() {
                switch (this.value)
                {
                    case 1:
                        return ARTHAUD;
                    case 2:
                        return POUTOU;
                    case 4:
                        return HIDALGO;
                    case 8:
                        return DUPONT_AIGNAN;
                    case 16:
                        return ROUSSEL;
                    case 32:
                        return LASSALLE;
                    case 64:
                        return JADOT;
                    case 128:
                        return PECRESSE;
                    case 256:
                        return ZEMMOUR;
                    case 512:
                        return MELENCHON;
                    case 1024:
                        return LE_PEN;
                    case 2048:
                        return MACRON;
                    default:
                        return null;
                }
            },
            background() {
                return this.empty ? { 'background-color': 'hsl(0, 0%, 95%)' } : { 'background-image': 'url(src/assets/2048/' + this.name + '.png)' }; 
            }
        }
    }
</script>

<template>
    <div class="square" :style="background">

    </div>
</template>

<style scoped>
    .square
    {
        background-size: 100%;

        border-radius: 15px;
    }
</style>
