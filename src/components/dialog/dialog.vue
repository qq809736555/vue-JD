<template>
  <div class="dialog_wrapper" v-show="this.$store.getters.GS" id="dialog">
    <div class="dialog_content">
      <div class="dialog_title">
        {{this.$store.getters.getDialogTitle}}
        <img class="dialog_close" src="./icon_close.png" width="20" height="20" alt="" @click="dialogClose()">
      </div>
      <div class="edit_content">
        <div class="dialog_error" v-show="dialog_error">{{dialogError}}</div>
          <div class="edit_item" v-for="item in this.$store.getters.getEditItem" :key="item.id" :style="item.style">
            <div class="edit_label">{{item.editLabel}}：</div>
            <input :type="item.type" value="" class="edit_input" :ref="item.vModel">
          </div>
          <div class="edit_item" style="display: none;">
            <div class="edit_label">状态：</div>
            <div class="edit_radio">
              <div class="edit_selectRadio">
                <input type="radio" name="gender" v-model="picked" value="open" id="open"/><label for="open">启用</label>
              </div>
              <div class="edit_selectRadio">
                <input type="radio" name="gender" v-model="picked" value="ban" id="ban"/><label for="ban">禁用</label>
              </div>
            </div>
          </div>
          <!-- 重置密码等情况显示 -->
          <div class="confirmChange" v-if="this.$store.getters.getStateCChange !== ''">{{this.$store.getters.getStateCChange}}</div>
          <div class="edit_btn">
            <div class="edit_confirm blue-btn" :name="this.$store.getters.getBtnFunction" @click="dialogConfirm">确认</div>
            <div class="edit_cancel blue-btn" @click="dialogClose">取消</div>
          </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
    import md5 from 'js-md5';
    import global from 'components/Global/Global';
    import store from '../../vuex/store';
    import Bus from '../../common/js/bus.js';

    export default {
      data() {
        return {
          dialogError: '',
          dialog_error: false,
          accountName: '',
          accountPassword: '',
          realName: '',
          phone: '',
          picked: '',
          man: '',
          woman: ''
        };
      },
      methods: {
        // 弹窗关闭
        dialogClose() {
          this.$store.commit('S');
          this.$store.commit('changeStateShow', false);
          this.dialog_error = false;
          this.dialogError = '';
          this.$store.commit('changeStateCChange', '');
          let dialogInput = window.document.getElementById('dialog').getElementsByTagName('INPUT');
          for (let i = 0; i < dialogInput.length; i++) {
            dialogInput[i].value = '';
          }
        },
        // 请求成功提示hint
        hintShow() {
          store.commit('changeHint', true);
          store.commit('changeHintClass', 'successHint');
          setTimeout(function() {
            store.commit('changeHint', false);
          }, 1000);
        },
        // 判断确认按钮，对应执行函数
        dialogConfirm() {
          if (this.$store.getters.getBtnFunction === 'changePwdBtn') {
            // 修改密码
            this.changePwdBtn();
            return false;
          } else if (this.$store.getters.getBtnFunction === 'newUsersBtn') {
            // 新建用户
            this.newUsersBtn();
            return false;
          } else if (this.$store.getters.getBtnFunction === 'changeUserInfo') {
            // 修改用户信息
            this.changeUserInfo();
            return false;
          } else if (this.$store.getters.getBtnFunction === 'confirmChange') {
            // 重置密码
            this.confirmChange();
            return false;
          } else if (this.$store.getters.getBtnFunction === 'confirmDelete') {
            // 删除用户
            this.confirmDelete();
            return false;
          }
        },
        // 修改密码
        changePwdBtn() {
          let oldPassword = this.$refs.oldPassword[0].value;
          let newPassword = this.$refs.newPassword[0].value;
          let confirmPwd = this.$refs.confirmPwd[0].value;
          if (oldPassword.length < 6 || oldPassword.length > 12) {
            this.dialog_error = true;
            this.dialogError = '请输入原密码';
            return false;
          } else if (newPassword.length < 6 || newPassword.length > 12) {
            this.dialog_error = true;
            this.dialogError = '请输入6-12位的新密码';
            return false;
          } else if (confirmPwd !== newPassword) {
            this.dialog_error = true;
            this.dialogError = '请确认新密码';
            return false;
          } else if (newPassword === oldPassword) {
            this.dialog_error = true;
            this.dialogError = '新密码与旧密码一样';
            return false;
          } else {
            this.dialog_error = false;
            this.dialogError = '';
            let responseData = {'oldPassword': md5(oldPassword), 'newPassword': md5(newPassword)};
            this.$http.post('/rbac/mvc/user/updatePassword.do', responseData).then((response) => {
              console.log(response);
            });
          }
        },
        // 用户操作之后，重新获取新的用户列表
        getUserInfoList() {
          Bus.$emit('changePagination', true);
        },
        // 用户添加、修改校验
        regUser() {
          let _this = this;
          if (!global.userName.test(_this.$refs.accountName[0].value)) {
            this.dialog_error = true;
            this.dialogError = '请输入1-30位数字或字母的账户名称';
            return false;
          } else if (!global.realName.test(_this.$refs.realName[0].value)) {
            this.dialog_error = true;
            this.dialogError = '请输入2-10位汉字或字母的用户姓名';
            return false;
          } else if (!global.phone.test(_this.$refs.phone[0].value)) {
            this.dialog_error = true;
            this.dialogError = '请输入正确的11位手机号码';
            return false;
          }
        },
        // 新增用户
        newUsersBtn() {
            this.regUser();
            if (this.$refs.xfdm[0].value === '') {
              this.dialog_error = true;
              this.dialogError = '请输入税号';
              return false;
            } else {
              this.dialog_error = false;
              this.dialogError = '';
              let accountName = this.$refs.accountName[0].value;
              let realName = this.$refs.realName[0].value;
              let phone = this.$refs.phone[0].value;
              let xfdm = this.$refs.xfdm[0].value;
              let formDate = {'userName': accountName, 'realName': realName, 'password': md5('88888888'), 'phone': phone, 'xfdm': xfdm, 'picked': 'open'};
              this.$http.post('/rbac/mvc/user/add', formDate).then((response) => {
                if (response === 'success') {
                  this.dialogClose();
                  this.hintShow();
                  store.commit('changeContent', '用户新增成功');
                  this.getUserInfoList();
                }
              });
            }
        },
        // 修改用户信息
        changeUserInfo() {
          this.regUser();
          let accountName = this.$refs.accountName[0].value;
          let realName = this.$refs.realName[0].value;
          let phone = this.$refs.phone[0].value;
          let formDate = {'id': '' + this.$store.getters.getStateUserId, 'userName': accountName, 'realName': realName, 'phone': phone};
          this.$http.post('/rbac/mvc/user/update', formDate).then((response) => {
            if (response === 'success') {
              this.dialogClose();
              this.hintShow();
              store.commit('changeContent', '用户信息修改成功');
              this.getUserInfoList();
            }
          });
        },
        // 重置密码
        confirmChange() {
          let formDate = {'userId': '' + this.$store.getters.getStateUserId, 'password': md5('88888888')};
          this.$http.post('/rbac/mvc/user/resetPassword', formDate).then((response) => {
            if (response === 'success') {
              this.dialogClose();
              this.hintShow();
              store.commit('changeContent', '密码重置成功');
              this.getUserInfoList();
            }
          });
        },
        // 删除用户
        confirmDelete() {
          let formDate = {'userId': '' + this.$store.getters.getStateUserId};
          this.$http.post('/rbac/mvc/user/delete', formDate).then((response) => {
            if (response === 'success') {
              this.dialogClose();
              this.hintShow();
              store.commit('changeContent', '用户删除成功');
              this.getUserInfoList();
            }
          });
        }
      }
    };
