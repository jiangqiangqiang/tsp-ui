<template>
  <div class="top-up-deal">
    <BusinessTitle isShowBack title="充值交易详情"></BusinessTitle>
    <DealDetail :dealDetail="basicInfo">
      <template slot="dealInfo">
        <div class="topUpInfo">
          <div>充值企业</div>
          <div>企业名称： {{basicInfo.enterpriseName}}</div>
          <div>企业证件号：{{basicInfo.creditCode}}</div>
        </div>
      </template>
      <template slot="feeInfo">
        <div class="feeInfo">
          <table>
            <tr>
              <td>充值支付令</td>
              <td>
                <span>{{basicInfo.depositAmount | toThousands}}</span>
              </td>
            </tr>
            <tr>
              <td>服务费</td>
              <td>
                <span>{{basicInfo.serviceAmount | toThousands}}</span>
              </td>
            </tr>
            <tr style="height:63px">
              <td>实际支付金额</td>
              <td>
                <span class="amountColor">{{basicInfo.realAmount | toThousands}}</span>
                <p class="cnfnot">{{basicInfo.realAmount | amountToChinese}}</p>
              </td>
            </tr>
          </table>
        </div>
      </template>
    </DealDetail>
  </div>
</template>

<script>
import settings from '@/settings'
import BusinessTitle from '@/components/BusinessTitle'
import DealDetail from '@/components/DealDetail'
export default {
  name: 'topupdeal',
  components: { BusinessTitle, DealDetail },
  data () {
    return {
      // 交易详单基本信息
      basicInfo: {
        // 交易时间
        transactionTime: '',
        // 业务类型
        transactionType: '',
        // 充值方
        enterpriseName: '',
        // 信用代码
        creditCode: '',
        // 支付令金额
        depositAmount: '',
        // 折让金额
        discountAmount: '',
        // 服务费
        serviceAmount: '',
        // 实际支付金额
        realAmount: ''
      },
      // 获取交易编号
      txCode: this.$route.query.code,
      // 充值详单 Url
      getDepositDetailUrl: settings.apiGateway.getDepositDetail
    }
  },
  created () {
    this.checkOderStatus()
  },
  methods: {
    checkOderStatus () {
      this.fetch(`${this.getDepositDetailUrl}${this.txCode}`).then(data => {
        this.basicInfo = data.data
      }).catch(data => {
        this.$message.error(data.msg)
      })
    }
  }
}
</script>

<style lang="less" scoped>
@import '~@/assets/less/variables';
.cnfnot {
  font-size: 13px;
  line-height: 13px;
  margin-bottom: 8px;
}
.top-up-deal {
  .topUpInfo {
    width: calc(~'100% - 12px');
    color: rgba(101, 101, 101, 1);
    font-size: 14px;
    border: 1px solid #e1e1e1;
    background-color: #f2f9ff;
    background-color: var(--mainTableBg);
    line-height: 35px;
    padding-left: 10px;
  }
  .dotted {
    border-top: 1px dotted #4B4B4B;
    width: 100%;
    height: 1px;
    margin: 10px 0 10px -10px;
    padding: 0 10px;
  }
  .realAtext {
    color: @theme-blue;
    color: var(--mainColor);
    font-weight: bold;
  }
  .realCh {
    color:rgba(87,87,87,1);
    opacity:0.6;
  }
}
table {
  width: 100%;
  .amountColor {
    font-size: 16px;
    font-weight: bold;
    color: @theme-blue;
    color: var(--mainColor);
  }
  tr {
    td {
      height: 40px;
      line-height: 40px;
      border: 1px solid #e6e6e6;
    }
    td:first-child {
      width: 162px;
      text-align: center;
      padding: 0 15px;
      background-color: #FAFAFA;
    }
    td:last-child {
      line-height: 30px;
      text-align: left;
      padding-left: 20px;
    }
  }
  tr:nth-child(3), tr:nth-child(3) td {
    background-color: @theme-blue-light;
    background-color: var(--mainLightColor);
  }
}
</style>
