<template>
  <div style="padding:0 20px">
    <div>
      <div class="enterprise_assets">资产总额</div>
      <div class="cash">
        <div class="cashCount">
          <div class="countTop">
            <div class="leftCountName">
              <div class="textCashIcon">资产总额</div>
            </div>
            <div class="rightCountNum">{{$store.state.account.total || 0 | toThousands}}</div>
          </div>
          <div class="countBottom">
            <div class="cashItem">
              <div class="detailTitle">已冻结：{{$store.state.account.frozenBalance || 0 | toThousands}}</div>
            </div>
            <!-- <div class="cashItem">
              <div class="detailTitle">可提现</div>
              <div class="detailTitleCount">{{$store.state.account.withdraw || 0 | toThousands}}</div>
            </div> -->
          </div>
        </div>
        <!-- <span class="checkList">查看支付令结构</span> -->
      </div>
      <div class="enterprise_assets">数据统计</div>
      <div class="home-header">
        <div class="right-content" style="marginLeft:0">
          <div class="content-title">
            <svg-icon iconClass='ht_sy_qykh_a' className='enterprise-client-total-icon'></svg-icon>
            <span class="title">企业总数</span>
          </div>
          <div class="content-amount">
            <div class="units"><span class="number">{{message.enterpriseCount}}</span>
              <span>家</span>
            </div>
          </div>
        </div>
        <div class="right-content">
          <div class="content-title">
            <svg-icon iconClass='qyf_sy_zf' className='enterprise-client-total-icon'></svg-icon>
            <span class="title">企业累计交易量</span>
          </div>
          <div class="content-amount">
            <div class="units"><span class="number">{{message.transactionCount || 0 | toThousands}}</span>
            </div>
          </div>
        </div>
        <div class="left-content">
          <div class="content-title">
            <svg-icon iconClass='dls_sy_gys' className='agent-total-icon'></svg-icon>
            <span class="title">代理商累计收益</span>
          </div>
          <div class="content-amount">
            <div class="units"><span class="number">{{message.benefitAgentTotal || 0 | toThousands}}</span>
            </div>
          </div>
        </div>
      </div>
      <!-- <div v-if="show">
        <div id="chartLine" class="chart"></div>
        <div class="chart-radio">
          <DateRadios @UserDefined="chartChange"></DateRadios>
        </div>
        <div id="chartLine1" class="chart"></div>
        <div class="chart-radio">
          <DateRadios @UserDefined="chartChange1"></DateRadios>
        </div>
      </div>
      <div class="show-message" @click="handleClick">{{showWord}} <div
          :class="[this.showWord === '收起' ? 'up-triangle': 'down-triangle']"></div>
      </div> -->
    </div>
    <HomeMessages messageListPath="/agent/message" messageInfoPath="/agent/message-info"></HomeMessages>
    <BroswerPopUp></BroswerPopUp>
    <el-dialog :visible.sync="dialogCountAlert" center width="568px">
      <div style="margin-bottom:24px;text-align:center">持有期明细</div>
      <el-table :data="listData" style="width: 100%" border size='mini' header-align='center' class="goldDetail">
        <el-table-column prop="days" label="持有时间（天）" align='center'>
        </el-table-column>
        <el-table-column prop="balance" label="金币" align='center'>
        </el-table-column>
      </el-table>
      <Button class="confirm-btn" @handleClick="dialogCountAlert=false" title="关闭"></Button>
    </el-dialog>
  </div>
</template>

