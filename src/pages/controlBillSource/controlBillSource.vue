<template>
    <div class="controlBillSource_wrapper">
      <searchForm @tableShow="judgeTabShow"></searchForm>
      <div class="search_table" v-show="tabIsShow">
        <div class="table_name">1、发票库存监控预警</div>
        <table>
          <thead>
          <tr>
            <th width="7%">序号</th>
            <th width="15.5%">核心板编号</th>
            <th width="15.5%">终端编号</th>
            <th width="15.5%">剩余发票数量（张）</th>
            <th width="15.5%">预警值（张）</th>
            <th width="15.5%">状态</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(item, index) in this.$store.getters.getList" :key="item.id" v-if="index < pageSize">
            <td>{{index + 1}}</td>
            <td>{{item.nsrsbh}}</td>
            <td>{{item.jqbh}}</td>
            <td>{{item.zdbs}}</td>
            <td>{{item.fpfs}}</td>
            <td>{{item.fpfs}}</td>
          </tr>
          </tbody>
        </table>
        <pagination :total-count="totalCount" :page-size="pageSize" :page-num="pageNum" @showNewPageSize="updatePageSize" @currentPage="currentPage"></pagination>
      </div>
      <div class="search_table" v-show="tabIsShow">
        <div class="table_name">2、成品油库存监控预警</div>
        <table>
          <thead>
          <tr>
            <th width="7%">序号</th>
            <th width="15.5%">核心板编号</th>
            <th width="15.5%">终端编号</th>
            <th width="15.5%">剩余发票数量（张）</th>
            <th width="15.5%">预警值（张）</th>
            <th width="15.5%">状态</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(item, index) in list2" :key="item.id" v-if="index < pageSize">
            <td>{{index + 1}}</td>
            <td>{{item.nsrsbh}}</td>
            <td>{{item.jqbh}}</td>
            <td>{{item.zdbs}}</td>
            <td>{{item.fpfs}}</td>
            <td>{{item.fpfs}}</td>
          </tr>
          </tbody>
        </table>
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
          jqbh: '',
          list2: []
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
        getList2() {
          let formDate = {'pageNum': this.pageNum, 'pageSize': '' + this.pageSize, 'nsrsbh': this.nsrsbh, 'jqbh': this.jqbh};
          this.$http.post('/api/queryInvoiceStore', formDate).then((response) => {
            this.totalCount = response.total;
            this.list2 = response.list;
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
          this.getList();
          this.getList2();
          this.tabIsShow = data.tableShow;
          this.pageNum = data.pageNum;
          this.nsrsbh = data.nsrsbh;
          this.jqbh = data.jqbh;
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
