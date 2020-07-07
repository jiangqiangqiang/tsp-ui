<template>
  <div class="payment-main">
    <BusinessTitle isShowBack title="支付令交易详单"></BusinessTitle>
    <TransactionDetail title="付款回单" :trade-type="basicInfo.transactionType" :trade-time="basicInfo.transactionTime"
      :trade-code="basicInfo.transactionCode" :trade_back_code="basicInfo.serialNumber" :operator_name="basicInfo.operatorName"
      :admin_name="basicInfo.adminName">
      <div class="current-content">
        <div class="title-style">付款企业 : {{basicInfo.enterpriseName}}</div>
        <div class="title-style">统一社会信用代码 : {{basicInfo.enterpriseCreditCode}}</div>
        <div class="title-style">
          支付金额 : {{basicInfo.amount | toThousands}}
          <span>({{basicInfo.amount | amountToChinese}})</span>
        </div>
        <!-- <div class="title-style" style="margin-bottom: 59px;">备注: {{basicInfo.reason}}</div> -->
        <div class="title-style" style="margin-top:30px">收款企业名称 : {{basicInfo.relatedPartyName}}</div>
        <div class="title-style">统一社会信用代码 : {{basicInfo.relatedPartyCreditCode}}</div>
      </div>
    </TransactionDetail>
  </div>
</template>

<script>
import settings from '@/settings'
import BusinessTitle from '@/components/BusinessTitle'
import TransactionDetail from '@/components/TransactionDetail'
export default {
  name: 'paymentschedule',
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
        // 收款企业
        enterpriseName: '',
        // 收款企业信用代码
        enterpriseCreditCode: '',
        // 付款企业
        relatedPartyName: '',
        // 付款企业信用代码
        relatedPartyCreditCode: '',
        // 金额
        amount: '',
        // 大写
        amountTransform: '',
        // 备注
        reason: ''
      },
      // 获取交易编号
      txCode: this.$route.query.code,
      // 支付详单 Url
      getPaymentUrl: settings.apiGateway.getAccountDetail
    }
  },
  created () {
    this.getDetailData()
  },
  methods: {
    getDetailData () {
      this.fetch(`${this.getPaymentUrl}/${this.txCode}`).then(data => {
        this.basicInfo = data.data
      }).catch(data => {
        this.$message.error(data.msg)
      })
    }
  }
}
</script>

<style lang="less" scoped>
.payment-main {
  .current-content {
    float: left;
    margin-top: 20px;
    .title-style {
      margin: 17px 0;
    }
  }
}
</style>
