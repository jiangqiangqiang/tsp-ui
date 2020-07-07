<template>
  <div>
    <Header></Header>
    <div
      v-loading="loadingShow"
      element-loading-text=""
      element-loading-spinner="el-icon-loading"
     >
    <div class="admin-info-main">
      <InitializeHeader :stepInfo="stepInfo"></InitializeHeader>
      <div class="content">
        <el-form label-position="right" label-width="125px" class="admin-form">
          <el-form-item label="管理员真实姓名" :rules="{ required: true}">
            <el-input v-model="adminInfo.adminName" placeholder="请输入管理员姓名" @blur="verifyAdminName"></el-input>
              <div v-if="errorWarning.adminNameError" class="error-warning">
                <i class="el-icon-warning error-icon-warning"></i>
                <span class="login-error">姓名输入有误</span>
              </div>
          </el-form-item>
          <el-form-item label="身份证号码" :rules="{ required: true}">
            <el-input v-model="adminInfo.adminIdNumber" placeholder="请输入身份证号码" @blur="verifyIdNum"></el-input>
              <div v-if="errorWarning.adminIdNumberError" class="error-warning">
                <i class="el-icon-warning error-icon-warning"></i>
                <span class="login-error">身份证有误</span>
              </div>
          </el-form-item>
          <el-form-item label="手机号码">
            <el-input disabled v-model="adminInfo.adminMobile" placeholder="请输入手机号码"></el-input>
          </el-form-item>
          <el-form-item label="验证码" :rules="{ required: true}">
            <el-input class="code-input" v-model="adminInfo.smsCode" placeholder="请输入短信验证码"></el-input>
            <el-button class="verification-code" :disabled="!codeStatus" @click="getCode">{{codeStatus? '获取验证码' : `${codeTime}秒后获取`}}</el-button>
              <div v-if="errorWarning.smsCodeError" class="error-warning">
                <i class="el-icon-warning error-icon-warning"></i>
                <span class="login-error">验证码有误</span>
              </div>
          </el-form-item>
          <el-form-item label="邮箱地址(选填)">
            <el-input v-model="adminInfo.adminEmail" placeholder="请输入邮箱地址" @blur="verifyIdEmail"></el-input>
              <div v-if="errorWarning.adminEmailError" class="error-warning">
                <i class="el-icon-warning error-icon-warning"></i>
                <span class="login-error">邮箱有误</span>
              </div>
          </el-form-item>
          <el-form-item>
            <div class="agreement">
              <el-checkbox v-model="adminInfo.checked">同意《<span style="text-decoration: underline">好快通宝用户协议</span>》</el-checkbox>
            </div>
          </el-form-item>
          <Button :disabled="adminActive" class="next-button" @handleClick="goNext" title="下一步"></Button>
        </el-form>
      </div>
    </div>
      <!-- <loading :loadingShow="loadingShow" ></loading> -->
    <AuthFailedPopUp :showTip="showTip" @confirm="closePopUp"> </AuthFailedPopUp>
    </div>
  </div>
</template>

