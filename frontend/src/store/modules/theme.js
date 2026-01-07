import { loadCss, removeCss } from "@/utils/themeLoader";
import axios from "@/axios";

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
            switch (mode) {
                case THEME_MODE.LIGHT:
                    state.theme = mode
                    state.currentThemeID = 'theme-light'
                    break
                case THEME_MODE.DARK:
                    state.theme = mode
                    state.currentThemeID = 'theme-dark'
                    break
                default:
                    state.theme = THEME_MODE.LIGHT;
                    state.currentThemeID = 'theme-light'
                    break
            }

            const targetConfig = THEME_CONFIG[mode]
            if (!targetConfig) return;


            loadCss(targetConfig.url, targetConfig.id)
            if (state.currentCssId) {
                removeCss(state.currentCssId);
            }

            localStorage.setItem('theme_mode', mode);
        }

    },
    actions: {
        // 初始化主题(远程)
        initTheme() {

        },

        /*
        远程同步
        */
        syncTheme(context,mode) {
            axios.post("/usersetting/", {
                "themeMode": mode
            }).then((res) => {
                console.log(res)
            }).catch((err) => {
                console.log(err)
            })
        }

    },
    getters: {
        currentTheme: state => state.theme,
    }
}

export default themeModule;