<script>
import echarts from 'echarts'
import HomeMessages from '@/components/HomeMessages'
import BroswerPopUp from '@/components/BroswerPopUp'
import DateRadios from '@/components/DateRadios'
import BrowserMatch from '@/services/Browser.js'
import settings from '@/settings'
import { Getitem } from '@/services/CommonService'
export default {
  components: {
    HomeMessages,
    BroswerPopUp,
    DateRadios
  },
  data () {
    return {
      listData: [],
      Role: '',
      isFirefox: false,
      Account: '',
      message: {},
      // 下拉数据
      dropMessage: {
        agentCount: '',
        inviteEnpTotal: '',
        inviteFundTotal: ''
      },
      dialogCountAlert: false,
      getAgentMessageUrl: settings.apiGateway.getAgentMessage,
      // 代理商首页下拉接口
      getDropMessageUrl: settings.apiGateway.getDropMessage,
      // 代理商首页图表接口
      getChartMessage: settings.apiGateway.getChartMessage,
      getChartGoldUrl: settings.apiGateway.getChartGold,
      // 获取金币结构
      getAccountGoldListUrl: settings.apiGateway.getAccountGoldList,
      // 初始化时提示这只设置支付密码
      // SetPayPasswordUrl: settings.apiGateway.checkIsSetPayPassword,
      chartLine: {},
      chartLine1: {},
      show: false,
      showWord: '展开',
      chartsData: [],
      chartsData1: []
      // setPsdVisible: true,
      // remind: ''
    }
  },
  methods: {
    // 路由跳转
    goUrl (item) {
      this.$router.push(item.path)
    },
    handleClick () {
      this.show = !this.show
      if (this.show === true) {
        this.showWord = '收起'
      } else {
        this.showWord = '展开'
      }
    },
    getAccountMessage () {
      this.fetch(this.getAgentMessageUrl).then(data => {
        this.message = data.data
      }).catch(data => {
        this.$message({
          type: 'error',
          message: data.data.msg
        })
      })
    },
    // 首页下拉信息
    getDropMessage () {
      this.fetch(this.getDropMessageUrl).then(data => {
        // this.dropMessage = data.data
      }).catch(data => {
        this.$message({
          type: 'error',
          message: data.data.msg
        })
      })
    },
    chartChange (query) {
      this.getTransData(query)
    },
    chartChange1 (query) {
      this.getTransData1(query)
    },
    getTransData (query) {
      this.fetch(this.getChartMessage + query).then(data => {
        this.drawLine(data.data)
      }).catch(data => {
        this.$message({
          type: 'error',
          message: data.data.msg
        })
      })
    },
    getTransData1 (query) {
      this.fetch(this.getChartGoldUrl + query).then(data => {
        this.drawLine1(data.data)
      }).catch(data => {
        this.$message({
          type: 'error',
          message: data.data.msg
        })
      })
    },
    drawLine (lineData) {
      this.chartLine = echarts.init(document.getElementById('chartLine'))
      var option = {
        title: [{
          left: 'center',
          text: '新增代理商奖励收益',
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
          name: '收益数',
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
          data: lineData.series
        }]
      }
      this.chartLine.setOption(option)
    },
    drawLine1 (lineData) {
      this.chartLine1 = echarts.init(document.getElementById('chartLine1'))
      var option = {
        title: [{
          left: 'center',
          text: '新增金币奖励收益',
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
          name: '收益数',
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
          data: lineData.series
        }]
      }
      this.chartLine1.setOption(option)
    }
  },
  computed: {
    isIE () {
      return this.$store.state.isIE
    }
  },
  created () {
    this.Role = this.getUserRole()
    this.getAccountMessage()
    this.getAccount()
    this.getDropMessage()
    let userData = Getitem('userData')
    this.isAdmin = JSON.parse(userData).role
    try {
      // 获取浏览器信息
      BrowserMatch.init()
      // 判断浏览器类型是否是IE
      // alert(BrowserMatch.browser)
      // alert(BrowserMatch.version)
      if (BrowserMatch.browser === 'firefox' && BrowserMatch.version.split('.')[0] <= 54) {
        this.isFirefox = true
      } else {
        this.isFirefox = false
      }
    } catch (e) {
      this.isFirefox = false
    }
  },
  mounted () {
    this.$nextTick(() => {
    })
  }
}
</script>

<style scoped lang="less">
@import '~@/assets/less/variables';
.message {
  margin-top: 0!important;
}
.enterprise_assets {
  height: 40px;
  font-size: 16px;
  font-weight: 400;
  color: rgba(101, 101, 101, 1);
  line-height: 40px;
  background-color: #f5f5f5;
  border: 1px solid #e1e1e1;
  padding-left: 23px;
}
.mock-clip {
  width: 300px;
  margin: 0 auto;
  overflow: hidden;
  height: 109px;
}
.sylloge-message {
  width: 100%;
  height: 146px;
  background-color: @theme-blue-light;
  background-color: var(--mainHome);
  .sylloge-box {
    padding-left: 110px;
    .sylloge-dl {
      padding-top: 22px;
      width: 30%;
      height: 124px;
      float: left;
      text-align: center;
      dt {
        margin-bottom: 12px;
      }
      .sylloge-title {
        height: 31px;
        font-size: 18px;
      }
      .sylloge-amount {
        color: @theme-blue;
        color: var(--mainColor);
        font-size: 31px;
        padding-right: 7px;
        font-weight: 600;
      }
      span {
        font-size: 22px;
      }
    }
  }
  .admin,
  .agent,
  .benefit,
  .IEadmin,
  .IEagent,
  .IEbenefit {
    width: 30px !important;
    height: 30px !important;
    vertical-align: middle;
    color: @theme-blue;
    color: var(--mainColor);
    background-repeat: no-repeat;
    //  background-size:cover;
    margin: 0 auto;
  }
}
.checkList {
    position: absolute;
    top: 19px;
    right: 23px;
    font-size: 14px;
    text-decoration: underline;
    color: @theme-blue;
    color: var(--mainColor);
    cursor: pointer;
  }
