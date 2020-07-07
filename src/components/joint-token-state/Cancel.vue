<!--
 联合发令的被取消的所有情况
-->
<template>
  <div>
    <h4>联合发令已取消</h4>
    <div class="text-container" v-if="role === 'enterprise'">
      <!--   票据到期   -->
      <p v-if="orderData.billExpired">
        票据到期,流程自动结束
      </p>
      <!--   票据未到期   -->
      <div v-else>
        <p v-if="beforeState === 'WaitEnpCancelConfirm'">
          您已同意取消联合发令,联合发令已取消.
        </p>
        <p v-if="beforeState === 'WaitConfirmSchema'">
          企业拒绝联合发令方案,联合发令已取消.
        </p>
        <p v-if="beforeState === 'WaitFundCancelConfirm'">
          资金方同意取消联合发令,联合发令已取消.
        </p>
      </div>
    </div>
    <div class="text-container" v-if="role === 'fund'">
      <!--   票据到期   -->
      <p v-if="orderData.billExpired">
        票据到期,流程自动结束
      </p>
      <!--   票据未到期   -->
      <div v-else>
        <p v-if="beforeState === 'WaitEnpCancelConfirm'">
        您已拒绝联合发令方案,联合发令已取消.
        </p>
        <div v-if="beforeState === 'WaitConfirmSchema'">
          <p>
          企业拒绝联合发令方案,联合发令已取消.
          </p>
          <p>
            拒绝原因: {{orderData.reason}}
          </p>
        </div>
        <p v-if="beforeState === 'WaitFundCancelConfirm'">
          您已同意取消联合发令,联合发令已取消.
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    orderData: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data () {
    return {
      role: ''
    }
  },
  created () {
    this.role = this.getUserRole()
  },
  watch: {},
  computed: {
    beforeState () {
      return this.orderData.beforeState
    }
  }
}
</script>

<style lang="less" scoped>
  h4 {
    height: 50px;
    line-height: 50px;
    text-align: left;
    font-size: 18px;
    font-weight: 600;
  }
  p {
    height: 25px;
    line-height: 25px;
    text-align: left;
    font-size: 14px;
  }
</style>
