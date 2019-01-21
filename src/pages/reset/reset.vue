<template>
    <div class="reset_wrapper">
      <div class="charts">
        <div class="myCharts" id="myChartDay"></div>
        <div class="aaa" v-show="this.$store.getters.getLoading">
          <v-loading type="spiningDubbles" class="bbb" color="#d9544e"></v-loading>
        </div>
        <div class="myCharts" id="myChartMonth"></div>
      </div>
      <div class="search_table">
        <div class="table_name">1、基本信息</div>`
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
            <td>{{list2.nsrsbh}}</td>
            <td>{{list2.kpdwmc}}</td>
            <td>{{list2.coreNums}}</td>
            <td>{{list2.enableCoreNums}}</td>
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
            <td>{{list2.dzkpxe}}</td>
            <td>{{list2.zsljxe}}</td>
            <td>{{list2.fsljxe}}</td>
            <td>{{list2.lxkpsc}}</td>
            <td>{{list2.lxzsljje}}</td>
            <td>{{list2.lxfsljje}}</td>
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
            <td>{{list3.openNums}}</td>
            <td>{{list3.unsignedNums}}</td>
            <td>{{list3.signedNoUploadNums}}</td>
            <td>{{list3.checkSignFailNums}}</td>
          </tr>
          </tbody>
        </table>
        <div class="search" v-show="this.$store.getters.getLoading2">
          <v-loading type="spiningDubbles" class="searchbbb" color="#d9544e"></v-loading>
        </div>
        <table>
          <thead>
          <tr>
            <th width="25%">空白发票数量（张)</th>
            <th width="25%">日均开票量</th>
            <th width="25%">预计可用天数</th>
            <th width="25%">成品油库存余量（L)</th>
          </tr>
          </thead>
          <tbody>
          <tr>
            <td>{{list4.blankNums}}</td>
            <td>{{list4.avgOpenNums}}</td>
            <td>{{list4.available_open}}</td>
            <td>{{list4.productStockNums}}</td>
          </tr>
          </tbody>
        </table>
        <div class="table_desc">（日均开票使用量是通过近10天使用量计算得出的）</div>
      </div>
    </div>
</template>

<script type="text/ecmascript-6">
    import echarts from 'echarts';
    import { VueLoading } from 'vue-loading-template';
    export default {
      data() {
        return {
          list: {},
          list2: {},
          list3: {},
          list4: {}
        };
      },
      mounted() {
        this.getList2();
        this.getList3();
        this.getList4();
        this.getList1();
      },
      methods: {
        getList1() {
          let myChartDay = echarts.init(document.getElementById('myChartDay'));
          let optionDay = {
            title: {
              show: true,
              // 标题文本
              text: '日开票量统计',
              top: 'bottom',
              left: 'center',
              textStyle: {
                // 文字颜色
                color: '#333',
                // 字体大小
                fontSize: 14
              }
            },
            xAxis: {
              type: 'category',
              data: '',
              name: '/天',
              axisLabel: {
                interval: 0, // 信息全部显示
                rotate: -30 // -30倾斜
              }
            },
            yAxis: {
              type: 'value',
              name: '/张'
            },
            series: [{
              data: '',
              type: 'line',
              // 显示数值
              itemStyle: {
                normal: {
                  label: {
                    show: true
                  }
                }
              }
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
              left: 'center',
              textStyle: {
                // 文字颜色
                color: '#333',
                // 字体大小
                fontSize: 14
              }
            },
            xAxis: {
              type: 'category',
              data: '',
              name: '/月',
              axisLabel: {
                interval: 0, // 信息全部显示
                rotate: -30 // -30倾斜
              }
            },
            yAxis: {
              type: 'value',
              name: '/张'
            },
            series: [{
              data: '',
              type: 'line',
              // 显示数值
              itemStyle: {
                normal: {
                  label: {
                    show: true
                  }
                }
              }
            }]
          };
          myChartMonth.setOption(optionMonth);
          let formDate = '';
          let chart_dayKpNums_X = [];
          let chart_dayKpNums_Y = [];
          this.$http.post('/api/chartQueryDay', formDate).then((response) => {
            this.list.dayKpNums = response;
            for (let i = 0; i < this.list.dayKpNums.length; i++) {
              chart_dayKpNums_X.push(this.list.dayKpNums[i].kprq);
              chart_dayKpNums_Y.push(this.list.dayKpNums[i].dayKpNums);
            }
            this.$nextTick(() => {
              let myChartDay = echarts.init(document.getElementById('myChartDay'));
              let optionDay = {
                title: {
                  show: true,
                  // 标题文本
                  text: '日开票量统计',
                  top: 'bottom',
                  left: 'center',
                  textStyle: {
                    // 文字颜色
                    color: '#333',
                    // 字体大小
                    fontSize: 14
                  }
                },
                xAxis: {
                  type: 'category',
                  data: chart_dayKpNums_X,
                  name: '/天',
                  axisLabel: {
                    interval: 0, // 信息全部显示
                    rotate: -30 // -30倾斜
                  }
                },
                yAxis: {
                  type: 'value',
                  name: '/张'
                },
                series: [{
                  data: chart_dayKpNums_Y,
                  type: 'line',
                  // 显示数值
                  itemStyle: {
                    normal: {
                      label: {
                        show: true
                      }
                    }
                  }
                }]
              };
              myChartDay.setOption(optionDay);
              this.$store.commit('changeLoading', false);
            });
          }).catch((error) => {
            console.log(error);
            this.$store.commit('changeLoading', false);
          });
          this.$http.post('/api/chartQueryMonth', formDate).then((response) => {
            this.list.monthKpNums = response;
            let chart_monthKpNums_X = [];
            let chart_monthKpNums_Y = [];
              for (let i = 0; i < this.list.monthKpNums.length; i++) {
                chart_monthKpNums_X.push(this.list.monthKpNums[i].kprq);
                chart_monthKpNums_Y.push(this.list.monthKpNums[i].monthKpNums);
              }
            this.$nextTick(() => {
              let myChartMonth = echarts.init(document.getElementById('myChartMonth'));
              let optionMonth = {
                title: {
                  show: true,
                  // 标题文本
                  text: '月开票量统计',
                  top: 'bottom',
                  left: 'center',
                  textStyle: {
                    // 文字颜色
                    color: '#333',
                    // 字体大小
                    fontSize: 14
                  }
                },
                xAxis: {
                  type: 'category',
                  data: chart_monthKpNums_X,
                  name: '/月',
                  axisLabel: {
                    interval: 0, // 信息全部显示
                    rotate: -30 // -30倾斜
                  }
                },
                yAxis: {
                  type: 'value',
                  name: '/张',
                  axisLabel: {
                    interval: 0, // 信息全部显示
                    show: true,
                    margin: 0,
                    showMaxLabel: true
                  }
                },
                series: [{
                  data: chart_monthKpNums_Y,
                  type: 'line',
                  // 显示数值
                  itemStyle: {
                    normal: {
                      label: {
                        show: true
                      }
                    }
                  }
                }]
              };
              myChartMonth.setOption(optionMonth);
              this.$store.commit('changeLoading', false);
            });
          }).catch((error) => {
            console.log(error);
            this.$store.commit('changeLoading', false);
          });
        },
        getList2() {
          let formDate = '';
          this.$http.post('/api/basicQuery', formDate).then((response) => {
            this.list2 = response;
          });
        },
        getList4() {
          let formDate = '';
          this.$http.post('/api/statisticalQuery', formDate).then((response) => {
            this.$store.commit('changeLoading2', false);
            this.list4 = response;
          });
        },
        getList3() {
          let formDate = '';
          this.$http.post('/api/statisticalCountQuery', formDate).then((response) => {
            this.list3 = response;
          });
        }
      },
      components: {
        'v-loading': VueLoading
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
      padding 10px 0px 30px 0px
      background #fff
      border-radius 5px
      box-shadow 0 3px 5px 0 rgba(210,210,210,0.5)
      display flex
      position relative
      .myCharts
        flex 1
        height 300px
      .aaa
        position absolute
        top 0
        left 0
        z-index 1000
        width 100%
        height 100%
        .bbb
          position absolute
          top 0
          bottom 0
          left 0
          right 0
          margin auto
          width 100px!important
          height 100px!important
          fill #e2231a!important
    .search_table
      .search
        position absolute
        bottom 0
        left 0
        z-index 1000
        width 100%
        height 30%
        .searchbbb
          position absolute
          top 0
          bottom 0
          left 0
          right 0
          margin auto
          width 90px!important
          height 90px!important
          fill #e2231a!important
</style>


