<template>
    <div class="controlBillSource_wrapper">
      <searchForm @tableShow="judgeTabShow" :set-value="setValue"></searchForm>
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
            <th width="23.25%">核心板编号</th>
            <th width="23.25%">剩余成品油数量（L)</th>
            <th width="23.25%">预警值（张）</th>
            <th width="23.25%">状态</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(item, index) in list2" :key="item.id" v-if="index < pageSize2">
            <td>{{index + 1}}</td>
            <td>{{item.kpdwdm}}</td>
            <td>{{item.jqbh}}</td>
            <td>{{item.taskType}}</td>
            <td>{{item.value}}</td>
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
            <td>{{item.taskType}}</td>
            <td>{{item.value}}</td>
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
          list2: {},
          list3: {}
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
          let formDate = {'pageNum': this.pageNum2, 'pageSize': '' + this.pageSize2, 'taskType': this.dictCode, 'nsrsbh': this.nsrsbh, 'jqbh': this.jqbh};
          this.$http.post('/api/queryInvoiceStates', formDate).then((response) => {
            this.totalCount2 = response.total;
            this.list2 = response.list;
            this.pageSize2 = response.pageSize;
          });
        },
        getList3() {
          let formDate = {'pageNum': this.pageNum3, 'pageSize': '' + this.pageSize3, 'taskType': this.dictCode, 'nsrsbh': this.nsrsbh, 'jqbh': this.jqbh};
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
          this.getList();
          this.getList2();
          this.getList3();
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
