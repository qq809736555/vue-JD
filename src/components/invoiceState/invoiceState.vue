<template>
  <div class="invoiceState_wrapper">
    <navAddress :first-add="firstAdd" :current-add="currentAdd"></navAddress>
    <div class="search_form">
      <div class="search_conditions">
        <div class="search_item">
          <div class="search_label">税号：</div>
          <input type="text" v-model="kpdwdm" class="search_input">
        </div>
        <div class="search_item">
          <div class="search_label">发票状态：</div>
          <span class="icon-dropDown"></span>
          <select v-model="dictCode" class="search_select">
            <option :value="item.dictCode" v-for="item in taskTypeList" :key="item.id">{{item.dictName}}</option>
          </select>
        </div>
        <div class="search_item">
          <div class="search_label">机器编号：</div>
          <input type="text" v-model="jqbh" class="search_input">
        </div>
        <div class="search_btn blue-btn" @click="queryBtn">查询</div>
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
          <th width="25%">发票标志</th>
          <th width="15%">分发未开具发票份数</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(item, index) in this.$store.getters.getList" :key="item.id" v-if="index <= pageSize">
          <td>{{index+1}}</td>
          <td>{{item.kpdwdm}}</td>
          <td>{{item.jqbh}}</td>
          <td>{{item.taskType}}</td>
          <td>{{item.value}}</td>
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

  export default {
    data() {
      return {
        totalCount: 0,
        pageSize: 5,
        firstAdd: '查询-统计查询',
        currentAdd: '发票状态统计查询',
        iframeSrc: '',
        dictCode: '',
        taskTypeList: '',
        kpdwdm: '',
        jqbh: ''
      };
    },
    created () { // 初始化时currentPage赋值
      this.gitType();
      this.getList();
    },
    methods: {
      // 获取发票状态
      gitType() {
        this.$http.get('/api/getSysDictByType?dictType=预警').then((response) => {
          this.taskTypeList = response;
        });
      },
      getList() {
        let formDate = {'pageNum': '1', 'pageSize': '' + this.pageSize, 'taskType': this.dictCode, 'kpdwdm': '', 'jqbh': this.jqbh};
        this.$http.post('/api/queryInvoiceStates', formDate).then((response) => {
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
      // 查询
      queryBtn() {
        this.getList();
      },
      // 导出
      exportBtn() {
        window.open('/api/exportInvoiceStates?jqbh=' + this.jqbh + '&nsrsbh=' + this.nsrsbh + '&dictCode=' + this.dictCode);
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
