import Vue from 'vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import './assets/global.css';
import App from './App.vue'
import router from './router'
import store from './store'
import { THEME_MODE } from './store/modules/theme'
import { loadCss } from './utils/themeLoader'

Vue.use(ElementUI);

Vue.config.productionTip = false

const savedTheme = localStorage.getItem('theme_mode') || THEME_MODE.LIGHT;
if (savedTheme === THEME_MODE.LIGHT) {
  loadCss('/css/light.css', 'theme-light');
} else {
  loadCss('/css/dark.css', 'theme-dark');
}

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
