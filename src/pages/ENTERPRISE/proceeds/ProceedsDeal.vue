<template>
  <div class="proceeds-deal">
    <BusinessTitle isShowBack title="收款交易详情"></BusinessTitle>
    <DealDetail :dealDetail="basicInfo">
      <template slot="dealInfo">
        <div class="enpInfo">
          <div class="proceedsInfo">
            <div>付款企业</div>
            <div>企业名称： {{basicInfo.payerName}}</div>
            <div>企业证件号：{{basicInfo.payerCreditCode}}</div>
          </div>
          <div style="width:15px"></div>
          <div class="proceedsInfo">
            <div>收款企业</div>
            <div>企业名称： {{basicInfo.payeeName}}</div>
            <div>企业证件号：{{basicInfo.payeeCreditCode}}</div>
          </div>
        </div>

      </template>
      <template slot="feeInfo">
        <div class="feeInfo">
          <table>
            <tr>
              <td>提现日期：</td>
              <td>
                <span>{{basicInfo.arrivalAccountTime || ''}}</span>
                &nbsp;&nbsp;<span style="color:#D9D9D9">|</span>&nbsp;&nbsp;{{basicInfo.days || 0}}天
              </td>
            </tr>
            <tr style="height:63px">
              <td>收款金额：</td>
              <td>
                <span class="amountColor">{{basicInfo.transactionAmount | toThousands}}</span>
                <p class="cnfnot">{{basicInfo.transactionAmount | amountToChinese}}</p>
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
  name: 'proceedsDeal',
  components: { BusinessTitle, DealDetail },
  data () {
    return {
      // 交易详单基本信息
      basicInfo: {
        // 交易时间
        transactionTime: '',
        // 业务类型
        transactionType: '',
        payerName: '',
        payeeName: '',
        // 信用代码
        payerCreditCode: '',
        payeeCreditCode: '',
        // 收款金额
        transactionAmount: ''
      },
      // 获取交易编号
      txCode: this.$route.query.code,
      // 充值详单 Url
      paymentDetailUrl: settings.apiGateway.paymentDetail
    }
  },
  created () {
    this.checkOderStatus()
  },
  methods: {
    checkOderStatus () {
      this.fetch(`${this.paymentDetailUrl}${this.txCode}`).then(data => {
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
.proceeds-deal {
  .enpInfo {
    width: 100%;
    display: table;
  }
  .proceedsInfo {
    display: table-cell;
    text-align: justify;
    vertical-align: middle;
    width: calc(~'50% - 16px');
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
      text-align: left;
      padding-left: 20px;
      line-height: 30px;
    }
  }
  tr:nth-child(2), tr:nth-child(2) td {
    background-color: @theme-blue-light;
    background-color: var(--mainLightColor);
  }
}
</style>
