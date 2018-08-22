<template>
  <div class="oilProducts">
    <navAddress :first-add="firstAdd" :current-add="currentAdd"></navAddress>
    <searchForm @tableShow="judgeTabShow"></searchForm>
    <div class="search_table" v-show="tabIsShow">
      <table>
        <thead>
        <tr>
          <th width="7%">序号</th>
          <th width="28%">税号</th>
          <th width="25%">机器编号</th>
          <th width="25%">税收编码分类</th>
          <th width="15%">剩余数量（升）</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(item, index) in this.$store.getters.getList" :key="item.id" v-if="index <= pageSize">
          <td>{{index+1}}</td>
          <td>{{item.nsrsbh}}</td>
          <td>{{item.jqbh}}</td>
          <td>{{item.flbm}}</td>
          <td>{{item.sysl}}</td>
        </tr>
        </tbody>
      </table>
      <pagination :total-count = "totalCount" :page-num="pageNum" :page-size="pageSize" @showNewPageSize="updatePageSize"></pagination>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import navAddress from 'components/navAddress/navAddress';
  import pagination from 'components/pagination/pagination';
  import searchForm from 'components/searchForm/searchForm';

  export default {
    data() {
      return {
        totalCount: 0,
        pageSize: 5,
        firstAdd: '查询-统计查询',
        currentAdd: '成品油库存统计',
        tabIsShow: false,
        nsrsbh: '',
        jqbh: ''
      };
    },
    methods: {
      getList() {
        let formDate = {'pageNum': '1', 'pageSize': '' + this.pageSize, 'nsrsbhs': this.nsrsbh, 'jqbhs': this.jqbh};
        this.$http.post('/api/queryOilProductStore', formDate).then((response) => {
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
        this.getList();
      }
    },
    components: {
      navAddress,
      pagination,
      searchForm
    }
  };
</script>

<style lang="stylus" rel="stylesheet" scoped>
</style>
