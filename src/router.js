import Vue from 'vue'
import Router from 'vue-router'
import home from './views/home.vue'
import songsheet from "./views/songsheet.vue"

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: home
    },
    {
      path: '/songsheet/:sheetid/:singerid',
      name: 'songsheet',
      props: true,
      component: songsheet,
    }
  ]
});
