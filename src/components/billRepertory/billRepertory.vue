<template>
    <div class="invoiceInventory_wrapper">
      <navAddress :first-add="firstAdd" :current-add="currentAdd"></navAddress>
      <div class="search_form">
        <div class="search_conditions">
          <div class="search_item">
            <div class="search_label">税号：</div>
            <input type="text" v-model="nsrsbhs" class="search_input">
          </div>
          <div class="search_item">
            <div class="search_label">机器编号：</div>
            <input type="text" v-model="jqbhs" class="search_input">
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
              <th width="25%">终端编号</th>
              <th width="15%">分发未开具发票份数</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in this.$store.getters.getList" :key="item.id" v-if="index < pageSize">
              <td>{{index + 1}}</td>
              <td>{{item.nsrsbh}}</td>
              <td>{{item.jqbh}}</td>
              <td>{{item.nsrsbh}}</td>
              <td>{{item.zdbs}}</td>
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
          pageSize: 20,
          firstAdd: '统计查询',
          currentAdd: '发票库存查询',
          iframeSrc: '',
          nsrsbhs: '',
          jqbhs: ''
        };
      },
      created () { // 初始化时currentPage赋值
        this.getList();
      },
      methods: {
        getList() {
          let formDate = {'pageNum': '1', 'pageSize': '' + this.pageSize, 'nsrsbhs': [this.nsrsbhs], 'jqbhs': [this.jqbhs]};
          this.$http.post('/api/queryInvoiceStore', formDate).then((response) => {
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
          window.open('/api/exportInvoiceStore?nsrsbh=' + this.nsrsbh + '&jqbh=' + this.jqbh);
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
