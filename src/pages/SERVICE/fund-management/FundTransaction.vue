<template>
  <div class="fund-transaction">
    <div>
      <BusinessTitle isShowBack title="交易情况分析"></BusinessTitle>
      <div class="enterpeise-message">
        <p class="title">{{this.$route.query.name}} <el-tag class="tag">资金方</el-tag></p>
        <div class="add-up">
          <p class="data-title">累计</p>
          <div class="issue-number">
            <div>发行金额</div>
            <div class="issue">{{fundAddUp.issueTotal | toThousands}}</div>
          </div>
          <div class="line"></div>
          <div class="circulation-reward">
            <div>流通奖励</div>
            <div class="circulation">{{fundAddUp.currencyRewardTotal | toThousands}}</div>
          </div>
        </div>
        <div class="nearly-one-month">
          <p class="data-title">近一个月</p>
          <div class="issue-number">
            <div>发行金额</div>
            <div class="issue">{{fundAddUp.issueMonth | toThousands}}</div>
          </div>
          <div class="line"></div>
          <div class="circulation-reward">
            <div>流通奖励</div>
            <div class="circulation">{{fundAddUp.currencyRewardMonth | toThousands}}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="issue-analyze">
      <div class="chart-radio">
        <DateRadios @UserDefined="chartLine1Change"></DateRadios>
      </div>
      <div id="chartLine1"></div>
    </div>
    <div class="circulate">
      <div class="chart-radio">
        <DateRadios @UserDefined="chartLine2Change"></DateRadios>
      </div>
      <div id="chartLine2"></div>
    </div>
    <div class="transaction-number">
      <div class="chart-radio">
        <DateRadios @UserDefined="chartLine3Change"></DateRadios>
      </div>
      <div id="chartLine3"></div>
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
      fundAddUp: {},
      eid: this.$route.query.id,
      // 获取资金方的交易情况分析的概览信息
      getFundOverviewUrl: settings.apiGateway.getFundOverview,
      // 资金方发行金额分析
      getFundIssueUrl: settings.apiGateway.getFundIssue,
      // 资金方流通奖励分析
      getFundCurrencyUrl: settings.apiGateway.getFundCurrency,
      // 资金方交易分析
      getFundTradeUrl: settings.apiGateway.getFundTrade
    }
  },
  created () {
    this.getFundOverview()
  },
  methods: {
    getFundOverview () {
      this.fetch(`${this.getFundOverviewUrl}${this.eid}`).then(data => {
        this.fundAddUp = data.data
      }).catch(data => {
        this.$message({
          type: 'error',
          message: data.data.msg
        })
      })
    },
    chartLine1Change (query) {
      this.getIssue(query)
    },
    chartLine2Change (query) {
      this.getCirculate(query)
    },
    chartLine3Change (query) {
      this.getTransactionNumber(query)
    },
    getIssue (query) {
      this.fetch(`${this.getFundIssueUrl}${this.eid}` + query).then(data => {
        this.drawLine1(data.data)
      }).catch(data => {
        this.$message({
          type: 'error',
          message: data.data.msg
        })
      })
    },
    getCirculate (query) {
      this.fetch(`${this.getFundCurrencyUrl}${this.eid}` + query).then(data => {
        this.drawLine2(data.data)
      }).catch(data => {
        this.$message({
          type: 'error',
          message: data.data.msg
        })
      })
    },
    getTransactionNumber (query) {
      this.fetch(`${this.getFundTradeUrl}${this.eid}` + query).then(data => {
        this.drawLine3(data.data)
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
          text: '发行分析',
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
          data: ['发行金额']
        },
        color: ['#7b8dd7'],
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
            name: '发行金额',
            type: 'line',
            data: lineData.series
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
        color: ['#f2b445'],
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
            data: lineData.series
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
          data: ['联合发令笔数', '提现笔数']
        },
        color: ['#ccb2e1', '#bddca3'],
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
          name: '个数',
          type: 'value',
          splitLine: { show: true }
        },
        series: [
          {
            name: '联合发令笔数',
            type: 'line',
            data: lineData.issueSeries
          },
          {
            name: '提现笔数',
            type: 'line',
            data: lineData.withdrawSeries
          }
        ]
      }
      this.chartLine3.setOption(option)
    }
  }
}
</script>

<style scoped lang="less">
@import '~@/assets/less/variables';
.fund-transaction {
  .enterpeise-message {
    width: 100%;
    height: 204px;
    .title {
      text-align: center;
      font-size: 17px;
      font-weight: 600;
      padding: 33px 0 27px;;
      .tag {
        margin-left: 15px;
        width: 49px;
        height: 19px;
        line-height:19px;
        border: 0;
        color: #fff;
        padding: 0;
        vertical-align: text-bottom;
        background-color: @theme-blue;
        background-color: #118eeb;
      }
    }
    .add-up, .nearly-one-month{
      width:550px;
      height: 125px;
      border: 1px solid #e6e6e6;
      .data-title {
        width: 100%;
        height: 41px;
        line-height:41px;
        color: #646464;
        font-size: 15px;
        text-align: center;
        background-color: #f6f6f6
      }
      .issue-number, .circulation-reward {
        width: 270px;
        height: 71px;
        padding-top:13px;
        font-size:15px;
        line-height: 32px;
        text-align: center;
        float: left;
        .issue {
          color: @theme-blue;
          color: #7588d5;
          font-weight: 600;
        }
        .circulation {
          color: @theme-blue;
          color: #f5b957;
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
    .add-up{
      float: left;
      .data-title {
        letter-spacing: 5px;
      }
    }
    .nearly-one-month {
      float: right;
    }
  }
}
#chartLine1, #chartLine2, #chartLine3 {
  width: 90%;
  height: 300px;
  margin: 15px auto;
  position: relative;
}
.issue-analyze, .transaction-number, .circulate {
  width: 100%;
  margin-top:47px;
  position: relative;
  .chart-radio {
      position: absolute;
      top: -3px;
      right: 5%;
      z-index: 2;
    }
}
.transaction-number, .circulate {
  margin-top: 80px;
}
</style>
