<template>
  <div class="fund-transaction">
    <div>
      <BusinessTitle isShowBack title="交易情况分析"></BusinessTitle>
      <div class="enterpeise-message">
        <p class="title">{{this.$route.query.name}} <el-tag class="tag">服务商</el-tag>
        </p>
        <div class="tableInfo">
          <div class="add-up">
          <p class="data-title">累计</p>
          <div class="issue-number">
            <div>关联代理商数量</div>
            <div class="issue">{{fundAddUp.agentCount || 0}}</div>
          </div>
          <div class="line"></div>
          <div class="circulation-reward">
            <div>获得收益</div>
            <div class="circulation">{{fundAddUp.benefit || 0 | toThousands}}</div>
          </div>
        </div>
        <div style="width:20px"></div>
        <div class="nearly-one-month">
          <p class="data-title">近一个月</p>
          <div class="issue-number">
            <div>新增代理商数量</div>
            <div class="issue">{{fundAddUp.agentMonth || 0}}</div>
          </div>
          <div class="line"></div>
          <div class="circulation-reward">
            <div>获得收益</div>
            <div class="circulation">{{fundAddUp.benefitMonth || 0 | toThousands}}</div>
          </div>
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
      getServiceOverviewUrl: settings.apiGateway.getServiceOverview,
      // 资金方发行金额分析
      getServiceTrendUrl: settings.apiGateway.getServiceTrend,
      // 资金方流通奖励分析
      getServiceRewardTrendUrl: settings.apiGateway.getServiceRewardTrend,
      // 资金方交易分析
      getFundTradeUrl: settings.apiGateway.getFundTrade
    }
  },
  created () {
    this.getServiceOverview()
  },
  methods: {
    getServiceOverview () {
      this.fetch(`${this.getServiceOverviewUrl}${this.eid}`).then(data => {
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
    getIssue (query) {
      this.fetch(`${this.getServiceTrendUrl}${this.eid}` + query).then(data => {
        this.drawLine1(data.data)
      }).catch(data => {
        this.$message({
          type: 'error',
          message: data.data.msg
        })
      })
    },
    getCirculate (query) {
      this.fetch(`${this.getServiceRewardTrendUrl}${this.eid}` + query).then(data => {
        this.drawLine2(data.data)
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
          text: '新增代理商分析',
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
          data: ['代理商']
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
          name: '个数',
          type: 'value',
          splitLine: { show: true }
        },
        series: [
          {
            name: '代理商',
            type: 'line',
            data: lineData.agentSeries
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
          text: '服务商奖励分析',
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
            data: lineData.agentRewardSeries
          }
        ]
      }
      this.chartLine2.setOption(option)
    }
  }
}
</script>

<style scoped lang="less">
@import '~@/assets/less/variables';
.fund-transaction {
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
        background-color: #938360;
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
      .circulation-reward {
        width: calc(~'50% - 2px');
        height: 71px;
        padding-top: 13px;
        font-size: 15px;
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
    .add-up {
      .data-title {
        letter-spacing: 5px;
      }
    }
  }
}
#chartLine1,
#chartLine2,
#chartLine3 {
  width: 90%;
  height: 300px;
  margin: 15px auto;
  position: relative;
}
.issue-analyze,
.transaction-number,
.circulate {
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
.transaction-number,
.circulate {
  margin-top: 80px;
}
</style>
