<template>
  <div class="sale-main">
    <BusinessTitle isShowBack title="支付令交易详单"></BusinessTitle>
    <TransactionDetail title="收款回单" :trade-type="basicInfo.transactionType" :trade-time="basicInfo.transactionTime"
      :trade-code="basicInfo.transactionCode" :trade_back_code="basicInfo.serialNumber"
      :operator_name="basicInfo.operatorName" :admin_name="basicInfo.adminName">
      <div class="current-content">
        <div class="title-style">出售企业 : {{basicInfo.enterpriseName}}</div>
        <div class="title-style">统一社会信用代码 : {{basicInfo.enterpriseCreditCode}}</div>
        <div class="title-style">
          出售转换金额 : {{basicInfo.amount | toThousands}}
          <span>({{basicInfo.amount | amountToChinese}})</span>
        </div>
        <!-- <div class="title-style">操作员: {{basicInfo.operatorName}}</div> -->
      </div>
    </TransactionDetail>
  </div>
</template>

<script>
import settings from '@/settings'
import BusinessTitle from '@/components/BusinessTitle'
import TransactionDetail from '@/components/TransactionDetail'
export default {
  name: 'topupschedule',
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
        // 充值方
        enterpriseName: '',
        // 信用代码
        enterpriseCreditCode: '',
        // 发放金额
        amount: ''
      },
      // 获取交易编号
      txCode: this.$route.query.code,
      // 充值详单 Url
      getSaleConvertUrl: settings.apiGateway.getAccountDetail
    }
  },
  created () {
    this.checkOderStatus()
  },
  methods: {
    checkOderStatus () {
      this.fetch(`${this.getSaleConvertUrl}/${this.txCode}`).then(data => {
        this.basicInfo = data.data
      }).catch(data => {
        this.$message.error(data.msg)
      })
    }
  }
}
</script>

<style lang="less" scoped>
.sale-main {
  .current-content {
    float: left;
    margin-top: 20px;
    .title-style {
      margin: 17px 0;
    }
  }
}
</style>
