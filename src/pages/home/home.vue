<template>
  <div class="home_wrapper">
    <v-header :real-name="userInfo.realName"></v-header>
    <navAddress :first-add="firstAdd" :second-add="secondAdd" :first-show="firstShow" :second-show="secondShow"></navAddress>
    <div class="content_wrapper">
      <!-- 左侧菜单 -->
      <div class="left_bar">
        <div class="menu_item">
          <div class="first_menu" v-for="(item, index) in resourceList" :key="item.id" @click="showSeconedMenu(index, $event)">
            <p class="first_menu_p" :class="index === showIndex? 'select_firstMenu' : ''"><span class="icon-add"></span>{{item.name}}</p>
            <div class="second_menu" :class="index === showIndex? 'select_secondMenu' : ''">
              <div class="second_menu_item" v-for="child in item.children" :key="child.id">
                <router-link :to="child.url">
                  {{child.name}}
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 右侧内容 -->
      <div class="right_content">
        <div class="rightCon_wrapper">
          <router-view></router-view>
        </div>
      </div>
    </div>
    <!-- 弹窗部分 -->
    <v-dialog></v-dialog>
    <v-hint></v-hint>
    <!-- loading -->
    <v-loading></v-loading>
  </div>
</template>

<script type="text/ecmascript-6">
  import header from 'components/header/header';
  import navAddress from 'components/navAddress/navAddress';
  import dialog from 'components/dialog/dialog';
  import hint from 'components/hint/hint';
  import vueLoading from 'components/vueLoading/vueLoading';

  export default {
    data() {
      return {
        userInfo: {},
        userId: JSON.parse(window.localStorage.getItem('userInfo')).id,
        resourceList: {},
        showIndex: -1,
        firstAdd: '',
        secondAdd: '',
        firstShow: false,
        secondShow: false
      };
    },
    mounted() {
      // 组件开始挂载时获取用户信息
      this.getUserInfo();
      this.navData();
    },
    methods: {
      breadCrumbShow() {
        this.$nextTick(() => {
          let firstAdd = document.getElementsByClassName('select_firstMenu')[0].innerText;
          this.firstAdd = firstAdd;
          let secondAdd = document.getElementsByClassName('select_secondMenu')[0].getElementsByClassName('active')[0].innerText;
          this.secondAdd = secondAdd;
        });
      },
      breadCrumb() {
        if (this.$route.path === '/') {
          this.firstShow = false;
          this.secondShow = false;
          this.showIndex = -1;
        } else {
          this.firstShow = true;
          this.secondShow = true;
          if (this.$route.path.indexOf('user') > 0) {
            this.showIndex = 1;
            this.breadCrumbShow();
          } else {
            this.showIndex = 0;
            this.breadCrumbShow();
          }
        }
      },
      getUserInfo() {
        let url = '/rbac/mvc/user/getUserInfo?userId=' + this.userId;
        this.$http.get(url, {emulateJSON: true}).then((response) => {
          this.userInfo = response.user;
        });
      },
      navData() {
        let url = '/rbac/mvc/resource/findTreeByUser?userId=' + this.userId;
        this.$http.get(url).then((response) => {
          this.resourceList = response.resourceList;
        });
      },
      showSeconedMenu(index, event) {
        let targetClassName = '';
        if (event.target.className === 'icon-add') {
          targetClassName = event.target.parentNode.className;
        } else {
          targetClassName = event.target.className;
        }
        if (targetClassName.indexOf('select_firstMenu') === -1) {
          this.showIndex = index;
        } else {
          this.showIndex = -1;
        }
      }
    },
    components: {
      'v-header': header,
      'v-dialog': dialog,
      'v-hint': hint,
      navAddress,
      'v-loading': vueLoading
    },
    watch: {
      $route() {
        this.breadCrumb();
      },
      resourceList() {
        this.$nextTick(() => {
          this.breadCrumb();
        });
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet" scoped>
  .home_wrapper
    position absolute
    top 0
    bottom 0
    width 100%
    background #f5f5f5
    .content_wrapper
      display flex
      position absolute
      left 0
      right 0
      top 125px
      bottom 0
      margin auto
      width 90%
      overflow hidden
      .left_bar
        flex 0 0 180px
        .menu_item
          position relative
          font-size 12px
          height 100%
          color #333333
          background #e0e0e0
          cursor pointer
          .first_menu
            width 100%
            height auto
            .first_menu_p
              position relative
              padding-left 50px
              height 30px
              line-height 30px
              font-size 12px
              span
                position absolute
                left 20px
                top 9px
                color #e2231a
                margin-right 5px
                font-size 12px
                transition all linear 0.1s
              &.select_firstMenu
                background #e2231a
                color #fff
                span
                  color #fff
                  &::before
                    content "\e903";
            .second_menu
              height 0
              overflow hidden
              transition all linear 2s
              &.select_secondMenu
                height auto
              .second_menu_item
                height 30px
                line-height 30px
                a
                  display block
                  padding-left 50px
                  width 100%
                  height 100%
                  font-size 12px
                  &.active
                    color #e2231a
      .right_content
        flex 1
        min-height 470px
        .rightCon_wrapper
          padding 20px 0 0 20px
          width 100%
          height 100%
</style>
