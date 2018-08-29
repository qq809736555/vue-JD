<template>
    <div class="monthlyQuery">
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
            <td width="16.666666%">{{tabList.zfs}}</td>
            <td  width="16.666666%">正数发票份数</td>
            <td width="16.666666%">{{tabList.zsfs}}</td>
            <td width="16.666666%">负数发票份数</td>
            <td  width="16.666666%">{{tabList.fsfs}}</td>
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
              <td width="10">项目名称</td>
              <td width="15">销项正数金额</td>
              <td width="15">销项负数金额</td>
              <td width="15">实际销售金额</td>
              <td width="15">销项正数税额</td>
              <td width="15">销项负数税额</td>
              <td width="15">实际销项税额</td>
            </tr>
            <tr v-for="item in sjList" :key="item.id">
              <td width="10">{{item.sl}}</td>
              <td width="15">{{item.zsje}}</td>
              <td width="15">{{item.fsje}}</td>
              <td width="15">{{item.sjje}}</td>
              <td width="15">{{item.zsse}}</td>
              <td width="15">{{item.fsse}}</td>
              <td width="15">{{item.sjse}}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
</template>

<script type="text/ecmascript-6">
  import searchForm from 'components/searchForm/searchForm';

  export default {
    data() {
      return {
        JQBHShow: false,
        dataShow: true,
        tabIsShow: false,
        tabList: {},
        sjList: {}
      };
    },
    methods: {
      getList() {
        let formDate = {'nsrsbh': this.nsrsbh, 'kpyf': this.nowDate};
        this.$http.post('/api/monthReport', formDate).then((response) => {
          this.tabList = response;
          this.sjList = response.sjList;
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
        border 1px solid #e0e0e0
        border-bottom 0
    td
      text-align left
      padding-left 10px
</style>
