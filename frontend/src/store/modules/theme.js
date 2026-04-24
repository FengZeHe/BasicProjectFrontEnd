import { loadCss, removeCss } from "@/utils/themeLoader";
import axios from "axios";

//定义主题模式常量
export const THEME_MODE = {
    LIGHT: 'light',
    DARK: 'dark'
}


const THEME_CONFIG = {
    [THEME_MODE.LIGHT]: {
        url: '/css/light.css',
        id: 'theme-light'
    },
    [THEME_MODE.DARK]: {
        url: '/css/dark.css',
        id: 'theme-dark'
    }
}


// 开启命名空间
const themeModule = {
    namespaced: true,
    state: {
        theme: localStorage.getItem('theme_mode') || THEME_MODE.LIGHT,
        currentThemeID: ''
    },
    mutations: {
        // 本地修改主题 { mode, cssId }
        SET_THEME(state, mode) {
            const targetConfig = THEME_CONFIG[mode]
            if (!targetConfig) return;

            // 先移除旧主题CSS
            if (state.currentThemeID) {
                removeCss(state.currentThemeID);
            }

            // 再加载新主题CSS
            loadCss(targetConfig.url, targetConfig.id)

            // 更新状态并给body添加类名
            switch (mode) {
                case THEME_MODE.LIGHT:
                    state.theme = mode
                    state.currentThemeID = 'theme-light'
                    document.body.classList.remove('dark')
                    document.body.classList.add('light')
                    break
                case THEME_MODE.DARK:
                    state.theme = mode
                    state.currentThemeID = 'theme-dark'
                    document.body.classList.remove('light')
                    document.body.classList.add('dark')
                    break
                default:
                    state.theme = THEME_MODE.LIGHT
                    state.currentThemeID = 'theme-light'
                    document.body.classList.remove('dark')
                    document.body.classList.add('light')
                    break
            }

            localStorage.setItem('theme_mode', mode);
        }

    },
    actions: {
        // 初始化主题(远程)
        initTheme({ state, commit }) {
            const savedTheme = localStorage.getItem('theme_mode') || THEME_MODE.LIGHT
            commit('SET_THEME', savedTheme)
        },

        /*
        远程同步
        */
        syncTheme(context, mode) {
            axios.post("/usersetting/", {
                "themeMode": mode
            }).then((res) => {
                console.log(res)
            }).catch((err) => {
                console.log(err)
            });
        }

    },
    getters: {
        currentTheme: state => state.theme,
    }
}

export default themeModule;
