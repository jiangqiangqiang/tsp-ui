<template>
  <div class="admin-home-main">
    <div class="cash">
      <div class="mock-clip">
        <div class="cash-name">
          <!-- <svg-icon iconClass="zjf_sy_ljfl" className='cashCount_icon'></svg-icon> -->
          <div class="cashText">资产总额</div>
          <span class="cashCount">{{$store.state.account.total || 0 | toThousands}}</span>
        </div>
        <div class="cash-amount"><span class="freezeText">已冻结：</span><span class="freezeCount">{{$store.state.account.frozenBalance || 0 | toThousands}}</span></div>
      </div>
    </div>
    <div class="home-header">
      <div class="left-content">
        <div class="content-title">
          <svg-icon iconClass='dls_sy_gys' className='agent-total-icon'></svg-icon>
          <span class="title">代理商总数</span>
        </div>
        <div class="content-amount">
          <div class="units"><span class="number">{{clienteleCountData.agentCount}}</span>
            <span>家</span>
          </div>
        </div>
      </div>
      <div class="midWidth"></div>
      <div class="right-content">
        <div class="content-title">
          <svg-icon iconClass='ht_sy_qykh_a' className='enterprise-client-total-icon'></svg-icon>
          <span class="title">企业方总数</span>
        </div>
        <div class="content-amount">
          <div class="units"><span class="number">{{clienteleCountData.enterpriseCount}}</span>
            <span>家</span>
          </div>
        </div>
      </div>
    </div>
    <HomeMessages messageListPath="/admin/message" messageInfoPath="/admin/message-info"></HomeMessages>
    <BroswerPopUp></BroswerPopUp>
  </div>
</template>

<script>
import HomeMessages from '@/components/HomeMessages'
import BroswerPopUp from '@/components/BroswerPopUp'
import BrowserMatch from '@/services/Browser.js'
import settings from '@/settings'
export default {
  components: {
    HomeMessages,
    BroswerPopUp
  },
  data () {
    return {
      Role: '',
      isFirefox: false,
      clienteleCountData: {
        // 代理商总数
        agentCount: '',
        // 企业客户总数
        enterpriseCustomerCount: ''
      },
      // ie下显示蓝色的图标
      agentTotalIcon: true,
      enterpriseTotalIcon: true,
      IEAgentTotalIcon: false,
      IEEnterpriseTotalIcon: false,
      // 客户数量统计Url
      getClienteleCountUrl: settings.apiGateway.getClienteleCount,
      // 获取电话号码
      getEnterpriseUrl: settings.apiGateway.getEnterprise,
      getAgentMessageUrl: settings.apiGateway.getAgentMessage
    }
  },
  created () {
    this.getClienteleCountData()
    this.getAccount()
    this.getAdminMobileInfo()
    try {
      // 获取浏览器信息
      BrowserMatch.init()
      // 判断浏览器类型是否是IE
      if (BrowserMatch.browser === 'firefox' && BrowserMatch.version.split('.')[0] <= 54) {
        this.isFirefox = true
      } else {
        this.isFirefox = false
      }
    } catch (e) {
      this.isFirefox = false
    }
  },
  methods: {
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
    getAdminMobileInfo () {
      // this.fetch(this.getEnterpriseUrl).then(data => {
      //   this.adminMobile = data.data.adminMobile
      //   this.$store.commit('setAdminMobile', this.adminMobile)
      // }).catch(data => {
      //   this.$message({
      //     type: 'error',
      //     message: data.data.msg
      //   })
      // })
    }
  },
  computed: {
    isIE () {
      return this.$store.state.isIE
    }
  }
}
</script>

<style scoped lang="less">
@import '~@/assets/less/variables';
.admin-home-main {
  padding: 0 20px;
  .mock-clip {
    width: 364px;
    margin: 0 auto;
    overflow: hidden;
    height: 119px;
    .cash-name {
      margin-top: 13px;
      text-align: center;
    }
    .cashText,
    .freezeText {
      height: 31px;
      line-height: 31px;
      font-size: 14px;
      color: rgba(34, 34, 34, 1);
    }
    .cashCount {
      font-size: 28px;
      font-weight: bold;
      color: rgba(147, 131, 96, 1);
    }
    .freezeText {
      margin-left: 130px;
    }
    .freezeCount {
      font-size: 18px;
      font-weight: bold;
      color: rgba(120, 120, 120, 1);
    }
  }
  .cashCount_icon {
    width: 23px !important;
    height: 23px !important;
    margin-right: 11px;
    color: @theme-blue;
    color: var(--mainColor);
    vertical-align: middle !important;
  }
  .cash {
    width: 100%;
    width: calc(~'100% - 1px');
    height: 119px;
    border-bottom: 1px solid #e1e1e1;
    border-right: 1px solid #e1e1e1;
    border-left: 1px solid #e1e1e1;
    background-color: @theme-blue-light;
    background-color: var(--mainLightColor);
  }
  .home-header {
    width: 100%;
    display: table;
    margin-top: 30px;
    box-sizing: border-box;
    color: #4a4b4d;
    .left-content {
      width: 360px;
      width: calc(~"50% - 11px");
      height: 100px;
      border: 1px solid #e6e6e6;
      display: table-cell;
      text-align: center;
      vertical-align: middle;
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
        width: 33px !important;
        height: 33px !important;
        vertical-align: middle;
        // background-image: url('~@/assets/img/agent-benefit.png');
      }
      .ie-agent-total-icon {
        display: inline-block;
        width: 33px !important;
        height: 33px !important;
        vertical-align: middle;
        // background-image: url('~@/assets/img/agent-benefit.png');
      }
    }
    .midWidth {
      width: 30px;
      display: table-cell;
      text-align: center;
      vertical-align: middle;
    }
    .right-content {
      width: 373px;
      width: calc(~"50% - 11px");
      height: 100px;
      border: 1px solid #e6e6e6;
      display: table-cell;
      text-align: center;
      vertical-align: middle;
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
        width: 33px;
        height: 33px;
        color: #24b8aa;
        vertical-align: middle;
        // background-image: url('~@/assets/img/enterprise-amount.png');
      }
      .ie-enterprise-client-total-icon {
        display: inline-block;
        width: 33px;
        height: 33px;
        vertical-align: middle;
        // background-image: url('~@/assets/img/enterprise-amount.png');
      }
    }
    .content-amount {
      text-align: center;
      line-height: 59px;
    }
    .title {
      font-size: 18px;
    }
    .units {
      font-size: 23px;
    }
  }
}
</style>
