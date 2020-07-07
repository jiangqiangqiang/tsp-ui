<template>
  <div class="sale-deal">
    <BusinessTitle isShowBack title="出售交易详情"></BusinessTitle>
    <DealDetail :dealDetail="basicInfo" isShowFinal isSaleStatus>
      <template slot="dealInfo">
        <div class="saleInfo">
          <div>出售企业</div>
          <div>企业名称： {{basicInfo.enpName}}</div>
          <div>企业证件号：{{basicInfo.enpCreditCode}}</div>
        </div>
        <div>自动下架：{{basicInfo.deadline}}</div>
      </template>
      <template slot="amountList">
        <el-table :data="balanceDetail" stripe border style="width: 100%" header-align='center'
          class="credit-table-color-blue sy-global-has-gutter__th--text-center sy-global-el-table-fit--border">
            <el-table-column prop="endTime" label="提现日期" width="95"></el-table-column>
            <el-table-column prop="holdDays" label="已持有天数"></el-table-column>
            <el-table-column prop="surplusDays" label="剩余天数"></el-table-column>
            <el-table-column prop="sellAmount" label="出售令额度">
              <template slot-scope="scope">
                {{scope.row.sellAmount | toThousands}}
              </template>
            </el-table-column>
            <el-table-column prop="cashBalance" label="折合现金（￥）">
              <template slot-scope="scope">
                {{scope.row.cashBalance | toThousands}}
              </template>
            </el-table-column>
          </el-table>
        <!-- <table class="amountList">
          <tr>
            <td>入账时间</td>
            <td>持有期</td>
            <td>金额</td>
          </tr>
          <tr v-for="(feeLis, index) in basicInfo.list" :key="index">
            <td>{{feeLis.receiptTimeStr}}</td>
            <td>{{feeLis.holdingPeriod}}天</td>
            <td>{{feeLis.sellAmount/100 | toThousands}}</td>
          </tr>
        </table> -->
      </template>
      <template slot="feeInfo">
        <table>
            <tr>
              <td>出售支付令</td>
              <td><span>{{basicInfo.totalAmount | toThousands}}</span></td>
            </tr>
            <tr>
              <td>折合现金</td>
              <td><span>{{basicInfo.cashAmount | toThousands}}</span></td>
            </tr>
            <tr>
              <td>折扣率</td>
              <td><span>{{basicInfo.rate*100}}%&nbsp;&nbsp;<span
                  style="color:#D9D9D9">|</span>&nbsp;&nbsp;折算金额 {{basicInfo.cashAmount * basicInfo.rate || 0 | toThousands}}</span>
              </td>
            </tr>
            <tr>
              <td>服务费</td>
              <td>
                <span>{{basicInfo.serviceAmount || 0 | toThousands}}</span>
              </td>
            </tr>
            <tr style="height:63px">
              <td class="mainBgColor">实际到账金额</td>
              <td class="mainBgColor"><span class="amountColor">{{(basicInfo.cashAmount * basicInfo.rate - basicInfo.serviceAmount) || 0 | toThousands}}</span>
               <p class="cnfnot">{{(basicInfo.cashAmount * basicInfo.rate - basicInfo.serviceAmount) | amountToChinese}}</p>
              </td>
            </tr>
          </table>
        <!-- <div class="feeInfo">
          <div>出售支付令：<span class="status">{{basicInfo.totalAmount/100 || 0 | toThousands}}</span></div>
          <div class="dotted"></div>
          <div>折扣率：<span class="status">{{basicInfo.rate*100}}%</span></div>
          <div>报价：<span class="status">{{basicInfo.amount/100 || 0 | toThousands}}</span></div>
          <div>实时服务费：<span class="status">{{basicInfo.serviceAmount/100 || 0 | toThousands}}</span></div>
          <div class="dotted"></div>
          <div>实际到账金额：<span
              class="status realAtext">{{(basicInfo.amount - basicInfo.serviceAmount)*100/10000 || 0 | toThousands}}</span>
          </div>
          <div style="height:30px;"><span
              class="status realCh">大写：{{(basicInfo.amount - basicInfo.serviceAmount)*100/10000 || 0 | amountToChinese}}</span>
          </div>
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
  name: 'saledeal',
  components: { BusinessTitle, DealDetail },
  data () {
    return {
      // 交易详单基本信息
      basicInfo: {
        // 交易时间
        transactionTime: '',
        // 业务类型
        transactionType: '',
        // 出售方
        enterpriseName: '',
        // 信用代码
        creditCode: '',
        // 出售金额
        depositAmount: '',
        // 折让金额
        discountAmount: '',
        // 服务费
        serviceAmount: '',
        // 实际支付金额
        realAmount: '',
        sellOrder: {},
        list: []
      },
      balanceDetail: [],
      // 获取交易编号
      txCode: this.$route.query.code,
      // 出售详单 Url
      getOderDetailUrl: settings.apiGateway.getOderDetail
    }
  },
  created () {
    this.checkOderStatus()
  },
  methods: {
    checkOderStatus () {
      this.fetch(this.getOderDetailUrl + '?txCode=' + this.$route.query.code).then(data => {
        this.basicInfo = data.data
        this.basicInfo.status = data.data.status
        this.basicInfo.transactionCode = data.data.transcationCode
        this.basicInfo.remark = data.data.remark
        this.basicInfo.operatorName = data.data.operatorName
        this.basicInfo.adminName = data.data.adminName
        this.balanceDetail = data.data.sellOrderDetailDtos
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
.sale-deal {
  .saleInfo {
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
  .amountList {
    color: rgba(101, 101, 101, 1);
    width: calc(~'100% - 2px');
    font-size: 14px;
    line-height: 40px;
    padding-left: 10px;
    border-collapse: collapse;
    tr {
      td {
        border: 1px solid #e1e1e1;
        text-align: center;
      }
    }
    tr:nth-child(2n+1) td {
      line-height: 30px;
      background-color: #f2f9ff;
      background-color: var(--mainTableBg);
    }
    tr:nth-child(1) td {
      background-color: #fcfcfc;
    }
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
.sale-deal/deep/.credit-table-color-blue tr {
  cursor: default;
  background-color: @table-bg;
  background-color: var(--mainTableBg) !important;
}
.sale-deal/deep/.credit-table-color-blue .el-table__body tr {
  &:nth-of-type(2n + 1):hover > td {
    background-color: @table-hover;
    background-color: var(--mainTableHover) !important;
  }
}
.sale-deal/deep/ .el-table th {
  padding-top: 4px;
  padding-bottom: 4px;
}
.sale-deal/deep/.el-table th>.cell {
  padding: 0 3px;
}
.sale-deal/deep/.el-table__footer-wrapper td {
  text-align: center;
}
</style>
