<template>
    <div class="sentEmail_wrapper">
      <searchForm @tableShow="judgeTabShow" :sta-show="staShow" :jqbh-show="jqbhShow" :waring-show="waringShow" :export-show="exportShow" :nsrsbh-show="nsrsbhShow"></searchForm>
      <div class="search_table" v-show="tabIsShow">
        <table>
          <thead>
          <tr>
            <th width="7%">序号</th>
            <th width="20%">时间</th>
            <th width="20%">接收人信息</th>
            <th width="20%">预警项目类型</th>
            <th width="33%">邮件内容</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(item, index) in this.$store.getters.getList" :key="item.id" v-if="index <= pageSize">
            <td>{{index+1}}</td>
            <td>{{item.sendTime | sendTime}}</td>
            <td>{{item.recipient}}</td>
            <td>{{item.taskType}}</td>
            <td class="seeMore email_seeMore">{{item.sendContent}}<p class="red-btn" @click="seeMore(item.sendContent)">更多</p></td>
          </tr>
          </tbody>
        </table>
        <pagination :total-count="totalCount" :page-size="pageSize" :page-num="pageNum" @showNewPageSize="updatePageSize" @currentPage="currentPage"></pagination>
      </div>
    </div>
</template>

<script type="text/ecmascript-6">
  import pagination from 'components/pagination/pagination';
  import searchForm from 'components/searchForm/searchForm';

  export default {
    data() {
      return {
        exportShow: false,
        waringShow: true,
        staShow: true,
        jqbhShow: false,
        nsrsbhShow: false,
        totalCount: 0,
        pageSize: 5,
        pageNum: 1,
        tabIsShow: false,
        nsrsbh: '',
        dictCode: '',
        startTime: new Date(),
        endTime: new Date()
      };
    },
    methods: {
      getList() {
        console.log(this.startTime);
        // 发送类型 1:短信，0：邮件
        let formDate = {'pageNum': this.pageNum, 'pageSize': '' + this.pageSize, 'startTime': this.startTime, 'endTime': this.endTime, 'sendType': '0', 'taskType': this.dictCode};
        this.$http.post('/api/querySendContent', formDate).then((response) => {
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
      // 改变当前页
      currentPage(data) {
        this.pageNum = data;
        this.getList();
      },
      // 判断列表展示
      judgeTabShow(data) {
        this.tabIsShow = data.tableShow;
        this.pageNum = data.pageNum;
        this.nsrsbh = data.nsrsbh;
        // 预警选全部是传空值
        if (data.dictCode.indexOf(',') > 0) {
          this.dictCode = '';
        } else {
          this.dictCode = data.dictCode;
        }
        this.startTime = data.startTime;
        this.endTime = data.endTime;
        this.getList();
      },
      // 查看邮件
      seeMore(sendContent) {
        // 邮件内容
        this.$store.commit('S');
        this.$store.commit('changeDialogTitle', '邮件内容');
        let editItem = [];
        this.$store.commit('changeEditItem', editItem);
        this.$store.commit('changeSeeMsg', sendContent);
        this.$store.commit('changeBtnShow', false);
      }
    },
    components: {
      pagination,
      searchForm
    },
    filters: {
      sendTime(val) {
        let newVal = '';
        newVal = new Date(val);
        let year = newVal.getFullYear();
        let month = (newVal.getMonth() + 1) > 9 ? (newVal.getMonth() + 1) : '0' + (newVal.getMonth() + 1);
        let date = newVal.getDate() > 9 ? newVal.getDate() : '0' + newVal.getDate();
        let hours = newVal.getHours() > 9 ? newVal.getHours() : '0' + newVal.getHours();
        let minutes = newVal.getMinutes() > 9 ? newVal.getMinutes() : '0' + newVal.getMinutes();
        let seconds = newVal.getSeconds() > 9 ? newVal.getSeconds() : '0' + newVal.getSeconds();
        newVal = year + '-' + month + '-' + date + ' ' + hours + ':' + minutes + ':' + seconds;
        return newVal;
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet" scoped>

</style>
