<template>
    <div class="timTask_wrapper">
      <div class="search_form">
        <div class="search_conditions">
          <div class="search_btn_wrapper">
            <div class="search_btn red-btn" @click="handleQuery">查询</div>
            <div class="add_btn red-btn" @click="handleAdd">添加</div>
          </div>
        </div>
      </div>
      <div class="search_table">
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
            <tr v-for="(item, index) in tableData" :key="item.id" v-if="index <= pageSize" @mouseover="hover" @mouseout="out">
              <td class="hover_seeMore" v-text="item.job_NAME"></td>
              <td class="hover_seeMore" v-text="item.job_GROUP"></td>
              <td class="hover_seeMore" v-text="item.job_CLASS_NAME"></td>
              <td class="hover_seeMore" v-text="item.trigger_NAME"></td>
              <td class="hover_seeMore" v-text="item.trigger_GROUP"></td>
              <td class="hover_seeMore" v-text="item.cron_EXPRESSION"></td>
              <td class="hover_seeMore" v-text="item.time_ZONE_ID"></td>
              <td class="operation">
                <div class="modify red-btn" @click="handlePause(item)">暂停</div>
                <div class="reset red-btn" @click="handleResume(item)">恢复</div>
                <div class="delete red-btn" @click="handleDelete(item)">删除</div>
                <div class="delete red-btn" @click="handleModify(item)">修改</div>
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
          // 表格数据
          tableData: [],
          totalCount: 0,
          pageSize: 5,
          pageNum: 1
        };
      },
      methods: {
        // 获取定时任务列表
        getInfoList() {
          this.$http.get('job/queryjob?' + 'pageNum=' + this.pageNum + '&pageSize=' + this.pageSize).then((response) => {
            console.log(response);
            this.tableData = response.data.JobAndTrigger.list;
            this.totalCount = response.data.number;
          }, () => {
            console.log('failed');
          });
        },
        // 查询定时任务列表
        handleQuery() {
          this.getInfoList();
        },
        // 添加定时任务
        handleAdd() {
          let editItem = [
            {
              editLabel: '任务名称',
              vModel: 'jobName',
              placeholder: '请输入任务名称',
              type: 'text',
              value: ''
            },
            {
              editLabel: '任务分组',
              vModel: 'jobGroup',
              placeholder: '请输入任务分组',
              type: 'text',
              value: ''
            },
            {
              editLabel: '表达式',
              vModel: 'cronExpression',
              placeholder: '请输入表达式',
              type: 'text',
              value: ''
            }
          ];
          this.$store.commit('S');
          this.$store.commit('changeDialogTitle', '添加任务');
          this.$store.commit('changeIsAddJob', true);
          this.$store.commit('changeEditItem', editItem);
          this.$store.commit('changeBtnFunction', 'addJob');
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
        // 暂停
        handlePause(row) {
          this.$confirm('确认暂停定时任务？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消'
          }).then(() => {
            console.log(row)
            return false
            this.$http.post('job/pausejob', {'jobClassName': row.job_NAME, 'jobGroupName': row.job_GROUP}, {emulateJSON: true}).then((response) => {
              this.getInfoList();
            });
          });
        },
        // 恢复
        handleResume(row) {
          this.$confirm('确认恢复定时任务？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消'
          }).then(() => {
            console.log(row)
            return false
            this.$http.post('job/resumejob', {'jobClassName': row.job_NAME, 'jobGroupName': row.job_GROUP}, {emulateJSON: true}).then((response) => {
              this.getInfoList();
            });
          });
        },
        // 删除
        handleDelete(row) {
          this.$confirm('确认删除定时任务？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消'
          }).then(() => {
            console.log(row)
            return false
            this.$http.post('job/deletejob', {'jobClassName': row.job_NAME, 'jobGroupName': row.job_GROUP}, {emulateJSON: true}).then((response) => {
              this.getInfoList();
            });
          });
        },
        // 修改
        handleModify(row) {
          let editItem = [
            {
              editLabel: '表达式',
              vModel: 'cronExpression',
              placeholder: '请输入表达式',
              type: 'text',
              value: ''
            }
          ];
          this.$store.commit('S');
          this.$store.commit('changeDialogTitle', '编辑任务');
          this.$store.commit('changeIsAddJob', true);
          this.$store.commit('changeEditItem', editItem);
          this.$store.commit('changeBtnFunction', 'modifyJob');
          Bus.$emit('modifyJobData', row);
        },
        // 判断字符串长度
        strlen(str) {
            var len = 0;
            for (var i = 0; i < str.length; i++) {
              var c = str.charCodeAt(i);
              // 单字节加1
              if ((c >= 0x0001 && c <= 0x007e) || (c >= 0xff60 && c <= 0xff9f)) {
                len++;
              } else {
                len += 2;
              }
            }
            return len;
        },
        // 鼠标移入显示tooltip
        hover(event) {
          if (event.target.className === 'hover_seeMore' && this.strlen(event.target.innerHTML) > 16) {
            Bus.$emit('tooltip', event);
          }
        },
        // 鼠标移除隐藏tooltip
        out(event) {
          if (event.target.className === 'hover_seeMore' && this.strlen(event.target.innerHTML) > 16) {
            Bus.$emit('removeTooltip', event);
          }
        }
      },
      mounted() {
        this.getInfoList();
        Bus.$on('changePagination', (e) => {
          this.getInfoList();
        });
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
      cursor: pointer
</style>
