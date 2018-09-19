<template>
    <div class="sentEmail_wrapper">
      <searchForm @tableShow="judgeTabShow" :type-show="waringShow"></searchForm>
      <div class="search_table" v-show="tabIsShow">
        <table>
          <thead>
          <tr>
            <th width="7%">序号</th>
            <th width="20%">时间</th>
            <th width="20%">接收人信息</th>
            <th width="20%">预警项目类型</th>
            <th width="33%">邮件内容</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(item, index) in this.$store.getters.getList" :key="item.id" v-if="index <= pageSize">
            <td>{{index+1}}</td>
            <td>{{item.kpdwdm}}</td>
            <td>{{item.jqbh}}</td>
            <td>{{item.taskType}}</td>
            <td class="seeMore email_seeMore">{{item.value}}<p class="red-btn" @click="seeMore(item.id)">更多</p></td>
          </tr>
          </tbody>
        </table>
        <pagination :total-count="totalCount" :page-size="pageSize" :page-num="pageNum" @showNewPageSize="updatePageSize" @currentPage="currentPage"></pagination>
      </div>
    </div>
</template>

<script type="text/ecmascript-6">
  import pagination from 'components/pagination/pagination';
  import searchForm from 'components/searchForm/searchForm';

  export default {
    data() {
      return {
        waringShow: true,
        totalCount: 0,
        pageSize: 5,
        pageNum: 1,
        tabIsShow: false,
        nsrsbh: '',
        jqbh: ''
      };
    },
    methods: {
      getList() {
        let formDate = {'pageNum': this.pageNum, 'pageSize': '' + this.pageSize, 'taskType': this.dictCode, 'nsrsbh': this.nsrsbh, 'jqbh': this.jqbh};
        this.$http.post('/api/queryInvoiceStates', formDate).then((response) => {
          this.totalCount = response.total;
          this.$store.commit('changeList', response.list);
          this.pageSize = response.pageSize;
        });
      },
      // 翻页组件修改每页显示条数
      updatePageSize(data) {
        this.pageSize = data.page;// 改变了父组件的值
        this.getList();
      },
      // 改变当前页
      currentPage(data) {
        this.pageNum = data;
        this.getList();
      },
      // 判断列表展示
      judgeTabShow(data) {
        this.tabIsShow = data.tableShow;
        this.pageNum = data.pageNum;
        this.nsrsbh = data.nsrsbh;
        this.jqbh = data.jqbh;
        this.dictCode = data.dictCode;
        this.getList();
      },
      // 查看邮件
      seeMore(id) {
        // 传递id，请求邮件内容
        this.$http.get('/rbac/mvc/user/getUserInfo?userId=' + id).then((response) => {
          if (response instanceof Object) {
            this.$store.commit('S');
            this.$store.commit('changeDialogTitle', '删除用户');
            let editItem = [];
            this.$store.commit('changeEditItem', editItem);
            this.$store.commit('changeSeeMsg', response);
          }
        });
      }
    },
    components: {
      pagination,
      searchForm
    }
  };
</script>

<style lang="stylus" rel="stylesheet" scoped>

</style>
