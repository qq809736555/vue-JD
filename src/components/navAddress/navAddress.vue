<template>
  <div class="navAddress_wrapper">
    <span class="parentAdd">首页</span>
    <span class="separated">/</span>
    <span class="firstAdd">{{firstAdd}}</span>
    <span class="separated">/</span>
    <span class="currentAdd">{{currentAdd}}</span>
  </div>
</template>

<script type="text/ecmascript-6">
    export default {
      props: {
        firstAdd: {
          type: String,
          defaults: ''
        },
        currentAdd: {
          type: String,
          defaults: ''
        }
      }
    };
</script>

<style lang="stylus" rel="stylesheet" scoped>
  .navAddress_wrapper
    width 100%
    height 35px
    line-height 35px
    padding 0 30px
    color #33CCFF
    background #e6ebf2
    border-radius 5px
    box-shadow 0 3px 5px 0 rgba(210,210,210,0.5)
    .separated
      color #49aafb
      padding 0 10px
    .currentAdd
      color #33CCFF
    .parentAdd, .firstAdd
      color #169BD5
</style>
