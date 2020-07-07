<template>
  <div class="withdrawfee-main">
    <BusinessTitle isShowBack :title="$route.query.type ==='token'?'支付令交易详单':'金币交易回单'"></BusinessTitle>
    <TransactionDetail title="付款回单" :trade-type="basicInfo.transactionType" :trade-time="basicInfo.transactionTime"
      :trade-code="basicInfo.transactionCode" :trade_back_code="basicInfo.serialNumber" :operator_name="basicInfo.operatorName"
      :admin_name="basicInfo.adminName">
      <div class="current-content">
        <div class="title-style">企业名称: {{basicInfo.enterpriseName}}</div>
        <div class="title-style">统一社会信用代码: {{basicInfo.enterpriseCreditCode}}</div>
        <div class="title-style">
          服务费金额: {{basicInfo.amount | toThousands}}
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
export default {
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
        // 付款企业
        enterpriseName: '',
        // 信用代码
        enterpriseCreditCode: '',
        // 关联方信用代码
        relatedPartyCreditCode: '',
        // 关联方名称
        relatedPartyName: '',
        // 金额
        amount: '',
        // 大写
        amountTransform: ''
      },
      // 获取交易编号
      transactionCode: this.$route.query.code,
      // 提现服务费详单 Url
      getWithdrawFeeUrl: settings.apiGateway.getAccountDetail,
      getWithdrawDeductionUrl: settings.apiGateway.getAccountDetail
    }
  },
  created () {
    this.getDetailData()
  },
  methods: {
    getDetailData () {
      let url = this.$route.query.type === 'token' ? this.getWithdrawFeeUrl : this.getWithdrawDeductionUrl
      this.fetch(`${url}/${this.transactionCode}`).then(data => {
        this.basicInfo = data.data
      }).catch(data => {
        this.$message.error(data.msg)
      })
    }
  }
}
</script>

<style lang="less" scoped>
.withdrawfee-main {
  .current-content {
    float: left;
    margin-top: 40px;
    .title-style {
      margin: 17px 0;
    }
  }
}
</style>
