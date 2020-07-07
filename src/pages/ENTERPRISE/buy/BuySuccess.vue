
<template>
  <div>
    <BusinessTitle title="购买结果" isShowBack></BusinessTitle>
    <SuccessDeal reminder="您已经成功购买" carryOn="继续充值" :amount="$route.query.amount" @getRecord="getRecord" succeedText="购买完成"
      @getTransactionDetails="getTransactionDetails" @goBack="goBack" :showBottom='false' :textLater="true" v-if="status === 'Succeed'">
    </SuccessDeal>
    <div class="loadingText" v-else-if="status === 'Pending' || status === 'Sending' || status === 'Paying'">
      <p class="waitingText">正在购买...</p>
      <p class="waitingTip">正在校验交易信息，写入区块链账簿，确保数据永久安全，请稍候。</p>
      <img src="~@/assets/img/loading2.gif" alt="loading" class="loadingIcon">
    </div>
    <div class="topUpFailed" v-else>
      <img src="~@/assets/img/gg_bc.png" alt="errorIcon" class="errorIcon">
      <p class="errorText">购买失败</p>
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
      // 检查交易是否成功
      checkSuccessUrl: settings.apiGateway.checkSuccess,
      // 上链前设置支付成功
      setBuySucceessUrl: settings.apiGateway.setBuySucceess,
      detailId: '',
      status: 'Paying'
    }
  },
  components: {
    SuccessDeal,
    BusinessTitle
  },
  methods: {
    goBack () {
      // 返回
      this.$router.replace('/enterprise/buy-list')
    },
    getRecord () {
      this.$router.replace('/enterprise/buy-list')
    },
    getTransactionDetails () {
      this.$router.replace({
        path: 'enterprise/buy-detail',
        query: {
          code: this.detailId
        }
      })
      // this.$router.replace({
      //   path: '/enterprise/start-buy',
      //   query: {
      //     id: this.detailId,
      //     status: 'Finished'
      //   }
      // })
    },
    checkOderStatus () {
      this.fetch(`${this.checkSuccessUrl}${this.$route.query.id.split('?')[0]}`).then(data => {
        this.detailId = data.data.id
        this.status = data.data.status
        if (data.data.status !== 'Succeed' && data.data.status !== 'Failed') {
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
        this.fetch(`${this.setBuySucceessUrl}${this.$route.query.id.split('?')[0]}`, 'post').then(data => {
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
  font-size: 14px;
  margin-top: 18px;
  color: rgba(101, 101, 101, 1);
}
</style>
