<template>
  <div class="enterprise-transaction">
    <div>
      <BusinessTitle isShowBack title="交易情况分析"></BusinessTitle>
      <div class="enterpeise-message">
        <p class="title" style="font-size:16px;color:#656565">{{this.$route.query.name}} <el-tag class="tag">企业方
          </el-tag>
        </p>
        <div class="tableInfo">
          <div class="add-up">
          <p class="data-title">累计交易金额</p>
          <div class="issue-number">
            <div>支付令金额</div>
            <div class="issue">{{enterpriseBalance.depositBalance | toThousands}}</div>
          </div>
          <div class="line"></div>
          <div class="pay-number">
            <div>支付金额</div>
            <div class="pay">{{enterpriseBalance.paymentBalance | toThousands}}</div>
          </div>
          <div class="line"></div>
          <div class="proceed-number">
            <div>收款金额</div>
            <div class="proceed">{{enterpriseBalance.receiveBalance | toThousands}}</div>
          </div>
          <div class="line"></div>
          <div class="circulate-number">
            <div>提现金额</div>
            <div class="circulate">{{enterpriseBalance.withdrawBalance | toThousands}}</div>
          </div>
        </div>
        <div style="width:20px"></div>
        <div class="nearly-one-month">
          <p class="data-title">近一个月</p>
          <div class="issue-number">
            <div>支付令金额</div>
            <div class="issue">{{enterpriseGold.depositBalance | toThousands}}</div>
          </div>
          <div class="line"></div>
          <div class="pay-number">
            <div>支付金额</div>
            <div class="pay">{{enterpriseGold.paymentBalance | toThousands}}</div>
          </div>
          <div class="line"></div>
          <div class="proceed-number">
            <div>收款金额</div>
            <div class="proceed">{{enterpriseGold.receiveBalance | toThousands}}</div>
          </div>
          <div class="line"></div>
          <div class="circulate-number">
            <div>提现金额</div>
            <div class="circulate">{{enterpriseGold.withdrawBalance | toThousands}}</div>
          </div>
        </div>
        </div>
      </div>
    </div>
    <div class="issue-and--circulate">
      <div class="chart-radio">
        <DateRadios @UserDefined="chartLine1Change"></DateRadios>
      </div>
      <div id="chartLine1"></div>
    </div>
    <div class="income-and-expenses">
      <div class="chart-radio">
        <DateRadios @UserDefined="chartLine2Change"></DateRadios>
      </div>
      <div id="chartLine2"></div>
    </div>
    <div class="withdraw">
      <div class="chart-radio">
        <DateRadios @UserDefined="chartLine3Change"></DateRadios>
      </div>
      <div id="chartLine3"></div>
    </div>
    <!-- <div class="rebate">
      <div class="chart-radio">
        <DateRadios @UserDefined="chartLine4Change"></DateRadios>
      </div>
      <div id="chartLine4"></div>
    </div> -->
    <div class="transaction-number">
      <div class="chart-radio">
        <DateRadios @UserDefined="chartLine5Change"></DateRadios>
      </div>
      <div id="chartLine5"></div>
    </div>
  </div>
</template>

