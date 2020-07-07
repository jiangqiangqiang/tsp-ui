<template>
  <div>
    <div class="title">
      <div :class="[isFirefox ? 'circleF' : 'circle']">
        <div class="cash-name">支付令</div>
        <div class="cash-amount">0.00</div>
      </div>
    </div>
    <div class="business-entrance">
      <ul class="menu">
        <li v-for="(item,index) in menuList" :key="index">
          <div :class="item.className">
            <!-- <span class="icon"></span> -->
            <svg-icon :iconClass='item.classNameI' className='icon'></svg-icon>
            <p class="text">{{item.name}}</p>
          </div>
        </li>
      </ul>
    </div>
    <!-- <HomeMessages messageInfoPath="/enterprise/message-info" messageListPath="/enterprise/message"></HomeMessages> -->
    <!-- <BroswerPopUp></BroswerPopUp> -->
    <NOAuthentication :showDialog="showDialog" @ToAttestation="ToAttestation"></NOAuthentication>
  </div>
</template>

<script>
import HomeMessages from '@/components/HomeMessages'
import BroswerPopUp from '@/components/BroswerPopUp'
import BrowserMatch from '@/services/Browser.js'
import NOAuthentication from '@/components/NOAuthentication'
import settings from '@/settings'
import { Getitem } from '@/services/CommonService'
export default {
  components: {
    HomeMessages,
    BroswerPopUp,
    NOAuthentication
  },
  data () {
    return {
      Role: '',
      isFirefox: false,
      showDialog: true,
      // 获取电话号码
      getEnterpriseUrl: settings.apiGateway.getEnterprise,
      // 个人初始化时判断操作员是否已加入公司
      getApplyInfoUrl: settings.apiGateway.getApplyInfo,
      remind: '',
      // 按钮列表
      menuList: [
        {
          name: '充值',
          className: 'top-up',
          classNameY: 'Ytop-up',
          classNameI: 'qyf_sy_cz',
          path: ''
        },
        {
          name: '联合发令',
          className: 'join-token',
          classNameY: 'Yjoin-token',
          classNameI: 'qyf_sy_lhfl',
          path: ''
        },
        {
          name: '支付',
          className: 'pay',
          classNameY: 'Ypay',
          classNameI: 'qyf_sy_zf',
          path: ''
        },
        {
          name: '收款',
          className: 'gathering',
          classNameY: 'Ygathering',
          classNameI: 'qyf_sy_sk',
          path: ''
        },
        {
          name: '提现',
          className: 'withdraw-cash',
          classNameY: 'Ywithdraw-cash',
          classNameI: 'qyf_sy_tx',
          path: ''
        }
      ]
    }
  },
  methods: {
    ToAttestation () {
      let userData = Getitem('userData')
      this.perfectState = JSON.parse(userData).perfectState
      if (this.perfectState === '1') {
        // 用户个人信息
        this.$router.push('/authentication/personal-certificate')
      } else if (this.perfectState === '2') {
        // 创建或加入企业
        this.$router.push('/authentication/enterprise-certificate/step3')
      } else if (this.perfectState === '3') {
        // 银行信息
        this.$router.push({
          path: '/authentication/enterprise-certificate/step5',
          query: {
            enterpriseName: JSON.parse(userData).enpName
          }
        })
      } else if (this.perfectState === '5' || this.perfectState === '6') {
        // 等待认证
        this.$router.push('/authentication/initialization')
      }
      // if (this.perfectState === '1') {
      //   this.$router.push('/authentication/personal-certificate')
      // } else if (this.perfectState === '2') {
      //   this.fetch(this.getApplyInfoUrl).then(data => {
      //     let enterpeiseMessage = data.data
      //     if (enterpeiseMessage) {
      //       this.$router.push('/authentication/enterprise-certificate/step2')
      //     }
      //   }).catch(data => {
      //     this.$router.push('/authentication/enterprise-certificate/')
      //   })
      // } else if (this.perfectState === '3') {
      //   this.$router.push('/authentication/initialization')
      // }
    }
  },
  computed: {
    isIE () {
      return this.$store.state.isIE
    }
  },
  created () {
    // this.SetPayPassword()
    this.Role = this.getUserRole()
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
    // 获取账户余额的操作放到SysIndex.vue中获取放到store中
  }
}
</script>

<style scoped lang="less">
@import '~@/assets/less/variables';
.title {
  width: 100%;
  height: 128px;
  background-color: #f2f9ff;
  text-align: center;
  padding-top: 20px;
}
.circle {
  width: 300px;
  height: 150px;
  border: 1px solid #118eea;
  border-radius: 150px 150px 0 0;
  border-bottom: none;
  margin: 0 auto;
  clip-path: inset(0 0 42px 0);
  .cash-name {
    font-size: 22px;
    margin-top: 31px;
    color: #333;
  }
  .cash-amount {
    color: @theme-blue;
    margin-top: 14px;
    font-size: 24px;
  }
}
.circleF {
  width: 230px;
  height: 115px;
  border: 1px solid #118eea;
  border-radius: 115px 115px 0 0;
  border-bottom: none;
  margin: 0 auto;
  // clip-path: inset(0 0 42px 0);
  .cash-name {
    font-size: 22px;
    margin-top: 35px;
    color: #333;
  }
  .cash-amount {
    color: @theme-blue;
    margin-top: 25px;
    font-size: 24px;
  }
}
.business-entrance {
  width: 100%;
  height: 190px;
  .menu {
    width: 79%;
    margin: 0 auto;
    clear: both;
    overflow: hidden;
    li {
      width: 20%;
      padding: 52px 0;
      float: left;
    }
  }
  .menuY {
    width: 80%;
    margin: 0 auto;
    clear: both;
    overflow: hidden;
    li {
      width: 20%;
      padding: 52px 0;
      float: left;
    }
  }
  .top-up,
  .join-token,
  .pay,
  .gathering,
  .withdraw-cash,
  .Ypay,
  .Yjoin-token,
  .Ytop-up,
  .Ygathering,
  .Ywithdraw-cash {
    width: 123px;
    height: 107px;
    margin: 0 auto;
    text-align: center;
    border-radius: 6px;
    border: 1px solid @theme-blue;
    cursor: pointer;
    .icon {
      display: inline-block;
      width: 40px !important;
      height: 40px !important;
      color: @theme-blue;
      // color: var(--mainColor);
      vertical-align: middle;
      margin: 14px 0;
      background-repeat: no-repeat;
    }
    .text {
      color: @theme-blue;
      font-size: 16px;
    }
  }
}
.dialog-footer {
  .confirm-btn {
    width: 140px;
    border: none;
  }
}
</style>
<style lang="less">
</style>
