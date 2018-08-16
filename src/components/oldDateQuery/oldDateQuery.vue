<template>
  <div class="invoiceInventory">
    <navAddress :first-add="firstAdd" :current-add="currentAdd"></navAddress>
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
          <td>{{index}}</td>
          <td>{{item.FP_DM}}</td>
          <td>{{item.JSHJ}}</td>
          <td>{{item.FPQQLSH}}</td>
          <td>{{item.FPQQLSH}}</td>
          <td>{{item.KPRQ}}</td>
          <td>{{item.KPRQ}}</td>
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
  import searchForm from 'components/searchForm/searchForm';

  export default {
    data() {
      return {
        scopShow: true,
        jqbhShow: false,
        totalCount: 0,
        pageSize: 5,
        pageNum: 1,
        firstAdd: '查询-统计查询',
        currentAdd: '验旧数据查询/导出',
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
          this.totalCount = response.count;
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
      navAddress,
      pagination,
      searchForm
    }
  };
</script>

<style lang="stylus" rel="stylesheet" scoped>
</style>
