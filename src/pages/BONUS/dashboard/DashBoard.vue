<!-- 由于与分红池仪表盘一致只是接口路径不同故偷懒用了一个组件,只是根据用户替换url -->
<template>
  <div>
    <AdminDashboard></AdminDashboard>
    <div class="part-content">
      <div class="msg-describe">
        <dl class="msg--li">
          <dt class="msg-title">累计分红池收益</dt>
          <dd class="msg-amount" style="font-size: 34px">{{TotalData.bonusBenefitTotal  | toThousands}}</dd>
        </dl>
      </div>
      <div class="chart-drawing">
        <div class="chart-radio">
          <DateRadios @UserDefined="chart3Change"></DateRadios>
        </div>
        <div id="chartLine3" style="width: 100%;height: 300px;margin-top: 15px;"></div>
      </div>
    </div>
    <div class="part-content" style="margin-bottom: 60px">
      <div class="msg-describe" style="padding: 0 100px">
        <!-- <dl class="msg-dl">
          <dt class="msg-title">累计分配返利</dt>
          <dd class="msg-amount">{{TotalData.rebateTotal | toThousands}}</dd>
        </dl> -->
        <dl class="msg-dl">
          <dt class="msg-title">累计分配流通奖励</dt>
          <dd class="msg-amount">{{TotalData.currencyTotal  | toThousands}}</dd>
        </dl>
        <dl class="msg-dl">
          <dt class="msg-title">累计分配代理商奖励</dt>
          <dd class="msg-amount">{{TotalData.agentTotal  | toThousands}}</dd>
        </dl>
        <!-- <dl class="msg-dl">
          <dt class="msg-title">累计分配邀请收益</dt>
          <dd class="msg-amount">{{TotalData.inviteTotal  | toThousands}}</dd>
        </dl> -->
      </div>
      <div class="chart-drawing">
        <div class="chart-radio">
          <DateRadios @UserDefined="chart4Change"></DateRadios>
        </div>
        <div id="chartLine4" style="width: 100%;height: 300px;margin-top: 15px;"></div>
      </div>
    </div>
  </div>
</template>

<script>
import echarts from 'echarts'
import settings from '@/settings'
import AdminDashboard from '@/pages/ADMIN/dashboard/DashBoard'
import DateRadios from '@/components/DateRadios'
export default {
  components: {
    DateRadios,
    AdminDashboard
  },
  data () {
    return {
      chartLine3: {},
      TotalData: {},
      clienteleCountData: {
        // 代理商总数
        agentCount: '',
        // 企业客户总数
        enterpriseCustomerCount: ''
      },
      // 分红池首页获取分红池增加收益
      getBonusAddBenefitUrl: settings.apiGateway.getBonusAddBenefit,
      // 分红池分润趋势
      getBonusProfitUrl: settings.apiGateway.getBonusProfit,
      // 分红出累计数据
      getTotalDataUrl: settings.apiGateway.getTotalData
    }
  },
  mounted () {
    this.$nextTick(() => {
      /* this.drawLine1()
      this.drawLine2()
      this.drawFunnel('chartFunnel1')
      this.drawFunnel('chartFunnel2') */
    })
  },
  created () {
    this.getTotalData()
  },
  methods: {
    getTotalData () {
      this.fetch(this.getTotalDataUrl).then(data => {
        this.TotalData = data.data
      }).catch(data => {
        this.$message({
          type: 'error',
          message: data.data.msg
        })
      })
    },
    chart3Change (query) {
      this.getEarningsData(query)
    },
    chart4Change (query) {
      this.getProfitData(query)
    },
    // 分红池首页获取分红池增加收益
    getEarningsData (query) {
      this.fetch(this.getBonusAddBenefitUrl + query).then(data => {
        this.drawLine3(data.data)
      }).catch(data => {
        this.$message({
          type: 'error',
          message: data.data.msg
        })
      })
    },
    // 分红池分润趋势
    getProfitData (query) {
      this.fetch(this.getBonusProfitUrl + query).then(data => {
        this.drawLine4(data.data)
      }).catch(data => {
        this.$message({
          type: 'error',
          message: data.data.msg
        })
      })
    },
    drawLine3 (lineData) {
      this.chartLine3 = echarts.init(document.getElementById('chartLine3'))
      var option = {
        // Make gradient line here
        title: [{
          left: 'center',
          text: '新增分红池收益趋势',
          textStyle: {
            color: '#333',
            fontSize: 20
          }
        }],
        grid: {
          left: '10%',
          // right: '12%',
          // bottom: '0%',
          // containLabel: true,
          show: true
        },
        tooltip: {
          trigger: 'axis'
        },
        dataZoom: [
          {
            type: 'slider',
            xAxisIndex: 0,
            filterMode: 'empty'
          }],
        xAxis: [{
          name: '日期',
          data: lineData.xaxis,
          splitLine: { show: false }
        }],
        yAxis: [{
          name: '收益数',
          splitLine: { show: true }
        }],
        series: [{
          type: 'line',
          showSymbol: false,
          itemStyle: {
            normal: {
              color: '#938361',
              lineStyle: {
                color: '#938361'
              }
            }
          },
          data: lineData.series
        }]
      }
      this.chartLine3.setOption(option)
    },
    drawLine4 (lineData) {
      this.chartLine4 = echarts.init(document.getElementById('chartLine4'))
      var option = {
        title: {
          left: 'center',
          text: '分红池分润趋势',
          textStyle: {
            color: '#333',
            fontSize: 20
          }
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          orient: 'vertical',
          x: 'right',
          padding: [60, 0, 0, 0],
          data: ['分配流通奖励', '分配代理商奖励']
        },
        color: ['#82e1cb', '#e66b30'],
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
          name: '收益数',
          type: 'value',
          splitLine: { show: true }
        },
        series: [
          {
            name: '分配流通奖励',
            type: 'line',
            data: lineData.currencySeries
          },
          {
            name: '分配代理商奖励',
            type: 'line',
            data: lineData.agentSeries
          }
        ]
      }
      this.chartLine4.setOption(option)
    }
  },
  computed: {
    isIE () {
      return this.$store.state.isIE
    }
  },
  beforeDestroy () {
  }
}
</script>

<style scoped lang="less">
@import '~@/assets/less/variables';
.part-content {
  margin-top: 40px;
  border: 1px solid #e9e9e9;
  .msg-describe {
    width: 100%;
    height: 110px;
    padding: 0 170px;
    border: 1px solid #e9e9e9;
    border-top: 0;
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    background-color: @theme-blue-light;
    background-color: var(--mainLightColor);
    .msg-dl {
      // margin-right: 10px
      height: 100%;
      margin-right: 80px;
      margin-left: 70px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;
    }
    .msg-title{
      height:31px;
      font-size: 18px;
    }
    .msg-amount {
      color: @theme-blue;
      color: var(--mainColor);
      font-size: 28px;
      padding-right: 7px;
    }
  }
  .chart-drawing {
    width: 90%;
    margin: 15px auto;
    position: relative;
    .chart-radio {
      position: absolute;
      top: -3px;
      right: 5%;
      z-index: 2;
    }
  }
}
</style>
