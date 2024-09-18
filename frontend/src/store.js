import Vue from "vue";
import Vuex from "vuex";
Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        Article:null,
    },
    mutations: {
        setArticle (state, article) {
            state.Article = article;
            localStorage.setItem("article", JSON.stringify(state.Article));
        }
    },
    actions: {
        //定义异步操作
        saveArticle ({ commit }, article) {
            commit('setArticle', article);
        }
    },
    getters: {
        //获取状态的方法
        getArticle (state) {
            return state.Article;
        }
    }
})
