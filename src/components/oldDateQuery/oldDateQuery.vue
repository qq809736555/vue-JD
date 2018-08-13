<template>
  <div class="invoiceInventory">
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
        <div class="search_btn blue-btn">查询</div>
        <div class="export_btn blue-btn">导出</div>
      </div>
    </div>
    <div class="search_table">
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
      <pagination :total-count = "totalCount" :page-size="pageSize"></pagination>
    </div>
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
        currentAdd: '验旧数据查询/导出'
      };
    },
    created () { // 初始化时currentPage赋值
      let formDate = {'currentPage': '1', 'pageSize': '20', 'CREATOR': '1', 'START_TIME': '20180627', 'END_TIME': '20180807', 'FPQQLSH': '', 'YWLX': '', 'YWBH': '', 'LYXT': '', 'FP_DM': '', 'FP_HM': '', 'FPZT': '', 'GMF_MC': '', 'GMF_NSRSBH': '', 'XSF_ID': '007'};
      this.$http.post('/api/mvc/EntinvoiceRecord/entIRList.do', formDate).then((response) => {
        this.totalCount = response.count;
        this.$store.commit('changeList', response.list);
        this.pageSize = response.pageSize;
      });
    },
    components: {
      navAddress,
      pagination
    }
  };
</script>

<style lang="stylus" rel="stylesheet" scoped>
</style>
