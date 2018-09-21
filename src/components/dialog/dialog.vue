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
          <!--1.发票票源预警-->
          <div class="setWaring_content" v-if="this.warningType === 'BillSource'">
            <div class="select_item">
              <div class="search_label">发票业务监控类型：</div>
              <span class="icon-dropDown"></span>
              <select class="search_select" v-model="taskType">
                <option value="请选择">请选择</option>
                <option :value="item.dictCode" v-for="item in taskTypeList" :key="item.id">{{item.dictName}}</option>
              </select>
            </div>
            <div class="set_title" v-if="setItemShow">预警设置：</div>
            <div class="set_item" v-if="setItemShow">
              <span class="setItem_desc">{{warningDesc}}≤<input v-model="value" class="input_edit" type="text" />{{unitDesc}}</span>
              <span class="setItem_desc"><input class="input_checkBox" type="checkbox" value="0" v-model="notifyType1">邮件通知</span>
              <span class="setItem_desc"><input class="input_checkBox" type="checkbox" value="1" v-model="notifyType2">短信通知</span>
            </div>
            <div class="red_descNone" v-if="!setItemShow">空白发票出现重复后自动进行提醒。</div>
          </div>
          <!-- 2.离线参数监控 -->
          <div class="setWaring_content setWaring_OffLine" v-if="this.warningType === 'OffLine'">
            <div class="set_title">离线参数预警设置：</div>
            <div class="set_item">
              <span class="red_desc">（当前税控值xxx小时）</span>
              <span class="setItem_desc">离线开票时长≤<input v-model="offLine_value1" class="input_edit" type="text" />小时</span>
              <span class="setItem_desc"><input v-model="offLine_notifyType11" class="input_checkBox" type="checkbox" value="">邮件通知</span>
              <span class="setItem_desc"><input v-model="offLine_notifyType12" class="input_checkBox" type="checkbox" value="">短信通知</span>
            </div>
            <div class="set_item">
              <span class="red_desc">（当前税控值xxx小时）</span>
              <span class="setItem_desc">离线开票正数累计金额≤<input v-model="offLine_value2" class="input_edit" type="text" />元</span>
              <span class="setItem_desc"><input v-model="offLine_notifyType21" class="input_checkBox" type="checkbox" value="">邮件通知</span>
              <span class="setItem_desc"><input v-model="offLine_notifyType22" class="input_checkBox" type="checkbox" value="">短信通知</span>
            </div>
            <div class="set_item">
              <span class="red_desc">（当前税控值xxx小时）</span>
              <span class="setItem_desc">离线开票负数累计金额≤<input v-model="offLine_value3" class="input_edit" type="text" />元</span>
              <span class="setItem_desc"><input v-model="offLine_notifyType31" class="input_checkBox" type="checkbox" value="">邮件通知</span>
              <span class="setItem_desc"><input v-model="offLine_notifyType32" class="input_checkBox" type="checkbox" value="">短信通知</span>
            </div>
          </div>
          <!-- 3.发票状态监控 -->
          <div class="setWaring_content setWaring_BillState" v-if="this.warningType === 'BillState'">
            <div class="select_item">
              <div class="search_label">发票业务监控类型：</div>
              <span class="icon-dropDown"></span>
              <select class="search_select" v-model="taskType">
                <option value="请选择">请选择</option>
                <option :value="item.dictCode" v-for="item in taskTypeList" :key="item.id">{{item.dictName}}</option>
              </select>
            </div>
            <div class="set_title">预警设置：</div>
            <div class="set_item">
              <span class="setItem_desc">核心板剩余发票数量≤<input v-model="value" class="input_edit" type="text" />张</span>
              <span class="setItem_desc"><input class="input_checkBox" type="checkbox" value="0" v-model="notifyType1">邮件通知</span>
              <span class="setItem_desc"><input class="input_checkBox" type="checkbox" value="1" v-model="notifyType2">短信通知</span>
            </div>
          </div>
          <!-- 4.抄报提醒监控 -->
          <div class="setWaring_content setWaring_Newspaper" v-if="this.warningType === 'Newspaper'">
            <div class="set_title">预警设置：</div>
            <div class="set_item">
              <span class="red_desc">（开票截止日期≤15日，可设置值最大为15日，15日还未抄报默认为预警。）</span>
              <span class="setItem_desc">每月<input v-model="value" class="input_edit" type="text" />日（可多选）进行预警</span>
              <span class="setItem_desc"><input class="input_checkBox" type="checkbox" value="0" v-model="notifyType1">邮件通知</span>
              <span class="setItem_desc"><input class="input_checkBox" type="checkbox" value="1" v-model="notifyType2">短信通知</span>
            </div>
          </div>
          <div class="set_item set_time">
            <div class="setItem_desc">
              允许
              <span class="select_time">
                <span class="icon-dropDown"></span>
                <select class="search_select" v-model="monitorStartTime">
                  <option value="">请选择</option>
                  <option :value="item" v-for="item in startTime" :key="item.id">{{item}}点</option>
                </select>
              </span>
              到
              <span class="select_time">
                <span class="icon-dropDown"></span>
                <select class="search_select" v-model="monitorEndTime">
                  <option value="">请选择</option>
                  <option :value="item" v-for="item in endTime" :key="item.id">{{item}}点</option>
                </select>
              </span>
              发送预警信息
            </div>
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
    const maxTime = 24;
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
          taskType: '请选择',
          taskTypeList: [],
          startTime: [],
          endTime: [],
          warningType: '',
          setNsrsbh: '',
          warningDesc: '核心板剩余发票数量',
          unitDesc: '张',
          setItemShow: true,
          monitorStartTime: '0',
          monitorEndTime: '0',
          value: '',
          notifyType1: false,
          notifyType2: false,
          offLine_value1: '', // 离线三个值
          offLine_notifyType11: false,
          offLine_notifyType12: false,
          offLine_value2: '',
          offLine_notifyType21: false,
          offLine_notifyType22: false,
          offLine_value3: '',
          offLine_notifyType31: false,
          offLine_notifyType32: false,
          offLineData_list: []
        };
      },
      created() {
        this.getTime();
        Bus.$on('setType', (value) => {
          this.warningType = value;
          let argument = '';
          if (this.warningType === 'BillSource') {
            argument = '发票票源监控';
            this.getType(argument);
            return false;
          } else if (this.warningType === 'BillState') {
            argument = '发票状态监控';
            this.getType(argument);
            return false;
          }
        });
        Bus.$on('setNsrsbh', (value) => {
          this.setNsrsbh = value;
        });
        Bus.$on('winData', (value) => {
          this.offLineData_list = value;
          this.showOffLineData();
        });
      },
      methods: {
        // 离线参数，设置预警值，回显参数
        showOffLineData() {
          for (let i = 0; i < this.offLineData_list.length; i++) {
            this.monitorStartTime = this.offLineData_list[i].monitorStartTime || '0';
            this.monitorEndTime = this.offLineData_list[i].monitorEndTime || '0';
            if (this.offLineData_list[i].taskType === '3') {
              this.offLine_value1 = this.offLineData_list[i].value;
              this.offLine_notifyType11 = this.calShowData(this.offLineData_list[i].notifyType, this.offLine_notifyType11, this.offLine_notifyType12)[0];
              this.offLine_notifyType12 = this.calShowData(this.offLineData_list[i].notifyType, this.offLine_notifyType11, this.offLine_notifyType12)[1];
            }
            if (this.offLineData_list[i].taskType === '5') {
              this.offLine_value2 = this.offLineData_list[i].value;
              this.offLine_notifyType21 = this.calShowData(this.offLineData_list[i].notifyType, this.offLine_notifyType21, this.offLine_notifyType22)[0];
              this.offLine_notifyType22 = this.calShowData(this.offLineData_list[i].notifyType, this.offLine_notifyType21, this.offLine_notifyType22)[1];
            }
            if (this.offLineData_list[i].taskType === '6') {
              this.offLine_value3 = this.offLineData_list[i].value;
              this.offLine_notifyType31 = this.calShowData(this.offLineData_list[i].notifyType, this.offLine_notifyType31, this.offLine_notifyType32)[0];
              this.offLine_notifyType32 = this.calShowData(this.offLineData_list[i].notifyType, this.offLine_notifyType31, this.offLine_notifyType32)[1];
            }
            if (this.offLineData_list[i].taskType === '9') {
              this.value = this.offLineData_list[i].value;
              this.notifyType1 = this.calShowData(this.offLineData_list[i].notifyType, this.notifyType1, this.notifyType2)[0];
              this.notifyType2 = this.calShowData(this.offLineData_list[i].notifyType, this.notifyType1, this.notifyType2)[1];
            }
          }
        },
        // 获取时间
        getTime() {
          for (let i = 0; i < maxTime; i++) {
            this.startTime.push(i);
            this.endTime.push(i);
          }
        },
        // 获取发票业务监控类型
        getType(val) {
          this.$http.get('/api/getSysDictByType?dictType=' + val).then((response) => {
            this.taskTypeList = response;
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
          this.taskType = '请选择';
          this.value = '';
          this.monitorStartTime = '';
          this.monitorEndTime = '';
          this.notifyType1 = false;
          this.notifyType2 = false;
          this.dialog_error = false;
          this.dialogError = '';
          this.warningDesc = '核心板剩余发票数量';
          this.unitDesc = '张';
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
        hintShow(val) {
          store.commit('changeHint', true);
          store.commit('changeHintClass', val);
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
          } else if (this.$store.getters.getBtnFunction === 'setWaringVal') {
            // 设置预警值
            this.setWaringVal();
            return false;
          } else if (this.$store.getters.getBtnFunction === 'setWaringValOffLine') {
            // 设置预警值（离线参数特殊）
            this.setWaringValOffLine();
            return false;
          } else if (this.$store.getters.getBtnFunction === 'setWaringValNewspaper') {
            // 设置预警值（抄报特殊）
            this.setWaringValNewspaper();
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
                this.hintShow('hintShow');
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
                  this.hintShow('hintShow');
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
              this.hintShow('hintShow');
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
              this.hintShow('hintShow');
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
              this.hintShow('hintShow');
              store.commit('changeContent', '用户删除成功');
              this.getUserInfoList();
            }
          });
        },
        // 计算选择邮箱和短信情况
        calNotifyType(val1, val2) {
          let notifyType = '';
          if (val1 === true && val2 === false) {
            notifyType = 0;
            return notifyType;
          } else if (val1 === false && val2 === true) {
            notifyType = 1;
            return notifyType;
          } else if (val1 === true && val2 === true) {
            notifyType = 3;
            return notifyType;
          } else if (val1 === false && val2 === false) {
            notifyType = 4;
            return notifyType;
          }
        },
        // 回显数据时，计算选择邮箱和短信情况
        calShowData(val, argument1, argument2) {
          let argumentsList;
          if (val === '0') {
            argument1 = true;
            argument2 = false;
            argumentsList = [argument1, argument2];
            return argumentsList;
          } else if (val === '1') {
            argument1 = false;
            argument2 = true;
            argumentsList = [argument1, argument2];
            return argumentsList;
          } else if (val === '3') {
            argument1 = true;
            argument2 = true;
            argumentsList = [argument1, argument2];
            return argumentsList;
          } else if (val === '4' || val === null) {
            argument1 = false;
            argument2 = false;
            argumentsList = [argument1, argument2];
            return argumentsList;
          }
        },
        // 设置预警值确认按钮
        setWaringVal() {
          // 判断是否选择类型
          if (this.setType === 'BillSource' || this.setType === 'BillState') {
            if (this.taskType === '请选择') {
              this.hintShow('errorHint');
              store.commit('changeContent', '请选择业务类型');
              return;
            }
          }
          let formDate = [];
          if (this.taskType === '12') {
            formDate = [{'kpdwdm': this.setNsrsbh, 'taskType': this.taskType, 'monitorStartTime': this.monitorStartTime, 'monitorEndTime': this.monitorEndTime}];
          } else {
            formDate = [{'kpdwdm': this.setNsrsbh, 'taskType': this.taskType, 'monitorStartTime': this.monitorStartTime, 'monitorEndTime': this.monitorEndTime, 'notifyType': this.calNotifyType(this.notifyType1, this.notifyType2), value: this.value}];
          }
          this.$http.post('/api/setWarn', formDate).then((response) => {
            this.dialogClose();
            this.hintShow();
            store.commit('changeContent', '设置成功');
          });
        },
        // 设置预警值确认(抄报特殊)
        setWaringValNewspaper() {
          let formDate = [];
          formDate = [{'kpdwdm': this.setNsrsbh, 'taskType': '9', 'monitorStartTime': this.monitorStartTime, 'monitorEndTime': this.monitorEndTime, 'notifyType': this.calNotifyType(this.notifyType1, this.notifyType2), value: this.value}];
          this.$http.post('/api/setWarn', formDate).then((response) => {
            this.dialogClose();
            this.hintShow();
            store.commit('changeContent', '设置成功');
          });
        },
        // 设置预警值确认(离线参数特殊)
        setWaringValOffLine() {
          // 执行确认操作
          let formDate = [];
          formDate = [
            {'kpdwdm': this.setNsrsbh, 'taskType': '3', 'monitorStartTime': this.monitorStartTime, 'monitorEndTime': this.monitorEndTime, 'notifyType': this.calNotifyType(this.offLine_notifyType11, this.offLine_notifyType12), value: this.offLine_value1},
            {'kpdwdm': this.setNsrsbh, 'taskType': '5', 'monitorStartTime': this.monitorStartTime, 'monitorEndTime': this.monitorEndTime, 'notifyType': this.calNotifyType(this.offLine_notifyType21, this.offLine_notifyType22), value: this.offLine_value2},
            {'kpdwdm': this.setNsrsbh, 'taskType': '6', 'monitorStartTime': this.monitorStartTime, 'monitorEndTime': this.monitorEndTime, 'notifyType': this.calNotifyType(this.offLine_notifyType31, this.offLine_notifyType32), value: this.offLine_value2}
          ];
          this.$http.post('/api/setWarn', formDate).then((response) => {
            this.dialogClose();
            this.hintShow();
            store.commit('changeContent', '设置成功');
          });
        }
      },
      watch: {
        taskType(val) {
          if (val === '12') {
            this.setItemShow = false;
          } else {
            this.setItemShow = true;
          }
          if (val === '11') {
            this.warningDesc = '核心板剩余成品油数量';
            this.unitDesc = 'L';
          }
          if (val === '2') {
            this.warningDesc = '核心板未上传发票数量';
          }
          if (val === '7') {
            this.warningDesc = '核心板未签名发票数量';
          }
          if (val === '8') {
            this.warningDesc = '核心板验签失败发票数量';
          }
          this.$http.get('/api/queryWarn?' + 'nsrsbh=' + this.setNsrsbh + '&taskType=' + this.taskType).then((response) => {
            if (JSON.stringify(response) !== '[]') {
              this.monitorStartTime = response[0].monitorStartTime || '0';
              this.monitorEndTime = response[0].monitorEndTime || '0';
              if (val !== '12' && val !== '请选择') {
                this.value = response[0].value;
                this.notifyType1 = this.calShowData(response[0].notifyType, this.notifyType1, this.notifyType2)[0];
                this.notifyType2 = this.calShowData(response[0].notifyType, this.notifyType1, this.notifyType2)[1];
              }
            }
          });
        },
        monitorStartTime(val) {
          this.endTime = [];
          for (let i = val; i < maxTime; i++) {
            this.endTime.push(i);
          }
        },
        monitorEndTime(val) {
          this.startTime = [];
          for (let i = 0; i <= val; i++) {
            this.startTime.push(i);
          }
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
      width 450px
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
          text-align left
          text-indent 24px
          max-height 300px
          overflow hidden
          overflow-y scroll
          &::-webkit-scrollbalr
            width 4px
            height 4px
          &::-webkit-scrollbar-thumb
            border-radius 5px
            background #e2231a
          &::-webkit-scrollbar-track
            border-radius 0px
            background #e2231a
      .setWaring_value
        text-align left
        .setWaring_content
          .select_item
            position relative
            font-size 0
            display flex
            .icon-dropDown
              position absolute
              right 5px
              top 11px
              font-size 12px
              color #666e79
            .search_label, .search_input, .search_select
              position relative
              z-index 2
              display inline-block
              vertical-align top
              width 180px
              height 34px
              line-height 34px
              font-size 12px
            .search_label
              flex 0 0 110px
              text-align left
            .search_select
              flex 1
              padding: 0 22px 0 5px;
          .set_title
            font-weight 700
            line-height 35px
          .red_descNone
            height 50px
            line-height 50px
            color #e2231a
          .set_item
            height 30px
            line-height 30px
            .setItem_desc
              .input_edit, .input_checkBox
                margin 0 5px
              .input_edit
                width 50px
                height 22px
              .input_checkBox
                width 12px
                height 12px
        .setWaring_OffLine, .setWaring_Newspaper
          .set_item
            position relative
            height 40px
            line-height 40px
            margin-bottom 10px
            .red_desc
              position absolute
              bottom -10px
              color #e2231a
              line-height 20px
        .set_time
            height 40px
            line-height 40px
            .select_time
              position relative
              .icon-dropDown
                position absolute
                right 5px
                top 1px
                color #666e79
              .search_select
                padding 0 22px 0 5px
                height 22px
</style>
