<template>
  <div>
    <JointTokenState>
      <WaitEnpCancelConfirm :orderData="orderData" slot="state"></WaitEnpCancelConfirm>
    </JointTokenState>
  </div>
</template>

<script>
import settings from '@/settings'
import JointTokenState from '../../joint-token/JointTokenState'
import WaitEnpCancelConfirm from '@/components/joint-token-state/WaitEnpCancelConfirm'
export default {
  components: {
    JointTokenState,
    WaitEnpCancelConfirm
  },
  data () {
    return {
      company: '',
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
  }
}
</script>

<style>

</style>
