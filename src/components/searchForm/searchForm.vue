<template>
    <div class="searchForm_wrapper">
      <div class="search_form">
        <div class="search_conditions">
          <!-- 统计日期 -->
          <div class="search_item" v-show="staShow">
            <div class="search_label">统计日期：</div>
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
          <!-- 开票日期 -->
          <div class="search_item" v-show="dataShow">
            <div class="search_label">开票日期：</div>
            <el-date-picker
              v-model="nowDate"
              type="month"
              placeholder="----年--月">
            </el-date-picker>
          </div>
          <!-- 开票日期(区域) -->
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
          <!-- 税号 -->
          <div class="search_item" v-show="nsrsbhShow">
            <div class="search_label">税号：</div>
            <span class="icon-dropDown"></span>
            <select @change="SHSelect" v-model="nsrsbh" class="search_select">
              <option value="全部">全部</option>
              <option v-for="option1 in shuiHao" :value="option1.nsrsbh" :key="option1.id">{{option1.nsrsbh}}<span>/{{option1.dwmc}}</span></option>
            </select>
          </div>
          <!-- 机器编号 -->
          <div class="search_item" v-show="jqbhShow">
            <div class="search_label">机器编号：</div>
            <span class="icon-dropDown"></span>
            <select v-model="jqbh" class="search_select">
              <option value="全部">全部</option>
              <option v-for="option2 in selection" :value="option2.jqbh" :key="option2.id">{{option2.jqbh}}</option>
            </select>
          </div>
          <!-- 发票标志 -->
          <div class="search_item" v-show="typeShow">
            <div class="search_label">发票标志：</div>
            <span class="icon-dropDown"></span>
            <select v-model="dictCode" class="search_select">
              <option value="全部">全部</option>
              <option :value="item.dictCode" v-for="item in taskTypeList" :key="item.id">{{item.dictName}}</option>
            </select>
          </div>
          <!-- 预警项目类型 -->
          <div class="search_item" v-show="waringShow">
            <div class="search_label">预警项目类型：</div>
            <span class="icon-dropDown"></span>
            <select v-model="dictCode" class="search_select">
              <option value="全部">全部</option>
              <option :value="item.dictCode" v-for="item in taskTypeList" :key="item.id">{{item.dictName}}</option>
            </select>
          </div>
          <div class="search_btn_wrapper">
            <div class="search_btn red-btn" @click="queryBtn">查询</div>
            <div class="export_btn red-btn" @click="exportBtn" v-show="exportShow">导出</div>
            <div class="set_btn red-btn" @click="setValueBtn" v-show="setValue">设置预警值</div>
          </div>
        </div>
      </div>
    </div>
</template>

<script type="text/ecmascript-6">
    import Bus from '../../common/js/bus.js';

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
        nsrsbhShow: {
          type: Boolean,
          default: true
        },
        jqbhShow: {
          type: Boolean,
          default: true
        },
        typeShow: {
          type: Boolean,
          default: false
        },
        staShow: {
          type: Boolean,
          default: false
        },
        waringShow: {
          type: Boolean,
          default: false
        },
        exportShow: {
          type: Boolean,
          default: true
        },
        setValue: {
          type: Boolean,
          default: false
        },
        setType: {
          type: String,
          default: ''
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
          dictCode: '全部',
          CdictCode: '',
          taskTypeList: '',
          shuiHao: [],
          selection: []
        };
      },
      created () { // 初始化时currentPage赋值
        this.getSH();
        if (this.$route.path.indexOf('invoiceState') > 0 || this.$route.path.indexOf('control') > 0) {
          // 发票状态查询页面
          this.getType('预警');
        } else if (this.$route.path.indexOf('sent') > 0) {
          // 邮件/短信页面
          this.getType('预警项目类型');
        }
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
        getType(val) {
          this.$http.get('/api/getSysDictByType?dictType=' + val).then((response) => {
            this.taskTypeList = response;
            if (this.dictCode === '全部') {
              for (let i = 0; i < this.taskTypeList.length; i++) {
                this.CdictCode += this.taskTypeList[i].dictCode + ',';
              }
            }
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
          if (this.dictCode !== '全部') {
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
            nowDate: this.CnowTime === '19700101' ? '' : this.CnowTime,
            startTime: this.CstartTime === '19700101' ? '' : this.CstartTime,
            endTime: this.CendTime === '19700101' ? '' : this.CendTime
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
            } else if (router.indexOf('controlBillSource') !== -1) {
              // 发票票源监控
              console.info('/api/exportInvoiceStates?nsrsbh=' + this.Cnsrsbh + '&jqbh=' + this.Cjqbh + '&taskType=1,11,12');
              window.open('/api/exportInvoiceStates?nsrsbh=' + this.Cnsrsbh + '&jqbh=' + this.Cjqbh + '&taskType=1,11,12');
            } else if (router.indexOf('controlOffLine') !== -1) {
              // 离线参数监控
              window.open('/api/exportInvoiceStates?nsrsbh=' + this.Cnsrsbh + '&jqbh=' + this.Cjqbh + '&taskType=3,5,6');
            } else if (router.indexOf('controlBillState') !== -1) {
              // 发票状态监控
              window.open('/api/exportInvoiceStates?nsrsbh=' + this.Cnsrsbh + '&jqbh=' + this.Cjqbh + '&taskType=7,2,8');
            } else if (router.indexOf('controlNewspaper') !== -1) {
              // 抄报提醒监控
              window.open('/api/exportInvoiceStates?nsrsbh=' + this.Cnsrsbh + '&jqbh=' + this.Cjqbh + '&taskType=9');
            }
          });
        },
        // 设置预警值
        setValueBtn() {
          // 发票票源和发票状态，点击不查询
          if (this.setType === 'BillSource' || this.setType === 'BillState') {
            this.openDialog();
          } else if (this.setType === 'OffLine') {
            let nsrsbh = this.Cnsrsbh.split(',')[0];
            this.$http.get('/api/queryWarn?' + 'kpdwdm=' + nsrsbh + '&taskType=' + '3,5,6').then((response) => {
              if (JSON.stringify(response) !== '[]') {
                Bus.$emit('winData', response);
              }
              this.openDialog();
            });
          } else if (this.setType === 'Newspaper') {
            let nsrsbh = this.Cnsrsbh.split(',')[0];
            this.$http.get('/api/queryWarn?' + 'kpdwdm=' + nsrsbh + '&taskType=' + '9').then((response) => {
              if (JSON.stringify(response) !== '[]') {
                Bus.$emit('winData', response);
              }
              this.openDialog();
            });
          }
        },
        // 设置预警值，打开弹窗
        openDialog() {
          let nsrsbh = this.Cnsrsbh.split(',')[0];
          this.$store.commit('S');
          this.$store.commit('changeDialogTitle', '设置预警值');
          let editItem = [];
          this.$store.commit('changeEditItem', editItem);
          this.$store.commit('changeSetVal', true);
          if (this.setType === 'OffLine') {
            this.$store.commit('changeBtnFunction', 'setWaringValOffLine');
          } else if (this.setType === 'Newspaper') {
            this.$store.commit('changeBtnFunction', 'setWaringValNewspaper');
          } else {
            this.$store.commit('changeBtnFunction', 'setWaringVal');
          }
          Bus.$emit('setType', this.setType);
          Bus.$emit('setNsrsbh', nsrsbh);
        }
      }
    };
</script>

<style lang="stylus" rel="stylesheet" scoped>

</style>
