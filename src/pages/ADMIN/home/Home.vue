<template>
  <div class="admin-home-main">
    <div class="topTitle"><span>企业资产</span></div>
    <div class="balance-box">
      <div class="balance-item">
        <svg-icon iconClass='qyrz_zjf' className='balance-icon ml23'></svg-icon>
        <span style="margin: 0 14px 0 10px">账户余额</span>
        <span class="main-color">{{adminAccount.total || 0 | toThousands}}&nbsp;</span>
        <span>元</span>
        <span class="piont-btn" @click="$router.push('/admin/withdraw-list')">提现</span>
        <span class="piont-btn" @click="$router.push('/admin/cash-account')">查看账簿</span>
      </div>
      <div class="balance-item">
        <svg-icon iconClass='qyrz_zjf' className='balance-icon'></svg-icon>
        <span style="margin: 0 14px 0 10px">三方账户余额</span>
        <span class="main-color">{{adminAccount.huifu || 0 | toThousands}}&nbsp;</span>
        <span>元</span>
      </div>
    </div>
    <div class="topTitle"><span>企业数量</span></div>
    <div class="home-header">
      <div class="center-content" @click="$router.push('/admin/service-client-management')">
        <div class="content-title">
          <svg-icon iconClass='ht_sy_zjfzs' className='fund-client-total-icon'></svg-icon>
          <span class="title">服务商总数</span>
        </div>
        <div class="content-amount">
          <div class="units"><span class="number">{{clienteleCountData.serviceCount || 0}}</span>
            <span>家</span>
          </div>
        </div>
      </div>
      <div class="left-content" @click="$router.push('/admin/agent-list')">
        <div class="content-title">
          <svg-icon iconClass='dls_sy_gys' className='agent-total-icon'></svg-icon>
          <span class="title">代理商总数</span>
        </div>
        <div class="content-amount">
          <div class="units"><span class="number">{{clienteleCountData.agentCount || 0}}</span>
            <span>家</span>
          </div>
        </div>
      </div>
      <div class="right-content" @click="$router.push('/admin/enterprise-client-management')">
        <div class="content-title">
          <svg-icon iconClass='ht_sy_qykh_a' className='enterprise-client-total-icon'></svg-icon>
          <span class="title">企业方总数</span>
        </div>
        <div class="content-amount">
          <div class="units"><span class="number">{{clienteleCountData.enterpriseCount || 0}}</span>
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
      adminAccount: {},
      // ie下显示蓝色的图标
      agentTotalIcon: true,
      enterpriseTotalIcon: true,
      IEAgentTotalIcon: false,
      IEEnterpriseTotalIcon: false,
      // 客户数量统计Url
      getClienteleCountUrl: settings.apiGateway.getClienteleCount,
      getAdminAccountUrl: settings.apiGateway.getAdminAccount,
      // 获取电话号码
      getEnterpriseUrl: settings.apiGateway.getEnterprise,
      getAgentMessageUrl: settings.apiGateway.getAgentMessage
    }
  },
  created () {
    this.getClienteleCountData()
    this.getAdminAccount()
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
    getAdminAccount () {
      this.fetch(`${this.getAdminAccountUrl}admin`).then(data => {
        this.adminAccount = data.data
      }).catch(data => {
        this.$message({
          type: 'error',
          message: data.data.msg
        })
      })
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
  .topTitle {
    width: calc(~ '100% - 2px');
    height: 42px;
    background-color: #F7F4F8;
    line-height: 42px;
    border: 1px solid rgba(230, 230, 230, 1);
    font-size: 16px;
    color:rgba(101,101,101,1);
    span {
      margin-left: 23px;
    }
  }
  .balance-box {
    width: calc(~ '100% - 2px');
    height: 67px;
    background: rgba(255,251,244,1);
    margin-bottom: 23px;
    border: 1px solid rgba(230, 230, 230, 1);
    border-top: 0;
    .balance-item {
      display: flex;
      align-items: center;
      float: left;
      width: 50%;
      line-height: 67px;
    }
  }
  .balance-icon {
    width: 23px !important;
    height: 22px !important;
    color: @theme-blue;
    color: var(--mainColor);
    vertical-align: middle;
  }
  .ml23 {
    margin-left: 23px;
  }
  .main-color {
    font-size: 24px;
    font-weight: bold;
    color: @theme-blue;
    color: var(--mainColor);
  }
  .piont-btn {
    text-decoration:underline;
    color:rgba(34,34,34,1);
    opacity:0.7;
    margin-left: 23px;
    cursor: pointer;
  }
  .home-header {
    width: 100%;
    height: 147px;
    color: #4a4b4d;
    .left-content {
      float: left;
      width: calc(~"33.33% - 14px");
      margin-left: 18px;
      height: 100px;
      border: 1px solid #e6e6e6;
      cursor: pointer;
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
    .center-content {
      float: left;
      width: calc(~"33.33% - 14px");
      height: 100px;
      border: 1px solid #e6e6e6;
      cursor: pointer;
      .content-title {
        text-align: center;
        line-height: 41px;
        width: 100%;
        height: 41px;
        background: #FFFBF4;
        vertical-align: middle;
      }
      .number {
        font-size: 34px;
        font-weight: 600;
        color: @theme-blue;
        color: var(--mainColor);
      }
      .fund-client-total-icon {
        display: inline-block;
        width: 33px;
        height: 33px;
        vertical-align: middle;
        // background-image: url('~@/assets/img/fund-amount.png');
      }
      .ie-fund-client-total-icon {
        display: inline-block;
        width: 33px;
        height: 33px;
        vertical-align: middle;
        // background-image: url('~@/assets/img/fund-amount.png');
      }
    }
    .right-content {
      float: left;
      width: calc(~"33.33% - 14px");
      height: 100px;
      border: 1px solid #e6e6e6;
      margin-left: 18px;
      cursor: pointer;
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
