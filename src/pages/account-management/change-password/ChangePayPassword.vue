<template>
  <div class="change-phone-dialog1">
    <el-dialog v-if="!exist" :before-close="handleClose" center title="设置支付密码" :visible.sync="changePayPasswordShow"
      width="568px" top="235px" :close-on-click-modal="false">
      <div>
        <p class="prompt">为了您的账号安全, 请先进行身份验证</p>
        <el-form class="change-phone">
          <el-form-item>
            <el-input class="phone-input" v-model="teleText" disabled></el-input>
          </el-form-item>
          <el-form-item>
            <el-input class="code-input" v-model="CsrfCode" placeholder="请输入短信验证码"></el-input>
            <el-button class="verification-code" :disabled="!codeStatus" @click="getCode">
              {{codeStatus? '获取验证码' : `${codeTime}秒后获取`}}</el-button>
          </el-form-item>
          <el-form-item>
            <el-input type="password" class="phone-input" @blur="verifyPassword" v-model="newPassword"
              placeholder="设置支付密码 (6位数字)" autocomplete="new-password"></el-input>
            <div class="error-warning" v-if="errorPassword">
              <i class="el-icon-warning error-icon-warning"></i>
              <span class="login-error">输入的新密码应为6位数字</span>
            </div>
          </el-form-item>
          <el-form-item>
            <el-input type="password" class="phone-input" v-model="oneMorePassword" placeholder="再次输入支付密码"
              @blur="verifyPstFit" autocomplete="new-password"></el-input>
            <div v-if="oneMorePasswordError" class="error-warning">
              <i class="el-icon-warning error-icon-warning"></i>
              <span class="login-error">两次输入密码不一致</span>
            </div>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <Button :disabled="changePasswordActive" class="next-button" @handleClick="setPassword" title="设置密码"
            style="margin-top: 25px;"></Button>
        </div>
      </div>
    </el-dialog>
    <el-dialog v-if="exist && step === '1'" :before-close="handleClose" center title="验证现管理员身份"
      :visible.sync="changePayPasswordShow" width="568px" :close-on-click-modal="false">
      <div>
        <p class="prompt">为了您的账号安全，请先进行身份验证</p>
        <el-form class="change-phone">
          <el-form-item>
            <el-input class="phone-input" v-model="teleText" disabled></el-input>
          </el-form-item>
          <el-form-item>
            <el-input class="code-input" v-model="CsrfCode" placeholder="请输入短信验证码"></el-input>
            <el-button class="verification-code" :disabled="!codeStatus" @click="getCode">
              {{codeStatus? '获取验证码' : `${codeTime}秒后获取`}}</el-button>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <Button :disabled="changePasswordActive1" class="next-button" @handleClick="goNext" title="下一步"></Button>
        </div>
      </div>
    </el-dialog>
    <el-dialog v-if="exist && step === '2'" :before-close="handleClose" center title="修改支付密码"
      :visible.sync="changePayPasswordShow" width="568px" :close-on-click-modal="false">
      <div>
        <p class="prompt">为了您的账号安全, 请先进行身份验证</p>
        <el-form class="change-phone">
          <el-form-item>
            <el-input class="phone-input" value="请使用原密码验证" disabled></el-input>
          </el-form-item>
          <el-form-item>
            <el-input type="password" class="phone-input" v-model="oldPassword" placeholder="请输入原密码"
              autocomplete="new-password"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input @blur="verifyPassword" type="password" class="phone-input" v-model="newPassword"
              placeholder="设置支付密码 (6位数字)" autocomplete="new-password"></el-input>
            <div class="error-warning" v-if="errorPassword">
              <i class="el-icon-warning error-icon-warning"></i>
              <span class="login-error">输入的新密码应为6位数字</span>
            </div>
          </el-form-item>
          <el-form-item>
            <el-input type="password" class="phone-input" v-model="oneMorePassword" placeholder="再次输入支付密码"
              autocomplete="new-password"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <Button :disabled="changePasswordActive2" class="next-button" @handleClick="resetPassword"
            title="重置密码"></Button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import settings from '@/settings'
