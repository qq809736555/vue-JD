<template>
    <div class="searchForm_wrapper">
      <div class="search_form">
        <div class="search_conditions">
          <div class="search_item" v-show="dataShow">
            <div class="search_label">开票日期：</div>
            <el-date-picker
              v-model="nowDate"
              type="month"
              placeholder="----年--月">
            </el-date-picker>
          </div>
          <div class="search_item" v-show="scopShow">
            <div class="search_label">开票日期：</div>
            <el-date-picker
              v-model="startTime"
              :picker-options="dateBefore"
              type="date"
              placeholder="选择日期">
            </el-date-picker>
            <span class="line">-</span>
            <el-date-picker
              v-model="endTime"
              type="date"
              :picker-options="dateAfter"
              placeholder="选择日期">
            </el-date-picker>
          </div>
          <div class="search_item">
            <div class="search_label">税号：</div>
            <span class="icon-dropDown"></span>
            <select @change="SHSelect" v-model="nsrsbh" class="search_select">
              <option value="全部">全部</option>
              <option v-for="option1 in shuiHao" :value="option1.nsrsbh" :key="option1.id">{{option1.nsrsbh}}<span>/{{option1.dwmc}}</span></option>
            </select>
          </div>
          <div class="search_item" v-show="jqbhShow">
            <div class="search_label">机器编号：</div>
            <span class="icon-dropDown"></span>
            <select v-model="jqbh" class="search_select">
              <option value="全部">全部</option>
              <option v-for="option2 in selection" :value="option2.jqbh" :key="option2.id">{{option2.jqbh}}</option>
            </select>
          </div>
          <div class="search_item" v-show="typeShow">
            <div class="search_label">发票标志：</div>
            <span class="icon-dropDown"></span>
            <select v-model="dictCode" class="search_select">
              <option value="">全部</option>
              <option :value="item.dictCode" v-for="item in taskTypeList" :key="item.id">{{item.dictName}}</option>
            </select>
          </div>
          <div class="search_btn_wrapper">
            <div class="search_btn red-btn" @click="queryBtn">查询</div>
            <div class="export_btn red-btn" @click="exportBtn">导出</div>
          </div>
        </div>
      </div>
    </div>
</template>

