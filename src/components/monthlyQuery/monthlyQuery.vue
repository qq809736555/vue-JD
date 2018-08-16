<template>
    <div class="monthlyQuery">
      <navAddress :first-add="firstAdd" :current-add="currentAdd"></navAddress>
      <searchForm @tableShow="judgeTabShow" :jqbh-show="JQBHShow" :data-show="dataShow"></searchForm>
      <div class="search_table" v-show="tabIsShow">
        <div class="table_header">
          <p>开票数量统计</p>
        </div>
        <table>
          <thead>
            <tr>开票数量统计</tr>
          </thead>
          <tbody>
          <tr>
            <td width="16.666666%">合计</td>
            <td width="16.666666%">100</td>
            <td  width="16.666666%">正数发票份数</td>
            <td width="16.666666%">20</td>
            <td width="16.666666%">负数发票份数</td>
            <td  width="16.666666%">10</td>
          </tr>
          </tbody>
        </table>
      </div>
      <div class="search_table" v-show="tabIsShow">
        <div class="table_header">
          <p>税率统计</p>
        </div>
        <table>
          <thead>
          <tr>税率统计</tr>
          </thead>
          <tbody>
          <tr>
            <td width="23%">项目名称</td>
            <td width="11%">1</td>
            <td width="11%">2</td>
            <td width="11%">3</td>
            <td width="11%">4</td>
            <td width="11%">5</td>
            <td width="11%">6</td>
            <td width="11%">7</td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
</template>

<script type="text/ecmascript-6">
  import navAddress from 'components/navAddress/navAddress';
  import searchForm from 'components/searchForm/searchForm';

  export default {
    data() {
      return {
        JQBHShow: false,
        dataShow: true,
        firstAdd: '查询-统计查询',
        currentAdd: '月度报表查询/导出',
        tabIsShow: false
      };
    },
    methods: {
      getList() {
        let formDate = {'nsrsbh': this.nsrsbh, 'kpyf': this.nowDate};
        this.$http.post('/api/monthReport', formDate).then((response) => {
          console.log(response);
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
        this.nsrsbh = data.nsrsbh;
        this.nowDate = data.nowDate;
        this.getList();
      }
    },
    components: {
      navAddress,
      searchForm
    }
  };
</script>

<style lang="stylus" rel="stylesheet" scoped>
  .search_table
    position relative
    .table_header
      position absolute
      left 0
      top 29px
      width 100%
      height 34px
      line-height 34px
      padding 0 29px 0 30px
      p
        padding-left 10px
        width 100%
        background #f2f2f2
        border 1px solid #797979
        border-bottom 0
    td
      text-align left
      padding-left 10px
</style>
