<template>
    <div class="timTask_wrapper">
      <div class="search_form">
        <div class="search_conditions">
          <div class="search_btn_wrapper">
            <div class="search_btn red-btn" @click="queryBtn">查询</div>
            <div class="add_btn red-btn" @click="handleadd">添加</div>
          </div>
        </div>
      </div>
      <div class="search_table" v-show="tableShow">
        <table>
          <thead>
          <tr>
            <th width="11%">任务名称</th>
            <th width="11%">任务所在组</th>
            <th width="11%">任务类名</th>
            <th width="11%">触发器名称</th>
            <th width="11%">触发器所在组</th>
            <th width="11%">表达式</th>
            <th width="11%">时区</th>
            <th width="23%">操作</th>
          </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in this.$store.getters.getList" :key="item.id" v-if="index <= pageSize" @mouseover="hover" @mouseout="out">
              <td class="hover_seeMore">最后在查看结果中</td>
              <td class="hover_seeMore">com.guopiao.inpu</td>
              <td class="hover_seeMore">通过界面样式和交互动效让用户可以清晰的感知自己的操作</td>
              <td class="hover_seeMore">操作后，通过页面元素的变化清晰地展现当前状态</td>
              <td class="hover_seeMore">设计简洁直观的操作流程</td>
              <td class="hover_seeMore">语言表达清晰且表意明确，让用户快速理解进而作出决策</td>
              <td class="hover_seeMore">界面简单直白，让用户快速识别而非回忆，减少用户记忆负担</td>
              <td class="operation">
                <div class="modify red-btn" @click="suspendedBtn(item)">暂停</div>
                <div class="reset red-btn" @click="restoreBtn(item)">恢复</div>
                <div class="delete red-btn" @click="deleteBtn(item)">删除</div>
                <div class="delete red-btn" @click="modifyBtn(item)">修改</div>
              </td>
            </tr>
          </tbody>
        </table>
        <pagination :total-count = "totalCount" :page-size="pageSize" :page-num="pageNum" @showNewPageSize="updatePageSize" @currentPage="currentPage"></pagination>
        <tooltip></tooltip>
      </div>
    </div>
</template>

<script type="text/ecmascript-6">
    import pagination from 'components/pagination/pagination';
    import dialog from 'components/dialog/dialog';
    import tooltip from 'components/tooltip/tooltip';
    import Bus from '../../common/js/bus.js';

    export default {
      data() {
        return {
          totalCount: 0,
          pageSize: 5,
          pageNum: 1,
          accountNo: '',
          name: '',
          tableShow: true,
          value: '',
          btnFunction: ''
        };
      },
      created () { // 初始化时currentPage赋值
        this.getInfoList();
      },
      mounted() {
        Bus.$on('changePagination', (e) => {
          this.getInfoList();
        });
      },
      methods: {
        // 获取定时任务列表
        getInfoList() {
          // this.$http.get('/job/queryjob?' + 'pageNum=' + this.pageNum + '&pageSize=' + this.pageSize).then(function(response) {
          //   console.log(response);
          //   this.totalCount = response.total;
          //   this.$store.commit('changeList', response.list);
          //   this.pageSize = response.pageSize;
          // });
          let formDate = {'pageNum': this.pageNum, 'pageSize': this.pageSize, 'accountNo': this.accountNo, 'name': this.name};
          this.$http.post('/rbac/mvc/user/getUserList?', formDate).then((response) => {
            this.tableShow = true;
            this.totalCount = response.total;
            this.$store.commit('changeList', response.list);
            this.pageSize = response.pageSize;
          });
        },
        // 翻页组件修改每页显示条数
        updatePageSize(data) {
          this.pageSize = data.page;// 改变了父组件的值
          this.getInfoList();
        },
        // 改变当前页
        currentPage(data) {
          this.pageNum = data;
          this.getInfoList();
        },
        // 查询列表
        queryBtn() {
          this.getInfoList();
        },
        // 增加
        handleadd() {},
        // 暂停
        suspendedBtn(item) {},
        // 恢复
        restoreBtn(item) {},
        // 删除
        deleteBtn(item) {},
        // 修改
        modifyBtn(item) {},
        // 判断字符串长度
        strlen(str) {
            var len = 0;
            for (var i = 0; i < str.length; i++) {
              var c = str.charCodeAt(i);
              // 单字节加1
              if ((c >= 0x0001 && c <= 0x007e) || (0xff60 <= c && c <= 0xff9f)) {
                len++;
              } else {
                len += 2;
              }
            }
            return len;
        },
        // 鼠标事件
        hover(event) {
          if (event.target.className === 'hover_seeMore' && this.strlen(event.target.innerHTML) > 16) {
            Bus.$emit('tooltip', event);
          }
        },
        out(event) {
        }
      },
      components: {
        pagination,
        'v-dialog': dialog,
        tooltip
      }
    };
</script>

<style lang="stylus" rel="stylesheet" scoped>
  .search_table
    td
      max-width 115px
      padding 0 5px
      overflow hidden
      white-space nowrap
      text-overflow ellipsis
</style>
