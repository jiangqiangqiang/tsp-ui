<template>
  <div>
    <!-- <AuthenticationTitle :stepInfo="stepInfo"></AuthenticationTitle> -->
    <router-view></router-view>
  </div>
</template>

<script>
import AuthenticationTitle from '../AuthenticationTitle'
export default {
  data () {
    return {
      // 步骤
      stepInfo: {
        // list: ['个人认证', '企业认证', '账号初始化', '认证完成'],
        list: ['账户注册', '个人实名认证', '企业实名认证', '对公银行账户信息'],
        step: 3
      }
    }
  },
  components: {
    AuthenticationTitle
  }
}
</script>

<style>

</style>
