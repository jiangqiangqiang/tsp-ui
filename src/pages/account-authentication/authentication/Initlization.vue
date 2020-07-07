<template>
  <div>
    <AuthenticationTitle :stepInfo="stepInfo"></AuthenticationTitle>
    <div class="accountnum-main">
      <p class="iconAlign"><i class="el-icon-time"></i></p>
      <p class="midText">证件资料信息 <span class="mainColor"> 审核中</span></p>
      <p class="remindText">审核结果将在 <span class="warnColor">48小时内</span> 公布，请耐心等待</p>
      <div class="dotted"></div>
      <p class="statusTitle">多重认证</p>
      <ul class="statusText">
        <li class="statusItem">
          <svg-icon iconClass='zclc_grxxsh' className='status_icon'></svg-icon>
          <p>个人信息审核</p>
        </li>
        <li class="statusItem">
          <svg-icon iconClass='zclc_qyxxsh' className='status_icon'></svg-icon>
          <p>企业信息审核</p>
        </li>
        <li class="statusItem">
          <svg-icon iconClass='zclc_carz' className='status_icon'></svg-icon>
          <p>CA认证</p>
        </li>
        <li class="statusItem">
          <svg-icon iconClass='zclc_sfzfkh' className='status_icon'></svg-icon>
          <p>三方支付开户</p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import AuthenticationTitle from './AuthenticationTitle'
import settings from '@/settings'
import { Removeitem } from '@/services/CommonService'
export default {
  data () {
    return {
      stepInfo: {
        list: ['账户注册', '个人实名认证', '企业实名认证', '对公银行账户信息'],
        step: 4
      },
      getAuditStatusUrl: settings.apiGateway.getAuditStatus
    }
  },
  components: {
    AuthenticationTitle
  },
  created () {
    this.getAuditStatus()
  },
  methods: {
    getAuditStatus () {
      const that = this
      this.fetch(this.getAuditStatusUrl).then(data => {
        let registStatus = data.data.status
        if (registStatus !== 2) {
          that.$router.push({
            path: '/authentication/finished',
            query: {
              registStatus: registStatus + ''
            }
          })
        }
      }).catch(data => {
        this.$message({
          type: 'error',
          message: data.data.msg
        })
      })
    }
  },
  beforeRouteLeave (to, from, next) {
    if (to.path === '/login') {
      Removeitem('token')
      Removeitem('userData')
      Removeitem('perfectState')
      Removeitem('topName')
      Removeitem('enterpriseName')
      // 移除本地存储中是否显示浏览器版本的提示
      Removeitem('browserLowTip')
      Removeitem('store')
      next()
    } else {
      next()
    }
  }
}
</script>

<style lang="less" scoped>
@import '~@/assets/less/variables';
.accountnum-main {
  width: 832px;
  margin: 0 auto 100px;
}
.iconAlign {
  color: @theme-blue;
  font-size: 46px;
  text-align: center;
  margin: 33px 0 25px;
}
.midText {
  font-size: 18px;
  color: rgba(75, 75, 75, 1);
  text-align: center;
  margin-bottom: 24px;
}
.mainColor {
  color: @theme-blue;
}
.remindText {
  font-size: 14px;
  color: rgba(162, 162, 162, 1);
  text-align: center;
  margin-bottom: 54px;
}
.warnColor {
  color: #e57171;
  font-weight: bold;
}
.dotted {
  border-top: 1px dotted #000;
  width: 100%;
  height: 1px;
  margin-bottom: 31px;
}
.statusTitle {
  font-size: 18px;
  color: rgba(75, 75, 75, 1);
  text-align: center;
  margin-bottom: 46px;
}
.statusText {
  width: 90%;
  margin: 0 auto;
  height: 85px;
  display: table;
  .statusItem {
    display: table-cell;
    text-align: center;
    vertical-align: middle;
    height: 85px;
    width: 85px;
    margin: 0 35px;
    p {
      font-size: 14px;
      color: rgba(75, 75, 75, 1);
      margin-top: 15px;
      text-align: center;
    }
  }
}
.status_icon {
  width: 55px !important;
  height: 60px !important;
  margin-left: 18px;
  color: #c8c8c8;
}
</style>
