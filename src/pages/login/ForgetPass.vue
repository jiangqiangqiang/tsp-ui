<template>
  <div>
    <div class="logo">
      <!-- <div class='image fund-logo'></div> -->
      <svg-icon iconClass='dls_logo' className='image'></svg-icon>
    </div>
    <div class="forget-pass-main">
      <el-form style="width: 450px" label-width="100px">
        <el-form-item label="手机号码">
          <el-input v-model="resetPasswords.userName" placeholder="请输入手机号码" @blur="verifyPhone"></el-input>
          <div v-if="errorWarning.telephoneNumberError" class="error-warning">
            <i class="el-icon-warning error-icon-warning"></i>
            <span class="show-error">手机号码有误</span>
          </div>
        </el-form-item>
        <el-form-item label="图形验证码">
          <el-input type="phone" class="code-input" v-model="resetPasswords.imgCode" placeholder="请输入验证码"
            @blur="imgCodeBlur">
          </el-input>
          <img class="verification-code" :src="imgSrc" alt="图形验证码" style="cursor: pointer" @click="getImgCode">
          <div v-if="errorWarning.imgCodeError" class="error-warning">
            <i class="el-icon-warning error-icon-warning"></i>
            <span class="show-error">{{imgCodeText}}</span>
          </div>
        </el-form-item>
        <el-form-item label="短信验证码">
          <el-input class="code-input" v-model="resetPasswords.smsCode" placeholder="请输入短信验证码"></el-input>
          <el-button class="verification-code" :disabled="!codeStatus || !resetPasswords.userName" @click="getCode">
            {{codeStatus? '获取验证码' : `${codeTime}秒后获取`}}</el-button>
          <div v-if="errorWarning.smsCodeError" class="error-warning">
            <i class="el-icon-warning error-icon-warning"></i>
            <span class="show-error">短信验证码有误</span>
          </div>
        </el-form-item>
        <el-form-item label="重置密码">
          <el-input type="password" v-model="resetPasswords.password" placeholder="请输入新密码" @blur="verifyPassword"
            autocomplete="new-password"></el-input>
          <div v-if="errorWarning.passwordError" class="error-warning" style="width: 400px">
            <i class="el-icon-warning error-icon-warning"></i>
            <span class="show-error">密码由6-16位字母、数字、字符串组成</span>
          </div>
        </el-form-item>
        <el-form-item label="确认重置密码">
          <el-input type="password" v-model="resetPasswords.confirmPassword" placeholder="请重复输入新密码"
            autocomplete="new-password"></el-input>
          <div v-if="errorWarning.confirmPasswordError" class="error-warning">
            <i class="el-icon-warning error-icon-warning"></i>
            <span class="show-error">两次密码不一致</span>
          </div>
        </el-form-item>
        <el-button type="primary" :disabled="resetActive" class="reset-button" @click="handleReset">重置</el-button>
        <div class="goback" @click="goBack"><i class="el-icon-arrow-left"></i>返回</div>
      </el-form>
    </div>
  </div>
</template>

