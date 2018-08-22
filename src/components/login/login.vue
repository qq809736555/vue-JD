<template>
  <div class="login_wrapper">
    <div class="login_content">
      <div class="login_title">税控开票监控查询系统</div>
      <div class="login_pic"><img src="../header/header.png" width="166" height="80" alt=""></div>
      <div class="login_form" @keyup.enter="login">
        <div class="login_error" v-show="loginError">
          {{errorMessage}}
        </div>
        <div class="login_item">
          <span class="icon icon-user"></span>
          <input type="text" placeholder="请输入用户名" v-model="username" />
        </div>
        <div class="login_item">
          <span class="icon icon-lock"></span>
          <input type="password" placeholder="请输入密码" v-model="password" />
        </div>
        <div class="login_btn" @click="login">登录</div>
      </div>
    </div>
    <v-hint></v-hint>
  </div>
</template>

<script type="text/ecmascript-6">
  import {setCookie, getCookie} from 'common/js/cookie';
  import md5 from 'js-md5';
  import Vue from 'vue';
  import hint from 'components/hint/hint';

  export default {
    data() {
      return {
        username: '',
        password: '',
        loginError: false,
        errorMessage: ''
      };
    },
    methods: {
      login() {
        let regName = /[a-zA-Z0-9]{5,30}/g;
        if (!regName.test(this.username)) {
          this.loginError = true;
          this.errorMessage = '请输入5-30位的用户名';
          return false;
        } else if (this.password.length < 6 || this.password.length > 12) {
          this.loginError = true;
          this.errorMessage = '请输入6-12位的密码';
          return false;
        } else {
          let responseData = {'username': this.username, 'password': md5(this.password)};
          this.$http.post('/rbac/mvc/login', responseData).then((response) => {
            if (response instanceof Object) {
              setCookie('JD_token', response.token);
              window.localStorage.setItem('userInfo', JSON.stringify(response.user));
              Vue.prototype.$http.defaults.headers.common['x-access-token'] = getCookie('JD_token') || '';
              this.loginError = false;
              this.errorMessage = '';
              this.$router.push('/');
            }
          });
        }
      }
    },
    components: {
      'v-hint': hint
    }
  };
</script>

<style lang="stylus" rel="stylesheet" scoped>
  .login_wrapper
    position relative
    width 100%
    height 100%
    min-width 1200px
    margin auto
    background url("./login.png") center center no-repeat
    background-size cover
    .login_content
      position absolute
      left 0
      right 0
      top 0
      bottom 0
      margin auto
      width 400px
      height 350px
      text-align center
      background #fff
      border-radius 5px
      padding 20px 30px
      .login_title
        font-size 28px
      .login_form
        position relative
        width 100%
        height auto
        .login_error
          position absolute
          right 0
          top -30px
          width auto
          height 20px
          line-height 20px
          padding-left 20px
          font-size 14px
          color #f4121d
          background url("./icon-hint.png") left center no-repeat
        .login_item
          position relative
          width 100%
          height 40px
          margin-top 20px
          .icon
            position absolute
            top 8px
            left 10px
            font-size 20px
            color #acbaca
          input
            width 100%
            height 100%
            padding-left 35px
            border-radius 5px
            border 1px solid #acbaca
        .login_btn
          margin-top 20px
          width 100%
          height 40px
          line-height 40px
          text-align: center
          font-size 18px
          color #ffffff
          background: #ec1f28
          border-radius 5px
          cursor: pointer
</style>