<script>
import settings from '@/settings'
import Header from '@/components/Header'
import InitializeHeader from '@/components/InitializeHeader'
import AuthFailedPopUp from '@/components/AuthFailedPopUp'
import { Removeitem, Setitem, Getitem } from '@/services/CommonService'
export default {
  name: 'admininfo',
  components: { Header, InitializeHeader, AuthFailedPopUp },
  data () {
    return {
      // 步骤
      stepInfo: {
        list: ['管理员认证', '企业认证', '账号初始化', '初始化完成'],
        step: 1
      },
      next: false,
      loadingShow: false,
      // 管理员信息
      adminInfo: {
        adminName: '',
        adminIdNumber: '',
        adminMobile: '',
        smsCode: '',
        adminEmail: '',
        checked: false
      },
      // 错误提示
      errorWarning: {
        adminIdNumberError: false,
        adminMobileeError: false,
        adminMobileeFormatError: false,
        smsCodeError: false,
        adminEmailError: false,
        adminNameError: false
      },
      // 验证码状态
      codeStatus: true,
      // 验证码获取间隔
      codeTime: 60,
      // 短信验证码
      adminSmsCodeUrl: settings.apiGateway.registerSmsCode,
      // 管理员信息初始化 Url
      adminInfoUrl: settings.apiGateway.adminInfo,
      // 获取电话号码
      getEnterpriseUrl: settings.apiGateway.getEnterprise,
      // 验证个人信息是否匹配
      authUserUrl: settings.apiGateway.authUser,
      // 是否显示企业认证失败弹窗
      showTip: false
    }
  },
  beforeRouteEnter (to, from, next) {
    let perfectState = parseInt(Getitem('perfectState'))
    next(vm => {
      // 通过 `vm` 访问组件实例
      if (perfectState < 4) {
        let nextPath = vm.$store.state.initializationStepRoute[perfectState - 1]
        vm.$router.push(nextPath)
      } else {
        vm.$router.push(from.fullPath)
      }
    })
  },
  beforeRouteLeave (to, from, next) {
    if (to.path === '/enterprise-info') {
      next()
    } else if (to.path === '/login') {
      Removeitem('token')
      Removeitem('userData')
      Removeitem('perfectState')
      Removeitem('topName')
      Removeitem('enterpriseName')
      // 移除本地存储中是否显示浏览器版本的提示
      Removeitem('browserLowTip')
      Removeitem('store')
      sessionStorage.removeItem('browserLowTip')
      next()
    } else {
      let perfectState = parseInt(Getitem('perfectState'))
      if (perfectState > 3) {
        next()
      } else {
        next(false)
      }
    }
  },
  created () {
    this.getAdminMobileInfo()
  },
  methods: {
    // 获取电话号
    getAdminMobileInfo () {
      this.fetch(this.getEnterpriseUrl).then(data => {
        this.adminInfo.adminMobile = data.data.adminMobile
      }).catch(data => {
        this.$message({
          type: 'error',
          message: data.data.msg
        })
      })
    },
    // 验证身份证号码
    verifyIdNum () {
      let idCard = this.IDReg
      if (!idCard.test(this.adminInfo.adminIdNumber)) {
        this.errorWarning.adminIdNumberError = true
        return true
      } else {
        this.errorWarning.adminIdNumberError = false
      }
    },
    // 检测管理员姓名
    verifyAdminName () {
      let NameReg = /^[\u4E00-\u9FA5]{2,20}$/
      if (!NameReg.test(this.adminInfo.adminName)) {
        this.errorWarning.adminNameError = true
        return true
      } else {
        this.errorWarning.adminNameError = false
      }
    },
    // 校验邮箱
    verifyIdEmail () {
      let EmailReg = /^[a-zA-Z0-9_-]+@([a-zA-Z0-9]+\.)+(com|cn|net|org)$/
      if (this.adminInfo.adminEmail && !EmailReg.test(this.adminInfo.adminEmail)) {
        this.errorWarning.adminEmailError = true
        // setTimeout(() => {
        //   this.errorWarning.adminEmailError = false
        // }, 2000)
        return true
      } else {
        this.errorWarning.adminEmailError = false
      }
    },
    // 请求验证码借口
    getCode () {
      this.codeCountDown()
      this.fetch(`${this.adminSmsCodeUrl}`, 'post', {
        mobile: this.adminInfo.adminMobile,
        type: 'ValidMobile'
      }).then(data => {
        this.$message({
          type: 'success',
          message: '发送成功，请注意查收！'
        })
      }).catch(data => {
        this.$message.error(data.data.msg)
        // if (data.data.code === 516) {
        //   this.errorWarning.adminMobileeError = true
        //   this.errorWarning.adminMobileeFormatError = false
        //   setTimeout(() => {
        //     this.errorWarning.adminMobileeError = false
        //   }, 2000)
        // }
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
    // 下一步按钮
    goNext () {
      if (this.verifyAdminName() || this.verifyIdNum() || this.verifyIdEmail()) return
      this.fetch(this.authUserUrl, 'post', {
        realName: this.adminInfo.adminName,
        idNumber: this.adminInfo.adminIdNumber,
        userName: this.adminInfo.adminMobile
      }).then(data => {
        // 成功的状态
        // this.next = true
        this.loadingShow = true
        let adminInfo = {
          relaName: this.adminInfo.adminName,
          idNumber: this.adminInfo.adminIdNumber,
          userName: this.adminInfo.adminMobile,
          checked: this.adminInfo.checked,
          smsCode: this.adminInfo.smsCode,
          email: this.adminInfo.adminEmail
        }
        this.fetch(this.adminInfoUrl, 'post', adminInfo).then(data => {
          Setitem('perfectState', 2)
          this.$router.push('/enterprise-info')
        }).catch(res => {
          if (res.data.code === 2013) {
            this.errorWarning.smsCodeError = true
            setTimeout(() => {
              this.errorWarning.smsCodeError = false
            }, 2000)
          } else if (res.data.code === 1002) {
            this.errorWarning.adminIdNumberError = true
            setTimeout(() => {
              this.errorWarning.adminIdNumberError = false
            }, 2000)
          } else if (res.data.code === 4003) {
            this.showTip = true
          } else {
            this.$message.error(res.data.msg)
          }
        })
      }).catch(res => {
        if (res.data.code === -1) {
          this.showTip = true
        } else if (res.data.code === 2013) {
          this.errorWarning.smsCodeError = true
          setTimeout(() => {
            this.errorWarning.smsCodeError = false
          }, 2000)
        } else if (res.data.code === 1002) {
          this.errorWarning.adminIdNumberError = true
          setTimeout(() => {
            this.errorWarning.adminIdNumberError = false
          }, 2000)
        } else {
          this.$message.error(res.data.msg)
        }
      })
    },
    closePopUp () {
      this.showTip = false
    }
  },
  computed: {
    adminActive () {
      // 判断必填项是否为空并且符合输入规则才可以发送请求
      if (this.adminInfo.adminName && this.adminInfo.adminIdNumber && this.adminInfo.adminMobile && this.adminInfo.smsCode && this.adminInfo.checked) {
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
.admin-info-main {
  width: 700px;
  margin: 0 auto;
  .content {
    .admin-form {
      width: 525px;
      margin: 0 auto;
    }
    .code-input {
      width: 287px;
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
      width: 400px;
      height: 45px;
      font-size: 18px;
      margin-left: 125px;
      border: none;
      box-shadow: 1px 6px 4px @btn-disabled;
      box-shadow: 1px 6px 4px var(--mainTableHover);
    }
    .error-warning {
      position: absolute;
      left: 8rem;
      top: 0;
      width: 228px;
    }
    .login-error {
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
    .agreement {
      float: left;
      cursor: pointer;
    }
  }
}
.wait-next {
  width: 200px;
  height: 30px;
  text-align: center;
  line-height: 30px;
  margin: -23px 0 10px 213px;
  color: @theme-blue;
  color: var(--mainColor);;
  border: 1px solid var @theme-blue;
  border: 1px solid var(--mainColor);
  background-color: @theme-blue-light;
  background-color: var(--mainLightColor);
}
.loading{
  width: 570px;
  height: 300px;
  margin-right:50px
}
</style>

<style lang="less">
.admin-info-main .el-input__inner {
  height: 45px;
  line-height: 14px;
  padding-top: 12px;
  padding-bottom: 12px;
  // line-height: 45px;
}
</style>
