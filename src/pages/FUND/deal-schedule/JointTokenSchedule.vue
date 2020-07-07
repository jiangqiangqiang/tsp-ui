<template>
  <div class="circulationreward-main">
    <BusinessTitle isShowBack title="支付令交易详单"></BusinessTitle>
    <TransactionDetail
      title="支付令交易详单"
      trade-type="联合发令"
      :trade-time="basicInfo.transactionTime"
      :trade-code="txCode">
      <div class="current-content">
        <div class="title-style">收款企业: {{basicInfo.enterpriseName}}</div>
        <div class="title-style">统一社会信用代码: {{basicInfo.enterpriseCreditCode}}</div>
        <div class="title-style">
          金额: {{basicInfo.amount | toThousands}}
          <span>({{basicInfo.amount | amountToChinese}})</span>
        </div>
        <div style="margin-top: 50px">
          <div class="title-style">企业方: {{basicInfo.relatedPartyName}}</div>
          <div class="title-style">统一社会信用代码: {{basicInfo.relatedPartyCreditCode}}</div>
        </div>
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
  name: 'circulationrewardschedule',
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
      txCode: this.$route.query.code,
      // 流通奖励详单 Url
      getJointTokenRewardUrl: settings.apiGateway.getAccountDetail
    }
  },
  created () {
    this.role = this.getUserRole()
    this.getDetailData()
  },
  methods: {
    getDetailData () {
      this.fetch(`${this.getJointTokenRewardUrl}/${this.txCode}`).then(data => {
        this.basicInfo = data.data
      }).catch(data => {
        this.$message.error(data.msg)
      })
    }
  }
}
</script>

<style lang="less" scoped>
.circulationreward-main {
  .current-content {
    float: left;
    margin-top: 40px;
    .title-style {
      margin: 17px 0;
    }
  }
}
</style>
