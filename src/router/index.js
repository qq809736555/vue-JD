import Vue from 'vue';
import Router from 'vue-router';
import Login from '@/pages/login/login';
import Home from '@/pages/home/home';
import billRepertory from '@/pages/billRepertory/billRepertory';
import oilProducts from '@/pages/oilProducts/oilProducts';
import monthlyQuery from '@/pages/monthlyQuery/monthlyQuery';
import oldDateQuery from '@/pages/oldDateQuery/oldDateQuery';
import invoiceState from '@/pages/invoiceState/invoiceState';
import Index from '@/pages/reset/reset.vue';
import userSetting from '@/pages/userSetting/userSetting';
import userStatistical from '@/pages/userStatistical/userStatistical';
import userWarning from '@/pages/userWarning/userWarning';
import sentEmail from '@/pages/sentEmail/sentEmail';
import sentNote from '@/pages/sentNote/sentNote';
// 监控
import controlBillSource from '@/pages/controlBillSource/controlBillSource';
import controlOffLine from '@/pages/controlOffLine/controlOffLine';
import controlBillState from '@/pages/controlBillState/controlBillState';
import controlNewspaper from '@/pages/controlNewspaper/controlNewspaper';
import timTask from '@/pages/timTask/timTask';

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
          path: '/controlBillSource',
          name: '发票票源监控',
          component: controlBillSource
        },
        {
          path: '/controlOffLine',
          name: '离线参数监控',
          component: controlOffLine
        },
        {
          path: '/controlBillState',
          name: '发票状态监控',
          component: controlBillState
        },
        {
          path: '/controlNewspaper',
          name: '抄报提醒监控',
          component: controlNewspaper
        },
        {
          path: '/sentEmail',
          name: '已发邮件',
          component: sentEmail
        },
        {
          path: '/sentNote',
          name: '已发短信',
          component: sentNote
        },
        {
          path: '/userSetting',
          name: '用户设置',
          component: userSetting
        },
        {
          path: '/userStatistical',
          name: '接收人设置',
          component: userStatistical
        },
        {
          path: '/userWarning',
          name: '接收人设置',
          component: userWarning
        },
        {
          path: '/timTask',
          name: '定时任务',
          component: timTask
        }
      ]
    }
  ]
});
