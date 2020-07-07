<!-- 由于与分红池仪表盘一致只是接口路径不同故偷懒用了一个组件,只是根据用户替换url -->
<template>
  <div>
    <div class="home-header">
      <div class="left-content">
        <svg-icon :iconClass="isIE?'ht_sy_dls':'ht_sy_yhs'" className='ie-total-icon'></svg-icon>
        <div class="title">用户总数</div>
        <div class="units"><span class="number">{{clienteleCountData.totalCount || 0}}</span>
        <span style="vertical-align: text-top;">家</span>
        </div>
      </div>
      <div class="center-content">
        <svg-icon :iconClass="isIE?'ht_sy_zjf':'ht_sy_zjfzs'" className='ie-fund-client-total-icon'></svg-icon>
        <div class="title">服务商总数</div>
        <div class="units"><span class="number">{{clienteleCountData.serviceCount || 0}}</span>
        <span style="vertical-align: text-top;">家</span>
        </div>
      </div>
      <div class="left-content">
        <svg-icon iconClass="ht_sy_dls" :className="isIE?'ie-agent-total-icon':'agent-total-icon'"></svg-icon>
        <div class="title">代理商总数</div>
        <div class="units"><span class="number">{{clienteleCountData.agentCount || 0}}</span>
        <span style="vertical-align: text-top;">家</span>
        </div>
      </div>
      <div class="right-content">
        <svg-icon iconClass="zjf_sy_ljfl" :className="isIE?'ie-enterprise-client-total-icon':'enterprise-client-total-icon'"></svg-icon>
        <div class="title">企业方总数</div>
        <div class="units"><span class="number">{{clienteleCountData.enterpriseCount || 0}}</span>
        <span style="vertical-align: text-top;">家</span>
        </div>
      </div>
    </div>
    <div class="chart-funnel--main">
      <div id="chartFunnel1">
        <Funnel :funnelData="funnelDto.serviceFunnelDto" title="服务商用户漏斗"></Funnel>
      </div>
      <div id="chartFunnel2">
        <Funnel :funnelData="funnelDto.agentFunnelDto" title="代理商用户漏斗" :processColor="processColor"></Funnel>
      </div>
      <div id="chartFunnel3">
        <Funnel :funnelData="funnelDto.enpFunnelDto" title="企业方用户漏斗" :processColor="processColor1"></Funnel>
      </div>
    </div>
    <!-- 交易笔数 -->
    <div class="sideTitle">交易笔数统计</div>
    <div class="dotted"></div>
    <div class="cardCount">
      <div class="leftTable">
      <p style="lineHeight:30px">总量</p>
      <div class="topSum">
        <ul>
          <li>
            <p>总交易数 <span style="color:#87734A;fontWeight:bold;fontSize:18px">{{transCountData.total}}</span>笔</p>
          </li>
          <li>
            <p>日均交易数 <span style="color:#87734A;fontWeight:bold;fontSize:18px">{{transCountData.average}}</span>笔</p>
          </li>
        </ul>
      </div>
      <div class="bottomSum">
        <div class="sumItemBox">
          <div class="sumItem">
            <p>充值</p>
            <p><span style="color:#FDB200;fontSize:18px;fontWeight:bold">{{transCountData.tradeTypeCount.deposit}}</span> 笔</p>
            <div class="line"></div>
            <p>日均{{transCountData.tradeTypeAverageCount.deposit}}笔</p>
          </div>
          <div class="sumItem">
            <p>提现</p>
            <p><span style="color:#E46D43;fontSize:18px;fontWeight:bold">{{transCountData.tradeTypeCount.withdraw}}</span> 笔</p>
            <div class="line"></div>
            <p>日均{{transCountData.tradeTypeAverageCount.withdraw}}笔</p>
          </div>
          <div class="sumItem">
            <p>支付</p>
            <p><span style="color:#486CB8;fontSize:18px;fontWeight:bold">{{transCountData.tradeTypeCount.payment}}</span> 笔</p>
            <div class="line"></div>
            <p>日均{{transCountData.tradeTypeAverageCount.payment}}笔</p>
          </div>
          <div class="sumItem">
            <p>收款</p>
            <p><span style="color:#7BBBED;fontSize:18px;fontWeight:bold">{{transCountData.tradeTypeCount.receive}}</span> 笔</p>
            <div class="line"></div>
            <p>日均{{transCountData.tradeTypeAverageCount.receive}}笔</p>
          </div>
          <div class="sumItem">
            <p>出售</p>
            <p><span style="color:#7CE3C5;fontSize:18px;fontWeight:bold">{{transCountData.tradeTypeCount.sell}}</span> 笔</p>
            <div class="line"></div>
            <p>日均{{transCountData.tradeTypeAverageCount.sell}}笔</p>
          </div>
          <div class="sumItem">
            <p>购买</p>
            <p><span style="color:#A984E1;fontSize:18px;fontWeight:bold">{{transCountData.tradeTypeCount.buy}}</span> 笔</p>
            <div class="line"></div>
            <p>日均{{transCountData.tradeTypeAverageCount.buy}}笔</p>
          </div>
        </div>
      </div>
    </div>
    <div class="rightCard">
      <div id="chartLi2"></div>
    </div>
    </div>
    <div class="trans-container">
      <div class="filter-container">
          <p style="lineHeight:40px;marginLeft:19px">日均</p>
          <div class="rightto">
            <DateRadios @UserDefined="chartLine1Change"></DateRadios>
            <el-button class="search-button" type="info" @click="downloadData(downloadCountUrl)">导出</el-button>
          </div>
      </div>
      <div class="dotted" style="marginLeft:19px"></div>
      <div class="trans-chart--main">
        <div id="chartLi1">
        </div>
      </div>
    </div>
    <!-- 交易金额 -->
    <div class="sideTitle">交易金额统计</div>
    <div class="dotted"></div>
    <div class="cardCount">
      <div class="leftTable">
      <p style="lineHeight:30px">总量</p>
      <div class="topSum">
        <ul>
          <li>
            <p>总交易额 <span style="color:#87734A;fontWeight:bold;fontSize:18px">{{transVolumeData.totalAmount | toThousands}}</span>元</p>
          </li>
          <li>
            <p>日均交易额 <span style="color:#87734A;fontWeight:bold;fontSize:18px">{{transVolumeData.averageAmount | toThousands}}</span>元</p>
          </li>
        </ul>
      </div>
      <div class="bottomSum">
        <div class="sumItemBox">
          <div class="sumItem">
            <p>充值（元）</p>
            <p><span style="color:#FDB200;fontWeight:bold" :class="toThousands(transVolumeData.tradeTypeAmount.deposit).length>=11?'fsActive':'fsNormal'">{{transVolumeData.tradeTypeAmount.deposit | toThousands}}</span></p>
            <div class="line"></div>
            <p :class="toThousands(transVolumeData.tradeTypeAverageAmount.deposit).length>=8?'fsActive1':'fsActive'">日均{{transVolumeData.tradeTypeAverageAmount.deposit | toThousands}}</p>
          </div>
          <div class="sumItem">
            <p>提现（元）</p>
            <p><span style="color:#E46D43;fontWeight:bold" :class="toThousands(transVolumeData.tradeTypeAmount.withdraw).length>=11?'fsActive':'fsNormal'">{{transVolumeData.tradeTypeAmount.withdraw | toThousands}}</span></p>
            <div class="line"></div>
            <p :class="toThousands(transVolumeData.tradeTypeAverageAmount.withdraw).length>=8?'fsActive1':'fsActive'">日均{{transVolumeData.tradeTypeAverageAmount.withdraw | toThousands}}</p>
          </div>
          <div class="sumItem">
            <p>支付（元）</p>
            <p><span style="color:#486CB8;fontWeight:bold" :class="toThousands(transVolumeData.tradeTypeAmount.payment).length>=11?'fsActive':'fsNormal'">{{transVolumeData.tradeTypeAmount.payment | toThousands}}</span></p>
            <div class="line"></div>
            <p :class="toThousands(transVolumeData.tradeTypeAverageAmount.payment).length>=8?'fsActive1':'fsActive'">日均{{transVolumeData.tradeTypeAverageAmount.payment | toThousands}}</p>
          </div>
          <div class="sumItem">
            <p>收款（元）</p>
            <p><span style="color:#7BBBED;fontWeight:bold" :class="toThousands(transVolumeData.tradeTypeAmount.receive).length>=11?'fsActive':'fsNormal'">{{transVolumeData.tradeTypeAmount.receive | toThousands}}</span></p>
            <div class="line"></div>
            <p :class="toThousands(transVolumeData.tradeTypeAverageAmount.receive).length>=8?'fsActive1':'fsActive'">日均{{transVolumeData.tradeTypeAverageAmount.receive | toThousands}}</p>
          </div>
          <div class="sumItem">
            <p>出售（元）</p>
            <p><span style="color:#7CE3C5;fontWeight:bold" :class="toThousands(transVolumeData.tradeTypeAmount.sell).length>=11?'fsActive':'fsNormal'">{{transVolumeData.tradeTypeAmount.sell | toThousands}}</span></p>
            <div class="line"></div>
            <p :class="toThousands(transVolumeData.tradeTypeAverageAmount.sell).length>=8?'fsActive1':'fsActive'">日均{{transVolumeData.tradeTypeAverageAmount.sell | toThousands}}</p>
          </div>
          <div class="sumItem">
            <p>购买（元）</p>
            <p><span style="color:#A984E1;fontWeight:bold" :class="toThousands(transVolumeData.tradeTypeAmount.buy).length>=11?'fsActive':'fsNormal'">{{transVolumeData.tradeTypeAmount.buy | toThousands}}</span></p>
            <div class="line"></div>
            <p :class="toThousands(transVolumeData.tradeTypeAverageAmount.buy).length>=8?'fsActive1':'fsActive'">日均{{transVolumeData.tradeTypeAverageAmount.buy | toThousands}}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="rightCard">
      <div id="chartLi3"></div>
    </div>
    </div>
    <div class="trans-container">
      <div class="filter-container">
          <p style="lineHeight:40px;marginLeft:19px">日均</p>
          <div class="rightto">
            <DateRadios @UserDefined="chartLine2Change"></DateRadios>
            <el-button class="search-button" type="info" @click="downloadData(downloadAmountUrl)">导出</el-button>
          </div>
      </div>
      <div class="dotted" style="marginLeft:19px"></div>
      <div class="trans-chart--main">
        <div id="chartLi4">
        </div>
      </div>
    </div>
    <!-- 分红池统计 -->
    <div class="sideTitle">分红池统计</div>
    <div class="dotted"></div>
    <div class="cardCount">
      <div class="leftTable">
      <p style="lineHeight:30px">总量</p>
      <div class="topSum">
        <ul>
          <li>
            <p>累计 <span style="color:#87734A;fontWeight:bold;fontSize:18px">{{transBonusCount.totalAmount | toThousands}}</span>元</p>
          </li>
          <li>
            <p>日均 <span style="color:#87734A;fontWeight:bold;fontSize:18px">{{transBonusCount.averageAmount | toThousands}}</span>元</p>
          </li>
        </ul>
      </div>
      <div class="bottomSum">
        <div class="sumItemBox">
          <div class="sumItem">
            <p>充值服务费（元）</p>
            <p><span style="color:#FDB200;fontWeight:bold" :class="toThousands(transBonusCount.tradeTypeAmount.deposit).length>=13?'fsActive':'fsNormal'">{{transBonusCount.tradeTypeAmount.deposit | toThousands}}</span></p>
            <div class="line"></div>
            <p>日均{{transBonusCount.tradeTypeAverageAmount.deposit | toThousands}}</p>
          </div>
          <div class="sumItem">
            <p>提现服务费（元）</p>
            <p style="color:#E46D43;fontWeight:bold" :class="toThousands(transBonusCount.tradeTypeAmount.buy).withdraw>=13?'fsActive':'fsNormal'">{{transBonusCount.tradeTypeAmount.withdraw | toThousands}}</p>
            <div class="line"></div>
            <p>日均{{transBonusCount.tradeTypeAverageAmount.withdraw | toThousands}}</p>
          </div>
          <div class="sumItem">
            <p>支付服务费（元）</p>
            <p style="color:#486CB8;fontWeight:bold" :class="toThousands(transBonusCount.tradeTypeAmount.payment).length>=13?'fsActive':'fsNormal'">{{transBonusCount.tradeTypeAmount.payment | toThousands}}</p>
            <div class="line"></div>
            <p>日均{{transBonusCount.tradeTypeAverageAmount.payment | toThousands}}</p>
          </div>
          <div class="sumItem">
            <p>出售服务费（元）</p>
            <p style="color:#7CE3C5;fontWeight:bold" :class="toThousands(transBonusCount.tradeTypeAmount.sell).length>=13?'fsActive':'fsNormal'">{{transBonusCount.tradeTypeAmount.sell | toThousands}}</p>
            <div class="line"></div>
            <p>日均{{transBonusCount.tradeTypeAverageAmount.sell | toThousands}}</p>
          </div>
          <div class="sumItem">
            <p>购买服务费（元）</p>
            <p style="color:#A984E1;fontWeight:bold" :class="toThousands(transBonusCount.tradeTypeAmount.buy).length>=13?'fsActive':'fsNormal'">{{transBonusCount.tradeTypeAmount.buy | toThousands}}</p>
            <div class="line"></div>
            <p>日均{{transBonusCount.tradeTypeAverageAmount.buy | toThousands}}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="rightCard">
      <div id="chartLi5"></div>
    </div>
    </div>
    <div class="trans-container">
      <div class="filter-container">
          <p style="lineHeight:40px;marginLeft:19px">日均</p>
          <div class="rightto">
            <DateRadios @UserDefined="chartLine3Change"></DateRadios>
            <el-button class="search-button" type="info" @click="downloadData(downloadBonusUrl)">导出</el-button>
          </div>
      </div>
      <div class="dotted" style="marginLeft:19px"></div>
      <div class="trans-chart--main">
        <div id="chartLi6">
        </div>
      </div>
    </div>
    <!-- 分润统计 -->
    <div class="sideTitle">分润统计</div>
    <div class="dotted"></div>
    <div class="cardCount">
      <div class="leftTable">
      <p style="lineHeight:30px">总量</p>
      <div class="topSum">
        <ul>
          <li style="marginRight:0">
            <p>累计分润 <span style="color:#87734A;fontWeight:bold;fontSize:18px">{{transBenefit.totalTradAmount | toThousands}}</span>元</p>
          </li>
        </ul>
      </div>
      <div class="bottomSum">
        <div class="sumItemBox">
          <div class="sumItem">
            <p>服务商分润（元）</p>
            <p style="color:#FDB200;fontSize:18px;fontWeight:bold">{{transBenefit.platformRewardAmount | toThousands}}</p>
            <div class="line"></div>
            <p>日均{{transBenefit.platformRewardAverage | toThousands}}</p>
          </div>
          <div class="sumItem">
            <p>代理商分润（元）</p>
            <p style="color:#E46D43;fontSize:18px;fontWeight:bold">{{transBenefit.agentRewardAmount | toThousands}}</p>
            <div class="line"></div>
            <p>日均{{transBenefit.agentRewardAverage | toThousands}}</p>
          </div>
          <div class="sumItem">
            <p>垫资方分润（元）</p>
            <p style="color:#486CB8;fontSize:18px;fontWeight:bold">{{transBenefit.rationRewardAmount | toThousands}}</p>
            <div class="line"></div>
            <p>日均{{transBenefit.rationRewardAverage | toThousands}}</p>
          </div>
          <div class="sumItem">
            <p>运营商分润（元）</p>
            <p style="color:#486CB8;fontSize:18px;fontWeight:bold">{{transBenefit.adminRewardAmount | toThousands}}</p>
            <div class="line"></div>
            <p>日均{{transBenefit.adminRewardAverage | toThousands}}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="rightCard">
      <div id="chartLi7"></div>
    </div>
    </div>
    <div class="trans-container">
      <div class="filter-container">
          <p style="lineHeight:40px;marginLeft:19px">日均</p>
          <div class="rightto">
            <DateRadios @UserDefined="chartLine4Change"></DateRadios>
            <el-button class="search-button" type="info" @click="downloadData(downloadBenefitUrl)">导出</el-button>
          </div>
      </div>
      <div class="dotted" style="marginLeft:19px"></div>
      <div class="trans-chart--main">
        <div id="chartLi8">
        </div>
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
      chartLi1: {},
      chartLi2: {},
      chartLi3: {},
      chartLi4: {},
      chartLi5: {},
      chartLi6: {},
      chartLi7: {},
      chartLi8: {},
      chartLine2: {},
      clienteleCountData: {
        // 代理商总数
        agentCount: '',
        // 企业客户总数
        enterpriseCustomerCount: ''
      },
      // 企业方漏斗图表的颜色
      processColor: ['#E66B30', '#F0A683', '#F0A683'],
      processColor1: ['#25b7aa', '#7dd4cc', '#bce9e4'],
      downloadQuery1: '',
      downloadQuery2: '',
      downloadQuery3: '',
      downloadQuery4: '',
      // 客户数量统计Url
      getClienteleCountUrl: settings.apiGateway.getClienteleCount,
      getUserFunnelUrl: settings.apiGateway.getUserFunnel,
      getTransCountUrl: settings.apiGateway.getTrCount,
      getTransDataUrl: settings.apiGateway.getTrData,
      getTranVolumeUrl: settings.apiGateway.getTrVolume,
      getTranTrendUrl: settings.apiGateway.getTrTrend,
      downloadCountUrl: settings.apiGateway.downloadCount,
      downloadAmountUrl: settings.apiGateway.downloadAmount,
      getBenefitVolumUrl: settings.apiGateway.getBenefitVolum,
      downloadBenefitUrl: settings.apiGateway.downloadBenefit,
      getBonusCountUrl: settings.apiGateway.getBonusCount,
      getBonusDataUrl: settings.apiGateway.getBonusData,
      downloadBonusUrl: settings.apiGateway.downloadBonus,
      funnelDto: {},
      transCountData: {
        tradeTypeCount: {
          deposit: '0',
          withdraw: '0',
          payment: '0',
          receive: '0',
          sell: '0',
          buy: '0'
        },
        tradeTypeAverageCount: {}
      },
      transVolumeData: {
        tradeTypeAmount: {
          deposit: '0',
          withdraw: '0',
          payment: '0',
          receive: '0',
          sell: '0',
          buy: '0'
        },
        tradeTypeAverageAmount: {}
      },
      transBenefit: {},
      transBonusCount: {
        tradeTypeAmount: {
          deposit: '0',
          withdraw: '0',
          payment: '0',
          receive: '0',
          sell: '0',
          buy: '0'
        },
        tradeTypeAverageAmount: {}
      }
    }
  },
  mounted () {
    this.getClienteleCountData()
    this.getTransCountData()
    this.getTransVolumeData()
    this.getTranTrendData()
    this.getBonusCount()
    this.getBonusData()
    this.getBenefitVolum()
  },
  created () {
    this.getUserFunnelData()
  },
  methods: {
    downloadData (url) {
      let query = ''
      if (url.indexOf('count') > -1) {
        query = this.downloadQuery1
      } else if (url.indexOf('amount') > -1) {
        query = this.downloadQuery2
      } else if (url.indexOf('bonus') > -1) {
        query = this.downloadQuery3
      } else {
        query = this.downloadQuery4
      }
      this.axios({
        url: `${url}${query}`,
        onDownloadProgress: p => {
          this.precent = Math.floor(100 * (p.loaded / p.total))
        },
        method: 'get',
        responseType: 'blob'
      }).then(data => {
        let filename = decodeURI(data.headers.filename)
        if (navigator.appVersion.toString().indexOf('.NET') > 0) {
          window.navigator.msSaveBlob(data.data, filename)
        } else {
          let url = window.URL.createObjectURL(data.data)
          let link = document.createElement('a')
          link.style.display = 'none'
          link.href = url
          link.setAttribute('download', filename)
          document.body.appendChild(link)
          link.click()
        }
      }).catch(data => {
        this.$message.error('服务器开小差了！')
      })
    },
    setCurrentUri (url, role) {
      return url.replace('admin', role)
    },
    chartLine1Change (query) {
      this.downloadQuery1 = query
      this.getTransData(query)
    },
    chartLine2Change (query) {
      this.downloadQuery2 = query
      this.getTranTrendData(query)
    },
    chartLine3Change (query) {
      this.downloadQuery3 = query
      this.getBonusData(query)
    },
    chartLine4Change (query) {
      this.downloadQuery4 = query
      this.getBenefitVolum(query)
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
        this.drawLi2(this.transCountData)
      }).catch(data => {
        this.$message({
          type: 'error',
          message: data.data.msg
        })
      })
    },
    getBenefitVolum (query) {
      let sendQ = query || ''
      this.fetch(this.getBenefitVolumUrl + sendQ).then(data => {
        this.transBenefit = data.data
        this.drawLi7(this.transBenefit)
        this.drawLi8(this.transBenefit)
      }).catch(data => {
        this.$message({
          type: 'error',
          message: data.data.msg
        })
      })
    },
    getBonusCount () {
      this.fetch(this.getBonusCountUrl).then(data => {
        this.transBonusCount = data.data
        this.drawLi5(this.transBonusCount)
      }).catch(data => {
        this.$message({
          type: 'error',
          message: data.data.msg
        })
      })
    },
    getBonusData (query) {
      let sendQ = query || ''
      this.fetch(this.getBonusDataUrl + sendQ).then(data => {
        this.drawLi6(data.data)
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
        this.drawLi3(this.transVolumeData)
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
        // this.drawLine1(data.data)
        this.drawLi1(data.data)
      }).catch(data => {
        this.$message({
          type: 'error',
          message: data.data.msg
        })
      })
    },
    getTranTrendData (query) {
      let sendQ = query || ''
      this.fetch(this.getTranTrendUrl + sendQ).then(data => {
        this.log(data.data)
        this.drawLi4(data.data)
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
    computeBar (data) {
      let newData = JSON.parse(JSON.stringify(data))
      for (var i = 0; i < newData.xaxis.length; i++) {
        if (newData.adminRewardSeries && newData.adminRewardSeries[i]) {
          newData.adminRewardSeries[i] = {
            value: newData.adminRewardSeries[i],
            label: {},
            itemStyle: {
              barBorderRadius: [5, 5, 0, 0]
            }
          }
        } else if (newData.rationRewardSeries && newData.rationRewardSeries[i]) {
          newData.rationRewardSeries[i] = {
            value: newData.rationRewardSeries[i],
            label: {},
            itemStyle: {
              barBorderRadius: [5, 5, 0, 0]
            }
          }
        } else if (newData.agentRewardSeries && newData.agentRewardSeries[i]) {
          newData.agentRewardSeries[i] = {
            value: newData.agentRewardSeries[i],
            label: {},
            itemStyle: {
              barBorderRadius: [5, 5, 0, 0]
            }
          }
        } else if (newData.platformRewardSeries && newData.platformRewardSeries[i]) {
          newData.platformRewardSeries[i] = {
            value: newData.platformRewardSeries[i],
            label: {},
            itemStyle: {
              barBorderRadius: [5, 5, 0, 0]
            }
          }
        } else if (newData.buySeries && newData.buySeries[i]) {
          newData.buySeries[i] = {
            value: newData.buySeries[i],
            label: {},
            itemStyle: {
              barBorderRadius: [5, 5, 0, 0]
            }
          }
        } else if (newData.sellSeries && newData.sellSeries[i]) {
          newData.sellSeries[i] = {
            value: newData.sellSeries[i],
            label: {},
            itemStyle: {
              barBorderRadius: [5, 5, 0, 0]
            }
          }
        } else if (newData.receiveSeries && newData.receiveSeries[i]) {
          newData.receiveSeries[i] = {
            value: newData.receiveSeries[i],
            label: {},
            itemStyle: {
              barBorderRadius: [5, 5, 0, 0]
            }
          }
        } else if (newData.paymentSeries && newData.paymentSeries[i]) {
          newData.paymentSeries[i] = {
            value: newData.paymentSeries[i],
            label: {},
            itemStyle: {
              barBorderRadius: [5, 5, 0, 0]
            }
          }
        } else if (newData.withdrawSeries && newData.withdrawSeries[i]) {
          newData.withdrawSeries[i] = {
            value: newData.withdrawSeries[i],
            label: {},
            itemStyle: {
              barBorderRadius: [5, 5, 0, 0]
            }
          }
        } else if (newData.depositSeries && newData.depositSeries[i]) {
          newData.depositSeries[i] = {
            value: newData.depositSeries[i],
            label: {},
            itemStyle: {
              barBorderRadius: [5, 5, 0, 0]
            }
          }
        }
      }
      return newData
    },
    drawLi1 (data) {
      data = this.computeBar(data)
      this.chartLi1 = echarts.init(document.getElementById('chartLi1'))
      let option = {
        title: [{
          left: 'center',
          textStyle: {
            color: '#333',
            fontSize: 20
          }
        }],
        legend: {
          orient: 'horizontal',
          bottom: 0,
          data: ['充值', '提现', '支付', '收款', '出售', '购买']
        },
        tooltip: {
          trigger: 'axis'
        },
        color: ['#FDB200', '#E46D43', '#486CB8', '#7BBBED', '#7CE3C5', '#A984E1'],
        xAxis: [{
          name: '日期',
          data: data.xaxis,
          splitLine: { show: false }
        }],
        yAxis: [{
          name: '交易笔数',
          splitLine: { show: true }
        }],
        grid: [
          {
            show: true,
            top: 30,
            bottom: 90
          }
        ],
        dataZoom: [
          {
            type: 'slider',
            xAxisIndex: 0,
            filterMode: 'empty',
            bottom: 30
          }
        ],
        series: [
          {
            type: 'bar',
            name: '充值',
            stack: '交易笔数',
            data: data.depositSeries
          },
          {
            type: 'bar',
            name: '提现',
            stack: '交易笔数',
            data: data.withdrawSeries
          },
          {
            name: '支付',
            type: 'bar',
            stack: '交易笔数',
            data: data.paymentSeries
          },
          {
            name: '收款',
            type: 'bar',
            stack: '交易笔数',
            data: data.receiveSeries
          },
          {
            name: '出售',
            type: 'bar',
            stack: '交易笔数',
            data: data.sellSeries
          },
          {
            name: '购买',
            type: 'bar',
            stack: '交易笔数',
            data: data.buySeries
          }]
      }
      this.chartLi1.setOption(option)
    },
    drawLi2 (data) {
      const _this = this
      this.chartLi2 = echarts.init(document.getElementById('chartLi2'))
      let option = {
        tooltip: {
          trigger: 'item',
          formatter: function (p) {
            return p.name + '：' + _this.toThousands(p.value) + '笔' + '（' + p.percent + '%）'
          }
        },
        legend: {
          orient: 'vertical',
          right: 60,
          top: 'middle',
          data: ['充值', '提现', '支付', '收款', '出售', '购买']
        },
        color: ['#FDB200', '#E46D43', '#486CB8', '#7BBBED', '#7CE3C5', '#A984E1'],
        series: [
          {
            name: '交易笔数',
            type: 'pie',
            radius: '55%',
            center: ['30%', '50%'],
            label: {
              show: false
            },
            data: [
              { value: data.tradeTypeCount.deposit, name: '充值' },
              { value: data.tradeTypeCount.withdraw, name: '提现' },
              { value: data.tradeTypeCount.payment, name: '支付' },
              { value: data.tradeTypeCount.receive, name: '收款' },
              { value: data.tradeTypeCount.sell, name: '出售' },
              { value: data.tradeTypeCount.buy, name: '购买' }
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      }
      this.chartLi2.setOption(option)
    },
    drawLi4 (data) {
      this.chartLi4 = echarts.init(document.getElementById('chartLi4'))
      data = this.computeBar(data)
      let option = {
        title: [{
          left: 'center',
          textStyle: {
            color: '#333',
            fontSize: 20
          }
        }],
        legend: {
          orient: 'horizontal',
          bottom: 0,
          data: ['充值', '提现', '支付', '收款', '出售', '购买', '日均']
        },
        color: ['#FDB200', '#E46D43', '#486CB8', '#7BBBED', '#7CE3C5', '#A984E1'],
        tooltip: {
          trigger: 'axis'
        },
        xAxis: [{
          name: '日期',
          data: data.xaxis,
          splitLine: { show: false }
        }],
        yAxis: [{
          name: '交易金额',
          splitLine: { show: true }
        }],
        grid: [
          {
            show: true,
            top: 30,
            bottom: 90
          }
        ],
        dataZoom: [
          {
            type: 'slider',
            xAxisIndex: 0,
            filterMode: 'empty',
            bottom: 30
          }
        ],
        series: [
          {
            type: 'bar',
            name: '充值',
            stack: '交易金额',
            data: data.depositSeries
          },
          {
            type: 'bar',
            name: '提现',
            stack: '交易金额',
            data: data.withdrawSeries
          },
          {
            name: '支付',
            type: 'bar',
            stack: '交易金额',
            data: data.paymentSeries
          },
          {
            name: '收款',
            type: 'bar',
            stack: '交易金额',
            data: data.receiveSeries
          },
          {
            name: '出售',
            type: 'bar',
            stack: '交易金额',
            data: data.sellSeries
          },
          {
            name: '购买',
            type: 'bar',
            stack: '交易金额',
            data: data.buySeries
          }]
      }
      this.chartLi4.setOption(option)
    },
    drawLi3 (data) {
      const _this = this
      this.chartLi3 = echarts.init(document.getElementById('chartLi3'))
      let option = {
        tooltip: {
          trigger: 'item',
          formatter: function (p) {
            return p.name + '：' + _this.toThousands(p.value) + '元' + '（' + p.percent + '%）'
          }
        },
        legend: {
          orient: 'vertical',
          right: 60,
          top: 'middle',
          data: ['充值', '提现', '支付', '收款', '出售', '购买']
        },
        color: ['#FDB200', '#E46D43', '#486CB8', '#7BBBED', '#7CE3C5', '#A984E1'],
        series: [
          {
            name: '交易金额',
            type: 'pie',
            radius: '55%',
            center: ['30%', '50%'],
            label: {
              show: false
            },
            data: [
              { value: data.tradeTypeAmount.deposit, name: '充值' },
              { value: data.tradeTypeAmount.withdraw, name: '提现' },
              { value: data.tradeTypeAmount.payment, name: '支付' },
              { value: data.tradeTypeAmount.receive, name: '收款' },
              { value: data.tradeTypeAmount.sell, name: '出售' },
              { value: data.tradeTypeAmount.buy, name: '购买' }
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      }
      this.chartLi3.setOption(option)
    },
    drawLi6 (data) {
      this.chartLi6 = echarts.init(document.getElementById('chartLi6'))
      data = this.computeBar(data)
      let option = {
        title: [{
          left: 'center',
          textStyle: {
            color: '#333',
            fontSize: 20
          }
        }],
        legend: {
          orient: 'horizontal',
          bottom: 0,
          data: ['充值服务费', '提现服务费', '支付服务费', '出售服务费', '购买服务费']
        },
        color: ['#FDB200', '#E46D43', '#486CB8', '#7CE3C5', '#A984E1'],
        tooltip: {
          trigger: 'axis'
        },
        xAxis: [{
          name: '日期',
          data: data.xaxis,
          splitLine: { show: false }
        }],
        yAxis: [{
          name: '金额',
          splitLine: { show: true }
        }],
        grid: [
          {
            show: true,
            top: 30,
            bottom: 90
          }
        ],
        dataZoom: [
          {
            type: 'slider',
            xAxisIndex: 0,
            filterMode: 'empty',
            bottom: 30
          }
        ],
        series: [
          {
            type: 'bar',
            name: '充值服务费',
            stack: '分红池统计',
            data: data.depositSeries
          },
          {
            type: 'bar',
            name: '提现服务费',
            stack: '分红池统计',
            data: data.withdrawSeries
          },
          {
            name: '支付服务费',
            type: 'bar',
            stack: '分红池统计',
            data: data.paymentSeries
          },
          {
            name: '出售服务费',
            type: 'bar',
            stack: '分红池统计',
            data: data.sellSeries
          },
          {
            name: '购买服务费',
            type: 'bar',
            stack: '分红池统计',
            data: data.buySeries
          }]
      }
      this.chartLi6.setOption(option)
    },
    drawLi5 (data) {
      const _this = this
      this.chartLi5 = echarts.init(document.getElementById('chartLi5'))
      let option = {
        tooltip: {
          trigger: 'item',
          formatter: function (p) {
            return p.name + '：' + _this.toThousands(p.value) + '元' + '（' + p.percent + '%）'
          }
        },
        legend: {
          orient: 'vertical',
          right: 60,
          top: 'middle',
          data: ['充值服务费', '提现服务费', '支付服务费', '出售服务费', '购买服务费']
        },
        color: ['#FDB200', '#E46D43', '#486CB8', '#7CE3C5', '#A984E1'],
        series: [
          {
            name: '分红池统计',
            type: 'pie',
            radius: '55%',
            center: ['30%', '50%'],
            label: {
              show: false
            },
            data: [
              { value: data.tradeTypeAmount.deposit, name: '充值服务费' },
              { value: data.tradeTypeAmount.withdraw, name: '提现服务费' },
              { value: data.tradeTypeAmount.payment, name: '支付服务费' },
              { value: data.tradeTypeAmount.sell, name: '出售服务费' },
              { value: data.tradeTypeAmount.buy, name: '购买服务费' }
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      }
      this.chartLi5.setOption(option)
    },
    drawLi8 (data) {
      this.chartLi8 = echarts.init(document.getElementById('chartLi8'))
      data = this.computeBar(data)
      let option = {
        title: [{
          left: 'center',
          textStyle: {
            color: '#333',
            fontSize: 20
          }
        }],
        legend: {
          orient: 'horizontal',
          bottom: 0,
          data: ['服务商分润', '代理商分润', '垫资方分润', '运营商分润']
        },
        color: ['#FDB200', '#E46D43', '#486CB8', '#7CE3C5'],
        tooltip: {
          trigger: 'axis'
        },
        xAxis: [{
          name: '日期',
          data: data.xaxis,
          splitLine: { show: false }
        }],
        yAxis: [{
          name: '金额',
          splitLine: { show: true }
        }],
        grid: [
          {
            show: true,
            top: 30,
            bottom: 90
          }
        ],
        dataZoom: [
          {
            type: 'slider',
            xAxisIndex: 0,
            filterMode: 'empty',
            bottom: 30
          }
        ],
        series: [
          {
            type: 'bar',
            name: '服务商分润',
            stack: '交易金额',
            data: data.platformRewardSeries
          },
          {
            type: 'bar',
            name: '代理商分润',
            stack: '交易金额',
            data: data.agentRewardSeries
          },
          {
            name: '垫资方分润',
            type: 'bar',
            stack: '交易金额',
            data: data.rationRewardSeries
          },
          {
            name: '运营商分润',
            type: 'bar',
            stack: '交易金额',
            data: data.adminRewardSeries
          }]
      }
      this.chartLi8.setOption(option)
    },
    drawLi7 (data) {
      const _this = this
      this.chartLi7 = echarts.init(document.getElementById('chartLi7'))
      let option = {
        tooltip: {
          trigger: 'item',
          formatter: function (p) {
            return p.name + '：' + _this.toThousands(p.value) + '元' + '（' + p.percent + '%）'
          }
        },
        legend: {
          orient: 'vertical',
          right: 60,
          top: 'middle',
          data: ['服务商分润', '代理商分润', '垫资方分润', '运营商分润']
        },
        color: ['#FDB200', '#E46D43', '#486CB8', '#7CE3C5'],
        series: [
          {
            name: '分润统计',
            type: 'pie',
            radius: '55%',
            center: ['30%', '50%'],
            label: {
              show: false
            },
            data: [
              { value: data.platformRewardAmount, name: '服务商分润' },
              { value: data.agentRewardAmount, name: '代理商分润' },
              { value: data.rationRewardAmount, name: '垫资方分润' },
              { value: data.adminRewardAmount, name: '运营商分润' }
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      }
      this.chartLi7.setOption(option)
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
  display: table;
  background-color: @theme-blue-light;
  background-color: var(--mainLightColor);
  color: #4a4b4d;
  .left-content {
    display: table-cell;
    text-align: center;
    vertical-align: middle;
    .ie-total-icon {
      width: 30px!important;
      height: 30px!important;
      vertical-align: middle;
      color: @theme-blue;
      color: var(--mainColor);
      margin-bottom: 11px;
    }
    .agent-total-icon {
      width: 30px!important;
      height: 30px!important;
      vertical-align: middle;
      color: #91815F;
      margin-bottom: 11px;
    }
    .ie-agent-total-icon {
      width: 30px!important;
      height: 30px!important;
      vertical-align: middle;
      color: @theme-blue;
      margin-bottom: 11px;
    }
  }
  .center-content {
    display: table-cell;
    text-align: center;
    vertical-align: middle;
    .fund-client-total-icon {
      width: 30px!important;
      height: 30px!important;
      vertical-align: middle;
      color: #91815F;
      margin-bottom: 11px;
    }
    .ie-fund-client-total-icon {
      width: 30px!important;
      height: 30px!important;
      vertical-align: middle;
      color: @theme-blue;
      margin-bottom: 11px;
    }
  }
  .right-content {
    display: table-cell;
    text-align: center;
    vertical-align: middle;
    .enterprise-client-total-icon {
      width: 30px!important;
      height: 30px!important;
      vertical-align: middle;
      color: #91815F;
      margin-bottom: 11px;
    }
    .ie-enterprise-client-total-icon {
      width: 30px!important;
      height: 30px!important;
      vertical-align: middle;
      color: @theme-blue;
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
.line {
  width: 90%;
  margin: 0 auto;
  height: 1px;
  background-color: #EAE8E9;
}
.search-button {
  width: 67px;
  height: 30px;
  padding-top: 8px !important;
  border: 0;
  border-radius: 2px 2px 2px 2px;
  font-size: 13px;
  color: #ffffff;
  margin-left: 10px;
  background: @theme-blue;
  background: var(--mainColor);
}
.sideTitle {
  height: 16px;
  font-size: 16px;
  font-weight: bold;
  color: rgba(101, 101, 101, 1);
  margin: 38px 0 15px 20px;
  padding-left: 9px;
  border-left: 4px solid @theme-blue;
  border-left: 4px solid var(--mainColor);
}
.dotted {
  border-top: 1px solid #d9d9d9;
  width: 100%;
  height: 1px;
}
.cardCount {
  width: 100%;
  min-width: 1120px;
  overflow: hidden;
}
.leftTable {
  width: 57%;
  min-width: 643px;
  height: 252px;
  margin: 33px 0 0 19px;
  float: left;
  .topSum {
    min-width: 641px;
    border: 1px solid #EAE8E9;
    border-bottom: 0;
    height: 45px;
    font-size: 14px;
    background:rgba(255,251,244,1);
    ul {
      width: 100%;
      display: table;
    }
    ul li {
      line-height: 45px;
      display: table-cell;
      text-align: center;
      vertical-align: middle;
      text-align: center;
      &:nth-child(1) {
        margin-right: 70px;
      }
    }
  }
  .bottomSum, .sumItemBox {
    width: 100%;
    height: 109px;
    display: table;
    .sumItem {
      padding: 0 2px;
      display: table-cell;
      height: 107px;
      line-height: 34px;
      border: 1px solid #EAE8E9;
      text-align: center;
      border-right: 0;
      &:last-child {
        border-right: 1px solid #EAE8E9;
      }
      &:nth-child(2n) {
        background-color: #fbfbfb;
      }
      .fsActive {
        font-size: 14px !important;
      }
      .fsActive1 {
        font-size: 12px !important;
      }
      .fsNormal {
        font-size: 18px
      }
    }
  }
}
.rightCard {
  width: 427px;
  height: 285px;
  float: left;
   #chartLi2, #chartLi3, #chartLi5, #chartLi7 {
     width: 100%;
     height: 100%;
     position: relative;
   }
}
  .chart-funnel--main {
    width: 100%;
    display: table;
    margin-top: 30px;
    margin-bottom: 30px;
    #chartFunnel1, #chartFunnel2, #chartFunnel3 {
      width: 340px;
      display: table-cell;
      text-align: center;
      vertical-align: middle;
    }
  }
  .trans-container {
    margin-top: 20px;
    .trans-chart--main {
      width: 100%;
      position: relative;
    }
  }
  .filter-container {
    width: 100%;
    position: relative;
    .rightto {
      width: 400px;
      position: absolute;
      right: 15px;
      top: 5px;
    }
  }
  #chartLine1, #chartLine2, #chartLine3, #chartLi1, #chartLi4, #chartLi6, #chartLi8 {
    width: 90%;
    height: 300px;
    margin: 15px auto;
    position: relative;
  }
</style>
