<template>
  <div class="invitereward-main">
    <BusinessTitle isShowBack :title="$route.query.type ==='token'?'支付令交易详单':'金币交易回单'"></BusinessTitle>
    <TransactionDetail title="金币奖励回单" :trade-type="basicInfo.transactionType" :trade-time="basicInfo.transactionTime"
      :trade-code="basicInfo.transactionCode" :trade_back_code="basicInfo.serialNumber" :operator_name="basicInfo.operatorName"
      :admin_name="basicInfo.adminName">
      <div class="current-content">
        <div class="title-style">充值企业 : {{basicInfo.relatedPartyName}}</div>
        <div class="title-style">统一社会信用代码 : {{basicInfo.relatedPartyCreditCode}}</div>
        <div class="title-style">
          交易金币 : {{basicInfo.amount | toThousands}}
          <span>({{basicInfo.amount | transformChinese}})</span>
        </div>
        <div class="title-style">奖励企业 : {{basicInfo.enterpriseName}}</div>
        <div class="title-style">统一社会信用代码 : {{basicInfo.enterpriseCreditCode}}</div>
      </div>
    </TransactionDetail>
  </div>
</template>

<script>
import settings from '@/settings'
import BusinessTitle from '@/components/BusinessTitle'
import TransactionDetail from '@/components/TransactionDetail'
export default {
  name: 'agentgoldrewardschedule',
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
      transactionCode: this.$route.query.code,
      // 邀请奖励详单 Url
      getGoldRewardUrl: settings.apiGateway.getAccountDetail
    }
  },
  created () {
    this.getDetailData()
  },
  methods: {
    getDetailData () {
      this.fetch(`${this.getGoldRewardUrl}/${this.transactionCode}`).then(data => {
        this.basicInfo = data.data
      }).catch(data => {
        this.$message.error(data.msg)
      })
    }
  }
}
</script>

<style lang="less" scoped>
.invitereward-main {
  .current-content {
    float: left;
    margin-top: 40px;
    .title-style {
      margin: 17px 0;
    }
    .reason {
      font-weight: 600;
    }
  }
}
</style>
