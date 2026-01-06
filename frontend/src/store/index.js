import Vue from 'vue'
import Vuex from 'vuex'
import theme from './modules/theme'

Vue.use(Vuex)

// 定义仓库内容
const store = new Vuex.Store({
    modules: {
        theme
    },
    state: {
    },
    // 同步方法
    mutations: {
        setArticle(state, article) {
            state.Article = article;
            localStorage.setItem("article", JSON.stringify(state.Article));
        }
    },
    // 异步方法
    actions: {
        saveArticle({ commit }, article) {
            commit('setArticle', article);
        }
    },
    getters: {
        //获取状态的方法
        getArticle(state) {
            return state.Article;
        }
    }
})

export default store