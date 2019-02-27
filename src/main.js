import Vue from 'vue'
import Vant from 'vant';
import 'vant/lib/index.css';
import App from './App.vue'
import Axios from 'axios'
import router from './router'
import { Lazyload } from 'vant';

// options 为可选参数，无则不传



Vue.config.productionTip = false;
Vue.prototype.$http=Axios;
Vue.use(Vant);
Vue.use(Lazyload);

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
