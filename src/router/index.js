import Vue from 'vue';
import Router from 'vue-router';
import Login from '@/pages/login/login';
import Home from '@/pages/home/home';
import billRepertory from '@/pages/billRepertory/billRepertory';
import oilProducts from '@/pages/oilProducts/oilProducts';
import monthlyQuery from '@/pages/monthlyQuery/monthlyQuery';
import oldDateQuery from '@/pages/oldDateQuery/oldDateQuery';
import userSetting from '@/pages/userSetting/userSetting';
import invoiceState from '@/pages/invoiceState/invoiceState';
import Index from '@/pages/reset/reset.vue';

Vue.use(Router);

export default new Router({
  linkActiveClass: 'active',
  routes: [
    {
      path: '/login',
      name: '登录',
      component: Login,
      hidden: true
    },
    {
      path: '/',
      name: '主页',
      component: Home,
      children: [
        {
          path: '/',
          name: '首页',
          component: Index
        },
        {
          path: '/billRepertory',
          name: '发票库存统计',
          component: billRepertory
        },
        {
          path: '/oilProducts',
          name: '成品油库存统计',
          component: oilProducts
        },
        {
          path: '/monthlyQuery',
          name: '月度报表查询导出',
          component: monthlyQuery
        },
        {
          path: '/oldDateQuery',
          name: '验旧数据查询导出',
          component: oldDateQuery
        },
        {
          path: '/invoiceState',
          name: '发票状态统计查询',
          component: invoiceState
        },
        {
          path: '/userSetting',
          name: '用户设置',
          component: userSetting
        }
      ]
    }
  ]
});
