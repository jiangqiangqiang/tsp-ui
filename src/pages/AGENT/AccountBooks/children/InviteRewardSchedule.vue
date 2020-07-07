<template>
  <div class="invitereward-main">
    <BusinessTitle isShowBack title="支付令交易详单"></BusinessTitle>
    <TransactionDetail
      title="支付令交易详单"
      trade-type="邀请奖励"
      :trade-time="basicInfo.transactionTime"
      :trade-code="basicInfo.transactionCode">
      <div class="current-content">
        <div class="title-style">收款企业: {{basicInfo.enterpriseName}}</div>
        <div class="title-style">统一社会信用代码: {{basicInfo.enterpriseCreditCode}}</div>
        <div class="title-style">
          金额: {{basicInfo.amount | toThousands}}
          <span>({{basicInfo.amount | amountToChinese}})</span>
        </div>
        <div class="title-style">管理员: {{basicInfo.adminName}}</div>
      </div>
    </TransactionDetail>
  </div>
</template>

<script>
import settings from '@/settings'
import BusinessTitle from '@/components/BusinessTitle'
import TransactionDetail from '@/components/TransactionDetail'
export default {
  name: 'inviterewardschedule',
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
      getInviteRewardUrl: settings.apiGateway.getAccountDetail
    }
  },
  created () {
    this.getDetailData()
  },
  methods: {
    getDetailData () {
      this.fetch(`${this.getInviteRewardUrl}/${this.transactionCode}`).then(data => {
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
  }
}
</style>
