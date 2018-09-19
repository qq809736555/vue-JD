<template>
  <div class="dialog_wrapper" v-show="this.$store.getters.GS" id="dialog">
    <div class="dialog_content">
      <div class="dialog_title" @mousedown="drag">
        {{this.$store.getters.getDialogTitle}}
        <img class="dialog_close" src="./icon_close.png" width="20" height="20" alt="" @click.stop.prevent="dialogClose()">
      </div>
      <div class="edit_content">
        <div class="dialog_error" v-show="dialog_error">{{dialogError}}</div>
          <div class="edit_item" v-for="item in this.$store.getters.getEditItem" :key="item.id" :style="item.style">
            <div class="edit_label">{{item.editLabel}}：</div>
            <input :type="item.type" value="" class="edit_input" :ref="item.vModel" :oninput="item.onInput">
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
          <!-- 批量导入用户 -->
          <div class="importFile" v-if="this.$store.getters.getImportShow">
            <div class="import_name">请选择Excel文件：</div>
            <input class="upload" id="selectFile" @change.stop.prevent="selectFile(this)" type="file" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" />
          </div>
        <!--下拉框-->
        <div class="search_item"  v-if="this.$store.getters.getAcceptShow">
          <div class="edit_item">
            <div  class="edit_label">接受方式：</div>
            <span class="icon-dropDown"></span>
            <select  class="search_select edit_select">
              <option value="">全部</option>
              <option value="123">345678</option>
            </select>
          </div>
        </div>
          <!-- 查看邮件/短信 -->
          <div class="seeMsg" v-if="this.$store.getters.getSeeMsg">
            <div class="message_content">{{this.$store.getters.getSeeMsg}} </div>
          </div>
          <!-- 设置预警值 -->
          <div class="setWaring_value" v-if="this.$store.getters.getSetVal">
            <div class="search_item">
              <div class="search_label">税号：</div>
              <span class="icon-dropDown"></span>
              <select @change="SHSelect" v-model="nsrsbh" class="search_select">
                <option value="全部">全部</option>
                <option v-for="option1 in billControlType" :value="option1.nsrsbh" :key="option1.id">{{option1.nsrsbh}}<span>/{{option1.dwmc}}</span></option>
              </select>
            </div>
          </div>
          <!-- 按钮 -->
          <div class="edit_btn" v-if="this.$store.getters.getBtnShow">
            <div class="edit_confirm red-btn" :name="this.$store.getters.getBtnFunction" @click.stop.prevent="dialogConfirm">确认</div>
            <div class="edit_cancel red-btn" @click.stop.prevent="dialogClose">取消</div>
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

    const XLSX = require('xlsx');
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
          woman: '',
          billControlType: []
        };
      },
      created() {
        this.getType();
      },
      methods: {
        // 获取发票业务监控类型
        getType() {
          this.$http.get('/rbac/mvc/sallerInfo/getByNsrsbh?xfdm=' + JSON.parse(window.localStorage.getItem('userInfo')).xfdm).then((response) => {
            this.billControlType = response.nsrsbhList || [];
          });
        },
        drag(e) {
          let dialog = document.querySelector('.dialog_content');
          let marginLeft = parseFloat(getComputedStyle(dialog).marginLeft);
          let marginTop = parseFloat(getComputedStyle(dialog).marginTop);
          let width = parseFloat(getComputedStyle(dialog).width);
          let height = parseFloat(getComputedStyle(dialog).height);
          // 获取鼠标当前的坐标
          let beginX = e.clientX;
          let beginY = e.clientY;
          // 创建一个变量，保存鼠标移动的距离
          let disX = 0;
          let disY = 0;
          document.onmousemove = function(event) {
            event.preventDefault();
            // 处理兼容性问题
            event = event || window.event;

            // 获取鼠标当前的坐标
            let nowX = event.clientX;
            let nowY = event.clientY;

            // 获取鼠标移动的距离
            disX = nowX - beginX;
            disY = nowY - beginY;

            // 水平方向
            if ((marginLeft + disX) <= 5) {
              dialog.style.marginLeft = 5 + 'px';
            } else if ((marginLeft + disX) >= (document.body.clientWidth - width - 5)) {
              dialog.style.marginLeft = document.body.clientWidth - width - 5 + 'px';
            } else {
              dialog.style.marginLeft = marginLeft + disX + 'px';
            }

            // 垂直方向
            if ((marginTop + disY) <= 5) {
              dialog.style.marginTop = 5 + 'px';
            } else if ((marginTop + disY) >= (document.body.clientHeight - height - 5)) {
              dialog.style.marginTop = document.body.clientHeight - height - 5 + 'px';
            } else {
              dialog.style.marginTop = marginTop + disY + 'px';
            }
          };
          document.onmouseup = function() {
            document.onmousemove = null;
          };
        },
        // 弹窗关闭
        dialogClose() {
          this.$store.commit('S');
          this.$store.commit('changeDialogTitle', '');
          this.$store.commit('changeEditItem', '');
          this.$store.commit('changeBtnFunction', '');
          this.$store.commit('changeStateShow', false);
          this.$store.commit('changeStateCChange', '');
          this.$store.commit('changeStateUserId', '');
          this.$store.commit('changeImportShow', false);
          this.$store.commit('changeSeeMsg', false);
          this.$store.commit('changeSetVal', false);
          this.$store.commit('changeAcceptShow', false);
          this.dialog_error = false;
          this.dialogError = '';
          let dialogInput = window.document.getElementById('dialog').getElementsByTagName('INPUT');
          for (let i = 0; i < dialogInput.length; i++) {
            dialogInput[i].value = '';
            dialogInput[i].disabled = false;
          }
          // 关闭弹窗，恢复弹框默认位置
          let dialog = document.getElementById('dialog').getElementsByClassName('dialog_content')[0];
          dialog.style.margin = '100px auto';
          dialog.style.left = 0 + 'px';
          dialog.style.top = 0 + 'px';
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
          } else if (this.$store.getters.getBtnFunction === 'importExcel') {
            // 导入用户
            this.importExcel();
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
              if (response === 'success') {
                this.dialogClose();
                this.hintShow();
                store.commit('changeContent', '密码修改成功');
                this.getUserInfoList();
              }
            });
          }
        },
        // 用户操作之后，重新获取新的用户列表
        getUserInfoList() {
          Bus.$emit('changePagination', true);
        },
        //  选择Excel文件
        fixData(data) {
          var o = '';
          var l = 0;
          var w = 10240;
          for (; l < data.byteLength / w; ++l) o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w, l * w + w)));
          o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w)));
          return o;
        },
        selectFile() {
          let file = event.currentTarget.files[0];

          if (file === undefined) {
            return;
          }

          let rABS = false; // 是否将文件读取为二进制字符串

          let reader = new FileReader();
          FileReader.prototype.readAsBinaryString = function(f) {
            let binary = '';
            let rABS = false; // 是否将文件读取为二进制字符串
            let wb; // 读取完成的数据
            let outData; // 得到最终要的数据
            reader.onload = function() {
              let bytes = new Uint8Array(reader.result);
              let length = bytes.byteLength;
              for (let i = 0; i < length; i++) {
                binary += String.fromCharCode(bytes[i]);
              }
              if (rABS) {
                wb = XLSX.read(btoa(this.fixData(binary)), {
                  // 手动转化
                  type: 'base64'
                });
              } else {
                wb = XLSX.read(binary, {
                  type: 'binary'
                });
              }
              outData = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]); // outdata就是你想要的东西
              console.log(outData);
            };
            reader.readAsArrayBuffer(file);
          };
          if (rABS) {
            reader.readAsArrayBuffer(file);
          } else {
            reader.readAsBinaryString(file);
          }
        },
        // 用户批量导入
        importExcel() {
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
      box-shadow 0 0 5px rgba(226, 35, 26, 0.5)
      .dialog_title
        position relative
        width 100%
        height 48px
        line-height 48px
        text-align center
        font-size 16px
        letter-spacing 5px
        color #fff
        background #e2231a
        box-shadow 0 3px 5px 0 rgba(226, 35, 26, 0.5)
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
            border 1px solid #e0e0e0
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
          .edit_select
            position relative
            width 100%
            height 36px
            line-height 36px
            padding-left 5px
            border 1px solid #e0e0e0
            border-radius 5px
            color #495362
          .icon-dropDown
            position absolute
            right 26px
            bottom 80px
            font-size 12px
            color #666e79
        .confirmChange
          padding 20px 0
        .importFile
          .import_name
            padding-bottom 20px
          .upload
            height 36px
            padding 8px 5px
            font-size 12px
        .edit_btn
          width 100%
          height auto
          padding-top 20px
          font-size 0px
          .red-btn
            display inline-block
            vertical-align top
            width auto
            height 30px
            line-height 28px
            padding 0 15px
            border-radius 5px
            color #e2231a
            letter-spacing 5px
            border 1px solid #e2231a
            cursor pointer
          .edit_confirm
            margin-right 30px
            line-height 30px
            color #fff
            background #e2231a
        .message_content
          padding 10px
</style>
