import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'
import About from '../views/AboutView.vue'
import ViewArticles from '../views/ViewArticle.vue'
import WriteArticles from '../views/WriteArticle.vue'
import Login from '../views/Login.vue'
import Register from '../views/SignIn.vue'

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'home',
        component: HomeView,
        meta: {noMenu: false},
    },
    {
        path: '/about',
        name: 'about',
        component: About,
        meta: {noMenu: false},
    }, {
        path: '/viewArticles',
        name: 'viewArticles',
        component: ViewArticles,
        meta: {noMenu: false},
    }, {
        path: '/writeArticles',
        name: 'writeArticles',
        component: WriteArticles,
        meta: {noMenu: false},
    },
    {
        path: '/login',
        name: 'login',
        component: Login,
        meta: {noMenu: true},
    }, {
        path: '/signin',
        name: 'signin',
        component: Register,
        meta: {noMenu: true}

    }
]

const router = new VueRouter({
    routes
})

export default router
