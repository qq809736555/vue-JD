<template>
    <div class="userSetting_wrapper">
      <navAddress :first-add="firstAdd" :current-add="currentAdd"></navAddress>
      <div class="search_form">
        <div class="search_conditions">
          <div class="search_item">
            <div class="search_label">账号名称：</div>
            <input type="text" class="search_input">
          </div>
          <div class="search_item">
            <div class="search_label">用户姓名：</div>
            <input type="text" class="search_input">
          </div>
          <div class="search_btn blue-btn">查询</div>
          <div class="add_btn blue-btn" @click="newUsers">新增</div>
        </div>
      </div>
      <div class="search_table">
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
            <td>{{index}}</td>
            <td>{{item.userName}}</td>
            <td>{{item.realName}}</td>
            <td>{{item.phone}}</td>
            <td v-if="item.enabled === 'Y'">启用</td>
            <td v-if="item.enabled === 'N'">停用</td>
            <td class="operation">
              <div class="modify blue-btn" @click="modifyBtn(item.id)">修改</div>
              <div class="reset blue-btn" @click="resetBtn(item.id, item.userName)">重置密码</div>
              <div class="delete blue-btn" @click="deleteBtn(item.id, item.userName)">删除</div>
            </td>
          </tr>
          </tbody>
        </table>
        <pagination :total-count = "totalCount" :page-size="pageSize" @showNewPageSize="updatePageSize"></pagination>
      </div>
    </div>
</template>

<script type="text/ecmascript-6">
  import navAddress from 'components/navAddress/navAddress';
  import pagination from 'components/pagination/pagination';
  import dialog from 'components/dialog/dialog';

  export default {
    data() {
      return {
        totalCount: 0,
        pageSize: 20,
        firstAdd: '设置-用户设置',
        currentAdd: '用户设置',
        value: '',
        btnFunction: ''
      };
    },
    created () { // 初始化时currentPage赋值
      this.getUserInfoList();
    },
    methods: {
      // 用户操作之后，重新获取新的用户列表
      getUserInfoList() {
        let formDate = {'currentPage': '1', 'pageSize': '20'};
        this.$http.post('/rbac/mvc/user/getUserList?', formDate).then((response) => {
          this.totalCount = response.count;
          this.$store.commit('changeList', response.list);
          this.pageSize = response.pageSize;
        });
      },
      // 翻页组件修改每页显示条数
      updatePageSize(data) {
        this.pageSize = data.page;// 改变了父组件的值
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
            value: '',
            style: ''
          },
          {
            editLabel: '账户密码',
            vModel: 'accountPassword',
            placeholder: '请输入账户密码',
            type: 'password',
            value: '88888888',
            style: 'display: none;'
          },
          {
            editLabel: '用户姓名',
            vModel: 'realName',
            placeholder: '请输入用户姓名',
            type: 'text',
            value: '',
            style: ''
          },
          {
            editLabel: '手机号码',
            vModel: 'userTel',
            placeholder: '请输入手机号码',
            type: 'text',
            value: '',
            style: ''
          },
          {
            editLabel: '税号',
            vModel: 'userEni',
            placeholder: '请输入税号',
            type: 'text',
            value: '',
            style: ''
          }
        ];
        this.$store.commit('changeEditItem', editItem);
        this.$store.commit('changeBtnFunction', 'newUsersBtn');
        this.$store.commit('changeStateShow', true);
      },
      // 修改
      modifyBtn(id) {
        console.log(id);
        this.$http.get('/rbac/mvc/user/getUserInfo?userId=' + id).then((response) => {
          console.log(response);
          let user = response.user;
          this.$store.commit('S');
          this.$store.commit('changeDialogTitle', '新增用户信息');
          let editItem = [
            {
              editLabel: '账号名称',
              vModel: 'accountName',
              placeholder: '请输入账号名称',
              type: 'text',
              value: user.userName,
              style: ''
            },
            {
              editLabel: '用户姓名',
              vModel: 'realName',
              placeholder: '请输入用户姓名',
              type: 'text',
              value: user.realName,
              style: ''
            },
            {
              editLabel: '手机号码',
              vModel: 'userTel',
              placeholder: '请输入手机号码',
              type: 'text',
              value: user.phone,
              style: ''
            }
          ];
          this.$store.commit('changeEditItem', editItem);
          this.$store.commit('changeBtnFunction', 'newUsersBtn');
          this.$store.commit('changeStateShow', true);
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
      navAddress,
      pagination,
      'v-dialog': dialog
    }
  };
</script>

<style lang="stylus" rel="stylesheet" scoped>

</style>
