<template>
    <div class="monthlyQuery">
      <navAddress :first-add="firstAdd" :current-add="currentAdd"></navAddress>
      <div class="search_form">
        <div class="search_conditions">
          <div class="search_item">
            <div class="search_label">开票日期：</div>
            <el-date-picker
              v-model="value"
              type="month"
              placeholder="----年--月">
            </el-date-picker>
          </div>
          <div class="search_btn blue-btn">查询</div>
          <div class="export_btn blue-btn">导出</div>
        </div>
      </div>
      <div class="search_table">
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
            <td width="16.666666%">100</td>
            <td  width="16.666666%">正数发票份数</td>
            <td width="16.666666%">20</td>
            <td width="16.666666%">负数发票份数</td>
            <td  width="16.666666%">10</td>
          </tr>
          </tbody>
        </table>
      </div>
      <div class="search_table">
        <div class="table_header">
          <p>税率统计</p>
        </div>
        <table>
          <thead>
          <tr>税率统计</tr>
          </thead>
          <tbody>
          <tr>
            <td width="23%">项目名称</td>
            <td width="11%">1</td>
            <td width="11%">2</td>
            <td width="11%">3</td>
            <td width="11%">4</td>
            <td width="11%">5</td>
            <td width="11%">6</td>
            <td width="11%">7</td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
</template>

<script type="text/ecmascript-6">
    import navAddress from 'components/navAddress/navAddress';
    export default {
      data() {
        return {
          firstAdd: '查询-统计查询',
          currentAdd: '月度报表查询/导出',
          value: new Date()
        };
      },
      components: {
        navAddress
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
        border 1px solid #797979
        border-bottom 0
    td
      text-align left
      padding-left 10px
</style>
