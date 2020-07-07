<!-- 由于与分红池仪表盘一致只是接口路径不同故偷懒用了一个组件,只是根据用户替换url -->
<template>
  <div>
    <div class="home-header">
      <div class="left-content">
        <svg-icon :iconClass="isIE?'ht_sy_dls':'ht_sy_yhs'" className='ie-total-icon'></svg-icon>
        <div class="title">用户总数</div>
        <div class="units"><span class="number">{{clienteleCountData.totalCount}}</span>
        <span style="vertical-align: text-top;">家</span>
        </div>
      </div>
      <div class="left-content">
        <svg-icon iconClass="ht_sy_dls" :className="isIE?'ie-agent-total-icon':'agent-total-icon'"></svg-icon>
        <div class="title">代理商总数</div>
        <div class="units"><span class="number">{{clienteleCountData.agentCount}}</span>
        <span style="vertical-align: text-top;">家</span>
        </div>
      </div>
      <div class="center-content">
        <svg-icon :iconClass="isIE?'ht_sy_zjf':'ht_sy_zjfzs'" className='ie-fund-client-total-icon'></svg-icon>
        <div class="title">资金方总数</div>
        <div class="units"><span class="number">{{clienteleCountData.fundCount}}</span>
        <span style="vertical-align: text-top;">家</span>
        </div>
      </div>
      <div class="right-content">
        <svg-icon iconClass="zjf_sy_ljfl" :className="isIE?'ie-enterprise-client-total-icon':'enterprise-client-total-icon'"></svg-icon>
        <div class="title">企业方总数</div>
        <div class="units"><span class="number">{{clienteleCountData.enterpriseCount}}</span>
        <span style="vertical-align: text-top;">家</span>
        </div>
      </div>
    </div>
    <div class="chart-funnel--main">
      <div id="chartFunnel1">
        <Funnel :funnelData="funnelDto.fundFunnelDto"></Funnel>
      </div>
      <div id="chartFunnel2">
        <Funnel :funnelData="funnelDto.enpFunnelDto" title="企业方用户漏斗" :processColor="processColor"></Funnel>
      </div>
    </div>
    <div class="trans-container">
      <div class="trans-header">
        <div class="header-content">
          <div class="title">总交易数</div>
          <div class="units"><span class="number">{{transCountData.totalCount}}</span>
          <span style="vertical-align: text-top;">笔</span>
          </div>
        </div>
        <div class="header-content">
          <div class="title">总交易成功数</div>
          <div class="units"><span class="number">{{transCountData.succeedCount}}</span>
          <span style="vertical-align: text-top;">笔</span>
          </div>
        </div>
      </div>
      <div class="trans-chart--main">
        <div class="filter-container">
          <DateRadios @UserDefined="chartLine1Change"></DateRadios>
        </div>
        <div id="chartLine1">
        </div>
      </div>
    </div>
    <div class="trans-container">
      <div class="trans-header">
        <div class="header-content">
          <div class="title">总成交额</div>
          <div class="units"><span class="number">{{transVolumeData.totalTradAmount | toThousands}}</span>
          </div>
        </div>
        <div class="header-content">
          <div class="title">平均单笔成交额</div>
          <div class="units"><span class="number">{{transVolumeData.averageAmount | toThousands}}</span>
          </div>
        </div>
      </div>
      <div class="trans-chart--main">
        <div class="filter-container">
          <DateRadios @UserDefined="chartLine2Change"></DateRadios>
        </div>
        <div id="chartLine2"></div>
      </div>
    </div>
  </div>
</template>