export default {
  data () {
    return {
      errorPassword: false,
      checkIsSetPayPasswordUrl: settings.apiGateway.checkIsSetPayPassword,
      // 短信验证码
      getSendCodeUrl: settings.apiGateway.adminSmsCode,
      setPayPasswordUrl: settings.apiGateway.setPayPassword,
      checkMsgUrl: settings.apiGateway.checkMsg,
      exist: true,
      changePayPasswordShow: false,
      telephone: '',
      teleText: '',
      CsrfCode: '',
      oldPassword: '',
      newPassword: '',
      oneMorePassword: '',
      oneMorePasswordError: false,
      codeStatus: true,
      codeTime: 60,
      step: '1'
    }
  },
  created () {
    this.changePayPasswordShow = true
    this.fetch(this.checkIsSetPayPasswordUrl).then(data => {
      this.telephone = data.data.adminMobile
      this.teleText = '请使用手机 ' + this.telephone.replace(/(.{3})(.+)(.{4})/, (x, y, z, p) => {
        let i = ''
        while (i.length < z.length) {
          i += '*'
        }
        return y + i + p
      }) + ' 验证'
      this.exist = data.data.exist
      this.changePayPasswordShow = true
    }).catch(res => {
      this.$message.error(res.data.msg)
    })
  },
  methods: {
    // 设置密码时判断两次输入的密码是否一致
    verifyPstFit () {
      if (this.newPassword !== this.oneMorePassword) {
        this.oneMorePasswordError = true
      } else {
        this.oneMorePasswordError = false
      }
    },
    getCode () {
      let data = {
        mobile: this.telephoneNumber,
        type: 'ValidMobile'
      }
      this.fetch(`${this.getSendCodeUrl}`, 'post', data).then(data => {
        this.$message.success('发送成功,请注意查收!')
        this.codeCountDown()
      }).catch(data => {
        this.$message.error(data.msg)
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
          clearTimeout(time)
        } else {
          this.codeCountDown()
        }
      }, 1000)
    },
    setPassword () {
      if (this.verifyPassword()) return
      this.fetch(this.setPayPasswordUrl, 'PUT', {
        code: this.CsrfCode,
        mobile: this.telephone,
        password: this.newPassword,
        repeatPassword: this.oneMorePassword
      }).then(data => {
        this.changePayPasswordShow = false
        this.popUpSuccess({
          text: '密码设置成功',
          okBtn: '确定',
          ok: () => {
            this.$emit('handleClose')
          }
        })
      }).catch(res => {
        this.$message.error(res.data.msg)
      })
    },
    resetPassword () {
      if (this.verifyPassword()) return
      this.fetch(this.setPayPasswordUrl, 'PUT', {
        originalPassword: this.oldPassword,
        password: this.newPassword,
        repeatPassword: this.oneMorePassword
      }).then(data => {
        this.changePayPasswordShow = false
        this.popUpSuccess({
          text: '密码重置成功',
          okBtn: '确定',
          ok: () => {
            this.$emit('handleClose')
          }
        })
      }).catch(res => {
        this.$message.error(res.data.msg)
      })
    },
    goNext () {
      this.fetch(`${this.checkMsgUrl}${this.telephone}/${this.CsrfCode}`).then(data => {
        this.log(data)
        this.step = '2'
        this.CsrfCode = ''
      }).catch(res => {
        this.$message.error(res.data.msg)
      })
    },
    handleClose () {
      this.changePayPasswordShow = false
      this.$emit('handleClose')
    },
    verifyPassword () {
      let passwordReg = /^\d{6}$/
      if (!passwordReg.test(this.newPassword)) {
        this.errorPassword = true
        return true
      } else {
        this.errorPassword = false
      }
    }
  },
  computed: {
    changePasswordActive () {
      if (this.CsrfCode && this.newPassword && this.oneMorePassword) {
        if (this.newPassword === this.oneMorePassword) {
          return false
        }
        return true
      } else {
        return true
      }
    },
    changePasswordActive1 () {
      return !this.CsrfCode
    },
    changePasswordActive2 () {
      if (this.oldPassword && this.newPassword && this.oneMorePassword) {
        if (this.newPassword === this.oneMorePassword) {
          return false
        }
        return true
      } else {
        return true
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import '~@/assets/less/variables';
.change-phone-dialog1 {
  .prompt {
    text-align: center;
    color: #b6b6b6;
    font-size: 14px;
  }
  .change-phone {
    .el-form-item {
      width: 403px;
      margin: 0 auto;
    }
    .phone-input {
      width: 100%;
      text-align: center;
      margin-top: 30px;
    }
    .code-input {
      width: 290px;
      margin-top: 30px;
    }
  }
  .verification-code {
    width: 108px;
    height: 45px;
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
  .next-button {
    width: 403px;
    height: 50px;
    font-size: 18px;
    margin-top: 20px;
    margin-left: 58px;
    // background-color: @theme-blue;
    // background-color: var(--mainColor);
    // border: none;
  }
}
// .el-button.is-disabled{
//   color:#858585;
//     background-color: @btn-bg-disabeled;
//     border-color: @btn-bg-disabeled;
// }
.error-warning {
  color: red;
  position: absolute;
  top: 70px;
}
</style>

<style lang="less">
.change-phone-dialog1 .el-input__inner {
  height: 45px;
  line-height: 14px;
  padding-top: 12px;
  padding-bottom: 12px;
  // line-height: 45px;
}
.change-phone-dialog1 .el-form-item {
  margin-bottom: 0;
}
.change-phone-dialog1 .el-dialog .el-dialog__title {
  line-height: 0;
}
.change-phone-dialog1 .el-dialog__header {
  padding: 56px 20px 0;
}
.change-phone-dialog1 .el-dialog__wrapper .el-dialog {
}
.change-phone-dialog1 {
  .el-dialog {
    position: absolute;
    top: 50% !important;
    left: 50%;
    transform: translate3d(-50%, -50%, 0);
    margin-top: 0 !important;
    margin-left: 108px;
  }
}
</style>