<script type="text/ecmascript-6">
    export default {
      props: {
        dataShow: {
          type: Boolean,
          default: false
        },
        scopShow: {
          type: Boolean,
          default: false
        },
        jqbhShow: {
          type: Boolean,
          default: true
        },
        typeShow: {
          type: Boolean,
          default: false
        }
      },
      data() {
        return {
          nowDate: new Date().setMonth((new Date()).getMonth() - 1),
          CnowDate: '',
          startTime: new Date().setTime((new Date()).getTime() - 24 * 60 * 60 * 1000),
          CstartTime: '',
          endTime: new Date().setTime((new Date()).getTime() - 24 * 60 * 60 * 1000),
          dateBefore: {
            disabledDate: (time) => {
              let beginDateVal = this.endTime;
              if (beginDateVal) {
                return time.getTime() > beginDateVal;
              }
            }
          },
          dateAfter: {
            disabledDate: (time) => {
              let beginDateVal = this.startTime;
              if (beginDateVal) {
                return time.getTime() < beginDateVal;
              }
            }
          },
          CendTime: '',
          nsrsbh: '全部',
          Cnsrsbh: '',
          jqbh: '全部',
          Cjqbh: '',
          dictCode: '',
          CdictCode: '',
          taskTypeList: '',
          shuiHao: [],
          selection: []
        };
      },
      created () { // 初始化时currentPage赋值
        this.getSH();
        this.gitType();
      },
      methods: {
        // 税号选择，机器编码对应改变
        SHSelect() {
          if (this.nsrsbh === '全部') {
            this.Cnsrsbh = '';
            this.jqbh = '全部';
            this.selection = [];
            return;
          } else {
            this.Cnsrsbh = this.nsrsbh;
          }
          this.$http.get('/api/getMachNumByNsrsbh?nsrsbh=' + this.Cnsrsbh).then((response) => {
            this.jqbh = '全部';
            this.selection.length = 0;
            for (var i = 0; i < response.length; i++) {
              this.selection.push(response[i]);
            }
          });
        },
        // 获取税号
        getSH() {
          this.$http.get('/rbac/mvc/sallerInfo/getByNsrsbh?xfdm=' + JSON.parse(window.localStorage.getItem('userInfo')).xfdm).then((response) => {
            this.shuiHao = response.nsrsbhList || [];
            if (this.nsrsbh === '全部') {
              for (let i = 0; i < this.shuiHao.length; i++) {
                this.Cnsrsbh += this.shuiHao[i].nsrsbh + ',';
              }
            }
          });
        },
        // 获取发票状态
        gitType() {
          this.$http.get('/api/getSysDictByType?dictType=预警').then((response) => {
            this.taskTypeList = response;
          });
        },
        //  日期处理函数
        dateDeal(el) {
          if (el < 10) {
            return '0' + el;
          } else {
            return el;
          }
        },
        lastData() {
          if (this.nsrsbh !== '全部') {
            this.Cnsrsbh = this.nsrsbh;
          }
          if (this.jqbh === '全部') {
            this.Cjqbh = '';
          } else {
            this.Cjqbh = this.jqbh;
          }
          if (this.dictCode === '全部') {
            this.CdictCode = '';
          } else {
            this.CdictCode = this.dictCode;
          }
          let dateA = new Date(this.startTime);
          let dateB = new Date(this.endTime);
          this.CstartTime = dateA.getFullYear() + this.dateDeal(dateA.getMonth() + 1) + this.dateDeal(dateA.getDate());
          this.CendTime = dateB.getFullYear() + this.dateDeal(dateB.getMonth() + 1) + this.dateDeal(dateB.getDate());
          let dateC = new Date(this.nowDate);
          this.CnowTime = dateC.getFullYear() + this.dateDeal(dateC.getMonth() + 1);
        },
        // 查询
        queryBtn() {
          this.lastData();
          let data = {
            tableShow: true,
            pageNum: 1,
            nsrsbh: this.Cnsrsbh,
            jqbh: this.Cjqbh || '',
            dictCode: this.CdictCode || '',
            nowDate: this.CnowTime || new Date(),
            startTime: this.CstartTime || new Date(),
            endTime: this.CendTime || new Date()
          };
          this.$emit('tableShow', data); // 告诉父组件，子组件改变
        },
        // 导出
        exportBtn() {
          let router = this.$route.path;
          this.lastData();
          this.$nextTick(function () {
            if (router.indexOf('billRepertory') !== -1) {
              // 库存查询导出
              window.open('/api/exportInvoiceStore?nsrsbh=' + this.Cnsrsbh + '&jqbh=' + this.Cjqbh);
            } else if (router.indexOf('oilProducts') !== -1) {
              // 成品油查询导出
              window.open('/api/exportOilProductStore?nsrsbh=' + this.Cnsrsbh + '&jqbh=' + this.Cjqbh);
            } else if (router.indexOf('monthlyQuery') !== -1) {
              // 月度报表查询导出
              window.open('/api/exportMonthReport?nsrsbh=' + this.Cnsrsbh + '&kpyf=' + this.CnowTime);
            } else if (router.indexOf('oldDateQuery') !== -1) {
              // 验旧数据查询导出
              window.open('/api/exportFpyjInfo?nsrsbh=' + this.Cnsrsbh + '&startTime=' + this.CstartTime + '&endTime=' + this.CendTime);
            } else if (router.indexOf('invoiceState') !== -1) {
              // 发票状态查询导出
              window.open('/api/exportInvoiceStates?nsrsbh=' + this.Cnsrsbh + '&jqbh=' + this.Cjqbh + '&taskType=' + this.CdictCode);
            }
          });
        }
      }
    };
</script>

<style lang="stylus" rel="stylesheet" scoped>

</style>