</script>

<style lang="stylus" rel="stylesheet" scoped>
  .dialog_wrapper
    position fixed
    top 0
    left 0
    z-index 999
    width 100%
    height 100%
    background rgba(0, 0, 0, .5)
    .dialog_content
      position absolute
      top 0
      left 0
      right 0
      z-index 99
      width 400px
      margin 100px auto
      background #fff
      border: 1px solid #666;
      box-shadow: 0 0 10px #333;
      .dialog_title
        position relative
        width 100%
        height 48px
        line-height 48px
        text-align center
        font-size 18px
        color #fff
        background #33CCFF
        box-shadow 0 3px 5px 0 rgba(210, 210, 210, 0.5)
        .dialog_close
          position absolute
          top 13px
          right 25px
          cursor pointer
      .edit_content
        position relative
        width 100%
        height auto
        padding 20px
        text-align center
        .dialog_error
          position absolute
          right 20px
          top 20px
          height 20px
          line-height 20px
          font-size 12px
          padding-left 20px
          color #f95e08
          background url(./icon_error.png) left center no-repeat
          background-size 16px 16px
        .edit_item
          .edit_label
            padding 10px 0 8px 0
            text-align left
          .edit_input
            width 100%
            height 36px
            line-height 36px
            padding-left 5px
            border 1px solid #acbaca
            border-radius 5px
            color #495362
          .edit_radio
            text-align left
          .edit_selectRadio
            display inline-block
            vertical-align top
            margin-right 15px
            label
              margin-left 8px
        .confirmChange
          padding 20px 0
        .edit_btn
          width 100%
          height auto
          padding-top 20px
          font-size 0px
          .blue-btn
            display inline-block
            vertical-align top
            font-size 14px
          .edit_confirm
            margin-right 30px
</style>