<script>
import echarts from 'echarts'
import settings from '@/settings'
import DateRadios from '@/components/DateRadios'
import BusinessTitle from '@/components/BusinessTitle'
export default {
  components: {
    DateRadios,
    BusinessTitle
  },
  data () {
    return {
      chartLine1: {},
      chartLine2: {},
      chartLine3: {},
      chartLine4: {},
      chartLine5: {},
      enterpriseBalance: {},
      enterpriseGold: {},
      eid: this.$route.query.id,
      // 企业方金额的交易情况分析的概览信息
      getEnterpriseBalanceUrl: settings.apiGateway.getEnterpriseBalance,
      // 企业方近一个月概览信息
      getEnterpriseGoldUrl: settings.apiGateway.getEnterpriseMonth,
      // 企业方发行金额分析
      getEnterpriseIssueUrl: settings.apiGateway.getEnterpriseIssue,
      // 企业方收支金额分析
      getEnterpriseIncomeUrl: settings.apiGateway.getEnterpriseIncome,
      // 企业方提现金额分析
      getEnterpriseWithdrawUrl: settings.apiGateway.getEnterpriseWithdraw,
      // 企业方收益分析
      getEnterpriseRebateUrl: settings.apiGateway.getEnterpriseRebate,
      // 企业方交易笔数分析
      getEnterpriseCountUrl: settings.apiGateway.getEnterpriseCount
    }
  },
  created () {
    this.getEnterpriseBalance()
    this.getEnterpriseGold()
  },
  methods: {
    getEnterpriseBalance () {
      this.fetch(`${this.getEnterpriseBalanceUrl}${this.eid}`).then(data => {
        this.enterpriseBalance = data.data
      }).catch(data => {
        this.$message({
          type: 'error',
          message: data.data.msg
        })
      })
    },
    getEnterpriseGold () {
      this.fetch(`${this.getEnterpriseGoldUrl}${this.eid}`).then(data => {
        this.enterpriseGold = data.data
      }).catch(data => {
        this.$message({
          type: 'error',
          message: data.data.msg
        })
      })
    },
    chartLine1Change (query) {
      this.IssueAndCirculate(query)
    },
    chartLine2Change (query) {
      this.IncomeAndExpenses(query)
    },
    chartLine3Change (query) {
      this.getWithdraw(query)
    },
    chartLine4Change (query) {
      this.getRebate(query)
    },
    chartLine5Change (query) {
      this.getTransaction(query)
    },
    IssueAndCirculate (query) {
      this.fetch(`${this.getEnterpriseIssueUrl}${this.eid}` + query).then(data => {
        this.drawLine1(data.data)
      }).catch(data => {
        this.$message({
          type: 'error',
          message: data.data.msg
        })
      })
    },
    IncomeAndExpenses (query) {
      this.fetch(`${this.getEnterpriseIncomeUrl}${this.eid}` + query).then(data => {
        this.drawLine2(data.data)
      }).catch(data => {
        this.$message({
          type: 'error',
          message: data.data.msg
        })
      })
    },
    getWithdraw (query) {
      this.fetch(`${this.getEnterpriseWithdrawUrl}${this.eid}` + query).then(data => {
        this.drawLine3(data.data)
      }).catch(data => {
        this.$message({
          type: 'error',
          message: data.data.msg
        })
      })
    },
    getRebate (query) {
      this.fetch(`${this.getEnterpriseRebateUrl}${this.eid}` + query).then(data => {
        this.drawLine4(data.data)
      }).catch(data => {
        this.$message({
          type: 'error',
          message: data.data.msg
        })
      })
    },
    getTransaction (query) {
      this.fetch(`${this.getEnterpriseCountUrl}${this.eid}` + query).then(data => {
        this.drawLine5(data.data)
      }).catch(data => {
        this.$message({
          type: 'error',
          message: data.data.msg
        })
      })
    },
    drawLine1 (lineData) {
      this.chartLine1 = echarts.init(document.getElementById('chartLine1'))
      let option = {
        title: {
          left: 'center',
          text: '支付令金额分析',
          textStyle: {
            color: '#333',
            fontSize: 20
          }
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          icon: 'rect',
          itemWidth: 30,
          itemHeight: 5,
          orient: 'vertical',
          x: 'right',
          padding: [100, 20, 0, 0],
          data: ['支付令金额']
        },
        color: ['#ee8cb2'],
        grid: {
          left: '10%',
          right: '13%',
          // bottom: '0%',
          // containLabel: true,
          show: true
        },
        dataZoom: [
          {
            type: 'slider',
            xAxisIndex: 0,
            filterMode: 'empty'
          }
        ],
        xAxis: {
          name: '日期',
          type: 'category',
          data: lineData.xaxis,
          splitLine: { show: false }
        },
        yAxis: {
          name: '金额',
          type: 'value',
          splitLine: { show: true }
        },
        series: [
          {
            name: '支付令金额',
            type: 'line',
            data: lineData.depositSeries
          }
        ]
      }
      this.chartLine1.setOption(option)
    },
    drawLine2 (lineData) {
      this.chartLine2 = echarts.init(document.getElementById('chartLine2'))
      let option = {
        title: {
          left: 'center',
          text: '收支金额分析',
          textStyle: {
            color: '#333',
            fontSize: 20
          }
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          icon: 'rect',
          itemWidth: 30,
          itemHeight: 5,
          orient: 'vertical',
          x: 'right',
          padding: [100, 20, 0, 0],
          data: ['收款金额', '支付金额']
        },
        color: ['#a47ace', '#f58a66'],
        grid: {
          left: '10%',
          right: '13%',
          // bottom: '0%',
          // containLabel: true,
          show: true
        },
        dataZoom: [
          {
            type: 'slider',
            xAxisIndex: 0,
            filterMode: 'empty'
          }
        ],
        xAxis: {
          name: '日期',
          type: 'category',
          data: lineData.xaxis,
          splitLine: { show: false }
        },
        yAxis: {
          name: '金额',
          type: 'value',
          splitLine: { show: true }
        },
        series: [
          {
            name: '收款金额',
            type: 'line',
            data: lineData.incomeSeries
          },
          {
            name: '支付金额',
            type: 'line',
            data: lineData.expensesSeries
          }
        ]
      }
      this.chartLine2.setOption(option)
    },
    drawLine3 (lineData) {
      this.chartLine3 = echarts.init(document.getElementById('chartLine3'))
      let option = {
        title: {
          left: 'center',
          text: '提现金额分析',
          textStyle: {
            color: '#333',
            fontSize: 20
          }
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          icon: 'rect',
          itemWidth: 30,
          itemHeight: 5,
          orient: 'vertical',
          x: 'right',
          padding: [100, 20, 0, 0],
          data: ['提现金额']
        },
        color: ['#acd48b'],
        grid: {
          left: '10%',
          right: '13%',
          // bottom: '0%',
          // containLabel: true,
          show: true
        },
        dataZoom: [
          {
            type: 'slider',
            xAxisIndex: 0,
            filterMode: 'empty'
          }
        ],
        xAxis: {
          name: '日期',
          type: 'category',
          data: lineData.xaxis,
          splitLine: { show: false }
        },
        yAxis: {
          name: '金额',
          type: 'value',
          splitLine: { show: true }
        },
        series: [
          {
            name: '提现金额',
            type: 'line',
            data: lineData.withdrawSeries
          }
        ]
      }
      this.chartLine3.setOption(option)
    },
    drawLine4 (lineData) {
      this.chartLine4 = echarts.init(document.getElementById('chartLine4'))
      let option = {
        title: {
          left: 'center',
          text: '流通奖励分析',
          textStyle: {
            color: '#333',
            fontSize: 20
          }
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          icon: 'rect',
          itemWidth: 30,
          itemHeight: 5,
          orient: 'vertical',
          x: 'right',
          padding: [100, 20, 0, 0],
          data: ['流通奖励']
        },
        color: ['#f2b342'],
        grid: {
          left: '10%',
          right: '13%',
          // bottom: '0%',
          // containLabel: true,
          show: true
        },
        dataZoom: [
          {
            type: 'slider',
            xAxisIndex: 0,
            filterMode: 'empty'
          }
        ],
        xAxis: {
          name: '日期',
          type: 'category',
          data: lineData.xaxis,
          splitLine: { show: false }
        },
        yAxis: {
          name: '金额',
          type: 'value',
          splitLine: { show: true }
        },
        series: [
          {
            name: '流通奖励',
            type: 'line',
            data: lineData.currencyRewardSeries
          }
        ]
      }
      this.chartLine4.setOption(option)
    },
    drawLine5 (lineData) {
      this.chartLine5 = echarts.init(document.getElementById('chartLine5'))
      let option = {
        title: {
          left: 'center',
          text: '交易笔数趋势',
          textStyle: {
            color: '#333',
            fontSize: 20
          }
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          icon: 'rect',
          itemWidth: 30,
          itemHeight: 5,
          orient: 'vertical',
          x: 'right',
          padding: [100, 20, 0, 0],
          data: ['充值笔数', '支付笔数', '收款笔数', '提现笔数']
        },
        color: ['#ee8cb2', '#f58b64', '#a47ace', '#a1cc7a'],
        grid: {
          left: '10%',
          right: '13%',
          // bottom: '0%',
          // containLabel: true,
          show: true
        },
        dataZoom: [
          {
            type: 'slider',
            xAxisIndex: 0,
            filterMode: 'empty'
          }
        ],
        xAxis: {
          name: '日期',
          type: 'category',
          data: lineData.xaxis,
          splitLine: { show: false }
        },
        yAxis: {
          name: '金额',
          type: 'value',
          splitLine: { show: true }
        },
        series: [
          {
            name: '充值笔数',
            type: 'line',
            data: lineData.depositSeries
          },
          {
            name: '支付笔数',
            type: 'line',
            data: lineData.paymentSeries
          },
          {
            name: '收款笔数',
            type: 'line',
            data: lineData.receiveSeries
          },
          {
            name: '提现笔数',
            type: 'line',
            data: lineData.withdrawSeries
          }
        ]
      }
      this.chartLine5.setOption(option)
    }
  }
}
</script>

