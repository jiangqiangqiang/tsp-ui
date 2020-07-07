<template>
  <div class="change-phone-dialog2">
    <el-dialog :before-close="handleClose" center title="
修改绑定手机号" :visible.sync="verifyPhoneNumberShow"
      width="568px" top="235px">
        <p class="prompt">为了您的账号安全, 请先进行身份验证</p>
        <el-form class="change-phone">
          <el-form-item>
            <el-input class="phone-input" v-model="showTelephoneNum" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input class="code-input" v-model="CsrfOldCode" placeholder="请输入短信验证码"></el-input>
            <el-button class="verification-code" :disabled="!codeStatus" @click="getCode">{{codeStatus? '获取验证码' : `${codeTime}秒后获取`}}</el-button>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <Button  title="下一步" class="next-button" @handleClick="changePhoneNext" :disabled="verifyPhoneActive"></Button>
        </div>
      </el-dialog>
      <el-dialog :before-close="handleClose" center title="
绑定新手机号" :visible.sync="changePhoneNumberShow"
      width="568px" top="235px">
        <p class="prompt">为了您的账号安全, 请先进行身份验证</p>
        <el-form class="change-phone">
          <el-form-item>
            <el-input class="phone-input" v-model="newPhoneNumber"  placeholder="请输入新手机号码" @focus="focusUserName"  @blur="verifyPhoneNumber"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input class="code-input" v-model="CsrfNewCode" placeholder="请输入短信验证码"></el-input>
            <el-button class="verification-code" :disabled="!codeStatus || phoneExist" @click="getNewCode">{{codeStatus? '获取验证码' : `${codeTime}秒后获取`}}</el-button>
          </el-form-item>
        </el-form>
        <div class="error-warning" v-if="errorNewPhoneNumber">
          <i class="el-icon-warning error-icon-warning"></i>
          <span class="login-error">该手机号已被占用</span>
        </div>
        <div slot="footer" class="dialog-footer">
          <Button  title="下一步" class="next-button" @handleClick="changePhoneSuccess" :disabled="changePhoneActive"></Button>
        </div>
      </el-dialog>
      <el-dialog :visible.sync="SuccessDialogShow"
        width="568px" top="290px" :before-close="handleClose" center>
        <div class="success">
          <div><i class="el-icon-circle-check-outline"></i></div>
          <div class="success-text">绑定手机号修改成功</div>
          <div>
            <button class="konw-btn">知道了 (1s)</button>
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
      // 旧手机验证码
      CsrfOldCode: '',
      errorNewPhoneNumber: false,
      // 新手机验证码
      CsrfNewCode: '',
      // 验证旧手机的弹窗
      verifyPhoneNumberShow: false,
      // 更改手机号码弹窗
      changePhoneNumberShow: false,
      // 获取的电话号码
      telephoneNumber: '',
      // 展示的电话号码
      showTelephoneNum: '',
      // 新手机号
      newPhoneNumber: '',
      // 验证码状态
      codeStatus: true,
      // 手机号是否已存在
      phoneExist: true,
      // 验证码获取间隔
      codeTime: 60,
      // 获取手机号 Url
      getMobileUrl: settings.apiGateway.getMobile,
      // 短信验证码
      getSendCodeUrl: settings.apiGateway.adminSmsCode,
      // 修改密码
      getChangePasswordUrl: settings.apiGateway.changePassword,
      // 验证旧手机号码
      checkMsgUrl: settings.apiGateway.checkMsg,
      // 修改手机号
      changePhoneNumberUrl: settings.apiGateway.changePhoneNumber,
      // 输入新的手机号判断是否存在
      verifyPhoneNumberUrl: settings.apiGateway.verifyPhoneNumber,
      isShowPayPassword: false,
      SuccessDialogShow: false
    }
  },
  created () {
    this.getMobile()
    this.verifyPhoneNumberShow = true
  },
  methods: {
    // 关闭对话框
    handleClose () {
      this.CsrfOldCode = ''
      this.CsrfNewCode = ''
      this.verifyPhoneNumberShow = false
      this.changePhoneNumberShow = false
      this.SuccessDialogShow = false
      this.$emit('handleClose')
    },
    // 获取手机号
    getMobile () {
      this.fetch(this.getMobileUrl).then(data => {
        this.telephoneNumber = data.data
        this.showTelephoneNum = `请使用手机 ${this.telephoneNumber.replace(/(.{3})(.+)(.{4})/, (x, y, z, p) => {
          let i = ''
          while (i.length < z.length) {
            i += '*'
          }
          return y + i + p
        })} 验证`
      }).catch(data => {
        this.$message.error(data.msg)
      })
    },
    // 请求验证码接口
    getCode () {
      this.codeCountDown()
      let data = {
        mobile: this.telephoneNumber,
        type: 'ValidMobile'
      }
      this.fetch(`${this.getSendCodeUrl}`, 'post', data).then(data => {
        this.$message.success('发送成功,请注意查收!')
      }).catch(data => {
        this.$message.error(data.msg)
      })
    },
    // 输入新的手机号判断是否存在
    verifyPhoneNumber () {
      this.phoneExist = true
      if (!(/^1[3578]\d{9}$/.test(this.newPhoneNumber))) {
        this.$message({
          type: 'error',
          message: '手机号输入错误'
        })
        return
      }
      this.fetch(`${this.verifyPhoneNumberUrl}${this.newPhoneNumber}`).then(data => {
        if (data.data === 0) {
          this.errorNewPhoneNumber = true
          return true
        } else {
          this.errorNewPhoneNumber = false
          this.phoneExist = false
        }
      }).catch(data => {
        this.$message.error(data.msg)
      })
    },
    // 新手机号获取验证码
    getNewCode () {
      this.codeCountDown()
      let data = {
        mobile: this.newPhoneNumber,
        type: 'ChangeMobile'
      }
      this.fetch(`${this.getSendCodeUrl}`, 'post', data).then(data => {
        this.$message.success('发送成功,请注意查收!')
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
    // 验证手机号码 下一步按钮
    changePhoneNext () {
      this.fetch(`${this.checkMsgUrl}${this.telephoneNumber}/${this.CsrfOldCode}`).then(data => {
        this.codeStatus = true
        this.codeTime = 0
        this.changePhoneNumberShow = true
        this.verifyPhoneNumberShow = false
      }).catch(data => {
        this.$message.error(data.data.msg)
      })
    },
    // 绑定新手机 下一步按钮
    changePhoneSuccess () {
      this.fetch(`${this.changePhoneNumberUrl}${this.newPhoneNumber}/${this.CsrfOldCode}/${this.CsrfNewCode}`, 'post').then(data => {
        this.changePhoneNumberShow = false
        this.SuccessDialogShow = true
        setTimeout(() => {
          this.logOut()
        }, 1000)
      }).catch(data => {
        this.$message.error(data.data.msg)
      })
    },
    focusUserName () {
      this.errorNewPhoneNumber = false
      this.phoneExist = true
    }
  },
  computed: {
    verifyPhoneActive () {
      if (this.CsrfOldCode) {
        return false
      } else {
        return true
      }
    },
    changePhoneActive () {
      if (this.newPhoneNumber && this.CsrfNewCode) {
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
.change-phone-dialog2 {
    .prompt {
      text-align: center;
      color: #b6b6b6;
      font-size: 14px;
    }
    .change-phone{
      .el-form-item {
        width: 403px;
        margin: 0 auto;
      }
      .phone-input {
        width: 100%;
        text-align: center;
        margin-bottom: 29px;
        margin-top: 25px;
      }
      .code-input {
        width: 290px;
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
    .verification-code:focus{
      border-color: @theme-blue;
      border-color: var(--mainColor)
    }
    .next-button {
      width: 403px;
      height: 50px;
      font-size: 18px;
      margin-top: -21px;
      background-color: @theme-blue;
      background-color: var(--mainColor);
      border: none;
    }
    .success {
      text-align: center;
      width: 100%;
      font-size:14px;
      .el-icon-circle-check-outline {
        font-size: 66px;
        color: #78bf3f
      }
      .success-text {
        font-weight: 700;
        padding: 19px 0;
        font-size: 18px;
      }
      .konw-btn {
        width: 200px;
        height: 42px;
        line-height: 42px;
        text-align: center;
        margin-top: 25px;
        background-color: #fff;
        color: @theme-blue;
        color: var(--mainColor);
        border: 1px solid @theme-blue;
        border: 1px solid var(--mainColor);
      }
    }
  }
  .error-warning {
      color: red;
      position: relative;
      bottom: 65px;
      left:65px;
    }
</style>

<style>
.change-phone-dialog2 .el-input__inner {
  height: 45px;
  line-height: 14px;
  padding-top: 12px;
  padding-bottom: 12px;
  /* line-height: 45px; */
}
.change-phone-dialog2 .el-form-item {
  margin-bottom: 0
}
.change-phone-dialog2 .el-dialog .el-dialog__title {
  line-height: 0;
}
.change-phone-dialog2 .el-dialog__header {
  padding: 56px 20px 0;
  }
.change-phone-dialog2 .el-dialog {
  position: absolute;
  top: 50% !important;
  left: 50%;
  transform: translate3d(-50%, -50%, 0);
  margin-top: 0 !important;
  margin-left: 108px;
}
</style>
