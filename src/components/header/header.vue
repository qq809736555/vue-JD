<template>
    <div class="header_wrapper">
      <div class="logo">
        <img src="./header.png" width="166" height="80" alt="">
      </div>
      <div class="index_name">
        税控监控查询系统v1.0
      </div>
      <div class="user">
        <div class="userName">{{realName}}，您好！</div>
        <div class="changePWD" @click="changePWD"><span class="icon-cog"></span>修改密码</div>
        <div class="loginOut" @click="loginOut"><span class="icon-switch"></span>退出</div>
      </div>
    </div>
</template>

<script type="text/ecmascript-6">
    import {delCookie} from 'common/js/cookie';

    export default {
      props: {
        realName: {
          type: String,
          default: ''
        }
      },
      data() {
        return {
          btnFunction: ''
        };
      },
      mounted() {
      },
      methods: {
        changePWD() {
          this.$store.commit('S');
          this.$store.commit('changeDialogTitle', '修改密码');
          let editItem = [
            {
              editLabel: '请输入原密码',
              vModel: 'oldPassword',
              placeholder: '请输入原密码',
              type: 'password',
              value: '',
              style: ''
            },
            {
              editLabel: '请输入新密码',
              vModel: 'newPassword',
              placeholder: '请输入新密码',
              type: 'password',
              value: '',
              style: ''
            },
            {
              editLabel: '请确认新密码',
              vModel: 'confirmPwd',
              placeholder: '请确认新密码',
              type: 'password',
              value: '',
              style: ''
            }
          ];
          this.$store.commit('changeEditItem', editItem);
          this.$store.commit('changeBtnFunction', 'changePwdBtn');
        },
        loginOut() {
          this.$http.get('/rbac/mvc/logout').then(() => {
            delCookie('fapiao_token');
            this.$router.push('/login');
          });
        }
      }
    };
</script>

<style lang="stylus" rel="stylesheet" scoped>
  .header_wrapper
    position relative
    width 100%
    height 80px
    box-shadow 0 3px 5px 0 rgba(210,210,210,.5)
    .logo, .index_name
      display inline-block
      vertical-align top
    .logo
      width 170px
      height 80px
      padding 0 2px
    .index_name
      font-size 26px
      padding-left 30px
      line-height 80px
    .user
      position absolute
      top 0
      right 20px
      margin 20px 0
      padding 10px
      width auto
      height 40px
      background #e4e4e4
      border-radius 20px
      font-size 0
      border 1px dotted #333
      cursor pointer
      .userName, .changePWD, .loginOut
        display inline-block
        vertical-align top
        padding 0 10px
        height: 20px
        line-height 20px
        font-size 14px
        border-right 1px dotted #333
      .changePWD, .loginOut
        span
          margin-right 5px
          vertical-align -1px
      .loginOut
        border none
</style>
