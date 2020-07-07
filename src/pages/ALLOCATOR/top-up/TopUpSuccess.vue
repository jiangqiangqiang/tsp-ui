
<template>
  <div>
    <BusinessTitle title="充值结果" isShowBack></BusinessTitle>
    <SuccessDeal reminder="您已经成功充值" :amount="$route.query.amount" :showBottom="false" @goBack="goBack"
      v-if="status === 'Succeed'" :textLater="true">
    </SuccessDeal>
    <div class="loadingText" v-else-if="status === 'Pending'">
      <p class="waitingText">正在充值...</p>
      <img src="~@/assets/img/loading2.gif" alt="loading" class="loadingIcon">
      <div class="dotted"></div>
      <p class="waitingTip">等待银行反馈支付结果</p>
    </div>
    <div class="topUpFailed" v-else>
      <img src="~@/assets/img/gg_bc.png" alt="errorIcon" class="errorIcon">
      <p class="errorText">充值失败</p>
      <div class="backBtn"><Button class="btn1" @handleClick="goBack" title="返回"></Button></div>
    </div>
  </div>
</template>

<script>
import BusinessTitle from '@/components/BusinessTitle'
import SuccessDeal from '@/components/SuccessDeal'
import { setTimeout } from 'timers'
import settings from '@/settings'
export default {
  data () {
    return {
      // 检查是否交易成功
      checkIsTopUpScueessUrl: settings.apiGateway.checkIsTopUpScueess,
      setTopUpSucceessUrl: settings.apiGateway.setTopUpSucceess,
      txCode: '',
      status: 'Pending'
    }
  },
  components: {
    SuccessDeal,
    BusinessTitle
  },
  methods: {
    goBack () {
      // 返回
      this.$router.replace('/allocator/top-up')
    },
    getRecord () {
      this.$router.replace('/allocator/top-up')
    },
    getTransactionDetails () {
      this.$router.replace({
        path: '/allocator/top-up/top-up-deal',
        query: {
          code: this.txCode
        }
      })
    },
    continueTopUp () {
      this.$router.replace('/allocator/top-up/start-top-up')
    },
    checkOderStatus () {
      this.fetch(`${this.checkIsTopUpScueessUrl}${this.$route.query.code.split('?')[0]}`).then(data => {
        this.status = data.data.status
        if (this.status === 'Succeed') {
          // 充值成功后获取账户余额
          this.getAccount()
          this.txCode = data.data.transactionCode
        } else if (this.status === 'Pending') {
          setTimeout(() => {
            this.checkOderStatus()
          }, 2000)
        }
      }).catch(data => {
        this.$message.error(data.msg)
      })
    }
  },
  created () {
    this.$nextTick(() => {
      if (this.$route.query.isTag === 'true') {
        this.checkOderStatus()
      } else {
        this.fetch(`${this.setTopUpSucceessUrl}${this.$route.query.code.split('?')[0]}`, 'post').then(data => {
          this.checkOderStatus()
        }).catch(data => {
          this.$message.error(data.msg)
        })
      }
    })
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
  font-size: 16px;
  /* font-family: SimSun; */
  font-weight: 400;
  color: rgba(87, 87, 87, 1);
  margin-top: 18px;
  opacity: 0.8;
}
.dotted {
  border-top: 1px dotted #000;
  width: 401px;
  margin: 0 auto;
  height: 1px;
}
</style>
