<template>
  <div class="buy-deal">
    <BusinessTitle isShowBack title="购买交易详情"></BusinessTitle>
    <DealDetail :dealDetail="basicInfo" isShowFinal>
      <template slot="dealInfo">
        <div class="buyInfo">
          <div>购买企业</div>
          <div>企业名称： {{basicInfo.enpName}}</div>
          <div>企业证件号：{{basicInfo.enpCreditCode}}</div>
        </div>
      </template>
      <template slot="feeInfo">
        <table>
            <tr>
              <td>购买支付令</td>
              <td><span>{{basicInfo.tokenNum | toThousands}}</span></td>
            </tr>
            <tr>
              <td>折扣率</td>
              <td><span>{{basicInfo.rate*100}}%</span>
              </td>
            </tr>
            <tr>
              <td>报价</td>
              <td><span>{{basicInfo.amount | toThousands}}</span></td>
            </tr>
            <tr>
              <td>服务费</td>
              <td>
                <span>{{basicInfo.fee || 0 | toThousands}}&nbsp;</span>
              </td>
            </tr>
            <tr style="height:63px">
              <td class="mainBgColor">实际支付金额</td>
              <td class="mainBgColor"><span class="amountColor">{{basicInfo.realAmount || 0 | toThousands}}</span>
              <p class="cnfnot">{{basicInfo.realAmount || 0 | amountToChinese}}</p>
              </td>
            </tr>
          </table>
        <!-- <div class="feeInfo">
          <div>购买支付令：<span class="status">{{basicInfo.tokenNum || 0 | toThousands}}</span></div>
          <div class="dotted"></div>
          <div>折扣率：<span class="status">{{basicInfo.rate*100}}%</span></div>
          <div>报价：<span class="status">{{basicInfo.amount || 0 | toThousands}}</span></div>
          <div>服务费：<span class="status">{{basicInfo.fee || 0 | toThousands}}</span></div>
          <div class="dotted"></div>
          <div>实际支付金额：<span class="status realAtext">{{basicInfo.realAmount || 0 | toThousands}}</span></div>
          <div style="height:30px;"><span class="status realCh">大写：{{basicInfo.realAmount || 0 | amountToChinese}}</span></div>
        </div> -->
      </template>
    </DealDetail>
  </div>
</template>

<script>
import settings from '@/settings'
import BusinessTitle from '@/components/BusinessTitle'
import DealDetail from '@/components/DealDetail'
export default {
  name: 'buydeal',
  components: { BusinessTitle, DealDetail },
  data () {
    return {
      // 交易详单基本信息
      basicInfo: {
        // 交易时间
        transactionTime: '',
        // 业务类型
        transactionType: '',
        // 购买方
        enterpriseName: '',
        // 信用代码
        creditCode: '',
        // 购买金额
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
      // 购买详单 Url
      getBuyerDetailUrl: settings.apiGateway.getBuyerDetail
    }
  },
  created () {
    this.checkOderStatus()
  },
  methods: {
    checkOderStatus () {
      this.fetch(`${this.getBuyerDetailUrl}${this.txCode}`).then(data => {
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
.buy-deal {
  .buyInfo {
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
        background-clip: padding-box;
      }
      td:first-child {
        width: 130px !important;
        text-align: center;
        padding: 0 15px;
        background-color: #FAFAFA;
      }
      td:last-child {
        text-align: left;
        padding-left: 20px;
        line-height: 30px;
      }
      .mainBgColor {
        background-color: @theme-blue-light !important;
        background-color: var(--mainLightColor) !important;
      }
    }
  }
</style>
