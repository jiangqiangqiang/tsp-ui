<template>
  <div class="withdraw-main">
    <BusinessTitle isShowBack :title="$route.query.type==='info' ? '提现结果':'支付令交易详单'"></BusinessTitle>
    <p class="stepText" v-if="$route.query.type==='info'">提现进度</p>
    <Steps :stepInfo="stepInfo" v-if="$route.query.type==='info'"></Steps>
    <TransactionDetail title="付款回单" :trade-type="basicInfo.transactionType" :trade-time="basicInfo.transactionTime"
      :trade-code="basicInfo.transactionCode" :trade_back_code="basicInfo.serialNumber"
      :operator_name="basicInfo.operatorName" :admin_name="basicInfo.adminName">
      <div class="current-content">
        <div class="title-style">提现企业 : {{basicInfo.enterpriseName}}</div>
        <div class="title-style">统一社会信用代码 : {{basicInfo.enterpriseCreditCode}}</div>
        <div class="title-style">开户银行 : {{basicInfo.extra.bankName}}</div>
        <div class="title-style">银行账号 : {{basicInfo.extra.bankCode}}</div>
        <div class="title-style">开户行支行 : {{basicInfo.extra.bankBranchName}}</div>
        <div class="title-style">
          提现金额 : {{basicInfo.amount | toThousands}}
          <span>({{basicInfo.amount | amountToChinese}})</span>
        </div>
      </div>
    </TransactionDetail>
  </div>
</template>

<script>
import settings from '@/settings'
import BusinessTitle from '@/components/BusinessTitle'
import TransactionDetail from '@/components/TransactionDetail'
import Steps from '@/components/Steps'
export default {
  name: 'withdrawschedule',
  components: { BusinessTitle, TransactionDetail, Steps },
  data () {
    return {
      // 交易详单基本信息
      basicInfo: {
        // 交易编号
        transactionCode: '',
        // 交易时间
        transactionTime: '',
        // 业务类型
        transactionType: '',
        // 提现方
        enterpriseName: '',
        // 信用代码
        enterpriseCreditCode: '',
        // 发放金额
        amount: '',
        // 大写
        amountTransform: '',
        extra: {
          bankName: '',
          bankCode: '',
          bankBranchName: ''
        }
      },
      // 获取交易编号
      txCode: this.$route.query.code,
      // 提现详单 Url
      getWithdrawUrl: settings.apiGateway.getAccountDetail
    }
  },
  computed: {
    stepInfo () {
      if (this.basicInfo.status === 'Pending') {
        return {
          list: [{ status: '提现申请提交成功，金额冻结', statusTime: this.basicInfo.createTime }, { status: '审核通过，提交银行处理', statusTime: '' }, { status: '预计到账时间', statusTime: '' }],
          step: 1
        }
      } else if (this.basicInfo.status === 'Reject') {
        return {
          list: [{ status: '提现申请提交成功，金额冻结', statusTime: this.basicInfo.createTime }, { status: '审核被拒绝', statusTime: this.basicInfo.transactionTime }],
          step: 2
        }
      } else if (this.basicInfo.status === 'Cancel') {
        return {
          list: [{ status: '提现申请提交成功，金额冻结', statusTime: this.basicInfo.createTime }, { status: '提现取消', statusTime: this.basicInfo.transactionTime }],
          step: 2
        }
      } else if (this.basicInfo.status === 'Failed') {
        return {
          list: [{ status: '提现申请提交成功，金额冻结', statusTime: this.basicInfo.createTime }, { status: '系统异常，提现失败', statusTime: this.basicInfo.transactionTime }],
          step: 2
        }
      } else if (this.basicInfo.status === 'Expired') {
        return {
          list: [{ status: '提现申请提交成功，金额冻结', statusTime: this.basicInfo.createTime }, { status: '申请超时', statusTime: this.basicInfo.transactionTime }],
          step: 2
        }
      } else if (this.basicInfo.status === 'Sending') {
        return {
          list: [{ status: '提现申请提交成功，金额冻结', statusTime: this.basicInfo.createTime }, { status: '审核通过，提交银行处理', statusTime: this.basicInfo.auditTime }, { status: '预计到账时间', statusTime: this.basicInfo.endDate }],
          step: 2
        }
      } else if (this.basicInfo.status === 'BankRebut') {
        return {
          list: [{ status: '提现申请提交成功，金额冻结', statusTime: this.basicInfo.createTime }, { status: '审核通过，提交银行处理', statusTime: this.basicInfo.auditTime }, { status: '银行驳回，提现失败', statusTime: this.basicInfo.transactionTime }, { status: '金额退还到账户', statusTime: this.basicInfo.transactionTime }],
          step: 4
        }
      } else if (this.basicInfo.status === 'Succeed') {
        return {
          list: [{ status: '提现申请提交成功，金额冻结', statusTime: this.basicInfo.createTime }, { status: '审核通过，提交银行处理', statusTime: this.basicInfo.auditTime }, { status: '到账成功', statusTime: this.basicInfo.transactionTime }],
          step: 3
        }
      }
    }
  },
  created () {
    this.getDetailData()
  },
  methods: {
    getDetailData () {
      this.fetch(`${this.getWithdrawUrl}/${this.txCode}`).then(data => {
        this.basicInfo = data.data
      }).catch(data => {
        this.$message.error(data.msg)
      })
    }
  }
}
</script>

<style lang="less" scoped>
.withdraw-main {
  .stepText {
    font-size: 18px;
    font-weight: bold;
    color: rgba(87, 87, 87, 1);
    margin: 40px 0 30px 0;
    text-align: center;
  }
  .stepName {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #333;
  }
  .current-content {
    float: left;
    margin-top: 20px;
    .title-style {
      margin: 17px 0;
    }
  }
}
</style>
