<template>
  <div>
    <BusinessTitle title="支付结果"></BusinessTitle>
    <div v-if="status === 'succeed'">
      <SuccessDeal :reminder="'成功向 '+name+' 支付'" carryOn="继续支付" :amount="amount" @goBack="goBack"
        @getTransactionDetails="getTransactionDetails" @getRecord="getRecord" @continueTopUp="continueTopUp"
        checkRecord="查看记录" payment succeedText="支付完成"></SuccessDeal>
    </div>
    <div class="loadingText" v-else-if="status === 'waiting'">
      <p class="waitingText">正在支付...</p>
      <p class="waitingTip">正在校验交易信息，写入区块链账簿，确保数据永久安全，请稍候。</p>
      <img src="~@/assets/img/loading2.gif" alt="loading" class="loadingIcon">
    </div>
    <div class="topUpFailed" v-else>
      <img src="~@/assets/img/gg_bc.png" alt="errorIcon" class="errorIcon">
      <p class="errorText">支付失败</p>
      <div class="backBtn"><Button class="btn1" @handleClick="goBack" title="返回"></Button></div>
    </div>
    <!-- loading加载 -->
    <!-- <loading :loadingShow="isLoadingShow"></loading> -->
  </div>
</template>

<script>
import BusinessTitle from '@/components/BusinessTitle'
import SuccessDeal from '@/components/SuccessDeal'
import settings from '@/settings'
export default {
  data () {
    return {
      // 检查是否交易成功
      checkIsPaymentScueessUrl: settings.apiGateway.checkIsPaymentScueess,
      status: 'waiting',
      name: ''
      // isLoadingShow: false,
      // timeNum: 0
    }
  },
  methods: {
    goBack () {
      // 返回
      this.$router.push('/enterprise/pay-apply-authority')
    },
    getTransactionDetails () {
      // 交易详情
      this.$router.push({
        path: '/enterprise/payment-detail',
        query: {
          code: this.$route.query.code
        }
      })
    },
    getRecord () {
      // 查看记录
      this.$router.replace('/enterprise/pay-apply-authority')
    },
    continueTopUp () {
      // 继续支付
      this.$router.replace('/enterprise/pay-apply-authority')
    },
    checkOderStatus () {
      // if (this.timeNum > 5) {
      //   this.isLoadingShow = false
      //   this.$router.push('/enterprise/pay-apply-authority')
      //   return
      // }
      // this.timeNum++
      this.fetch(`${this.checkIsPaymentScueessUrl}${this.$route.query.code.split('?')[0]}`).then(data => {
        let newData = JSON.parse(data.data)
        this.status = newData.status
        if (this.status === 'succeed') {
          this.name = newData.name
          // 成功后获取一下余额
          this.getAccount()
        } else if (this.status === 'waiting') {
          setTimeout(() => {
            this.checkOderStatus()
          }, 2000)
        }
      }).catch(data => {
        this.$message.error(data.msg)
      })
    }
  },
  computed: {
    amount () {
      return this.$route.query.amount.toString()
    }
  },
  created () {
    this.checkOderStatus()
  },
  components: {
    BusinessTitle,
    SuccessDeal
  },
  beforeDestroy () {
    clearTimeout()
  }
}
</script>

<style scoped>
.topUpFailed {
  text-align: center;
}
.errorIcon {
  margin-top: 22px;
  margin-bottom: 19px;
}
.loadingIcon {
  width: 140px;
  margin: 20px auto;
}
.errorText {
  text-align: center;
  font-size: 18px;
  font-weight: bold;
  color: rgba(75, 75, 75, 1);
}
.backBtn {
  width: 403px;
  height: 50px;
  margin: 30px auto;
}
.btn1 {
  width: 100%;
  height: 100%;
}
.loadingText {
  text-align: center;
  margin-top: 60px;
}
.waitingText {
  font-size: 16px;
  font-weight: bold;
  color: rgba(101, 101, 101, 1);
}
.waitingTip {
  font-size: 14px;
  margin-top: 18px;
  color: rgba(101, 101, 101, 1);
}
</style>
