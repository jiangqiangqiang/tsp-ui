<template>
  <div class="success--main">
    <BusinessTitle title="提现结果"></BusinessTitle>
    <div class="content" v-if="status === 'sending'">
      <i class="el-icon-circle-check-outline icon"></i>
      <div class="success-top-up">操作成功</div>
      <Steps :stepInfo="stepInfo"></Steps>
      <Button title="返回首页" class="btn" @handleClick="goBackHome"></Button>
    </div>
    <div class="loadingText" v-else-if="status === 'pending'">
      <p class="waitingText">正在提现...</p>
      <img src="~@/assets/img/loading2.gif" alt="loading" class="loadingIcon">
      <div class="dotted"></div>
      <p class="waitingText1">提现预计下一个工作日到账</p>
    </div>
    <div class="topUpFailed" v-else>
      <img src="~@/assets/img/gg_bc.png" alt="errorIcon" class="errorIcon">
      <p class="errorText">提现失败</p>
      <div class="backBtn"><Button class="btn1" @handleClick="goBack" title="返回"></Button></div>
    </div>
    <!-- loading加载 -->
    <!-- <loading :loadingShow="isLoadingShow"></loading> -->
  </div>
</template>

<script>
import BusinessTitle from '@/components/BusinessTitle'
import settings from '@/settings'
import Steps from '@/components/Steps'
import { clearTimeout } from 'timers'
export default {
  components: {
    BusinessTitle,
    Steps
  },
  data () {
    return {
      amount: 0,
      // 检查是否交易成功
      checkIsWithdrawScueessUrl: settings.apiGateway.checkIsWithdrawScueess,
      // 提现详单 Url
      getWithdrawUrl: settings.apiGateway.withDrawDetalAll,
      status: 'pending',
      stepInfo: {
        list: [],
        step: 0
      },
      basicInfo: {}
      // isLoadingShow: false,
      // timeNum: 0
    }
  },
  methods: {
    getTransactionDetails () {
      this.$router.push({
        path: '/' + this.role + '/withdraw-detail',
        query: {
          code: this.$route.query.code
        }
      })
    },
    getStatusTime () {
      this.fetch(`${this.getWithdrawUrl}/${this.$route.query.code.split('?')[0]}`).then(data => {
        this.basicInfo = data.data
        this.stepInfo = {
          list: [{ status: '提现申请提交成功，金额冻结', statusTime: this.basicInfo.createTime }, { status: '审核通过，提交银行处理', statusTime: this.basicInfo.auditTime }, { status: '预计到账时间', statusTime: this.basicInfo.endDate }],
          step: 2
        }
      }).catch(data => {
        this.$message.error(data.msg)
      })
    },
    getRecord () {
      this.$router.push('/' + this.role + '/withdraw-apply-authority')
    },
    continueTopUp () {
      this.$router.push('/' + this.role + '/withdraw-apply-authority')
    },
    goBack () {
      this.$router.push('/' + this.role + '/withdraw-apply-authority')
    },
    goBackHome () {
      this.$router.push('/' + this.role + '/home')
    },
    checkOderStatus () {
      // if (this.timeNum > 5) {
      //   this.isLoadingShow = false
      //   this.$router.push('/' + this.role + '/withdraw-apply-authority')
      //   return
      // }
      // this.timeNum++
      this.fetch(`${this.checkIsWithdrawScueessUrl}${this.$route.query.code.split('?')[0]}`).then(data => {
        this.status = data.data.toLowerCase()
        if (this.status === 'sending') {
          // 提现成功后更新账户余额
          this.getAccount()
        } else if (this.status === 'pending') {
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
    this.checkOderStatus()
    this.role = this.getUserRole()
    this.getStatusTime()
    this.amount = this.$route.query.amount
  },
  beforeDestroy () {
    clearTimeout()
  }
}
</script>

<style scoped lang="less">
@import '~@/assets/less/variables';
.content {
  width: 780px;
  height: 318px;
  margin: 0 auto;
  margin-top: 38px;
  text-align: center;
  .icon {
    font-size: 65px;
    color: #7bbd3f;
  }
  .success-top-up {
    margin-top: 24px;
    margin-bottom: 28px;
    font-size: 18px;
    color: rgba(87, 87, 87, 1);
  }
  .amount {
    color: @theme-blue;
    color: var(--mainColor);
  }
  .view-details {
    width: 120px;
    margin: 0 auto;
    margin-top: 24px;
    cursor: pointer;
    color: #128dea;
    color: var(--mainColor);
    border-bottom: 1px solid #128dea;
    border-bottom: 1px solid var(--mainColor);
  }

  .moreover {
    margin-top: 30px;
  }
  .sort-utility {
    width: 165px;
    height: 21px;
    margin: 0 auto;
    margin-top: 22px;
    color: #0f8fea;
    color: var(--mainColor);
    li {
      float: left;
      //border-bottom:1px solid #128dea;
      &:nth-of-type(1) {
        padding-right: 24px;
        border-right: 1px solid #cccccc;
        margin-right: 24px;
      }
      .history {
        cursor: pointer;
        border-bottom: 1px solid #128dea;
        border-bottom: 1px solid var(--mainColor);
      }
    }
  }
}
.success--main {
  .btn {
    width: 402px;
    height: 48px;
    padding: 0;
    line-height: 48px;
    margin: 52px auto;
    border: none;
    background-color: @theme-blue;
    background-color: var(--mainColor);
    box-shadow: 1px 6px 4px @btn-disabled;
    box-shadow: 1px 6px 4px var(--mainTableHover);
  }
}
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
  .dotted {
    margin: 0 auto 22px;
    border-top: 1px dotted #000;
    width: 401px;
    height: 1px;
  }
}
.waitingText {
  font-size: 16px;
  font-weight: bold;
  color: rgba(101, 101, 101, 1);
  margin-bottom: 8px;
}
.waitingText1 {
  font-size: 16px;
  // font-family: SimSun;
  color: rgba(87, 87, 87, 1);
  opacity: 0.8;
}
</style>
