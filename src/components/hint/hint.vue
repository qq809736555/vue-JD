<template>
  <div class="hint_wrapper" v-show="this.$store.getters.getHint">
    <div class="hint_content">
      <div class="hint_message" :class="this.$store.getters.gitHintClass">{{this.$store.getters.gitHintContent}}</div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
    export default {};
</script>

<style lang="stylus" rel="stylesheet" scoped>
  .hint_wrapper
    position fixed
    top 0
    left 0
    width 100%
    height 100%
    z-index 999
    .hint_content
      position absolute
      top 0
      bottom 0
      left 0
      right 0
      margin auto
      display table
      width 280px
      height 100px
      text-align center
      .hint_message
        display table-cell
        vertical-align middle
        padding 0 15px
        color #fff
        &.errorHint
          background rgba(237, 32, 38, .5)
        &.successHint
          background rgba(0, 180, 60, .5)
</style>
