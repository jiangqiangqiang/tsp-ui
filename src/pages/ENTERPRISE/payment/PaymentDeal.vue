<template>
  <div class="payment-deal">
    <BusinessTitle isShowBack title="支付交易详情"></BusinessTitle>
    <DealDetail :dealDetail="basicInfo" isApplyTime>
      <template slot="dealInfo">
        <div class="enpInfo">
          <div class="paymentInfo">
            <div>付款企业</div>
            <div>企业名称： {{basicInfo.payerName}}</div>
            <div>企业证件号：{{basicInfo.payerCreditCode}}</div>
          </div>
          <div style="width:15px"></div>
          <div class="paymentInfo">
            <div>收款企业</div>
            <div>企业名称： {{basicInfo.payeeName}}</div>
            <div>企业证件号：{{basicInfo.payeeCreditCode}}</div>
          </div>
        </div>
      </template>
      <template slot="feeList" v-if="basicInfo.status !== 'PAYER_OPE_REJECT' && basicInfo.status !== 'PAY_TIME_OUT'">
        <div class="buyTableTitle">支付令明细</div>
        <div class="dotted"></div>
        <div class="dealInfo">
          <el-table :data="balanceDetail" stripe border style="width: 100%" header-align='center' show-summary
          class="credit-table-color-blue sy-global-has-gutter__th--text-center sy-global-el-table-fit--border" :summary-method="getSummaries">
            <el-table-column type="index" label="序号" width="50"></el-table-column>
            <el-table-column prop="balance" label="支付令">
              <template slot-scope="scope">
                  {{scope.row.balance | toThousands}}
                </template>
            </el-table-column>
            <el-table-column  label="支付令时间">
              <el-table-column prop="arrivalTime" label="提现日期" width="95">
                <template slot-scope="scope">
                  {{scope.row.arrivalTime || '--'}}
                </template>
              </el-table-column>
              <el-table-column prop="days" label="已持有天数"></el-table-column>
              <el-table-column prop="lastDays" label="剩余天数"></el-table-column>
            </el-table-column>
            <el-table-column prop="rate" label="折现利率" width="70">
              <template slot-scope="scope">
                  <span v-if="scope.row.remark!==1 && scope.row.remark!==3 && scope.row.remark!==4">{{scope.row.rate/10000}}%</span>
                  <span v-else>--</span>
                </template>
            </el-table-column>
            <el-table-column prop="current" label="折合现金（￥）">
              <template slot-scope="scope">
                  {{scope.row.current | toThousands}}
                </template>
            </el-table-column>
            <el-table-column prop="remark" label="备注" width="78">
              <template slot-scope="scope">
                  {{scope.row.remark | remarkType}}
                </template>
            </el-table-column>
          </el-table>
        </div>
      </template>
      <template slot="feeInfo">
          <table>
            <tr>
              <td>发起收款金额</td>
              <td><span>{{basicInfo.transactionAmount | toThousands}}</span></td>
            </tr>
            <tr>
              <td>提现日期</td>
              <td><span>{{basicInfo.arrivalAccountTime}}</span>&nbsp;&nbsp;<span
                  style="color:#D9D9D9">|</span>&nbsp;&nbsp;{{basicInfo.days}}天
              </td>
            </tr>
            <tr v-if="basicInfo.status !== 'PAYER_OPE_REJECT' && basicInfo.status !== 'PAY_TIME_OUT'">
              <td>支付金额</td>
              <td><span>{{basicInfo.transactionAmount | toThousands}}</span></td>
            </tr>
            <tr v-if="basicInfo.status !== 'PAYER_OPE_REJECT' && basicInfo.status !== 'PAY_TIME_OUT'">
              <td>平台补贴</td>
              <td><span>{{basicInfo.subsidy | toThousands}}</span></td>
            </tr>
            <tr v-if="basicInfo.status !== 'PAYER_OPE_REJECT' && basicInfo.status !== 'PAY_TIME_OUT'">
              <td>服务费</td>
              <td>
                <span>{{basicInfo.transactionCost || 0 | toThousands}}</span>
              </td>
            </tr>
            <tr v-if="basicInfo.status !== 'PAYER_OPE_REJECT' && basicInfo.status !== 'PAY_TIME_OUT'" style="height:63px">
              <td class="mainBgColor">应付现金</td>
              <td class="mainBgColor"><span class="amountColor">{{basicInfo.currentAmount || 0 | toThousands}}</span>
              <p class="cnfnot">{{basicInfo.currentAmount | amountToChinese}}</p>
              </td>
            </tr>
          </table>
        <!-- <div class="feeInfo">
          <div>付款金额：<span class="status">{{basicInfo.transactionAmount || 0 | toThousands}}</span></div>
          <div>服务费：<span class="status">{{basicInfo.transactionCost || 0 | toThousands}}</span></div>
          <div class="dotted"></div>
          <div>实际支付金额：<span class="status realAtext">{{basicInfo.transactionAmount + basicInfo.transactionCost | toThousands}}</span></div>
          <div style="height:30px;"><span class="status realCh">大写：{{basicInfo.transactionAmount + basicInfo.transactionCost | amountToChinese}}</span></div>
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
  name: 'paymentDeal',
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
      balanceDetail: [],
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
        this.balanceDetail = this.basicInfo.balanceList
      }).catch(data => {
        this.$message.error(data.msg)
      })
    },
    getSummaries (param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计'
          return
        }
        const values = data.map(item => Number(item[column.property]))
        if (!values.every(value => isNaN(value))) {
          if (index === 1 || index === 6) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr)
              if (!isNaN(value)) {
                return prev + curr
              } else {
                return prev
              }
            }, 0)
          } else {
            sums[index] = ''
          }
        } else {
          sums[index] = ''
        }
      })
      sums.forEach((item, index) => {
        if (index !== 0) {
          sums[index] = this.toThousands(sums[index])
        }
      })
      return sums
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
.payment-deal {
  .enpInfo {
    width: 100%;
    display: table;
  }
  .paymentInfo {
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
.payment-deal/deep/.credit-table-color-blue tr {
  cursor: default;
  background-color: @table-bg;
  background-color: var(--mainTableBg) !important;
}
.payment-deal/deep/.credit-table-color-blue .el-table__body tr {
  &:nth-of-type(2n + 1):hover > td {
    background-color: @table-hover;
    background-color: var(--mainTableHover) !important;
  }
}
.payment-deal/deep/.el-table th>.cell {
  padding: 0 3px;
}
.payment-deal/deep/.el-table__footer-wrapper td {
  text-align: center;
}
</style>
