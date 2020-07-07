<template>
  <div>
    <AuthenticationTitle :stepInfo="stepInfo"></AuthenticationTitle>
    <div class="accountnum-main">
      <p class="iconAlign">
        <i class="el-icon-circle-check-outline" v-if="status"></i>
        <svg-icon iconClass='gg_bc' className='error_icon' v-else></svg-icon>
      </p>
      <p class="midText">{{status?'审核通过':'抱歉，证件资料信息'}} <span style="color:#DB4545" v-if="!status"> 审核失败</span></p>
      <ul class="tipContent" v-if="status">
        <li class="tipItem">
          <svg-icon iconClass='zclc_grxxsh' className='status_icon' v-if="status"></svg-icon>
          <span class="statusText">{{status?'个人信息审核':'个人信息有误'}}</span>
          <span class="statusRemind">{{status?'确保个人信息真实有效，保障账户安全':'到底哪里错了呢？等后台反馈咯'}}</span>
          <div class="dotted"></div>
        </li>
        <li class="tipItem" v-if="$route.query.registStatus">
          <svg-icon iconClass='zclc_qyxxsh' className='status_icon' v-if="status"></svg-icon>
          <span class="statusText">{{status?'企业信息审核':'企业信息有误'}}</span>
          <span class="statusRemind">{{status?'确保企业信息真实有效，保障交易双方权益':'到底哪里错了呢？等后台反馈咯'}}</span>
          <div class="dotted"></div>
        </li>
        <li class="tipItem">
          <svg-icon iconClass='zclc_carz' className='status_icon' v-if="status"></svg-icon>
          <span class="statusText">{{status?'CA认证':'法人信息有误'}}</span>
          <span class="statusRemind">{{status?'为第三方应用提供文件生成、签署、存证服务':'到底哪里错了呢？等后台反馈咯'}}</span>
          <div class="dotted"></div>
        </li>
        <li class="tipItem" v-if="$route.query.registStatus">
          <svg-icon iconClass='zclc_sfzfkh' className='status_icon' v-if="status"></svg-icon>
          <span class="statusText">{{status?'三方支付开户':'对公银行账户信息有误'}}</span>
          <span class="statusRemind">{{status?'为企业用户在三方支付平台开设专属虚拟账户，可用于交易':'到底哪里错了呢？等后台反馈咯'}}</span>
          <div class="dotted"></div>
        </li>
        <li class="finishBtn">
          <el-button type="primary" :class="status?'initialize-finish-button':'initialize-finish-button'"
            @click="login">{{status?'进入系统':'返回并重新认证'}}
          </el-button>
        </li>
      </ul>
      <ul v-else class="tipContent">
        <li class="failedReason" v-if="reason">
          <span class="reasonText">失败原因：</span>
          <span class="mainText">{{reason}}</span>
        </li>
        <li class="finishBtn">
          <el-button type="primary" class="initialize-finish-button" @click="login">{{status?'进入系统':'返回并重新认证'}}
          </el-button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import AuthenticationTitle from './AuthenticationTitle'
import settings from '@/settings'
import { Setitem, Getitem } from '@/services/CommonService'
export default {
  data () {
    return {
      stepInfo: {
        list: ['账户注册', '个人实名认证', '企业实名认证', '对公银行账户信息'],
        step: 4
      },
      smCode: '',
      codeTime: 60,
      time: null,
      codeStatus: true,
      status: true,
      checked: false,
      userRole: '',
      reason: '',
      userData: {},
      contactMobile: '',
      getTokenUrl: settings.apiGateway.getToken,
      // 检查注册状态
      getAuditStatusUrl: settings.apiGateway.getAuditStatus
      // 获取验证码
      // getCaSmsUrl: settings.apiGateway.getCaSms,
      // 获取当前用户信息
      // getCurrentUserUrl: settings.apiGateway.getCurrentUser,
      // 输入验证码签约
      // accountSignUrl: settings.apiGateway.accountSign
    }
  },
  components: {
    AuthenticationTitle
  },
  created () {
    this.getToken()
    this.getAuditStatus()
    // this.getCurrentUser()
    if (this.$route.query.status && this.$route.query.status === 'Succeed') {
      this.status = true
    } else if (this.$route.query.status && this.$route.query.status === 'Rejected') {
      this.status = false
    }
    if (this.$route.query.status) {
      this.stepInfo = {
        list: ['账户注册', '个人实名认证'],
        step: 2
      }
    }
    if (this.$route.query.registStatus === '0') {
      this.status = false
      // Setitem('perfectState', 6)
    } else if (this.$route.query.registStatus === '1') {
      this.status = true
    }
  },
  methods: {
    login () {
      if (this.status) {
        Setitem('perfectState', 4)
        this.$router.replace('/' + this.userRole)
        // this.fetch(`${this.accountSignUrl}${this.smCode}`, 'post').then(data => {
        //   Setitem('perfectState', 4)
        //   this.$router.replace('/' + this.userRole)
        // }).catch(data => {
        //   this.$message.error('验证失败，请重试')
        // })
      } else {
        this.$router.push({
          path: '/authentication/enterprise-certificate/step3',
          query: {
            backStep: 'true',
            failAudit: this.$route.query.status
          }
        })
      }
    },
    // 验证码倒计时
    codeCountDown () {
      this.codeStatus = false
      clearTimeout(this.time)
      this.time = setTimeout(() => {
        this.codeTime--
        if (this.codeTime < 1) {
          this.codeStatus = true
          this.codeTime = 60
          clearTimeout(this.time)
        } else {
          this.codeCountDown()
        }
      }, 1000)
    },
    // 请求验证码接口
    // getCode () {
    //   this.fetch(`${this.getCaSmsUrl}`, 'post').then(data => {
    //     this.$message.success('发送成功,请注意查收!')
    //     this.codeCountDown()
    //   }).catch(data => {
    //     this.$message.error('发送失败，请稍后重试')
    //   })
    // },
    // 获取联系人信息
    // getCurrentUser () {
    //   this.fetch(this.getCurrentUserUrl).then(data => {
    //     this.contactMobile = data.data.phone
    //   }).catch(data => {
    //     this.$message({
    //       type: 'error',
    //       message: data.data.msg
    //     })
    //   })
    // },
    getAuditStatus () {
      this.fetch(this.getAuditStatusUrl).then(data => {
        this.reason = data.data.resultReason || ''
      }).catch(data => {
        this.$message({
          type: 'error',
          message: data.data.msg
        })
      })
    },
    getToken () {
      this.fetch(this.getTokenUrl).then(data => {
        if (!data.data) return
        this.userData = data.data
        Setitem('userData', JSON.stringify(this.userData))
        Setitem('token', data.data.token)
        this.$store.commit('setUserToken', data.data.token)
        Setitem('perfectState', data.data.perfectState)
        if (data.data.systemRole) this.userRole = data.data.systemRole.toLowerCase()
      }).catch(data => {
        this.$message.error(data.data.msg)
      })
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      let userData = JSON.parse(Getitem('userData'))
      if (userData.perfectState === '5') {
        vm.$router.push('/authentication/initialization')
      }
    })
  },
  computed: {
    // loginDis () {
    //   if (this.status) {
    //     if (!this.smCode || !this.checked) {
    //       return true
    //     } else {
    //       return false
    //     }
    //   } else {
    //     return false
    //   }
    // }
  }
}
</script>

