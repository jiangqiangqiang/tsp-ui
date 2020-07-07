<template>
  <div>
    <div v-if="!isOverTime">
      <div v-if="role === 'fund'">
        <h4>企业已接受方案, 请及时完成付款</h4>
        <CutDown aheadText="为了确保联合发令业务尽快完成,请在" afterText="内完成付款" :cutdownms="orderData.expirationTime"></CutDown>
        <div style="margin-top:20px">
          <Button @handleClick="handlePayment" class="paymentBtn" title="付款"></Button>
          <ApplyCancelTokenBtn :orderId="orderId"></ApplyCancelTokenBtn>
        </div>
      </div>
      <div v-if="role === 'enterprise'">
        <h4>请等待资金方付款</h4>
        <CutDown aheadText="若资金方在" afterText="后未确认, 您可以通过系统提醒功能, 通知资金方尽快处理。" :cutdownms="orderData.expirationTime"></CutDown>
        <div style="margin-top:20px">
          <ApplyCancelTokenBtn :orderId="orderId"></ApplyCancelTokenBtn>
        </div>
      </div>
    </div>
    <div v-else>
      <div v-if="role === 'fund'">
        <h4>企业已接受方案, 请及时完成付款</h4>
        <CutDown aheadText="为了确保联合发令业务尽快完成,请在" afterText="内完成付款" :cutdownms="orderData.expirationTime"></CutDown>
        <div style="margin-top:20px">
          <Button @handleClick="handlePayment" class="paymentBtn" title="付款"></Button>
          <ApplyCancelTokenBtn :orderId="orderId"></ApplyCancelTokenBtn>
        </div>
      </div>
      <div v-if="role === 'enterprise'">
        <h4>请等待资金方付款</h4>
        <CutDown aheadText="资金方付款操作" showTimeoutText afterText=",您可以选择继续等待,也可取消此次联合发令。" :cutdownms="orderData.expirationTime"></CutDown>
        <div style="margin-top:20px">
          <Time :orderId="orderId" :company="company" :step="orderData.issueStep"></Time>
          <ApplyCancelTokenBtn :orderId="orderId"></ApplyCancelTokenBtn>
        </div>
      </div>
    </div>
    <loading :loadingShow="loadingShow"></loading>
  </div>
</template>

<script>
import Time from '@/components/Time'
import CutDown from '@/components/CutDown.vue'
import settings from '@/settings'
import ApplyCancelTokenBtn from '@/components/ApplyCancelTokenBtn.vue'
export default {
  props: {
    orderData: {
      type: Object,
      default: () => {
        return {}
      }
    },
    orderId: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      role: '',
      company: '资金方',
      fundPaymentUrl: settings.apiGateway.fundPayment,
      // 审批意见 'Succeed' or 'Rejected'
      opinion: '',
      refusalReason: '',
      loadingShow: false
    }
  },
  methods: {
    handlePayment () {
      this.alertSuccess({
        text: '付款完成之前请不要关闭此窗口, 请在弹出的页面完成付款',
        li1: '如果付款成功, 请点击 "付款完成" 按钮',
        li2: '如果付款失败, 请点击 "付款失败" 按钮',
        li3: '点击后, 系统将自动跳转至业务相关页面',
        okBtn: '付款完成',
        infoBtn: '付款失败',
        ok: () => {
          this.loadingShow = true
          this.fetch(`${this.fundPaymentUrl}${this.orderId}`, 'post').then(data => {
            this.$store.dispatch('updateCounters')
            this.$router.push({
              path: '/fund/fund-payment-success',
              query: {
                code: this.orderId,
                amount: data.data
              }
            })
          }).catch(res => {
            this.$message.error(res.data.msg)
          })
        },
        info: () => {}
      })
    }
  },
  created () {
    this.role = this.getUserRole()
  },
  computed: {
    isOverTime () {
      if (this.orderData.expirationTime <= 0) {
        return true
      } else {
        return false
      }
    }
  },
  components: {
    CutDown,
    ApplyCancelTokenBtn,
    Time
  }
}
</script>

<style scoped lang="less">
  @import "~@/assets/less/variables.less";
  h4 {
    height: 40px;
    line-height: 40px;
    font-weight: 600;
    font-size: 18px;
    padding-bottom:20px;
    font-family: '微软雅黑'
  }
  .paymentBtn {
    width: 163px;
    height: 41px;
    border: none;
    margin-right: 25px;
    border-radius: 5px;
    color: #fff;
    box-shadow: 1px 6px 4px @btn-disabled;
    box-shadow: 1px 6px 4px var(--mainTableHover);
    // background-color: @theme-blue;
    // background-color: var(--mainColor);
  }
</style>
