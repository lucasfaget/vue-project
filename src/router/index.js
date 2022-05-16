import {createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Chess from '../views/Chess.vue'
import V2048 from '../views/V2048.vue'

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home,
        meta: {
            title: 'Home'
        }
    },
    {
        path: '/chess',
        name: 'Chess',
        component: Chess,
        meta: {
            title: 'Chess'
        }
    },
    {
        path: '/2048',
        name: '2048',
        component: V2048,
        meta: {
            title: '2048'
        }
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

router.afterEach((to) => {
    document.title = to.meta.title;
})

export default router