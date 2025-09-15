import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'
import About from '../views/AboutView.vue'
import ViewArticles from '../views/ViewArticle.vue'
import WriteArticles from '../views/WriteArticle.vue'
import Login from '../views/Login.vue'
import Register from '../views/SignIn.vue'
import UserManagement from '../views/userManagement.vue'
import RoleManagement from '../views/roleManagement.vue'
import MenuManagement from '../views/menuManagement.vue'
import DraftList from '../views/draftList.vue'
import Article from '../views/Articles.vue'

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'home',
        component: HomeView,
        meta: { noMenu: false },
    },
    {
        path: '/about',
        name: 'about',
        component: About,
        meta: { noMenu: false },
    }, {
        path: '/viewArticles',
        name: 'viewArticles',
        component: ViewArticles,
        meta: { noMenu: false },
    }, {
        path: '/writeArticles',
        name: 'writeArticles',
        component: WriteArticles,
        meta: { noMenu: false },
    }, {
        path: '/draftList',
        name: 'draftList',
        component: DraftList,
        meta: { noMenu: false },
    },
    {
        path: '/login',
        name: 'login',
        component: Login,
        meta: { noMenu: true },
    }, {
        path: '/signin',
        name: 'signin',
        component: Register,
        meta: { noMenu: true }
    }, {
        path: '/userManagement',
        name: 'userManagement',
        component: UserManagement,
        meta: { noMenu: false },
    }, {
        path: '/roleManagement',
        name: 'roleManagement',
        component: RoleManagement,
        meta: { noMenu: false },
    }, {
        path: '/menuManagement',
        name: 'menuManagement',
        component: MenuManagement,
        meta: { noMenu: false },
    },
    {
        path: '/article',
        name: 'article',
        component: Article,
        meta: { noMenu: false },
    }
]

const router = new VueRouter({
    routes
})

export default router
