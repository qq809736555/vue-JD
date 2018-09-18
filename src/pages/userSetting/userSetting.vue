<template>
    <div class="userSetting_wrapper">
      <div class="search_form">
        <div class="search_conditions">
          <div class="search_item">
            <div class="search_label">账号名称：</div>
            <input type="text" v-model="accountNo" class="search_input">
          </div>
          <div class="search_item">
            <div class="search_label">用户姓名：</div>
            <input type="text" v-model="name" class="search_input">
          </div>
          <div class="search_btn_wrapper">
            <div class="search_btn red-btn" @click="queryBtn">查询</div>
            <div class="add_btn red-btn" @click="newUsers">新增</div>
            <div class="import_btn red-btn" @click="importExcel">导入</div>
          </div>
        </div>
      </div>
      <div class="search_table" v-show="tableShow">
        <table>
          <thead>
          <tr>
            <th width="7%">序号</th>
            <th width="15%">账号名称</th>
            <th width="15%">用户姓名</th>
            <th width="15%">手机号码</th>
            <th width="13%">状态</th>
            <th width="35%">操作</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(item, index) in this.$store.getters.getList" :key="item.id" v-if="index <= pageSize">
            <td>{{index + 1}}</td>
            <td>{{item.userName}}</td>
            <td>{{item.realName}}</td>
            <td>{{item.phone}}</td>
            <td v-if="item.enabled === 'Y'">启用</td>
            <td v-if="item.enabled === 'N'">停用</td>
            <td class="operation">
              <div class="modify red-btn" @click="modifyBtn(item.id)">修改</div>
              <div class="reset red-btn" @click="resetBtn(item.id, item.userName)">重置密码</div>
              <div class="delete red-btn" @click="deleteBtn(item.id, item.userName)">删除</div>
            </td>
          </tr>
          </tbody>
        </table>
        <pagination :total-count = "totalCount" :page-size="pageSize" :page-num="pageNum" @showNewPageSize="updatePageSize" @currentPage="currentPage"></pagination>
      </div>
    </div>
</template>

<script type="text/ecmascript-6">
  import pagination from 'components/pagination/pagination';
  import dialog from 'components/dialog/dialog';
  import Bus from '../../common/js/bus.js';

  export default {
    data() {
      return {
        totalCount: 0,
        pageSize: 5,
        pageNum: 1,
        accountNo: '',
        name: '',
        tableShow: false,
        value: '',
        btnFunction: ''
      };
    },
    created () { // 初始化时currentPage赋值
      // this.getUserInfoList();
    },
    mounted() {
      Bus.$on('changePagination', (e) => {
        this.getUserInfoList();
      });
    },
    methods: {
      // 用户操作之后，重新获取新的用户列表
      getUserInfoList() {
        let formDate = {'pageNum': this.pageNum, 'pageSize': this.pageSize, 'accountNo': this.accountNo, 'name': this.name};
        this.$http.post('/rbac/mvc/user/getUserList?', formDate).then((response) => {
          this.tableShow = true;
          this.totalCount = response.total;
          this.$store.commit('changeList', response.list);
          this.pageSize = response.pageSize;
        });
      },
      // 查询列表
      queryBtn() {
        this.getUserInfoList();
      },
      // 导入excel
      importExcel() {
        this.$store.commit('S');
        this.$store.commit('changeDialogTitle', '批量导入用户');
        this.$store.commit('changeBtnFunction', 'importExcel');
        this.$store.commit('changeStateShow', true);
        this.$store.commit('changeImportShow', true);
      },
      // 翻页组件修改每页显示条数
      updatePageSize(data) {
        this.pageSize = data.page;// 改变了父组件的值
        this.getUserInfoList();
      },
      // 改变当前页
      currentPage(data) {
        this.pageNum = data;
        this.getUserInfoList();
      },
      // 新增用户
      newUsers() {
        this.$store.commit('S');
        this.$store.commit('changeDialogTitle', '新增用户信息');
        let editItem = [
          {
            editLabel: '账号名称',
            vModel: 'accountName',
            placeholder: '请输入账号名称',
            type: 'text',
            value: ''
          },
          {
            editLabel: '用户姓名',
            vModel: 'realName',
            placeholder: '请输入用户姓名',
            type: 'text',
            value: ''
          },
          {
            editLabel: '手机号码',
            vModel: 'phone',
            placeholder: '请输入手机号码',
            type: 'number',
            value: '',
            onInput: 'if(value.length > 11) value = value.slice(0,11)'
          },
          {
            editLabel: '税号',
            vModel: 'xfdm',
            placeholder: '请输入税号',
            type: 'text',
            value: ''
          }
        ];
        this.$store.commit('changeEditItem', editItem);
        this.$store.commit('changeBtnFunction', 'newUsersBtn');
        this.$store.commit('changeStateShow', true);
      },
      // 修改
      modifyBtn(id) {
        this.$http.get('/rbac/mvc/user/getUserInfo?userId=' + id).then((response) => {
          this.$store.commit('changeStateUserId', id);
          let user = response.user;
          this.$store.commit('S');
          this.$store.commit('changeDialogTitle', '修改用户信息');
          let editItem = [
            {
              editLabel: '账号名称',
              vModel: 'accountName',
              placeholder: '请输入账号名称',
              type: 'text',
              value: user.userName
            },
            {
              editLabel: '用户姓名',
              vModel: 'realName',
              placeholder: '请输入用户姓名',
              type: 'text',
              value: user.realName
            },
            {
              editLabel: '手机号码',
              vModel: 'phone',
              placeholder: '请输入手机号码',
              type: 'number',
              value: user.phone,
              onInput: 'if(value.length > 11) value = value.slice(0,11)'
            }
          ];
          this.$store.commit('changeEditItem', editItem);
          this.$store.commit('changeBtnFunction', 'changeUserInfo');
          this.$store.commit('changeStateShow', true);
          // 修改用户信息，填入input内容
          let dialogInput = window.document.getElementById('dialog').getElementsByTagName('INPUT');
          for (let i = 0; i < 3; i++) {
            this.$nextTick(function () {
              dialogInput[0].disabled = true;
              dialogInput[i].value = editItem[i].value || '';
            });
          }
        });
      },
      // 重置密码
      resetBtn(id, userName) {
        this.$http.get('/rbac/mvc/user/getUserInfo?userId=' + id).then((response) => {
          this.$store.commit('S');
          this.$store.commit('changeDialogTitle', '重置密码');
          let editItem = [];
          this.$store.commit('changeEditItem', editItem);
          this.$store.commit('changeStateCChange', '点击“确定”，密码将会重置为“88888888”，如不想重置密码，请点击“取消”');
          this.$store.commit('changeBtnFunction', 'confirmChange');
          this.$store.commit('changeStateUserId', id);
        });
      },
      // 删除
      deleteBtn(id, userName) {
        this.$http.get('/rbac/mvc/user/getUserInfo?userId=' + id).then((response) => {
          this.$store.commit('S');
          this.$store.commit('changeDialogTitle', '删除用户');
          let editItem = [];
          this.$store.commit('changeEditItem', editItem);
          this.$store.commit('changeStateCChange', '确定要删除用户 "' + userName + '" 信息？');
          this.$store.commit('changeBtnFunction', 'confirmDelete');
          this.$store.commit('changeStateUserId', id);
        });
      }
    },
    components: {
      pagination,
      'v-dialog': dialog
    }
  };
</script>

<style lang="stylus" rel="stylesheet" scoped>

</style>
