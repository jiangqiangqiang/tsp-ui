<template>
  <div class="agent-transaction">
    <div>
      <BusinessTitle isShowBack title="交易情况分析"></BusinessTitle>
      <div class="enterpeise-message">
        <p class="title">{{this.$route.query.name}} <el-tag class="tag">代理商</el-tag></p>
        <div class="tableInfo">
          <div class="add-up">
          <p class="data-title">累计</p>
          <div class="enterprise-number">
            <div>代理企业数</div>
            <div class="enterprise">{{addUp.agentCount}}</div>
          </div>
          <div class="line"></div>
          <div class="get-earnings">
            <div>获得收益</div>
            <div class="earnings">{{addUp.benefit | toThousands}}</div>
          </div>
        </div>
        <div style="width:20px"></div>
        <div class="nearly-one-month">
          <p class="data-title">近一个月</p>
          <div class="enterprise-number">
            <div>新增代理企业数</div>
            <div class="enterprise">{{addUp.agentMonth}}</div>
          </div>
          <div class="line"></div>
          <div class="get-earnings">
            <div>获得收益</div>
            <div class="earnings">{{addUp.benefitMonth | toThousands}}</div>
          </div>
        </div>
        </div>
      </div>
    </div>
    <div class="new-enterprise-agent">
      <div class="chart-radio">
        <DateRadios @UserDefined="chartLine1Change"></DateRadios>
      </div>
      <div id="chartLine1"></div>
    </div>
    <div class="agent-bonus">
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
      addUp: {},
      // // 后台代理商交易情况分析累计数据
      gatAgentOverviewUrl: settings.apiGateway.gatAgentOverview,
      // 获取代理商的交易情况分析的概览信息
      getAgentTrendUrl: settings.apiGateway.getAgentTrend,
      // 后台代理商奖励分析
      getAgetnRewardUrl: settings.apiGateway.getAgetnReward,
      eid: this.$route.query.id
    }
  },
  created () {
    // this.chartLine1Change()
    // this.chartLine2Change()
    this.gatAgentOverview()
  },
  methods: {
    gatAgentOverview () {
      this.fetch(`${this.gatAgentOverviewUrl}${this.eid}`).then(data => {
        this.addUp = data.data
      }).catch(data => {
        this.$message({
          type: 'error',
          message: data.data.msg
        })
      })
    },
    chartLine1Change (query) {
      this.getAddAgentEnterprise(query)
    },
    chartLine2Change (query) {
      this.getAgentBonus(query)
    },
    getAddAgentEnterprise (query) {
      this.fetch(`${this.getAgentTrendUrl}${this.eid}` + query).then(data => {
        this.drawLine1(data.data)
      }).catch(data => {
        this.$message({
          type: 'error',
          message: data.data.msg
        })
      })
      // var lineData = {
      //   currencySeries: [10, 50, 60, 70, 60, 49, 67],
      //   rebateSeries: [10, 47, 48, 57, 36, 57, 89],
      //   xaxis: ['2019-04-21', '2019-04-22', '2019-04-23', '2019-04-24', '2019-04-25', '2019-04-26', '2019-04-27']
      // }
      // this.drawLine1(lineData)
    },
    getAgentBonus (query) {
      this.fetch(`${this.getAgetnRewardUrl}${this.eid}` + query).then(data => {
        this.drawLine2(data.data)
      }).catch(data => {
        this.$message({
          type: 'error',
          message: data.data.msg
        })
      })
      // var lineData = {
      //   series: [10, 50, 60, 70, 60, 49, 67],
      //   xaxis: ['2019-04-21', '2019-04-22', '2019-04-23', '2019-04-24', '2019-04-25', '2019-04-26', '2019-04-27']
      // }
      // this.drawLine2(lineData)
    },
    drawLine1 (lineData) {
      this.chartLine1 = echarts.init(document.getElementById('chartLine1'))
      let option = {
        title: {
          left: 'center',
          text: '新增代理企业分析',
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
          data: ['企业方']
        },
        color: ['#25b7aa'],
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
            name: '企业方',
            type: 'line',
            data: lineData.enpSeries
          }
        ]
      }
      this.chartLine1.setOption(option)
    },
    drawLine2 (lineData) {
      this.chartLine2 = echarts.init(document.getElementById('chartLine2'))
      var option = {
        title: [{
          left: 'center',
          text: '代理商奖励分析',
          textStyle: {
            color: '#333',
            fontSize: 20
          }
        }],
        tooltip: {
          trigger: 'axis'
        },
        dataZoom: [
          {
            type: 'slider',
            xAxisIndex: 0,
            filterMode: 'empty'
          }],
        grid: {
          // left: '5%',
          // right: '5%',
          // bottom: '0%',
          // containLabel: true,
          show: true
        },
        xAxis: [{
          name: '日期',
          data: lineData.xaxis,
          splitLine: { show: false }
        }],
        yAxis: [{
          name: '金额',
          splitLine: { show: true }
        }],
        series: [{
          type: 'line',
          showSymbol: false,
          itemStyle: {
            normal: {
              color: '#e66b30',
              lineStyle: {
                color: '#e66b30'
              }
            }
          },
          data: lineData.agentRewardSeries
        }]
      }
      this.chartLine2.setOption(option)
    }
  }
}
</script>

<style scoped lang="less">
@import '~@/assets/less/variables';
.agent-transaction {
  .enterpeise-message {
    width: 100%;
    padding: 0 20px;
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
        background-color: #e66b32;
      }
    }
    .tableInfo {
      width: 100%;
      display: table;
    }
    .add-up, .nearly-one-month{
      min-width: 508px;
      height: 125px;
      border: 1px solid #e6e6e6;
      display: table-cell;
      text-align: justify;
      vertical-align: middle;
      .data-title {
        width: 100%;
        height: 41px;
        line-height:41px;
        color: #646464;
        font-size: 15px;
        text-align: center;
        background-color: #f6f6f6
      }
      .enterprise-number, .get-earnings {
        width: calc(~'50% - 2px');
        height: 71px;
        padding-top:13px;
        font-size:15px;
        line-height: 32px;
        text-align: center;
        float: left;
        .enterprise {
          color: @theme-blue;
          color: #3dbbb0;
          font-weight: 600;
        }
        .earnings {
          color: @theme-blue;
          color: #e66b2f;
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
      .data-title {
        letter-spacing: 5px;
      }
    }
  }
}
#chartLine1, #chartLine2 {
  width: 90%;
  height: 300px;
  margin: 15px auto;
  position: relative;
}
.new-enterprise-agent, .agent-bonus {
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
.agent-bonus {
  margin-top: 80px;
}
</style>
