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
            <span class="icon-dropDown"></span>
            <select @change="SHSelect" v-model="nsrsbh" class="search_select">
              <option v-for="option1 in shuiHao" :value="option1.nsrsbh" :key="option1.id">{{option1.nsrsbh}}</option>
            </select>
          </div>
          <div class="search_item" v-show="jqbhShow">
            <div class="search_label">机器编号：</div>
            <span class="icon-dropDown"></span>
            <select v-model="jqbh" class="search_select">
              <option v-for="option2 in selection" :value="option2.jqbh" :key="option2.id">{{option2.jqbh}}</option>
            </select>
          </div>
          <div class="search_item" v-show="typeShow">
            <div class="search_label">发票状态：</div>
            <span class="icon-dropDown"></span>
            <select v-model="dictCode" class="search_select">
              <option :value="item.dictCode" v-for="item in taskTypeList" :key="item.id">{{item.dictName}}</option>
            </select>
          </div>
          <div class="search_btn blue-btn" @click="queryBtn">查询</div>
          <div class="export_btn blue-btn" @click="exportBtn">导出</div>
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
          nowDate: new Date(),
          startTime: new Date(),
          endTime: new Date(),
          nsrsbh: '',
          jqbh: '',
          dictCode: '',
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
          this.$http.get('/api/getMachNumByNsrsbh?nsrsbh=' + this.nsrsbh).then((response) => {
            for (var i = 0; i < response.length; i++) {
              this.selection.push(response[i]);
            }
          });
        },
        // 获取税号
        getSH() {
          this.$http.get('/rbac/mvc/sallerInfo/getByNsrsbh?xfdm=' + JSON.parse(window.localStorage.getItem('userInfo')).xfdm).then((response) => {
            this.shuiHao = response.nsrsbhList || [];
          });
        },
        // 获取发票状态
        gitType() {
          this.$http.get('/api/getSysDictByType?dictType=预警').then((response) => {
            this.taskTypeList = response;
          });
        },
        // 查询
        queryBtn() {
          let data = {
            tableShow: true,
            pageNum: 1,
            nsrsbh: this.nsrsbh,
            jqbh: this.jqbh || '',
            dictCode: this.dictCode || '',
            nowDate: this.nowDate || new Date(),
            startTime: this.startTime || new Date(),
            endTime: this.endTime || new Date()
          };
          this.$emit('tableShow', data); // 告诉父组件，子组件改变
        },
        // 导出
        exportBtn() {
          console.log(this.$route.path);
          let router = this.$route.path;
          if (router.indexOf('billRepertory') !== -1) {
            // 库存查询导出
            window.open('/api/exportInvoiceStore?nsrsbh=' + this.nsrsbh + '&jqbh=' + this.jqbh);
          } else if (router.indexOf('billRepertory') !== -1) {
            // 成品油查询导出
            window.open('/api/exportOilProductStore?nsrsbh=' + this.nsrsbh + '&jqbh=' + this.jqbh);
          } else if (router.indexOf('monthlyQuery') !== -1) {
            // 月度报表查询导出
            window.open('/api/exportMonthReport?nsrsbh=' + this.nsrsbh + '&kpyf=' + this.nowDate);
          } else if (router.indexOf('invoiceState') !== -1) {
            // 发票状态查询导出
            window.open('/api/exportInvoiceStates?nsrsbh=' + this.nsrsbh + '&jqbh=' + this.jq + '&taskType=' + this.dictCode);
          }
          // window.open('/api/exportInvoiceStore?nsrsbh=' + this.nsrsbh + '&jqbh=' + this.jqbh);
        }
      }
    };
</script>

<style lang="stylus" rel="stylesheet" scoped>

</style>
