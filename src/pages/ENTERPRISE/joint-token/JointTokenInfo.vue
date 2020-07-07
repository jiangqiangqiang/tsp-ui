<template>
  <JointTokenState>
    <!-- <WaitConfirmSchema :orderData="orderData" slot="state"></WaitConfirmSchema> -->
    <WaitEnpCancelConfirm :orderData="orderData" slot="state"></WaitEnpCancelConfirm>
  </JointTokenState>
</template>

<script>
import JointTokenState from '../../joint-token/JointTokenState.vue'
import WaitConfirmSchema from '@/components/enterprise-joint-token-state/WaitConfirmSchema.vue'
import WaitEnpCancelConfirm from '@/components/joint-token-state/WaitEnpCancelConfirm'
import settings from '@/settings'
export default {
  data () {
    return {
      orderId: this.$route.query.code,
      orderDetailUrl: settings.apiGateway.orderDetail,
      orderData: {}
    }
  },
  created () {
    this.fetch(`${this.orderDetailUrl}${this.orderId}`).then(data => {
      this.orderData = data.data
    }).catch(data => {
      this.$message({
          type: 'error',
          message: data.data.msg
        })
    })
  },
  components: {
    JointTokenState,
    WaitConfirmSchema,
    WaitEnpCancelConfirm
  }
}
</script>
