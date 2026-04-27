import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView/index.vue'
import About from '../views/AboutView/index.vue'
import ViewArticles from '../views/ViewArticle/index.vue'
import WriteArticles from '../views/WriteArticle/index.vue'
import Login from '../views/Login/index.vue'
import Register from '../views/SignIn/index.vue'
import UserManagement from '../views/UserManagement/index.vue'
import RoleManagement from '../views/RoleManagement/index.vue'
import MenuManagement from '../views/MenuManagement/index.vue'
import DraftList from '../views/DraftList/index.vue'
import Article from '../views/Articles/index.vue'
import Collection from '@/views/CollectionView/index.vue'
import ScheduledTask from '@/views/ScheduledTask/index.vue'
import UserProfile from '@/views/UserProfile/index.vue'
import FolloweeList from '@/views/FolloweeListView/index.vue'
import FollowerList from '@/views/FollowerListView/index.vue'

Vue.use(VueRouter)

const getToken = () => {
    const token = localStorage.getItem('userToken')
    return token;
}

const routes = [
    {
        path: '/',
        name: 'home',
        component: HomeView,
        meta: { noMenu: false, requireAuth: true },
    },
    {
        path: '/about',
        name: 'about',
        component: About,
        meta: { noMenu: false, requireAuth: true },
    }, {
        path: '/viewArticles',
        name: 'viewArticles',
        component: ViewArticles,
        meta: { noMenu: false, requireAuth: true },
    }, {
        path: '/writeArticles',
        name: 'writeArticles',
        component: WriteArticles,
        meta: { noMenu: false, requireAuth: true },
    }, {
        path: '/draftList',
        name: 'draftList',
        component: DraftList,
        meta: { noMenu: false, requireAuth: true },
    },
    {
        path: '/login',
        name: 'login',
        component: Login,
        meta: { noMenu: true, requireAuth: false },
    }, {
        path: '/signin',
        name: 'signin',
        component: Register,
        meta: { noMenu: true, requireAuth: false }
    }, {
        path: '/userManagement',
        name: 'userManagement',
        component: UserManagement,
        meta: { noMenu: false, requireAuth: true },
    }, {
        path: '/roleManagement',
        name: 'roleManagement',
        component: RoleManagement,
        meta: { noMenu: false, requireAuth: true },
    }, {
        path: '/menuManagement',
        name: 'menuManagement',
        component: MenuManagement,
        meta: { noMenu: false, requireAuth: true },
    },
    {
        path: '/article',
        name: 'article',
        component: Article,
        meta: { noMenu: false, requireAuth: true },
    }, {
        path: '/collection',
        name: 'collection',
        component: Collection,
        mate: { noMenu: false, requireAuth: true },
    }, {
        path: '/scheduledTask',
        name: 'scheduledTask',
        component: ScheduledTask,
        mate: { noMenu: false, requireAuth: true },
    }, {
        path: '/userProfile',
        name: 'userProfile',
        component: UserProfile,
        mate: { noMenu: false, requireAuth: true },
    }, {
        path: '/followeeList',
        name: 'followeeList',
        component: FolloweeList,
        mate: { noMenu: false, requireAuth: true },
    }, {
        path: '/followerList',
        name: 'followerList',
        component: FollowerList,
        mate: { noMenu: false, requireAuth: true },
    }
]

const router = new VueRouter({
    routes
})


router.beforeEach((to, from, next) => {
    const token = getToken();
    if (to.meta.requireAuth) {
        if (token) {
            // 已登录
            next();
        } else {
            next({ path: '/login' });
            // to.fullPath,记录用户原本想要访问的页面，待成功登录后跳转回原页面
        }
    } else {
        // 无需登录
        next();
    }
})


export default router
