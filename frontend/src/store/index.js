import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

// 定义仓库内容
const store = new Vuex.Store({
    state: {
        count: 0
    },
    // 同步方法
    mutations: {
        increment(state, payload) {
            state.count += payload.num || 1
        },
        setCount(state, data) {
            state.count = data.count
        },
        setArticle(state, article) {
            state.Article = article;
            localStorage.setItem("article", JSON.stringify(state.Article));
        }
    },
    // 异步方法
    actions: {
        async fetchCount(context) {
            const res = await new Promise(resolve => {
                setTimeout(() => {
                    resolve({ count: 666 })
                }, 1000)
            })
            context.commit('setCount', res)
        },
        saveArticle({ commit }, article) {
            commit('setArticle', article);
        }
    },
    getters: {
        doubleCount: state => state.count * 2,
        //获取状态的方法
        getArticle(state) {
            return state.Article;
        }
    }
})

export default store