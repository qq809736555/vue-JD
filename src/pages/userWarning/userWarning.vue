<template>
  <div class="userRecipient_wrapper">
    <div class="search_form">
      <div class="search_conditions">
        <div class="search_item">
          <div class="search_label">预警接收人：</div>
          <input type="text" v-model="userName" class="search_input">
        </div>
        <div class="search_btn_wrapper">
          <div class="search_btn red-btn" @click="queryBtn">查询</div>
          <div class="add_btn red-btn" @click="newReceivers">新增</div>
          <div class="import_btn red-btn" @click="importExcel">导入</div>
          <div class="export_btn red-btn" @click="exportBtn">导出</div>
        </div>
      </div>
    </div>
    <div class="search_table" v-show="tableShow">
      <table>
        <thead>
        <tr>
          <th width="7%">序号</th>
          <th width="10%">预警接收人</th>
          <th width="15%">预警手机号码</th>
          <th width="15%">预警邮箱</th>
          <th width="15%">预警方式</th>
          <th width="15%">状态</th>
          <th width="23%">操作</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(item, index) in this.$store.getters.getList" :key="item.id" v-if="index <= pageSize">
          <td>{{index + 1}}</td>
          <td>{{item.name}}</td>
          <td>{{item.phone}}</td>
          <td>{{item.email}}</td>
          <td>{{item.sendType | sendPost}}</td>
          <td>{{item.status | sendStatus}}</td>
          <td class="operation">
            <div class="modify red-btn" @click="modifyBtn(item.id,item.name,item.phone,item.email,item.sendType,item.kpdwdm)">修改</div>
            <div class="delete red-btn" @click="deleteBtn(item.id, item.name)">删除</div>
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
        userName: '',
        tableShow: false,
        value: '',
        btnFunction: '',
        taskType: '1',
        shuiHao: [],
        selection: []
      };
    },
    created () { // 初始化时currentPage赋值
      // this.getUserInfoList();
    },
    mounted() {
      Bus.$on('WarningList', (e) => {
        this.getUserInfoList();
      });
    },
    methods: {
      // 接收人操作之后，重新获取新的列表
      getUserInfoList() {
        let formDate = {'pageNum': this.pageNum, 'pageSize': this.pageSize, 'userName': this.userName, 'taskType': '1'};
        this.$http.post('/api/queryUserManager', formDate).then((response) => {
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
        Bus.$emit('receiveType', '1');
        this.$store.commit('S');
        this.$store.commit('changeDialogTitle', '批量导入发票数据预警接收人');
        this.$store.commit('changeBtnFunction', 'importExcel');
        this.$store.commit('changeStateShow', true);
        this.$store.commit('changeImportShow', true);
      },
      // 导出
      exportBtn() {
        this.$nextTick(function () {
          // 预警接收人设置导出
          window.open('/api/exportJSRExcel?taskType=' + '1');
        });
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
      // 新增接收人
      newReceivers() {
        Bus.$emit('receiveType', '1');
        this.$store.commit('S');
        this.$store.commit('changeDialogTitle', '新增发票数据预警接收人');
        let editItem = [
          {
            editLabel: '预警接收人名称',
            vModel: 'name',
            placeholder: '请输入预警接收人名称',
            type: 'text',
            value: ''
          },
          {
            editLabel: '预警手机号码',
            vModel: 'phone',
            placeholder: '请输入预警手机号码',
            type: 'number',
            value: '',
            onInput: 'if(value.length > 11) value = value.slice(0,11)'
          },
          {
            editLabel: '预警邮箱',
            vModel: 'email',
            placeholder: '请输入预警邮箱',
            type: 'text',
            value: ''
          },
          {
            editLabel: '税号',
            vModel: 'xfdm',
            placeholder: '请输入税号',
            type: 'text',
            value: '',
            onInput: 'if(value.length > 20) value = value.slice(0,20)'
          }
        ];
        this.$store.commit('changeEditItem', editItem);
        this.$store.commit('changeBtnFunction', 'newReceivesBtn');
        this.$store.commit('changeAcceptShow', true);
      },
      // 修改
      modifyBtn(id, name, phone, email, sendType, kpdwdm) {
        Bus.$emit('receiveType', '1');
        this.$store.commit('changeStateUserId', id);
        this.$store.commit('S');
        this.$store.commit('changeDialogTitle', '修改发票数据预警接收人');
        let editItem = [
          {
            editLabel: '预警接收人名称',
            vModel: 'name',
            placeholder: '请输入预警接收人名称',
            type: 'text',
            value: name
          },
          {
            editLabel: '预警手机号码',
            vModel: 'phone',
            placeholder: '请输入预警手机号码',
            type: 'number',
            value: phone,
            onInput: 'if(value.length > 11) value = value.slice(0,11)'
          },
          {
            editLabel: '预警邮箱',
            vModel: 'email',
            placeholder: '请输入预警邮箱',
            type: 'text',
            value: email
          }
        ];
        this.$store.commit('changeEditItem', editItem);
        this.$store.commit('changeAcceptShow', true);
        this.$store.commit('changeBtnFunction', 'changeReceiveInfo');
        // 修改接收人信息，填入input内容
        let dialogInput = window.document.getElementById('dialog').getElementsByTagName('INPUT');
        for (let i = 0; i < 3; i++) {
          this.$nextTick(function () {
            dialogInput[i].value = editItem[i].value || '';
          });
        }
        Bus.$emit('selectType', sendType);
      },
      // 删除
      deleteBtn(id, name) {
        this.$store.commit('S');
        this.$store.commit('changeDialogTitle', '删除预警接收人');
        let editItem = [];
        this.$store.commit('changeEditItem', editItem);
        this.$store.commit('changeStateCChange', '确定要删除预警接收人 "' + name + '" ？');
        this.$store.commit('changeBtnFunction', 'confirmReceiveDelete');
        this.$store.commit('changeStateUserId', id);
      }
    },
    components: {
      pagination,
      'v-dialog': dialog
    },
    filters: {
      sendPost(val) {
        if (val === '0') {
          return '邮件';
        } else if (val === '1') {
          return '短信';
        } else if (val === '3') {
          return '邮箱+短信';
        }
      },
      sendStatus(val) {
        if (val === '0') {
          return '启用';
        } else if (val === '1') {
          return '禁用';
        }
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet" scoped>

</style>
