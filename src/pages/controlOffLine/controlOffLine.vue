<template>
    <div class="controlOffLine_wrapper">
      <searchForm @tableShow="judgeTabShow" :sh-show="shShow" :set-value="setValue"></searchForm>
      <div class="search_table" v-show="tabIsShow">
        <div class="table_name">1、离线开票时长预警</div>
        <table>
          <thead>
            <tr>
              <th width="30%">核心板编号</th>
              <th width="30%">已离线开票时长（h）</th>
              <th width="15%">预警值（h）</th>
              <th width="15%">税控值（h）</th>
              <th width="10%">状态</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in this.list" :key="item.id">
              <td>{{item.kpdwdm}}</td>
              <td>{{item.jqbh}}</td>
              <td>{{item.yjz}}</td>
              <td>{{item.skserverYjz}}</td>
              <td>{{offLineStatus[item.status]}}</td>
            </tr>
          </tbody>
        </table>
        <pagination :total-count="totalCount" :page-size="pageSize" :page-num="pageNum" @showNewPageSize="updatePageSize" @currentPage="currentPage"></pagination>
      </div>
      <div class="search_table" v-show="tabIsShow">
        <div class="table_name">2、离线开票正数累计金额预警</div>
        <table>
          <thead>
          <tr>
            <th width="30%">核心板编号</th>
            <th width="33%">已离线开票正数累计金额预警（元）</th>
            <th width="12%">预警值（h）</th>
            <th width="15%">税控值（h）</th>
            <th width="10%">状态</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="item in this.list2" :key="item.id">
            <td>{{item.kpdwdm}}</td>
            <td>{{item.nsrsbh}}</td>
            <td>{{item.yjz}}</td>
            <td>{{item.skserverYjz}}</td>
            <td>{{offLineStatus[item.status]}}</td>
          </tr>
          </tbody>
        </table>
        <pagination :total-count="totalCount2" :page-size="pageSize2" :page-num="pageNum2" @showNewPageSize="updatePageSize2" @currentPage="currentPage"></pagination>
      </div>
      <div class="search_table" v-show="tabIsShow">
        <div class="table_name">3、离线开票负数累计金额预警</div>
        <table>
          <thead>
          <tr>
            <th width="30%">核心板编号</th>
            <th width="33%">已离线开票负数累计金额预警（元）</th>
            <th width="12%">预警值（h）</th>
            <th width="15%">税控值（h）</th>
            <th width="10%">状态</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="item in this.list3" :key="item.id">
            <td>{{item.kpdwdm}}</td>
            <td>{{item.nsrsbh}}</td>
            <td>{{item.yjz}}</td>
            <td>{{item.skserverYjz}}</td>
            <td>{{offLineStatus[item.status]}}</td>
          </tr>
          </tbody>
        </table>
        <pagination :total-count="totalCount3" :page-size="pageSize3" :page-num="pageNum3" @showNewPageSize="updatePageSize3" @currentPage="currentPage"></pagination>
      </div>
    </div>
</template>

<script type="text/ecmascript-6">
  import searchForm from 'components/searchForm/searchForm';
  import pagination from 'components/pagination/pagination';
  export default {
      data() {
        return {
          // 不显示税号筛选
          shShow: false,
          setValue: true,
          tabIsShow: false,
          totalCount: 0,
          totalCount2: 0,
          totalCount3: 0,
          pageSize: 5,
          pageSize2: 5,
          pageSize3: 5,
          pageNum: 1,
          pageNum2: 1,
          pageNum3: 1,
          nsrsbh: '',
          jqbh: '',
          list: [],
          list2: [],
          list3: [],
          // 离线参数状态
          offLineStatus: {
            1: '正常',
            0: '预警'
          },
          allTaskTypes: ''
        };
      },
      methods: {
        getList() {
          let formDate = {'pageNum': this.pageNum, 'pageSize': '' + this.pageSize, 'taskType': this.allTaskTypes, 'nsrsbh': this.nsrsbh, 'jqbh': this.jqbh};
          this.$http.post('/api/queryInvoiceStates', formDate).then((response) => {
            this.totalCount = response.total;
            this.list = response.list;
          });
        },
        getList2() {
          let formDate = {'pageNum': this.pageNum2, 'pageSize': '' + this.pageSize2, 'taskType': this.allTaskTypes, 'nsrsbh': this.nsrsbh, 'jqbh': this.jqbh};
          this.$http.post('/api/queryInvoiceStates', formDate).then((response) => {
            this.totalCount2 = response.total;
            this.list2 = response.list;
          });
        },
        getList3() {
          let formDate = {'pageNum': this.pageNum3, 'pageSize': '' + this.pageSize3, 'taskType': this.allTaskTypes, 'nsrsbh': this.nsrsbh, 'jqbh': this.jqbh};
          this.$http.post('/api/queryInvoiceStates', formDate).then((response) => {
            this.totalCount3 = response.total;
            this.list3 = response.list;
          });
        },
        // 判断列表展示
        judgeTabShow(data) {
          // 获取全部发票标记
          this.allTaskTypes = data.getAllTaskTypes;
          this.getList();
          this.getList2();
          this.getList3();
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
        updatePageSize2(data) {
          this.pageSize2 = data.page;// 改变了父组件的值
          this.getList2();
        },
        updatePageSize3(data) {
          this.pageSize3 = data.page;// 改变了父组件的值
          this.getList3();
        },
        // 改变当前页
        currentPage(data) {
          this.pageNum = data;
          this.getList();
        },
        currentPage2(data) {
          this.pageNum2 = data;
          this.getList2();
        },
        currentPage3(data) {
          this.pageNum3 = data;
          this.getList3();
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
