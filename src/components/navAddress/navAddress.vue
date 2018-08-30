<template>
  <div class="navAddress_wrapper">
    <span class="currentPosition">当前位置：</span>
    <span class="parentAdd">首页</span>
    <span class="separated" v-if="firstShow">/</span>
    <span class="firstAdd" v-if="firstShow">{{firstAdd}}</span>
    <span class="separated" v-if="secondShow">/</span>
    <span class="secondAdd" v-if="secondShow">{{secondAdd}}</span>
  </div>
</template>

<script type="text/ecmascript-6">
    export default {
      props: {
        firstAdd: {
          type: String,
          defaults: ''
        },
        secondAdd: {
          type: String,
          defaults: ''
        },
        firstShow: {
          type: Boolean,
          defaults: false
        },
        secondShow: {
          type: Boolean,
          defaults: false
        }
      }
    };
</script>

<style lang="stylus" rel="stylesheet" scoped>
  .navAddress_wrapper
    margin auto
    width 90%
    min-width 1200px
    height 45px
    line-height 60px
    padding-left 230px
    color #aaaaaa
    background #e0e0e0
    span
      color #aaaaaa
    .currentPosition
      padding-right 20px
    .separated
      padding 0 5px
</style>
