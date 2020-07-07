<template>
  <div style="width:100%;height:100%">
    <el-header style="height:80px;background:#fcfcfc;border-bottom: 1px solid #f1f1f3">
      <div style="width: 1340px;margin:0 auto;">
        <div class="logo">
          <svg-icon iconClass='zjf_logo' className='fund-logo'></svg-icon>
          <span class="registerTitle">用户注册</span>
        </div>
        <div style="float:right" class="logout">
          <span>已有账户，</span>
          <span class="toLogin" @click="toLogin">请登录</span>
        </div>
      </div>
    </el-header>
    <AuthenticationTitle :stepInfo="stepInfo"></AuthenticationTitle>
    <div class="register-main">
      <el-form label-width="95px" auto-complete='off'>
        <el-form-item label="手机号">
          <el-input v-model="userInfo.userName" @blur="checkUserExist" @focus="focusUserName" placeholder="请输入手机号码"
            auto-complete="username">
          </el-input>
          <el-input tabindex="-1" style="position:fixed;bottom:-9999px"></el-input>
          <div v-if="errorWarning.userNameError" class="error-warning">
            <i class="el-icon-warning error-icon-warning"></i>
            <span class="show-error">{{userNameMsg}}</span>
          </div>
        </el-form-item>
        <el-form-item label="登录密码">
          <el-input type="password" v-model="userInfo.password" @blur="checkPassword" placeholder="请输入密码"
            auto-complete="new-password" maxlength="20">
          </el-input>
          <div v-if="errorWarning.passwordError" class="error-warning">
            <i class="el-icon-warning error-icon-warning"></i>
            <span class="show-error">{{passwordText}}</span>
          </div>
          <div v-else class="remind-warning">
            <span class="show-remind">密码由6～20位数字、大小写字母和标点符号组成</span>
          </div>
        </el-form-item>
        <el-form-item label="重复密码">
          <el-input type="password" v-model="userInfo.confirmPassword" @blur="checkRePwd" placeholder="请输入密码"
            auto-complete="new-password" maxlength="20">
          </el-input>
          <div v-if="errorWarning.confirmPasswordError" class="error-warning">
            <i class="el-icon-warning error-icon-warning"></i>
            <span class="show-error">两次密码不一致</span>
          </div>
        </el-form-item>
        <el-form-item label="图形验证码">
          <el-input type="phone" class="code-input" v-model="userInfo.imgCode" placeholder="请输入验证码" @blur="imgCodeBlur">
          </el-input>
          <img class="verification-code" :src="imgSrc" alt="图形验证码" style="cursor: pointer" @click="getImgCode">
          <div v-if="errorWarning.imgCodeError" class="error-warning">
            <i class="el-icon-warning error-icon-warning"></i>
            <span class="show-error">验证码有误</span>
          </div>
        </el-form-item>
        <el-form-item class="code-form" label="短信验证码">
          <el-input class="code-input" v-model="userInfo.code" placeholder="请输入短信验证码"></el-input>
          <input type="text" style="width:0;height:0;">
          <el-button class="verification-code" :disabled="!codeStatus || phoneExist" @click="getCode">
            {{codeStatus? '获取验证码' : `${codeTime}秒后获取`}}</el-button>
          <div v-if="errorWarning.smsCodeError" class="error-warning">
            <i class="el-icon-warning error-icon-warning"></i>
            <span class="show-error">{{smsCodeText}}</span>
          </div>
        </el-form-item>
        <el-form-item>
          <div style="line-height:25px">
            <span>
              <el-checkbox class="remember" v-model="checked">同意并接受</el-checkbox>
              <span class="readDeal">《好快通宝用户注册协议》</span>
            </span>
          </div>
        </el-form-item>
        <Button :disabled="loginActive" class="login-button" @handleClick="handleRegister" title="注册"></Button>
      </el-form>
      <div class="no-regist">
        <!-- <span>已经加入?</span>
        <span class="to-regist" @click="handleLogin">立即登录</span> -->
      </div>
    </div>
    <div style="height:42px;width:100%"></div>
    <Footer style="position:fixed;bottom:0;left:0"></Footer>
  </div>
</template>

