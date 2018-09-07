<template>
    <div class="header_wrapper">
      <div class="header_content">
        <div class="logo">
          <img src="./header.png" width="166" height="80" alt="">
        </div>
        <div class="index_name">
          税控监控查询系统v1.0
        </div>
        <div class="user">
          <div class="userName">{{realName}}，您好！</div>
          <div class="changePWD" @click="changePWD">修改密码</div>
          <div class="loginOut" @click="loginOut">退出</div>
        </div>
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
              value: ''
            },
            {
              editLabel: '请输入新密码',
              vModel: 'newPassword',
              placeholder: '请输入新密码',
              type: 'password',
              value: ''
            },
            {
              editLabel: '请确认新密码',
              vModel: 'confirmPwd',
              placeholder: '请确认新密码',
              type: 'password',
              value: ''
            }
          ];
          this.$store.commit('changeEditItem', editItem);
          this.$store.commit('changeBtnFunction', 'changePwdBtn');
        },
        loginOut() {
          this.$http.get('/rbac/mvc/logout').then(() => {
            delCookie('JD_token');
            this.$router.push('/login');
          });
        }
      }
    };
</script>

<style lang="stylus" rel="stylesheet" scoped>
  .header_wrapper
    width 100%
    min-width 1200px
    height 80px
    background #e2231a
    box-shadow 0 3px 5px 0 rgba(210,210,210,.5)
    .header_content
      position relative
      width 90%
      min-width 1200px
      height 80px
      margin auto
      .logo, .index_name
        display inline-block
        vertical-align top
      .logo
        width 180px
        height 80px
        padding 0 8px
      .index_name
        font-size 20px
        padding-left 120px
        letter-spacing 5px
        line-height 80px
        color #fff
      .user
        position absolute
        top 0
        right 0
        margin 20px 0
        padding 8px 10px
        width auto
        height 40px
        border-radius 20px
        font-size 0
        cursor pointer
        .userName, .changePWD, .loginOut
          display inline-block
          vertical-align top
          padding 0 16px
          height: 24px
          line-height 24px
          font-size 12px
          color #fff
          border-radius 12px
        .changePWD
          margin-right 15px
        .changePWD
          line-height 22px
          border 1px solid #fff
        .loginOut
          border none
          color #e2231a
          background #fff
</style>
