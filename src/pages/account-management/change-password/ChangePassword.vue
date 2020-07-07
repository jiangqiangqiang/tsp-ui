<template>
  <div class="change-password-main">
    <!-- 需要做一个假的密码框将该死的360填充去掉 -->
    <div style="height: 0">
      <input style="visibility:hidden" type="password" id="0" />
    </div>
    <BusinessTitle title="安全中心"></BusinessTitle>
    <div class="changeCon">
      <div class="phone-number">
      <span class="phone-title">绑定手机号码</span>
      <a class="change-button" @click="isShowPhone=true">修改手机号码</a>
    </div>
    <div class="phone-number emailNumber">
      <span class="phone-title">绑定邮箱</span>
      <a class="change-button" @click="changeEmailDialogShow=true">修改邮箱地址</a>
    </div>
    <div class="login-password">
      <span class="password-title">登录密码</span>
      <a class="change-button" @click="changeLoginPasssword">修改登录密码</a>
    </div>
    <div class="payment-password">
      <span class="password-title">支付密码</span>
      <a class="change-button" @click="isShowPayPassword=true">设置/修改支付密码</a>
    </div>
    </div>
    <div class="change-phone-dialog">
      <el-dialog :before-close="handleClose" center title="修改密码" :visible.sync="changeLoginPasswordShow" width="568px"
        top="235px">
        <p class="prompt">为了您的账号安全, 请先进行身份验证</p>
        <el-form class="change-phone" autocomplete="off">
          <el-form-item>
            <el-input class="phone-input" v-model="showTelephoneNum" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item>
            <el-input class="code-input" v-model="CsrfCode" placeholder="请输入短信验证码"></el-input>
            <input type="text" class="is-hidden" />
            <el-button class="verification-code" :disabled="!codeStatus" @click="getCode">
              {{codeStatus? '获取验证码' : `${codeTime}秒后获取`}}</el-button>
          </el-form-item>
          <el-form-item>
            <input type="password" class="is-hidden" />
            <el-input type="password" class="phone-input" v-model="newPassword" placeholder="请输入新密码 (6-16位)"
              @blur="verifyNewpsd" autocomplete="new-password"></el-input>
            <div class="error-warning" v-if="errorPassword">
              <i class="el-icon-warning error-icon-warning"></i>
              <span class="login-error">输入的新密码应为6位数字</span>
            </div>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <Button title="下一步" class="next-button" @handleClick="changePasswordNext"
            :disabled="changePasswordActive"></Button>
        </div>
      </el-dialog>
      <el-dialog center title="更改邮箱" :visible.sync="changeEmailDialogShow" width="568px" top="290px">
        <p class="prompt"></p>
        <el-form class="change-phone">
          <el-form-item>
            <el-input class="phone-input" v-model="email"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" :disabled="basicInfoEmailActive" class="next-button" @click="changeEmail">修改
          </el-button>
        </div>
      </el-dialog>
    </div>
    <ChangePayPassword @handleClose="isShowPayPassword = false" v-if="isShowPayPassword"></ChangePayPassword>
    <ChangePhone @handleClose="isShowPhone = false" v-if="isShowPhone"></ChangePhone>
  </div>
</template>