.goldDetail {
  max-height: 300px;
  overflow: auto;
}
.chart {
  width: 90%;
  height: 300px;
  margin: 0 auto;
  margin-top: 40px;
}
.chart-radio {
  width: 100%;
  height: 40px;
  position: relative;
  bottom: 301px;
  left: 700px;
}
.statistics-message {
  width: 100%;
  height: 220px;
  background-color: @theme-blue-light;
  background-color: var(--mainHome);
  margin-bottom: 20px;
  .statistics-box {
    padding-left: 110px;
    .statistics-dl {
      padding: 22px 0 0 100px;
      width: 21%;
      float: left;
      text-align: left;
      margin-bottom: 26px;
      .statistics-title {
        height: 31px;
        font-size: 18px;
      }
      .statistics-amount {
        color: @theme-blue;
        color: var(--mainColor);
        font-size: 31px;
        padding-right: 7px;
        font-weight: 600;
      }
      span {
        font-size: 22px;
      }
    }
  }
}
.show-message {
  cursor: pointer;
  margin-top: 20px;
  position: relative;
  width: 99%;
  height: 38px;
  border: 1px solid #e1e1e1;
  text-align: center;
  line-height: 38px;
  background: #fcfcfc;
  .up-triangle {
    position: absolute;
    top: 14px;
    left: 581px;
    width: 0;
    height: 0;
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
    border-bottom: 8px solid #656565;
  }
  .down-triangle {
    position: absolute;
    top: 15px;
    left: 589px;
    padding-bottom: 10px;
    width: 0;
    height: 0;
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
    border-top: 8px solid #656565;
  }
}
.hint {
  text-align: center;
  margin: 20px 0;
  font-size: 18px;
  line-height: 30px;
}
.text {
  cursor: pointer;
  text-decoration: underline;
  color: @theme-blue;
  color: var(--mainColor);
}
.noset-pas {
  cursor: pointer;
  text-decoration: underline;
  margin-right: 20px;
  color: @theme-blue;
  color: var(--mainColor);
}
.cash {
  border: 1px solid #e6e6e6;
  border-top: 0;
  background-color: #fffaf7;
  margin-bottom: 22px;
  height: 119px;
  position: relative;
  .cashCount,
  .goldCount {
    height: 100%;
    float: left;
    .countTop {
      width: 100%;
      .leftCountName {
        text-align: center;
        .textCashIcon {
          margin-top: 14px;
          font-size: 20px;
          font-weight: bold;
          color: #656565;
        }
        .checkDetail {
          margin-top: 10px;
          margin-left: 15px;
          font-size: 12px;
          text-decoration: underline;
          color: @theme-blue;
          color: var(--mainColor);
          cursor: pointer;
        }
      }
      .rightCountNum {
        text-align: center;
        font-size: 24px;
        margin: 16px 0;
        font-weight: bold;
        color: @theme-blue;
        color: var(--mainColor);
      }
    }
    .countBottom {
      width: 100%;
      text-align: center;
      .cashItem {
        width: 100%;
        height: 100%;
        float: left;
      }
      .detailTitle {
        font-size: 14px;
        color: #656565;
      }
      .detailTitleCount {
        font-size: 18px;
        font-family: Arial;
        font-weight: bold;
        color: rgba(120, 120, 120, 1);
        margin-top: 10px;
      }
    }
  }
  .cashCount {
    width: calc(~'100% - 2px');
    margin: 0;
  }
}
.confirm-btn {
  margin: 23px 189px 0 189px;
  width: 140px;
  border: none;
}
.home-header {
  width: 100%;
  height: 160px;
  box-sizing: border-box;
  color: #4a4b4d;
  .left-content {
    float: left;
    width: calc(~"33.33% - 14px");
    height: 100px;
    border: 1px solid #e6e6e6;
    margin-left: 18px;
    .content-title {
      text-align: center;
      line-height: 41px;
      width: 100%;
      height: 41px;
      background: @theme-blue;
      background: #fffaf7;
      vertical-align: middle;
    }
    .number {
      font-size: 34px;
      font-weight: 600;
      color: @theme-blue;
      color: #e76a32;
    }
    .agent-total-icon {
      display: inline-block;
      width: 25px !important;
      height: 25px !important;
      vertical-align: middle;
      // background-image: url('~@/assets/img/agent-benefit.png');
    }
    .ie-agent-total-icon {
      display: inline-block;
      width: 25px !important;
      height: 25px !important;
      vertical-align: middle;
      // background-image: url('~@/assets/img/agent-benefit.png');
    }
  }
  .right-content {
    float: left;
    width: calc(~"33.33% - 14px");
    height: 100px;
    border: 1px solid #e6e6e6;
    margin-left: 18px;
    .content-title {
      text-align: center;
      line-height: 41px;
      width: 100%;
      height: 41px;
      background: @theme-blue;
      background: #f6fffe;
      vertical-align: middle;
    }
    .number {
      font-size: 34px;
      font-weight: 600;
      color: @theme-blue;
      color: #24b8aa;
    }
    .enterprise-client-total-icon {
      display: inline-block;
      width: 25px !important;
      height: 25px !important;
      color: #24b8aa;
      vertical-align: middle;
      // background-image: url('~@/assets/img/enterprise-amount.png');
    }
    .ie-enterprise-client-total-icon {
      display: inline-block;
      width: 25px !important;
      height: 25px !important;
      vertical-align: middle;
      // background-image: url('~@/assets/img/enterprise-amount.png');
    }
  }
  .content-amount {
    text-align: center;
    line-height: 59px;
  }
  .title {
    font-size: 14px;
  }
  .units {
    font-size: 23px;
    line-height: 59px;
  }
}
</style>