<style scoped lang="less">
@import '~@/assets/less/variables';
.enterprise-transaction {
  .enterpeise-message {
    width: 100%;
    padding: 0 20px;
    height: 204px;
    .title {
      text-align: center;
      font-size: 17px;
      font-weight: 600;
      padding: 33px 0 27px;
      .tag {
        margin-left: 15px;
        width: 49px;
        height: 19px;
        line-height: 19px;
        border: 0;
        color: #fff;
        padding: 0;
        vertical-align: text-bottom;
        background-color: @theme-blue;
        background-color: #25b7aa;
      }
    }
    .tableInfo {
      width: 100%;
      display: table;
    }
    .add-up,
    .nearly-one-month {
      min-width: 508px;
      height: 125px;
      border: 1px solid #e6e6e6;
      display: table-cell;
      text-align: justify;
      vertical-align: middle;
      .data-title {
        width: 100%;
        height: 41px;
        line-height: 41px;
        color: #646464;
        font-size: 15px;
        text-align: center;
        background-color: #f6f6f6;
      }
      .issue-number,
      .pay-number,
      .proceed-number,
      .circulate-number {
        width: calc(~'25% - 2px');
        height: 71px;
        padding-top: 13px;
        font-size: 15px;
        line-height: 32px;
        text-align: center;
        float: left;
        .issue {
          color: @theme-blue;
          color: #97a3df;
          font-weight: 600;
        }
        .pay {
          color: @theme-blue;
          color: #e86b31;
          font-weight: 600;
        }
        .proceed {
          color: @theme-blue;
          color: #a07acd;
          font-weight: 600;
        }
        .circulate {
          color: @theme-blue;
          color: #f4b241;
          font-weight: 600;
        }
      }
      .line {
        margin-top: 13px;
        width: 1px;
        height: 58px;
        background: #e6e6e6;
        float: left;
      }
    }
    .add-up {
      margin-right: 20px;
      .data-title {
        letter-spacing: 5px;
      }
    }
  }
}
#chartLine1,
#chartLine2,
#chartLine3,
#chartLine4,
#chartLine5 {
  width: 90%;
  height: 300px;
  margin: 15px auto;
  position: relative;
}
.issue-and--circulate,
.income-and-expenses,
.withdraw,
.transaction-number,
.rebate {
  width: 100%;
  margin-top: 47px;
  position: relative;
  .chart-radio {
    position: absolute;
    top: -3px;
    right: 5%;
    z-index: 2;
  }
}
.income-and-expenses,
.withdraw,
.transaction-number,
.rebate {
  margin-top: 80px;
}
</style>