<script>
import settings from '@/settings'
import BusinessTitle from '@/components/BusinessTitle'
import ChangePayPassword from './ChangePayPassword'
import ChangePhone from './ChangePhone'
export default {
  name: 'changepassword',
  components: {
    BusinessTitle,
    ChangePayPassword,
    ChangePhone
  },
  data () {
    return {
      // 验证码
      CsrfCode: '',
      email: '',
      errorPassword: false,
      // 新密码
      newPassword: '',
      // 更改登录密码弹窗
      changeLoginPasswordShow: false,
      changeEmailDialogShow: false,
      // 获取的电话号码
      telephoneNumber: '',
      // 展示的电话号码
      showTelephoneNum: '',
      // 验证码状态
      codeStatus: true,
      // 验证码获取间隔
      codeTime: 60,
      // 获取手机号 Url
      getMobileUrl: settings.apiGateway.getMobile,
      // 短信验证码
      getSendCodeUrl: settings.apiGateway.adminSmsCode,
      // 修改密码
      getChangePasswordUrl: settings.apiGateway.changePassword,
      // 修改邮箱
      getModifyEmailUrl: settings.apiGateway.getModifyEmail,
      isShowPayPassword: false,
      isShowPhone: false,
      sysRole: ''
    }
  },
  created () {
    this.getMobile()
    if (this.$route.query.choose) {
      this.isShowPayPassword = true
    }
    this.sysRole = this.getUserRole()
  },
  methods: {
    // 关闭对话框
    handleClose () {
      this.CsrfCode = ''
      this.newPassword = ''
      this.changeLoginPasswordShow = false
    },
    // 获取手机号
    getMobile () {
      this.fetch(this.getMobileUrl).then(data => {
        this.telephoneNumber = data.data
      }).catch(data => {
        this.$message.error(data.msg)
      })
    },
    // 请求验证码接口
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
        } else {
          this.codeCountDown()
        }
        clearTimeout(time)
      }, 1000)
    },
    // 修改登录密码
    changeLoginPasssword () {
      this.showTelephoneNum = `请使用手机 ${this.telephoneNumber.replace(/(.{3})(.+)(.{4})/, (x, y, z, p) => {
        let i = ''
        while (i.length < z.length) {
          i += '*'
        }
        return y + i + p
      })} 验证`
      this.changeLoginPasswordShow = true
    },
    // 判断新密码是否为6位
    verifyNewpsd () {
      if (this.newPassword.length < 6) {
        this.errorPassword = true
        return true
      } else {
        this.errorPassword = false
      }
    },
    // 修改登录密码 下一步按钮
    changePasswordNext () {
      let data = {
        code: this.CsrfCode,
        password: this.newPassword
      }
      this.fetch(this.getChangePasswordUrl, 'put', data).then(data => {
        this.changeLoginPasswordShow = false
        // 显示成功弹层
        this.popUpSuccess({
          text: '密码设置成功',
          okBtn: '确定',
          ok: () => {
            this.logOut()
          }
        })
      }).catch(data => {
        this.$message.error(data.data.msg)
      })
    },
    // 修改邮箱
    changeEmail () {
      let emailReg = /^[a-zA-Z0-9_-]+@([a-zA-Z0-9]+\.)+(com|cn|net|org)$/i
      if (!emailReg.test(this.email)) {
        this.$message.error('请输入正确的邮箱')
        return
      }
      this.fetch(`${this.getModifyEmailUrl}`, 'put', { 'email': this.email }).then(data => {
        if (data.code === 0) {
          this.changeEmailDialogShow = false
          this.$message.success('修改成功')
        }
      }).catch(data => {
        this.$message.error(data.data.msg)
      })
    }
  },
  computed: {
    changePasswordActive () {
      if (this.CsrfCode && this.newPassword) {
        return false
      } else {
        return true
      }
    },
    // 修改邮箱的按钮是否可用
    basicInfoEmailActive () {
      if (this.email) {
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
.change-password-main {
  .login-password,
  .payment-password {
    margin-top: 22px;
    margin-left: 10px;
    width: 546px;
    height: 122px;
    background: url('~@/assets/img/changePasswordBg.gif') no-repeat -6px;
    // background: #fcfcfc;
    border-left: 1px solid #e1e1e1;
    .password-title {
      display: block;
      color: #666666;
      font-size: 16px;
      margin: 35px 0 17px 30px;
      font-weight: 600;
    }
    .change-button {
      color: @theme-blue;
      color: var(--mainColor);
      font-size: 14px;
      text-decoration: underline;
      margin-left: 30px;
      cursor: pointer;
    }
  }
  .changeCon {
    width: 1114px;
    margin: 0 auto;
  }
  .phone-number {
    margin-top: 22px;
    margin-left: 10px;
    width: 546px;
    height: 122px;
    float: left;
    background: url('~@/assets/img/aqzx_bdsj.gif') no-repeat -6px;
    border-left: 1px solid #e1e1e1;
    .phone-title {
      display: block;
      color: #666666;
      font-size: 16px;
      padding: 35px 0 17px 30px;
      font-weight: 600;
    }
    .change-button {
      color: @theme-blue;
      color: var(--mainColor);
      font-size: 14px;
      text-decoration: underline;
      margin-left: 30px;
      cursor: pointer;
    }
  }
  .emailNumber {
    background: url('~@/assets/img/aqzx_zfmm.gif') no-repeat -6px;
  }
  .login-password {
    float: left;
  }
  .payment-password {
    float: left;
  }
  .change-phone-dialog {
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
    .verification-code:focus {
      border-color: @theme-blue;
      border-color: var(--mainColor);
    }
    .next-button {
      width: 403px;
      height: 50px;
      font-size: 18px;
      margin-top: -35px;
      background-color: @theme-blue;
      background-color: var(--mainColor);
      border: none;
    }
  }
}
.error-warning {
  color: red;
  position: absolute;
  top: 70px;
}
.is-hidden {
  position: absolute;
  left: -10000px;
  top: -10000px;
}
</style>

<style>
.change-password-main .change-phone-dialog .el-input__inner {
  height: 45px;
  line-height: 14px;
  padding-top: 12px;
  padding-bottom: 12px;
  /* line-height: 45px; */
}
.change-password-main .change-phone-dialog .el-form-item {
  margin-bottom: 0;
}
.change-password-main .change-phone-dialog .el-dialog .el-dialog__title {
  line-height: 0;
}
.change-phone-dialog .el-dialog__header {
  padding: 56px 20px 0;
}
.change-password-main .dialog-footer {
  margin-bottom: 30px;
}
.change-password-main .change-phone-dialog .el-dialog {
  position: absolute;
  top: 50% !important;
  left: 50%;
  transform: translate3d(-50%, -50%, 0);
  margin-top: 0 !important;
  margin-left: 108px;
}
</style>
