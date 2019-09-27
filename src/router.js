import Vue from 'vue'
import Router from 'vue-router'
import home from './views/Home.vue'
import songsheet from "./views/songsheet.vue"
import search from './views/search.vue'
import collect from './views/collect.vue'

Vue.use(Router);


const originalPush = Router.prototype.push
Router.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
  return originalPush.call(this, location).catch(err => err)
}


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
      },
    },
    {
      path:"/collect",
      name:"collect",
      component:collect,
    }
  ],
  scrollBehavior (to, from, savedPosition) {
    return { x: 0, y: 0 }
  }
});
