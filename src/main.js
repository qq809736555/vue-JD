// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import 'common/stylus/base.styl';
import 'common/stylus/common.styl';
import 'common/stylus/icon.css';
import {getCookie, delCookie} from './common/js/cookie';
import './common/js/excel/Blob.js';
import './common/js/excel/Export2Excel.js';
// axios 配置
import axios from 'axios';
import store from './vuex/store';
// 日期插件
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import qs from 'qs';

Vue.use(ElementUI);

Vue.config.productionTip = false;

if (!getCookie('JD_token') || getCookie('JD_token') === 'undefined') {
  router.push('/login');
}

Vue.prototype.$http = axios;
Vue.prototype.$qs = qs;
Vue.prototype.$http.defaults.headers.common['x-access-token'] = getCookie('JD_token') || '';

let reaponseNum = 0;
axios.interceptors.request.use(function (config) {
  reaponseNum++;
  store.commit('changeLoading', true);
  // Do something before request is sent
  return config;
}, function (error) {
  // Do something with request error
  return Promise.reject(error);
});

// Add a response interceptor
axios.interceptors.response.use(function (response) {
  reaponseNum--;
  if (reaponseNum <= 0) {
    store.commit('changeLoading', false);
  } else {
    store.commit('changeLoading', true);
  }
  if (!response.data.code) {
    response.data.code = '0000';
    response.data.data = response.data;
  }
  if (response.data.code === '0000' || response.data.code === '9012') {
    return response.data.data;
  } else if (response.data.code === '5999') {
    delCookie('JD_token');
    router.push('/login');
  } else {
    store.commit('changeHint', true);
    store.commit('changeHintClass', 'errorHint');
    store.commit('changeContent', response.data.message);
    setTimeout(function() {
      store.commit('changeHint', false);
    }, 3000);
    return response.data.message;
  }
  // Do something with response data
}, function (error) {
  store.commit('changeLoading', false);
  store.commit('changeHint', true);
  store.commit('changeHintClass', 'errorHint');
  store.commit('changeContent', '请求失败');
  setTimeout(function() {
    store.commit('changeHint', false);
  }, 1000);
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