<script>
import settings from '@/settings'
import { Setitem } from '../../services/CommonService'
import Footer from '@/components/Footer'
import AuthenticationTitle from '../../pages/account-authentication/authentication/AuthenticationTitle'
export default {
  name: 'login',
  components: {
    AuthenticationTitle,
    Footer
  },
  data () {
    return {
      // 步骤
      stepInfo: {
        list: ['账户注册', '个人实名认证', '企业实名认证', '对公银行账户信息'],
        step: 1
      },
      // 用户信息
      userInfo: {
        userName: '',
        password: '',
        confirmPassword: '',
        code: '',
        imgCode: '',
        inviteCode: '',
        csrfCode: ''
      },
      imgSrc: '',
      // 错误提示
      errorWarning: {
        userNameError: false,
        passwordError: false,
        smsCodeError: false,
        imgCodeError: false,
        confirmPasswordError: false
      },
      smsCodeText: '验证码有误',
      // 登录后 返回的用户数据
      userData: {
        token: '',
        role: '',
        perfectState: '',
        adminName: ''
      },
      // 验证码状态
      codeStatus: true,
      // 手机号是否已存在
      phoneExist: true,
      userNameMsg: '手机号输入错误',
      passwordText: '',
      // 验证码获取间隔
      codeTime: 60,
      // 记住我
      checked: false,
      // 注册 Url
      registerUrl: settings.apiGateway.registerUrl,
      // 检查手机号是否存在
      verifyPhoneNumberUrl: settings.apiGateway.verifyPhoneNumber,
      // 验证图形验证码
      checkMsgUrl: settings.apiGateway.getCaSms,
      // 图片验证码 Url
      getCsrfCodeUrl: settings.apiGateway.getCsrfCode,
      getImgCodeUrl: settings.apiGateway.getImgCode,
      // 个人初始化时判断操作员是否已加入公司
      getApplyInfoUrl: settings.apiGateway.getApplyInfo,
      // 检查邀请码是否有效
      checkInviteUrl: settings.apiGateway.checkInvite,
      loading: false
    }
  },
  created () {
    this.getImgCode()
    this.checkUrl()
    if (this.$route.query.data.indexOf('Join') > 0) {
      this.stepInfo = {
        list: ['账户注册', '个人实名认证'],
        step: 1
      }
    }
  },
  beforeRouteEnter (to, from, next) {
    next((vm) => {
      vm.getImgCode()
    })
  },
  methods: {
    imgCodeBlur () {
      if (this.userInfo.imgCode) {
        this.errorWarning.smsCodeError = false
      }
    },
    // 请求验证码标识
    getImgCode () {
      this.fetch(this.getCsrfCodeUrl).then(data => {
        this.imgSrc = `${settings.domain.domain}${this.getImgCodeUrl}/${data.data.csrfCode}`
        this.userInfo.csrfCode = data.data.csrfCode
      }).catch(data => {
        this.$message.error('验证码获取失败')
      })
    },
    // 检查注册链接是否有效
    checkUrl () {
      this.fetch(`${this.checkInviteUrl}/${this.$route.query.sign}/${this.$route.query.data}`).then(data => {
        if (!data.data) {
          this.$router.push({
            path: '/out-of-work',
            query: {
              type: 'outInvite'
            }
          })
        }
      }).catch(data => {
        this.$message.error(data.data.msg)
      })
    },
    // 注册
    handleRegister () {
      if (this.userInfo.password !== this.userInfo.confirmPassword) {
        this.$message({
          type: 'error',
          message: '两次密码不一致'
        })
        return
      }
      // 获取链接
      let invite = this.$route.query.invite
      if (invite) {
        this.userInfo.inviteCode = invite
      }
      this.userInfo.sign = this.$route.query.sign
      this.userInfo.data = this.$route.query.data
      let data = JSON.parse(JSON.stringify(this.userInfo))
      delete data.csrfCode
      delete data.imgCode
      this.loading = true
      data.url = window.location.href
      this.fetch(this.registerUrl, 'post', data).then(data => {
        this.loading = false
        // 登录时 存储用户信息
        Setitem('userData', JSON.stringify(data.data))
        Setitem('token', data.data.token)
        if (data.data.perfectState === '1') {
          this.$router.push({
            path: '/authentication/personal-certificate',
            query: {
              sign: this.$route.query.sign,
              data: this.$route.query.data
            }
          })
        } else if (data.data.perfectState === '2') {
          this.fetch(this.getApplyInfoUrl).then(data => {
            let enterpeiseMessage = data.data
            if (enterpeiseMessage) {
              this.$router.push('/authentication/enterprise-certificate/step2')
            }
          }).catch(data => {
            this.$router.push('/authentication/enterprise-certificate/')
          })
        } else if (data.data.perfectState === '3') {
          this.$router.push('/authentication/initialization')
        }
        // this.$router.push('/authentication')
      }).catch(data => {
        // this.getImgCode()
        if (data.data.code === 2002) {
          this.errorWarning.imgCodeError = true
          setTimeout(() => {
            this.errorWarning.imgCodeError = false
          }, 2000)
        } else if (data.data.code === 2058) {
          this.$router.push({
            path: '/out-of-work',
            query: {
              type: 'outInvite'
            }
          })
        }
        this.loading = false
        this.$message.error(data.data.msg)
      })
    },
    // 跳转到忘记密码页
    goRouter (url) {
      this.$router.push(url)
    },
    toLogin () {
      this.$router.push({
        path: '/login',
        query: this.$route.query
      })
    },
    checkImgCode () {
      let data = {
        csrfCode: this.userInfo.csrfCode,
        mobile: this.userInfo.userName,
        imgCode: this.userInfo.imgCode
      }
      this.fetch(`${this.checkMsgUrl}`, 'post', data).then(data => {
        this.codeCountDown()
        this.$message({
          type: 'success',
          message: '发送成功，请注意查收！'
        })
      }).catch(data => {
        this.getImgCode()
        this.$message.error(data.data.msg)
      })
    },
    getCode () {
      if (!(/^1[345678]\d{9}$/.test(this.userInfo.userName))) {
        this.$message.error('手机号输入错误')
      } else if (!this.userInfo.imgCode) {
        this.errorWarning.smsCodeError = true
        this.smsCodeText = '请输入图形验证码进行校验'
      } else if (this.userInfo.imgCode) {
        this.checkImgCode()
      }
    },
    // 验证码倒计时
    codeCountDown () {
      this.codeStatus = false
      let time = setTimeout(() => {
        this.codeTime--
        if (this.codeTime < 1) {
          this.codeStatus = true
          this.codeTime = 60
          clearTimeout(time)
        } else {
          this.codeCountDown()
        }
      }, 1000)
    },
    checkUserExist () {
      if (!this.userInfo.userName) {
        this.errorWarning.userNameError = true
        this.userNameMsg = '手机号不能为空'
        return true
      }
      this.phoneExist = true
      if (!(/^1[3456789]\d{9}$/.test(this.userInfo.userName))) {
        this.userNameMsg = '手机号输入错误'
        this.errorWarning.userNameError = true
        return
      }
      this.fetch(`${this.verifyPhoneNumberUrl}${this.userInfo.userName}`).then(data => {
        if (data.data === 0) {
          this.userNameMsg = '该手机号码已存在'
          this.errorWarning.userNameError = true
        } else {
          this.phoneExist = false
        }
      })
    },
    checkPassword () {
      if (!this.userInfo.password) {
        this.errorWarning.passwordError = true
        this.passwordText = '密码不能为空'
        return true
      }
      let reg = /\S{6,20}/
      if (!reg.test(this.userInfo.password)) {
        this.errorWarning.passwordError = true
        this.passwordText = '密码有误,请重试'
      } else {
        this.errorWarning.passwordError = false
      }
    },
    checkRePwd () {
      if (this.userInfo.confirmPassword !== this.userInfo.password) {
        this.errorWarning.confirmPasswordError = true
      } else {
        this.errorWarning.confirmPasswordError = false
      }
    },
    focusUserName () {
      this.errorWarning.userNameError = false
      this.phoneExist = true
    },
    handleLogin () {
      this.$router.push('/login')
    }
  },
  computed: {
    loginActive () {
      if (this.userInfo.userName && this.userInfo.password && this.userInfo.code && !this.errorWarning.confirmPasswordError && this.userInfo.confirmPassword && this.checked && !this.loading && this.userInfo.imgCode && !this.errorWarning.passwordError) {
        // this.keyCodeEvent()
        return false
      } else {
        return true
      }
    }
  },
  destroyed () {
    document.onkeydown = null
  }
}
</script>

