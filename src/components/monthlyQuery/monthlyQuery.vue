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
    </div>
</template>

<script type="text/ecmascript-6">
    import navAddress from 'components/navAddress/navAddress';
    export default {
      data() {
        return {
          firstAdd: '查询-统计查询',
          currentAdd: '月度报表查询/导出',
          value: ''
        };
      },
      components: {
        navAddress
      }
    };
</script>

<style lang="stylus" rel="stylesheet" scoped>

</style>
