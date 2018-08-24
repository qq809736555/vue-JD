<template>
    <div class="vueLoading_wrapper" v-show="this.$store.getters.getLoading">
      <v-loading type="spiningDubbles" class="login_wrapper" color="#d9544e"></v-loading>
    </div>
</template>

<script type="text/ecmascript-6">
    import { VueLoading } from 'vue-loading-template';
    export default {
      components: {
        'v-loading': VueLoading
      }
    };
</script>

<style lang="stylus" rel="stylesheet" scoped>
  .vueLoading_wrapper
    position fixed
    top 0
    left 0
    z-index 1000
    width 100%
    height 100%
    .login_wrapper
      position absolute
      top 0
      bottom 0
      left 0
      right 0
      margin auto
      width 100px!important
      height 100px!important
      fill #e2231a!important
</style>
