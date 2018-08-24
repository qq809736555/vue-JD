<template>
  <div class="invoiceInventory">
    <searchForm @tableShow="judgeTabShow" :scop-show="scopShow" :jqbh-show="jqbhShow"></searchForm>
    <div class="search_table" v-show="tabIsShow">
      <table>
        <thead>
        <tr>
          <th width="7%">序号</th>
          <th width="14%">发票代码</th>
          <th width="7%">份数</th>
          <th width="18%">发票起始号码</th>
          <th width="18%">发票终止号码</th>
          <th width="18%">开票起始日期</th>
          <th width="18%">开票截止日期</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(item, index) in this.$store.getters.getList" :key="item.id" v-if="index <= pageSize">
          <td>{{index+1}}</td>
          <td>{{item.fpdm}}</td>
          <td>{{item.number}}</td>
          <td>{{item.startNumber}}</td>
          <td>{{item.endNumber}}</td>
          <td>{{item.startTime}}</td>
          <td>{{item.endTime}}</td>
        </tr>
        </tbody>
      </table>
      <pagination :total-count="totalCount" :page-num="pageNum" :page-size="pageSize" @showNewPageSize="updatePageSize" @currentPage="currentPage"></pagination>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import pagination from 'components/pagination/pagination';
  import searchForm from 'components/searchForm/searchForm';

  export default {
    data() {
      return {
        scopShow: true,
        jqbhShow: false,
        totalCount: 0,
        pageSize: 5,
        pageNum: 1,
        tabIsShow: false,
        nsrsbh: '',
        jqbh: '',
        startTime: new Date(),
        endTime: new Date()
      };
    },
    methods: {
      getList() {
        let formDate = {'pageNum': this.pageNum, 'pageSize': '' + this.pageSize, 'nsrsbh': this.nsrsbh, 'startTime': this.startTime, 'endTime': this.endTime};
        this.$http.post('/api/queryYjsj', formDate).then((response) => {
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
        this.startTime = data.startTime;
        this.endTime = data.endTime;
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
