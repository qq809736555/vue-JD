<template>
    <div class="reset_wrapper">
      <div class="charts">
        <div class="myCharts" id="myChartDay"></div>
        <div class="myCharts" id="myChartMonth"></div>
      </div>
      <div class="search_table">
        <div class="table_name">1、基本信息</div>
        <table>
          <thead>
          <tr>
            <th width="25%">纳税人识别号</th>
            <th width="25%">纳税人名称</th>
            <th width="25%">核心板数量</th>
            <th width="25%">启用核心板数量</th>
          </tr>
          </thead>
          <tbody>
          <tr>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          </tbody>
        </table>
        <table>
          <thead>
          <tr>
            <th width="16.7%">单张发票开票金额限额</th>
            <th width="16.7%">正数票累计金额限额</th>
            <th width="16.6%">负数票累计金额限额</th>
            <th width="16.6%">离线开票时长</th>
            <th width="16.7%">离线正数累计金额</th>
            <th width="16.7%">离线负数累计金额</th>
          </tr>
          </thead>
          <tbody>
          <tr>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          </tbody>
        </table>
      </div>
      <div class="search_table">
        <div class="table_name">2、查询信息</div>
        <table>
          <thead>
          <tr>
            <th width="25%">发票开具数量</th>
            <th width="25%">未签名发票数量</th>
            <th width="25%">未上传发票数量</th>
            <th width="25%">验签失败发票数量</th>
          </tr>
          </thead>
          <tbody>
          <tr>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          </tbody>
        </table>
        <table>
          <thead>
          <tr>
            <th width="16.7%">空白发票数量（张)</th>
            <th width="16.7%">日均开票量</th>
            <th width="16.6%">预计可用天数</th>
            <th width="16.6%">成品油库存余量（L)</th>
            <th width="16.7%">日均使用量</th>
            <th width="16.7%">预计可用天数</th>
          </tr>
          </thead>
          <tbody>
          <tr>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
          </tbody>
        </table>
        <div class="table_desc">（日均开票、成品油使用量是通过近10天使用量计算得出的）</div>
      </div>
    </div>
</template>

<script type="text/ecmascript-6">
    import echarts from 'echarts';
    export default {
      mounted() {
        let myChartDay = echarts.init(document.getElementById('myChartDay'));
        let optionDay = {
          title: {
            show: true,
            // 标题文本
            text: '日开票量统计',
            top: 'bottom',
            left: 'center'
          },
          xAxis: {
            type: 'category',
            data: ['1', '2', '3', '4', '5', '6', '7', '8'],
            name: '/天'
          },
          yAxis: {
            type: 'value',
            name: '/W张'
          },
          series: [{
            data: [22, 28, 26, 35, 29, 40, 20, 15],
            type: 'line'
          }]
        };
        myChartDay.setOption(optionDay);
        let myChartMonth = echarts.init(document.getElementById('myChartMonth'));
        let optionMonth = {
          title: {
            show: true,
            // 标题文本
            text: '月开票量统计',
            top: 'bottom',
            left: 'center'
          },
          xAxis: {
            type: 'category',
            data: ['1', '2', '3', '4', '5', '6', '7', '8'],
            name: '/月'
          },
          yAxis: {
            type: 'value',
            name: '/W张'
          },
          series: [{
            data: [50, 80, 100, 180, 100, 30, 19, 70],
            type: 'line'
          }]
        };
        myChartMonth.setOption(optionMonth);
      }
    };
</script>

<style lang="stylus" rel="stylesheet" scoped>
  .reset_wrapper
    width 100%
    height 100%
    position relative
    text-align center
    .charts
      width 100%
      height auto
      padding 10px 30px 20px 30px
      background #fff
      border-radius 5px
      box-shadow 0 3px 5px 0 rgba(210,210,210,0.5)
      display flex
      .myCharts
        flex 1
        height 300px
</style>
