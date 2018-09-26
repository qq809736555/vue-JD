<template>
  <div></div>
</template>

<script type="text/ecmascript-6">
    export default {
      userName: /^[a-zA-Z0-9]{1,30}$/,
      realName: /^[\u4E00-\u9FA5a-zA-Z]{2,10}$/,
      phone: /^[1][3,4,5,7,8][0-9]{9}$/,
      regPassWord: /^.*([\u4E00-\u9FA5])+.*$/,
      name: /^[\u4E00-\u9FA5a-zA-Z]{2,10}$/,
      email: /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/
    };
</script>

<style lang="stylus" rel="stylesheet" scoped>

</style>
