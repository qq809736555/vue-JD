<template>
    <div class="controlBillState_wrapper">
      <searchForm @tableShow="judgeTabShow" :set-type="setType" :set-value="setValue" :type-show="typeShow" :export-show="false"></searchForm>
      <div class="search_table" v-show="tabIsShow">
        <div class="table_name">1、发票未签名张数预警</div>
        <table>
          <thead>
          <tr>
            <th width="7%">序号</th>
            <th width="30%">核心板编号</th>
            <th width="30%">已产生的发票未签名张数（张）</th>
            <th width="17%">预警值（张）</th>
            <th width="16%">状态</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(item,index) in this.list" :key="item.id">
            <td>{{index+1}}</td>
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
        <div class="table_name">2、发票未上传张数预警</div>
        <table>
          <thead>
          <tr>
            <th width="7%">序号</th>
            <th width="30%">核心板编号</th>
            <th width="30%">已产生的发票未上传张数（张）</th>
            <th width="17%">预警值（张）</th>
            <th width="16%">状态</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(item,index) in this.list2" :key="item.id">
            <td>{{index+1}}</td>
            <td>{{item.jqbh}}</td>
            <td>{{item.value}}</td>
            <td>{{item.yjz}}</td>
            <td>{{offLineStatus[item.status]}}</td>
          </tr>
          </tbody>
        </table>
        <pagination :total-count="totalCount2" :page-size="pageSize2" :page-num="pageNum2" @showNewPageSize="updatePageSize2" @currentPage="currentPage"></pagination>
      </div>
      <div class="search_table" v-show="tabIsShow">
        <div class="table_name">3、发票验签失败预警</div>
        <table>
          <thead>
          <tr>
            <th width="7%">序号</th>
            <th width="30%">核心板编号</th>
            <th width="30%">已产生验签失败发票张数（张）</th>
            <th width="17%">预警值（张）</th>
            <th width="16%">状态</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(item,index) in this.list3" :key="item.id">
            <td>{{index+1}}</td>
            <td>{{item.jqbh}}</td>
            <td>{{item.value}}</td>
            <td>{{item.yjz}}</td>
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
        setValue: true,
        setType: 'BillState',
        tabIsShow: false,
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
        nsrsbh: '',
        jqbh: '',
        list: [],
        list2: [],
        list3: [],
        // 离线参数状态
        offLineStatus: {
          0: '正常',
          1: '预警'
        }
      };
    },
    methods: {
      getList() {
        let formDate = {'pageNum': this.pageNum, 'pageSize': '' + this.pageSize, 'taskType': 7, 'nsrsbh': this.nsrsbh, 'jqbh': this.jqbh};
        this.$http.post('/api/queryInvoiceStates', formDate).then((response) => {
          this.totalCount = response.total;
          this.list = response.list;
        });
      },
      getList2() {
        let formDate = {'pageNum': this.pageNum2, 'pageSize': '' + this.pageSize2, 'taskType': 2, 'nsrsbh': this.nsrsbh, 'jqbh': this.jqbh};
        this.$http.post('/api/queryInvoiceStates', formDate).then((response) => {
          this.totalCount2 = response.total;
          this.list2 = response.list;
        });
      },
      getList3() {
        let formDate = {'pageNum': this.pageNum3, 'pageSize': '' + this.pageSize3, 'taskType': 8, 'nsrsbh': this.nsrsbh, 'jqbh': this.jqbh};
        this.$http.post('/api/queryInvoiceStates', formDate).then((response) => {
          this.totalCount3 = response.total;
          this.list3 = response.list;
        });
      },
      // 判断列表展示
      judgeTabShow(data) {
        // 获取全部发票标记
        this.tabIsShow = data.tableShow;
        this.pageNum = data.pageNum;
        this.nsrsbh = data.nsrsbh;
        this.jqbh = data.jqbh;
        this.getList();
        this.getList2();
        this.getList3();
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
