import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from './api/fetch.js'

Vue.prototype.$ajax = axios

import ViewUI from 'view-design';
import 'view-design/dist/styles/iview.css';
import _ from 'lodash';

Vue.prototype._ = _
Vue.use(ViewUI);

import './assets/styles/gobal.styl'
import './assets/styles/initial.css'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
