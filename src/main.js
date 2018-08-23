// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import 'common/stylus/base.styl';
import 'common/stylus/common.styl';
import 'common/stylus/icon.css';
import {getCookie, delCookie} from './common/js/cookie';
import Blob from './common/js/excel/Blob.js';
import Export2Excel from './common/js/excel/Export2Excel.js';
// axios 配置
import axios from 'axios';
import store from './vuex/store';
// 日期插件
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.use(ElementUI);

Vue.config.productionTip = false;

if (!getCookie('JD_token') || getCookie('JD_token') === 'undefined') {
  router.push('/login');
}

Vue.prototype.$http = axios;

Vue.prototype.$http.defaults.headers.common['x-access-token'] = getCookie('JD_token') || '';

axios.interceptors.request.use(function (config) {
  // Do something before request is sent
  return config;
}, function (error) {
  // Do something with request error
  return Promise.reject(error);
});

// Add a response interceptor
axios.interceptors.response.use(function (response) {
  if (response.data.code === '0000' || response.data.code === '9012') {
    return response.data.data;
  } else if (response.data.code === '5999') {
    delCookie('JD_token');
    router.push('/login');
  } else {
    console.log(123);
    store.commit('changeHint', true);
    store.commit('changeHintClass', 'errorHint');
    store.commit('changeContent', response.data.message);
    setTimeout(function() {
      store.commit('changeHint', false);
    }, 1000);
    return response.data.message;
  }
  // Do something with response data
}, function (error) {
  // Do something with response error
  return Promise.reject(error);
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
});