<script>
import settings from '@/settings'
export default {
  name: 'forgetpass',
  data () {
    return {
      // 重置密码提交信息
      resetPasswords: {
        userName: this.$route.query.userName,
        smsCode: '',
        imgCode: '',
        password: '',
        confirmPassword: ''
      },
      csrfCode: '',
      // 错误提示
      errorWarning: {
        telephoneNumberError: false,
        smsCodeError: false,
        passwordError: false,
        confirmPasswordError: false,
        imgCodeError: false
      },
      imgCodeText: '图形验证码有误',
      imgSrc: '',
      // 验证码状态
      codeStatus: true,
      // 验证码获取间隔
      codeTime: 60,
      // 图片验证码 Url
      getCsrfCodeUrl: settings.apiGateway.getCsrfCode,
      getImgCodeUrl: settings.apiGateway.getImgCode,
      // 验证图形验证码
      checkMsgUrl: settings.apiGateway.getCaSms,
      // 重置密码 Url
      resetPasswordUrl: settings.apiGateway.resetPassword

    }
  },
  created () {
    this.getImgCode()
  },
  methods: {
    // 校验设置用户名
    // verifyPhone () {
    //   let telephoneNumber = /(^[a-zA-Z0-9]{6,20}$)/
    //   if (!telephoneNumber.test(this.resetPasswords.telephoneNumber)) {
    //     this.errorWarning.telephoneNumberError = true
    //     // setTimeout(() => {
    //     //   this.errorWarning.userNameError = false
    //     // }, 3000)
    //     return true
    //   } else {
    //     this.errorWarning.telephoneNumberError = false
    //   }
    // },
    // 校验手机号码
    verifyPhone () {
      // this.verifyUser()
      let number = /^[1][3,5,7,8][0-9]{9}$/
      if (!number.test(this.resetPasswords.userName)) {
        this.errorWarning.telephoneNumberError = true
        return true
      } else {
        this.errorWarning.telephoneNumberError = false
      }
    },
    // 校验密码位数
    verifyPassword () {
      let password = /^.{6,16}$/
      if (!password.test(this.resetPasswords.password)) {
        this.errorWarning.passwordError = true
        return true
      } else {
        this.errorWarning.passwordError = false
      }
    },
    // 请求验证码标识
    getImgCode () {
      this.fetch(this.getCsrfCodeUrl).then(data => {
        this.imgSrc = `${settings.domain.domain}${this.getImgCodeUrl}/${data.data.csrfCode}`
        this.csrfCode = data.data.csrfCode
      }).catch(data => {
        this.$message.error('验证码获取失败')
      })
    },
    imgCodeBlur () {
      if (this.resetPasswords.imgCode) {
        this.errorWarning.imgCodeError = false
      } else {
        this.errorWarning.imgCodeError = true
        this.imgCodeText = '图形验证码有误'
      }
    },
    // 请求验证码接口
    getCode () {
      if (this.verifyPhone()) return this.$message.error('手机号输入有误')
      if (!this.resetPasswords.imgCode) {
        this.errorWarning.imgCodeError = true
        this.imgCodeText = '请输入图形验证码'
        return
      }
      let data = {
        csrfCode: this.csrfCode,
        mobile: this.resetPasswords.userName,
        imgCode: this.resetPasswords.imgCode
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
    // 验证码倒计时
    codeCountDown () {
      let time = setTimeout(() => {
        this.codeTime--
        this.codeStatus = false
        if (this.codeTime < 1) {
          this.codeStatus = true
          this.codeTime = 60
        } else {
          this.codeCountDown()
        }
        clearTimeout(time)
      }, 1000)
    },
    // 重置密码
    handleReset () {
      if (this.resetPasswords.password.length < 6) {
        this.errorWarning.passwordError = true
        // setTimeout(() => {
        //   this.errorWarning.passwordError = false
        // }, 2000)
        return
      } else {
        this.errorWarning.passwordError = false
      }
      if (this.verifyPhone()) return
      // if (this.verifyNumber()) return
      if (this.verifyPassword()) return
      this.fetch(this.resetPasswordUrl, 'post', this.resetPasswords).then(data => {
        this.$message({
          type: 'success',
          message: '修改成功'
        })
        this.resetPasswords = {}
        this.goRouter('/login')
      }).catch(data => {
        if (data.data.code === 2013) {
          this.errorWarning.smsCodeError = true
          setTimeout(() => {
            this.errorWarning.smsCodeError = false
          }, 2000)
        } else if (data.data.code === 2003) {
          this.errorWarning.confirmPasswordError = true
          setTimeout(() => {
            this.errorWarning.confirmPasswordError = false
          }, 2000)
        } else {
          this.$message.error(data.data.msg)
        }
      })
    },
    // 跳转到登录页
    goRouter (url) {
      this.$router.replace(url)
    }
  },
  computed: {
    resetActive () {
      if (this.resetPasswords.userName && this.resetPasswords.smsCode && this.resetPasswords.password && this.resetPasswords.confirmPassword) {
        return false
      } else {
        return true
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import '~@/assets/less/variables';
.logo {
  margin-top: 77px;
  margin-bottom: 81px;
  font-size: 30px;
  color: @btn-bg-color;
  text-align: center;
  // line-height: 0;
  p {
    height: 32px;
    line-height: 32px;
    margin-bottom: 3px;
  }
  span {
    color: #b8b8b8;
    font-size: 14px;
  }
}
.forget-pass-main {
  margin: 0 auto;
  width: 540px;
  .error-warning {
    position: absolute;
    left: 350px;
    top: 0;
    width: 180px;
  }
  .show-error {
    color: #f27072;
    margin-left: 5px;
    font-size: 15px;
    letter-spacing: 1px;
  }
  .error-icon-warning {
    margin-left: 19px;
    font-size: 24px;
    color: #f2706e;
    vertical-align: middle;
  }
  .code-input {
    width: 237px;
  }
  .verification-code {
    width: 108px;
    height: 45px;
    // background: #f4f4f4;
    border-radius: 4px;
    // border: 1px solid #dcdfe6;
  }
  .reset-button {
    width: 350px;
    height: 45px;
    font-size: 18px;
    margin-left: 100px;
    border: none;
    box-shadow: 1px 6px 4px #c0e2fa;
    box-shadow: 1px 6px 4px #c0e2fa;
    letter-spacing: 8px;
  }
}
.forget-pass-main .el-button.is-disabled {
  color: #fff;
  background-color: @theme-blue;
  border-color: @theme-blue;
  opacity: 0.5;
  // letter-spacing: 8px;
  // margin-left: 100px;
}
.image {
  width: 220px !important;
  height: 69px !important;
  vertical-align: middle;
  color: @theme-blue;
  margin: 0 auto;
}
// .fund-logo {
//   background-image:url('~@/assets/img/fund-logo.png');
// }
.goback {
  width: 100%;
  text-align: center;
  margin-top: 30px;
  margin-left: 40px;
  text-decoration: underline;
  color: @theme-blue;
  cursor: pointer;
}
</style>

<style lang="less">
.forget-pass-main .el-input__inner {
  height: 45px;
  line-height: 14px;
  padding-top: 12px;
  padding-bottom: 12px;
  // line-height: 45px;
  background: #fcfcfc;
}
.forget-pass-main .el-input__inner:focus {
  border-color: #108ee9;
}
</style>
