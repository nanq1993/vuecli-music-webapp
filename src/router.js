import Vue from 'vue'
import Router from 'vue-router'
import home from './views/Home.vue'
import songsheet from "./views/songsheet.vue"
import search from './views/search.vue'

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: home,
      meta: {
        keepAlive: true, // 此组件需要被缓存
      }
    },
    {
      path: '/songsheet/:sheetid/:singerid',
      name: 'songsheet',
      props: true,
      component: songsheet,
      meta: {
        keepAlive: false, // 此组件需要被缓存
      }
    },
    {
      path: '/search',
      name: 'search',
      component: search,
      meta: {
        keepAlive: false, // 此组件需要被缓存
      }
    }
  ],
  scrollBehavior (to, from, savedPosition) {
    return { x: 0, y: 0 }
  }
});
