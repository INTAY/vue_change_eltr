import Vue from 'vue';
import App from './App.vue';
import VueCookie from 'vue-cookie'
import router from './router';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css'; // 默认主题
import './assets/css/icon.css';
import 'babel-polyfill';
import "./assets/css/color-dark.css"
import '@/styles/index.scss'
import "./common/styles/fontIcons/iconfont.css"
import 'jquery'
import store from './store/index'
import echarts from 'echarts'
import echartsGl from 'echarts-gl'
import 'echarts/map/js/province/jiangsu'
Vue.prototype.$echarts = echarts
Vue.prototype.$echartsGl = echartsGl

//注册滚动条
import HappyScroll from 'vue-happy-scroll'
import 'vue-happy-scroll/docs/happy-scroll.css'
// 注册树形下拉框
import ElSelectTree from 'el-select-tree';

Vue.config.productionTip = false;

Vue.prototype.baidumapak = "9qwy4FpThsg0xcxfn0bOm1S5xkRs8mcj"

Vue.use(ElementUI, {
    size: VueCookie.get('size') || 'small'
});
import permission from './directive/permission'
Vue.use(VueCookie)
Vue.use(permission)
Vue.use(HappyScroll);
Vue.use(ElSelectTree);

//使用钩子函数对路由进行权限跳转
router.beforeEach((to, from, next) => {
    const role = sessionStorage.getItem('ms_username');
    if (!role && to.path !== '/login') {
        next('/login');
    } else if (to.meta.permission) {
        // 如果是管理员权限则可进入，这里只是简单的模拟管理员权限而已
        role === 'admin' ? next() : next('/403');
    } else {
        next();

    }
});

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');