<script>
import echarts from 'echarts'
import settings from '@/settings'
import Funnel from './Funnel.vue'
import DateRadios from '@/components/DateRadios'
export default {
  components: {
    Funnel,
    DateRadios
  },
  data () {
    return {
      chartLine1: {},
      chartLine2: {},
      clienteleCountData: {
        // 代理商总数
        agentCount: '',
        // 企业客户总数
        enterpriseCustomerCount: ''
      },
      // 企业方漏斗图表的颜色
      processColor: ['#25b7aa', '#7dd4cc', '#bce9e4'],
      // 客户数量统计Url
      getClienteleCountUrl: settings.apiGateway.getClienteleCount,
      getUserFunnelUrl: settings.apiGateway.getUserFunnel,
      getTransCountUrl: settings.apiGateway.getTransCount,
      getTransDataUrl: settings.apiGateway.getTransData,
      getTranVolumeUrl: settings.apiGateway.getTranVolume,
      getTranTrendUrl: settings.apiGateway.getTranTrend,
      funnelDto: {},
      transCountData: {},
      transVolumeData: {}
    }
  },
  mounted () {},
  created () {
    let role = this.getUserRole()
    // 如果用户是分红池替换一下url
    if (role === 'bonus') {
      this.getClienteleCountUrl = this.setCurrentUri(this.getClienteleCountUrl, role)
      this.getUserFunnelUrl = this.setCurrentUri(this.getUserFunnelUrl, role)
      this.getTransCountUrl = this.setCurrentUri(this.getTransCountUrl, role)
      this.getTransDataUrl = this.setCurrentUri(this.getTransDataUrl, role)
      this.getTranVolumeUrl = this.setCurrentUri(this.getTranVolumeUrl, role)
      this.getTranTrendUrl = this.setCurrentUri(this.getTranTrendUrl, role)
    }
    this.getClienteleCountData()
    this.getTransCountData()
    this.getTransVolumeData()
    this.getUserFunnelData()
  },
  methods: {
    setCurrentUri (url, role) {
      return url.replace('admin', role)
    },
    chartLine1Change (query) {
      this.getTransData(query)
    },
    chartLine2Change (query) {
      this.getTranTrendData(query)
    },
    getClienteleCountData () {
      this.fetch(this.getClienteleCountUrl).then(data => {
        this.clienteleCountData = data.data
      }).catch(data => {
        this.$message({
          type: 'error',
          message: data.data.msg
        })
      })
    },
    getTransCountData () {
      this.fetch(this.getTransCountUrl).then(data => {
        this.transCountData = data.data
      }).catch(data => {
        this.$message({
          type: 'error',
          message: data.data.msg
        })
      })
    },
    getTransVolumeData () {
      this.fetch(this.getTranVolumeUrl).then(data => {
        this.transVolumeData = data.data
      }).catch(data => {
        this.$message({
          type: 'error',
          message: data.data.msg
        })
      })
    },
    getTransData (query) {
      this.fetch(this.getTransDataUrl + query).then(data => {
        this.log(data.data)
        this.drawLine1(data.data)
      }).catch(data => {
        this.$message({
          type: 'error',
          message: data.data.msg
        })
      })
    },
    getTranTrendData (query) {
      this.fetch(this.getTranTrendUrl + query).then(data => {
        this.log(data.data)
        this.drawLine2(data.data)
      }).catch(data => {
        this.$message({
          type: 'error',
          message: data.data.msg
        })
      })
    },
    getUserFunnelData () {
      return new Promise((resolve, reject) => {
        this.fetch(this.getUserFunnelUrl).then(data => {
          this.funnelDto = data.data
          resolve(data.data)
        }).catch(data => {
          this.$message({
            type: 'error',
            message: data.data.msg
          })
        })
      })
    },
    drawLine1 (lineData) {
      this.chartLine1 = echarts.init(document.getElementById('chartLine1'))
      let option = {
        title: [{
          left: 'center',
          text: '新增交易数趋势',
          textStyle: {
            color: '#333',
            fontSize: 20
          }
        }],
        tooltip: {
          trigger: 'axis'
        },
        xAxis: [{
          name: '日期',
          data: lineData.xaxis,
          splitLine: { show: false }
        }],
        yAxis: [{
          name: '交易数',
          splitLine: { show: true }
        }],
        grid: [
          {
            show: true
          }
        ],
        dataZoom: [
          {
            type: 'slider',
            xAxisIndex: 0,
            filterMode: 'empty'
          }
        ],
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
      this.chartLine1.setOption(option)
    },
    drawLine2 (lineData) {
      this.chartLine2 = echarts.init(document.getElementById('chartLine2'))
      let option = {
        title: [{
          left: 'center',
          text: '成交额趋势',
          textStyle: {
            color: '#333',
            fontSize: 20
          }
        }],
        tooltip: {
          trigger: 'axis'
        },
        xAxis: [{
          name: '日期',
          data: lineData.xaxis,
          splitLine: { show: false }
        }],
        yAxis: [{
          name: '成交额',
          splitLine: { show: true }
        }],
        grid: [
          {
            show: true
          }
        ],
        dataZoom: [
          {
            type: 'slider',
            xAxisIndex: 0,
            filterMode: 'empty'
          }
        ],
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
      this.chartLine2.setOption(option)
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
.home-header {
  width: 100%;
  height: 147px;
  padding: 0 100px;
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  background-color: @theme-blue-light;
  background-color: var(--mainLightColor);
  color: #4a4b4d;
  .left-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    .ie-total-icon {
      width: 30px!important;
      height: 30px!important;
      vertical-align: middle;
      color: @theme-blue;
      color: var(--mainColor);
      // background-image: url('~@/assets/img/IE-home-icon1.png');
      margin-bottom: 11px;
    }
    .agent-total-icon {
      width: 30px!important;
      height: 30px!important;
      vertical-align: middle;
      color: #91815F;
      // background-image: url('~@/assets/img/admin-dls.png');
      margin-bottom: 11px;
    }
    .ie-agent-total-icon {
      width: 30px!important;
      height: 30px!important;
      vertical-align: middle;
      color: @theme-blue;
      // background-image: url('~@/assets/img/IE-home-icon1.png');
      margin-bottom: 11px;
    }
  }
  .center-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    .fund-client-total-icon {
      width: 30px!important;
      height: 30px!important;
      vertical-align: middle;
      color: #91815F;
      // background-image: url('~@/assets/img/zijin.png');
      margin-bottom: 11px;
    }
    .ie-fund-client-total-icon {
      width: 30px!important;
      height: 30px!important;
      vertical-align: middle;
      color: @theme-blue;
      // background-image: url('~@/assets/img/iezjf.png');
      margin-bottom: 11px;
    }
  }
    /*
    .title {
      font-size: 18px;
      margin-bottom: 13px;
    }
    .number {
      font-size: 34px;
      color: @theme-blue;
      color: var(--mainColor);
    }
    .units {
      font-size: 23px;
    }
    */
  .right-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    .enterprise-client-total-icon {
      width: 30px!important;
      height: 30px!important;
      vertical-align: middle;
      color: #91815F;
      // background-image: url('~@/assets/img/admin-qykh.png');
      margin-bottom: 11px;
    }
    .ie-enterprise-client-total-icon {
      width: 30px!important;
      height: 30px!important;
      vertical-align: middle;
      color: @theme-blue;
      // background-image: url('~@/assets/img/IE-home-icon2.png');
      margin-bottom: 11px;
    }
  }
  .title {
    font-size: 18px;
    margin-bottom: 13px;
  }
  .number {
    font-size: 34px;
    color: @theme-blue;
    color: var(--mainColor);
    font-weight: 600
  }
  .units {
    font-size: 23px;
  }
}
  .trans-header {
    width: 100%;
    height: 110px;
    padding: 0 100px;
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    background-color: @theme-blue-light;
    background-color: var(--mainLightColor);
    color: #4a4b4d;
    border-bottom: 1px solid #e9e9e9;
    .header-content {
      height: 100%;
      margin-right: 80px;
      margin-left: 70px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: flex-start;
      .title {
        font-size: 18px;
        margin-bottom: 13px;
      }
      .number {
        font-size: 34px;
        color: @theme-blue;
        color: var(--mainColor);
        font-weight: 600
      }
      .units {
        font-size: 23px;
      }
    }
  }
  .chart-funnel--main {
    display: flex;
    justify-content: space-around;
    flex-direction: row;
    margin-top: 30px;
    margin-bottom: 30px;
    #chartFunnel1, #chartFunnel2 {
      width: 450px;
    }
  }
  .trans-container {
    margin-top: 20px;
    border: 1px solid #e9e9e9;
    .trans-chart--main {
      width: 100%;
      position: relative;
      .filter-container {
        position: absolute;
        top: 2px;
        right: 10%;
        z-index: 2;
      }
    }
  }
  #chartLine1, #chartLine2 {
    width: 90%;
    height: 300px;
    margin: 15px auto;
    position: relative;
  }
</style>
