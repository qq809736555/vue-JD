<template>
  <div class="invoiceState_wrapper">
    <navAddress :first-add="firstAdd" :current-add="currentAdd"></navAddress>
    <div class="search_form">
      <div class="search_conditions">
        <div class="search_item">
          <div class="search_label">开票日期：</div>
          <el-date-picker
            v-model="startTime"
            type="date"
            placeholder="选择日期">
          </el-date-picker>
          <span class="line">-</span>
          <el-date-picker
            v-model="endTime"
            type="date"
            placeholder="选择日期">
          </el-date-picker>
        </div>
        <div class="search_item">
          <div class="search_label">税号：</div>
          <input type="text" class="search_input">
        </div>
        <div class="search_item">
          <div class="search_label">发票状态：</div>
          <input type="text" class="search_input">
        </div>
        <div class="search_item">
          <div class="search_label">机器编号：</div>
          <input type="text" class="search_input">
        </div>
        <div class="search_btn blue-btn">查询</div>
        <div class="export_btn blue-btn" @click="exportBtn">导出</div>
      </div>
    </div>
    <div class="search_table">
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
        <tr v-for="(item, index) in this.$store.getters.getList" :key="item.id" v-if="index <= pageSize">
          <td>{{index}}</td>
          <td>{{item.EMAIL}}</td>
          <td>{{item.FPQQLSH}}</td>
          <td>{{item.FPZT}}</td>
          <td>{{item.GMF_NSRSBH}}</td>
        </tr>
        </tbody>
      </table>
      <pagination :total-count = "totalCount" :page-size="pageSize" @showNewPageSize="updatePageSize"></pagination>
    </div>
    <!-- 导出excel -->
    <iframe :src="iframeSrc" @click="downloadIframe"></iframe>
  </div>
</template>

<script type="text/ecmascript-6">
  import navAddress from 'components/navAddress/navAddress';
  import pagination from 'components/pagination/pagination';

  export default {
    data() {
      return {
        startTime: new Date(),
        endTime: new Date(),
        totalCount: 0,
        pageSize: 0,
        firstAdd: '查询-统计查询',
        currentAdd: '发票状态统计查询',
        iframeSrc: ''
      };
    },
    created () { // 初始化时currentPage赋值
      this.getList();
    },
    methods: {
      getList() {
        let formDate = {'currentPage': '1', 'pageSize': '' + this.pageSize};
        this.$http.post('/api/mvc/EntinvoiceRecord/entIRList.do', formDate).then((response) => {
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
      // 导出
      exportBtn() {
        this.iframeSrc = '/api/mvc/EntinvoiceRecord/fpExportExcel.do?CREATOR=1&START_TIME=20180810&END_TIME=20180810&FPQQLSH=&YWLX=&YWBH=&LYXT=&FP_DM=&FP_HM=&FPZT=&GMF_MC=&GMF_NSRSBH=&XSF_ID=007&&x-access-token=6ded3078-9ca5-4138-a0a1-9e72939cd4b8';
        this.downloadIframe();
      },
      downloadIframe() {
      }
    },
    components: {
      navAddress,
      pagination
    }
  };
</script>

<style lang="stylus" rel="stylesheet" scoped>
</style>
