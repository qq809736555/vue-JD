<template>
  <div class="home_wrapper">
    <v-header :real-name="userInfo.realName"></v-header>
    <div class="content_wrapper">
      <!-- 左侧菜单 -->
      <div class="left_bar">
        <div class="menu_item">
          <div class="first_menu" v-for="(item, index) in resourceList" :key="item.id" @click="showSeconedMenu(index, $event)">
            <p class="first_menu_p" :class="index === showIndex? 'select_firstMenu' : ''"><span class="icon-下拉" @click="showSeconedMenu(index, $event)"></span>{{item.name}}</p>
            <div class="second_menu" :class="index === showIndex? 'select_secondMenu' : ''">
              <div class="second_menu_item">
                <router-link to="billRepertory">
                  发票库存查询
                </router-link>
              </div>
              <div class="second_menu_item">
                <router-link to="oilProducts">
                成品油库存统计
              </router-link>
              </div>
              <div class="second_menu_item">
                <router-link to="monthlyQuery">
                月度报表查询/导出
                </router-link>
              </div>
              <div class="second_menu_item">
                <router-link to="oldDateQuery">
                  验旧数据查询/导出
                </router-link>
              </div>
              <div class="second_menu_item">
                <router-link to="invoiceState">
                  发票状态统计查询
                </router-link>
              </div>
            </div>
          </div>
          <div class="second_menu_item" style="height: auto;">
            <router-link to="userSetting">
              设置-用户设置
            </router-link>
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
  </div>
</template>

<script type="text/ecmascript-6">
  import header from 'components/header/header';
  import dialog from 'components/dialog/dialog';

  export default {
    data() {
      return {
        userInfo: {},
        userId: JSON.parse(window.localStorage.getItem('userInfo')).id,
        resourceList: {},
        showIndex: -1
      };
    },
    mounted() {
      // 组件开始挂载时获取用户信息
      this.getUserInfo();
      this.navData();
    },
    methods: {
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
        if (event.target.className.indexOf('select_firstMenu') === -1) {
          this.showIndex = index;
        } else {
          this.showIndex = -1;
        }
      }
    },
    components: {
      'v-header': header,
      'v-dialog': dialog
    }
  };
</script>

<style lang="stylus" rel="stylesheet" scoped>
  .home_wrapper
    width 100%
    height auto
    min-width 1200px
    margin auto
    .content_wrapper
      width 100%
      height auto
      background #f9f9f9
      display flex
      .left_bar
        flex 0 0 170px
        .menu_item
          position relative
          font-size 12px
          height auto
          color #666
          background #eef1f6
          cursor pointer
          .first_menu
            width 100%
            height auto
            .first_menu_p
              position relative
              padding-left 40px
              height 45px
              line-height 45px
              span
                position absolute
                left 20px
                top 16px
                color #777
                margin-right 5px
                font-size 12px
                transition all linear 0.1s
                transform rotate(-90deg)
              &.select_firstMenu
                span
                  transform rotate(0deg)
            .second_menu
              background #e4e8f1
              height 0
              overflow hidden
              transition all linear 2s
              &.select_secondMenu
                height auto
              .second_menu_item
                height 35px
                line-height 35px
                a
                  display block
                  padding-left 30px
                  width 100%
                  height 100%
                  &.active
                    background  #c8dff0
                    color #4a4a4a
      .right_content
        flex 1
        min-height 600px
        .rightCon_wrapper
          padding 15px 10px
          width 100%
          height 100%
</style>
