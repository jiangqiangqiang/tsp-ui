<template>
  <div class="withdraw-main">
    <BusinessTitle isShowBack title="支付令交易详单"></BusinessTitle>
    <TransactionDetail
      title="支付令交易详单"
      trade-type="提现"
      :trade-time="basicInfo.transactionTime"
      :trade-code="txCode">
      <div class="current-content">
        <div class="title-style">提现方: {{basicInfo.enterpriseName}}</div>
        <div class="title-style">统一社会信用代码: {{basicInfo.enterpriseCreditCode}}</div>
        <div class="title-style">
          金额: {{basicInfo.amount | toThousands}}
          <span>({{basicInfo.amount | amountToChinese}})</span>
        </div>
        <div class="title-style">管理员: {{basicInfo.adminName}}</div>
        <div class="title-style">操作员: {{basicInfo.operatorName}}</div>
      </div>
    </TransactionDetail>
  </div>
</template>

<script>
import settings from '@/settings'
import BusinessTitle from '@/components/BusinessTitle'
import TransactionDetail from '@/components/TransactionDetail'
export default {
  name: 'withdrawschedule',
  components: { BusinessTitle, TransactionDetail },
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
        amountTransform: ''
      },
      // 获取交易编号
      txCode: this.$route.query.code,
      // 提现详单 Url
      getWithdrawUrl: settings.apiGateway.getAccountDetail
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
  .current-content {
    float: left;
    margin-top: 40px;
    .title-style {
      margin: 17px 0;
    }
  }
}
</style>
