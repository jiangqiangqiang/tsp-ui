<template>
  <div class="operation-main">
    <!-- 折扣 -->
    <BusinessTitle isShowBack title="支付令交易详单"></BusinessTitle>
    <TransactionDetail title="收款回单" :trade-type="basicInfo.transactionType" :trade-time="basicInfo.transactionTime"
      :trade-code="basicInfo.transactionCode" :trade_back_code="basicInfo.serialNumber" :operator_name="basicInfo.operatorName"
      :admin_name="basicInfo.adminName">
      <div class="current-content">
        <div class="title-style">企业名称 : {{basicInfo.enterpriseName}}</div>
        <div class="title-style">统一社会信用代码 : {{basicInfo.enterpriseCreditCode}}</div>
        <div class="title-style">
          折扣金额 : {{basicInfo.amount | toThousands}}
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
      getPayformFeeUrl: settings.apiGateway.getAccountDetail,
      getPayServerChargeDeductionUrl: settings.apiGateway.getAccountDetail
    }
  },
  created () {
    this.getDetailData()
  },
  methods: {
    getDetailData () {
      let url = this.$route.query.type === 'token' ? this.getPayformFeeUrl : this.getPayServerChargeDeductionUrl
      this.fetch(`${url}/${this.txCode}`).then(data => {
        this.basicInfo = data.data
      }).catch(data => {
        this.$message.error(data.msg)
      })
    }
  }
}
</script>

<style lang="less" scoped>
.operation-main {
  .current-content {
    float: left;
    margin-top: 40px;
    .title-style {
      margin: 17px 0;
    }
  }
}
</style>
