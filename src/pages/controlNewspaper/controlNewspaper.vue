<template>
  <div class="controlNewspaper_wrapper">
    <searchForm @tableShow="judgeTabShow" :set-value="setValue" :set-type="setType"></searchForm>
    <div class="search_table" v-show="tabIsShow">
      <div class="table_name">1、每月抄报提醒</div>
      <table>
        <thead>
        <tr>
          <th width="30%">核心板编号</th>
          <th width="30%">最新开票截止时间</th>
          <th width="20%">预警值（日期）</th>
          <th width="20%">状态</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="item in this.list" :key="item.id">
          <td>{{item.kpdwdm}}</td>
          <td>{{item.jqbh}}</td>
          <td>{{item.yjz}}</td>
          <td>{{item.skserverYjz}}</td>
        </tr>
        </tbody>
      </table>
      <pagination :total-count="totalCount" :page-size="pageSize" :page-num="pageNum" @showNewPageSize="updatePageSize" @currentPage="currentPage"></pagination>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import searchForm from 'components/searchForm/searchForm';
  import pagination from 'components/pagination/pagination';
  export default {
    data() {
      return {
        setValue: true,
        setType: 'Newspaper',
        tabIsShow: false,
        totalCount: 0,
        pageSize: 5,
        pageNum: 1,
        nsrsbh: '',
        jqbh: '',
        list: [],
        allTaskTypes: ''
      };
    },
    methods: {
      getList() {
        let formDate = {'pageNum': this.pageNum, 'pageSize': '' + this.pageSize, 'taskType': this.allTaskTypes,  'nsrsbh': this.nsrsbh, 'jqbh': this.jqbh};
        this.$http.post('/api/queryInvoiceStates', formDate).then((response) => {
          this.totalCount = response.total;
          this.list = response.list;
        });
      },
      // 判断列表展示
      judgeTabShow(data) {
        this.allTaskTypes = data.getAllTaskTypes;
        this.getList();
        this.tabIsShow = data.tableShow;
        this.pageNum = data.pageNum;
        this.nsrsbh = data.nsrsbh;
        this.jqbh = data.jqbh;
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
      }
    },
    components: {
      searchForm,
      pagination
    }
  };
</script>

<style lang="stylus" rel="stylesheet" scoped>

</style>
