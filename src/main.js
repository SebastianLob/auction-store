import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
import '@babel/polyfill'
const axios = require('axios');
axios.defaults.baseURL = 'http://www.sebastian.lob.com.ar/api/';
axios.defaults.timeout = 10000;

Vue.config.productionTip = false

new Vue({
  router,
  store,
  axios,
  vuetify,
  render: h => h(App)
}).$mount('#app')
