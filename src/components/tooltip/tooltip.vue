<template>
  <div class="tooltip_wrapper" v-show="tooltipShow" :style="tooltipStyle" id="tooltip">
    {{content}}
  </div>
</template>

<script type="text/ecmascript-6">
  import Bus from '../../common/js/bus.js';

  export default {
    data() {
      return {
        content: '',
        tooltipShow: false,
        tooltipStyle: {}
      };
    },
    created() {
      Bus.$on('tooltip', (event) => {
        this.tooltipShow = true;
        this.content = event.target.innerHTML;
        console.log(document.getElementById('tooltip').style.width);
        this.tooltipStyle = {
          'left': event.clientX + 'px',
          'top': event.clientY + 'px'
        };
      });
    }
  };
</script>

<style lang="stylus" rel="stylesheet" scoped>
  .tooltip_wrapper
    position fixed
    display inline-block
    line-height 24px
    padding 5px 10px
    color #fff
    background #2d2f33
    border-radius 5px
    box-shadow 0 3px 5px 0 rgba(45, 47, 51, 0.5)
    &::after
      content ''
      position absolute
      left 50%
      bottom -11px
      margin-left -3px
      border 6px solid transparent
      border-top 6px solid #2d2f33
</style>
