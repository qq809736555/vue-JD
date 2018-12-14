<template>
    <div class="invoiceInventory_wrapper">
      <searchForm @tableShow="judgeTabShow"></searchForm>
      <div class="search_table" v-show="tabIsShow">
        <table>
          <thead>
            <tr>
              <th width="7%">序号</th>
              <th width="28%">税号</th>
              <th width="25%">机器编号</th>
              <th width="25%">终端编号</th>
              <th width="15%">分发未开具发票份数</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in this.$store.getters.getList" :key="item.id" v-if="index < pageSize">
              <td>{{index + 1}}</td>
              <td>{{item.nsrsbh}}</td>
              <td>{{item.jqbh}}</td>
              <td>{{item.zdbs}}</td>
              <td>{{item.fpfs}}</td>
            </tr>
            <tr>
              <td colspan="3"></td>
              <td>统计</td>
              <td>0</td>
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
          let formDate = {'pageNum': this.pageNum, 'pageSize': '' + this.pageSize, 'nsrsbh': this.nsrsbh, 'jqbh': this.jqbh};
          this.$http.post('/api/queryInvoiceStore', formDate).then((response) => {
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
        pagination,
        searchForm
      }
    };
</script>

<style lang="stylus" rel="stylesheet" scoped>
</style>