<style lang="less" scoped>
@import '~@/assets/less/variables';
.remember {
  color: #7e7e7e;
  cursor: pointer;
}
.readDeal {
  // font-family: SimSun;
  color: @theme-blue;
  text-decoration: underline;
  cursor: pointer;
  margin-left: 5px;
}
.accountnum-main {
  width: 832px;
  margin: 0 auto;
}
.tipItem {
  width: 650px;
  margin: 0 auto;
  line-height: 52px;
}
.failedReason {
  width: 650px;
  margin: 0 auto;
  line-height: 40px;
  color: #4b4b4b;
  text-align: center;
  font-size: 16px;
  .reasonText {
    font-weight: bold;
  }
}
.finishBtn {
  width: 650px;
  margin: 0 auto;
}
.iconAlign {
  color: #78bf3e;
  font-size: 75px;
  text-align: center;
  margin: 33px 0 25px;
}
.midText {
  font-size: 18px;
  color: rgba(75, 75, 75, 1);
  text-align: center;
  margin-bottom: 24px;
}
.dotted {
  border-top: 1px dotted #000;
  width: 100%;
  height: 1px;
}
.status_icon {
  width: 31px;
  height: 34px;
  color: @theme-blue;
  margin-left: 11px;
  vertical-align: middle;
}
.error_icon {
  width: 66px;
  height: 66px;
}
.statusText {
  font-size: 16px;
  color: rgba(75, 75, 75, 1);
  margin-left: 17px;
}
.statusRemind {
  font-size: 13px;
  color: rgba(75, 75, 75, 1);
  opacity: 0.6;
  float: right;
}
.initialize-finish-button {
  width: 403px;
  height: 50px;
  font-size: 18px;
  margin-top: 50px;
  margin-left: 127px;
  margin-bottom: 80px;
  // background-color: @theme-blue;
  border: none;
  box-shadow: 1px 6px 4px @btn-disabled;
}
.toTop {
  margin-top: 0;
}
.codeItem {
  margin-bottom: 30px;
  margin-top: 30px;
}
.dis {
  cursor: not-allowed;
  background-color: rgba(225, 225, 225, 1);
}
.longW {
  margin-left: 23px;
  font-family: Arial;
  font-size: 16px;
  font-weight: bold;
  color: rgba(87, 87, 87, 1);
}
.psd-phone {
  display: inline-block;
  padding-left: 19px;
  height: 43px;
  line-height: 43px;
}
.verification-code {
  width: 119px;
  height: 45px;
  // padding-left: 12px;
  background-color: @theme-blue-light;
  background-color: var(--mainLightColor);
  color: @theme-blue;
  color: var(--mainColor);
  border-radius: 4px;
  border: 1px solid @theme-blue;
  border: 1px solid var(--mainColor);
}
.verification-code:focus {
  border-color: @theme-blue;
  border-color: var(--mainColor);
}
.pay-psd {
  display: inline-block;
  width: 112px;
  text-align: right;
  font-size: 16px;
  // font-family: SimSun;
  color: rgba(87, 87, 87, 1);
}
.pay-psd1 {
  font-size: 16px;
  // font-family: SimSun;
  color: rgba(87, 87, 87, 1);
}
.psd-input {
  padding-left: 10px;
  width: 258px;
  height: 43px;
  border: 1px solid #e1e1e1;
  border-radius: 4px;
  margin: 0 5px 0 15px;
  background: #fcfcfc;
}
.widthPwd {
  width: 364px;
}
</style>