<style lang="less" scoped>
@import '~@/assets/less/variables';
// .logo{
//     margin-top: 77px;
//     margin-bottom: 81px;
//     font-size:30px;
//     color:@btn-bg-color;
//     text-align: center;
//     // line-height: 0;
//     p{
//         height:32px;
//         line-height:32px;
//         margin-bottom:3px;
//     }
//     span{
//         color:#b8b8b8;
//         font-size:14px;
//     }
// }
.logo {
  float: left;
  margin: 15px 0 0 56px;
  font-size: 30px;
  text-align: center;
  font-size: 15px;
  font-weight: 400;
  color: rgba(75, 75, 75, 1);
}
.registerTitle {
  margin-left: 31px;
}
.logout {
  margin-right: 50px;
  float: right;
  font-size: 16px;
  margin-top: 30px;
  .drop-down {
    cursor: pointer;
    font-size: 16px;
  }
  .toLogin {
    cursor: pointer;
    color: @theme-blue;
    color: var(--mainColor);
    text-decoration: underline;
  }
}
.readDeal {
  // font-family: SimSun;
  color: #979797;
  text-decoration: underline;
  cursor: pointer;
  margin-left: 5px;
}
.register-main {
  margin: 49px auto 30px;
  width: 599px;
  .error-warning,
  .remind-warning {
    position: absolute;
    left: 402px;
    top: 0;
    width: 330px;
  }
  .remind-warning {
    width: 330px;
  }
  .show-error {
    color: #f27072;
    margin-left: 5px;
    font-size: 15px;
    letter-spacing: 1px;
  }
  .show-remind {
    font-size: 14px;
    // font-family: SimSun;
    font-weight: 400;
    color: #b7b7b7;
    margin-left: 14px;
  }
  .error-icon-warning {
    margin-left: 19px;
    font-size: 24px;
    color: #f2706e;
    vertical-align: middle;
  }
  .remember {
    color: @gray-shallow;
    cursor: pointer;
  }
  .forget {
    float: right;
    color: #108ee9;
    text-decoration: underline;
    cursor: pointer;
  }
  .code-img-box {
    width: 162px;
    height: 43px;
    // float: right;
    display: inline-block;
    border-radius: 4px;
    border: 1px solid #dcdfe6;
    margin-left: 7px;
    .code-img {
      width: 162px;
      height: 44px;
    }
    .refresh-button {
      width: 44px;
      height: 44px;
      float: right;
      background: #e8e8e8;
      .refresh-icon {
        color: #afafaf;
        font-size: 21px;
        margin: 12px 12px;
        cursor: pointer;
      }
    }
  }
  .login-button {
    width: 402px;
    height: 45px;
    margin-left: 95px;
    font-size: 18px;
    border: none;
    box-shadow: 1px 6px 4px #c0e2fa;
    box-shadow: 1px 6px 4px #c0e2fa;
  }
  .code-input {
    width: 285px;
    margin-right: 7px;
    float: left;
  }
  .code-input1 {
    width: 285px;
  }
  .verification-code {
    width: 108px;
    height: 43px;
    float: left;
    background-color: @theme-blue-light;
    color: #fff;
    border-radius: 4px;
    border: 1px solid @theme-blue;
  }
  .verification-code:focus {
    border-color: @theme-blue;
  }
  .el-button--primary:active {
    background: @theme-blue;
  }
  .no-regist {
    margin-top: 30px;
    margin-left: 183px;
    .to-regist {
      cursor: pointer;
      text-decoration: underline;
      color: @theme-blue;
      margin-left: 10px;
    }
  }
}
.register-main .el-button.is-disabled {
  color: #fff;
  background-color: @theme-blue;
  border-color: @theme-blue;
  opacity: 0.5;
  letter-spacing: 8px;
}
.register-main .code-form .el-button.is-disabled {
  letter-spacing: 0px;
}
.image {
  width: 90px !important;
  height: 69px !important;
  vertical-align: middle;
  color: @theme-blue;
  margin: 0 auto;
}
.fund-logo {
  width: 137px !important;
  height: 43px !important;
  color: @theme-blue;
  color: var(--mainColor);
  vertical-align: middle;
}
.register-main/deep/.el-button,
.register-main/deep/.el-button:hover {
  background-color: #108ee9;
}
</style>

<style lang="less">
.register-main .el-input {
  width: 402px;
}
.register-main .el-input__inner {
  height: 45px;
  line-height: 14px;
  padding-top: 12px;
  padding-bottom: 12px;
  // line-height: 45px;
  background: #fcfcfc;
}
.register-main .el-input__inner:focus {
  border-color: #108ee9;
}
.register-main .el-form-item__label {
  // font-family: SimSun;
  font-size: 16px;
}
.register-main .el-checkbox__label {
  color: #979797;
  font-size: 14px;
  // font-family: SimSun;
}
</style>
