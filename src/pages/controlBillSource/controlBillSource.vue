<template>
    <div class="controlBillSource_wrapper">
      <searchForm @tableShow="judgeTabShow" :set-type="setType" :set-value="setValue" :type-show="typeShow"></searchForm>
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
          <tr v-for="(item, index) in list" :key="item.id" v-if="index < pageSize">
            <td>{{index + 1}}</td>
            <td>{{item.jqbh}}</td>
            <td>{{item.jqbh}}</td>
            <td>{{item.value}}</td>
            <td>{{item.yjz}}</td>
            <td>{{offLineStatus[item.status]}}</td>
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
            <th width="23.25%">核心板编号</th>
            <th width="23.25%">剩余成品油数量（L)</th>
            <th width="23.25%">预警值（L）</th>
            <th width="23.25%">状态</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(item, index) in list2" :key="item.id" v-if="index < pageSize2">
            <td>{{index + 1}}</td>
            <td>{{item.jqbh}}</td>
            <td>{{item.value}}</td>
            <td>{{item.yjz}}</td>
            <td>{{offLineStatus[item.status]}}</td>
          </tr>
          </tbody>
        </table>
        <pagination :total-count="totalCount2" :page-size="pageSize2" :page-num="pageNum2" @showNewPageSize="updatePageSize2" @currentPage="currentPage2"></pagination>
      </div>
      <div class="search_table" v-show="tabIsShow">
        <div class="table_name">3、空白发票监控预警</div>
        <table>
          <thead>
          <tr>
            <th width="7%">序号</th>
            <th width="31%">核心板编号</th>
            <th width="31%">发票重复号段</th>
            <th width="31%">状态</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(item, index) in list3" :key="item.id" v-if="index < pageSize3">
            <td>{{index + 1}}</td>
            <td>{{item.jqbh}}</td>
            <td>{{''}}</td>
            <td>{{offLineStatus[item.status]}}</td>
          </tr>
          </tbody>
        </table>
        <pagination :total-count="totalCount3" :page-size="pageSize3" :page-num="pageNum3" @showNewPageSize="updatePageSize3" @currentPage="currentPage3"></pagination>
      </div>
    </div>
</template>

<script type="text/ecmascript-6">
  import pagination from 'components/pagination/pagination';
  import searchForm from 'components/searchForm/searchForm';

  export default {
      data() {
        return {
          setValue: true,
          setType: 'BillSource',
          typeShow: false,
          totalCount: 0,
          totalCount2: 0,
          totalCount3: 0,
          pageSize: 5,
          pageSize2: 5,
          pageSize3: 5,
          pageNum: 1,
          pageNum2: 1,
          pageNum3: 1,
          tabIsShow: false,
          nsrsbh: '',
          jqbh: '',
          dictCode: '',
          list: [],
          list2: [],
          list3: [],
          // 离线参数状态
          offLineStatus: {
            1: '正常',
            0: '预警'
          }
        };
      },
      methods: {
        getList() {
          let formDate = {'pageNum': this.pageNum, 'pageSize': '' + this.pageSize, 'taskType': 1, 'nsrsbh': this.nsrsbh, 'jqbh': this.jqbh};
          this.$http.post('/api/queryInvoiceStates', formDate).then((response) => {
            this.totalCount = response.total;
            this.list = response.list;
            this.pageSize = response.pageSize;
          });
        },
        getList2() {
          let formDate = {'pageNum': this.pageNum2, 'pageSize': '' + this.pageSize2, 'taskType': 11, 'nsrsbh': this.nsrsbh, 'jqbh': this.jqbh};
          this.$http.post('/api/queryInvoiceStates', formDate).then((response) => {
            this.totalCount2 = response.total;
            this.list2 = response.list;
            this.pageSize2 = response.pageSize;
          });
        },
        getList3() {
          let formDate = {'pageNum': this.pageNum3, 'pageSize': '' + this.pageSize3, 'taskType': 12, 'nsrsbh': this.nsrsbh, 'jqbh': this.jqbh};
          this.$http.post('/api/queryInvoiceStates', formDate).then((response) => {
            this.totalCount3 = response.total;
            this.list3 = response.list;
            this.pageSize3 = response.pageSize;
          });
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
        },
        // 判断列表展示
        judgeTabShow(data) {
          this.tabIsShow = data.tableShow;
          this.pageNum = data.pageNum;
          this.nsrsbh = data.nsrsbh;
          // 获取全部发票标记
          this.nsrsbh = data.nsrsbh.split(',')[0];
          this.jqbh = data.jqbh;
          this.getList();
          this.getList2();
          this.getList3();
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
